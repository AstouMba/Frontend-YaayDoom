import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  getAllConsultations,
  getGrossesses,
} from '../../application/professionnel';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';

interface GrossesseItem {
  id: string;
  rawId?: string;
  mamanNom: string;
  email?: string;
  numeroTelephone: string;
  semaineGrossesse: number;
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'TERMINEE' | 'ANNULEE';
  mamanId: string;
}

const DashboardPro = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'attente' | 'suivies'>('attente');
  const [searchTerm, setSearchTerm] = useState('');
  const [grossesses, setGrossesses] = useState<GrossesseItem[]>([]);
  const [consultationsCount, setConsultationsCount] = useState(0);

  const loadData = async () => {
    const [grossessesData, consultations] = await Promise.all([
      getGrossesses(),
      getAllConsultations(),
    ]);

    setGrossesses(grossessesData || []);
    setConsultationsCount(Array.isArray(consultations) ? consultations.length : 0);
  };

  useEffect(() => {
    loadData().catch(() => {
      setGrossesses([]);
      setConsultationsCount(0);
    });
  }, []);

  const grossessesEnAttente = useMemo(
    () => grossesses.filter((g) => g.statut === 'EN_ATTENTE'),
    [grossesses]
  );

  const patientesSuivies = useMemo(
    () => grossesses.filter((g) => g.statut === 'VALIDEE' || g.statut === 'TERMINEE'),
    [grossesses]
  );

  const filteredAttente = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return grossessesEnAttente;
    return grossessesEnAttente.filter(
      (g) => g.mamanNom.toLowerCase().includes(q) || String(g.mamanId).includes(q)
    );
  }, [grossessesEnAttente, searchTerm]);

  const filteredSuivies = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return patientesSuivies;
    return patientesSuivies.filter(
      (g) => g.mamanNom.toLowerCase().includes(q) || String(g.mamanId).includes(q)
    );
  }, [patientesSuivies, searchTerm]);
  const {
    page: pageAttente,
    setPage: setPageAttente,
    totalPages: totalPagesAttente,
    paginatedItems: grossessesAttentePage,
    start: startAttente,
    end: endAttente,
  } = usePagination(filteredAttente, 8);
  const {
    page: pageSuivies,
    setPage: setPageSuivies,
    totalPages: totalPagesSuivies,
    paginatedItems: patientesSuiviesPage,
    start: startSuivies,
    end: endSuivies,
  } = usePagination(filteredSuivies, 8);

  useEffect(() => {
    setPageAttente(1);
    setPageSuivies(1);
  }, [searchTerm, setPageAttente, setPageSuivies]);

  return (
    <div className="p-6 max-w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Bonjour, {user?.name}</h1>
          <p className="text-sm text-gray-500">Tableau de bord professionnel</p>
        </div>
        <button
          onClick={() => navigate('/dashboard-pro/scan')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg font-medium hover:opacity-90"
        >
          <i className="ri-qr-scan-2-line"></i>
          Scanner patient
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <i className="ri-time-line text-orange-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-orange-600">{grossessesEnAttente.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <i className="ri-user-heart-line text-teal-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Patientes suivies</p>
              <p className="text-2xl font-bold text-teal-600">{patientesSuivies.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <i className="ri-calendar-check-line text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">Consultations total</p>
              <p className="text-2xl font-bold text-blue-600">{consultationsCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 bg-white rounded-xl p-1 shadow-sm border border-gray-100">
        <button
          onClick={() => setActiveTab('attente')}
          className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${activeTab === 'attente' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <i className="ri-time-line mr-2"></i>
          En attente ({grossessesEnAttente.length})
        </button>
        <button
          onClick={() => setActiveTab('suivies')}
          className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all ${activeTab === 'suivies' ? 'bg-teal-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <i className="ri-user-heart-line mr-2"></i>
          Suivies ({patientesSuivies.length})
        </button>
      </div>

      <div className="bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {activeTab === 'attente' && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Patiente</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Semaine</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {grossessesAttentePage.map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <i className="ri-user-line text-orange-600"></i>
                        </div>
                        <span className="font-medium text-gray-800">{g.mamanNom}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{g.numeroTelephone || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">{g.semaineGrossesse} SA</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">EN_ATTENTE</span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate('/dashboard-pro/grossesses')}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-50 text-teal-700 hover:bg-teal-100"
                      >
                        Ouvrir la validation
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            page={pageAttente}
            totalPages={totalPagesAttente}
            start={startAttente}
            end={endAttente}
            total={filteredAttente.length}
            onPageChange={setPageAttente}
          />
        </div>
      )}

      {activeTab === 'suivies' && (
        <div className="grid gap-4">
          {patientesSuiviesPage.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-teal-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{p.mamanNom}</h3>
                    <p className="text-sm text-gray-500">ID: MAM-{p.mamanId}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-lg font-bold text-orange-600">{p.semaineGrossesse}</p>
                    <p className="text-xs text-gray-500">SA</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/dashboard-pro/consultations')}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600"
                  >
                    <i className="ri-stethoscope-line mr-1"></i>Consultations
                  </button>
                  <button
                    onClick={() => navigate('/dashboard-pro/vaccinations')}
                    className="px-4 py-2 border border-teal-600 text-teal-600 rounded-lg text-sm font-medium hover:bg-teal-50"
                  >
                    <i className="ri-syringe-line mr-1"></i>Vaccins
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Pagination
            page={pageSuivies}
            totalPages={totalPagesSuivies}
            start={startSuivies}
            end={endSuivies}
            total={filteredSuivies.length}
            onPageChange={setPageSuivies}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPro;
