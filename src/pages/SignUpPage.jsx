import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, UserPlus, Car, AlertCircle, ArrowLeft, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from '../components/ui/PageTransition';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const { signUp, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('passwordsMismatch'));
      return;
    }
    
    setIsSigningUp(true);
    try {
      const { data, error: signUpError } = await signUp(email, password, { 
        full_name: name,
        phone: phone 
      });
      
      if (signUpError) {
        setError(signUpError.message);
        setIsSigningUp(false);
        return;
      }

      if (!data?.session) {
        // Confirmation required
        navigate('/login', { 
          state: { 
            message: t('signupSuccess')
          } 
        });
      } else {
        navigate('/client/catalog');
      }
    } catch (err) {
      setError(t('signupError'));
      setIsSigningUp(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-teal/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-info/5 rounded-full blur-[100px]" />
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
            <p className="text-primary-500 mt-2">{t('createClientAccount')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="glass-panel p-8 shadow-modal"
          >
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 text-xs text-primary-500 hover:text-teal transition-colors mb-6"
            >
              <ArrowLeft size={14} /> {t('backToLogin')}
            </button>

            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary-700 uppercase tracking-caps ml-1">{t('fullName')}</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                  <input
                    type="text"
                    required
                    placeholder="Jean Dupont"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10 w-full"
                    disabled={authLoading || isSigningUp}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
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
                    disabled={authLoading || isSigningUp}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary-700 uppercase tracking-caps ml-1">{t('phone')}</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                  <input
                    type="tel"
                    placeholder="+213 5XX XX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field pl-10 w-full"
                    disabled={authLoading || isSigningUp}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary-700 uppercase tracking-caps ml-1">{t('password')}</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10 w-full"
                    disabled={authLoading || isSigningUp}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-primary-700 uppercase tracking-caps ml-1">{t('confirmPassword')}</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pl-10 w-full"
                    disabled={authLoading || isSigningUp}
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={authLoading || isSigningUp}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 font-bold shadow-lifted"
                >
                  {isSigningUp ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <UserPlus size={20} />
                      {t('signUp')}
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-primary-100 text-center">
              <p className="text-sm text-primary-500">
                {t('alreadyHaveAccount')}{' '}
                <button 
                  onClick={() => navigate('/login')}
                  className="text-teal font-bold hover:underline"
                >
                  {t('signIn')}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
