import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { mockBebes, mockCroissanceBebe, mockVaccins } from '../../mocks/db';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

type Tab = 'infos' | 'croissance' | 'historique';

export default function Bebe() {
  const [activeTab, setActiveTab] = useState<Tab>('infos');

  const bebe = mockBebes[0];
  const croissance = mockCroissanceBebe;
  const vaccins = mockVaccins;

  const vaccinsDone = vaccins.filter(v => v.statut === 'completed');
  const vaccinsUpcoming = vaccins.filter(v => v.statut !== 'completed');

  const croissanceChartData = {
    labels: croissance.map(d => d.label),
    datasets: [
      {
        label: 'Poids (kg)',
        data: croissance.map(d => d.poids),
        borderColor: '#E46A3C',
        backgroundColor: 'rgba(228,106,60,0.08)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: 'Taille (cm)',
        data: croissance.map(d => d.taille),
        borderColor: '#2F8F83',
        backgroundColor: 'rgba(47,143,131,0.08)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
      },
    ],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const } },
    scales: {
      y: { position: 'left' as const, beginAtZero: false, title: { display: true, text: 'Poids (kg)' } },
      y1: { position: 'right' as const, beginAtZero: false, grid: { drawOnChartArea: false }, title: { display: true, text: 'Taille (cm)' } },
    },
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'infos', label: 'Informations', icon: 'ri-information-line' },
    { id: 'croissance', label: 'Croissance', icon: 'ri-line-chart-line' },
    { id: 'historique', label: 'Historique', icon: 'ri-history-line' },
  ];

  return (
    <div className="p-6 max-w-full">
      {/* Header Card */}
      <div className="relative mb-6 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-700"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-30"></div>
        <div className="relative p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center">
              <i className="ri-baby-line text-white text-2xl sm:text-3xl"></i>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{bebe.nom}</h1>
              <p className="text-orange-100 text-sm">{bebe.ageActuel} · {bebe.sexe}</p>
            </div>
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium hover:bg-white/30 transition-colors cursor-pointer w-full sm:w-auto text-sm">
            <i className="ri-download-line"></i>Télécharger
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 sm:px-4 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <i className={`${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── Tab : Informations ──────────────────────────────────────── */}
      {activeTab === 'infos' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* General Info Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <i className="ri-information-line text-teal-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Informations générales</h3>
              </div>
              <div className="space-y-4">
                {[
                  { icon: 'ri-calendar-line', color: 'teal', label: 'Né(e) le', value: new Date(bebe.dateNaissance).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { icon: 'ri-user-3-line', color: 'orange', label: 'Sexe', value: bebe.sexe },
                  { icon: 'ri-drop-line', color: 'teal', label: 'Groupe sanguin', value: bebe.groupeSanguin },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                    <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${item.color === 'teal' ? 'bg-teal-100' : 'bg-orange-100'}`}>
                      <i className={`${item.icon} ${item.color === 'teal' ? 'text-teal-600' : 'text-orange-500'}`}></i>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Measures Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <i className="ri-scales-3-line text-orange-500 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Mesures actuelles</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: 'ri-scales-3-line', color: 'orange', label: 'Poids', value: `${bebe.poidsActuel} kg`, diff: `+${(bebe.poidsActuel - bebe.poidsNaissance).toFixed(1)} kg` },
                  { icon: 'ri-ruler-line', color: 'teal', label: 'Taille', value: `${bebe.tailleActuelle} cm`, diff: `+${bebe.tailleActuelle - bebe.tailleNaissance} cm` },
                ].map(m => (
                  <div key={m.label} className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${m.color === 'orange' ? 'bg-orange-500' : 'bg-teal-500'}`}>
                      <i className={`${m.icon} text-white`}></i>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{m.value}</p>
                    <p className="text-xs font-medium text-green-600 mt-2">{m.diff} depuis naissance</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">À la naissance</p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-sm">
                  <span className="text-gray-700"><strong className="font-semibold">{bebe.poidsNaissance} kg</strong> poids</span>
                  <span className="text-gray-700"><strong className="font-semibold">{bebe.tailleActuelle} cm</strong> taille</span>
                </div>
              </div>
            </div>
          </div>

          {/* Vaccination Summary */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <i className="ri-syringe-line text-teal-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Progression vaccinale</h3>
              </div>
              <span className="text-xl font-bold text-teal-600">{vaccinsDone.length}/{vaccins.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div className="h-3 rounded-full transition-all bg-gradient-to-r from-teal-500 to-teal-600" style={{ width: `${Math.round((vaccinsDone.length / vaccins.length) * 100)}%` }}></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="text-center p-4 rounded-xl bg-green-50 border border-green-200">
                <p className="text-2xl font-bold text-green-600">{vaccinsDone.length}</p>
                <p className="text-xs text-green-700">Complétés</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-orange-50 border border-orange-200">
                <p className="text-2xl font-bold text-orange-500">{vaccinsUpcoming.length}</p>
                <p className="text-xs text-orange-700">À venir</p>
              </div>
              <div className="text-center p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-2xl font-bold text-gray-700">{vaccins.length}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab : Croissance ────────────────────────────────────────── */}
      {activeTab === 'croissance' && (
        <div className="space-y-5">
          {/* Chart Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                  <i className="ri-line-chart-line text-teal-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-800">Courbe de croissance</h3>
              </div>
            </div>
            <div className="h-64 sm:h-80">
              <Line data={croissanceChartData} options={chartOptions} />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: 'ri-arrow-up-line', color: 'orange', label: 'Poids/mois', value: '+650 g' },
              { icon: 'ri-arrow-up-line', color: 'teal', label: 'Taille/mois', value: '+2.7 cm' },
              { icon: 'ri-heart-pulse-line', color: 'green', label: 'Santé', value: 'Normal' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-5 text-center shadow-md border border-gray-100">
                <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ${s.color === 'orange' ? 'bg-orange-100' : s.color === 'teal' ? 'bg-teal-100' : 'bg-green-100'}`}>
                  <i className={`${s.icon} text-xl ${s.color === 'orange' ? 'text-orange-500' : s.color === 'teal' ? 'text-teal-600' : 'text-green-600'}`}></i>
                </div>
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-gray-800">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Tab : Historique ────────────────────────────────────────── */}
      {activeTab === 'historique' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i className="ri-history-line text-teal-600"></i>
            Historique des consultations
          </h3>
          {[
            { date: '10 Nov 2024', type: 'Consultation de routine', pro: 'Dr. Fatou Sall', poids: '9.1 kg', taille: '74 cm', notes: 'Développement normal. Vaccins à jour. Alimentation diversifiée bien tolérée.' },
            { date: '15 Oct 2024', type: 'Vaccination', pro: 'Sage-femme Aïssatou Ba', poids: '8.7 kg', taille: '72 cm', notes: 'ROR administré. Aucune réaction adverse observée.' },
            { date: '20 Sep 2024', type: 'Consultation de routine', pro: 'Dr. Fatou Sall', poids: '8.4 kg', taille: '71 cm', notes: 'Croissance satisfaisante. Diversification alimentaire bien débutée.' },
            { date: '15 Août 2024', type: 'Consultation de routine', pro: 'Dr. Fatou Sall', poids: '8.0 kg', taille: '69 cm', notes: 'Bébé en bonne santé. Rappel BCG effectué.' },
          ].map((c, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-md border-l-4 border-teal-500">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h4 className="font-bold text-gray-800 flex items-center gap-2 mb-1">
                    <i className="ri-stethoscope-line text-orange-500"></i>
                    {c.type}
                  </h4>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <i className="ri-calendar-line"></i>{c.date}
                  </p>
                </div>
                <span className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-xs font-medium">{c.pro}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50">
                  <i className="ri-scales-3-line text-orange-500"></i>
                  <div>
                    <p className="text-xs text-gray-500">Poids</p>
                    <p className="font-bold text-gray-800">{c.poids}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-teal-50">
                  <i className="ri-ruler-line text-teal-600"></i>
                  <div>
                    <p className="text-xs text-gray-500">Taille</p>
                    <p className="font-bold text-gray-800">{c.taille}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3 border border-gray-200">{c.notes}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
