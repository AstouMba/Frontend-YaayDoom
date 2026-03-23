import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Grossesse {
  id: number;
  patientName: string;
  patientId: string;
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'TERMINEE';
  dateDernieresRegles: string;
  datePresumeAccouchement: string;
  semaineGrossesse: number;
  nombreGrossessesPrecedentes: number;
  antecedents: string;
  dateDeclaration: string;
}

const Grossesses = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<'TOUS' | 'EN_ATTENTE' | 'VALIDEE' | 'TERMINEE'>('TOUS');

  // Mock data - Grossesses
  const [grossesses, setGrossesses] = useState<Grossesse[]>([
    {
      id: 1,
      patientName: 'Aïssatou Ba',
      patientId: 'MAM-2025-001',
      statut: 'VALIDEE',
      dateDernieresRegles: '2024-07-20',
      datePresumeAccouchement: '2025-04-26',
      semaineGrossesse: 24,
      nombreGrossessesPrecedentes: 1,
      antecedents: 'Première grossesse sans complications',
      dateDeclaration: '2024-08-15'
    },
    {
      id: 2,
      patientName: 'Khady Faye',
      patientId: 'MAM-2025-002',
      statut: 'VALIDEE',
      dateDernieresRegles: '2024-05-15',
      datePresumeAccouchement: '2025-02-19',
      semaineGrossesse: 32,
      nombreGrossessesPrecedentes: 2,
      antecedents: 'Deux grossesses précédentes normales',
      dateDeclaration: '2024-06-10'
    },
    {
      id: 3,
      patientName: 'Coumba Diop',
      patientId: 'MAM-2025-003',
      statut: 'EN_ATTENTE',
      dateDernieresRegles: '2024-09-10',
      datePresumeAccouchement: '2025-06-17',
      semaineGrossesse: 16,
      nombreGrossessesPrecedentes: 0,
      antecedents: 'Première grossesse',
      dateDeclaration: '2024-10-05'
    },
    {
      id: 4,
      patientName: 'Fatou Sall',
      patientId: 'MAM-2025-004',
      statut: 'EN_ATTENTE',
      dateDernieresRegles: '2024-11-05',
      datePresumeAccouchement: '2025-08-12',
      semaineGrossesse: 8,
      nombreGrossessesPrecedentes: 0,
      antecedents: 'Aucun antécédent particulier',
      dateDeclaration: '2024-12-01'
    },
    {
      id: 5,
      patientName: 'Mariama Ndiaye',
      patientId: 'MAM-2025-005',
      statut: 'VALIDEE',
      dateDernieresRegles: '2024-06-20',
      datePresumeAccouchement: '2025-03-27',
      semaineGrossesse: 28,
      nombreGrossessesPrecedentes: 3,
      antecedents: 'Hypertension lors de la dernière grossesse',
      dateDeclaration: '2024-07-18'
    }
  ]);

  const handleValider = (id: number) => {
    setGrossesses(prev => prev.map(g => 
      g.id === id ? { ...g, statut: 'VALIDEE' as const } : g
    ));
  };

  const filteredGrossesses = grossesses.filter(g => {
    const matchSearch = g.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       g.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatut = filterStatut === 'TOUS' || g.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'VALIDEE':
        return 'bg-green-100 text-green-800';
      case 'TERMINEE':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'VALIDEE':
        return 'Validée';
      case 'TERMINEE':
        return 'Terminée';
      default:
        return statut;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
          Gestion des Grossesses
        </h1>
        <p className="text-sm text-gray-600">
          Validation et suivi des déclarations de grossesse
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total grossesses</p>
              <p className="text-xl font-bold" style={{ color: 'var(--primary-teal)' }}>
                {grossesses.length}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
              <i className="ri-parent-line text-lg" style={{ color: 'var(--primary-teal)' }}></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">En attente</p>
              <p className="text-xl font-bold text-yellow-600">
                {grossesses.filter(g => g.statut === 'EN_ATTENTE').length}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-50">
              <i className="ri-time-line text-lg text-yellow-600"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Validées</p>
              <p className="text-xl font-bold text-green-600">
                {grossesses.filter(g => g.statut === 'VALIDEE').length}
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
              <p className="text-xs text-gray-600 mb-1">Terminées</p>
              <p className="text-xl font-bold text-gray-600">
                {grossesses.filter(g => g.statut === 'TERMINEE').length}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50">
              <i className="ri-check-double-line text-lg text-gray-600"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Rechercher par nom ou ID patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div>
            <select
              value={filterStatut}
              onChange={(e) => setFilterStatut(e.target.value as any)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="TOUS">Tous les statuts</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="VALIDEE">Validée</option>
              <option value="TERMINEE">Terminée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grossesses List */}
      <div className="space-y-4">
        {filteredGrossesses.map((grossesse) => (
          <div key={grossesse.id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              {/* Patient Info */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--background-soft)' }}>
                  <i className="ri-user-line text-base" style={{ color: 'var(--primary-orange)' }}></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
                    {grossesse.patientName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">ID: {grossesse.patientId}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatutBadge(grossesse.statut)}`}>
                      {getStatutLabel(grossesse.statut)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {grossesse.semaineGrossesse} SA
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Déclarée le {new Date(grossesse.dateDeclaration).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              {/* Grossesse Details */}
              <div className="flex-1 lg:max-w-2xl">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <div className="text-xs text-gray-600 mb-1">Dernières règles</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>
                      {new Date(grossesse.dateDernieresRegles).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <div className="text-xs text-gray-600 mb-1">Date présumée accouchement</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>
                      {new Date(grossesse.datePresumeAccouchement).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <div className="text-xs text-gray-600 mb-1">Grossesses précédentes</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>
                      {grossesse.nombreGrossessesPrecedentes}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <div className="text-xs text-gray-600 mb-1">Semaine actuelle</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>
                      {grossesse.semaineGrossesse} SA
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 mb-3">
                  <div className="text-xs text-gray-600 mb-1 font-medium">Antécédents médicaux</div>
                  <p className="text-sm text-gray-700">{grossesse.antecedents}</p>
                </div>

                {/* Actions */}
                {grossesse.statut === 'EN_ATTENTE' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleValider(grossesse.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: 'var(--primary-teal)' }}
                    >
                      <i className="ri-checkbox-circle-line"></i>
                      Valider la grossesse
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredGrossesses.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <i className="ri-inbox-line text-5xl text-gray-300 mb-3"></i>
          <p className="text-sm text-gray-500">Aucune grossesse trouvée</p>
        </div>
      )}
    </div>
  );
};

export default Grossesses;