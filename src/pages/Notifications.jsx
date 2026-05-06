import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, AlertTriangle, CheckCircle, Clock, X } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import TopBar from '../components/layout/TopBar';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';
import { useLanguage } from '../context/LanguageContext';

export default function Notifications() {
  const { t } = useLanguage();
  const { user, isSuperuser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      // Admin sees all notifications, but for admin's own page we show all
      const data = isSuperuser
        ? await notificationService.getAllNotifications()
        : await notificationService.getUserNotifications(user.id);
      setNotifications(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const markAllRead = async () => {
    if (!user) return;
    await notificationService.markAllAsRead(user.id);
    setNotifications(notifications.map(n => ({ ...n, is_read: true })));
  };

  const iconMap = {
    success: { Icon: CheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-500', border: '#10b981' },
    warning: { Icon: AlertTriangle, bg: 'bg-amber-50', text: 'text-amber-500', border: '#f59e0b' },
    error: { Icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-500', border: '#ef4444' },
    info: { Icon: Info, bg: 'bg-blue-50', text: 'text-blue-500', border: '#3b82f6' },
  };

  return (
    <PageTransition>
      <TopBar title={t('notifications')} subtitle={t('stayInformed')} />
      
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-primary-900 flex items-center gap-2">
            <Bell size={20} className="text-teal" />
            {t('allNotifications')}
          </h2>
          <button onClick={markAllRead} className="text-xs text-teal font-semibold hover:underline">
            {t('markAllRead')}
          </button>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-primary-400">
            <div className="w-10 h-10 border-4 border-teal/20 border-t-teal rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">{t('loadingNotifications')}</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-300 mb-4">
               <Bell size={32} />
            </div>
            <h3 className="text-lg font-bold text-primary-900">{t('noNotifications')}</h3>
            <p className="text-sm text-primary-500">{t('noNotificationsNow')}</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {notifications.map((notif, i) => {
              const style = iconMap[notif.type] || iconMap.info;
              const Icon = style.Icon;
              const timeAgo = getTimeAgo(notif.created_at, t);
              
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass-panel p-5 flex gap-4 items-start hover:shadow-lifted transition-all duration-300 border-l-4 ${!notif.is_read ? 'bg-teal/5' : ''}`}
                  style={{ borderLeftColor: style.border }}
                >
                  <div className={`p-2 rounded-lg shrink-0 ${style.bg} ${style.text}`}>
                    <Icon size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-primary-900 leading-tight">{notif.title}</h3>
                      <span className="text-[10px] text-primary-400 flex items-center gap-1">
                        <Clock size={10} /> {timeAgo}
                      </span>
                    </div>
                    <p className="text-sm text-primary-600 mt-1">{notif.message}</p>
                    {notif.user?.full_name && (
                      <p className="text-[11px] text-primary-400 mt-1">{t('user')}: {notif.user.full_name}</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
}

function getTimeAgo(dateString, t) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return t('justNow');
  if (diffMins < 60) return t('agoMin', { count: diffMins });
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return t('agoHour', { count: diffHours });
  const diffDays = Math.floor(diffHours / 24);
  return t('agoDay', { count: diffDays });
}
