import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/dashboard-maman' || path === '/dashboard-pro') {
      return location.pathname === path;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const mamanLinks = [
    { path: '/dashboard-maman', icon: 'ri-dashboard-line', label: 'Tableau de bord' },
    { path: '/dashboard-maman/grossesse', icon: 'ri-heart-pulse-line', label: 'Ma Grossesse' },
    { path: '/dashboard-maman/rendez-vous', icon: 'ri-calendar-check-line', label: 'Rendez-vous' },
    { path: '/dashboard-maman/bebe', icon: 'ri-baby-line', label: 'Bébé' },
    { path: '/dashboard-maman/vaccination', icon: 'ri-syringe-line', label: 'Vaccination' },
  ];

  const proLinks = [
    { path: '/dashboard-pro', icon: 'ri-dashboard-line', label: 'Tableau de bord' },
    { path: '/dashboard-pro/scan', icon: 'ri-qr-scan-line', label: 'Scanner Patient' },
    { path: '/dashboard-pro/consultations', icon: 'ri-stethoscope-line', label: 'Consultations' },
    { path: '/dashboard-pro/grossesses', icon: 'ri-heart-pulse-line', label: 'Grossesses' },
    { path: '/dashboard-pro/vaccinations', icon: 'ri-syringe-line', label: 'Vaccinations' },
  ];

  const getLinks = () => {
    if (user?.role === 'maman') return mamanLinks;
    if (user?.role === 'professionnel') return proLinks;
    return [];
  };

  const links = getLinks();

  return (
    <>
      {/* Hamburger Button - Mobile */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-teal-600 text-white shadow-lg lg:hidden"
        >
          <i className={`${isOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
        </button>
      )}

      {/* Overlay - Mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen w-64 bg-[var(--primary-teal)] flex flex-col z-50
        transition-transform duration-300 lg:translate-x-0
        ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''}
      `}>
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20">
              <i className="ri-heart-pulse-fill text-white text-xl"></i>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">YaayDoom+</h1>
              <p className="text-xs text-white/60 capitalize">{user?.role === 'professionnel' ? 'Professionnel' : 'Maman'}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                isActive(link.path)
                  ? 'bg-white text-[var(--primary-teal)]'
                  : 'text-white/85 hover:bg-white/10'
              }`}
            >
              <i className={`${link.icon} text-base`}></i>
              <span className="text-sm font-medium whitespace-nowrap">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer text-white/80 hover:bg-white/10"
          >
            <i className="ri-logout-box-line text-base"></i>
            <span className="text-sm font-medium whitespace-nowrap">Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
