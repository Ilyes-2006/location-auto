import { supabase } from '../supabaseClient';

export const userService = {
  /**
   * Fetch all users (profiles + auth email) for admin view
   */
  async getAllUsers() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error.message);
      return [];
    }
  },

  /**
   * Get user rental stats (count + total spent)
   */
  async getUserRentalStats(userId) {
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('total_price')
        .eq('user_id', userId);

      if (error) throw error;

      const count = data?.length || 0;
      const totalSpent = data?.reduce((sum, r) => sum + (Number(r.total_price) || 0), 0) || 0;
      return { count, totalSpent };
    } catch (error) {
      console.error('Error fetching user rental stats:', error.message);
      return { count: 0, totalSpent: 0 };
    }
  },

  /**
   * Update a user's profile
   */
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }
  },

  /**
   * Get a single profile by ID
   */
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error.message);
      return null;
    }
  }
};
