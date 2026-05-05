import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Users, Star, Calendar, Phone, Mail, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import TopBar from '../components/layout/TopBar';
import { userService } from '../services/userService';
import { supabase } from '../supabaseClient';

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.06 + 0.2, duration: 0.3 } }),
};

function StatCard({ icon, label, value }) {
  return (
    <div className="metric-card">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-primary-500 uppercase tracking-caps font-semibold">{label}</p>
        <div className="w-8 h-8 rounded-card bg-primary-100 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-bold text-primary-900">{value}</p>
    </div>
  );
}

export default function Customers() {
  const [search, setSearch] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, withPhone: 0, admins: 0, clients: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch profiles directly
        const users = await userService.getAllUsers();

        // Fetch rental stats for each user
        const enriched = await Promise.all(
          (users || []).map(async (p) => {
            const rentalStats = await userService.getUserRentalStats(p.id);
            return {
              ...p,
              rentals: rentalStats.count,
              totalSpent: rentalStats.totalSpent
            };
          })
        );
        
        setCustomers(enriched);
        setStats({
          total: enriched.length,
          withPhone: enriched.filter(c => c.phone).length
        });
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = customers.filter(c =>
    (c.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.phone || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <TopBar title="Client Roster" subtitle="Manage customer profiles and review rental histories." />

      <div className="p-6 max-w-[1440px] mx-auto space-y-5">
        {/* Stats row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={<Users size={18} className="text-primary-600" />} label="Total Clients" value={loading ? '...' : stats.total} />
          <StatCard icon={<ShieldCheck size={18} className="text-primary-600" />} label="Vérifiés" value={loading ? '...' : stats.withPhone} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
            <input
              className="input-field pl-9 w-60 text-xs py-1.5"
              placeholder="Search clients…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="section-card"
        >
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-primary-400">
              <div className="w-10 h-10 border-4 border-teal/20 border-t-teal rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary-50 border-b border-primary-200">
                    <th className="th">User</th>
                    <th className="th">Contact</th>
                    <th className="th">Status</th>
                    <th className="th">Rentals</th>
                    <th className="th">Total Spent</th>
                    <th className="th">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => (
                    <motion.tr
                      key={c.id}
                      custom={i}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="tr"
                    >
                      <td className="td">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-800 flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {(c.full_name || '?').split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-primary-900">{c.full_name || 'Unnamed'}</p>
                            <p className="text-[11px] text-primary-400">{c.id.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </td>
                      <td className="td">
                        <div className="flex items-center gap-1.5 text-primary-700 text-xs mb-0.5">
                          <Mail size={11} className="text-primary-400" />
                          {c.email || '—'}
                        </div>
                        <div className="flex items-center gap-1.5 text-primary-500 text-[11px]">
                          <Phone size={11} className="text-primary-400" />
                          {c.phone || '—'}
                        </div>
                      </td>
                      <td className="td">
                        <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-caps bg-teal/10 text-teal border border-teal/20 rounded-full">
                          Client
                        </span>
                      </td>
                      <td className="td">
                        <span className="font-semibold text-primary-900">{c.rentals}</span>
                      </td>
                      <td className="td">
                        <span className="font-semibold text-teal">€{c.totalSpent.toLocaleString()}</span>
                      </td>
                      <td className="td text-primary-500 text-xs">
                        {c.updated_at ? new Date(c.updated_at).toLocaleDateString() : '—'}
                      </td>
                    </motion.tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-primary-400 text-sm">
                        No clients found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-4 py-3 bg-primary-50 border-t border-primary-100 flex items-center justify-between">
            <p className="text-xs text-primary-500">
              Showing <span className="font-semibold">{filtered.length}</span> of <span className="font-semibold">{customers.length}</span> users
            </p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
