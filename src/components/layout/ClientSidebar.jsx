import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../ui/Logo';
import { LogIn, UserPlus, Zap } from 'lucide-react';
import { clientNavItems } from '../../data/navItems';
import SignOutButton from '../ui/SignOutButton';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

const sidebarVariants = {
  hidden: { x: -80, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const linkVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: (i) => ({ x: 0, opacity: 1, transition: { delay: i * 0.07 + 0.2, duration: 0.3 } }),
};

export default function ClientSidebar() {
  const { user, isSuperuser } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      className="w-60 min-h-screen bg-primary-900 flex flex-col shrink-0 shadow-modal"
    >
      {/* Brand */}
      <div className="px-6 pt-7 pb-6 border-b border-white/5">
        <Logo subtitle={t('clientPortal')} />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {clientNavItems.map(({ path, label, icon: Icon }, i) => (
          <motion.div key={path} custom={i} variants={linkVariants} initial="hidden" animate="visible">
            <NavLink
              to={path}
              end={path === '/client'}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={17} />
              <span>{t(label.toLowerCase().replace('my ', ''))}</span>
            </NavLink>
          </motion.div>
        ))}
        {isSuperuser && (
          <motion.div custom={clientNavItems.length} variants={linkVariants} initial="hidden" animate="visible">
            <NavLink
              to="/admin"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <Zap size={17} />
              <span>Admin Panel</span>
            </NavLink>
          </motion.div>
        )}
      </nav>

      {/* Client footer / Guest footer */}
      <div className="px-4 py-4 border-t border-primary-800">
        {!user ? (
          <div className="space-y-2">
            <button 
              onClick={() => navigate('/login')}
              className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-2"
            >
              <LogIn size={14} /> Se connecter
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="w-full py-2 text-xs text-primary-400 hover:text-white transition-colors font-medium flex items-center justify-center gap-2"
            >
              <UserPlus size={14} /> S'inscrire
            </button>
          </div>
        ) : (
          <>
            <NavLink 
              to="/client/profile"
              className={({ isActive }) => 
                `flex items-center gap-3 mb-3 p-2 rounded-xl transition-all ${isActive ? 'bg-primary-800/50 ring-1 ring-primary-700' : 'hover:bg-primary-800/30'}`
              }
            >
              <div className="w-8 h-8 rounded-full bg-info-dark border border-info flex items-center justify-center text-white text-xs font-bold uppercase">
                {user.email.substring(0, 2)}
              </div>
              <div className="overflow-hidden">
                <p className="text-white text-xs font-semibold truncate">{user.email}</p>
                <p className="text-primary-500 text-[11px] uppercase">{isSuperuser ? 'Superuser' : 'Client'}</p>
              </div>
            </NavLink>
            <SignOutButton />
          </>
        )}
      </div>
    </motion.aside>
  );
}
