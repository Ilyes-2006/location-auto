import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Search, X, ChevronRight, Info, CreditCard, Clock } from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import TopBar from '../../components/layout/TopBar';
import StatusChip from '../../components/ui/StatusChip';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { reservationService } from '../../services/reservationService';

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05 + 0.1, duration: 0.3 } }),
};

export default function MyReservations() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRes, setSelectedRes] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        const data = await reservationService.getUserReservations(user.id);
        setBookings(data);
        setLoading(false);
      };
      fetchBookings();
    }
  }, [user]);

  const filteredBookings = bookings.filter(b => 
    b.id.toLowerCase().includes(search.toLowerCase()) || 
    b.vehicleName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageTransition>
      <TopBar title="My Reservations" subtitle="View and manage your current and past bookings." />

      <div className="p-6 max-w-[1440px] mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
            <input
              className="input-field pl-9 w-60 text-xs py-1.5"
              placeholder="Search reservations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="section-card"
        >
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-primary-400">
              <div className="w-10 h-10 border-4 border-teal/20 border-t-teal rounded-full animate-spin mb-4" />
              <p className="text-sm font-medium">Loading your reservations...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary-50 border-b border-primary-200">
                    <th className="th">Booking ID</th>
                    <th className="th">Vehicle</th>
                    <th className="th">Dates</th>
                    <th className="th">Location</th>
                    <th className="th">Status</th>
                    <th className="th">Total Cost</th>
                    <th className="th"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((b, i) => (
                    <motion.tr
                      key={b.id}
                      custom={i}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="tr"
                    >
                      <td className="td font-mono text-xs text-primary-600">{b.id.substring(0, 8)}...</td>
                      <td className="td font-semibold text-primary-900">{b.vehicleName}</td>
                      <td className="td">
                        <div className="flex items-center gap-1.5 text-primary-600">
                          <Calendar size={12} className="text-primary-400 shrink-0" />
                          {b.date}
                        </div>
                      </td>
                      <td className="td">
                        <div className="flex items-center gap-1.5 text-primary-600">
                          <MapPin size={12} className="text-primary-400 shrink-0" />
                          {b.location || 'Main Office'}
                        </div>
                      </td>
                      <td className="td"><StatusChip status={b.status?.toLowerCase()} /></td>
                      <td className="td font-semibold text-primary-900">{formatPrice(b.totalPrice)}</td>
                      <td className="td text-right">
                        <button 
                          onClick={() => setSelectedRes(b)}
                          className="btn-secondary py-1 px-3 text-xs"
                        >
                          View Details
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                  
                  {filteredBookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-primary-400">
                        No reservations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Details Modal */}
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
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="flex h-[450px]">
                {/* Left side: Car Image Placeholder */}
                <div className="w-1/3 bg-primary-900 flex flex-col items-center justify-center p-6 text-white text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4">
                    <Info size={32} className="text-teal" />
                  </div>
                  <h4 className="text-lg font-bold mb-2">{selectedRes.vehicleName}</h4>
                  <p className="text-xs text-primary-400">{selectedRes.vehicle?.category || 'Premium Selection'}</p>
                </div>

                {/* Right side: Details */}
                <div className="flex-1 p-8 overflow-y-auto">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <span className="text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded uppercase tracking-caps mb-2 block w-fit">
                        {selectedRes.status}
                      </span>
                      <h3 className="text-xl font-bold text-primary-900">Reservation Details</h3>
                      <p className="text-xs text-primary-400 font-mono mt-1">{selectedRes.id}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedRes(null)}
                      className="p-2 text-primary-300 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Time & Location */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                        <div className="flex items-center gap-2 mb-2 text-primary-500 font-bold text-[10px] uppercase tracking-widest">
                          <Calendar size={12} className="text-teal" /> Pickup & Return
                        </div>
                        <p className="text-sm font-bold text-primary-900">{selectedRes.date}</p>
                      </div>
                      <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100">
                        <div className="flex items-center gap-2 mb-2 text-primary-500 font-bold text-[10px] uppercase tracking-widest">
                          <MapPin size={12} className="text-teal" /> Location
                        </div>
                        <p className="text-sm font-bold text-primary-900">{selectedRes.location || 'Main Office'}</p>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="section-card p-5">
                      <h4 className="text-[11px] font-bold text-primary-400 uppercase tracking-widest mb-4">Cost Breakdown</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-primary-600">Daily Rate ({formatPrice(selectedRes.vehicle?.daily_rate || 0)})</span>
                          <span className="font-semibold text-primary-900">{formatPrice(selectedRes.totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-primary-600">Service Fee</span>
                          <span className="font-semibold text-emerald-600">FREE</span>
                        </div>
                        <div className="pt-3 border-t border-primary-100 flex justify-between items-center">
                          <span className="font-bold text-primary-900">Total Charged</span>
                          <span className="text-lg font-black text-primary-900">{formatPrice(selectedRes.totalPrice)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-900">Payment Successful</p>
                        <p className="text-xs text-emerald-600">Billed to Visa ending in 4242</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-[10px] font-bold text-emerald-600 uppercase">
                        <Clock size={12} /> Confirmed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
