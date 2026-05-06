import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';
import { adminNavItems } from '../../data/navItems';
import SignOutButton from '../ui/SignOutButton';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';

const sidebarVariants = {
  hidden: { x: -80, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const linkVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.07 + 0.2, duration: 0.3 } }),
};

export default function AdminSidebar() {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  
  const initials = profile?.full_name 
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : user?.email?.[0].toUpperCase() || '??';
  
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="w-60 min-h-screen bg-primary-900 flex flex-col shrink-0 shadow-modal"
    >
      {/* Brand */}
      <div className="px-6 pt-7 pb-6 border-b border-white/5">
        <Logo subtitle={t('fleetManagement')} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {adminNavItems.map(({ path, labelKey, icon: Icon }, i) => (
          <motion.div key={path} custom={i} variants={linkVariants} initial="hidden" animate="visible">
            <NavLink
              to={path}
              end={path === '/admin'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={17} />
              <span>{t(labelKey)}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Admin footer */}
      <div className="px-4 py-4 border-t border-primary-800">
        <NavLink 
          to="/admin/profile"
          className={({ isActive }) => 
            `flex items-center gap-3 mb-3 p-2 rounded-xl transition-all ${isActive ? 'bg-primary-800/50 ring-1 ring-primary-700' : 'hover:bg-primary-800/30'}`
          }
        >
          <div className="w-8 h-8 rounded-full bg-teal/20 border border-teal/30 flex items-center justify-center text-teal text-xs font-bold">
            {initials}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-white text-xs font-semibold truncate">{displayName}</p>
            <p className="text-primary-500 text-[11px] truncate">{user?.email}</p>
          </div>
        </NavLink>
        <SignOutButton />
      </div>
    </motion.aside>
  );
}
