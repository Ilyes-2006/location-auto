import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, Users, Zap, ChevronRight, Search, LogIn, Eye, 
  SlidersHorizontal, X, ChevronDown, DollarSign, Car, 
  Armchair, Cog, Filter, RefreshCcw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../../components/ui/PageTransition';
import TopBar from '../../components/layout/TopBar';
import BookingModal from '../../components/ui/BookingModal';
import CarDetailModal from '../../components/ui/CarDetailModal';
import { vehicleService } from '../../services/vehicleService';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

// Deterministic placeholder car image
function CarVisual({ name, color, category, imgUrl }) {
  if (imgUrl) {
    return (
      <div className="w-full h-40 relative overflow-hidden bg-primary-100 dark:bg-primary-800/50">
        <img 
          src={imgUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    );
  }

  const gradient = `linear-gradient(135deg, ${color}ee 0%, ${color}88 100%)`;

  return (
    <div
      className="w-full h-40 rounded-t-card flex flex-col items-center justify-center relative overflow-hidden"
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
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.05, duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  }),
};

const CATEGORIES = ['Sedan', 'SUV', 'Sport', 'Luxury', 'Compact', 'Electric', 'Premium'];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const SEAT_OPTIONS = [2, 4, 5, 7, 8];

export default function UserCatalog() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [availOnly, setAvailOnly] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [detailedCar, setDetailedCar] = useState(null);

  // Advanced filters
  const [showFilters, setShowFilters] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterTransmission, setFilterTransmission] = useState('');
  const [filterSeats, setFilterSeats] = useState('');
  const [filterPriceMin, setFilterPriceMin] = useState('');
  const [filterPriceMax, setFilterPriceMax] = useState('');

  useEffect(() => {
    const fetchCars = async () => {
      const data = await vehicleService.getCatalog();
      setCars(data);
      setLoading(false);
    };
    fetchCars();
  }, []);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterCategory) count++;
    if (filterTransmission) count++;
    if (filterSeats) count++;
    if (filterPriceMin || filterPriceMax) count++;
    return count;
  }, [filterCategory, filterTransmission, filterSeats, filterPriceMin, filterPriceMax]);

  const resetFilters = () => {
    setFilterCategory('');
    setFilterTransmission('');
    setFilterSeats('');
    setFilterPriceMin('');
    setFilterPriceMax('');
    setSearch('');
    setAvailOnly(false);
  };

  const filtered = useMemo(() => {
    return cars.filter(c => {
      const name = c.name || `${c.brand} ${c.model}`;
      const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
        (c.category || '').toLowerCase().includes(search.toLowerCase());
      const matchAvail = !availOnly || c.available;
      const matchCategory = !filterCategory || (c.category || '').toLowerCase() === filterCategory.toLowerCase();
      const matchTransmission = !filterTransmission || (c.transmission || '').toLowerCase() === filterTransmission.toLowerCase();
      const matchSeats = !filterSeats || c.seats === Number(filterSeats);
      const price = c.daily_rate || c.dailyRate || 0;
      const matchPriceMin = !filterPriceMin || price >= Number(filterPriceMin);
      const matchPriceMax = !filterPriceMax || price <= Number(filterPriceMax);
      return matchSearch && matchAvail && matchCategory && matchTransmission && matchSeats && matchPriceMin && matchPriceMax;
    });
  }, [cars, search, availOnly, filterCategory, filterTransmission, filterSeats, filterPriceMin, filterPriceMax]);

  const handleReserveClick = (e, car) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login', { state: { message: t('login') } });
    } else {
      setSelectedCar(car);
    }
  };

  const translateCategory = (cat) => {
    const key = cat.toLowerCase();
    return t(key) || cat;
  };

  return (
    <PageTransition>
      <TopBar title={t('fleetCatalog')} subtitle={t('findAndBook')} />

      <div className="p-6 max-w-[1440px] mx-auto space-y-6">
        {/* Pro Filter Bar */}
        <div className="relative z-20">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center bg-white dark:bg-primary-900/50 backdrop-blur-xl border border-primary-100 dark:border-primary-800 p-2 rounded-2xl shadow-xl shadow-primary-900/5">
            {/* Search Input - Main Action */}
            <div className="relative flex-1 group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 group-focus-within:text-teal transition-colors" />
              <input
                className="w-full bg-primary-50/50 dark:bg-primary-800/50 border-none rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-teal/20 transition-all dark:text-white dark:placeholder:text-primary-500"
                placeholder={t('searchPlaceholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            {/* Quick Toggle: Available */}
            <button
              onClick={() => setAvailOnly(!availOnly)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                availOnly 
                  ? 'bg-teal text-white shadow-lg shadow-teal/20' 
                  : 'bg-primary-50 dark:bg-primary-800 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-700'
              }`}
            >
              <Zap size={14} className={availOnly ? 'fill-white' : ''} />
              <span className="hidden sm:inline">{t('availableOnly')}</span>
              <span className="sm:hidden">Dispo</span>
            </button>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-300 border ${
                showFilters || activeFilterCount > 0
                  ? 'bg-primary-900 dark:bg-white text-white dark:text-primary-900 border-primary-900 dark:border-white shadow-lg'
                  : 'bg-white dark:bg-transparent border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 hover:border-primary-300 dark:hover:border-primary-600'
              }`}
            >
              <Filter size={14} />
              {t('filters')}
              {activeFilterCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-teal text-white text-[9px] rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>
            
            {/* Reset Action */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
                title={t('resetFilters')}
              >
                <RefreshCcw size={16} />
              </button>
            )}
          </div>

          {/* Expanded Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="w-full"
              >
                <div className="bg-white dark:bg-primary-900 border border-primary-100 dark:border-primary-800 p-6 rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Category Selection */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-primary-400 dark:text-primary-500 uppercase tracking-widest flex items-center gap-2">
                        <Car size={12} /> {t('category')}
                      </label>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          onClick={() => setFilterCategory('')}
                          className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all border ${
                            filterCategory === '' 
                              ? 'bg-teal/10 border-teal text-teal' 
                              : 'bg-primary-50 dark:bg-primary-800 border-transparent dark:text-primary-400 hover:border-primary-200'
                          }`}
                        >
                          {t('allCategories')}
                        </button>
                        {CATEGORIES.map(cat => (
                          <button
                            key={cat}
                            onClick={() => setFilterCategory(cat)}
                            className={`px-3 py-2 rounded-lg text-[11px] font-bold transition-all border ${
                              filterCategory === cat 
                                ? 'bg-teal/10 border-teal text-teal' 
                                : 'bg-primary-50 dark:bg-primary-800 border-transparent dark:text-primary-400 hover:border-primary-200'
                            }`}
                          >
                            {translateCategory(cat)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Transmission & Seats */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary-400 dark:text-primary-500 uppercase tracking-widest flex items-center gap-2">
                          <Cog size={12} /> {t('transmission')}
                        </label>
                        <div className="flex gap-2">
                          {['', ...TRANSMISSIONS].map(tr => (
                            <button
                              key={tr}
                              onClick={() => setFilterTransmission(tr)}
                              className={`flex-1 px-3 py-2 rounded-lg text-[11px] font-bold transition-all border ${
                                filterTransmission === tr 
                                  ? 'bg-teal/10 border-teal text-teal' 
                                  : 'bg-primary-50 dark:bg-primary-800 border-transparent dark:text-primary-400 hover:border-primary-200'
                              }`}
                            >
                              {tr === '' ? 'All' : (tr === 'Automatic' ? t('automatic') : t('manual'))}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-primary-400 dark:text-primary-500 uppercase tracking-widest flex items-center gap-2">
                          <Armchair size={12} /> {t('seats')}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['', ...SEAT_OPTIONS].map(s => (
                            <button
                              key={s}
                              onClick={() => setFilterSeats(s)}
                              className={`w-9 h-9 rounded-lg text-[11px] font-bold transition-all border flex items-center justify-center ${
                                filterSeats === s 
                                  ? 'bg-teal/10 border-teal text-teal' 
                                  : 'bg-primary-50 dark:bg-primary-800 border-transparent dark:text-primary-400 hover:border-primary-200'
                              }`}
                            >
                              {s === '' ? 'All' : s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Price Slider / Inputs */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-black text-primary-400 dark:text-primary-500 uppercase tracking-widest flex items-center gap-2">
                          <DollarSign size={12} /> {t('priceRange')}
                        </label>
                        <span className="text-[11px] font-bold text-teal">
                          {filterPriceMin || 0}€ - {filterPriceMax || '∞'}€
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary-300">MIN</span>
                          <input
                            type="number"
                            placeholder="0"
                            value={filterPriceMin}
                            onChange={e => setFilterPriceMin(e.target.value)}
                            className="w-full bg-primary-50 dark:bg-primary-800 border-none rounded-xl pl-10 pr-3 py-3 text-xs focus:ring-2 focus:ring-teal/20 dark:text-white"
                          />
                        </div>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary-300">MAX</span>
                          <input
                            type="number"
                            placeholder="500"
                            value={filterPriceMax}
                            onChange={e => setFilterPriceMax(e.target.value)}
                            className="w-full bg-primary-50 dark:bg-primary-800 border-none rounded-xl pl-10 pr-3 py-3 text-xs focus:ring-2 focus:ring-teal/20 dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="pt-2">
                        <button 
                          onClick={() => setShowFilters(false)}
                          className="btn-primary w-full py-2.5 text-xs"
                        >
                          Show {filtered.length} Results
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Catalog Grid */}
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center text-primary-400">
            <div className="w-12 h-12 border-[3px] border-teal/10 border-t-teal rounded-full animate-spin mb-4" />
            <p className="text-sm font-medium animate-pulse">{t('loadingCatalog')}</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="py-32 flex flex-col items-center justify-center text-primary-300 dark:text-primary-600"
          >
            <Filter size={48} className="mb-4 stroke-[1.5]" />
            <p className="text-base font-semibold">{t('noVehicles')}</p>
            <p className="text-sm mt-1">{t('resetFiltersToSeeMore') || 'Try adjusting your search criteria'}</p>
            <button onClick={resetFilters} className="mt-6 btn-secondary text-xs px-6 py-2.5">
              {t('resetFilters')}
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((car, i) => (
              <motion.div
                key={car.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ y: -8 }}
                onClick={() => setDetailedCar(car)}
                className="group section-card dark:bg-primary-900 dark:border-primary-800/50 hover:shadow-2xl hover:shadow-primary-900/10 transition-all duration-500 cursor-pointer"
              >
                <CarVisual 
                  name={`${car.brand} ${car.model}`} 
                  color={car.imgColor || '#3b82f6'} 
                  category={car.category} 
                  imgUrl={car.imgUrl} 
                />

                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-primary-900 dark:text-white text-[15px] leading-tight group-hover:text-teal transition-colors">
                        {car.brand} {car.model}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                         <span className="text-[10px] font-black text-primary-300 dark:text-primary-600 uppercase tracking-widest">
                           {translateCategory(car.category || 'Premium')}
                         </span>
                         <span className="w-1 h-1 rounded-full bg-primary-200 dark:bg-primary-800" />
                         <div className="flex items-center gap-1 text-amber-500">
                           <Star size={10} className="fill-current" />
                           <span className="text-[10px] font-bold">4.8</span>
                         </div>
                      </div>
                    </div>
                    <span className={`chip shrink-0 scale-90 ${car.status === 'AVAILABLE' ? 'chip-available' : 'chip-rented'}`}>
                      {car.status === 'AVAILABLE' ? t('available') : t('booked')}
                    </span>
                  </div>

                  {/* High-end Spec Bar */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-primary-50 dark:border-primary-800/50">
                    <div className="text-center">
                      <div className="text-primary-300 dark:text-primary-600 mb-0.5 flex justify-center"><Users size={12} /></div>
                      <div className="text-[10px] font-bold text-primary-700 dark:text-primary-400">{car.seats} {t('seats')}</div>
                    </div>
                    <div className="text-center border-x border-primary-50 dark:border-primary-800/50">
                      <div className="text-primary-300 dark:text-primary-600 mb-0.5 flex justify-center"><Cog size={12} /></div>
                      <div className="text-[10px] font-bold text-primary-700 dark:text-primary-400 truncate px-1">
                        {car.transmission === 'Automatic' ? 'Auto' : 'Manual'}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-primary-300 dark:text-primary-600 mb-0.5 flex justify-center"><Zap size={12} /></div>
                      <div className="text-[10px] font-bold text-primary-700 dark:text-primary-400">{car.fuel || 100}%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-lg font-black text-primary-900 dark:text-white">€{car.daily_rate || car.dailyRate}</span>
                      <span className="text-[10px] font-bold text-primary-400 ml-1 uppercase tracking-tighter">{t('perDay')}</span>
                    </div>
                    
                    <button
                      disabled={car.status !== 'AVAILABLE'}
                      onClick={(e) => handleReserveClick(e, car)}
                      className={`relative overflow-hidden group/btn px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                        car.status === 'AVAILABLE'
                          ? 'bg-teal text-white shadow-lg shadow-teal/20 hover:scale-105 active:scale-95'
                          : 'bg-primary-100 dark:bg-primary-800 text-primary-300 dark:text-primary-600 cursor-not-allowed'
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        {!user ? t('login') : t('reserve')}
                        <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                      </span>
                    </button>
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
            navigate('/login', { state: { message: t('login') } });
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
