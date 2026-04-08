import { useEffect, useMemo, useState } from 'react';
import { getVaccins } from '../../application/maman';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';

type VaccinStatus = 'completed' | 'upcoming' | 'overdue';

interface Vaccine {
  id: string;
  nom: string;
  age: string;
  datePrevu: string;
  dateAdministre?: string;
  statut: VaccinStatus;
  professionnel?: string | null;
  notes?: string;
}

export default function Vaccination() {
  const [activeTab, setActiveTab] = useState<'calendrier' | 'historique'>('calendrier');
  const [selectedVaccin, setSelectedVaccin] = useState<Vaccine | null>(null);
  const [vaccins, setVaccins] = useState<Vaccine[]>([]);

  useEffect(() => {
    getVaccins()
      .then((data) => {
        const mapped = (Array.isArray(data) ? data : []).map((v: any) => ({
          ...v,
          statut: v.statut || 'upcoming',
        }));
        setVaccins(mapped);
      })
      .catch(() => setVaccins([]));
  }, []);

  const completedCount = useMemo(() => vaccins.filter((v) => v.statut === 'completed').length, [vaccins]);
  const upcomingCount = useMemo(() => vaccins.filter((v) => v.statut === 'upcoming').length, [vaccins]);
  const overdueCount = useMemo(() => vaccins.filter((v) => v.statut === 'overdue').length, [vaccins]);
  const totalCount = vaccins.length || 1;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);
  const displayedVaccins = activeTab === 'calendrier' ? vaccins : vaccins.filter((v) => v.statut === 'completed');
  const {
    page,
    setPage,
    totalPages,
    paginatedItems: paginatedVaccins,
    start,
    end,
  } = usePagination(displayedVaccins, 8);

  useEffect(() => {
    setPage(1);
  }, [activeTab, setPage]);

  const statusColor = (status: VaccinStatus) => {
    if (status === 'completed') return '#10b981';
    if (status === 'overdue') return '#ef4444';
    return 'var(--primary-orange)';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
          <i className="ri-syringe-line mr-2"></i>
          Calendrier Vaccinal
        </h1>
        <p className="text-sm text-gray-600">Suivi des vaccinations de votre bebe</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4 border" style={{ borderColor: 'var(--primary-teal)' }}>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--primary-teal)' }}>
              <i className="ri-syringe-fill text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
              {completedCount}/{vaccins.length}
            </span>
            <p className="text-xs font-medium text-gray-700 mb-2">Vaccins completes</p>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${completionPercentage}%`, backgroundColor: 'var(--primary-teal)' }}
              ></div>
            </div>
            <p className="text-xs font-bold mt-1.5" style={{ color: 'var(--primary-teal)' }}>
              {completionPercentage}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-green-500">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center mb-2">
              <i className="ri-checkbox-circle-fill text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold text-green-600 mb-1">{completedCount}</span>
            <p className="text-xs font-medium text-gray-700">Completes</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border" style={{ borderColor: 'var(--primary-orange)' }}>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--primary-orange)' }}>
              <i className="ri-time-fill text-white text-lg"></i>
            </div>
            <span className="text-2xl font-bold mb-1" style={{ color: 'var(--primary-orange)' }}>{upcomingCount}</span>
            <p className="text-xs font-medium text-gray-700">A venir</p>
          </div>
        </div>

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

      <div className="space-y-3">
        {paginatedVaccins.map((vaccin) => (
          <div
            key={vaccin.id}
            className="bg-white p-4 rounded-lg border-l-4 hover:shadow-sm transition-all cursor-pointer"
            style={{ borderColor: statusColor(vaccin.statut) }}
            onClick={() => setSelectedVaccin(vaccin)}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <div
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: statusColor(vaccin.statut) }}
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
                      <strong>Age:</strong> {vaccin.age}
                    </span>
                    <span className="flex items-center gap-1">
                      <i className="ri-calendar-check-line"></i>
                      <strong>{vaccin.statut === 'completed' ? 'Fait le' : 'Prevu le'}:</strong> {vaccin.dateAdministre || vaccin.datePrevu}
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
            </div>
          </div>
        ))}
      </div>

      {selectedVaccin && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-md">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base" style={{ color: 'var(--dark-brown)' }}>{selectedVaccin.nom}</h3>
              <button onClick={() => setSelectedVaccin(null)} className="text-gray-500">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-2">Age recommande: {selectedVaccin.age}</p>
            <p className="text-sm text-gray-600 mb-2">Date prevue: {selectedVaccin.datePrevu}</p>
            <p className="text-sm text-gray-600 mb-2">Date administree: {selectedVaccin.dateAdministre || '-'}</p>
            <p className="text-sm text-gray-600">Notes: {selectedVaccin.notes || 'Aucune'}</p>
          </div>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        start={start}
        end={end}
        total={displayedVaccins.length}
        onPageChange={setPage}
      />
    </div>
  );
}
