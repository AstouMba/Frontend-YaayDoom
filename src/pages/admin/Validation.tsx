import { useEffect, useState } from 'react';
import {
  approveProfessionnel,
  getProfessionnelsEnAttente,
  rejectProfessionnel,
} from '../../application/admin';
import type { PendingProfessional } from '../../domain/admin/types';
import Pagination from '../../components/Pagination';
import { usePagination } from '../../hooks/usePagination';

const Validation = () => {
  const [professionnels, setProfessionnels] = useState<PendingProfessional[]>([]);
  const [selectedPro, setSelectedPro] = useState<PendingProfessional | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDecision, setSelectedDecision] = useState<'approve' | 'reject' | null>(null);
  const [decisionResult, setDecisionResult] = useState<{
    action: 'approve' | 'reject';
    motif: string;
    professionnel?: PendingProfessional;
  } | null>(null);
  const [decisionMotif, setDecisionMotif] = useState('');
  const [decisionError, setDecisionError] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const {
    page,
    setPage,
    totalPages,
    paginatedItems: professionnelsPagines,
    start,
    end,
  } = usePagination(professionnels, 8);

  const loadProfessionnels = async () => {
    try {
      const data = await getProfessionnelsEnAttente();
      setProfessionnels(data);
    } catch {
      showNotif('error', 'Impossible de charger les professionnels en attente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfessionnels();

    const intervalId = globalThis.setInterval(() => {
      loadProfessionnels();
    }, 15000);

    const handleFocus = () => {
      loadProfessionnels();
    };

    globalThis.window?.addEventListener('focus', handleFocus);
    globalThis.document?.addEventListener('visibilitychange', handleFocus);

    return () => {
      globalThis.clearInterval(intervalId);
      globalThis.window?.removeEventListener('focus', handleFocus);
      globalThis.document?.removeEventListener('visibilitychange', handleFocus);
    };
  }, []);

  const showNotif = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDecision = async (id: string, action: 'approve' | 'reject') => {
    const motif = decisionMotif.trim();

    if (!motif) {
      setDecisionError('Le motif de la décision est requis.');
      return;
    }

    try {
      if (action === 'approve') {
        const response = await approveProfessionnel(id, motif);
        setProfessionnels(prev => prev.filter(p => p.id !== id));
        if (response.professionnel) {
          setSelectedPro(response.professionnel);
        }
        setDecisionResult({ action, motif, professionnel: response.professionnel });
      } else {
        const response = await rejectProfessionnel(id, motif);
        setProfessionnels(prev => prev.filter(p => p.id !== id));
        if (response.professionnel) {
          setSelectedPro(response.professionnel);
        }
        setDecisionResult({ action, motif, professionnel: response.professionnel });
      }
      setDecisionMotif('');
      setDecisionError('');
      showNotif(
        action === 'approve' ? 'success' : 'error',
        action === 'approve'
          ? 'Professionnel approuvé avec motif enregistré.'
          : 'Demande rejetée avec motif enregistré.'
      );
    } catch {
      showNotif('error', action === 'approve' ? 'Erreur lors de l’approbation.' : 'Erreur lors du rejet.');
    }
  };

  const handleVoirDocument = (pro: PendingProfessional) => {
    setSelectedPro(pro);
    setSelectedDecision(null);
    setDecisionResult(null);
    setDecisionMotif('');
    setDecisionError('');
    setShowDocumentModal(true);
  };

  const handleOpenDecision = (pro: PendingProfessional, action: 'approve' | 'reject') => {
    setSelectedPro(pro);
    setSelectedDecision(action);
    setDecisionResult(null);
    setDecisionMotif('');
    setDecisionError('');
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

      {loading ? (
        <div className="bg-white rounded-xl p-12 text-center border" style={{ borderColor: '#EAD7C8' }}>
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      ) : professionnels.length === 0 ? (
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
                {professionnelsPagines.map(pro => (
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
                        <button onClick={() => handleOpenDecision(pro, 'approve')}
                          className="px-2.5 py-1.5 rounded-lg text-white text-xs font-medium bg-green-600 hover:bg-green-700 cursor-pointer whitespace-nowrap">
                          <i className="ri-check-line mr-1"></i>Approuver
                        </button>
                        <button onClick={() => handleOpenDecision(pro, 'reject')}
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

      <Pagination
        page={page}
        totalPages={totalPages}
        start={start}
        end={end}
        total={professionnels.length}
        onPageChange={setPage}
      />

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
                <p className="text-xs text-gray-500 mt-1 mb-4">{selectedPro.documentUrl || 'Aucun document fourni'}</p>
                <a href={selectedPro.documentUrl || '#'} target="_blank" rel="noopener noreferrer"
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

              {Array.isArray(selectedPro.documents) && selectedPro.documents.length > 0 && (
                <div className="mt-5">
                  <p className="text-sm font-semibold mb-2" style={{ color: 'var(--dark-brown)' }}>Documents transmis</p>
                  <div className="space-y-2">
                    {selectedPro.documents.map((document: Record<string, any>, index: number) => (
                      <div key={`${document.name || 'doc'}-${index}`} className="flex items-center justify-between gap-3 p-3 rounded-xl border" style={{ borderColor: '#EAD7C8' }}>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--dark-brown)' }}>{document.name || 'Document'}</p>
                          <p className="text-xs text-gray-500 truncate">{document.mime || document.type || 'Fichier'}</p>
                        </div>
                        <a
                          href={document.url || selectedPro.documentUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium px-3 py-1.5 rounded-lg text-white whitespace-nowrap"
                          style={{ backgroundColor: 'var(--primary-teal)' }}
                        >
                          Ouvrir
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-5">
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                  Motif de {selectedDecision === 'approve' ? 'l’approbation' : 'la décision'}
                </label>
                <textarea
                  value={decisionMotif}
                  onChange={(e) => {
                    setDecisionMotif(e.target.value);
                    if (decisionError) setDecisionError('');
                  }}
                  rows={4}
                  placeholder="Expliquez brièvement pourquoi vous acceptez ou rejetez cette demande..."
                  aria-invalid={!!decisionError}
                  className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] resize-none ${decisionError ? 'border-red-400' : 'border-gray-300'}`}
                />
                {decisionError && <p className="mt-1 text-xs text-red-500">{decisionError}</p>}
              </div>

              {decisionResult && (
                <div className="mt-5 p-4 rounded-xl border" style={{ borderColor: decisionResult.action === 'approve' ? '#BBF7D0' : '#FECACA', backgroundColor: decisionResult.action === 'approve' ? '#F0FDF4' : '#FEF2F2' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <i className={`${decisionResult.action === 'approve' ? 'ri-check-line text-green-600' : 'ri-close-line text-red-600'} text-lg`}></i>
                    <p className="text-sm font-semibold" style={{ color: 'var(--dark-brown)' }}>
                      Décision enregistrée
                    </p>
                  </div>
                  <p className="text-sm mb-2" style={{ color: 'var(--dark-brown)' }}>
                    {decisionResult.action === 'approve' ? 'Professionnel approuvé.' : 'Demande rejetée.'}
                  </p>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong>Motif :</strong> {decisionResult.motif}
                  </p>
                  {decisionResult.professionnel?.decisionDate && (
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      <strong>Date :</strong> {new Date(decisionResult.professionnel.decisionDate).toLocaleString('fr-FR')}
                    </p>
                  )}
                  {decisionResult.professionnel?.decisionStatus && (
                    <p className="text-xs text-gray-600 leading-relaxed mt-1">
                      <strong>Statut :</strong> {decisionResult.professionnel.decisionStatus}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t flex gap-3" style={{ borderColor: '#EAD7C8' }}>
              {decisionResult ? (
                <button
                  onClick={() => {
                    setShowDocumentModal(false);
                    setSelectedPro(null);
                    setSelectedDecision(null);
                    setDecisionResult(null);
                    setDecisionMotif('');
                    setDecisionError('');
                  }}
                  className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium bg-gray-700 hover:bg-gray-800 cursor-pointer whitespace-nowrap">
                  Fermer
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleDecision(selectedPro.id, 'reject')}
                    className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium bg-red-500 hover:bg-red-600 cursor-pointer whitespace-nowrap">
                    <i className="ri-close-line mr-1.5"></i>Rejeter
                  </button>
                  <button
                    onClick={() => handleDecision(selectedPro.id, 'approve')}
                    className="flex-1 py-2.5 rounded-lg text-white text-sm font-medium bg-green-600 hover:bg-green-700 cursor-pointer whitespace-nowrap">
                    <i className="ri-check-line mr-1.5"></i>Approuver
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Validation;
