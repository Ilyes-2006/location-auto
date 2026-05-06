import { Search, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';


export default function TopBar({ title, subtitle }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="topbar-header h-20 bg-white border-b border-primary-100 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm transition-colors duration-300">
      <div>
        <h1 className="text-xl font-bold text-primary-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-[10px] text-primary-500 font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
          <input
            type="text"
            placeholder={t('search')}
            className="input-field pl-11 w-64 bg-primary-50/50 border-primary-100 text-xs py-2 transition-colors duration-300"
          />
        </div>

        {/* Language Toggle */}
        <div className="flex items-center gap-1.5" title="Language">
          <Globe size={14} className="text-primary-400" />
          <div className="relative flex items-center bg-primary-100 rounded-full p-0.5 transition-colors duration-300">
            <button
              onClick={() => setLang('en')}
              className={`relative z-10 px-2.5 py-1 text-[10px] font-bold rounded-full transition-all duration-300 ${
                lang === 'en'
                  ? 'bg-teal text-white shadow-sm'
                  : 'text-primary-500 hover:text-primary-700'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLang('fr')}
              className={`relative z-10 px-2.5 py-1 text-[10px] font-bold rounded-full transition-all duration-300 ${
                lang === 'fr'
                  ? 'bg-teal text-white shadow-sm'
                  : 'text-primary-500 hover:text-primary-700'
              }`}
            >
              FR
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden lg:block w-px h-8 bg-primary-200" />

        {/* Date */}
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">
            {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long' })}
          </span>
          <span className="text-xs font-bold text-primary-900">
            {new Date().toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>
    </header>
  );
}
