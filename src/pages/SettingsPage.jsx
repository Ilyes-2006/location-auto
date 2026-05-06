import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, User, Shield, Globe, 
  ChevronRight, Check, ArrowLeft, Mail, Phone, 
  Camera, Lock, Loader2, AlertCircle 
} from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import TopBar from '../components/layout/TopBar';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { supabase } from '../supabaseClient';

export default function SettingsPage() {
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
        { id: 'profile', label: 'Profile Information', sub: 'Name, email, and contact info', type: 'link', onClick: () => setEditView('profile') },
        { id: 'password', label: 'Change Password', sub: 'Update your administrative credentials', type: 'link', onClick: () => setEditView('password') },
      ],
    },
    {
      id: 'Security',
      title: 'Security',
      icon: Shield,
      items: [
        { label: 'Two-Factor Authentication', sub: 'Enhance system security', type: 'toggle', default: true },
        { label: 'Audit Log', sub: 'View administrative action history', type: 'link' },
      ],
    },
    {
      id: 'Regional',
      title: 'Regional',
      icon: Globe,
      items: [
        { 
          label: 'System Language', 
          sub: 'Choose your preferred language', 
          type: 'select', 
          options: [{ val: 'en', label: 'EN' }, { val: 'fr', label: 'FR' }],
          current: lang,
          onSelect: setLang
        },
        { 
          label: 'Default Currency', 
          sub: 'Standard currency for financial data', 
          type: 'select',
          options: [{ val: 'EUR', label: 'EUR' }, { val: 'USD', label: 'USD' }],
          current: currency,
          onSelect: setCurrency
        },
      ],
    },
  ];

  return (
    <PageTransition>
      <TopBar title={t('settings')} subtitle="Manage your account, security, and regional preferences." />

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
                    ? 'bg-primary-900 dark:bg-white text-white dark:text-primary-900 shadow-xl' 
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
                      <h3 className="text-xs font-black text-primary-900 dark:text-white uppercase tracking-widest">{group.title}</h3>
                    </div>
                    
                    <div className="divide-y divide-primary-50 dark:divide-primary-800">
                      {group.items.map((item, i) => (
                        <div 
                          key={i} 
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

                          {item.type === 'toggle' && (
                            <div className={`w-10 h-5 rounded-full p-1 transition-all ${item.default ? 'bg-teal' : 'bg-primary-200'}`}>
                              <div className={`w-3 h-3 bg-white rounded-full transition-all ${item.default ? 'translate-x-5' : 'translate-x-0'}`} />
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
              <AdminProfileEdit 
                profile={profile} 
                user={user} 
                onBack={() => setEditView(null)} 
                onSuccess={() => {
                  refreshProfile();
                  setEditView(null);
                }}
              />
            ) : (
              <AdminPasswordChange 
                onBack={() => setEditView(null)} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}

function AdminProfileEdit({ profile, user, onBack, onSuccess }) {
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
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="section-card dark:bg-primary-900/50 border-primary-100 dark:border-primary-800"
    >
      <div className="px-6 py-4 border-b border-primary-50 dark:border-primary-800 flex items-center gap-4 bg-primary-50/20">
        <button onClick={onBack} className="p-2 hover:bg-primary-50 dark:hover:bg-primary-800 rounded-lg text-primary-400">
          <ArrowLeft size={18} />
        </button>
        <h3 className="text-xs font-black text-primary-900 dark:text-white uppercase tracking-widest">Admin Profile</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-primary-900 border-4 border-white dark:border-primary-800 shadow-card flex items-center justify-center text-white overflow-hidden">
               {profile?.avatar_url ? (
                 <img src={profile.avatar_url} alt="Admin" className="w-full h-full object-cover" />
               ) : (
                 <User size={32} />
               )}
            </div>
            <button type="button" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-primary-900 hover:scale-110 transition-transform">
              <Camera size={14} />
            </button>
          </div>
          <p className="text-[10px] text-primary-400 mt-3 font-black uppercase tracking-widest">System Superuser</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest flex items-center gap-2"><User size={12} /> Name</label>
            <input className="input-field" value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest flex items-center gap-2"><Phone size={12} /> Phone</label>
            <input className="input-field" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
          </div>
          <div className="space-y-2 md:col-span-2 opacity-50">
            <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest flex items-center gap-2"><Mail size={12} /> Admin Email</label>
            <input className="input-field bg-primary-50 dark:bg-primary-800 border-none cursor-not-allowed" value={formData.email} readOnly />
          </div>
        </div>

        {error && <p className="text-xs text-red-500 font-bold flex items-center gap-2"><AlertCircle size={14}/> {error}</p>}

        <div className="flex justify-end gap-3 pt-6">
          <button type="button" onClick={onBack} className="btn-ghost text-xs">Cancel</button>
          <button type="submit" disabled={loading} className="btn-primary min-w-[140px] justify-center gap-2 text-xs py-3">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function AdminPasswordChange({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.newPassword !== formData.confirmPassword) { setError("Passwords do not match"); return; }
    if (formData.newPassword.length < 8) { setError("Admin password must be at least 8 characters"); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: formData.newPassword });
      if (error) throw error;
      setSuccess(true);
      setTimeout(onBack, 2000);
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
      className="section-card dark:bg-primary-900/50 border-primary-100 dark:border-primary-800"
    >
      <div className="px-6 py-4 border-b border-primary-50 dark:border-primary-800 flex items-center gap-4 bg-primary-50/20">
        <button onClick={onBack} className="p-2 hover:bg-primary-50 dark:hover:bg-primary-800 rounded-lg text-primary-400">
          <ArrowLeft size={18} />
        </button>
        <h3 className="text-xs font-black text-primary-900 dark:text-white uppercase tracking-widest">Update Credentials</h3>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="p-4 bg-primary-900 text-white rounded-2xl flex items-start gap-4">
          <Shield size={24} className="text-teal mt-1 shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-teal mb-1">Security Protocol</p>
            <p className="text-[11px] text-primary-300 leading-relaxed">
              As a system administrator, you must maintain a high-entropy password. We recommend at least 12 characters including symbols.
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest flex items-center gap-2"><Lock size={12} /> New Password</label>
            <input type="password" className="input-field" value={formData.newPassword} onChange={e => setFormData({ ...formData, newPassword: e.target.value })} placeholder="••••••••" required />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest flex items-center gap-2"><Lock size={12} /> Confirm Password</label>
            <input type="password" className="input-field" value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} placeholder="••••••••" required />
          </div>
        </div>

        {error && <p className="text-xs text-red-500 font-bold flex items-center gap-2"><AlertCircle size={14}/> {error}</p>}
        {success && (
          <div className="p-4 bg-teal/10 text-teal rounded-xl flex items-center gap-2 text-xs font-bold">
            <Check size={16} /> Admin credentials updated. Redirecting...
          </div>
        )}

        {!success && (
          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={onBack} className="btn-ghost text-xs">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary min-w-[140px] justify-center gap-2 text-xs py-3">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />} Update Password
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
}
