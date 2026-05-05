import { supabase } from '../supabaseClient';

export const notificationService = {
  /**
   * Fetch notifications for a specific user
   */
  async getUserNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      return [];
    }
  },

  /**
   * Fetch all notifications (admin)
   */
  async getAllNotifications() {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*, user:profiles(full_name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching all notifications:', error.message);
      return [];
    }
  },

  /**
   * Mark a notification as read
   */
  async markAsRead(notificationId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
    }
  },

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all as read:', error.message);
    }
  },

  /**
   * Create a notification
   */
  async createNotification({ userId, title, message, type = 'info' }) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert([{ user_id: userId, title, message, type }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating notification:', error.message);
      throw error;
    }
  },

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId) {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Error fetching unread count:', error.message);
      return 0;
    }
  }
};
