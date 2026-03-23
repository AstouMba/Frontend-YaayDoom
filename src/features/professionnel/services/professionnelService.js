/**
 * Professionnel Service - API pour professionnels de santé
 */
import { api } from '../../../core/api/api';

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const mockGrossesses = [
  { id: 'g-001', mamanNom: 'Aminata Diallo', mamanId: 'u-001', semaineGrossesse: 26, statut: 'VALIDEE', dateDernieresRegles: '2024-09-10', numeroTelephone: '+221 77 123 45 67' },
  { id: 'g-002', mamanNom: 'Fatou Sall', mamanId: 'u-004', semaineGrossesse: 10, statut: 'EN_ATTENTE', dateDernieresRegles: '2025-01-05', numeroTelephone: '+221 76 234 56 78' },
  { id: 'g-003', mamanNom: 'Mariama Sow', mamanId: 'u-005', semaineGrossesse: 32, statut: 'VALIDEE', dateDernieresRegles: '2024-06-15', numeroTelephone: '+221 77 345 67 89' },
];

const mockPatients = [
  { id: 'p-001', nom: 'Aminata Jr', dateDenaissance: '2024-03-15', sexe: 'Fille', nomMaman: 'Aminata Diallo', telephone: '+221 77 123 45 67' },
  { id: 'p-002', nom: 'Moussa Jr', dateDenaissance: '2024-09-20', sexe: 'Garçon', nomMaman: 'Moussa Diop', telephone: '+221 76 234 56 78' },
  { id: 'p-003', nom: 'Fatou Jr', dateDenaissance: '2024-06-10', sexe: 'Fille', nomMaman: 'Fatou Ba', telephone: '+221 77 345 67 89' },
];

const mockConsultations = [
  { id: 'c-001', patientId: 'p-001', patientNom: 'Aminata Jr', type: 'routine', date: '2025-03-15', poids: '9.1', taille: '74', temperature: '37.2', tension: '110/70', diagnostic: 'En bonne santé', traitement: 'Aucun', patientId: 'p-001' },
  { id: 'c-002', patientId: 'p-002', patientNom: 'Moussa Jr', type: 'vaccination', date: '2025-03-20', poids: '11.2', taille: '80', temperature: '36.8', tension: '100/60', patientId: 'p-002' },
  { id: 'c-003', patientId: 'p-003', patientNom: 'Fatou Jr', type: 'suivi', date: '2025-03-22', poids: '10.5', taille: '77', temperature: '37.0', patientId: 'p-003' },
];

const mockVaccinations = [
  { id: 'v-001', patientId: 'p-001', patientNom: 'Aminata Jr', vaccin: 'Méningite A', age: '12 mois', date: '2025-03-15', statut: 'complete', lot: 'MEN-2024-001' },
  { id: 'v-002', patientId: 'p-002', patientNom: 'Moussa Jr', vaccin: 'Rappel DTC', age: '18 mois', date: '2025-04-01', statut: 'pending', lot: '' },
  { id: 'v-003', patientId: 'p-003', patientNom: 'Fatou Jr', vaccin: 'Pneumocoque', age: '15 mois', date: '2025-03-20', statut: 'pending', lot: '' },
];

// ============ PATIENTS ============

export const getPatients = async () => {
  await delay();
  return mockPatients;
};

export const getPatientById = async (id) => {
  await delay();
  return mockPatients.find(p => p.id === id);
};

export const getPatientByQRCode = async (code) => {
  await delay();
  // Simulate QR code lookup
  const patient = mockPatients.find(p => p.id === code || p.nom.includes(code));
  if (patient) return patient;
  throw new Error('Patient non trouvé');
};

// ============ GROSSESSES ============

export const getGrossesses = async () => {
  await delay();
  return mockGrossesses;
};

export const getGrossesseById = async (id) => {
  await delay();
  return mockGrossesses.find(g => g.id === id);
};

export const validateGrossesse = async (id) => {
  await delay();
  return { id, statut: 'VALIDEE' };
};

export const getGrossessesEnAttente = async () => {
  await delay();
  return mockGrossesses.filter(g => g.statut === 'EN_ATTENTE');
};

// ============ CONSULTATIONS ============

export const getConsultations = async (patientId) => {
  await delay();
  if (patientId) {
    return mockConsultations.filter(c => c.patientId === patientId);
  }
  return mockConsultations;
};

export const getAllConsultations = async () => {
  await delay();
  return mockConsultations;
};

export const getConsultationById = async (id) => {
  await delay();
  return mockConsultations.find(c => c.id === id);
};

export const createConsultation = async (patientId, data) => {
  await delay();
  return { id: 'c-' + Date.now(), patientId, ...data, statut: 'scheduled' };
};

export const updateConsultation = async (id, data) => {
  await delay();
  return { id, ...data };
};

// ============ VACCINATIONS ============

export const getVaccinations = async () => {
  await delay();
  return mockVaccinations;
};

export const getVaccinationsByPatient = async (patientId) => {
  await delay();
  return mockVaccinations.filter(v => v.patientId === patientId);
};

export const addVaccination = async (patientId, data) => {
  await delay();
  return { id: 'v-' + Date.now(), patientId, ...data, statut: 'complete' };
};

export const administrerVaccin = async (id) => {
  await delay();
  return { id, statut: 'complete', dateAdministre: new Date().toISOString() };
};

// ============ SCAN PATIENT ============

export const scanPatient = async (qrData) => {
  await delay();
  // Simulate QR code scan - return patient info
  if (qrData.includes('u-001')) {
    return {
      type: 'grossesse',
      id: 'g-001',
      mamanNom: 'Aminata Diallo',
      semaineGrossesse: 26,
      statut: 'VALIDEE',
    };
  }
  if (qrData.includes('b-001') || qrData.includes('p-001')) {
    return {
      type: 'bebe',
      id: 'b-001',
      bebeNom: 'Aminata Jr',
      mamanNom: 'Aminata Diallo',
      age: '12 mois',
    };
  }
  throw new Error('Patient non trouvé');
};

export default {
  getPatients,
  getPatientById,
  getPatientByQRCode,
  getGrossesses,
  getGrossesseById,
  validateGrossesse,
  getGrossessesEnAttente,
  getConsultations,
  getAllConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  getVaccinations,
  getVaccinationsByPatient,
  addVaccination,
  administrerVaccin,
  scanPatient,
};
