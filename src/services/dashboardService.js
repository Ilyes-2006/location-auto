import { supabase } from '../supabaseClient';

export const dashboardService = {
  async getMetrics() {
    try {
      // 1. Total Revenue (sum of total_price from valid rentals)
      const { data: revenueData, error: revenueError } = await supabase
        .from('rentals')
        .select('total_price')
        .in('rental_status', ['CONFIRMED', 'COMPLETED']);
      
      if (revenueError) throw revenueError;
      const totalRevenueValue = revenueData.reduce((sum, r) => sum + (Number(r.total_price) || 0), 0);

      // 2. Active Bookings
      const { count: activeCount, error: activeError } = await supabase
        .from('rentals')
        .select('*', { count: 'exact', head: true })
        .eq('rental_status', 'ACTIVE');
      
      if (activeError) throw activeError;

      // 3. Maintenance Alerts (dummy for now, or based on status)
      const { count: maintenanceCount, error: maintenanceError } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'MAINTENANCE');
      
      if (maintenanceError) throw maintenanceError;

      // 4. Total Fleet Size
      const { count: totalFleet, error: fleetError } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true });
      
      if (fleetError) throw fleetError;

      const utilizationRateValue = totalFleet > 0 ? Math.round(((totalFleet - (totalFleet - activeCount)) / totalFleet) * 100) : 0;

      return {
        totalRevenue: { label: 'Total Revenue', value: `€${totalRevenueValue.toLocaleString()}`, sub: 'Lifetime earnings', change: '+12%', positive: true },
        activeBookings: { label: 'Active Bookings', value: activeCount.toString(), sub: 'Currently in use', change: '+3', positive: true },
        maintenanceAlerts: { label: 'Maintenance', value: maintenanceCount.toString(), sub: 'Requiring attention', change: '-1', positive: true },
        utilizationRate: { label: 'Utilization', value: `${utilizationRateValue}%`, sub: 'Fleet efficiency', change: '+5%', positive: true }
      };
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error.message);
      return null;
    }
  },

  async getRecentActivity() {
    try {
      const { data: rentals, error } = await supabase
        .from('rentals')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
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
          id: r.id,
          title: `New Rental: ${vehicle?.brand || 'Unknown'} ${vehicle?.model || 'Vehicle'}`,
          time: new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sub: `Customer: ${user?.full_name || 'Anonymous'}`,
          icon: 'calendar'
        };
      });
    } catch (error) {
      console.error('Error fetching recent activity:', error.message);
      return [];
    }
  }
};
