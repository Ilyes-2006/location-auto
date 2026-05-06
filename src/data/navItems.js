import { LayoutDashboard, Car, CalendarDays, Users, Settings, User } from 'lucide-react';

export const adminNavItems = [
  { path: '/admin',              labelKey: 'dashboard',     icon: LayoutDashboard },
  { path: '/admin/inventory',    labelKey: 'inventory',     icon: Car },
  { path: '/admin/reservations', labelKey: 'reservations',  icon: CalendarDays },
  { path: '/admin/customers',    labelKey: 'customers',     icon: Users },
  { path: '/admin/settings',     labelKey: 'settings',      icon: Settings },
];

export const clientNavItems = [
  { path: '/client/catalog',       labelKey: 'catalog',          icon: Car },
  { path: '/client/reservations',  labelKey: 'myReservations',   icon: CalendarDays },
  { path: '/client/profile',       labelKey: 'profile',          icon: User },
  { path: '/client/settings',      labelKey: 'settings',         icon: Settings },
];
