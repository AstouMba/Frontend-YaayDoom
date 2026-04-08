import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  addVaccination,
  createConsultation,
  registerAccouchement,
} from '../../application/professionnel';

interface PatientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  grossesse: {
    semaineActuelle: number;
    dateAccouchementPrevue: string;
    dateDernieresRegles: string;
    statut: 'EN_ATTENTE' | 'VALIDÉ';
  };
  bebe?: {
    id: string;
    nom: string;
    dateNaissance: string;
    poids: string;
    taille: string;
  };
}

interface Consultation {
  type: string;
  date: string;
  notes: string;
  tensionArterielle: string;
  poids: string;
}

interface Accouchement {
  dateAccouchement: string;
  heureAccouchement: string;
  typeAccouchement: string;
  sexeBebe: string;
  poidsBebe: string;
  tailleBebe: string;
  notes: string;
}

interface Vaccin {
  nomVaccin: string;
  dateAdministration: string;
  prochainRappel: string;
  notes: string;
}

const ConsultationPatient = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const patientData = location.state?.patient as PatientData;

  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showAccouchementModal, setShowAccouchementModal] = useState(false);
  const [showVaccinModal, setShowVaccinModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [consultationErrors, setConsultationErrors] = useState<{
    type?: string;
    date?: string;
    notes?: string;
    tensionArterielle?: string;
    poids?: string;
    general?: string;
  }>({});
  const [accouchementErrors, setAccouchementErrors] = useState<{
    dateAccouchement?: string;
    heureAccouchement?: string;
    typeAccouchement?: string;
    sexeBebe?: string;
    poidsBebe?: string;
    tailleBebe?: string;
    notes?: string;
    general?: string;
  }>({});
  const [vaccinErrors, setVaccinErrors] = useState<{
    nomVaccin?: string;
    dateAdministration?: string;
    prochainRappel?: string;
    notes?: string;
    general?: string;
  }>({});

  const [consultationForm, setConsultationForm] = useState<Consultation>({
    type: 'Consultation prénatale',
    date: '',
    notes: '',
    tensionArterielle: '',
    poids: ''
  });

  const [accouchementForm, setAccouchementForm] = useState<Accouchement>({
    dateAccouchement: '',
    heureAccouchement: '',
    typeAccouchement: 'Voie basse',
    sexeBebe: 'Garçon',
    poidsBebe: '',
    tailleBebe: '',
    notes: ''
  });

  const [vaccinForm, setVaccinForm] = useState<Vaccin>({
    nomVaccin: 'BCG',
    dateAdministration: '',
    prochainRappel: '',
    notes: ''
  });

  const updateConsultationForm = (field: keyof Consultation, value: string) => {
    setConsultationForm((prev) => ({ ...prev, [field]: value }));
    setConsultationErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const updateAccouchementForm = (field: keyof Accouchement, value: string) => {
    setAccouchementForm((prev) => ({ ...prev, [field]: value }));
    setAccouchementErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  const updateVaccinForm = (field: keyof Vaccin, value: string) => {
    setVaccinForm((prev) => ({ ...prev, [field]: value }));
    setVaccinErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  };

  // Rediriger si pas de données patient
  if (!patientData) {
    navigate('/scan-patient');
    return null;
  }

  const handleSubmitConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof consultationErrors = {};

    if (!consultationForm.type.trim()) nextErrors.type = 'Le type de consultation est requis';
    if (!consultationForm.date) nextErrors.date = 'La date de consultation est requise';
    if (consultationForm.notes.length > 500) nextErrors.notes = 'Maximum 500 caractères';

    if (Object.keys(nextErrors).length > 0) {
      setConsultationErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setFeedback('');
    setConsultationErrors({});

    try {
      await createConsultation(patientData.id, {
        type: consultationForm.type,
        date: consultationForm.date,
        notes: [
          consultationForm.notes,
          consultationForm.tensionArterielle ? `TA: ${consultationForm.tensionArterielle}` : null,
          consultationForm.poids ? `Poids: ${consultationForm.poids} kg` : null,
        ]
          .filter(Boolean)
          .join(' | '),
      });

      setShowConsultationModal(false);
      setConsultationForm({
        type: 'Consultation prénatale',
        date: '',
        notes: '',
        tensionArterielle: '',
        poids: '',
      });
      setFeedback('Consultation enregistree avec succes.');
    } catch {
      setFeedback('Echec de l enregistrement de la consultation.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitAccouchement = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof accouchementErrors = {};

    if (!accouchementForm.dateAccouchement) nextErrors.dateAccouchement = "La date d'accouchement est requise";
    if (!accouchementForm.heureAccouchement) nextErrors.heureAccouchement = "L'heure d'accouchement est requise";
    if (!accouchementForm.typeAccouchement.trim()) nextErrors.typeAccouchement = "Le type d'accouchement est requis";
    if (!accouchementForm.poidsBebe.trim()) nextErrors.poidsBebe = 'Le poids du bébé est requis';
    if (!accouchementForm.tailleBebe.trim()) nextErrors.tailleBebe = 'La taille du bébé est requise';
    if (accouchementForm.notes.length > 500) nextErrors.notes = 'Maximum 500 caractères';

    if (Object.keys(nextErrors).length > 0) {
      setAccouchementErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setFeedback('');
    setAccouchementErrors({});

    try {
      await registerAccouchement(patientData.id, {
        nom: patientData.bebe?.nom || `Bebe de ${patientData.name}`,
        date_naissance: accouchementForm.dateAccouchement,
        sexe: accouchementForm.sexeBebe === 'Garçon' ? 'M' : 'F',
        poids: accouchementForm.poidsBebe || null,
        taille: accouchementForm.tailleBebe || null,
      });

      setShowAccouchementModal(false);
      setAccouchementForm({
        dateAccouchement: '',
        heureAccouchement: '',
        typeAccouchement: 'Voie basse',
        sexeBebe: 'Garçon',
        poidsBebe: '',
        tailleBebe: '',
        notes: '',
      });
      setFeedback('Accouchement enregistre avec succes.');
    } catch {
      setFeedback('Echec de l enregistrement de l accouchement.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitVaccin = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof vaccinErrors = {};

    if (!vaccinForm.nomVaccin.trim()) nextErrors.nomVaccin = 'Le nom du vaccin est requis';
    if (!vaccinForm.dateAdministration) nextErrors.dateAdministration = "La date d'administration est requise";
    if (vaccinForm.notes.length > 500) nextErrors.notes = 'Maximum 500 caractères';

    if (Object.keys(nextErrors).length > 0) {
      setVaccinErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setFeedback('');
    setVaccinErrors({});

    try {
      await addVaccination(patientData.id, {
        bebe_id: patientData.bebe?.id,
        nom_vaccin: vaccinForm.nomVaccin,
        date_vaccination: vaccinForm.dateAdministration,
        prochaine_dose: vaccinForm.prochainRappel || null,
        notes: vaccinForm.notes || null,
      });

      setShowVaccinModal(false);
      setVaccinForm({
        nomVaccin: 'BCG',
        dateAdministration: '',
        prochainRappel: '',
        notes: '',
      });
      setFeedback('Vaccin ajoute avec succes.');
    } catch {
      setFeedback('Echec de l enregistrement du vaccin.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-main)' }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard-pro" className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary-teal)' }}>
                <i className="ri-heart-pulse-line text-white text-xl"></i>
              </div>
              <div>
                <span className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>YaayDoom+</span>
                <p className="text-xs" style={{ color: 'var(--primary-teal)' }}>Consultation Patient</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                <div className="w-7 h-7 flex items-center justify-center rounded-full" style={{ backgroundColor: 'var(--primary-teal)' }}>
                  <i className="ri-stethoscope-line text-white text-sm"></i>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer text-sm"
                style={{ borderColor: '#EAD7C8', color: '#3A2A24' }}
              >
                <i className="ri-logout-box-line"></i>
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/scan-patient"
          className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
          style={{ color: 'var(--primary-teal)' }}
        >
          <i className="ri-arrow-left-line"></i>
          Scanner une autre patiente
        </Link>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-green-800">
            <i className="ri-checkbox-circle-line text-xl"></i>
            <span className="font-bold text-base">Scan réussi ! Dossier de la patiente</span>
          </div>
        </div>
        {feedback && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-blue-800 text-sm font-medium">
            {feedback}
          </div>
        )}

        {/* Patient Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--background-soft)' }}>
                <i className="ri-user-line text-2xl" style={{ color: 'var(--primary-orange)' }}></i>
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
                  {patientData.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">ID: {patientData.id}</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <i className="ri-mail-line"></i>
                    <span>{patientData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="ri-phone-line"></i>
                    <span>{patientData.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <i className="ri-checkbox-circle-line mr-1"></i>
              {patientData.grossesse.statut}
            </span>
          </div>

          {/* Grossesse Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
              <div className="text-sm text-gray-600 mb-1">Semaine actuelle</div>
              <div className="text-2xl font-bold" style={{ color: 'var(--primary-orange)' }}>
                {patientData.grossesse.semaineActuelle}
              </div>
              <div className="text-xs text-gray-500">semaines</div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
              <div className="text-sm text-gray-600 mb-1">Accouchement prévu</div>
              <div className="text-base font-bold" style={{ color: 'var(--dark-brown)' }}>
                {new Date(patientData.grossesse.dateAccouchementPrevue).toLocaleDateString('fr-FR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
              <div className="text-sm text-gray-600 mb-1">Dernières règles</div>
              <div className="text-base font-bold" style={{ color: 'var(--dark-brown)' }}>
                {new Date(patientData.grossesse.dateDernieresRegles).toLocaleDateString('fr-FR', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>

          {/* Bébé Info (if exists) */}
          {patientData.bebe && (
            <div className="p-4 rounded-lg border-2 mb-6" style={{ borderColor: 'var(--primary-teal)' }}>
              <div className="flex items-center gap-2 mb-3">
                <i className="ri-bear-smile-line text-xl" style={{ color: 'var(--primary-teal)' }}></i>
                <h3 className="text-base font-bold" style={{ color: 'var(--dark-brown)' }}>
                  Bébé : {patientData.bebe.nom}
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Date de naissance</div>
                  <div className="font-medium" style={{ color: 'var(--dark-brown)' }}>
                    {new Date(patientData.bebe.dateNaissance).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Poids</div>
                  <div className="font-medium" style={{ color: 'var(--dark-brown)' }}>
                    {patientData.bebe.poids}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Taille</div>
                  <div className="font-medium" style={{ color: 'var(--dark-brown)' }}>
                    {patientData.bebe.taille}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setShowConsultationModal(true)}
              className="h-12 flex items-center justify-center gap-2 rounded-lg text-white font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: 'var(--primary-orange)' }}
            >
              <i className="ri-stethoscope-line text-lg"></i>
              Ajouter consultation
            </button>
            <button
              onClick={() => setShowAccouchementModal(true)}
              className="h-12 flex items-center justify-center gap-2 rounded-lg text-white font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
              style={{ backgroundColor: 'var(--primary-teal)' }}
            >
              <i className="ri-parent-line text-lg"></i>
              Enregistrer accouchement
            </button>
            <button
              onClick={() => setShowVaccinModal(true)}
              className="h-12 flex items-center justify-center gap-2 rounded-lg border-2 font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer whitespace-nowrap"
              style={{ borderColor: 'var(--primary-orange)', color: 'var(--primary-orange)' }}
            >
              <i className="ri-syringe-line text-lg"></i>
              Ajouter vaccin
            </button>
          </div>
        </div>
      </main>

      {/* Modal Consultation */}
      {showConsultationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>
                Ajouter une consultation
              </h2>
              <button
                onClick={() => setShowConsultationModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitConsultation} className="p-5">
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                <div className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>Patiente : {patientData.name}</div>
                <div className="text-xs text-gray-600">{patientData.email}</div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Type de consultation
                  </label>
                  <select
                    value={consultationForm.type}
                    onChange={(e) => updateConsultationForm('type', e.target.value)}
                    aria-invalid={!!consultationErrors.type}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer ${consultationErrors.type ? 'border-red-400' : 'border-gray-300'}`}
                  >
                    <option>Consultation prénatale</option>
                    <option>Échographie</option>
                    <option>Consultation de suivi</option>
                    <option>Consultation d'urgence</option>
                  </select>
                  {consultationErrors.type && <p className="mt-1 text-xs text-red-500">{consultationErrors.type}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Date de consultation
                  </label>
                  <input
                    type="date"
                    value={consultationForm.date}
                    onChange={(e) => updateConsultationForm('date', e.target.value)}
                    aria-invalid={!!consultationErrors.date}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${consultationErrors.date ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {consultationErrors.date && <p className="mt-1 text-xs text-red-500">{consultationErrors.date}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Tension artérielle (mmHg)
                    </label>
                    <input
                      type="text"
                      placeholder="120/80"
                      value={consultationForm.tensionArterielle}
                      onChange={(e) => updateConsultationForm('tensionArterielle', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Poids (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="65.5"
                      value={consultationForm.poids}
                      onChange={(e) => updateConsultationForm('poids', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Notes et observations
                  </label>
                  <textarea
                    value={consultationForm.notes}
                    onChange={(e) => updateConsultationForm('notes', e.target.value)}
                    rows={4}
                    placeholder="Observations médicales, recommandations..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    maxLength={500}
                  />
                  {consultationErrors.notes && <p className="mt-1 text-xs text-red-500">{consultationErrors.notes}</p>}
                  <div className="text-xs text-gray-500 mt-1">Maximum 500 caractères</div>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setShowConsultationModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                  style={{ borderColor: 'var(--primary-orange)', color: 'var(--primary-orange)' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
                  style={{ backgroundColor: 'var(--primary-orange)' }}
                >
                  {submitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Accouchement */}
      {showAccouchementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>
                Enregistrer un accouchement
              </h2>
              <button
                onClick={() => setShowAccouchementModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitAccouchement} className="p-5">
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                <div className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>Patiente : {patientData.name}</div>
                <div className="text-xs text-gray-600">{patientData.email}</div>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Date d'accouchement
                    </label>
                  <input
                    type="date"
                    value={accouchementForm.dateAccouchement}
                    onChange={(e) => updateAccouchementForm('dateAccouchement', e.target.value)}
                    aria-invalid={!!accouchementErrors.dateAccouchement}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${accouchementErrors.dateAccouchement ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {accouchementErrors.dateAccouchement && <p className="mt-1 text-xs text-red-500">{accouchementErrors.dateAccouchement}</p>}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Heure d'accouchement
                  </label>
                  <input
                    type="time"
                    value={accouchementForm.heureAccouchement}
                    onChange={(e) => updateAccouchementForm('heureAccouchement', e.target.value)}
                    aria-invalid={!!accouchementErrors.heureAccouchement}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${accouchementErrors.heureAccouchement ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {accouchementErrors.heureAccouchement && <p className="mt-1 text-xs text-red-500">{accouchementErrors.heureAccouchement}</p>}
                </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Type d'accouchement
                  </label>
                  <select
                    value={accouchementForm.typeAccouchement}
                    onChange={(e) => updateAccouchementForm('typeAccouchement', e.target.value)}
                    aria-invalid={!!accouchementErrors.typeAccouchement}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer ${accouchementErrors.typeAccouchement ? 'border-red-400' : 'border-gray-300'}`}
                  >
                    <option>Voie basse</option>
                    <option>Césarienne</option>
                    <option>Voie basse assistée</option>
                  </select>
                  {accouchementErrors.typeAccouchement && <p className="mt-1 text-xs text-red-500">{accouchementErrors.typeAccouchement}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Sexe du bébé
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sexe"
                        value="Garçon"
                        checked={accouchementForm.sexeBebe === 'Garçon'}
                        onChange={(e) => updateAccouchementForm('sexeBebe', e.target.value)}
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: 'var(--primary-orange)' }}
                      />
                      <span className="text-sm">Garçon</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="sexe"
                        value="Fille"
                        checked={accouchementForm.sexeBebe === 'Fille'}
                        onChange={(e) => updateAccouchementForm('sexeBebe', e.target.value)}
                        className="w-4 h-4 cursor-pointer"
                        style={{ accentColor: 'var(--primary-orange)' }}
                      />
                      <span className="text-sm">Fille</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Poids du bébé (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="3.5"
                      value={accouchementForm.poidsBebe}
                      onChange={(e) => updateAccouchementForm('poidsBebe', e.target.value)}
                      aria-invalid={!!accouchementErrors.poidsBebe}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${accouchementErrors.poidsBebe ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {accouchementErrors.poidsBebe && <p className="mt-1 text-xs text-red-500">{accouchementErrors.poidsBebe}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Taille du bébé (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="50"
                      value={accouchementForm.tailleBebe}
                      onChange={(e) => updateAccouchementForm('tailleBebe', e.target.value)}
                      aria-invalid={!!accouchementErrors.tailleBebe}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${accouchementErrors.tailleBebe ? 'border-red-400' : 'border-gray-300'}`}
                    />
                    {accouchementErrors.tailleBebe && <p className="mt-1 text-xs text-red-500">{accouchementErrors.tailleBebe}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Notes et observations
                  </label>
                  <textarea
                    value={accouchementForm.notes}
                    onChange={(e) => updateAccouchementForm('notes', e.target.value)}
                    rows={4}
                    placeholder="Observations médicales, complications éventuelles..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    maxLength={500}
                  />
                  {accouchementErrors.notes && <p className="mt-1 text-xs text-red-500">{accouchementErrors.notes}</p>}
                  <div className="text-xs text-gray-500 mt-1">Maximum 500 caractères</div>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setShowAccouchementModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                  style={{ borderColor: 'var(--primary-orange)', color: 'var(--primary-orange)' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
                  style={{ backgroundColor: 'var(--primary-teal)' }}
                >
                  {submitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Vaccin */}
      {showVaccinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>
                Ajouter un vaccin
              </h2>
              <button
                onClick={() => setShowVaccinModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmitVaccin} className="p-5">
              <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                <div className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>Patiente : {patientData.name}</div>
                <div className="text-xs text-gray-600">{patientData.email}</div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Nom du vaccin
                  </label>
                  <select
                    value={vaccinForm.nomVaccin}
                    onChange={(e) => updateVaccinForm('nomVaccin', e.target.value)}
                    aria-invalid={!!vaccinErrors.nomVaccin}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer ${vaccinErrors.nomVaccin ? 'border-red-400' : 'border-gray-300'}`}
                  >
                    <option>BCG</option>
                    <option>Hépatite B</option>
                    <option>Polio</option>
                    <option>DTC (Diphtérie, Tétanos, Coqueluche)</option>
                    <option>Pneumocoque</option>
                    <option>Rotavirus</option>
                    <option>ROR (Rougeole, Oreillons, Rubéole)</option>
                    <option>Méningocoque</option>
                  </select>
                  {vaccinErrors.nomVaccin && <p className="mt-1 text-xs text-red-500">{vaccinErrors.nomVaccin}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Date d'administration
                  </label>
                  <input
                    type="date"
                    value={vaccinForm.dateAdministration}
                    onChange={(e) => updateVaccinForm('dateAdministration', e.target.value)}
                    aria-invalid={!!vaccinErrors.dateAdministration}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${vaccinErrors.dateAdministration ? 'border-red-400' : 'border-gray-300'}`}
                  />
                  {vaccinErrors.dateAdministration && <p className="mt-1 text-xs text-red-500">{vaccinErrors.dateAdministration}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Prochain rappel (optionnel)
                  </label>
                  <input
                    type="date"
                    value={vaccinForm.prochainRappel}
                    onChange={(e) => updateVaccinForm('prochainRappel', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Notes
                  </label>
                  <textarea
                    value={vaccinForm.notes}
                    onChange={(e) => updateVaccinForm('notes', e.target.value)}
                    rows={3}
                    placeholder="Observations, réactions éventuelles..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    maxLength={500}
                  />
                  {vaccinErrors.notes && <p className="mt-1 text-xs text-red-500">{vaccinErrors.notes}</p>}
                  <div className="text-xs text-gray-500 mt-1">Maximum 500 caractères</div>
                </div>
              </div>

              <div className="flex gap-2 mt-5">
                <button
                  type="button"
                  onClick={() => setShowVaccinModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer"
                  style={{ borderColor: 'var(--primary-orange)', color: 'var(--primary-orange)' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
                  style={{ backgroundColor: 'var(--primary-orange)' }}
                >
                  {submitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationPatient;
