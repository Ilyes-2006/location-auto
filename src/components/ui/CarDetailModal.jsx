import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Users, Zap, Fuel, ShieldCheck, MapPin, Headphones } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function CarDetailModal({ car, isOpen, onClose, onReserve }) {
  const { user } = useAuth();
  if (!isOpen || !car) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with strong blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary-900/40 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-2xl shadow-modal overflow-hidden border border-primary-200 flex flex-col md:flex-row"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full shadow-card text-primary-500 hover:text-teal transition-colors"
          >
            <X size={20} />
          </button>

          {/* Image Side */}
          <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden" style={{ background: car.imgUrl ? 'none' : `linear-gradient(135deg, ${car.imgColor} 0%, ${car.imgColor}dd 100%)` }}>
            {car.imgUrl ? (
              <img src={car.imgUrl} alt={`${car.brand} ${car.model}`} className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <svg viewBox="0 0 200 80" className="w-full drop-shadow-2xl" fill="white">
                  <path d="M170,55 H30 Q20,55 18,48 L10,38 Q8,30 15,28 L45,25 Q55,14 80,12 L130,12 Q155,14 165,25 L185,28 Q192,30 190,38 L182,48 Q180,55 170,55 Z" />
                  <circle cx="52" cy="56" r="14" fill="#0f172a" opacity="0.6" />
                  <circle cx="148" cy="56" r="14" fill="#0f172a" opacity="0.6" />
                </svg>
              </div>
            )}
            <div className="absolute bottom-4 left-6">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-[10px] font-bold uppercase tracking-widest">
                {car.category}
              </span>
            </div>
          </div>

          {/* Content Side */}
          <div className="w-full md:w-1/2 p-8 flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-primary-900">{car.brand} {car.model}</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${car.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  {car.status === 'AVAILABLE' ? 'Disponible' : 'Loué'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-primary-700">{car.rating || '4.8'}</span>
                <span className="text-sm text-primary-400 ml-1">({car.review_count || 12} avis clients)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                  <Users size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-primary-400 uppercase font-bold tracking-tight">Capacité</p>
                  <p className="text-sm font-semibold text-primary-800">{car.seats || 5} Places</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                  <Fuel size={18} />
                </div>
                <div>
                  <p className="text-[10px] text-primary-400 uppercase font-bold tracking-tight">Immatriculation</p>
                  <p className="text-sm font-semibold text-primary-800">{car.license_plate || car.vin}</p>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-primary-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-primary-400">Prix total par jour</p>
                <p className="text-2xl font-bold text-primary-900">€{car.daily_rate || car.dailyRate}<span className="text-sm font-normal text-primary-400"> /jour</span></p>
              </div>
              {!user?.isSuperuser ? (
                <button
                  disabled={car.status !== 'AVAILABLE'}
                  onClick={() => {
                    onReserve(car);
                    onClose();
                  }}
                  className={`btn-primary py-3 px-8 font-bold shadow-lifted flex items-center gap-2 ${car.status !== 'AVAILABLE' ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  Réserver <ShieldCheck size={18} />
                </button>
              ) : (
                <button className="btn-secondary py-3 px-8 font-bold flex items-center gap-2">
                  Support <Headphones size={18} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
