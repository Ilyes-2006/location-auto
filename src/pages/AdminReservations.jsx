import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, CheckCircle, XCircle, Clock, Calendar, Car, Filter, ChevronRight, X, AlertCircle } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import TopBar from '../components/layout/TopBar';
import { reservationService } from '../services/reservationService';

const STATUS_TABS = [
  { key: 'ALL', label: 'All' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
];

const statusStyles = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-teal/10 text-teal border-teal/20',
  ACTIVE: 'bg-blue-50 text-blue-700 border-blue-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CANCELLED: 'bg-red-50 text-red-600 border-red-200',
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.04 + 0.15, duration: 0.3 } }),
};

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedRes, setSelectedRes] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  const fetchReservations = async () => {
    const data = await reservationService.getAllReservations();
    setReservations(data);
    setLoading(false);
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleStatusChange = async (resId, newStatus) => {
    setActionLoading(resId);
    try {
      await reservationService.updateReservationStatus(resId, newStatus);
      
      if (newStatus === 'CONFIRMED') {
        setToastMsg('Réservation confirmée avec succès');
        setTimeout(() => setToastMsg(''), 3000);
      } else if (newStatus === 'CANCELLED') {
        setToastMsg('Réservation annulée');
        setTimeout(() => setToastMsg(''), 3000);
      }
      
      await fetchReservations();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = reservations.filter(r => {
    const matchesSearch =
      r.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      r.vehicleName?.toLowerCase().includes(search.toLowerCase()) ||
      r.id?.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'ALL' || r.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const pendingCount = reservations.filter(r => r.status === 'PENDING').length;

  return (
    <PageTransition>
      <TopBar title="Reservations" subtitle="Review, confirm or cancel customer bookings." />

      <div className="p-6 max-w-[1440px] mx-auto space-y-5">
        {/* Stats summary */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: 'Total', value: reservations.length, icon: Calendar, color: 'text-primary-600' },
            { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-600' },
            { label: 'Confirmed', value: reservations.filter(r => r.status === 'CONFIRMED').length, icon: CheckCircle, color: 'text-teal' },
            { label: 'Cancelled', value: reservations.filter(r => r.status === 'CANCELLED').length, icon: XCircle, color: 'text-red-500' },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="metric-card"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] text-primary-500 uppercase tracking-caps font-semibold">{label}</p>
                <div className="w-8 h-8 rounded-card bg-primary-100 flex items-center justify-center">
                  <Icon size={14} className={color} />
                </div>
              </div>
              <p className="text-3xl font-bold text-primary-900">{loading ? '...' : value}</p>
            </motion.div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
            <input
              className="input-field pl-9 w-64 text-xs py-1.5"
              placeholder="Search by customer, vehicle, or ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 bg-primary-50 rounded-xl p-1 border border-primary-100">
            {STATUS_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-primary-500 hover:text-primary-700'
                }`}
              >
                {tab.label}
                {tab.key === 'PENDING' && pendingCount > 0 && (
                  <span className="ml-1.5 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
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
              <p className="text-sm font-medium">Loading reservations...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary-50 border-b border-primary-200">
                    <th className="th">Customer</th>
                    <th className="th">Vehicle</th>
                    <th className="th">Dates</th>
                    <th className="th">Total</th>
                    <th className="th">Status</th>
                    <th className="th">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => (
                    <motion.tr
                      key={r.id}
                      custom={i}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="tr"
                    >
                      <td className="td">
                        <div>
                          <p className="font-semibold text-primary-900">{r.customerName}</p>
                          <p className="text-[11px] text-primary-400">{r.customerPhone}</p>
                        </div>
                      </td>
                      <td className="td">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: r.vehicle?.img_color || '#334155' }}>
                            <Car size={13} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-primary-900 text-xs">{r.vehicleName}</p>
                            <p className="text-[10px] text-primary-400">{r.vehicleCategory}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td">
                        <div className="text-xs text-primary-700">
                          <p>{new Date(r.start_date).toLocaleDateString()}</p>
                          <p className="text-primary-400">→ {new Date(r.end_date).toLocaleDateString()}</p>
                        </div>
                      </td>
                      <td className="td font-bold text-primary-900">€{Number(r.totalPrice).toLocaleString()}</td>
                      <td className="td">
                        <span className={`text-[10px] font-bold uppercase tracking-caps px-2.5 py-1 rounded-full border ${statusStyles[r.status] || 'bg-primary-50 text-primary-600 border-primary-200'}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="td">
                        <div className="flex items-center gap-1.5">
                          {r.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleStatusChange(r.id, 'CONFIRMED')}
                                disabled={actionLoading === r.id}
                                className="flex items-center gap-1 px-3 py-1.5 bg-teal text-white text-[11px] font-bold rounded-lg transition-all disabled:opacity-50 shadow-[0_0_12px_rgba(20,184,166,0.6)] hover:shadow-[0_0_20px_rgba(20,184,166,0.8)] hover:scale-105"
                              >
                                {actionLoading === r.id ? (
                                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                  <CheckCircle size={12} />
                                )}
                                Confirmer
                              </button>
                              <button
                                onClick={() => handleStatusChange(r.id, 'CANCELLED')}
                                disabled={actionLoading === r.id}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-600 text-[11px] font-bold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                              >
                                <XCircle size={12} />
                                Cancel
                              </button>
                            </>
                          )}
                          {r.status === 'CONFIRMED' && (
                            <button
                              onClick={() => handleStatusChange(r.id, 'COMPLETED')}
                              disabled={actionLoading === r.id}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                            >
                              Complete
                            </button>
                          )}
                          {(r.status === 'COMPLETED' || r.status === 'CANCELLED') && (
                            <span className="text-[11px] text-primary-400">No actions</span>
                          )}
                          <button
                            onClick={() => setSelectedRes(r)}
                            className="p-1.5 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-primary-400 text-sm">
                        No reservations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-4 py-3 bg-primary-50 border-t border-primary-100 flex items-center justify-between">
            <p className="text-xs text-primary-500">
              Showing <span className="font-semibold">{filtered.length}</span> of <span className="font-semibold">{reservations.length}</span> reservations
            </p>
          </div>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRes && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRes(null)}
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-caps px-2.5 py-1 rounded-full border ${statusStyles[selectedRes.status] || ''} mb-2 inline-block`}>
                    {selectedRes.status}
                  </span>
                  <h3 className="text-xl font-bold text-primary-900">Reservation Details</h3>
                  <p className="text-xs text-primary-400 font-mono mt-1">{selectedRes.id}</p>
                </div>
                <button onClick={() => setSelectedRes(null)} className="p-2 text-primary-300 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-primary-400 uppercase mb-1">Customer</p>
                    <p className="text-sm font-bold text-primary-900">{selectedRes.customerName}</p>
                    <p className="text-xs text-primary-500">{selectedRes.customerPhone}</p>
                  </div>
                  <div className="p-4 bg-primary-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-primary-400 uppercase mb-1">Vehicle</p>
                    <p className="text-sm font-bold text-primary-900">{selectedRes.vehicleName}</p>
                    <p className="text-xs text-primary-500">{selectedRes.vehicleCategory}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-primary-400 uppercase mb-1">Dates</p>
                    <p className="text-sm font-bold text-primary-900">{new Date(selectedRes.start_date).toLocaleDateString()}</p>
                    <p className="text-xs text-primary-500">→ {new Date(selectedRes.end_date).toLocaleDateString()}</p>
                  </div>
                  <div className="p-4 bg-primary-50 rounded-2xl">
                    <p className="text-[10px] font-bold text-primary-400 uppercase mb-1">Total Price</p>
                    <p className="text-2xl font-black text-primary-900">€{Number(selectedRes.totalPrice).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {selectedRes.status === 'PENDING' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => { handleStatusChange(selectedRes.id, 'CONFIRMED'); setSelectedRes(null); }}
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(20,184,166,0.6)] hover:shadow-[0_0_25px_rgba(20,184,166,0.8)]"
                  >
                    <CheckCircle size={18} /> Confirmer
                  </button>
                  <button
                    onClick={() => { handleStatusChange(selectedRes.id, 'CANCELLED'); setSelectedRes(null); }}
                    className="flex-1 py-3 flex items-center justify-center gap-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <XCircle size={18} /> Cancel
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-teal text-white px-5 py-3.5 rounded-xl shadow-[0_0_20px_rgba(20,184,166,0.4)] flex items-center gap-3 z-50 font-bold text-sm tracking-tight"
          >
            <CheckCircle size={20} />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
