import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, LogIn, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProtectedRoute({ children, requireSuperuser = false }) {
  const { user, isSuperuser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Show "Not Logged In" message with a login button
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-10 max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto text-primary-400">
            <LogIn size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary-900">Accès restreint</h2>
            <p className="text-primary-500">Veuillez vous connecter pour accéder à cette page.</p>
          </div>
          <Link 
            to="/login" 
            state={{ from: location }}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold"
          >
            <LogIn size={18} />
            Se connecter
          </Link>
        </motion.div>
      </div>
    );
  }

  if (requireSuperuser && !isSuperuser) {
    // Show "Access Denied" message
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-10 max-w-md w-full text-center space-y-6 border-red-100"
        >
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
            <ShieldAlert size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary-900">Accès Refusé</h2>
            <p className="text-primary-500">Vous n'avez pas les permissions nécessaires pour accéder à l'espace administrateur.</p>
          </div>
          <Link 
            to="/client/catalog"
            className="btn-secondary w-full py-3 flex items-center justify-center gap-2 font-bold"
          >
            <ChevronLeft size={18} />
            Retour au catalogue
          </Link>
        </motion.div>
      </div>
    );
  }

  return children;
}
