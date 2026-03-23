import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Grossesse {
  id: number;
  patientName: string;
  email: string;
  phone: string;
  dateDernieresRegles: string;
  semaineGrossesse: number;
  statut: 'EN_ATTENTE' | 'VALIDÉ';
}

interface Patiente {
  id: number;
  name: string;
  email: string;
  phone: string;
  semaineGrossesse: number;
  dateAccouchementPrevue: string;
  dernierRdv: string;
  prochainRdv: string;
}

const DashboardPro = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'attente' | 'suivies'>('attente');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const [grossessesEnAttente, setGrossessesEnAttente] = useState<Grossesse[]>([
    { id: 1, patientName: 'Aminata Diallo', email: 'aminata@email.com', phone: '+221 77 123 45 67', dateDernieresRegles: '2024-10-15', semaineGrossesse: 12, statut: 'EN_ATTENTE' },
    { id: 2, patientName: 'Fatou Sall', email: 'fatou@email.com', phone: '+221 76 234 56 78', dateDernieresRegles: '2024-11-20', semaineGrossesse: 8, statut: 'EN_ATTENTE' },
  ]);

  const [patientesSuivies] = useState<Patiente[]>([
    { id: 4, name: 'Aïssatou Ba', email: 'aissatou@email.com', phone: '+221 77 456 78 90', semaineGrossesse: 24, dateAccouchementPrevue: '2025-08-15', dernierRdv: '2025-01-05', prochainRdv: '2025-02-05' },
    { id: 5, name: 'Khady Faye', email: 'khady@email.com', phone: '+221 76 567 89 01', semaineGrossesse: 32, dateAccouchementPrevue: '2025-06-20', dernierRdv: '2025-01-10', prochainRdv: '2025-01-24' },
  ]);

  const handleValider = async (id: number) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setGrossessesEnAttente(prev => prev.map(g => g.id === id ? { ...g, statut: 'VALIDÉ' } : g));
    setLoading(false);
  };

  const handleRejeter = (id: number) => {
    if (confirm('Voulez-vous rejeter cette grossesse ?')) {
      setGrossessesEnAttente(prev => prev.filter(g => g.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <i className="ri-time-line text-orange-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm text-gray-500">En attente</p>
              <p className="text-2xl font-bold text-orange-600">{grossessesEnAttente.filter(g => g.statut === 'EN_ATTENTE').length}</p>
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
              <p className="text-sm text-gray-500">Consultations mois</p>
              <p className="text-2xl font-bold text-blue-600">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
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

      {/* Search */}
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

      {/* Content */}
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
                {grossessesEnAttente.map(g => (
                  <tr key={g.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                          <i className="ri-user-line text-orange-600"></i>
                        </div>
                        <span className="font-medium text-gray-800">{g.patientName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{g.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-medium">{g.semaineGrossesse} SA</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${g.statut === 'VALIDÉ' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {g.statut}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleValider(g.id)}
                          disabled={loading}
                          className="px-3 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 disabled:opacity-50"
                        >
                          {loading ? <i className="ri-loader-2-line animate-spin"></i> : <><i className="ri-check-line mr-1"></i>Valider</>}
                        </button>
                        <button 
                          onClick={() => handleRejeter(g.id)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600"
                        >
                          <i className="ri-close-line mr-1"></i>Rejeter
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'suivies' && (
        <div className="grid gap-4">
          {patientesSuivies.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                    <i className="ri-user-line text-teal-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.email}</p>
                  </div>
                </div>
                <div className="flex gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-lg font-bold text-orange-600">{p.semaineGrossesse}</p>
                    <p className="text-xs text-gray-500">SA</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-800">{new Date(p.prochainRdv).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-xs text-gray-500">Prochain RDV</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600">
                    <i className="ri-stethoscope-line mr-1"></i>Consultation
                  </button>
                  <button className="px-4 py-2 border border-teal-600 text-teal-600 rounded-lg text-sm font-medium hover:bg-teal-50">
                    <i className="ri-syringe-line mr-1"></i>Vaccin
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPro;
