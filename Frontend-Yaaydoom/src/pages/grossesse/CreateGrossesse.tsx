import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGrossesse } from '../../features/maman/services/mamanService';

export default function CreateGrossesse() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    dateDernieresRegles: '',
    nombreGrossessesPrecedentes: '0',
    antecedentsMedicaux: '',
    groupeSanguin: '',
    allergies: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGrossesse({
        dateDernieresRegles: formData.dateDernieresRegles,
        antecedentsMedicaux: formData.antecedentsMedicaux,
      });
      alert('Votre déclaration de grossesse a été enregistrée.');
      navigate('/dashboard-maman');
    } catch {
      alert('Impossible d’enregistrer la déclaration pour le moment.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-main)' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard-maman')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <i className="ri-arrow-left-line text-xl"></i>
              <span className="font-medium">Retour au tableau de bord</span>
            </button>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--dark-brown)' }}>
              Déclarer ma grossesse
            </h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Info Banner */}
          <div className="mb-8 p-4 rounded-xl" style={{ backgroundColor: 'var(--background-soft)' }}>
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-2xl mt-1" style={{ color: 'var(--primary-teal)' }}></i>
              <div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--dark-brown)' }}>
                  Information importante
                </h3>
                <p className="text-sm text-gray-600">
                  Votre déclaration sera examinée par un professionnel de santé qui validera votre grossesse et vous accompagnera tout au long de votre suivi.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date dernières règles */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dark-brown)' }}>
                Date de vos dernières règles <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="dateDernieresRegles"
                value={formData.dateDernieresRegles}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-all"
              />
              <p className="mt-1 text-xs text-gray-500">
                Cette date permet de calculer votre terme et votre semaine de grossesse
              </p>
            </div>

            {/* Nombre de grossesses précédentes */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dark-brown)' }}>
                Nombre de grossesses précédentes <span className="text-red-500">*</span>
              </label>
              <select
                name="nombreGrossessesPrecedentes"
                value={formData.nombreGrossessesPrecedentes}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-all"
              >
                <option value="0">Première grossesse</option>
                <option value="1">1 grossesse précédente</option>
                <option value="2">2 grossesses précédentes</option>
                <option value="3">3 grossesses précédentes</option>
                <option value="4">4 grossesses ou plus</option>
              </select>
            </div>

            {/* Groupe sanguin */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dark-brown)' }}>
                Groupe sanguin
              </label>
              <select
                name="groupeSanguin"
                value={formData.groupeSanguin}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-all"
              >
                <option value="">Sélectionnez votre groupe sanguin</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dark-brown)' }}>
                Allergies connues
              </label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="Ex: Pénicilline, Arachides..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-all"
              />
            </div>

            {/* Antécédents médicaux */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--dark-brown)' }}>
                Antécédents médicaux
              </label>
              <textarea
                name="antecedentsMedicaux"
                value={formData.antecedentsMedicaux}
                onChange={handleChange}
                rows={4}
                placeholder="Décrivez vos antécédents médicaux importants (diabète, hypertension, chirurgies précédentes, etc.)"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-gray-500 text-right">
                {formData.antecedentsMedicaux.length}/500 caractères
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard-maman')}
                className="flex-1 px-6 py-3 border-2 rounded-xl font-medium transition-all hover:bg-gray-50"
                style={{ borderColor: 'var(--dark-brown)', color: 'var(--dark-brown)' }}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 text-white rounded-xl font-medium transition-all hover:opacity-90 shadow-lg"
                style={{ backgroundColor: 'var(--primary-teal)' }}
              >
                Déclarer ma grossesse
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
