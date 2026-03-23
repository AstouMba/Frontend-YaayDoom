import { useState } from 'react';

interface ModalGrossesseProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GrossesseData) => void;
  loading?: boolean;
}

interface GrossesseData {
  dateDernieresRegles: string;
  nombreGrossessesPrecedentes: number;
  antecedentsMedicaux: string;
}

export default function ModalGrossesse({ isOpen, onClose, onSubmit, loading = false }: ModalGrossesseProps) {
  const [formData, setFormData] = useState<GrossesseData>({
    dateDernieresRegles: '',
    nombreGrossessesPrecedentes: 0,
    antecedentsMedicaux: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="bg-[var(--primary-teal)] p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <i className="ri-heart-add-fill text-3xl text-white"></i>
              <h2 className="text-xl font-bold text-white">
                Déclarer ma grossesse
              </h2>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="ri-close-line text-xl text-white"></i>
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Date dernières règles */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--dark-brown)] mb-2">
              <i className="ri-calendar-event-fill text-lg text-[var(--primary-teal)]"></i>
              Date de vos dernières règles
            </label>
            <input
              type="date"
              required
              disabled={loading}
              value={formData.dateDernieresRegles}
              onChange={(e) =>
                setFormData({ ...formData, dateDernieresRegles: e.target.value })
              }
              className="w-full h-12 px-4 border-2 border-gray-300 rounded-lg text-sm focus:border-[var(--primary-teal)] focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Nombre de grossesses précédentes */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--dark-brown)] mb-2">
              <i className="ri-parent-fill text-lg text-[var(--primary-teal)]"></i>
              Nombre de grossesses précédentes
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  setFormData({
                    ...formData,
                    nombreGrossessesPrecedentes: Math.max(0, formData.nombreGrossessesPrecedentes - 1),
                  })
                }
                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <div className="flex-1 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl font-bold text-[var(--dark-brown)]">
                {formData.nombreGrossessesPrecedentes}
              </div>
              <button
                type="button"
                disabled={loading}
                onClick={() =>
                  setFormData({
                    ...formData,
                    nombreGrossessesPrecedentes: formData.nombreGrossessesPrecedentes + 1,
                  })
                }
                className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center justify-center text-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>

          {/* Antécédents médicaux */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-[var(--dark-brown)] mb-2">
              <i className="ri-file-list-3-fill text-lg text-[var(--primary-teal)]"></i>
              Antécédents médicaux (optionnel)
            </label>
            <textarea
              disabled={loading}
              value={formData.antecedentsMedicaux}
              onChange={(e) =>
                setFormData({ ...formData, antecedentsMedicaux: e.target.value })
              }
              rows={4}
              maxLength={500}
              placeholder="Maladies, allergies, opérations..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:border-[var(--primary-teal)] focus:outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.antecedentsMedicaux.length}/500 caractères
            </p>
          </div>

          {/* Message d'information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <i className="ri-information-fill text-xl text-blue-600 flex-shrink-0"></i>
              <p className="text-xs text-blue-800">
                Votre déclaration sera <strong>en attente de validation</strong> par un professionnel de santé.
                Vous recevrez une notification une fois validée.
              </p>
            </div>
          </div>

          {/* Boutons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-12 bg-gray-200 hover:bg-gray-300 text-[var(--dark-brown)] rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-12 bg-[var(--primary-teal)] hover:shadow-md text-white rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-lg"></i>
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <i className="ri-check-line text-lg"></i>
                  <span>Soumettre</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}