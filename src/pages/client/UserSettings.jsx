import { motion } from 'framer-motion';
import { User, Globe, ChevronRight, Check } from 'lucide-react';
import PageTransition from '../../components/ui/PageTransition';
import TopBar from '../../components/layout/TopBar';
import { useLanguage } from '../../context/LanguageContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useState } from 'react';

export default function UserSettings() {
  const { lang, setLang, t } = useLanguage();
  const { currency, setCurrency } = useCurrency();
  const [activeTab, setActiveTab] = useState('Account');

  const settingsGroups = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Profile Information', sub: 'Name, email, and profile photo', type: 'link' },
        { label: 'Change Password', sub: 'Update your credentials', type: 'link' },
      ],
    },
    {
      title: 'Regional',
      icon: Globe,
      items: [
        { 
          label: 'Language', 
          sub: 'Choose your preferred language', 
          type: 'select', 
          options: [
            { val: 'en', label: 'English (US)' },
            { val: 'fr', label: 'Français (FR)' }
          ],
          current: lang,
          onSelect: setLang
        },
        { 
          label: 'Currency', 
          sub: 'Choose your preferred currency', 
          type: 'select',
          options: [
            { val: 'EUR', label: 'Euro (€)' },
            { val: 'USD', label: 'US Dollar ($)' },
            { val: 'DZD', label: 'Algerian Dinar (DA)' }
          ],
          current: currency,
          onSelect: setCurrency
        },
      ],
    },
  ];

  return (
    <PageTransition>
      <TopBar title="Settings" subtitle="Manage your account and preferences." />

      <div className="p-6 max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 space-y-1.5">
          {settingsGroups.map((group) => {
            const Icon = group.icon;
            const isActive = activeTab === group.title;
            return (
              <button
                key={group.title}
                onClick={() => setActiveTab(group.title)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-teal text-white shadow-lg shadow-teal/20' 
                    : 'text-primary-500 hover:bg-primary-100/50 hover:text-primary-900'
                }`}
              >
                <Icon size={18} />
                {group.title}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {settingsGroups.filter(g => g.title === activeTab).map((group) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="section-card"
            >
              <div className="px-6 py-4 border-b border-primary-50 bg-primary-50/30">
                <h3 className="text-lg font-bold text-primary-900">{group.title}</h3>
              </div>
              
              <div className="divide-y divide-primary-50">
                {group.items.map((item) => (
                  <div key={item.label} className="p-6 flex items-center justify-between group">
                    <div>
                      <p className="text-sm font-bold text-primary-800 group-hover:text-teal transition-colors">{item.label}</p>
                      <p className="text-xs text-primary-400 mt-1">{item.sub}</p>
                    </div>

                    {item.type === 'link' && <ChevronRight size={18} className="text-primary-300" />}
                    
                    {item.type === 'select' && (
                      <div className="flex gap-2">
                        {item.options.map(opt => (
                          <button
                            key={opt.val}
                            onClick={() => item.onSelect(opt.val)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-caps transition-all border ${
                              item.current === opt.val 
                                ? 'bg-teal text-white border-teal shadow-md' 
                                : 'bg-white border-primary-200 text-primary-500 hover:border-primary-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <div className="flex justify-end gap-3 pt-4">
            <button className="btn-ghost">Cancel</button>
            <button className="btn-primary flex items-center gap-2">
              <Check size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
