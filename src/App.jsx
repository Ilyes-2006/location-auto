import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import AdminLayout from './components/layout/AdminLayout';
import ClientLayout from './components/layout/ClientLayout';

// Admin Pages
import Dashboard from './pages/Dashboard';
import FleetInventory from './pages/FleetInventory';
import CarCatalog from './pages/CarCatalog';
import Customers from './pages/Customers';
import AdminReservations from './pages/AdminReservations';
import SettingsPage from './pages/SettingsPage';
import AdminProfile from './pages/AdminProfile';

// Client Pages
import UserCatalog from './pages/client/UserCatalog';
import MyReservations from './pages/client/MyReservations';
import UserProfile from './pages/client/UserProfile';
import UserSettings from './pages/client/UserSettings';
// Global Pages
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/client/catalog" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requireSuperuser={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true,           element: <Dashboard /> },
      { path: 'inventory',     element: <FleetInventory /> },
      { path: 'reservations',  element: <AdminReservations /> },
      { path: 'customers',     element: <Customers /> },
      { path: 'profile',       element: <AdminProfile /> },
      { path: 'settings',      element: <SettingsPage /> },
      { path: '*',             element: <Navigate to="/admin" replace /> },
    ],
  },
  {
    path: '/client',
    element: <ClientLayout />,
    children: [
      { path: 'catalog',      element: <UserCatalog /> },
      { 
        path: 'reservations', 
        element: (
          <ProtectedRoute>
            <MyReservations />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'profile',      
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ) 
      },
      { 
        path: 'settings',      
        element: (
          <ProtectedRoute>
            <UserSettings />
          </ProtectedRoute>
        ) 
      },
      { path: '*',            element: <Navigate to="/client/catalog" replace /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

import { CurrencyProvider } from './context/CurrencyContext';

export default function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}
