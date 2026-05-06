import { supabase } from '../supabaseClient';

export const reservationService = {
  /**
   * Fetch reservations for a specific user
   */
  async getUserReservations(userId) {
    try {
      const { data: rentals, error } = await supabase
        .from('rentals')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const vehicleIds = [...new Set((rentals || []).map(r => r.vehicle_id).filter(Boolean))];
      let vehicles = [];
      if (vehicleIds.length > 0) {
        const { data: vData } = await supabase.from('vehicles').select('*').in('id', vehicleIds);
        if (vData) vehicles = vData;
      }
      
      return (rentals || []).map(r => {
        const vehicle = vehicles.find(v => v.id === r.vehicle_id);
        return {
          ...r,
          id: r.id,
          vehicle: vehicle,
          vehicleName: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Unknown Vehicle',
          totalPrice: r.total_price,
          status: r.rental_status,
          date: new Date(r.created_at).toLocaleDateString()
        };
      });
    } catch (error) {
      console.error('Error fetching user reservations:', error.message);
      return [];
    }
  },

  /**
   * Create a new reservation (defaults to PENDING)
   */
  async createReservation(rentalData) {
    try {
      const { data, error } = await supabase
        .from('rentals')
        .insert([{
          user_id: rentalData.userId,
          vehicle_id: rentalData.vehicleId,
          start_date: rentalData.startDate,
          end_date: rentalData.endDate,
          total_price: rentalData.totalPrice,
          rental_status: 'PENDING',
          license_url: rentalData.licenseUrl
        }])
        .select();

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('No data returned from reservation creation.');
      
      return data[0];
    } catch (error) {
      console.error('Supabase Error (Create Rental):', error.message);
      throw error;
    }
  },

  /**
   * Check if a vehicle is available for the given dates
   */
  async checkVehicleAvailability(vehicleId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('id, start_date, end_date')
        .eq('vehicle_id', vehicleId)
        .in('rental_status', ['PENDING', 'CONFIRMED', 'ACTIVE'])
        .lte('start_date', endDate)
        .gte('end_date', startDate);

      if (error) throw error;

      // If data length is > 0, there is an overlap
      return data.length === 0;
    } catch (error) {
      console.error('Error checking vehicle availability:', error.message);
      throw error;
    }
  },

  /**
   * Update reservation status (admin action)
   */
  async updateReservationStatus(reservationId, newStatus) {
    try {
      const { data, error } = await supabase
        .from('rentals')
        .update({ rental_status: newStatus })
        .eq('id', reservationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating reservation status:', error.message);
      throw error;
    }
  },

  /**
   * Delete reservation (admin action on cancel)
   */
  async deleteReservation(reservationId) {
    try {
      const { error } = await supabase
        .from('rentals')
        .delete()
        .eq('id', reservationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting reservation:', error.message);
      throw error;
    }
  },

  /**
   * Fetch all reservations for admin dashboard
   */
  async getAllReservations() {
    try {
      const { data: rentals, error } = await supabase
        .from('rentals')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch vehicles separately
      const vehicleIds = [...new Set((rentals || []).map(r => r.vehicle_id).filter(Boolean))];
      let vehicles = [];
      if (vehicleIds.length > 0) {
        const { data: vData } = await supabase.from('vehicles').select('*').in('id', vehicleIds);
        if (vData) vehicles = vData;
      }
      
      // Fetch users separately
      const userIds = [...new Set((rentals || []).map(r => r.user_id).filter(Boolean))];
      let users = [];
      if (userIds.length > 0) {
        const { data: uData } = await supabase.from('profiles').select('*').in('id', userIds);
        if (uData) users = uData;
      }
      
      return (rentals || []).map(r => {
        const vehicle = vehicles.find(v => v.id === r.vehicle_id);
        const user = users.find(u => u.id === r.user_id);
        
        return {
          ...r,
          id: r.id,
          customerName: user?.full_name || 'Unknown',
          customerPhone: user?.phone || '—',
          vehicle: vehicle,
          vehicleName: vehicle ? `${vehicle.brand} ${vehicle.model}` : 'N/A',
          vehicleCategory: vehicle?.category || 'Standard',
          status: r.rental_status,
          totalPrice: r.total_price,
          date: new Date(r.created_at).toLocaleDateString()
        };
      });
    } catch (error) {
      console.error('Error fetching all reservations:', error.message);
      return [];
    }
  }
};
