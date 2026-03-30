import { useAuth } from '../context/AuthContext';

export default function TopBar() {
  const { user } = useAuth();

  return (
    <div className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-end px-4 sm:px-6">
      {/* Profil utilisateur */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
          <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
        </div>
        <div 
          className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-[var(--primary-teal)]"
        >
          <i className="ri-user-line text-white text-base sm:text-lg"></i>
        </div>
      </div>
    </div>
  );
}