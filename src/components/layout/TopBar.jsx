import { Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function TopBar({ title, subtitle }) {
  const { t } = useLanguage();

  return (
    <header className="h-20 bg-white border-b border-primary-100 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
      <div>
        <h1 className="text-xl font-bold text-primary-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-[10px] text-primary-500 font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
          <input
            type="text"
            placeholder={t('search')}
            className="input-field pl-11 w-64 bg-primary-50/50 border-primary-100 text-xs py-2"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Date */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
              {new Date().toLocaleDateString(t('lang') === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long' })}
            </span>
            <span className="text-xs font-bold text-primary-900">
              {new Date().toLocaleDateString(t('lang') === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
