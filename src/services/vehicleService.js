import { supabase } from '../supabaseClient';

// Helper to map DB vehicle to UI vehicle format
const mapVehicle = (v) => ({
  ...v,
  id: v.id,
  name: `${v.brand} ${v.model}`,
  dailyRate: v.daily_rate,
  available: v.status === 'AVAILABLE',
  // Use DB columns, with sensible defaults if null
  category: v.category || 'Premium',
  seats: v.seats || 5,
  transmission: v.transmission || 'Automatic',
  imgColor: v.img_color || '#3b82f6',
  // Other UI-only or secondary fields
  range: v.range || 'N/A',
  rating: v.rating || 4.8,
  reviewCount: v.review_count || 10,
  year: v.year || 2024,
  vin: v.license_plate || 'N/A',
  location: v.location || 'Paris CDG',
  fuel: v.fuel || 100,
  mileage: v.mileage || 0,
  lastService: v.created_at ? new Date(v.created_at).toLocaleDateString() : 'N/A'
});

export const vehicleService = {
  /**
   * Fetch all vehicles for the inventory
   */
  async getInventory() {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .order('brand', { ascending: true });
      
      if (error) throw error;
      return (data || []).map(mapVehicle);
    } catch (error) {
      console.error('Supabase Error (Inventory):', error.message);
      return [];
    }
  },

  /**
   * Fetch vehicles for the client catalog (AVAILABLE only)
   */
  async getCatalog() {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('status', 'AVAILABLE');
      
      if (error) throw error;
      return (data || []).map(mapVehicle);
    } catch (error) {
      console.error('Supabase Error (Catalog):', error.message);
      return [];
    }
  },

  /**
   * Add a new vehicle to the inventory
   */
  async addVehicle(vehicleData) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([{
          brand: vehicleData.name.split(' ')[0] || 'Unknown',
          model: vehicleData.name.split(' ').slice(1).join(' ') || 'Model',
          daily_rate: vehicleData.dailyRate,
          license_plate: vehicleData.vin || `LP-${Math.random().toString(36).substring(7)}`,
          status: 'AVAILABLE',
          category: vehicleData.category || 'Premium',
          seats: vehicleData.seats || 5,
          transmission: vehicleData.transmission || 'Automatic',
          img_url: vehicleData.imgUrl || null,
          img_color: vehicleData.color || '#3b82f6',
        }])
        .select();

      if (error) throw error;
      return mapVehicle(data[0]);
    } catch (error) {
      console.error('Error adding vehicle:', error.message);
      throw error;
    }
  },

  /**
   * Update vehicle status or details
   */
  async updateVehicle(id, updates) {
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data[0] ? mapVehicle(data[0]) : null;
    } catch (error) {
      console.error('Error updating vehicle:', error.message);
      throw error;
    }
  }
};
