import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getStatistiques } from '../../application/admin';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  Tooltip,
  Legend
);

const Statistiques = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    totalMamans: 0,
    totalProfessionnels: 0,
    grossessesActives: 0,
    consultationsTotal: 0,
    grossessesParMois: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    labelsParMois: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  });
  const chartGrossessesRef = useRef<HTMLCanvasElement>(null);
  const chartUtilisateursRef = useRef<HTMLCanvasElement>(null);
  const chartGrossessesInstance = useRef<Chart | null>(null);
  const chartUtilisateursInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getStatistiques();
        setStats({
          totalMamans: data.totalMamans ?? 0,
          totalProfessionnels: data.totalProfessionnels ?? 0,
          grossessesActives: data.grossessesActives ?? 0,
          consultationsTotal: data.consultationsTotal ?? 0,
          grossessesParMois: data.grossessesParMois ?? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          labelsParMois: data.labelsParMois ?? ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        });
      } catch {
        // keep fallback values
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    if (chartGrossessesRef.current) {
      if (chartGrossessesInstance.current) {
        chartGrossessesInstance.current.destroy();
      }
      const ctx = chartGrossessesRef.current.getContext('2d');
      if (ctx) {
        chartGrossessesInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: stats.labelsParMois.slice(0, 6),
            datasets: [{
              label: 'Nouvelles grossesses',
              data: stats.grossessesParMois.slice(0, 6),
              backgroundColor: '#2F8F83',
              borderRadius: 6,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
              x: { grid: { display: false } },
            },
          },
        });
      }
    }

    if (chartUtilisateursRef.current) {
      if (chartUtilisateursInstance.current) {
        chartUtilisateursInstance.current.destroy();
      }
      const ctx = chartUtilisateursRef.current.getContext('2d');
      if (ctx) {
        chartUtilisateursInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Mamans', 'Professionnels'],
            datasets: [{
              data: [stats.totalMamans, stats.totalProfessionnels],
              backgroundColor: ['#2F8F83', '#E46A3C'],
              borderWidth: 0,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } },
          },
        });
      }
    }

    return () => {
      chartGrossessesInstance.current?.destroy();
      chartUtilisateursInstance.current?.destroy();
    };
  }, [stats.grossessesParMois, stats.labelsParMois, stats.totalMamans, stats.totalProfessionnels]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--background-main)' }}>
      {/* Sidebar Admin */}
      <aside className="w-64 min-h-screen shadow-sm fixed left-0 top-0" style={{ backgroundColor: 'var(--primary-teal)' }}>
        <div className="p-5">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/20">
              <i className="ri-heart-pulse-line text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold text-white">YaayDoom+</span>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => navigate('/dashboard-admin')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 font-medium text-sm transition-colors cursor-pointer"
            >
              <i className="ri-dashboard-line text-base"></i>
              <span>Tableau de bord</span>
            </button>
            <button 
              onClick={() => navigate('/admin/validation')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 font-medium text-sm transition-colors cursor-pointer"
            >
              <i className="ri-user-add-line text-base"></i>
              <span>Validation</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20 text-white font-medium text-sm transition-colors cursor-pointer">
              <i className="ri-bar-chart-box-line text-base"></i>
              <span>Statistiques</span>
            </button>
            <button 
              onClick={() => navigate('/admin/utilisateurs')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 font-medium text-sm transition-colors cursor-pointer"
            >
              <i className="ri-team-line text-base"></i>
              <span>Utilisateurs</span>
            </button>
          </nav>

          {/* Déconnexion */}
          <div className="absolute bottom-5 left-5 right-5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 font-medium text-sm transition-colors cursor-pointer"
            >
              <i className="ri-logout-box-line text-base"></i>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 ml-64">
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--dark-brown)' }}>Statistiques</h1>
              <p className="text-xs text-gray-600 mt-1">Analyse de l'activité de la plateforme</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold" style={{ color: 'var(--dark-brown)' }}>Admin</p>
                <p className="text-xs text-gray-600">Administrateur</p>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-full" style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                <i className="ri-shield-user-line text-lg"></i>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Statistiques clés */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Mamans</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--primary-teal)' }}>{stats.totalMamans}</p>
                  <p className="text-xs text-green-600 mt-1">+12 ce mois</p>
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                  <i className="ri-parent-line text-xl" style={{ color: 'var(--primary-teal)' }}></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Professionnels</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--primary-orange)' }}>{stats.totalProfessionnels}</p>
                  <p className="text-xs text-green-600 mt-1">+3 ce mois</p>
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                  <i className="ri-stethoscope-line text-xl" style={{ color: 'var(--primary-orange)' }}></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Grossesses actives</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--primary-teal)' }}>{stats.grossessesActives}</p>
                  <p className="text-xs text-green-600 mt-1">+8 ce mois</p>
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                  <i className="ri-heart-pulse-line text-xl" style={{ color: 'var(--primary-teal)' }}></i>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Consultations</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--primary-orange)' }}>{stats.consultationsTotal}</p>
                  <p className="text-xs text-green-600 mt-1">+45 ce mois</p>
                </div>
                <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                  <i className="ri-calendar-check-line text-xl" style={{ color: 'var(--primary-orange)' }}></i>
                </div>
              </div>
            </div>
          </div>

          {/* Graphiques */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique Grossesses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--dark-brown)' }}>
                <i className="ri-line-chart-line" style={{ color: 'var(--primary-teal)' }}></i>
                Nouvelles grossesses par mois
              </h3>
              <div className="h-64">
                <canvas ref={chartGrossessesRef}></canvas>
              </div>
            </div>

            {/* Graphique Utilisateurs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5">
              <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--dark-brown)' }}>
                <i className="ri-pie-chart-line" style={{ color: 'var(--primary-orange)' }}></i>
                Répartition des utilisateurs
              </h3>
              <div className="h-64 flex items-center justify-center">
                <canvas ref={chartUtilisateursRef}></canvas>
              </div>
            </div>
          </div>

          {/* Activité par spécialité */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 mt-6">
            <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--dark-brown)' }}>
              <i className="ri-stethoscope-line" style={{ color: 'var(--primary-teal)' }}></i>
              Professionnels par spécialité
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                    <i className="ri-user-heart-line text-sm"></i>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--dark-brown)' }}>Gynécologues</span>
                </div>
                <span className="text-lg font-bold" style={{ color: 'var(--primary-teal)' }}>
                  {Math.max(1, Math.round(stats.totalProfessionnels * 0.35))}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary-orange)', color: 'white' }}>
                    <i className="ri-parent-line text-sm"></i>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--dark-brown)' }}>Sages-femmes</span>
                </div>
                <span className="text-lg font-bold" style={{ color: 'var(--primary-orange)' }}>
                  {Math.max(1, Math.round(stats.totalProfessionnels * 0.45))}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                    <i className="ri-heart-pulse-line text-sm"></i>
                  </div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--dark-brown)' }}>Pédiatres</span>
                </div>
                <span className="text-lg font-bold" style={{ color: 'var(--primary-teal)' }}>
                  {Math.max(1, Math.round(stats.totalProfessionnels * 0.2))}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Statistiques;
