import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const mamanLinks = [
    { path: '/dashboard-maman', icon: 'ri-home-4-line', activeIcon: 'ri-home-4-fill', label: 'Accueil' },
    { path: '/dashboard-maman/grossesse', icon: 'ri-heart-pulse-line', activeIcon: 'ri-heart-pulse-fill', label: 'Grossesse' },
    { path: '/dashboard-maman/rendez-vous', icon: 'ri-calendar-check-line', activeIcon: 'ri-calendar-check-fill', label: 'RDV' },
    { path: '/dashboard-maman/bebe', icon: 'ri-baby-line', activeIcon: 'ri-baby-fill', label: 'Bébé' },
  ];

  if (user?.role !== 'maman') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg lg:hidden z-40">
      <div className="flex justify-around py-2">
        {mamanLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
              isActive(link.path) ? 'text-teal-600' : 'text-gray-500'
            }`}
          >
            <i className={`${isActive(link.path) ? link.activeIcon : link.icon} text-xl`}></i>
            <span className="text-xs font-medium">{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
