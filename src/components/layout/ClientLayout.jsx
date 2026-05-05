import { Outlet } from 'react-router-dom';
import ClientSidebar from './ClientSidebar';

export default function ClientLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <ClientSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
