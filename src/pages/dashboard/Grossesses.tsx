import { useEffect, useMemo, useState } from 'react';
import {
  getGrossesses,
  rejectGrossesse,
  validateGrossesse,
} from '../../features/professionnel/services/professionnelService';

type FilterStatut = 'TOUS' | 'EN_ATTENTE' | 'VALIDEE' | 'TERMINEE' | 'ANNULEE';

interface Grossesse {
  id: string;
  mamanNom: string;
  mamanId: string;
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'TERMINEE' | 'ANNULEE';
  dateDernieresRegles: string;
  datePresumeAccouchement: string;
  semaineGrossesse: number;
  notes?: string;
  dateDeclaration?: string;
}

const Grossesses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<FilterStatut>('TOUS');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [grossesses, setGrossesses] = useState<Grossesse[]>([]);

  const loadGrossesses = async () => {
    const data = await getGrossesses();
    setGrossesses(data || []);
  };

  useEffect(() => {
    loadGrossesses().catch(() => setGrossesses([]));
  }, []);

  const handleValider = async (id: string) => {
    setLoadingId(id);
    try {
      await validateGrossesse(id);
      await loadGrossesses();
    } finally {
      setLoadingId(null);
    }
  };

  const handleRejeter = async (id: string) => {
    if (!confirm('Voulez-vous rejeter cette grossesse ?')) return;

    setLoadingId(id);
    try {
      await rejectGrossesse(id);
      await loadGrossesses();
    } finally {
      setLoadingId(null);
    }
  };

  const filteredGrossesses = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return grossesses.filter((g) => {
      const matchSearch = !q || g.mamanNom.toLowerCase().includes(q) || String(g.mamanId).includes(q);
      const matchStatut = filterStatut === 'TOUS' || g.statut === filterStatut;
      return matchSearch && matchStatut;
    });
  }, [grossesses, searchTerm, filterStatut]);

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'VALIDEE':
        return 'bg-green-100 text-green-800';
      case 'TERMINEE':
        return 'bg-gray-100 text-gray-800';
      case 'ANNULEE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'En attente';
      case 'VALIDEE':
        return 'Validee';
      case 'TERMINEE':
        return 'Terminee';
      case 'ANNULEE':
        return 'Annulee';
      default:
        return statut;
    }
  };

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
          Gestion des Grossesses
        </h1>
        <p className="text-sm text-gray-600">
          Validation et suivi des declarations de grossesse
        </p>
      </div>

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
                {grossesses.filter((g) => g.statut === 'EN_ATTENTE').length}
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
              <p className="text-xs text-gray-600 mb-1">Validees</p>
              <p className="text-xl font-bold text-green-600">
                {grossesses.filter((g) => g.statut === 'VALIDEE').length}
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
              <p className="text-xs text-gray-600 mb-1">Terminees</p>
              <p className="text-xl font-bold text-gray-600">
                {grossesses.filter((g) => g.statut === 'TERMINEE').length}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-50">
              <i className="ri-check-double-line text-lg text-gray-600"></i>
            </div>
          </div>
        </div>
      </div>

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
              onChange={(e) => setFilterStatut(e.target.value as FilterStatut)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="TOUS">Tous les statuts</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="VALIDEE">Validee</option>
              <option value="TERMINEE">Terminee</option>
              <option value="ANNULEE">Annulee</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredGrossesses.map((grossesse) => (
          <div key={grossesse.id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--background-soft)' }}>
                  <i className="ri-user-line text-base" style={{ color: 'var(--primary-orange)' }}></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
                    {grossesse.mamanNom}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">ID: MAM-{grossesse.mamanId}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatutBadge(grossesse.statut)}`}>
                      {getStatutLabel(grossesse.statut)}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {grossesse.semaineGrossesse} SA
                    </span>
                  </div>
                  {grossesse.dateDeclaration && (
                    <p className="text-xs text-gray-500">
                      Declaree le {new Date(grossesse.dateDeclaration).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1 lg:max-w-2xl">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <div className="text-xs text-gray-600 mb-1">Dernieres regles</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>
                      {grossesse.dateDernieresRegles ? new Date(grossesse.dateDernieresRegles).toLocaleDateString('fr-FR') : '-'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <div className="text-xs text-gray-600 mb-1">Date presumee accouchement</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>
                      {grossesse.datePresumeAccouchement ? new Date(grossesse.datePresumeAccouchement).toLocaleDateString('fr-FR') : '-'}
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 mb-3">
                  <div className="text-xs text-gray-600 mb-1 font-medium">Notes</div>
                  <p className="text-sm text-gray-700">{grossesse.notes || 'Aucune note'}</p>
                </div>

                {grossesse.statut === 'EN_ATTENTE' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleValider(grossesse.id)}
                      disabled={loadingId === grossesse.id}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: 'var(--primary-teal)' }}
                    >
                      <i className="ri-checkbox-circle-line"></i>
                      Valider
                    </button>
                    <button
                      onClick={() => handleRejeter(grossesse.id)}
                      disabled={loadingId === grossesse.id}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 bg-red-500"
                    >
                      <i className="ri-close-circle-line"></i>
                      Rejeter
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
          <p className="text-sm text-gray-500">Aucune grossesse trouvee</p>
        </div>
      )}
    </div>
  );
};

export default Grossesses;
