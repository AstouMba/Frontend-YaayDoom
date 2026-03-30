import { useEffect, useState } from 'react';
import { getRendezVous } from '../../features/maman/services/mamanService';

type Tab = 'upcoming' | 'past';

export default function RendezVous() {
  const [activeTab, setActiveTab] = useState<Tab>('upcoming');
  const [upcomingAppointments, setUpcomingAppointments] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const rdv = await getRendezVous();
        setUpcomingAppointments(rdv || []);
      } catch {
        setUpcomingAppointments([]);
      }
    };

    loadData();
  }, []);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'upcoming', label: 'À venir', icon: 'ri-calendar-event-fill' },
    { id: 'past', label: 'Passés', icon: 'ri-history-line' },
  ];

  // Mock past appointments
  const pastAppointments = [
    { id: 101, type: 'Consultation prénatale', date: '2025-03-15', heure: '09:00', professionnel: 'Dr. Fatou Sow', lieu: 'Hôpital Principal de Dakar', statut: 'completed' },
    { id: 102, type: 'Échographie', date: '2025-03-01', heure: '14:00', professionnel: 'Dr. Marie Diop', lieu: 'Clinique Pasteur', statut: 'completed' },
    { id: 103, type: 'Consultation prénatale', date: '2025-02-15', heure: '10:00', professionnel: 'Dr. Fatou Sow', lieu: 'Hôpital Principal de Dakar', statut: 'completed' },
  ];

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-700 rounded-2xl p-6 text-white mb-6">
        <h1 className="text-2xl font-bold mb-2">Mes Rendez-vous</h1>
        <p className="text-orange-100">Gérez vos rendez-vous médicaux</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 overflow-x-auto max-w-md">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <i className={`${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── Tab: À venir ──────────────────────────────────────── */}
      {activeTab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map(rdv => (
              <div key={rdv.id} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                      <i className="ri-calendar-event-fill text-orange-600 text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{rdv.type}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(rdv.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {rdv.heure}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium">Prévu</span>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <i className="ri-user-line text-gray-500"></i>
                  <span className="text-sm text-gray-600">{rdv.professionnel}</span>
                  <span className="text-gray-300">·</span>
                  <i className="ri-map-pin-line text-gray-500"></i>
                  <span className="text-sm text-gray-600">{rdv.lieu}</span>
                </div>
                {rdv.notes && (
                  <p className="mt-3 text-sm text-gray-500 bg-blue-50 p-3 rounded-xl">{rdv.notes}</p>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
              <i className="ri-calendar-close-line text-5xl text-gray-300 mb-3"></i>
              <p className="text-gray-500">Aucun rendez-vous à venir</p>
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Passés ──────────────────────────────────────── */}
      {activeTab === 'past' && (
        <div className="space-y-4">
          {pastAppointments.map(rdv => (
            <div key={rdv.id} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100 opacity-80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <i className="ri-check-line text-gray-500"></i>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{rdv.type}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(rdv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">Terminé</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{rdv.professionnel}</span>
                <span>·</span>
                <span>{rdv.lieu}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
