import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Zap, ChevronRight, Search, LogIn, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/ui/PageTransition';
import TopBar from '../../components/layout/TopBar';
import BookingModal from '../../components/ui/BookingModal';
import CarDetailModal from '../../components/ui/CarDetailModal';
import { vehicleService } from '../../services/vehicleService';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';

// Deterministic placeholder car image using car color from data
function CarVisual({ name, color, category }) {
  const gradient = `linear-gradient(135deg, ${color}ee 0%, ${color}88 100%)`;

  return (
    <div
      className="w-full h-32 rounded-t-card flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: gradient }}
    >
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
      <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-white/5" />

      <svg viewBox="0 0 200 80" className="w-32 drop-shadow-xl" fill="white" opacity="0.92">
        <path d="M170,55 H30 Q20,55 18,48 L10,38 Q8,30 15,28 L45,25 Q55,14 80,12 L130,12 Q155,14 165,25 L185,28 Q192,30 190,38 L182,48 Q180,55 170,55 Z" />
        <circle cx="52" cy="56" r="14" fill="#0f172a" opacity="0.6" />
        <circle cx="52" cy="56" r="8" fill="white" opacity="0.5" />
        <circle cx="148" cy="56" r="14" fill="#0f172a" opacity="0.6" />
        <circle cx="148" cy="56" r="8" fill="white" opacity="0.5" />
        <path d="M88,28 L88,14 L120,14 L120,28Z" fill="white" opacity="0.3" />
      </svg>
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function UserCatalog() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [availOnly, setAvailOnly] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [detailedCar, setDetailedCar] = useState(null);

  useEffect(() => {
    const fetchCars = async () => {
      const data = await vehicleService.getCatalog();
      setCars(data);
      setLoading(false);
    };
    fetchCars();
  }, []);

  const filtered = cars.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.category.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (!availOnly || c.available);
  });

  const handleReserveClick = (e, car) => {
    e.stopPropagation(); // Don't trigger the detail modal
    if (!user) {
      navigate('/login', { state: { message: "Veuillez vous connecter pour réserver" } });
    } else {
      setSelectedCar(car);
    }
  };

  return (
    <PageTransition>
      <TopBar title="Catalogue de Flotte" subtitle="Trouvez et réservez votre véhicule idéal." />

      <div className="p-6 max-w-[1440px] mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
              <input
                className="input-field pl-9 w-56 text-xs py-1.5"
                placeholder="Rechercher…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-primary-600 cursor-pointer select-none">
              <input
                type="checkbox"
                className="accent-teal w-3.5 h-3.5"
                checked={availOnly}
                onChange={e => setAvailOnly(e.target.checked)}
              />
              Disponible uniquement
            </label>
          </div>
          <p className="text-xs text-primary-500">{filtered.length} véhicules trouvés</p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-primary-400">
            <div className="w-10 h-10 border-4 border-teal/20 border-t-teal rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Chargement du catalogue...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {filtered.map((car, i) => (
              <motion.div
                key={car.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(15,23,42,0.14)' }}
                onClick={() => setDetailedCar(car)}
                className="section-card overflow-hidden cursor-pointer group"
              >
                <CarVisual name={`${car.brand} ${car.model}`} color={car.imgColor || '#3b82f6'} category={car.category || 'Premium'} />

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-primary-900 text-[14px] leading-tight group-hover:text-teal transition-colors">
                        {car.brand} {car.model}
                      </h3>
                      <p className="text-[11px] text-primary-400 mt-0.5">{car.category || 'Véhicule'}</p>
                    </div>
                    <span className={`chip scale-90 ${car.status === 'AVAILABLE' ? 'chip-available' : 'chip-rented'}`}>
                      {car.status === 'AVAILABLE' ? 'Dispo' : 'Loué'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-primary-100">
                    <div>
                      <span className="text-base font-bold text-primary-900">€{car.daily_rate || car.dailyRate}</span>
                      <span className="text-[10px] text-primary-400"> /jour</span>
                    </div>
                    {!user?.isSuperuser && (
                      <button
                        disabled={car.status !== 'AVAILABLE'}
                        onClick={(e) => handleReserveClick(e, car)}
                        className={`btn-primary py-1 px-3 text-[10px] font-bold flex items-center gap-1 ${car.status !== 'AVAILABLE' ? 'opacity-40 cursor-not-allowed' : ''}`}
                      >
                        {!user ? 'Connexion' : 'Réserver'}
                        <ChevronRight size={10} />
                      </button>
                    )}
                    {user?.isSuperuser && (
                      <button className="btn-secondary py-1 px-3 text-[10px] font-bold flex items-center gap-1">
                        Détails
                        <ChevronRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <CarDetailModal
        car={detailedCar}
        isOpen={!!detailedCar}
        onClose={() => setDetailedCar(null)}
        onReserve={(car) => {
          if (!user) {
            navigate('/login', { state: { message: "Veuillez vous connecter pour réserver" } });
          } else {
            setSelectedCar(car);
          }
        }}
      />

      <BookingModal 
        car={selectedCar} 
        isOpen={!!selectedCar} 
        onClose={() => setSelectedCar(null)} 
      />

    </PageTransition>
  );
}
