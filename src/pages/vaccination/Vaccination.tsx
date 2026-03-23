import { useState } from 'react';

type VaccinStatus = 'completed' | 'upcoming' | 'overdue';

interface Vaccine {
  id: number;
  nom: string;
  age: string;
  datePrevu: string;
  dateAdministre?: string;
  status: VaccinStatus;
  professionnel?: string;
  notes?: string;
}

export default function Vaccination() {
  const [activeTab, setActiveTab] = useState<'calendrier' | 'historique'>('calendrier');
  const [selectedVaccin, setSelectedVaccin] = useState<Vaccine | null>(null);

  // Données mock des vaccins
  const vaccins: Vaccine[] = [
    {
      id: 1,
      nom: 'BCG',
      age: 'À la naissance',
      datePrevu: '15 Mars 2024',
      dateAdministre: '15 Mars 2024',
      status: 'completed',
      professionnel: 'Sage-femme Aïssatou Ba',
      notes: 'Vaccination effectuée à la maternité'
    },
    {
      id: 2,
      nom: 'Hépatite B (1ère dose)',
      age: 'À la naissance',
      datePrevu: '15 Mars 2024',
      dateAdministre: '15 Mars 2024',
      status: 'completed',
      professionnel: 'Sage-femme Aïssatou Ba'
    },
    {
      id: 3,
      nom: 'Pentavalent (1ère dose)',
      age: '6 semaines',
      datePrevu: '26 Avril 2024',
      dateAdministre: '26 Avril 2024',
      status: 'completed',
      professionnel: 'Dr. Fatou Sall'
    },
    {
      id: 4,
      nom: 'VPO (1ère dose)',
      age: '6 semaines',
      datePrevu: '26 Avril 2024',
      dateAdministre: '26 Avril 2024',
      status: 'completed',
      professionnel: 'Dr. Fatou Sall'
    },
    {
      id: 5,
      nom: 'Pentavalent (2ème dose)',
      age: '10 semaines',
      datePrevu: '24 Mai 2024',
      dateAdministre: '24 Mai 2024',
      status: 'completed',
      professionnel: 'Dr. Fatou Sall'
    },
    {
      id: 6,
      nom: 'VPO (2ème dose)',
      age: '10 semaines',
      datePrevu: '24 Mai 2024',
      dateAdministre: '24 Mai 2024',
      status: 'completed',
      professionnel: 'Dr. Fatou Sall'
    },
    {
      id: 7,
      nom: 'Pentavalent (3ème dose)',
      age: '14 semaines',
      datePrevu: '21 Juin 2024',
      dateAdministre: '21 Juin 2024',
      status: 'completed',
      professionnel: 'Dr. Fatou Sall'
    },
    {
      id: 8,
      nom: 'VPO (3ème dose)',
      age: '14 semaines',
      datePrevu: '21 Juin 2024',
      dateAdministre: '21 Juin 2024',
      status: 'completed',
      professionnel: 'Dr. Fatou Sall'
    },
    {
      id: 9,
      nom: 'ROR (Rougeole-Oreillons-Rubéole)',
      age: '9 mois',
      datePrevu: '15 Décembre 2024',
      status: 'upcoming'
    },
    {
      id: 10,
      nom: 'Fièvre Jaune',
      age: '9 mois',
      datePrevu: '15 Décembre 2024',
      status: 'upcoming'
    },
    {
      id: 11,
      nom: 'Méningite A',
      age: '12 mois',
      datePrevu: '15 Mars 2025',
      status: 'upcoming'
    },
    {
      id: 12,
      nom: 'Pneumocoque',
      age: '15 mois',
      datePrevu: '15 Juin 2025',
      status: 'overdue'
    }
  ];

  const completedCount = vaccins.filter(v => v.status === 'completed').length;
  const upcomingCount = vaccins.filter(v => v.status === 'upcoming').length;
  const overdueCount = vaccins.filter(v => v.status === 'overdue').length;
  const totalCount = vaccins.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
          <i className="ri-syringe-line mr-2"></i>
          Calendrier Vaccinal
        </h1>
        <p className="text-sm text-gray-600">Suivi des vaccinations de votre bébé</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {/* Total */}
        <div className="bg-white rounded-lg shadow-sm p-4 border" style={{ borderColor: 'var(--primary-teal)' }}>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--primary-teal)' }}>
              <i className="ri-syringe-fill text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
              {completedCount}/{totalCount}
            </span>
            <p className="text-xs font-medium text-gray-700 mb-2">Vaccins complétés</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ 
                  width: `${completionPercentage}%`,
                  backgroundColor: 'var(--primary-teal)'
                }}
              ></div>
            </div>
            <p className="text-xs font-bold mt-1.5" style={{ color: 'var(--primary-teal)' }}>
              {completionPercentage}%
            </p>
          </div>
        </div>

        {/* Complétés */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-green-500">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-2">
              <i className="ri-checkbox-circle-fill text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold text-green-600 mb-1">{completedCount}</span>
            <p className="text-xs font-medium text-gray-700">Complétés</p>
          </div>
        </div>

        {/* À venir */}
        <div className="bg-white rounded-lg shadow-sm p-4 border" style={{ borderColor: 'var(--primary-orange)' }}>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--primary-orange)' }}>
              <i className="ri-time-fill text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold mb-1" style={{ color: 'var(--primary-orange)' }}>{upcomingCount}</span>
            <p className="text-xs font-medium text-gray-700">À venir</p>
          </div>
        </div>

        {/* En retard */}
        <div className="bg-white rounded-lg shadow-sm p-4 border border-red-500">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center mb-2">
              <i className="ri-alert-fill text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold text-red-600 mb-1">{overdueCount}</span>
            <p className="text-xs font-medium text-gray-700">En retard</p>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="grid grid-cols-2">
          <button
            onClick={() => setActiveTab('calendrier')}
            className={`h-11 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'calendrier' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={activeTab === 'calendrier' ? { backgroundColor: 'var(--primary-teal)' } : {}}
          >
            <i className="ri-calendar-line"></i>
            Calendrier complet
          </button>
          <button
            onClick={() => setActiveTab('historique')}
            className={`h-11 text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === 'historique' ? 'text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
            style={activeTab === 'historique' ? { backgroundColor: 'var(--primary-teal)' } : {}}
          >
            <i className="ri-history-line"></i>
            Historique
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="space-y-3">
        {/* Tab: Calendrier */}
        {activeTab === 'calendrier' && (
          <div className="space-y-3">
            {vaccins.map((vaccin) => (
              <div
                key={vaccin.id}
                className="bg-white p-4 rounded-lg border-l-4 hover:shadow-sm transition-all cursor-pointer"
                style={{ 
                  borderColor: vaccin.status === 'completed' 
                    ? '#10b981' 
                    : vaccin.status === 'overdue' 
                    ? '#ef4444' 
                    : 'var(--primary-orange)'
                }}
                onClick={() => setSelectedVaccin(vaccin)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    {/* Icône */}
                    <div 
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ 
                        backgroundColor: vaccin.status === 'completed' 
                          ? '#10b981' 
                          : vaccin.status === 'overdue' 
                          ? '#ef4444' 
                          : 'var(--primary-orange)'
                      }}
                    >
                      <i className="ri-syringe-fill text-white text-lg"></i>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
                        {vaccin.nom}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span className="flex items-center gap-1">
                          <i className="ri-calendar-line"></i>
                          <strong>Âge:</strong> {vaccin.age}
                        </span>
                        <span className="flex items-center gap-1">
                          <i className="ri-calendar-check-line"></i>
                          <strong>{vaccin.status === 'completed' ? 'Fait le' : 'Prévu le'}:</strong> {vaccin.dateAdministre || vaccin.datePrevu}
                        </span>
                      </div>
                      {vaccin.professionnel && (
                        <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                          <i className="ri-user-line"></i>
                          <strong>Par:</strong> {vaccin.professionnel}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Badge statut */}
                  <div className="flex items-center gap-2">
                    {vaccin.status === 'completed' && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-500 text-white flex items-center gap-1 whitespace-nowrap">
                        <i className="ri-checkbox-circle-fill"></i>
                        Complété
                      </span>
                    )}
                    {vaccin.status === 'upcoming' && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1 whitespace-nowrap" style={{ backgroundColor: 'var(--primary-orange)' }}>
                        <i className="ri-time-fill"></i>
                        À venir
                      </span>
                    )}
                    {vaccin.status === 'overdue' && (
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-red-500 text-white flex items-center gap-1 whitespace-nowrap">
                        <i className="ri-alert-fill"></i>
                        En retard
                      </span>
                    )}
                    <i className="ri-arrow-right-circle-line text-2xl text-gray-400"></i>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab: Historique */}
        {activeTab === 'historique' && (
          <div className="space-y-3">
            {vaccins
              .filter(v => v.status === 'completed')
              .map((vaccin) => (
                <div
                  key={vaccin.id}
                  className="bg-white p-4 rounded-lg border-l-4 border-green-500 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                      <i className="ri-checkbox-circle-fill text-white text-lg"></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
                        {vaccin.nom}
                      </h3>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <i className="ri-calendar-check-line"></i>
                        <strong>Administré le:</strong> {vaccin.dateAdministre}
                      </p>
                    </div>
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-500 text-white whitespace-nowrap">
                      Complété
                    </span>
                  </div>
                  {vaccin.professionnel && (
                    <p className="text-xs text-gray-600 mb-2 flex items-center gap-1 ml-13">
                      <i className="ri-user-line"></i>
                      <strong>Professionnel:</strong> {vaccin.professionnel}
                    </p>
                  )}
                  {vaccin.notes && (
                    <div className="mt-2 p-3 rounded-lg ml-13" style={{ backgroundColor: 'var(--background-soft)' }}>
                      <p className="text-xs text-gray-700">{vaccin.notes}</p>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Modal Détails Vaccin */}
      {selectedVaccin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>
                  <i className="ri-syringe-line mr-2"></i>
                  {selectedVaccin.nom}
                </h2>
                <button
                  onClick={() => setSelectedVaccin(null)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <i className="ri-close-line text-xl"></i>
                </button>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center justify-center">
                {selectedVaccin.status === 'completed' && (
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-500 text-white flex items-center gap-2">
                    <i className="ri-checkbox-circle-fill"></i>
                    Complété
                  </span>
                )}
                {selectedVaccin.status === 'upcoming' && (
                  <span className="px-4 py-2 rounded-full text-sm font-medium text-white flex items-center gap-2" style={{ backgroundColor: 'var(--primary-orange)' }}>
                    <i className="ri-time-fill"></i>
                    À venir
                  </span>
                )}
                {selectedVaccin.status === 'overdue' && (
                  <span className="px-4 py-2 rounded-full text-sm font-medium bg-red-500 text-white flex items-center gap-2">
                    <i className="ri-alert-fill"></i>
                    En retard
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                  <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <i className="ri-calendar-line"></i>
                    <strong>Âge recommandé</strong>
                  </p>
                  <p className="text-base font-bold" style={{ color: 'var(--dark-brown)' }}>
                    {selectedVaccin.age}
                  </p>
                </div>

                <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                  <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                    <i className="ri-calendar-check-line"></i>
                    <strong>{selectedVaccin.status === 'completed' ? 'Date d\'administration' : 'Date prévue'}</strong>
                  </p>
                  <p className="text-base font-bold" style={{ color: 'var(--dark-brown)' }}>
                    {selectedVaccin.dateAdministre || selectedVaccin.datePrevu}
                  </p>
                </div>

                {selectedVaccin.professionnel && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <i className="ri-user-line"></i>
                      <strong>Professionnel de santé</strong>
                    </p>
                    <p className="text-base font-bold" style={{ color: 'var(--dark-brown)' }}>
                      {selectedVaccin.professionnel}
                    </p>
                  </div>
                )}

                {selectedVaccin.notes && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <p className="text-xs text-gray-600 mb-2 flex items-center gap-1">
                      <i className="ri-file-text-line"></i>
                      <strong>Notes</strong>
                    </p>
                    <p className="text-xs" style={{ color: 'var(--dark-brown)' }}>
                      {selectedVaccin.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Message informatif pour les mamans */}
              <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-800 flex items-start gap-2">
                  <i className="ri-information-line text-base mt-0.5"></i>
                  <span>Seul un professionnel de santé peut ajouter ou modifier les informations de vaccination.</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}