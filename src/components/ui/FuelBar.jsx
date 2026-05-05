export default function FuelBar({ level }) {
  const color =
    level > 60 ? 'bg-teal' : level > 25 ? 'bg-amber-400' : 'bg-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-primary-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${level}%` }}
        />
      </div>
      <span className="text-xs text-primary-500">{level}%</span>
    </div>
  );
}
