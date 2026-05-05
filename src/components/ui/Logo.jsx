import { Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Logo({ subtitle = "Fleet Management", className = "" }) {
  return (
    <Link to="/client/catalog" className={`flex items-center gap-2.5 hover:opacity-90 transition-opacity ${className}`}>
      <motion.div 
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.6, ease: "anticipate" }}
        className="w-9 h-9 rounded-card bg-gradient-to-br from-teal to-teal-dark flex items-center justify-center shadow-lifted"
      >
        <Gauge size={18} className="text-white" />
      </motion.div>
      <div className="flex flex-col">
        <span className="text-white font-bold text-lg leading-tight tracking-tight">
          Auto<span className="text-teal">-</span>Loc
        </span>
        <span className="text-primary-400 text-[10px] tracking-[0.1em] uppercase font-medium">
          {subtitle}
        </span>
      </div>
    </Link>
  );
}
