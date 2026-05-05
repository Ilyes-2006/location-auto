import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Users, Zap, ChevronRight, Search } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import TopBar from '../components/layout/TopBar';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { vehicleService } from '../services/vehicleService';

// Deterministic placeholder car image using car color from data
function CarVisual({ name, color, category }) {
  // Build gradient from the car's primary color
  const isDark = color === '#1e293b' || color === '#0f172a';
  const gradient = `linear-gradient(135deg, ${color}ee 0%, ${color}88 100%)`;

  return (
    <div
      className="w-full h-44 rounded-t-card flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: gradient }}
    >
      {/* Decorative circles for depth */}
      <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
      <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-white/5" />

      {/* Car silhouette SVG */}
      <svg
        viewBox="0 0 200 80"
        className="w-40 drop-shadow-xl"
        fill="white"
        opacity="0.92"
      >
        {/* Simple stylized car shape */}
        <path d="M170,55 H30 Q20,55 18,48 L10,38 Q8,30 15,28 L45,25 Q55,14 80,12 L130,12 Q155,14 165,25 L185,28 Q192,30 190,38 L182,48 Q180,55 170,55 Z" />
        <circle cx="52" cy="56" r="14" fill="#0f172a" opacity="0.6" />
        <circle cx="52" cy="56" r="8" fill="white" opacity="0.5" />
        <circle cx="148" cy="56" r="14" fill="#0f172a" opacity="0.6" />
        <circle cx="148" cy="56" r="8" fill="white" opacity="0.5" />
        <path d="M88,28 L88,14 L120,14 L120,28Z" fill="white" opacity="0.3" />
      </svg>

      <p className="absolute bottom-3 right-3 text-white/50 text-[10px] font-semibold uppercase tracking-caps">
        {category}
      </p>
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

export default function CarCatalog() {
  const { t } = useLanguage();
  const { user, isSuperuser } = useAuth();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [availOnly, setAvailOnly] = useState(false);

  useEffect(() => {
    const fetchCars = async () => {
      const data = await vehicleService.getCatalog();
      setCars(data || []);
      setLoading(false);
    };
    fetchCars();
  }, []);

  const filtered = cars.filter(c => {
    const name = c.name || '';
    const category = c.category || '';
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      category.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (!availOnly || c.available);
  });

  return (
    <PageTransition>
      <TopBar title="Fleet Catalog" subtitle="Browse and reserve vehicles from the Auto-Loc fleet." />

      <div className="p-6 max-w-[1440px] mx-auto space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
              <input
                className="input-field pl-9 w-56 text-xs py-1.5"
                placeholder="Search catalog…"
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
              Available only
            </label>
          </div>
          <p className="text-xs text-primary-500">{filtered.length} vehicles found</p>
        </div>

        {/* Catalog grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-primary-400">
            <div className="w-10 h-10 border-4 border-teal/20 border-t-teal rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium">Loading catalog...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {filtered.map((car, i) => (
              <motion.div
                key={car.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -8, boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}
                className="section-card group cursor-pointer"
              >
                {/* Premium Visual Header */}
                <div className="relative h-40 overflow-hidden">
                  <CarVisual name={car.name} color={car.imgColor} category={car.category} />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`chip scale-90 shadow-lg ${car.available ? 'chip-available' : 'chip-rented'}`}>
                      {car.available ? t('available') : t('booked')}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-bold text-primary-900 text-base leading-tight group-hover:text-teal transition-colors">{car.name}</h3>
                      <p className="text-[10px] text-primary-500 font-bold uppercase tracking-caps mt-1">{car.category}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-primary-100 px-2 py-1 rounded-lg">
                      <Star size={10} className="text-amber-500 fill-amber-500" />
                      <span className="text-[11px] font-bold text-primary-700">{car.rating}</span>
                    </div>
                  </div>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2 text-[11px] text-primary-500">
                      <Users size={12} className="text-primary-400" />
                      <span>{car.seats} {t('seats')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-primary-500">
                      <Zap size={12} className="text-teal" />
                      <span>{car.range}</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-primary-100">
                    <div>
                      <span className="text-xl font-black text-primary-900">€{car.dailyRate}</span>
                      <span className="text-[10px] text-primary-500 font-bold uppercase ml-1">/{t('dailyRate')}</span>
                    </div>
                    {!isSuperuser && (
                      <button
                        disabled={!car.available}
                        className={`btn-primary px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 ${!car.available ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
                      >
                        {t('reserve')}
                        <ChevronRight size={12} />
                      </button>
                    )}
                    {isSuperuser && (
                      <button className="btn-secondary px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5">
                        {t('details')}
                        <ChevronRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-primary-200 px-6 py-4 flex items-center gap-4 text-xs text-primary-400">
        <a href="#" className="hover:text-teal transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-teal transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-teal transition-colors">Fleet Support</a>
      </footer>
    </PageTransition>
  );
}
