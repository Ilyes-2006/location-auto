import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, MapPin, Gauge, Calendar, X, Car, 
  Euro, Edit3, Eye, Trash2, Check, AlertCircle, Loader2 
} from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import TopBar from '../components/layout/TopBar';
import StatusChip from '../components/ui/StatusChip';
import FuelBar from '../components/ui/FuelBar';
import { vehicleService } from '../services/vehicleService';
import { useLanguage } from '../context/LanguageContext';

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05 + 0.1, duration: 0.3 } }),
};

export default function FleetInventory() {
  const { t } = useLanguage();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    const data = await vehicleService.getInventory();
    setVehicles(data);
    setLoading(false);
  };

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modal States
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | 'view' | null
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [formError, setFormError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    year: new Date().getFullYear().toString(),
    color: '',
    vin: '',
    dailyRate: '',
    location: 'Paris CDG',
    fuel: 100,
    mileage: 0,
    category: 'Premium',
    imgUrl: '',
    status: 'AVAILABLE'
  });

  const filtered = vehicles.filter(v => {
    const name = v.name || '';
    const id = v.id || '';
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (v.status && v.status.toLowerCase() === statusFilter.toLowerCase());
    return matchesSearch && matchesStatus;
  });

  const openModal = (mode, vehicle = null) => {
    setModalMode(mode);
    setFormError(null);
    if (vehicle) {
      setSelectedVehicle(vehicle);
      setFormData({
        name: vehicle.name || '',
        year: (vehicle.year || new Date().getFullYear()).toString(),
        color: vehicle.color || '',
        vin: vehicle.vin || '',
        dailyRate: vehicle.dailyRate || vehicle.daily_rate || '',
        location: vehicle.location || '',
        fuel: vehicle.fuel || 100,
        mileage: vehicle.mileage || 0,
        category: vehicle.category || 'Premium',
        imgUrl: vehicle.imgUrl || '',
        status: vehicle.status || 'AVAILABLE'
      });
    } else {
      setFormData({
        name: '',
        year: new Date().getFullYear().toString(),
        color: '',
        vin: '',
        dailyRate: '',
        location: 'Paris CDG',
        fuel: 100,
        mileage: 0,
        category: 'Premium',
        imgUrl: '',
        status: 'AVAILABLE'
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedVehicle(null);
    setFormError(null);
  };

  const validateForm = () => {
    if (!formData.name) return t('vehicleName') + " is required";
    if (!formData.vin || formData.vin.length < 5) return t('vinNumber') + " is required";
    if (!formData.dailyRate) return t('dailyRate') + " is required";
    if (!formData.imgUrl) return t('imageUrl') + " is required";
    return null;
  };

  const handleSubmit = async () => {
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      if (modalMode === 'add') {
        const added = await vehicleService.addVehicle(formData);
        setVehicles([added, ...vehicles]);
      } else if (modalMode === 'edit') {
        const updated = await vehicleService.updateVehicle(selectedVehicle.id, formData);
        setVehicles(vehicles.map(v => v.id === selectedVehicle.id ? updated : v));
      }
      closeModal();
    } catch (err) {
      setFormError(t('operationFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('confirmDeleteVehicle'))) {
      try {
        await vehicleService.deleteVehicle(id);
        setVehicles(vehicles.filter(v => v.id !== id));
      } catch (err) {
        alert(t('operationFailed'));
      }
    }
  };

  return (
    <PageTransition>
      <TopBar title={t('fleetInventory')} subtitle={t('manageVehicles')} />

      <div className="p-6 max-w-[1440px] mx-auto space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
              <input
                className="input-field pl-9 text-xs py-1.5"
                placeholder={t('searchVehicles')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1 bg-primary-100 dark:bg-primary-800 rounded p-0.5">
              {['all', 'available', 'rented', 'maintenance'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    statusFilter === s
                      ? 'bg-white dark:bg-primary-700 text-primary-900 dark:text-white shadow-sm'
                      : 'text-primary-500 hover:text-primary-800 dark:hover:text-primary-300'
                  }`}
                >
                  {t(s)}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => openModal('add')}
            className="btn-primary"
          >
            <Plus size={14} />
            {t('addVehicle')}
          </button>
        </div>

        {/* Table Container */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="section-card"
        >
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-primary-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-teal" />
              <p className="text-sm font-medium">{t('loadingFleet')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary-50 dark:bg-primary-800/50 border-b border-primary-200 dark:border-primary-700">
                    <th className="th">{t('vehicle')}</th>
                    <th className="th">{t('vin')}</th>
                    <th className="th">{t('status')}</th>
                    <th className="th">{t('location')}</th>
                    <th className="th">{t('fuel')}</th>
                    <th className="th">{t('mileage')}</th>
                    <th className="th">{t('rateDay')}</th>
                    <th className="th"></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v, i) => (
                    <motion.tr
                      key={v.id}
                      custom={i}
                      variants={rowVariants}
                      initial="hidden"
                      animate="visible"
                      className="tr border-primary-50 dark:border-primary-800"
                    >
                      <td className="td">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-10 rounded-lg overflow-hidden bg-primary-100 dark:bg-primary-800 shrink-0 shadow-sm group relative">
                            {v.imgUrl ? (
                              <img src={v.imgUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primary-400">
                                <Car size={16} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-primary-900 dark:text-white truncate max-w-[120px]">{v.name}</p>
                            <p className="text-[10px] text-primary-400 font-bold uppercase tracking-widest">{v.year} • {v.color || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="td">
                        <span className="font-mono text-xs text-primary-500 dark:text-primary-400 tracking-tight">{v.vin}</span>
                      </td>
                      <td className="td"><StatusChip status={v.status} /></td>
                      <td className="td">
                        <div className="flex items-center gap-1.5 text-primary-600 dark:text-primary-400">
                          <MapPin size={12} className="text-primary-300 dark:text-primary-600" />
                          {v.location}
                        </div>
                      </td>
                      <td className="td"><FuelBar level={v.fuel} /></td>
                      <td className="td">
                        <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                          <Gauge size={12} className="text-primary-300" />
                          {Number(v.mileage).toLocaleString()} <span className="text-[10px] uppercase">km</span>
                        </div>
                      </td>
                      <td className="td">
                        <span className="font-black text-primary-900 dark:text-white">€{v.dailyRate || v.daily_rate}</span>
                      </td>
                      <td className="td">
                        <div className="flex items-center justify-end gap-2 pr-2">
                          <button onClick={() => openModal('view', v)} className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-800 flex items-center justify-center text-primary-400 hover:text-teal transition-all" title={t('viewDetails')}>
                            <Eye size={14} />
                          </button>
                          <button onClick={() => openModal('edit', v)} className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-800 flex items-center justify-center text-primary-400 hover:text-teal transition-all" title={t('editVehicle')}>
                            <Edit3 size={14} />
                          </button>
                          <button onClick={() => handleDelete(v.id)} className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-800 flex items-center justify-center text-primary-400 hover:text-red-500 transition-all" title={t('deleteVehicle')}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                   {filtered.length === 0 && !loading && (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-primary-400 text-sm">
                        {t('noVehiclesFoundCriteria')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Unified Vehicle Modal */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-primary-900 rounded-3xl shadow-2xl overflow-hidden border border-primary-100 dark:border-primary-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                      <Car size={20} />
                    </div>
                    <h3 className="text-xl font-black text-primary-900 dark:text-white uppercase tracking-tight">
                      {modalMode === 'add' ? t('newVehicle') : modalMode === 'edit' ? t('editVehicle') : t('reservationDetails')}
                    </h3>
                  </div>
                  <button onClick={closeModal} className="p-2 text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800 rounded-xl transition-all">
                    <X size={20} />
                  </button>
                </div>

                {modalMode === 'view' ? (
                  <div className="space-y-6">
                    <div className="aspect-[21/9] w-full rounded-2xl bg-primary-50 dark:bg-primary-800 overflow-hidden shadow-inner border border-primary-100 dark:border-primary-700">
                      {formData.imgUrl ? (
                        <img src={formData.imgUrl} className="w-full h-full object-cover" alt="Vehicle" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary-300"><Car size={48} /></div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[
                        { label: t('brandModel'), val: formData.name },
                        { label: t('year'), val: formData.year },
                        { label: t('color'), val: formData.color },
                        { label: t('category'), val: t(formData.category?.toLowerCase()) },
                        { label: t('dailyRate'), val: `€${formData.dailyRate}` },
                        { label: t('mileage'), val: `${Number(formData.mileage).toLocaleString()} km` },
                        { label: t('vin'), val: formData.vin },
                        { label: t('location'), val: formData.location },
                        { label: t('status'), val: t(formData.status?.toLowerCase()) },
                      ].map(item => (
                        <div key={item.label}>
                          <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-0.5">{item.label}</p>
                          <p className="text-sm font-bold text-primary-900 dark:text-white truncate">{item.val || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-primary-50 dark:border-primary-800">
                      <button onClick={closeModal} className="btn-secondary px-8 py-2 text-xs">{t('close')}</button>
                      <button onClick={() => setModalMode('edit')} className="btn-primary px-8 py-2 text-xs">{t('editInstead')}</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {formError && (
                      <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold">
                        <AlertCircle size={16} /> {formError}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-black text-primary-400 dark:text-primary-500 uppercase tracking-widest mb-1.5 block">{t('vehicleName')} *</label>
                          <input 
                            type="text" className="input-field" placeholder="e.g. Porsche Taycan" required
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1.5 block">{t('year')}</label>
                            <input 
                              type="number" className="input-field" max={new Date().getFullYear()}
                              value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1.5 block">{t('category')}</label>
                            <select 
                              className="input-field" value={formData.category}
                              onChange={e => setFormData({...formData, category: e.target.value})}
                            >
                              <option value="Premium">{t('premium')}</option>
                              <option value="Luxury">{t('luxury')}</option>
                              <option value="Electric">{t('electric')}</option>
                              <option value="SUV">{t('suv')}</option>
                              <option value="Compact">{t('compact')}</option>
                            </select>
                          </div>
                        </div>
                         <div>
                          <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1.5 block">{t('vinNumber')} *</label>
                          <input 
                            type="text" className="input-field font-mono" placeholder="17-digit VIN" required
                            value={formData.vin} onChange={e => setFormData({...formData, vin: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1.5 block">{t('imageUrl')} *</label>
                          <input 
                            type="url" className="input-field" placeholder="https://..." required
                            value={formData.imgUrl} onChange={e => setFormData({...formData, imgUrl: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                         <div>
                          <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1.5 block">{t('dailyRateEuro')} *</label>
                          <div className="relative">
                            <Euro size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-300" />
                            <input 
                              type="number" className="input-field pl-9" placeholder="0.00" min="0" required
                              value={formData.dailyRate} onChange={e => setFormData({...formData, dailyRate: e.target.value})}
                            />
                          </div>
                        </div>
                         <div>
                          <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1.5 block">{t('location')}</label>
                          <input 
                            type="text" className="input-field" value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                          />
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1.5 block">{t('color')}</label>
                            <input 
                              type="text" className="input-field" placeholder="Black"
                              value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1.5 block">{t('mileageKm')}</label>
                            <input 
                              type="number" className="input-field" min="0"
                              value={formData.mileage} onChange={e => setFormData({...formData, mileage: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                            <label className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-1.5 block">{t('status')}</label>
                            <select 
                              className="input-field" value={formData.status}
                              onChange={e => setFormData({...formData, status: e.target.value})}
                            >
                              <option value="AVAILABLE">{t('available')}</option>
                              <option value="MAINTENANCE">{t('maintenance')}</option>
                              <option value="RENTED">{t('rented')}</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                     <div className="flex gap-3 mt-8 pt-6 border-t border-primary-50 dark:border-primary-800">
                      <button onClick={closeModal} className="flex-1 btn-secondary py-3">{t('cancel')}</button>
                      <button 
                        onClick={handleSubmit} disabled={isSubmitting}
                        className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        {modalMode === 'add' ? t('addToInventory') : t('saveChanges')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
