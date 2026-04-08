import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import QRCard from '../../components/QRCard';
import ModalGrossesse from '../../components/ModalGrossesse';
import { createGrossesse, getGrossesse } from '../../application/maman';

type GrossesseStatut = 'AUCUNE' | 'EN_ATTENTE' | 'VALIDEE';

export default function DashboardMaman() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [grossesseStatut, setGrossesseStatut] = useState<GrossesseStatut>('AUCUNE');
  const [semaineActuelle, setSemaineActuelle] = useState(0);

  const loadGrossesse = async () => {
    try {
      const grossesse = await getGrossesse();
      if (!grossesse) {
        setGrossesseStatut('AUCUNE');
        setSemaineActuelle(0);
        return;
      }

      setSemaineActuelle(grossesse.semaineGrossesse || 0);
      if (grossesse.statut === 'EN_ATTENTE') {
        setGrossesseStatut('EN_ATTENTE');
      } else {
        setGrossesseStatut('VALIDEE');
      }
    } catch {
      setGrossesseStatut('AUCUNE');
      setSemaineActuelle(0);
    }
  };

  useEffect(() => {
    loadGrossesse();
  }, []);

  const handleCreateGrossesse = async (data: any) => {
    setLoading(true);
    try {
      await createGrossesse(data);
      setIsModalOpen(false);
      await loadGrossesse();
      setSuccessMessage('Votre declaration de grossesse a ete enregistree avec succes.');
      setTimeout(() => setSuccessMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const userName = user?.name?.split(' ')[0] || 'vous';

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:items-center sm:justify-between mb-6 gap-4">
        <div className="w-full">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Bonjour {userName} ! 👋
          </h1>
          <p className="text-sm text-gray-500">Bienvenue sur votre espace santé</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 cursor-pointer w-full sm:w-auto"
          style={{ backgroundColor: 'var(--primary-teal)' }}
        >
          <i className="ri-add-line"></i>
          Déclarer grossesse
        </button>
      </div>

      {/* Message de succès */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <i className="ri-checkbox-circle-fill text-green-600 text-xl flex-shrink-0"></i>
          <p className="text-sm font-semibold text-green-800">{successMessage}</p>
        </div>
      )}

      {/* ─── Cas 1 : Aucune grossesse ─────────────────────────────────────── */}
      {grossesseStatut === 'AUCUNE' && (
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl p-8 text-center shadow-lg border border-gray-100">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 bg-gradient-to-br from-teal-50 to-orange-50">
              <i className="ri-parent-line text-4xl text-teal-600"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Bienvenue sur YaayDoom+ !
            </h2>
            <p className="text-gray-500 mb-6">
              Déclarez votre grossesse pour commencer le suivi.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold hover:opacity-90 cursor-pointer bg-gradient-to-r from-teal-600 to-teal-700"
            >
              <i className="ri-heart-add-line text-lg"></i>
              Déclarer ma grossesse
            </button>
          </div>
        </div>
      )}

      {/* ─── Cas 2 : Grossesse EN_ATTENTE ─────────────────────────────────── */}
      {grossesseStatut === 'EN_ATTENTE' && (
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl p-6 border-l-4 bg-amber-50 border-amber-400">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                <i className="ri-time-fill text-xl text-amber-600"></i>
              </div>
              <div>
                <h3 className="font-bold text-amber-900 mb-1">Déclaration en attente</h3>
                <p className="text-sm text-amber-800">Un professionnel va valider sous 24-48h.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Cas 3 : Grossesse VALIDEE ────────────────────────────────────── */}
      {grossesseStatut === 'VALIDEE' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Carte QR */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Ma carte de santé</h2>
            <QRCard userName={user?.name || 'Aminata Diallo'} userId={user?.id || 'YD-2024-001234'} />
          </div>

          {/* Accès rapides */}
          <div className="space-y-4">
            {/* Stats simples */}
            <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Semaine de grossesse</p>
                  <p className="text-3xl font-bold text-teal-600">{semaineActuelle} SA</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                  <i className="ri-heart-pulse-line text-2xl text-teal-600"></i>
                </div>
              </div>
            </div>

            {/* Boutons rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/dashboard-maman/grossesse')}
                className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white font-semibold flex flex-col items-center gap-1 sm:gap-2 cursor-pointer shadow-lg text-center"
              >
                <i className="ri-heart-pulse-line text-xl sm:text-2xl"></i>
                <span className="text-xs sm:text-sm">Ma Grossesse</span>
              </button>
              <button 
                onClick={() => navigate('/dashboard-maman/rendez-vous')}
                className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-semibold flex flex-col items-center gap-1 sm:gap-2 cursor-pointer shadow-lg text-center"
              >
                <i className="ri-calendar-check-line text-xl sm:text-2xl"></i>
                <span className="text-xs sm:text-sm">Rendez-vous</span>
              </button>
              <button 
                onClick={() => navigate('/dashboard-maman/bebe')}
                className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 text-white font-semibold flex flex-col items-center gap-1 sm:gap-2 cursor-pointer shadow-lg text-center"
              >
                <i className="ri-baby-line text-xl sm:text-2xl"></i>
                <span className="text-xs sm:text-sm">Mon Bébé</span>
              </button>
              <button 
                onClick={() => navigate('/dashboard-maman/vaccination')}
                className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-500 text-white font-semibold flex flex-col items-center gap-1 sm:gap-2 cursor-pointer shadow-lg text-center"
              >
                <i className="ri-syringe-line text-xl sm:text-2xl"></i>
                <span className="text-xs sm:text-sm">Vaccination</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal grossesse */}
      <ModalGrossesse
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateGrossesse}
        loading={loading}
      />
    </div>
  );
}
