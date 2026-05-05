import { useState } from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export default function SignOutButton() {
  const { signOut } = useAuth();
  const { t } = useLanguage();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSignOut = () => {
    signOut();
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
      >
        <LogOut size={17} />
        <span>{t('signOut')}</span>
      </button>

      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirm(false)}
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white border border-primary-100 rounded-3xl shadow-2xl overflow-hidden p-8"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-6 border border-red-100">
                  <AlertTriangle size={32} />
                </div>
                
                <h3 className="text-2xl font-bold text-primary-900 mb-2">{t('confirmSignOut')}</h3>
                <p className="text-primary-500 text-sm leading-relaxed mb-8">
                  {t('areYouSure')}
                </p>

                <div className="flex w-full gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 btn-secondary py-3"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/20 transition-all active:scale-[0.97]"
                  >
                    {t('signOut')}
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setShowConfirm(false)}
                className="absolute top-4 right-4 p-2 text-primary-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
