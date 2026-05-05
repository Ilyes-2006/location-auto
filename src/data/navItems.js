import { LayoutDashboard, Car, CalendarDays, Users, Settings, User } from 'lucide-react';

export const adminNavItems = [
  { path: '/admin',              label: 'Dashboard',     icon: LayoutDashboard },
  { path: '/admin/inventory',    label: 'Inventory',     icon: Car },
  { path: '/admin/reservations', label: 'Reservations',  icon: CalendarDays },
  { path: '/admin/customers',    label: 'Customers',     icon: Users },
  { path: '/admin/settings',     label: 'Settings',      icon: Settings },
];

export const clientNavItems = [
  { path: '/client/catalog',       label: 'Catalog',          icon: Car },
  { path: '/client/reservations',  label: 'My Reservations',  icon: CalendarDays },
  { path: '/client/profile',       label: 'Profile',          icon: User },
  { path: '/client/settings',      label: 'Settings',         icon: Settings },
];
