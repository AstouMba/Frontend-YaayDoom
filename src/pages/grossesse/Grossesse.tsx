import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getEvolutionGrossesse, getGrossesse, getRendezVous } from '../../application/maman';
import { getConsultations } from '../../application/professionnel';

type Tab = 'evolution' | 'rendezvous' | 'suivi';

export default function Grossesse() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('evolution');
  const [semaineActuelle, setSemaineActuelle] = useState(0);
  const [datePrevue, setDatePrevue] = useState('');
  const [evolution, setEvolution] = useState<any[]>([]);
  const [rendezVous, setRendezVous] = useState<any[]>([]);
  const [suiviMedical, setSuiviMedical] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [grossesse, evol, rdv] = await Promise.all([
          getGrossesse(),
          getEvolutionGrossesse(),
          getRendezVous(),
        ]);
        const consultations = user?.id ? await getConsultations(user.id).catch(() => []) : [];

        setSemaineActuelle(grossesse?.semaineGrossesse || 0);
        setDatePrevue(grossesse?.dateAccouchePrevue || '');
        setEvolution(evol || []);
        setRendezVous(rdv || []);
        setSuiviMedical(Array.isArray(consultations) ? consultations : []);
      } catch {
        setEvolution([]);
        setRendezVous([]);
        setSuiviMedical([]);
      }
    };

    loadData();
  }, [user?.id]);
  
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'evolution', label: 'Évolution', icon: 'ri-line-chart-line' },
    { id: 'rendezvous', label: 'Rendez-vous', icon: 'ri-calendar-check-line' },
    { id: 'suivi', label: 'Suivi médical', icon: 'ri-stethoscope-line' },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 rounded-2xl p-4 sm:p-6 text-white mb-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-2">Ma Grossesse</h1>
        <p className="text-teal-100 text-sm sm:text-base">Semaine {semaineActuelle} - 2ème trimestre</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-3 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? 'bg-gradient-to-r from-teal-600 to-teal-700 text-white shadow-md' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
          >
            <i className={`${tab.icon}`}></i>
            <span className="hidden xs:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── Tab: Évolution ──────────────────────────────────────── */}
      {activeTab === 'evolution' && (
        <div className="space-y-6">
          {/* Week Info Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Semaine {semaineActuelle}</h2>
                <p className="text-gray-500 text-sm">2ème trimestre</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-sm text-gray-500">Date prévue</p>
                <p className="text-lg font-bold text-orange-500">
                  {datePrevue ? new Date(datePrevue).toLocaleDateString('fr-FR') : '-'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Début</span>
                <span>40 SA</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="h-3 rounded-full bg-gradient-to-r from-teal-500 to-teal-600" 
                  style={{ width: `${(semaineActuelle / 40) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-center text-gray-500 mt-2">{Math.round((semaineActuelle / 40) * 100)}% du chemin parcouru</p>
            </div>

            {/* Current Week Details */}
            <div className="p-3 sm:p-4 bg-teal-50 rounded-xl border border-teal-200">
              <h3 className="font-bold text-teal-800 mb-2">Cette semaine</h3>
              <p className="text-sm text-teal-700">
                Votre bébé mesure maintenant environ 23 cm et pèse environ 800g. 
                Il commence à avoir des cycles de sommeil réguliers. 
                Vous pouvez commencer à sentir ses mouvements de manière plus nette.
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-5">Évolution semaine par semaine</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
              <div className="space-y-6">
                {evolution.map((etape, idx) => (
                  <div key={etape.semaine} className={`flex items-start gap-4 pl-10 relative ${etape.semaine > semaineActuelle ? 'opacity-40' : ''}`}>
                    <div 
                      className={`absolute left-2.5 w-3 h-3 rounded-full border-2 -translate-y-0.5 ${
                        etape.semaine < semaineActuelle 
                          ? 'bg-green-500 border-green-500' 
                          : etape.current 
                            ? 'bg-teal-500 border-teal-500 ring-4 ring-teal-100' 
                            : 'bg-gray-300 border-gray-300'
                      }`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-gray-800">Semaine {etape.semaine}</span>
                        {etape.current && (
                          <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">En cours</span>
                        )}
                        {etape.semaine < semaineActuelle && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">Terminé</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-700 mb-1">{etape.titre}</h4>
                      <p className="text-sm text-gray-500">{etape.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Rendez-vous ──────────────────────────────────────── */}
      {activeTab === 'rendezvous' && (
        <div className="space-y-4">
          {/* Upcoming */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="ri-calendar-event-fill text-orange-500"></i>
              Prochains rendez-vous
            </h3>
            <div className="space-y-3">
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const upcoming = rendezVous
                  .filter((rdv) => {
                    const rdvDate = new Date(rdv.date);
                    rdvDate.setHours(0, 0, 0, 0);
                    return rdvDate >= today && String(rdv.statut || '').toLowerCase() !== 'completed';
                  })
                  .sort((a, b) => String(a.date).localeCompare(String(b.date)));

                if (upcoming.length === 0) {
                  return (
                    <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50 p-6 text-center">
                      <i className="ri-calendar-close-line text-4xl text-orange-300"></i>
                      <p className="mt-2 text-sm text-gray-500">Aucun rendez-vous à venir</p>
                    </div>
                  );
                }

                return upcoming.map((rdv) => (
                  <div key={rdv.id} className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-calendar-line text-orange-600 text-xl"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{rdv.type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(rdv.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} à {rdv.heure}
                      </p>
                      <p className="text-xs text-teal-600 mt-1">{rdv.professionnel} · {rdv.lieu}</p>
                    </div>
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium">Prévu</span>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Past Appointments */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="ri-history-line text-teal-600"></i>
              Historique des rendez-vous
            </h3>
            <div className="space-y-3">
              {(() => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const past = rendezVous
                  .filter((rdv) => {
                    const rdvDate = new Date(rdv.date);
                    rdvDate.setHours(0, 0, 0, 0);
                    return rdvDate < today || String(rdv.statut || '').toLowerCase() === 'completed';
                  })
                  .sort((a, b) => String(b.date).localeCompare(String(a.date)));

                if (past.length === 0) {
                  return (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                      <i className="ri-history-line text-4xl text-gray-300"></i>
                      <p className="mt-2 text-sm text-gray-500">Aucun rendez-vous passé trouvé</p>
                    </div>
                  );
                }

                return past.map((rdv) => (
                  <div key={rdv.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-check-line text-gray-500"></i>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{rdv.type}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(rdv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} · {rdv.professionnel}
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded-lg text-xs">Terminé</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Suivi médical ──────────────────────────────────────── */}
      {activeTab === 'suivi' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i className="ri-stethoscope-line text-teal-600"></i>
              Historique médical
            </h3>
            <div className="space-y-4">
              {suiviMedical.length > 0 ? (
                suiviMedical.map((suivi, idx) => (
                  <div key={suivi.id || idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-stethoscope-line text-teal-600"></i>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-gray-800">{suivi.type}</p>
                        <span className="text-xs text-gray-500">
                          {suivi.date || '-'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-1">{suivi.professionnel || 'Professionnel de santé'}</p>
                      <p className="text-sm text-gray-600 bg-white p-2 rounded-lg border">{suivi.notes || 'Aucune note disponible'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-teal-200 bg-teal-50 p-6 text-center">
                  <i className="ri-stethoscope-line text-4xl text-teal-300"></i>
                  <p className="mt-2 text-sm text-gray-500">Aucune consultation trouvée pour cette maman</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
