import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  mockFamille1,
  mockFamille2,
  mockBebes,
  mockVaccins,
  mockCroissanceBebe,
  MembreFamilial,
} from '../../mocks/db';

// ─── Types pour les formulaires ──────────────────────────────────────────────
interface ConsultationForm {
  type: string;
  date: string;
  tension: string;
  poids: string;
  hauteurUterine: string;
  bcf: string;
  notes: string;
}

interface AccouchementForm {
  date: string;
  heure: string;
  type: string;
  bebe: {
    prenom: string;
    sexe: string;
    poids: string;
    taille: string;
  }[];
  notes: string;
}

interface RendezVousForm {
  type: string;
  date: string;
  heure: string;
  professionnel: string;
  lieu: string;
  notes: string;
}

interface VaccinForm {
  vaccin: string;
  dateAdministration: string;
  prochainRappel: string;
  notes: string;
}

interface MesuresForm {
  poids: string;
  taille: string;
  perimetreCrânien: string;
  notes: string;
}

// ─── Panel Consultation Maman ────────────────────────────────────────────────
const ConsultationMamanPanel = ({ membre }: { membre: MembreFamilial }) => {
  const [activeTab, setActiveTab] = useState<'infos' | 'consultations' | 'rdv'>('infos');
  const [rdvFilter, setRdvFilter] = useState<'tous' | 'prevus' | 'effectues' | 'annules'>('tous');

  // États pour les modals
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [showAccouncementModal, setShowAccouncementModal] = useState(false);
  const [showRdvModal, setShowRdvModal] = useState(false);

  // Formulaires
  const [consultationForm, setConsultationForm] = useState<ConsultationForm>({
    type: 'prénatale',
    date: '',
    tension: '',
    poids: '',
    hauteurUterine: '',
    bcf: '',
    notes: ''
  });

  const [accouchementForm, setAccouchementForm] = useState<AccouchementForm>({
    date: '',
    heure: '',
    type: 'voie basse',
    bebe: [{ prenom: '', sexe: 'Garçon', poids: '', taille: '' }],
    notes: ''
  });

  const [rdvForm, setRdvForm] = useState<RendezVousForm>({
    type: 'Consultation prénatale',
    date: '',
    heure: '',
    professionnel: '',
    lieu: '',
    notes: ''
  });

  // Handlers
  const handleConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Consultation ajoutée:', consultationForm);
    setShowConsultationModal(false);
  };

  const handleAccouvementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Accouchement enregistré:', accouchementForm);
    setShowAccouncementModal(false);
  };

  const handleRdvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('RDV planifié:', rdvForm);
    setShowRdvModal(false);
  };

  // Mock RDV data for filtering
  const rdvs = [
    { id: 1, titre: 'Consultation Prénatale', date: '2025-04-15', statut: 'prevu' as const },
    { id: 2, titre: 'Échographie', date: '2025-04-01', statut: 'effectue' as const },
    { id: 3, titre: 'Analyse sanguine', date: '2025-03-20', statut: 'effectue' as const },
    { id: 4, titre: 'Consultation suivi', date: '2025-03-10', statut: 'annule' as const },
  ];

  const filteredRdvs = rdvs.filter((rdv) => {
    if (rdvFilter === 'tous') return true;
    if (rdvFilter === 'prevus') return rdv.statut === 'prevu';
    if (rdvFilter === 'effectues') return rdv.statut === 'effectue';
    if (rdvFilter === 'annules') return rdv.statut === 'annule';
    return true;
  });

  const getStatutBadge = (statut: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      prevu: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Prévu' },
      effectue: { bg: '#DCFCE7', color: '#16A34A', label: 'Effectué' },
      annule: { bg: '#FEE2E2', color: '#DC2626', label: 'Annulé' },
    };
    return styles[statut] || { bg: '#F3F4F6', color: '#6B7280', label: statut };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ backgroundColor: '#FEF0EA' }}
        >
          <i className="ri-user-line text-sm" style={{ color: 'var(--primary-orange)' }}></i>
        </div>
        <h3 className="font-bold" style={{ color: 'var(--dark-brown)' }}>
          Dossier de {membre.nom}
        </h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: '#EAD7C8' }}>
        {(['infos', 'consultations', 'rdv'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${
              activeTab === tab ? 'border-b-2' : ''
            }`}
            style={{
              borderColor: activeTab === tab ? 'var(--primary-teal)' : 'transparent',
              color: activeTab === tab ? 'var(--primary-teal)' : '#6B7280',
            }}
          >
            {tab === 'infos' ? 'Infos Grossesse' : tab === 'consultations' ? 'Consultations' : 'RDV'}
          </button>
        ))}
      </div>

      {/* Onglet Informations */}
      {activeTab === 'infos' && (
        <div className="space-y-4 animate-fade-in">
          {/* Informations Grossesse */}
          <div
            className="p-4 rounded-lg space-y-4"
            style={{ backgroundColor: 'var(--background-soft)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>
                Semaine
              </span>
              <span className="text-2xl font-bold" style={{ color: 'var(--primary-teal)' }}>
                {membre.semainesGrossesse ?? '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>
                DPA
              </span>
              <span className="font-medium" style={{ color: 'var(--dark-brown)' }}>
                {membre.dateAccouchementPrevue ?? '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>
                Statut
              </span>
              {membre.statutGrossesse === 'VALIDÉE' ? (
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}
                >
                  Validée
                </span>
              ) : (
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}
                >
                  En attente
                </span>
              )}
            </div>
          </div>

          {/* Boutons d'actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setShowConsultationModal(true)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-colors hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
            >
              <i className="ri-add-circle-line"></i>
              Ajouter consultation
            </button>
            <button
              onClick={() => setShowAccouncementModal(true)}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm border transition-colors hover:opacity-90 cursor-pointer"
              style={{ borderColor: 'var(--primary-orange)', color: 'var(--primary-orange)' }}
            >
              <i className="ri-save-3-line"></i>
              Enregistrer accouchement
            </button>
          </div>
        </div>
      )}

      {/* Onglet Consultations */}
      {activeTab === 'consultations' && (
        <div className="space-y-3 animate-fade-in">
          {[
            { titre: 'Consultation Prénatale', date: '2025-04-05', medecin: 'Dr. Fatou Sow', lieu: 'Hôpital Principal' },
            { titre: 'Échographie de contrôle', date: '2025-03-25', medecin: 'Dr. Marie Diop', lieu: 'Clinique Pasteur' },
            { titre: 'Consultation Prénatale', date: '2025-03-15', medecin: 'Dr. Fatou Sow', lieu: 'Hôpital Principal' },
          ].map((consultation, index) => (
            <div key={index} className="p-4 rounded-lg border" style={{ borderColor: '#EAD7C8' }}>
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm" style={{ color: 'var(--dark-brown)' }}>
                  {consultation.titre}
                </p>
                <span className="text-xs text-gray-500">{consultation.date}</span>
              </div>
              <p className="text-xs text-gray-500">{consultation.medecin} – {consultation.lieu}</p>
            </div>
          ))}
        </div>
      )}

      {/* Onglet Rendez-vous */}
      {activeTab === 'rdv' && (
        <div className="space-y-4 animate-fade-in">
          {/* Filtres */}
          <div className="flex gap-2 flex-wrap">
            {(['tous', 'prevus', 'effectues', 'annules'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setRdvFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  rdvFilter === filter ? '' : ''
                }`}
                style={{
                  backgroundColor: rdvFilter === filter ? 'var(--primary-teal)' : '#F3F4F6',
                  color: rdvFilter === filter ? 'white' : '#6B7280',
                }}
              >
                {filter === 'tous' ? 'Tous' : filter === 'prevus' ? 'Prévus' : filter === 'effectues' ? 'Effectués' : 'Annulés'}
              </button>
            ))}
          </div>

          {/* Liste des RDV filtrés */}
          <div className="space-y-3">
            {filteredRdvs.map((rdv) => {
              const badge = getStatutBadge(rdv.statut);
              return (
                <div
                  key={rdv.id}
                  className="p-4 rounded-lg border flex items-center gap-3"
                  style={{ borderColor: rdv.statut === 'prevu' ? 'var(--primary-teal)' : '#EAD7C8' }}
                >
                  <i
                    className={`ri-${
                      rdv.statut === 'prevu' ? 'calendar-event' : rdv.statut === 'effectue' ? 'calendar-check' : 'calendar-close'
                    }-line text-xl`}
                    style={{ color: rdv.statut === 'prevu' ? 'var(--primary-teal)' : '#6B7280' }}
                  ></i>
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: 'var(--dark-brown)' }}>
                      {rdv.titre}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--primary-teal)' }}>
                      {rdv.date}
                    </p>
                  </div>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: badge.bg, color: badge.color }}
                  >
                    {badge.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bouton Nouveau RDV */}
          <button
            onClick={() => setShowRdvModal(true)}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-sm transition-colors hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}
          >
            <i className="ri-add-circle-line"></i>
            Nouveau rendez-vous
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL : Ajouter consultation */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {showConsultationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>
                <i className="ri-stethoscope-line mr-2"></i>
                Ajouter une consultation
              </h2>
              <button
                onClick={() => setShowConsultationModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleConsultationSubmit} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Type de consultation
                  </label>
                  <select
                    value={consultationForm.type}
                    onChange={(e) => setConsultationForm({ ...consultationForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    required
                  >
                    <option value="prénatale">Consultation prénatale</option>
                    <option value="échographie">Échographie</option>
                    <option value="suivi">Suivi</option>
                    <option value="urgence">Urgence</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Date
                    </label>
                    <input
                      type="date"
                      value={consultationForm.date}
                      onChange={(e) => setConsultationForm({ ...consultationForm, date: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Tension artérielle
                    </label>
                    <input
                      type="text"
                      placeholder="120/80"
                      value={consultationForm.tension}
                      onChange={(e) => setConsultationForm({ ...consultationForm, tension: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Poids (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="65.5"
                      value={consultationForm.poids}
                      onChange={(e) => setConsultationForm({ ...consultationForm, poids: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Hauteur utérine (cm)
                    </label>
                    <input
                      type="number"
                      placeholder="28"
                      value={consultationForm.hauteurUterine}
                      onChange={(e) => setConsultationForm({ ...consultationForm, hauteurUterine: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    BCF (battements/min)
                  </label>
                  <input
                    type="number"
                    placeholder="140"
                    value={consultationForm.bcf}
                    onChange={(e) => setConsultationForm({ ...consultationForm, bcf: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Notes
                  </label>
                  <textarea
                    value={consultationForm.notes}
                    onChange={(e) => setConsultationForm({ ...consultationForm, notes: e.target.value })}
                    rows={4}
                    placeholder="Observations médicales..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">{consultationForm.notes.length}/500</div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowConsultationModal(false)}
                  className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--primary-orange)', color: 'var(--primary-orange)' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: 'var(--primary-orange)' }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL : Enregistrer accouchement */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {showAccouncementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>
                <i className="ri-parent-line mr-2"></i>
                Enregistrer un accouchement
              </h2>
              <button
                onClick={() => setShowAccouncementModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleAccouvementSubmit} className="p-5">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Date d'accouchement
                    </label>
                    <input
                      type="date"
                      value={accouchementForm.date}
                      onChange={(e) => setAccouchementForm({ ...accouchementForm, date: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Heure
                    </label>
                    <input
                      type="time"
                      value={accouchementForm.heure}
                      onChange={(e) => setAccouchementForm({ ...accouchementForm, heure: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Type d'accouchement
                  </label>
                  <select
                    value={accouchementForm.type}
                    onChange={(e) => setAccouchementForm({ ...accouchementForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    required
                  >
                    <option value="voie basse">Voie basse</option>
                    <option value="césarienne">Césarienne</option>
                    <option value="assistée">Voie basse assistée</option>
                  </select>
                </div>

                {/* Sections pour chaque bébé */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--dark-brown)' }}>
                    Informations du bébé
                  </h3>
                  {accouchementForm.bebe.map((bebe, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gray-50 mb-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--dark-brown)' }}>
                            Prénom
                          </label>
                          <input
                            type="text"
                            placeholder="Prénom du bébé"
                            value={bebe.prenom}
                            onChange={(e) => {
                              const newBebes = [...accouchementForm.bebe];
                              newBebes[index].prenom = e.target.value;
                              setAccouchementForm({ ...accouchementForm, bebe: newBebes });
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--dark-brown)' }}>
                            Sexe
                          </label>
                          <select
                            value={bebe.sexe}
                            onChange={(e) => {
                              const newBebes = [...accouchementForm.bebe];
                              newBebes[index].sexe = e.target.value;
                              setAccouchementForm({ ...accouchementForm, bebe: newBebes });
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                            required
                          >
                            <option value="Garçon">Garçon</option>
                            <option value="Fille">Fille</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--dark-brown)' }}>
                            Poids (kg)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="3.5"
                            value={bebe.poids}
                            onChange={(e) => {
                              const newBebes = [...accouchementForm.bebe];
                              newBebes[index].poids = e.target.value;
                              setAccouchementForm({ ...accouchementForm, bebe: newBebes });
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--dark-brown)' }}>
                            Taille (cm)
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            placeholder="50"
                            value={bebe.taille}
                            onChange={(e) => {
                              const newBebes = [...accouchementForm.bebe];
                              newBebes[index].taille = e.target.value;
                              setAccouchementForm({ ...accouchementForm, bebe: newBebes });
                            }}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Notes
                  </label>
                  <textarea
                    value={accouchementForm.notes}
                    onChange={(e) => setAccouchementForm({ ...accouchementForm, notes: e.target.value })}
                    rows={3}
                    placeholder="Observations, complications..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">{accouchementForm.notes.length}/500</div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowAccouncementModal(false)}
                  className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: 'var(--primary-teal)' }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL : Nouveau rendez-vous */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {showRdvModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>
                <i className="ri-calendar-event-line mr-2"></i>
                Nouveau rendez-vous
              </h2>
              <button
                onClick={() => setShowRdvModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleRdvSubmit} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Type de rendez-vous
                  </label>
                  <select
                    value={rdvForm.type}
                    onChange={(e) => setRdvForm({ ...rdvForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    required
                  >
                    <option value="Consultation prénatale">Consultation prénatale</option>
                    <option value="Échographie">Échographie</option>
                    <option value="Bilan sanguin">Bilan sanguin</option>
                    <option value="Suivi fœtal">Suivi fœtal</option>
                    <option value="Consultation de suivi">Consultation de suivi</option>
                    <option value="Urgence">Urgence</option>
                    <option value="Sage-femme">Sage-femme</option>
                    <option value="Pédiatre">Pédiatre</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Date
                    </label>
                    <input
                      type="date"
                      value={rdvForm.date}
                      onChange={(e) => setRdvForm({ ...rdvForm, date: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Heure
                    </label>
                    <input
                      type="time"
                      value={rdvForm.heure}
                      onChange={(e) => setRdvForm({ ...rdvForm, heure: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Professionnel de santé
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Fatou Sow"
                    value={rdvForm.professionnel}
                    onChange={(e) => setRdvForm({ ...rdvForm, professionnel: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Lieu
                  </label>
                  <input
                    type="text"
                    placeholder="Hôpital Principal de Dakar"
                    value={rdvForm.lieu}
                    onChange={(e) => setRdvForm({ ...rdvForm, lieu: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Notes (optionnel)
                  </label>
                  <textarea
                    value={rdvForm.notes}
                    onChange={(e) => setRdvForm({ ...rdvForm, notes: e.target.value })}
                    rows={3}
                    placeholder="Notes additionnelles..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">{rdvForm.notes.length}/500</div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowRdvModal(false)}
                  className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: 'var(--primary-teal)' }}
                >
                  <i className="ri-calendar-event-line mr-2"></i>
                  Planifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Panel Consultation Bébé ─────────────────────────────────────────────────
const ConsultationBebePanel = ({ membre }: { membre: MembreFamilial }) => {
  const [activeTab, setActiveTab] = useState<'vaccinal' | 'mesures' | 'evolution'>('vaccinal');
  const bebeData = mockBebes.find((b) => b.id === membre.id);
  
  // États pour les modals
  const [showVaccinModal, setShowVaccinModal] = useState(false);
  const [showMesuresModal, setShowMesuresModal] = useState(false);

  // Formulaires
  const [vaccinForm, setVaccinForm] = useState<VaccinForm>({
    vaccin: 'BCG',
    dateAdministration: '',
    prochainRappel: '',
    notes: ''
  });

  const [mesuresForm, setMesuresForm] = useState<MesuresForm>({
    poids: '',
    taille: '',
    perimetreCrânien: '',
    notes: ''
  });

  // Handlers
  const handleVaccinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Vaccin enregistré:', vaccinForm);
    setShowVaccinModal(false);
  };

  const handleMesuresSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Mesures enregistrées:', mesuresForm);
    setShowMesuresModal(false);
  };

  // Calculer le nombre de vaccins effectués
  const vaccinesEffectues = mockVaccins.filter(
    (v) => v.bebeId === membre.id && v.statut === 'completed'
  ).length;

  // Regrouper les vaccins par statut
  const vaccinesBebe = mockVaccins.filter((v) => v.bebeId === membre.id);
  const vaccinesEnRetard = vaccinesBebe.filter((v) => v.statut === 'overdue');
  const vaccinesAVenir = vaccinesBebe.filter((v) => v.statut === 'upcoming');
  const vaccinesFaits = vaccinesBebe.filter((v) => v.statut === 'completed');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ backgroundColor: '#E6F5F3' }}
        >
          <i
            className="ri-shield-cross-line text-sm"
            style={{ color: 'var(--primary-teal)' }}
          ></i>
        </div>
        <h3 className="font-bold" style={{ color: 'var(--dark-brown)' }}>
          Dossier de {membre.nom}
        </h3>
      </div>

      {/* 📊 Informations générales */}
      <div
        className="p-4 rounded-lg"
        style={{ backgroundColor: 'var(--background-soft)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <i className="ri-information-line" style={{ color: 'var(--primary-teal)' }}></i>
          <span className="font-semibold text-sm" style={{ color: 'var(--dark-brown)' }}>
            Informations générales
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <i className="ri-scales-3-line text-gray-400"></i>
              <span className="text-xs text-gray-500">Poids</span>
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--primary-orange)' }}>
              {membre.poids ?? bebeData?.poidsActuel ?? '—'} kg
            </span>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <i className="ri-ruler-line text-gray-400"></i>
              <span className="text-xs text-gray-500">Taille</span>
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--primary-orange)' }}>
              {membre.taille ?? bebeData?.tailleActuelle ?? '—'} cm
            </span>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 mb-1">
              <i className="ri-vaccine-line text-gray-400"></i>
              <span className="text-xs text-gray-500">Vaccins</span>
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--primary-teal)' }}>
              {vaccinesEffectues}
            </span>
          </div>
        </div>
      </div>

      {/* 🔘 Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowVaccinModal(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-xs border transition-colors hover:opacity-90 cursor-pointer"
          style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
        >
          <i className="ri-needle-line"></i>
          Enregistrer le vaccin
        </button>
        <button
          onClick={() => setShowMesuresModal(true)}
          className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg font-medium text-xs border transition-colors hover:opacity-90 cursor-pointer"
          style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
        >
          <i className="ri-tape-line"></i>
          Mesures du jour
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: '#EAD7C8' }}>
        {(['vaccinal', 'mesures', 'evolution'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-2 font-medium text-xs transition-colors ${
              activeTab === tab ? 'border-b-2' : ''
            }`}
            style={{
              borderColor: activeTab === tab ? 'var(--primary-orange)' : 'transparent',
              color: activeTab === tab ? 'var(--primary-orange)' : '#6B7280',
            }}
          >
            {tab === 'vaccinal' ? 'Carnet' : tab === 'mesures' ? 'Mesures' : 'Évolution'}
          </button>
        ))}
      </div>

      {/* Carnet Vaccinal */}
      {activeTab === 'vaccinal' && (
        <div className="space-y-4 animate-fade-in">
          {/* Section : Vaccins en retard */}
          {vaccinesEnRetard.length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#EF4444' }}>
                <i className="ri-alarm-warning-line"></i>
                Vaccins en retard ({vaccinesEnRetard.length})
              </h4>
              <div className="space-y-2">
                {vaccinesEnRetard.map((vaccin) => (
                  <div
                    key={vaccin.id}
                    className="p-3 rounded-lg border-l-4"
                    style={{ backgroundColor: '#FEF2F2', borderColor: '#EF4444' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--dark-brown)' }}>
                          {vaccin.nom}
                        </p>
                        <p className="text-xs" style={{ color: '#EF4444' }}>
                          Prévu : {vaccin.datePrevu} · Âge : {vaccin.age}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                        En retard
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section : À venir */}
          {vaccinesAVenir.length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--primary-orange)' }}>
                <i className="ri-time-line"></i>
                À venir ({vaccinesAVenir.length})
              </h4>
              <div className="space-y-2">
                {vaccinesAVenir.map((vaccin) => (
                  <div
                    key={vaccin.id}
                    className="p-3 rounded-lg border-l-4"
                    style={{ backgroundColor: '#FFF8F0', borderColor: 'var(--primary-orange)' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--dark-brown)' }}>
                          {vaccin.nom}
                        </p>
                        <p className="text-xs text-gray-500">
                          Prévu : {vaccin.datePrevu} · Âge : {vaccin.age}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }}>
                        À venir
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section : Vaccins effectués */}
          {vaccinesFaits.length > 0 && (
            <div>
              <h4 className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: '#10B981' }}>
                <i className="ri-checkbox-circle-line"></i>
                Vaccins effectués ({vaccinesFaits.length})
              </h4>
              <div className="space-y-2">
                {vaccinesFaits.map((vaccin) => (
                  <div
                    key={vaccin.id}
                    className="p-3 rounded-lg border-l-4"
                    style={{ backgroundColor: '#ECFDF5', borderColor: '#10B981' }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--dark-brown)' }}>
                          {vaccin.nom}
                        </p>
                        <p className="text-xs text-gray-500">
                          Fait le : {vaccin.dateAdministre} · Âge : {vaccin.age}
                        </p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                        Fait
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mesures */}
      {activeTab === 'mesures' && (
        <div
          className="p-4 rounded-lg space-y-4 animate-fade-in"
          style={{ backgroundColor: 'var(--background-soft)' }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>
              Poids
            </span>
            <span className="text-xl font-bold" style={{ color: 'var(--primary-orange)' }}>
              {membre.poids ?? bebeData?.poidsActuel ?? '—'} kg
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>
              Taille
            </span>
            <span className="text-xl font-bold" style={{ color: 'var(--primary-orange)' }}>
              {membre.taille ?? bebeData?.tailleActuelle ?? '—'} cm
            </span>
          </div>
        </div>
      )}

      {/* Évolution */}
      {activeTab === 'evolution' && (
        <div
          className="p-4 rounded-lg border animate-fade-in"
          style={{ borderColor: '#EAD7C8' }}
        >
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--dark-brown)' }}>
            Historique Croissance
          </p>
          <div className="space-y-2">
            {mockCroissanceBebe
              .filter((c) => c.bebeId === membre.id)
              .slice(0, 6)
              .map((croissance, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{croissance.label}</span>
                  <span className="font-medium" style={{ color: 'var(--dark-brown)' }}>
                    {croissance.poids} kg
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL : Enregistrer vaccin */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {showVaccinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>
                <i className="ri-needle-line mr-2"></i>
                Enregistrer un vaccin
              </h2>
              <button
                onClick={() => setShowVaccinModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleVaccinSubmit} className="p-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Vaccin
                  </label>
                  <select
                    value={vaccinForm.vaccin}
                    onChange={(e) => setVaccinForm({ ...vaccinForm, vaccin: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                    required
                  >
                    <option value="BCG">BCG</option>
                    <option value="Hépatite B">Hépatite B</option>
                    <option value="Pentavalent">Pentavalent</option>
                    <option value="VPO">VPO</option>
                    <option value="Pneumocoque">Pneumocoque</option>
                    <option value="Rotavirus">Rotavirus</option>
                    <option value="ROR">ROR</option>
                    <option value="Fièvre Jaune">Fièvre Jaune</option>
                    <option value="Méningite A">Méningite A</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Date d'administration
                    </label>
                    <input
                      type="date"
                      value={vaccinForm.dateAdministration}
                      onChange={(e) => setVaccinForm({ ...vaccinForm, dateAdministration: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Prochain rappel (optionnel)
                    </label>
                    <input
                      type="date"
                      value={vaccinForm.prochainRappel}
                      onChange={(e) => setVaccinForm({ ...vaccinForm, prochainRappel: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Notes
                  </label>
                  <textarea
                    value={vaccinForm.notes}
                    onChange={(e) => setVaccinForm({ ...vaccinForm, notes: e.target.value })}
                    rows={3}
                    placeholder="Observations..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    maxLength={500}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowVaccinModal(false)}
                  className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: 'var(--primary-teal)' }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* MODAL : Mesures du jour */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {showMesuresModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>
                <i className="ri-tape-line mr-2"></i>
                Mesures du jour
              </h2>
              <button
                onClick={() => setShowMesuresModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleMesuresSubmit} className="p-5">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Poids (kg)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="5.5"
                      value={mesuresForm.poids}
                      onChange={(e) => setMesuresForm({ ...mesuresForm, poids: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      Taille (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="60"
                      value={mesuresForm.taille}
                      onChange={(e) => setMesuresForm({ ...mesuresForm, taille: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Périmètre crânien (cm) - optionnel
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="38"
                    value={mesuresForm.perimetreCrânien}
                    onChange={(e) => setMesuresForm({ ...mesuresForm, perimetreCrânien: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Notes
                  </label>
                  <textarea
                    value={mesuresForm.notes}
                    onChange={(e) => setMesuresForm({ ...mesuresForm, notes: e.target.value })}
                    rows={3}
                    placeholder="Observations..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    maxLength={500}
                  />
                  <div className="text-xs text-gray-500 mt-1 text-right">{mesuresForm.notes.length}/500</div>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  type="button"
                  onClick={() => setShowMesuresModal(false)}
                  className="flex-1 px-4 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                  style={{ backgroundColor: 'var(--primary-teal)' }}
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Carte Maman ─────────────────────────────────────────────────────────────
const MamanCard = ({
  membre,
  isConsulting,
  onConsulter,
}: {
  membre: MembreFamilial;
  isConsulting: boolean;
  onConsulter: () => void;
}) => (
  <div
    className={`bg-white rounded-xl p-5 shadow-sm transition-all hover:shadow-md ${
      isConsulting ? 'border-2' : 'border border-gray-100'
    }`}
    style={{ borderColor: isConsulting ? 'var(--primary-teal)' : undefined }}
  >
    {/* En-tête */}
    <div className="flex items-start gap-3 mb-4">
      <div
        className="w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0"
        style={{ backgroundColor: '#FEF0EA' }}
      >
        <i className="ri-user-line text-xl" style={{ color: 'var(--primary-orange)' }}></i>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-base" style={{ color: 'var(--dark-brown)' }}>
            {membre.nom}
          </span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: 'var(--primary-orange)' }}
          >
            Maman
          </span>
        </div>
        {membre.email && (
          <p className="text-sm text-gray-500 mt-0.5 truncate">{membre.email}</p>
        )}
        {membre.phone && <p className="text-sm text-gray-500">{membre.phone}</p>}
      </div>
    </div>

    {/* Badge Validée */}
    {membre.statutGrossesse === 'VALIDÉE' && (
      <div className="mb-3">
        <span
          className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full"
          style={{ backgroundColor: '#ECFDF5', color: '#10B981' }}
        >
          <i className="ri-checkbox-circle-fill text-base"></i>
          Validée
        </span>
      </div>
    )}

    {/* Stats grossesse */}
    {(membre.semainesGrossesse || membre.dateAccouchementPrevue) && (
      <div
        className="flex items-center gap-4 mb-4 text-sm"
        style={{ color: 'var(--dark-brown)' }}
      >
        {membre.semainesGrossesse && (
          <span className="flex items-center gap-1.5">
            <i className="ri-calendar-2-line text-gray-400"></i>
            <span className="font-semibold">{membre.semainesGrossesse} SA</span>
          </span>
        )}
        {membre.dateAccouchementPrevue && (
          <span className="flex items-center gap-1.5">
            <i className="ri-calendar-check-line text-gray-400"></i>
            {membre.dateAccouchementPrevue}
          </span>
        )}
      </div>
    )}

    {/* Bouton */}
    <button
      onClick={onConsulter}
      className="w-full py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
      style={{ borderColor: 'var(--primary-orange)', color: 'var(--primary-orange)' }}
    >
      <i className="ri-stethoscope-line"></i>
      Consulter la maman
    </button>
  </div>
);

// ─── Carte Bébé ───────────────────────────────────────────────────────────────
const BebeCard = ({
  membre,
  isConsulting,
  onConsulter,
}: {
  membre: MembreFamilial;
  isConsulting: boolean;
  onConsulter: () => void;
}) => {
  const sexeLabel =
    membre.sexe === 'Féminin'
      ? 'Fille'
      : membre.sexe === 'Masculin'
      ? 'Garçon'
      : membre.lien === 'fille'
      ? 'Fille'
      : membre.lien === 'fils'
      ? 'Garçon'
      : 'Enfant';

  const badgeColor = sexeLabel === 'Fille' ? 'var(--primary-teal)' : '#6366F1';
  const prenom = membre.nom.split(' ')[0];

  return (
    <div
      className={`bg-white rounded-xl p-5 shadow-sm transition-all hover:shadow-md ${
        isConsulting ? 'border-2' : 'border border-gray-100'
      }`}
      style={{ borderColor: isConsulting ? 'var(--primary-teal)' : undefined }}
    >
      {/* En-tête */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0"
          style={{ backgroundColor: '#E6F5F3' }}
        >
          <i
            className="ri-shield-cross-line text-xl"
            style={{ color: 'var(--primary-teal)' }}
          ></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-base" style={{ color: 'var(--dark-brown)' }}>
              {membre.nom}
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
              style={{ backgroundColor: badgeColor }}
            >
              {sexeLabel}
            </span>
          </div>
          {membre.dateNaissance && (
            <p className="text-sm text-gray-500 mt-0.5">Né(e) le {membre.dateNaissance}</p>
          )}
          {membre.age !== undefined && (
            <p className="text-sm text-gray-500">{membre.age} mois</p>
          )}
        </div>
      </div>

      {/* Mesures */}
      {(membre.poids !== undefined || membre.taille !== undefined) && (
        <div
          className="flex items-center gap-4 mb-3 text-sm"
          style={{ color: 'var(--dark-brown)' }}
        >
          {membre.poids !== undefined && (
            <span className="flex items-center gap-1.5">
              <i className="ri-scales-3-line text-gray-400"></i>
              <span className="font-semibold">{membre.poids} kg</span>
            </span>
          )}
          {membre.taille !== undefined && (
            <span className="flex items-center gap-1.5">
              <i className="ri-ruler-line text-gray-400"></i>
              <span className="font-semibold">{membre.taille} cm</span>
            </span>
          )}
        </div>
      )}

      {/* Alerte vaccins */}
      {membre.vaccinsEnRetard !== undefined && membre.vaccinsEnRetard > 0 && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg mb-4 text-sm font-medium"
          style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}
        >
          <i className="ri-alarm-warning-line"></i>
          {membre.vaccinsEnRetard} vaccin{membre.vaccinsEnRetard > 1 ? 's' : ''} en retard
        </div>
      )}

      {/* Bouton */}
      <button
        onClick={onConsulter}
        className="w-full py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
        style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
      >
        Consulter {prenom}
      </button>
    </div>
  );
};

// ─── Page principale DossierFamilial ─────────────────────────────────────────
const DossierFamilial = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consultingMember, setConsultingMember] = useState<MembreFamilial | null>(null);

  const dossier = id === 'FAM-002' ? mockFamille2 : mockFamille1;
  const maman = dossier.membres.find((m) => m.type === 'maman');
  const bebes = dossier.membres.filter((m) => m.type === 'bebe');
  const totalMembres = dossier.membres.length;

  const handleConsulter = (membre: MembreFamilial) => {
    setConsultingMember((prev) => (prev?.id === membre.id ? null : membre));
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Fil d'ariane */}
      <nav className="flex items-center gap-1.5 text-sm mb-5 flex-wrap">
        <Link
          to="/dashboard-pro"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          Tableau de bord
        </Link>
        <i className="ri-arrow-right-s-line text-gray-400"></i>
        <Link
          to="/dashboard-pro/scan"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          Scanner patient
        </Link>
        <i className="ri-arrow-right-s-line text-gray-400"></i>
        <span className="font-medium" style={{ color: 'var(--primary-teal)' }}>
          Dossier familial
        </span>
      </nav>

      {/* Bannière succès scan */}
      <div
        className="flex items-center justify-between p-4 rounded-xl mb-6 gap-4"
        style={{ backgroundColor: '#E6F5F3', border: '1px solid #C2E8E2' }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
            style={{ backgroundColor: 'var(--primary-teal)' }}
          >
            <i className="ri-qr-scan-line text-white text-lg"></i>
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 truncate">
              QR Code scanné avec succès — Dossier familial ouvert
            </p>
            <p className="text-sm" style={{ color: 'var(--primary-teal)' }}>
              Famille de{' '}
              <span className="font-medium">{maman?.nom ?? 'la patiente'}</span>{' '}
              · {totalMembres} membres
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/dashboard-pro/scan')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-white transition-colors whitespace-nowrap cursor-pointer flex-shrink-0"
          style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
        >
          <i className="ri-refresh-line"></i>
          Nouveau scan
        </button>
      </div>

      {/* En-tête section membres */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <i
            className="ri-home-heart-line text-xl"
            style={{ color: 'var(--primary-orange)' }}
          ></i>
          <h2 className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>
            Membres de la famille
          </h2>
        </div>
        <p className="text-sm text-gray-500 italic">
          Sélectionnez un membre pour consulter son dossier
        </p>
      </div>

      {/* Grille cartes membres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {maman && (
          <MamanCard
            membre={maman}
            isConsulting={consultingMember?.id === maman.id}
            onConsulter={() => handleConsulter(maman)}
          />
        )}
        {bebes.map((bebe) => (
          <BebeCard
            key={bebe.id}
            membre={bebe}
            isConsulting={consultingMember?.id === bebe.id}
            onConsulter={() => handleConsulter(bebe)}
          />
        ))}
      </div>

      {/* Panel consultation ou placeholder */}
      {consultingMember === null ? (
        <div
          className="rounded-xl p-14 flex flex-col items-center justify-center text-center"
          style={{ backgroundColor: '#F5E8DF' }}
        >
          <i
            className="ri-cursor-line text-4xl mb-3"
            style={{ color: 'var(--primary-orange)' }}
          ></i>
          <p className="font-medium text-gray-700">
            Sélectionnez un membre ci-dessus pour consulter son dossier
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--primary-teal)' }}>
            {maman?.nom ?? ''} · {bebes.length} enfant
            {bebes.length > 1 ? 's' : ''} enregistré{bebes.length > 1 ? 's' : ''}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-slide-up">
          {consultingMember.type === 'maman' ? (
            <ConsultationMamanPanel membre={consultingMember} />
          ) : (
            <ConsultationBebePanel membre={consultingMember} />
          )}
        </div>
      )}
    </div>
  );
};

export default DossierFamilial;
