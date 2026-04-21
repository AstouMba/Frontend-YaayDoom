import { useEffect, useMemo, useState } from 'react';
import {
  getGrossesses,
  validateGrossesse,
} from '../../application/professionnel';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';

type FilterStatut = 'TOUS' | 'EN_ATTENTE' | 'VALIDEE' | 'TERMINEE' | 'ANNULEE';

interface Grossesse {
  id: string;
  rawId?: string;
  mamanNom: string;
  mamanId: string;
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'TERMINEE' | 'ANNULEE';
  dateDernieresRegles: string;
  datePresumeAccouchement?: string;
  semaineGrossesse: number;
  notes?: string;
  dateDeclaration?: string;
}

const formatDate = (value?: string) => {
  if (!value) return '-';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString('fr-FR');
};

const Grossesses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<FilterStatut>('TOUS');
  const [grossesses, setGrossesses] = useState<Grossesse[]>([]);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadGrossesses = async () => {
    const data = await getGrossesses();
    setGrossesses(data || []);
  };

  useEffect(() => {
    loadGrossesses().catch(() => setGrossesses([]));
  }, []);

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleValidate = async (grossesse: Grossesse) => {
    const id = grossesse.rawId || grossesse.id.replace(/^g-/, '');
    if (!id) return;

    setValidatingId(grossesse.id);
    try {
      await validateGrossesse(id);
      showNotif('success', 'Grossesse validée avec succès.');
      await loadGrossesses();
    } catch {
      showNotif('error', 'Impossible de valider cette grossesse.');
    } finally {
      setValidatingId(null);
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
  const {
    page,
    setPage,
    totalPages,
    paginatedItems: grossessesPaginees,
    start,
    end,
  } = usePagination(filteredGrossesses, 8);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterStatut, setPage]);

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
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          <i className={`${notification.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'} text-lg`}></i>
          {notification.message}
        </div>
      )}

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
        {grossessesPaginees.map((grossesse) => (
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
                      {formatDate(grossesse.dateDernieresRegles)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <div className="text-xs text-gray-600 mb-1">Date presumee accouchement</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>
                      {formatDate(grossesse.datePresumeAccouchement)}
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 mb-3">
                  <div className="text-xs text-gray-600 mb-1 font-medium">Notes</div>
                  <p className="text-sm text-gray-700">{grossesse.notes || 'Aucune note'}</p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-gray-500 italic">
                    La validation est une action métier dédiée via le bouton ci-dessous.
                  </p>
                  {grossesse.statut === 'EN_ATTENTE' ? (
                    <button
                      onClick={() => handleValidate(grossesse)}
                      disabled={validatingId === grossesse.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {validatingId === grossesse.id ? (
                        <i className="ri-loader-4-line animate-spin"></i>
                      ) : (
                        <i className="ri-checkbox-circle-line"></i>
                      )}
                      Valider la grossesse
                    </button>
                  ) : (
                    <span className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-600">
                      Validation déjà effectuée ou grossesse hors attente
                    </span>
                  )}
                </div>
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

      <Pagination
        page={page}
        totalPages={totalPages}
        start={start}
        end={end}
        total={filteredGrossesses.length}
        onPageChange={setPage}
      />
    </div>
  );
};

export default Grossesses;
