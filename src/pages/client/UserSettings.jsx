import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Globe, ChevronRight, Check, Shield, 
  Lock, Mail, Phone, Camera, ArrowLeft, Loader2 
} from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import TopBar from '../../components/layout/TopBar';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { supabase } from '../../supabaseClient';

export default function UserSettings() {
  const { lang, setLang, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('Account');
  const [editView, setEditView] = useState(null); // 'profile' | 'password' | null

  const settingsGroups = [
    {
      id: 'Account',
      title: 'Account',
      icon: User,
      items: [
        { id: 'profile', label: 'Profile Information', sub: 'Name, email, and phone', type: 'link', onClick: () => setEditView('profile') },
        { id: 'password', label: 'Security & Password', sub: 'Update your login credentials', type: 'link', onClick: () => setEditView('password') },
      ],
    },
    {
      id: 'Regional',
      title: 'Regional',
      icon: Globe,
      items: [
        { 
          id: 'language',
          label: 'Language', 
          sub: 'Choose your preferred language', 
          type: 'select', 
          options: [
            { val: 'en', label: 'English' },
            { val: 'fr', label: 'Français' }
          ],
          current: lang,
          onSelect: setLang
        },
        { 
          id: 'currency',
          label: 'Currency', 
          sub: 'Choose your preferred currency', 
          type: 'select',
          options: [
            { val: 'EUR', label: 'Euro (€)' },
            { val: 'USD', label: 'USD ($)' },
            { val: 'DZD', label: 'Dinar (DA)' }
          ],
          current: currency,
          onSelect: setCurrency
        },
      ],
    },
  ];

  return (
    <PageTransition>
      <TopBar title={t('settings')} subtitle="Manage your account and preferences." />

      <div className="p-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-1.5 shrink-0">
          {settingsGroups.map((group) => {
            const Icon = group.icon;
            const isActive = activeTab === group.id;
            return (
              <button
                key={group.id}
                onClick={() => {
                  setActiveTab(group.id);
                  setEditView(null);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  isActive 
                    ? 'bg-teal text-white shadow-xl shadow-teal/20' 
                    : 'text-primary-400 dark:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-800/50 hover:text-primary-900 dark:hover:text-white'
                }`}
              >
                <Icon size={18} />
                {group.title}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {!editView ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {settingsGroups.filter(g => g.id === activeTab).map((group) => (
                  <div key={group.id} className="section-card dark:bg-primary-900/50 border-primary-100 dark:border-primary-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-primary-50 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-800/20">
                      <h3 className="text-sm font-black text-primary-900 dark:text-white uppercase tracking-widest">{group.title}</h3>
                    </div>
                    
                    <div className="divide-y divide-primary-50 dark:divide-primary-800">
                      {group.items.map((item) => (
                        <div 
                          key={item.id} 
                          className="p-6 flex items-center justify-between group cursor-pointer hover:bg-primary-50/30 dark:hover:bg-primary-800/20 transition-colors"
                          onClick={item.onClick}
                        >
                          <div>
                            <p className="text-sm font-bold text-primary-800 dark:text-white group-hover:text-teal transition-colors">{item.label}</p>
                            <p className="text-xs text-primary-400 dark:text-primary-500 mt-1">{item.sub}</p>
                          </div>

                          {item.type === 'link' && (
                            <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-800 flex items-center justify-center text-primary-400 dark:text-primary-500 group-hover:text-teal group-hover:bg-teal/10 transition-all">
                              <ChevronRight size={18} />
                            </div>
                          )}
                          
                          {item.type === 'select' && (
                            <div className="flex gap-1.5 p-1 bg-primary-50 dark:bg-primary-800 rounded-xl" onClick={e => e.stopPropagation()}>
                              {item.options.map(opt => (
                                <button
                                  key={opt.val}
                                  onClick={() => item.onSelect(opt.val)}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-caps transition-all ${
                                    item.current === opt.val 
                                      ? 'bg-white dark:bg-primary-700 text-teal dark:text-white shadow-sm' 
                                      : 'text-primary-400 dark:text-primary-500 hover:text-primary-600 dark:hover:text-primary-300'
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : editView === 'profile' ? (
              <ProfileEditForm 
                profile={profile} 
                user={user} 
                onBack={() => setEditView(null)} 
                onSuccess={() => {
                  refreshProfile();
                  setEditView(null);
                }}
              />
            ) : (
              <PasswordChangeForm 
                onBack={() => setEditView(null)} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}

function ProfileEditForm({ profile, user, onBack, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    email: user?.email || '',
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await userService.updateProfile(user.id, {
        full_name: formData.full_name,
        phone: formData.phone
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="section-card dark:bg-primary-900/50 border-primary-100 dark:border-primary-800"
    >
      <div className="px-6 py-4 border-b border-primary-50 dark:border-primary-800 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-primary-50 dark:hover:bg-primary-800 rounded-lg text-primary-400">
          <ArrowLeft size={18} />
        </button>
        <h3 className="text-sm font-black text-primary-900 dark:text-white uppercase tracking-widest">Edit Profile</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-teal/10 border-2 border-dashed border-teal/30 flex items-center justify-center text-teal overflow-hidden">
               {profile?.avatar_url ? (
                 <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User size={32} />
               )}
            </div>
            <button type="button" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-primary-900 hover:scale-110 transition-transform">
              <Camera size={14} />
            </button>
          </div>
          <p className="text-[10px] text-primary-400 mt-2 font-bold uppercase tracking-wider">Change photo</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-primary-500 uppercase tracking-wider flex items-center gap-2">
              <User size={12} /> Full Name
            </label>
            <input
              className="input-field"
              value={formData.full_name}
              onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="John Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-primary-500 uppercase tracking-wider flex items-center gap-2">
              <Phone size={12} /> Phone Number
            </label>
            <input
              className="input-field"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+33 6 12 34 56 78"
            />
          </div>
          <div className="space-y-2 md:col-span-2 opacity-60">
            <label className="text-[11px] font-bold text-primary-500 uppercase tracking-wider flex items-center gap-2">
              <Mail size={12} /> Email Address (Read-only)
            </label>
            <input
              className="input-field bg-primary-50 dark:bg-primary-800 border-none cursor-not-allowed"
              value={formData.email}
              readOnly
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-500 font-bold">{error}</p>}

        <div className="flex justify-end gap-3 pt-6">
          <button type="button" onClick={onBack} className="btn-ghost text-xs">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary min-w-[140px] justify-center gap-2 text-xs py-3">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
            Save Profile
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function PasswordChangeForm({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: formData.newPassword });
      if (error) throw error;
      setSuccess(true);
      setTimeout(onBack, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="section-card dark:bg-primary-900/50 border-primary-100 dark:border-primary-800"
    >
      <div className="px-6 py-4 border-b border-primary-50 dark:border-primary-800 flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-primary-50 dark:hover:bg-primary-800 rounded-lg text-primary-400">
          <ArrowLeft size={18} />
        </button>
        <h3 className="text-sm font-black text-primary-900 dark:text-white uppercase tracking-widest">Update Password</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="p-4 bg-info/5 dark:bg-info/10 rounded-xl border border-info/10 flex items-start gap-3">
          <Shield size={18} className="text-info mt-0.5" />
          <p className="text-xs text-info-dark dark:text-info-light leading-relaxed">
            Changing your password will update your login credentials. Make sure to use a strong password with at least 6 characters.
          </p>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-primary-500 uppercase tracking-wider flex items-center gap-2">
              <Lock size={12} /> New Password
            </label>
            <input
              type="password"
              className="input-field"
              value={formData.newPassword}
              onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-primary-500 uppercase tracking-wider flex items-center gap-2">
              <Lock size={12} /> Confirm New Password
            </label>
            <input
              type="password"
              className="input-field"
              value={formData.confirmPassword}
              onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-500 font-bold">{error}</p>}
        {success && (
          <div className="p-4 bg-success-bg dark:bg-success-text/20 text-success-text dark:text-teal-light rounded-xl flex items-center gap-2 text-xs font-bold">
            <Check size={16} /> Password updated successfully! Redirecting...
          </div>
        )}

        {!success && (
          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={onBack} className="btn-ghost text-xs">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary min-w-[140px] justify-center gap-2 text-xs py-3">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Update Password
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
}
