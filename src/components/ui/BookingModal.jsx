import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, UploadCloud, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useLanguage } from '../../context/LanguageContext';
import { reservationService } from '../../services/reservationService';

export default function BookingModal({ car, isOpen, onClose }) {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [licenseUrl, setLicenseUrl] = useState('');
  const [error, setError] = useState('');

  const totalPrice = useMemo(() => {
    if (!car || !startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays * (car.daily_rate || car.dailyRate);
  }, [startDate, endDate, car]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLicenseUrl(reader.result);
        setFileUploaded(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBooking = async () => {
    if (!user) return;
    setIsSubmitting(true);
    setError('');
    
    try {
      // 1. Check availability
      const isAvailable = await reservationService.checkVehicleAvailability(
        car.id,
        startDate,
        endDate
      );

      if (!isAvailable) {
        throw new Error(t('alreadyBookedDates'));
      }

      // 2. Create reservation
      const result = await reservationService.createReservation({
        userId: user.id,
        vehicleId: car.id,
        startDate,
        endDate,
        totalPrice,
        licenseUrl: licenseUrl
      });

      if (result) {
        setStep(2);
      } else {
        throw new Error(t('bookingFailed'));
      }
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.message || t('unexpectedError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !car) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-primary-900 rounded-xl shadow-lifted overflow-hidden border border-primary-200 dark:border-primary-800"
        >
          <div className="px-6 py-4 border-b border-primary-100 dark:border-primary-800 flex items-center justify-between bg-primary-50 dark:bg-primary-800/50">
            <div>
              <h2 className="text-lg font-bold text-primary-900 dark:text-white">
                {t('rentVehicle', { brand: car.brand, model: car.model })}
              </h2>
              <p className="text-xs text-primary-500 dark:text-primary-400">
                {formatPrice(car.daily_rate || car.dailyRate)} / {t('perDay')} • {car.category}
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-primary-200 dark:hover:bg-primary-700 text-primary-500 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {step === 1 ? (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400 text-xs">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-caps">
                      {t('startDate')}
                    </label>
                    <div className="relative">
                      <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                      <input 
                         type="date" 
                         className="input-field pl-9 dark:bg-primary-800 dark:border-primary-700 dark:text-white" 
                         value={startDate}
                         min={new Date().toISOString().split('T')[0]}
                         onChange={(e) => setStartDate(e.target.value)}
                       />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-caps">
                      {t('endDate')}
                    </label>
                    <div className="relative">
                      <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                      <input 
                         type="date" 
                         className="input-field pl-9 dark:bg-primary-800 dark:border-primary-700 dark:text-white" 
                         value={endDate}
                         min={startDate || new Date().toISOString().split('T')[0]}
                         onChange={(e) => setEndDate(e.target.value)}
                       />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary-50 dark:bg-primary-800/50 rounded-lg flex items-center justify-between border border-primary-100 dark:border-primary-800">
                  <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">{t('estTotal')}</div>
                  <div className="text-xl font-black text-primary-900 dark:text-white">{formatPrice(totalPrice)}</div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-caps">
                    {t('licensePhoto')}
                  </label>
                  <label 
                     className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer
                       ${fileUploaded ? 'border-teal bg-teal/5' : 'border-primary-200 dark:border-primary-700 hover:border-teal/50 hover:bg-primary-50 dark:hover:bg-primary-800'}`}
                   >
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                    {fileUploaded ? (
                       <div className="flex flex-col items-center gap-2 text-teal">
                         {licenseUrl && <img src={licenseUrl} className="w-20 h-12 object-cover rounded mb-1" alt="License preview" />}
                         <div className="flex items-center gap-2">
                           <CheckCircle size={18} />
                           <span className="text-sm font-medium">{t('docReady')}</span>
                         </div>
                       </div>
                    ) : (
                       <>
                         <UploadCloud size={20} className="text-primary-400 mb-2" />
                         <p className="text-[11px] text-primary-500 dark:text-primary-400 font-medium">{t('clickToAddLicense')}</p>
                       </>
                    )}
                  </label>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mb-2">
                  <CheckCircle size={32} className="text-teal" />
                </div>
                <h3 className="text-xl font-bold text-primary-900 dark:text-white">{t('resSent')}</h3>
                <p className="text-sm text-primary-500 dark:text-primary-400 max-w-sm">
                  {t('resSentDesc', { brand: car.brand, model: car.model, price: formatPrice(totalPrice) })}
                </p>
              </motion.div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-primary-100 dark:border-primary-800 bg-primary-50 dark:bg-primary-800/50 flex justify-end gap-3">
            {step === 1 ? (
              <>
                <button onClick={onClose} className="btn-ghost dark:text-primary-300">{t('cancel')}</button>
                <button 
                  onClick={handleBooking}
                  disabled={!startDate || !endDate || !fileUploaded || isSubmitting}
                  className={`btn-primary flex items-center gap-2 ${(!startDate || !endDate || !fileUploaded || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? t('sending') : t('confirmBooking')}
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </>
            ) : (
              <button onClick={onClose} className="btn-primary">{t('close')}</button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
