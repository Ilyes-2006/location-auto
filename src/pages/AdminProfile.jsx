import { motion } from 'framer-motion';
import { Shield, Mail, Calendar, Key, Globe, Activity, Lock, Save } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import TopBar from '../components/layout/TopBar';
import { useAuth } from '../context/AuthContext';

export default function AdminProfile() {
  const { user } = useAuth();

  return (
    <PageTransition>
      <TopBar title="Admin Profile" subtitle="System administrator details and security settings." />

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-card p-8 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-teal/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          
          <div className="w-28 h-28 rounded-3xl bg-primary-900 border-4 border-white shadow-card flex items-center justify-center text-white text-4xl font-bold shrink-0 relative z-10 rotate-3">
            SA
          </div>
          
          <div className="flex-1 text-center md:text-left relative z-10">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h2 className="text-3xl font-bold text-primary-900">System Administrator</h2>
              <span className="chip chip-available flex items-center gap-1 px-2 py-0.5 text-[10px]">
                <Shield size={10} /> Active
              </span>
            </div>
            <p className="text-primary-500 font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
              <Mail size={14} /> {user?.email || 'admin@auto-loc.com'}
            </p>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <div className="px-4 py-2 bg-primary-50 rounded-xl border border-primary-100 flex items-center gap-2">
                <Calendar size={14} className="text-primary-400" />
                <span className="text-xs font-bold text-primary-700">Access Level: Full Access</span>
              </div>
              <div className="px-4 py-2 bg-primary-50 rounded-xl border border-primary-100 flex items-center gap-2">
                <Globe size={14} className="text-primary-400" />
                <span className="text-xs font-bold text-primary-700">Region: Europe (Paris)</span>
              </div>
            </div>
          </div>
          
          <div className="relative z-10">
            <button className="btn-primary flex items-center gap-2">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Permissions & Security */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="section-card">
              <div className="px-6 py-4 border-b border-primary-100">
                <h3 className="font-bold text-primary-900 flex items-center gap-2">
                  <Lock size={18} className="text-teal" />
                  Administrative Privileges
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Fleet Management', desc: 'Add, edit, and delete vehicles' },
                  { label: 'User Administration', desc: 'Manage client accounts' },
                  { label: 'Financial Access', desc: 'View revenue and process refunds' },
                  { label: 'System Settings', desc: 'Modify global application config' },
                  { label: 'API Access', desc: 'Manage integration keys and webhooks' },
                  { label: 'Reports', desc: 'Generate and export system data' }
                ].map((perm, i) => (
                  <div key={i} className="p-4 rounded-xl border border-primary-100 bg-primary-50/30 flex items-start gap-3 hover:border-teal/30 transition-colors">
                    <div className="w-5 h-5 rounded-md bg-teal/10 flex items-center justify-center text-teal mt-0.5">
                      <Shield size={12} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary-900">{perm.label}</p>
                      <p className="text-[11px] text-primary-500">{perm.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-card">
              <div className="px-6 py-4 border-b border-primary-100">
                <h3 className="font-bold text-primary-900 flex items-center gap-2">
                  <Key size={18} className="text-teal" />
                  Security Settings
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl border border-primary-100">
                  <div>
                    <p className="text-sm font-bold text-primary-900">Two-Factor Authentication</p>
                    <p className="text-xs text-primary-500">Protect your account with an extra layer of security.</p>
                  </div>
                  <div className="w-12 h-6 bg-teal rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl border border-primary-100">
                  <div>
                    <p className="text-sm font-bold text-primary-900">Session Timeout</p>
                    <p className="text-xs text-primary-500">Automatically logout after 30 minutes of inactivity.</p>
                  </div>
                  <span className="text-xs font-bold text-teal">Enabled</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Log */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="section-card"
          >
            <div className="px-6 py-4 border-b border-primary-100 flex items-center justify-between">
              <h3 className="font-bold text-primary-900 flex items-center gap-2">
                <Activity size={18} className="text-teal" />
                Recent Activity
              </h3>
              <button className="text-[10px] font-bold text-primary-400 hover:text-teal uppercase tracking-caps">View All</button>
            </div>
            <div className="p-6 space-y-6">
              {[
                { action: 'Updated Vehicle #72', time: '12 mins ago', type: 'fleet' },
                { action: 'Approved Booking #982', time: '2 hours ago', type: 'booking' },
                { action: 'Logged in from 192.168.1.1', time: '5 hours ago', type: 'auth' },
                { action: 'System Backup Complete', time: 'Yesterday', type: 'system' },
                { action: 'Modified Pricing Model', time: '2 days ago', type: 'finance' }
              ].map((act, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-teal mt-1.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-primary-800">{act.action}</p>
                    <p className="text-[10px] text-primary-400 font-bold uppercase tracking-caps">{act.time}</p>
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
