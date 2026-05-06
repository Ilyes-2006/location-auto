import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Mail, Calendar, Key, Globe, Activity, 
  Lock, Save, Camera, Check, AlertCircle, Loader2, Phone, User
} from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import TopBar from '../components/layout/TopBar';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';

export default function AdminProfile() {
  const { user, profile: authProfile, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (authProfile) {
      setProfile({
        full_name: authProfile.full_name || 'System Administrator',
        phone: authProfile.phone || '',
        avatar_url: authProfile.avatar_url || ''
      });
    }
  }, [authProfile]);

  const handleSave = async () => {
    if (!user || !profile) return;
    setSaving(true);
    setMessage(null);
    try {
      await userService.updateProfile(user.id, {
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url
      });
      await refreshProfile();
      setMessage({ type: 'success', text: 'Administrative profile updated successfully.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (err) {
      console.error('Failed to save profile', err);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, avatar_url: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profile && !authProfile) {
    return (
      <div className="p-20 flex justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-teal" />
      </div>
    );
  }

  return (
    <PageTransition>
      <TopBar title="Admin Profile" subtitle="System administrator details and security settings." />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-2xl flex items-center gap-3 text-xs font-bold border ${
                message.type === 'success' 
                  ? 'bg-teal/10 border-teal/20 text-teal' 
                  : 'bg-red-50 border-red-100 text-red-600'
              }`}
            >
              {message.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-card p-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          
          <div className="relative group">
            <div className="w-28 h-28 rounded-3xl bg-primary-900 border-4 border-white dark:border-primary-800 shadow-card flex items-center justify-center text-white text-4xl font-bold shrink-0 overflow-hidden relative z-10">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Admin Avatar" />
              ) : (
                <User size={48} />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label className="cursor-pointer text-white flex flex-col items-center">
                  <Camera size={24} />
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-primary-900 z-20">
              <Shield size={14} />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left relative z-10">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-3xl font-black text-primary-900 dark:text-white uppercase tracking-tight">{profile?.full_name}</h2>
              <span className="chip chip-available flex items-center gap-1 px-2 py-0.5 text-[10px]">
                <Shield size={10} /> Superuser
              </span>
            </div>
            <p className="text-primary-500 font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
              <Mail size={14} /> {user?.email}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest flex items-center gap-2">
                   Admin Name
                </label>
                <input 
                  className="input-field py-2"
                  value={profile?.full_name}
                  onChange={e => setProfile({...profile, full_name: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest flex items-center gap-2">
                   Contact Phone
                </label>
                <input 
                  className="input-field py-2"
                  value={profile?.phone}
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                />
              </div>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col gap-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 min-w-[160px] justify-center">
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="section-card">
              <div className="px-6 py-4 border-b border-primary-100 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-800/20">
                <h3 className="text-xs font-black text-primary-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                  <Lock size={16} className="text-teal" />
                  Administrative Privileges
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Fleet Management', desc: 'Add, edit, and delete vehicles' },
                  { label: 'User Administration', desc: 'Manage client accounts' },
                  { label: 'Financial Access', desc: 'View revenue and process refunds' },
                  { label: 'System Settings', desc: 'Modify global application config' },
                  { label: 'API Access', desc: 'Manage integration keys' },
                  { label: 'Reporting', desc: 'Generate system-wide data' }
                ].map((perm, i) => (
                  <div key={i} className="p-4 rounded-xl border border-primary-100 dark:border-primary-800 bg-primary-50/20 dark:bg-primary-800/10 flex items-start gap-3 group hover:border-teal/30 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-teal/10 flex items-center justify-center text-teal mt-0.5 group-hover:scale-110 transition-transform">
                      <Shield size={12} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary-900 dark:text-white">{perm.label}</p>
                      <p className="text-[11px] text-primary-500">{perm.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-card h-full"
          >
            <div className="px-6 py-4 border-b border-primary-100 dark:border-primary-800 bg-primary-50/30 dark:bg-primary-800/20">
              <h3 className="text-xs font-black text-primary-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                <Activity size={16} className="text-teal" />
                Auth History
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {[
                { action: 'Session Started', time: '12 mins ago', type: 'auth' },
                { action: 'Vehicle Inventory Updated', time: '2 hours ago', type: 'fleet' },
                { action: 'Customer Record Modified', time: '5 hours ago', type: 'user' },
                { action: 'System Config Changed', time: 'Yesterday', type: 'admin' },
              ].map((act, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0 shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                  <div>
                    <p className="text-sm font-bold text-primary-800 dark:text-primary-200">{act.action}</p>
                    <p className="text-[10px] text-primary-400 font-bold uppercase tracking-widest">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
