import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Car, Wrench, BarChart3,
  CheckCircle, Calendar, User, AlertTriangle,
} from 'lucide-react';
import MetricCard from '../components/ui/MetricCard';
import PageTransition from '../components/ui/PageTransition';
import TopBar from '../components/layout/TopBar';
import { dashboardService } from '../services/dashboardService';
import { useLanguage } from '../context/LanguageContext';

const metricConfig = [
  { key: 'totalRevenue',     icon: TrendingUp },
  { key: 'activeBookings',   icon: Car },
  { key: 'maintenanceAlerts', icon: Wrench },
  { key: 'utilizationRate',  icon: BarChart3 },
];

const iconMap = {
  check:    { Icon: CheckCircle, color: 'text-teal' },
  calendar: { Icon: Calendar, color: 'text-info' },
  wrench:   { Icon: Wrench,   color: 'text-amber-500' },
  user:     { Icon: User,     color: 'text-info' },
  alert:    { Icon: AlertTriangle, color: 'text-red-500' },
};

export default function Dashboard() {
  const { t } = useLanguage();
  const [metrics, setMetrics] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [m, a] = await Promise.all([
        dashboardService.getMetrics(),
        dashboardService.getRecentActivity()
      ]);
      if (m) setMetrics(m);
      setActivity(a);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <PageTransition>
        <TopBar title={t('overview')} subtitle={t('realTimeMetrics')} />
        <div className="p-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-teal/20 border-t-teal rounded-full animate-spin" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <TopBar title={t('overview')} subtitle={t('realTimeMetrics')} />

      <div className="p-6 space-y-6 max-w-[1440px] mx-auto">
        {/* Metrics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {metricConfig.map(({ key, icon }, i) => {
            const m = metrics?.[key] || { label: key, value: '0', sub: 'No data', change: '0%', positive: true };
            return (
              <MetricCard
                key={key}
                index={i}
                label={t(key)}
                value={m.value}
                sub={m.sub}
                change={m.change}
                positive={m.positive}
                icon={icon}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Utilization chart - Simplified for real data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="section-card p-6 xl:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-semibold text-primary-900">{t('systemCapacity')}</h3>
                <p className="text-xs text-primary-400 mt-0.5">{t('liveFleetOverview')}</p>
              </div>
              <span className="chip chip-available">{t('live')}</span>
            </div>

            <div className="h-40 flex items-center justify-center bg-primary-50/50 rounded-2xl border border-dashed border-primary-200">
               <div className="text-center">
                 <div className="text-4xl font-black text-primary-900">{metrics?.utilizationRate.value}</div>
                 <div className="text-xs text-primary-400 uppercase tracking-widest font-bold mt-1">{t('fleetEfficiency')}</div>
               </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="section-card p-6"
          >
             <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-primary-900">{t('recentActivity')}</h3>
              <button className="text-xs text-teal font-medium hover:underline">{t('viewAll')}</button>
            </div>

            <div className="space-y-4">
              {activity.map((act) => {
                const { Icon, color } = iconMap[act.icon] ?? iconMap.check;
                return (
                  <div key={act.id} className="flex items-start gap-3">
                    <div className={`mt-0.5 shrink-0 ${color}`}>
                      <Icon size={15} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-primary-800 font-medium leading-snug truncate">{act.title}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-primary-400">{act.time}</span>
                        <span className="text-primary-300">•</span>
                        <span className="text-[11px] text-primary-500 truncate">{act.sub}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
               {activity.length === 0 && (
                <div className="py-10 text-center text-primary-400 text-xs">
                  {t('noRecentActivity')}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
