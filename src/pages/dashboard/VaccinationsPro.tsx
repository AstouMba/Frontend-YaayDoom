import { useEffect, useMemo, useState } from 'react';
import { administrerVaccin, getVaccinations } from '../../application/professionnel';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface Vaccin {
  id: string;
  nom: string;
  age: string;
  description: string;
}

type VaccinationStatus = 'ADMINISTRE' | 'A_VENIR' | 'EN_RETARD';

interface VaccinationRecord {
  id: string;
  patientName: string;
  patientId: string;
  bebeNom: string;
  bebeAge: string;
  vaccin: string;
  dateAdministration: string;
  statut: VaccinationStatus;
  prochainRappel?: string;
  notes: string;
}

const VaccinationsPro = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<'TOUS' | VaccinationStatus>('TOUS');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>([]);

  const calendrierVaccinal: Vaccin[] = [
    { id: '1', nom: 'BCG', age: 'A la naissance', description: 'Vaccin contre la tuberculose' },
    { id: '2', nom: 'Polio 0', age: 'A la naissance', description: 'Premiere dose de vaccin contre la poliomyelite' },
    { id: '3', nom: 'Pentavalent 1', age: '6 semaines', description: 'DTC-HepB-Hib (1ere dose)' },
    { id: '4', nom: 'Pentavalent 2', age: '10 semaines', description: 'DTC-HepB-Hib (2eme dose)' },
    { id: '5', nom: 'Pentavalent 3', age: '14 semaines', description: 'DTC-HepB-Hib (3eme dose)' },
    { id: '6', nom: 'Rougeole-Rubeole 1', age: '9 mois', description: 'Premiere dose RR' },
    { id: '7', nom: 'Fievre jaune', age: '9 mois', description: 'Vaccin contre la fievre jaune' },
    { id: '8', nom: 'Rougeole-Rubeole 2', age: '15 mois', description: 'Deuxieme dose RR (rappel)' },
  ];

  const loadVaccinations = async () => {
    const data = await getVaccinations();
    setVaccinations(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadVaccinations().catch(() => setVaccinations([]));
  }, []);

  const markAsDone = async (id: string) => {
    setLoadingId(id);
    try {
      await administrerVaccin(id);
      await loadVaccinations();
    } finally {
      setLoadingId(null);
    }
  };

  const filteredVaccinations = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return vaccinations.filter((v) => {
      const matchSearch =
        !q ||
        v.patientName.toLowerCase().includes(q) ||
        v.patientId.toLowerCase().includes(q) ||
        v.bebeNom.toLowerCase().includes(q);
      const matchStatut = filterStatut === 'TOUS' || v.statut === filterStatut;
      return matchSearch && matchStatut;
    });
  }, [vaccinations, searchTerm, filterStatut]);
  const {
    page,
    setPage,
    totalPages,
    paginatedItems: vaccinationsPaginees,
    start,
    end,
  } = usePagination(filteredVaccinations, 8);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatut, setPage]);

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'ADMINISTRE':
        return 'bg-green-100 text-green-800';
      case 'A_VENIR':
        return 'bg-blue-100 text-blue-800';
      case 'EN_RETARD':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'ADMINISTRE':
        return 'ri-checkbox-circle-fill';
      case 'A_VENIR':
        return 'ri-time-line';
      case 'EN_RETARD':
        return 'ri-alert-line';
      default:
        return 'ri-question-line';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'ADMINISTRE':
        return 'Administre';
      case 'A_VENIR':
        return 'A venir';
      case 'EN_RETARD':
        return 'En retard';
      default:
        return statut;
    }
  };

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
            Gestion des Vaccinations
          </h1>
          <p className="text-sm text-gray-600">
            Suivi du calendrier vaccinal des bebes
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--primary-teal)' }}
        >
          <i className="ri-add-line"></i>
          Enregistrer un vaccin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total vaccinations</p>
              <p className="text-xl font-bold" style={{ color: 'var(--primary-teal)' }}>
                {vaccinations.length}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
              <i className="ri-syringe-line text-lg" style={{ color: 'var(--primary-teal)' }}></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Administres</p>
              <p className="text-xl font-bold text-green-600">
                {vaccinations.filter((v) => v.statut === 'ADMINISTRE').length}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-50">
              <i className="ri-checkbox-circle-line text-lg text-green-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">A venir</p>
              <p className="text-xl font-bold text-blue-600">
                {vaccinations.filter((v) => v.statut === 'A_VENIR').length}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-50">
              <i className="ri-time-line text-lg text-blue-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">En retard</p>
              <p className="text-xl font-bold text-red-600">
                {vaccinations.filter((v) => v.statut === 'EN_RETARD').length}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50">
              <i className="ri-alert-line text-lg text-red-600"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
        <h2 className="text-base font-bold mb-4" style={{ color: 'var(--dark-brown)' }}>
          <i className="ri-calendar-check-line mr-2" style={{ color: 'var(--primary-teal)' }}></i>
          Calendrier Vaccinal de Reference
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {calendrierVaccinal.map((vaccin) => (
            <div key={vaccin.id} className="p-3 rounded-lg border border-gray-200 hover:border-teal-300 transition-colors">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ backgroundColor: 'var(--background-soft)' }}>
                  <i className="ri-syringe-line text-sm" style={{ color: 'var(--primary-teal)' }}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
                    {vaccin.nom}
                  </h3>
                  <p className="text-xs text-gray-600 mb-1">{vaccin.age}</p>
                  <p className="text-xs text-gray-500">{vaccin.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Rechercher par nom de maman, bebe ou ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value as 'TOUS' | VaccinationStatus)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="TOUS">Tous les statuts</option>
              <option value="ADMINISTRE">Administre</option>
              <option value="A_VENIR">A venir</option>
              <option value="EN_RETARD">En retard</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {vaccinationsPaginees.map((vaccination) => (
          <div key={vaccination.id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--background-soft)' }}>
                  <i className="ri-user-line text-base" style={{ color: 'var(--primary-orange)' }}></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
                    {vaccination.bebeNom}
                  </h3>
                  <p className="text-xs text-gray-500 mb-1">Maman: {vaccination.patientName}</p>
                  <p className="text-xs text-gray-500 mb-2">ID: {vaccination.patientId}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatutBadge(vaccination.statut)}`}>
                      <i className={`${getStatutIcon(vaccination.statut)} mr-1`}></i>
                      {getStatutLabel(vaccination.statut)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {vaccination.bebeAge}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 lg:max-w-2xl">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <div className="text-xs text-gray-600 mb-1">Vaccin</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>
                      {vaccination.vaccin}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <div className="text-xs text-gray-600 mb-1">Date administration</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>
                      {vaccination.dateAdministration ? new Date(vaccination.dateAdministration).toLocaleDateString('fr-FR') : '-'}
                    </div>
                  </div>
                  {vaccination.prochainRappel && (
                    <div className="col-span-2 p-3 rounded-lg border border-orange-200 bg-orange-50">
                      <div className="text-xs text-orange-700 mb-1 font-medium">
                        <i className="ri-calendar-line mr-1"></i>
                        Prochain rappel
                      </div>
                      <div className="text-sm font-bold text-orange-800">
                        {new Date(vaccination.prochainRappel).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3 rounded-lg border border-gray-200 mb-3">
                  <div className="text-xs text-gray-600 mb-1 font-medium">Notes</div>
                  <p className="text-sm text-gray-700">{vaccination.notes || 'Aucune note'}</p>
                </div>
                {vaccination.statut !== 'ADMINISTRE' && (
                  <button
                    onClick={() => markAsDone(vaccination.id)}
                    disabled={loadingId === vaccination.id}
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-60"
                  >
                    {loadingId === vaccination.id ? 'Mise a jour...' : 'Marquer comme administre'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVaccinations.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <i className="ri-inbox-line text-5xl text-gray-300 mb-3"></i>
          <p className="text-sm text-gray-500">Aucune vaccination trouvee</p>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        start={start}
        end={end}
        total={filteredVaccinations.length}
        onPageChange={setPage}
      />

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>
                Enregistrer un vaccin
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="ri-close-line text-lg text-gray-500"></i>
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Cette action se fait depuis la page Consultation patient apres scan.
            </p>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--primary-teal)' }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VaccinationsPro;
