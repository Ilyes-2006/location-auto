import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Shield, X, Save, AlertCircle, CheckCircle } from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import TopBar from '../../components/layout/TopBar';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';

export default function UserProfile() {
  const { user, isSuperuser, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    avatar_url: ''
  });

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const data = await userService.getProfile(user.id);
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || ''
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMessage('');
    try {
      await userService.updateProfile(user.id, {
        full_name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url
      });
      if (refreshProfile) refreshProfile();
      setSaveMessage('Profile saved successfully!');
      setIsEditing(false);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageTransition>
        <TopBar title="My Profile" subtitle="Manage your personal information and preferences." />
        <div className="p-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-teal/20 border-t-teal rounded-full animate-spin" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <TopBar title="My Profile" subtitle="Manage your personal information and preferences." />

      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* Save feedback */}
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl flex items-center gap-2 text-sm font-medium ${
              saveMessage.includes('Error') 
                ? 'bg-red-50 text-red-600 border border-red-100' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}
          >
            {saveMessage.includes('Error') ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
            {saveMessage}
          </motion.div>
        )}
        
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="section-card p-6 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="w-24 h-24 rounded-full bg-primary-900 border-4 border-white shadow-card flex items-center justify-center text-white text-3xl font-bold shrink-0 relative z-10 overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              (profile.full_name || '?').split(' ').map(n => n[0]).join('')
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left relative z-10">
            <h2 className="text-2xl font-bold text-primary-900 mb-1">{profile.full_name || 'User'}</h2>
            <p className="text-sm text-primary-500 mb-4">{user?.email}</p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="chip chip-available flex items-center gap-1.5 px-3 py-1">
                <Shield size={12} /> {isSuperuser ? 'Superuser Account' : 'Client Account'}
              </span>
            </div>
          </div>
          
          <div className="relative z-10">
            <button 
              onClick={() => setIsEditing(true)}
              className="btn-secondary"
            >
              Edit Profile
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="section-card"
          >
            <div className="px-5 py-4 border-b border-primary-100 bg-primary-50/50">
              <h3 className="font-semibold text-primary-900 text-[15px]">Contact Information</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-primary-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-primary-500 font-medium mb-0.5 uppercase tracking-caps">Email Address</p>
                  <p className="text-sm text-primary-900">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-primary-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-primary-500 font-medium mb-0.5 uppercase tracking-caps">Phone Number</p>
                  <p className="text-sm text-primary-900">{profile.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User size={16} className="text-primary-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-primary-500 font-medium mb-0.5 uppercase tracking-caps">Role</p>
                  <p className="text-sm text-primary-900 capitalize">{isSuperuser ? 'Superuser' : 'Client'}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Info */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="section-card flex flex-col"
          >
            <div className="px-5 py-4 border-b border-primary-100 bg-primary-50/50">
              <h3 className="font-semibold text-primary-900 text-[15px]">Account Details</h3>
            </div>
            <div className="p-5 flex-1 space-y-4">
              <div className="border border-primary-200 rounded-lg p-4 bg-primary-50/30">
                <p className="text-xs text-primary-500 font-medium mb-1 uppercase tracking-caps">Account ID</p>
                <p className="text-xs font-mono text-primary-700">{user?.id}</p>
              </div>
              <div className="border border-primary-200 rounded-lg p-4 bg-primary-50/30">
                <p className="text-xs text-primary-500 font-medium mb-1 uppercase tracking-caps">Account Type</p>
                <span className="text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded uppercase tracking-caps">
                  {isSuperuser ? 'Superuser' : 'Client'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-primary-900">Edit Profile</h3>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">Profile Picture</label>
                    <div className="flex items-center gap-4">
                      {profile.avatar_url ? (
                        <img src={profile.avatar_url} className="w-12 h-12 rounded-full object-cover border border-primary-200" alt="Avatar Preview" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-400 font-bold">
                          {(profile.full_name || '?').charAt(0)}
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal/10 file:text-teal hover:file:bg-teal/20"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setProfile({...profile, avatar_url: reader.result});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      value={profile.full_name}
                      onChange={e => setProfile({...profile, full_name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
                    <input 
                      type="email" 
                      className="input-field bg-primary-50 cursor-not-allowed" 
                      value={user?.email || ''}
                      disabled
                    />
                    <p className="text-[10px] text-primary-400 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">Phone Number</label>
                    <input 
                      type="tel" 
                      className="input-field" 
                      placeholder="+213 5XX XX XX XX"
                      value={profile.phone}
                      onChange={e => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex-1 btn-secondary py-3"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save size={18} /> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
