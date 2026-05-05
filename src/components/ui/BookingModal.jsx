import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, UploadCloud, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { reservationService } from '../../services/reservationService';

export default function BookingModal({ car, isOpen, onClose }) {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = useMemo(() => {
    if (!car || !startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return diffDays * (car.daily_rate || car.dailyRate);
  }, [startDate, endDate, car]);

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
        throw new Error("Ce véhicule est déjà réservé pour les dates sélectionnées.");
      }

      // 2. Create reservation
      const result = await reservationService.createReservation({
        userId: user.id,
        vehicleId: car.id,
        startDate,
        endDate,
        totalPrice
      });

      if (result) {
        setStep(2);
      } else {
        throw new Error("La réservation a échoué. Veuillez réessayer.");
      }
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.message || "Une erreur est survenue lors de la réservation.");
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
          className="relative w-full max-w-lg bg-white rounded-xl shadow-lifted overflow-hidden border border-primary-200"
        >
          <div className="px-6 py-4 border-b border-primary-100 flex items-center justify-between bg-primary-50">
            <div>
              <h2 className="text-lg font-bold text-primary-900">Louer {car.brand} {car.model}</h2>
              <p className="text-xs text-primary-500">{formatPrice(car.daily_rate || car.dailyRate)} / jour • {car.category}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-primary-200 text-primary-500 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {step === 1 ? (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-3 text-red-600 text-xs">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-primary-700 uppercase tracking-caps">Date de Début</label>
                    <div className="relative">
                      <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                      <input 
                        type="date" 
                        className="input-field pl-9" 
                        value={startDate}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-primary-700 uppercase tracking-caps">Date de Fin</label>
                    <div className="relative">
                      <CalendarIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                      <input 
                        type="date" 
                        className="input-field pl-9" 
                        value={endDate}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary-50 rounded-lg flex items-center justify-between border border-primary-100">
                  <div className="text-xs text-primary-600 font-medium">Prix Total Estimé</div>
                  <div className="text-xl font-black text-primary-900">{formatPrice(totalPrice)}</div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-primary-700 uppercase tracking-caps">Photo du Permis</label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer
                      ${fileUploaded ? 'border-teal bg-teal/5' : 'border-primary-200 hover:border-teal/50 hover:bg-primary-50'}`}
                    onClick={() => setFileUploaded(true)}
                  >
                    {fileUploaded ? (
                      <div className="flex items-center gap-2 text-teal">
                        <CheckCircle size={18} />
                        <span className="text-sm font-medium">Document Prêt</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={20} className="text-primary-400 mb-2" />
                        <p className="text-[11px] text-primary-500 font-medium">Cliquez pour ajouter votre permis</p>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mb-2">
                  <CheckCircle size={32} className="text-teal" />
                </div>
                <h3 className="text-xl font-bold text-primary-900">Réservation Envoyée !</h3>
                <p className="text-sm text-primary-500 max-w-sm">
                  Votre demande pour {car.brand} {car.model} a été transmise. Montant total : €{totalPrice}.
                </p>
              </motion.div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-primary-100 bg-primary-50 flex justify-end gap-3">
            {step === 1 ? (
              <>
                <button onClick={onClose} className="btn-ghost">Annuler</button>
                <button 
                  onClick={handleBooking}
                  disabled={!startDate || !endDate || !fileUploaded || isSubmitting}
                  className={`btn-primary flex items-center gap-2 ${(!startDate || !endDate || !fileUploaded || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Envoi...' : 'Confirmer la Location'}
                  {!isSubmitting && <ArrowRight size={16} />}
                </button>
              </>
            ) : (
              <button onClick={onClose} className="btn-primary">Fermer</button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
