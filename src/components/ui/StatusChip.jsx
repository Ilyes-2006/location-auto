export default function StatusChip({ status }) {
  const s = status?.toLowerCase() || '';
  
  if (s === 'pending') {
    return <span className="text-[10px] font-bold uppercase tracking-caps px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">Pending</span>;
  }
  if (s === 'confirmed') {
    return <span className="text-[10px] font-bold uppercase tracking-caps px-2.5 py-1 rounded-full border bg-teal/10 text-teal border-teal/20">Confirmed</span>;
  }
  if (s === 'active') {
    return <span className="text-[10px] font-bold uppercase tracking-caps px-2.5 py-1 rounded-full border bg-blue-50 text-blue-700 border-blue-200">Active</span>;
  }
  if (s === 'completed') {
    return <span className="text-[10px] font-bold uppercase tracking-caps px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">Completed</span>;
  }
  if (s === 'cancelled') {
    return <span className="text-[10px] font-bold uppercase tracking-caps px-2.5 py-1 rounded-full border bg-red-50 text-red-600 border-red-200">Cancelled</span>;
  }

  // Fallback for older statuses
  const map = {
    available:   { label: 'Available',    cls: 'chip-available' },
    rented:      { label: 'Rented',       cls: 'chip-rented' },
    maintenance: { label: 'Maintenance',  cls: 'chip-maintenance' },
    inactive:    { label: 'Inactive',     cls: 'chip-rented' },
  };
  const { label, cls } = map[s] ?? { label: status, cls: 'bg-primary-50 text-primary-600 border-primary-200' };
  return <span className={`chip ${cls}`}>{label}</span>;
}
