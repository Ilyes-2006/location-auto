import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import TopBar from '../../components/layout/TopBar';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { useLanguage } from '../../context/LanguageContext';

export default function UserNotifications() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const data = await notificationService.getUserNotifications(user.id);
      setNotifications(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.is_read;
    return true;
  });

  const markAllRead = async () => {
    if (!user) return;
    await notificationService.markAllAsRead(user.id);
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const markAsRead = async (id) => {
    await notificationService.markAsRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return t('justNow');
    if (diffMins < 60) return t('minutesAgo', { n: diffMins });
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return t('hoursAgo', { n: diffHours });
    const diffDays = Math.floor(diffHours / 24);
    return t('daysAgo', { n: diffDays });
  };

  return (
    <PageTransition>
      <TopBar title={t('notifications')} subtitle={t('notificationsSubtitle')} />

      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Header/Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-primary-100 dark:bg-primary-800 p-1 rounded-xl">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'all' ? 'bg-white dark:bg-primary-700 text-primary-900 dark:text-white shadow-sm' : 'text-primary-500 hover:text-primary-700'}`}
            >
              {t('all')}
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === 'unread' ? 'bg-white dark:bg-primary-700 text-primary-900 dark:text-white shadow-sm' : 'text-primary-500 hover:text-primary-700'}`}
            >
              {t('unread')}
            </button>
          </div>

          <button 
            onClick={markAllRead}
            className="text-xs font-bold text-teal hover:underline"
          >
            {t('markAllRead')}
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-primary-400">
            <div className="w-10 h-10 border-4 border-teal/20 border-t-teal rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">{t('loadingNotifications')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((n) => (
                <motion.div
                  key={n.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => !n.is_read && markAsRead(n.id)}
                  className={`section-card dark:bg-primary-900 dark:border-primary-800/50 p-5 flex gap-4 items-start hover:shadow-lifted transition-all duration-300 relative group cursor-pointer ${!n.is_read ? 'border-l-4 border-l-teal bg-teal/5 dark:bg-teal/10' : ''}`}
                >
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    n.type === 'success' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 
                    n.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                    n.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' :
                    'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                  }`}>
                    {n.type === 'success' ? <CheckCircle size={18} /> : 
                     n.type === 'warning' || n.type === 'error' ? <AlertTriangle size={18} /> : 
                     <Info size={18} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-primary-900 dark:text-white text-sm">{n.title}</h3>
                      <span className="text-[10px] text-primary-400 font-medium flex items-center gap-1 shrink-0">
                        <Clock size={10} /> {getTimeAgo(n.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-primary-600 dark:text-primary-300 leading-relaxed">{n.message}</p>
                  </div>

                  {!n.is_read && (
                    <div className="w-2 h-2 bg-teal rounded-full shrink-0 mt-2" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {filtered.length === 0 && (
              <div className="py-20 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-800 rounded-full flex items-center justify-center text-primary-300 dark:text-primary-600 mb-4">
                  <Bell size={32} />
                </div>
                <h3 className="text-lg font-bold text-primary-900 dark:text-white">{t('allCaughtUp')}</h3>
                <p className="text-sm text-primary-500 dark:text-primary-400">{t('noNotifications')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
