import { useState } from 'react';
import { mockUtilisateurs } from '../../mocks/db';

type Statut = 'actif' | 'inactif';

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  role: 'maman' | 'professionnel';
  specialite?: string;
  dateInscription: string;
  statut: Statut;
}

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>(mockUtilisateurs);
  const [filtreRole, setFiltreRole] = useState<'tous' | 'maman' | 'professionnel'>('tous');
  const [recherche, setRecherche] = useState('');
  const [confirmModal, setConfirmModal] = useState<{ user: Utilisateur; action: 'activer' | 'desactiver' } | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const utilisateursFiltres = utilisateurs.filter(u => {
    const matchRole = filtreRole === 'tous' || u.role === filtreRole;
    const matchRecherche = u.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      u.email.toLowerCase().includes(recherche.toLowerCase());
    return matchRole && matchRecherche;
  });

  // Pagination
  const totalPages = Math.ceil(utilisateursFiltres.length / itemsPerPage);
  const utilisateursPagines = utilisateursFiltres.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // Reset page when filters change
  const handleFilterChange = (newFilter: 'tous' | 'maman' | 'professionnel') => {
    setFiltreRole(newFilter);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setRecherche(value);
    setPage(1);
  };

  const stats = {
    mamans: utilisateurs.filter(u => u.role === 'maman').length,
    professionnels: utilisateurs.filter(u => u.role === 'professionnel').length,
    actifs: utilisateurs.filter(u => u.statut === 'actif').length,
  };

  const handleToggleStatut = (user: Utilisateur) => {
    setConfirmModal({ user, action: user.statut === 'actif' ? 'desactiver' : 'activer' });
  };

  const confirmToggle = () => {
    if (!confirmModal) return;
    const newStatut: Statut = confirmModal.action === 'activer' ? 'actif' : 'inactif';
    setUtilisateurs(prev => prev.map(u => u.id === confirmModal.user.id ? { ...u, statut: newStatut } : u));
    setNotification(`Utilisateur ${confirmModal.action === 'activer' ? 'activé' : 'désactivé'} avec succès.`);
    setTimeout(() => setNotification(null), 3500);
    setConfirmModal(null);
  };

  return (
    <div className="p-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white bg-green-600">
          <i className="ri-checkbox-circle-line text-lg"></i>
          {notification}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--dark-brown)' }}>Utilisateurs</h1>
        <p className="text-sm text-gray-500 mt-0.5">Gestion des mamans et professionnels de santé</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Mamans', value: stats.mamans, icon: 'ri-parent-line', color: 'var(--primary-teal)' },
          { label: 'Professionnels', value: stats.professionnels, icon: 'ri-stethoscope-line', color: 'var(--primary-orange)' },
          { label: 'Utilisateurs actifs', value: stats.actifs, icon: 'ri-user-line', color: 'var(--primary-teal)' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-lg p-4 border" style={{ borderColor: '#EAD7C8' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                <i className={`${s.icon} text-xl`} style={{ color: s.color }}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg p-4 mb-5 border" style={{ borderColor: '#EAD7C8' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="text" placeholder="Rechercher par nom ou email..." value={recherche}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none" />
          </div>
          <div className="flex gap-2">
            {(['tous', 'maman', 'professionnel'] as const).map(r => (
              <button key={r} onClick={() => setFiltreRole(r)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${filtreRole === r ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                style={filtreRole === r ? { backgroundColor: 'var(--primary-teal)' } : {}}>
                {r === 'tous' ? 'Tous' : r === 'maman' ? 'Mamans' : 'Professionnels'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#EAD7C8' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b" style={{ backgroundColor: 'var(--background-soft)', borderColor: '#EAD7C8' }}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Utilisateur</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Téléphone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Rôle</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Inscription</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Statut</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#f3f4f6' }}>
              {utilisateursPagines.map(user => (
                <tr key={user.id} className={`hover:bg-gray-50 transition-colors ${user.statut === 'inactif' ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full"
                        style={{ backgroundColor: user.role === 'maman' ? 'var(--background-soft)' : '#FEE2E2', color: user.role === 'maman' ? 'var(--primary-teal)' : 'var(--primary-orange)' }}>
                        <i className={`${user.role === 'maman' ? 'ri-parent-line' : 'ri-stethoscope-line'} text-sm`}></i>
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: 'var(--dark-brown)' }}>{user.nom}</p>
                        {user.specialite && <p className="text-xs text-gray-500">{user.specialite}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{user.telephone}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: user.role === 'maman' ? 'var(--background-soft)' : '#FEE2E2', color: user.role === 'maman' ? 'var(--primary-teal)' : 'var(--primary-orange)' }}>
                      {user.role === 'maman' ? 'Maman' : 'Professionnel'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(user.dateInscription).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${user.statut === 'actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      <i className={`${user.statut === 'actif' ? 'ri-checkbox-circle-fill' : 'ri-close-circle-line'} text-xs`}></i>
                      {user.statut === 'actif' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggleStatut(user)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${user.statut === 'actif' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
                    >
                      <i className={`${user.statut === 'actif' ? 'ri-forbid-line' : 'ri-check-line'} mr-1`}></i>
                      {user.statut === 'actif' ? 'Désactiver' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {utilisateursFiltres.length === 0 && (
          <div className="p-10 text-center">
            <i className="ri-user-search-line text-3xl text-gray-300 mb-2"></i>
            <p className="text-sm text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-2">
          <p className="text-sm text-gray-500">
            Affichage de {(page - 1) * itemsPerPage + 1} à {Math.min(page * itemsPerPage, utilisateursFiltres.length)} sur {utilisateursFiltres.length}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <i className="ri-arrow-left-line"></i>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${page === p ? 'bg-teal-600 text-white' : 'hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
      )}

      {/* Modal confirmation */}
      {confirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="text-center mb-5">
              <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4 ${confirmModal.action === 'desactiver' ? 'bg-red-100' : 'bg-green-100'}`}>
                <i className={`${confirmModal.action === 'desactiver' ? 'ri-forbid-line text-red-600' : 'ri-check-line text-green-600'} text-2xl`}></i>
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: 'var(--dark-brown)' }}>
                {confirmModal.action === 'desactiver' ? 'Désactiver' : 'Activer'} cet utilisateur ?
              </h3>
              <p className="text-sm text-gray-600">
                <strong>{confirmModal.user.nom}</strong> sera {confirmModal.action === 'desactiver' ? 'désactivé et ne pourra plus se connecter.' : 'réactivé et pourra de nouveau se connecter.'}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 rounded-lg border text-sm font-medium hover:bg-gray-50 cursor-pointer whitespace-nowrap" style={{ borderColor: '#DDD0C8' }}>
                Annuler
              </button>
              <button onClick={confirmToggle}
                className={`flex-1 py-2.5 rounded-lg text-white text-sm font-medium cursor-pointer whitespace-nowrap ${confirmModal.action === 'desactiver' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}>
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Utilisateurs;
