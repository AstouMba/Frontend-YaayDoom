import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart, BarController, BarElement, CategoryScale, LinearScale,
  DoughnutController, ArcElement, Tooltip, Legend,
} from 'chart.js';
import { getStatistiques } from '../../application/admin';

Chart.register(BarController, BarElement, CategoryScale, LinearScale, DoughnutController, ArcElement, Tooltip, Legend);

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({
    totalMamans: 0,
    totalProfessionnels: 0,
    grossessesActives: 0,
    professionnelsEnAttente: 0,
    grossessesParMois: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    labelsParMois: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
  });
  const barRef = useRef<HTMLCanvasElement>(null);
  const doughnutRef = useRef<HTMLCanvasElement>(null);
  const barInstance = useRef<Chart | null>(null);
  const doughnutInstance = useRef<Chart | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await getStatistiques();
        setStatsData((prev) => ({
          ...prev,
          ...stats,
        }));
      } catch {
        // keep defaults
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    if (barRef.current) {
      barInstance.current?.destroy();
      const ctx = barRef.current.getContext('2d');
      if (ctx) {
        barInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: statsData.labelsParMois,
            datasets: [{ label: 'Nouvelles grossesses', data: statsData.grossessesParMois, backgroundColor: '#2F8F83', borderRadius: 5 }],
          },
          options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, grid: { color: '#f3f4f6' } }, x: { grid: { display: false } } },
          },
        });
      }
    }
    if (doughnutRef.current) {
      doughnutInstance.current?.destroy();
      const ctx = doughnutRef.current.getContext('2d');
      if (ctx) {
        doughnutInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Mamans', 'Professionnels'],
            datasets: [{ data: [statsData.totalMamans, statsData.totalProfessionnels], backgroundColor: ['#2F8F83', '#E46A3C'], borderWidth: 0 }],
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } },
        });
      }
    }
    return () => { barInstance.current?.destroy(); doughnutInstance.current?.destroy(); };
  }, [statsData.grossessesParMois, statsData.labelsParMois, statsData.totalMamans, statsData.totalProfessionnels]);

  const statsCards = [
    { label: 'Total Mamans', value: statsData.totalMamans, trend: 'à jour', icon: 'ri-parent-line', color: 'var(--primary-teal)' },
    { label: 'Professionnels', value: statsData.totalProfessionnels, trend: 'à jour', icon: 'ri-stethoscope-line', color: 'var(--primary-orange)' },
    { label: 'Grossesses actives', value: statsData.grossessesActives, trend: 'à jour', icon: 'ri-heart-pulse-line', color: 'var(--primary-teal)' },
    { label: 'En attente', value: statsData.professionnelsEnAttente, trend: 'validation requise', icon: 'ri-time-line', color: 'var(--primary-orange)' },
  ];

  const activiteRecente = [
    { icon: 'ri-user-add-line', color: 'var(--primary-teal)', message: 'Nouvelle inscription maman', detail: 'Fatou Diop · Il y a 2 heures' },
    { icon: 'ri-stethoscope-line', color: 'var(--primary-orange)', message: 'Demande validation professionnel', detail: 'Dr. Aminata Ba · Il y a 5 heures' },
    { icon: 'ri-heart-pulse-line', color: 'var(--primary-teal)', message: 'Nouvelle grossesse enregistrée', detail: 'Mariama Sow · Il y a 1 jour' },
    { icon: 'ri-check-line', color: '#10b981', message: 'Professionnel validé', detail: 'Dr. Moussa Diop · Il y a 2 jours' },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: 'var(--dark-brown)' }}>Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-0.5">Vue d'ensemble de la plateforme YaayDoom+</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map(s => (
          <div key={s.label} className="bg-white rounded-lg p-4 border" style={{ borderColor: '#EAD7C8' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                <i className={`${s.icon} text-base`} style={{ color: s.color }}></i>
              </div>
              <span className="text-xs text-green-600">{s.trend}</span>
            </div>
            <p className="text-2xl font-bold mb-0.5" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#EAD7C8' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--dark-brown)' }}>
            <i className="ri-bar-chart-line mr-2" style={{ color: 'var(--primary-teal)' }}></i>
            Grossesses par mois
          </h3>
          <div className="h-56"><canvas ref={barRef}></canvas></div>
        </div>

        <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#EAD7C8' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--dark-brown)' }}>
            <i className="ri-pie-chart-line mr-2" style={{ color: 'var(--primary-orange)' }}></i>
            Répartition utilisateurs
          </h3>
          <div className="h-56"><canvas ref={doughnutRef}></canvas></div>
        </div>
      </div>

      {/* Professionnels par spécialité + Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#EAD7C8' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--dark-brown)' }}>
            <i className="ri-stethoscope-line mr-2" style={{ color: 'var(--primary-teal)' }}></i>
            Par spécialité
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Gynécologues', count: 8, color: 'var(--primary-teal)' },
              { label: 'Sages-femmes', count: 10, color: 'var(--primary-orange)' },
              { label: 'Pédiatres', count: 5, color: 'var(--primary-teal)' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                <span className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>{s.label}</span>
                <span className="text-lg font-bold" style={{ color: s.color }}>{s.count}</span>
              </div>
            ))}
          </div>
          <button onClick={() => navigate('/admin/validation')}
            className="mt-4 w-full py-2.5 rounded-lg text-sm font-medium border cursor-pointer hover:bg-gray-50 whitespace-nowrap transition-all"
            style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}>
            <i className="ri-user-add-line mr-1.5"></i>
            Voir les demandes ({statsData.professionnelsEnAttente})
          </button>
        </div>

        <div className="bg-white rounded-lg p-5 border" style={{ borderColor: '#EAD7C8' }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--dark-brown)' }}>
            <i className="ri-time-line mr-2" style={{ color: 'var(--primary-teal)' }}></i>
            Activité récente
          </h3>
          <div className="space-y-3">
            {activiteRecente.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                <div className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: a.color }}>
                  <i className={`${a.icon} text-white text-sm`}></i>
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>{a.message}</p>
                  <p className="text-xs text-gray-500">{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
