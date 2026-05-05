import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    dashboard: 'Dashboard',
    inventory: 'Inventory',
    catalog: 'Catalog',
    customers: 'Customers',
    notifications: 'Notifications',
    settings: 'Settings',
    profile: 'Profile',
    reservations: 'Reservations',
    signOut: 'Sign Out',
    search: 'Search...',
    available: 'Available',
    booked: 'Booked',
    reserve: 'Reserve',
    dailyRate: 'daily',
    seats: 'seats',
    transmission: 'Transmission',
    range: 'Range',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    confirmSignOut: 'Confirm Sign Out',
    areYouSure: 'Are you sure you want to end your current session?',
    fleetManagement: 'Fleet Management',
    clientPortal: 'Client Portal',
  },
  fr: {
    dashboard: 'Tableau de bord',
    inventory: 'Inventaire',
    catalog: 'Catalogue',
    customers: 'Clients',
    notifications: 'Notifications',
    settings: 'Paramètres',
    profile: 'Profil',
    reservations: 'Réservations',
    signOut: 'Déconnexion',
    search: 'Rechercher...',
    available: 'Disponible',
    booked: 'Réservé',
    reserve: 'Réserver',
    dailyRate: 'par jour',
    seats: 'sièges',
    transmission: 'Transmission',
    range: 'Autonomie',
    saveChanges: 'Enregistrer',
    cancel: 'Annuler',
    confirmSignOut: 'Confirmer la déconnexion',
    areYouSure: 'Êtes-vous sûr de vouloir mettre fin à votre session ?',
    fleetManagement: 'Gestion de Flotte',
    clientPortal: 'Portail Client',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('auto_loc_lang');
    return saved || 'fr'; // Default to French as requested/implied
  });

  useEffect(() => {
    localStorage.setItem('auto_loc_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
