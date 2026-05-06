import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, Car, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { signInWithPassword, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state, or default to catalog
  const from = location.state?.from?.pathname || "/client/catalog";
  const message = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    
    try {
      const { data, error: signInError } = await signInWithPassword(email, password);
      
      if (signInError) {
        setError(signInError.message);
        setIsLoggingIn(false);
        return;
      }

      // Redirect based on superuser status
      const isSuperuser = data.user.email === 'i_salahouelhadj@estin.dz';
      
      if (isSuperuser) {
        navigate('/admin');
      } else {
        navigate(from);
      }
    } catch (err) {
      setError(t('unexpectedError'));
      setIsLoggingIn(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-teal/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-info/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-teal text-white flex items-center justify-center shadow-lifted mx-auto mb-4">
              <Car size={32} />
            </div>
            <h1 className="text-3xl font-bold text-primary-900 tracking-tight">Auto-Loc</h1>
            <p className="text-primary-500 mt-2">{t('signInToAccount')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="glass-panel p-8 shadow-modal"
          >
            {message && (
              <div className="mb-6 p-3 bg-info/10 border border-info/20 rounded-lg flex items-center gap-3 text-info-dark text-sm">
                <AlertCircle size={18} />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-primary-700 uppercase tracking-caps ml-1">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                  <input
                    type="email"
                    required
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10 w-full"
                    disabled={authLoading || isLoggingIn}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-primary-700 uppercase tracking-caps">{t('password')}</label>
                  <button type="button" className="text-xs text-teal font-medium hover:underline">{t('forgot')}</button>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 w-full"
                    disabled={authLoading || isLoggingIn}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading || isLoggingIn}
                className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold shadow-lifted"
              >
                {isLoggingIn ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={20} />
                    {t('signIn')}
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-primary-100 text-center">
              <p className="text-sm text-primary-500">
                {t('dontHaveAccount')}{' '}
                <button 
                  onClick={() => navigate('/signup')}
                  className="text-teal font-bold hover:underline"
                >
                  {t('signUp')}
                </button>
              </p>
            </div>
            
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
