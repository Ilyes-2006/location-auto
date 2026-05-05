import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function MetricCard({ label, value, sub, change, positive, icon: Icon, index = 0 }) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="metric-card"
    >
      <div className="flex items-start justify-between gap-2 mb-4">
        <p className="text-[11px] font-semibold text-primary-500 uppercase tracking-caps">{label}</p>
        {Icon && (
          <div className="w-9 h-9 rounded-card bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
            <Icon size={17} />
          </div>
        )}
      </div>

      <p className="text-[32px] font-bold text-primary-900 leading-none mb-1">{value}</p>

      <div className="flex items-center gap-2 mt-2">
        {change && (
          <span className={`text-xs font-semibold ${positive ? 'text-teal' : 'text-red-500'}`}>
            {positive ? '↑' : '↓'} {change}
          </span>
        )}
        {sub && <span className="text-xs text-primary-400">{sub}</span>}
      </div>
    </motion.div>
  );
}
