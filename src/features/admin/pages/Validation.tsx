import { useState } from 'react';
import { mockProfessionnelsEnAttente } from '../../mocks/db';

interface Professionnel {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  specialite: string;
  matricule: string;
  centreDesante: string;
  documentUrl: string;
  dateInscription: string;
}

const Validation = () => {
  const [professionnels, setProfessionnels] = useState<Professionnel[]>(mockProfessionnelsEnAttente);
  const [selectedPro, setSelectedPro] = useState<Professionnel | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleApprouver = (id: number) => {
    setProfessionnels(prev => prev.filter(p => p.id !== id));
    setShowDocumentModal(false);
    showNotif('success', 'Professionnel approuvé avec succès.');
  };

  const handleRejeter = (id: number) => {
    setProfessionnels(prev => prev.filter(p => p.id !== id));
    setShowDocumentModal(false);
    showNotif('error', 'Demande d\'inscription rejetée.');
  };

  const handleVoirDocument = (pro: Professionnel) => {
    setSelectedPro(pro);
    setShowDocumentModal(true);
  };

  return (
    <div className="p-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          <i className={`${notification.type === 'success' ? 'ri-checkbox-circle-line' : 'ri-close-circle-line'} text-lg`}></i>
          {notification.message}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--dark-brown)' }}>Validation des professionnels</h1>
        <p className="text-sm text-gray-500 mt-0.5">Examinez et validez les demandes d'inscription</p>
      </div>

      {/* Stat */}
      <div className="inline-flex items-center gap-3 p-4 rounded-lg bg-white border mb-6" style={{ borderColor: '#EAD7C8' }}>
        <div className="w-9 h-9 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
          <i className="ri-time-line" style={{ color: 'var(--primary-orange)' }}></i>
        </div>
        <div>
          <p className="text-xs text-gray-500">En attente de validation</p>
          <p className="text-xl font-bold" style={{ color: 'var(--primary-orange)' }}>{professionnels.length}</p>
        </div>
      </div>

      {professionnels.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border" style={{ borderColor: '#EAD7C8' }}>
          <i className="ri-checkbox-circle-line text-4xl mb-3" style={{ color: 'var(--primary-teal)' }}></i>
          <p className="text-sm font-semibold" style={{ color: 'var(--dark-brown)' }}>Tout est traité !</p>
          <p className="text-xs text-gray-500 mt-1">Aucune demande en attente de validation.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#EAD7C8' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b" style={{ backgroundColor: 'var(--background-soft)', borderColor: '#EAD7C8' }}>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Professionnel</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Spécialité</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Matricule</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Centre de santé</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: '#f3f4f6' }}>
                {professionnels.map(pro => (
                  <tr key={pro.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 flex items-center justify-center rounded-full" style={{ backgroundColor: 'var(--background-soft)' }}>
                          <i className="ri-stethoscope-line text-sm" style={{ color: 'var(--primary-teal)' }}></i>
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: 'var(--dark-brown)' }}>{pro.nom}</p>
                          <p className="text-xs text-gray-500">{pro.email}</p>
                          <p className="text-xs text-gray-400">{pro.telephone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--background-soft)', color: 'var(--primary-teal)' }}>
                        {pro.specialite}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{pro.matricule}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{pro.centreDesante}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {new Date(pro.dateInscription).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleVoirDocument(pro)}
                          className="px-2.5 py-1.5 rounded-lg text-white text-xs font-medium hover:opacity-90 cursor-pointer whitespace-nowrap"
                          style={{ backgroundColor: 'var(--primary-teal)' }}>
                          <i className="ri-file-text-line mr-1"></i>Document
                        </button>
                        <button onClick={() => handleApprouver(pro.id)}
                          className="px-2.5 py-1.5 rounded-lg text-white text-xs font-medium bg-green-600 hover:bg-green-700 cursor-pointer whitespace-nowrap">
                          <i className="ri-check-line mr-1"></i>Approuver
                        </button>
                        <button onClick={() => handleRejeter(pro.id)}
                          className="px-2.5 py-1.5 rounded-lg text-white text-xs font-medium bg-red-500 hover:bg-red-600 cursor-pointer whitespace-nowrap">
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

      {/* Modal Document */}
      {showDocumentModal && selectedPro && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: '#EAD7C8' }}>
              <div>
                <h3 className="text-base font-bold" style={{ color: 'var(--dark-brown)' }}>Document justificatif</h3>
                <p className="text-sm text-gray-500">{selectedPro.nom}</p>
              </div>
              <button onClick={() => setShowDocumentModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer">
                <i className="ri-close-line text-lg text-gray-500"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="rounded-xl p-8 flex flex-col items-center justify-center min-h-48 mb-5" style={{ backgroundColor: 'var(--background-soft)' }}>
                <i className="ri-file-pdf-line text-5xl text-red-500 mb-3"></i>
                <p className="text-sm font-semibold" style={{ color: 'var(--dark-brown)' }}>Document PDF</p>
                <p className="text-xs text-gray-500 mt-1 mb-4">{selectedPro.documentUrl}</p>
                <a href={selectedPro.documentUrl} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium cursor-pointer whitespace-nowrap"
                  style={{ backgroundColor: 'var(--primary-teal)' }}>
                  <i className="ri-download-line mr-2"></i>Télécharger
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['Spécialité', selectedPro.specialite],
                  ['Matricule', selectedPro.matricule],
                  ['Centre de santé', selectedPro.centreDesante],
                  ['Date d\'inscription', new Date(selectedPro.dateInscription).toLocaleDateString('fr-FR')],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                    <p className="font-semibold" style={{ color: 'var(--dark-brown)' }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t flex gap-3" style={{ borderColor: '#EAD7C8' }}>
              <button onClick={() => handleRejeter(selectedPro.id)}
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium bg-red-500 hover:bg-red-600 cursor-pointer whitespace-nowrap">
                <i className="ri-close-line mr-1.5"></i>Rejeter
              </button>
              <button onClick={() => handleApprouver(selectedPro.id)}
                className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium bg-green-600 hover:bg-green-700 cursor-pointer whitespace-nowrap">
                <i className="ri-check-line mr-1.5"></i>Approuver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Validation;
