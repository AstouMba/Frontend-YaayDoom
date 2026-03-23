import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardAdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const adminLinks = [
    { path: '/dashboard-admin', icon: 'ri-dashboard-line', label: 'Tableau de bord' },
    { path: '/admin/validation', icon: 'ri-user-add-line', label: 'Validation' },
    { path: '/admin/utilisateurs', icon: 'ri-team-line', label: 'Utilisateurs' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--background-main)' }}>
      {/* Sidebar Admin */}
      <aside className="w-64 h-screen fixed left-0 top-0 flex flex-col" style={{ backgroundColor: 'var(--primary-teal)' }}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20">
              <i className="ri-heart-pulse-fill text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">YaayDoom+</h1>
              <p className="text-xs text-white/60">Administration</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1">
          {adminLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${
                isActive(link.path)
                  ? 'bg-white text-[var(--primary-teal)]'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <i className={`${link.icon} text-base`}></i>
              <span>{link.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            <i className="ri-logout-box-line text-base"></i>
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 ml-64 flex flex-col overflow-hidden">
        {/* TopBar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--dark-brown)' }}>
              {adminLinks.find(l => isActive(l.path))?.label || 'Administration'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold" style={{ color: 'var(--dark-brown)' }}>{user?.name}</p>
              <p className="text-xs text-gray-500">Administrateur</p>
            </div>
            <div className="w-9 h-9 flex items-center justify-center rounded-full" style={{ backgroundColor: 'var(--primary-teal)' }}>
              <i className="ri-shield-user-line text-white text-base"></i>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
