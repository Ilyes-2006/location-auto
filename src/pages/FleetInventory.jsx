import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MapPin, Gauge, Calendar, X, Car, Euro } from 'lucide-react';
import PageTransition from '../components/ui/PageTransition';
import TopBar from '../components/layout/TopBar';
import StatusChip from '../components/ui/StatusChip';
import FuelBar from '../components/ui/FuelBar';
import { vehicleService } from '../services/vehicleService';

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05 + 0.1, duration: 0.3 } }),
};

export default function FleetInventory() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      const data = await vehicleService.getInventory();
      setVehicles(data);
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    year: '2026',
    color: '',
    vin: '',
    dailyRate: '',
    location: 'Paris CDG',
    fuel: 100,
    mileage: 0,
    category: 'Premium',
    imgUrl: ''
  });

  const filtered = vehicles.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddVehicle = async () => {
    try {
      const added = await vehicleService.addVehicle(newVehicle);
      setVehicles([added, ...vehicles]);
      setIsAddModalOpen(false);
      setNewVehicle({
        name: '',
        year: '2026',
        color: '',
        vin: '',
        dailyRate: '',
        location: 'Paris CDG',
        fuel: 100,
        mileage: 0,
        category: 'Premium',
        imgUrl: ''
      });
    } catch (err) {
      console.error('Failed to add vehicle:', err);
    }
  };

  let content;
  if (loading) {
    content = (
      <div className="py-20 flex flex-col items-center justify-center text-primary-400">
        <div className="w-10 h-10 border-4 border-teal/20 border-t-teal rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Loading fleet data...</p>
      </div>
    );
  } else {
    content = (
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary-50 border-b border-primary-200">
                <th className="th">Vehicle</th>
                <th className="th">VIN</th>
                <th className="th">Status</th>
                <th className="th">Location</th>
                <th className="th">Fuel</th>
                <th className="th">Mileage</th>
                <th className="th">Rate/Day</th>
                <th className="th">Last Service</th>
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
                  className="tr"
                >
                  <td className="td">
                    <div>
                      <p className="font-semibold text-primary-900">{v.name}</p>
                      <p className="text-[11px] text-primary-400">{v.id} • {v.year} • {v.color}</p>
                    </div>
                  </td>
                  <td className="td">
                    <span className="font-mono text-xs text-primary-600">{v.vin}</span>
                  </td>
                  <td className="td"><StatusChip status={v.status} /></td>
                  <td className="td">
                    <div className="flex items-center gap-1.5 text-primary-600">
                      <MapPin size={12} className="text-primary-400 shrink-0" />
                      {v.location}
                    </div>
                  </td>
                  <td className="td"><FuelBar level={v.fuel} /></td>
                  <td className="td">
                    <div className="flex items-center gap-1 text-primary-600">
                      <Gauge size={12} className="text-primary-400" />
                      {v.mileage.toLocaleString()} km
                    </div>
                  </td>
                  <td className="td">
                    <span className="font-semibold text-primary-900">€{v.dailyRate}</span>
                  </td>
                  <td className="td">
                    <div className="flex items-center gap-1 text-primary-500">
                      <Calendar size={11} />
                      {v.lastService}
                    </div>
                  </td>
                  <td className="td">
                    <div className="flex items-center gap-1">
                      <button className="btn-secondary py-1 px-2 text-xs">Edit</button>
                      <button className="btn-ghost py-1 px-2 text-xs">View</button>
                    </div>
                  </td>
                </motion.tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-primary-400 text-sm">
                    No vehicles match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="px-4 py-3 bg-primary-50 border-t border-primary-100 flex items-center justify-between">
          <p className="text-xs text-primary-500">
            Showing <span className="font-semibold">{filtered.length}</span> of <span className="font-semibold">{vehicles.length}</span> vehicles
          </p>
          <div className="flex items-center gap-1">
            <button className="btn-ghost py-1 px-3 text-xs">Previous</button>
            <button className="btn-secondary py-1 px-3 text-xs">1</button>
            <button className="btn-ghost py-1 px-3 text-xs">Next</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <TopBar title="Fleet Inventory" subtitle="Manage and monitor your vehicle assets across all locations." />

      <div className="p-6 max-w-[1440px] mx-auto space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
            <div className="relative flex-1 max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
              <input
                className="input-field pl-9 text-xs py-1.5"
                placeholder="Search vehicles…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-1 bg-primary-100 rounded p-0.5">
              {['all', 'available', 'rented', 'maintenance'].map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                    statusFilter === s
                      ? 'bg-white text-primary-900 shadow-sm'
                      : 'text-primary-500 hover:text-primary-800'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="btn-primary"
          >
            <Plus size={14} />
            Add Vehicle
          </button>
        </div>

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="section-card"
        >
          {content}
        </motion.div>
      </div>

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
                      <Car size={20} />
                    </div>
                    <h3 className="text-xl font-bold text-primary-900">Add New Vehicle</h3>
                  </div>
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-2 text-primary-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">Vehicle Name</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. Porsche Taycan"
                        value={newVehicle.name}
                        onChange={e => setNewVehicle({...newVehicle, name: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">Year</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          value={newVehicle.year}
                          onChange={e => setNewVehicle({...newVehicle, year: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">Category</label>
                        <select 
                          className="input-field"
                          value={newVehicle.category}
                          onChange={e => setNewVehicle({...newVehicle, category: e.target.value})}
                        >
                          <option>Premium</option>
                          <option>Luxury</option>
                          <option>Electric</option>
                          <option>SUV</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">VIN Number</label>
                      <input 
                        type="text" 
                        className="input-field font-mono" 
                        placeholder="17-digit VIN"
                        value={newVehicle.vin}
                        onChange={e => setNewVehicle({...newVehicle, vin: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">Image URL</label>
                      <input 
                        type="url" 
                        className="input-field" 
                        placeholder="https://example.com/car.jpg"
                        value={newVehicle.imgUrl}
                        onChange={e => setNewVehicle({...newVehicle, imgUrl: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">Daily Rate (€)</label>
                      <div className="relative">
                        <Euro size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-400" />
                        <input 
                          type="number" 
                          className="input-field pl-9" 
                          placeholder="0.00"
                          value={newVehicle.dailyRate}
                          onChange={e => setNewVehicle({...newVehicle, dailyRate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">Location</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={newVehicle.location}
                        onChange={e => setNewVehicle({...newVehicle, location: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">Color</label>
                        <input 
                          type="text" 
                          className="input-field" 
                          placeholder="e.g. Black"
                          value={newVehicle.color}
                          onChange={e => setNewVehicle({...newVehicle, color: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-primary-500 uppercase tracking-widest mb-1.5 block">Mileage (km)</label>
                        <input 
                          type="number" 
                          className="input-field" 
                          value={newVehicle.mileage}
                          onChange={e => setNewVehicle({...newVehicle, mileage: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8 pt-6 border-t border-primary-100">
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 btn-secondary py-3"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleAddVehicle}
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Add to Inventory
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
