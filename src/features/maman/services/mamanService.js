/**
 * Maman Service - Grossesse et bébé API
 */
import { api } from '../../../core/api/api';

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const mockGrossesse = {
  id: 'g-001',
  mamanId: 'u-001',
  mamanNom: 'Aminata Diallo',
  dateDernieresRegles: '2024-09-10',
  dateAccouchePrevue: '2025-06-17',
  semaineGrossesse: 26,
  nombreGrossessesPrecedentes: 1,
  antecedentsMedicaux: 'Légère anémie en fin de grossesse précédente.',
  statut: 'VALIDEE',
  professionnelValidateur: 'Dr. Fatou Sow',
  dateValidation: '2024-09-20',
  trimestre: 2,
};

const mockBebe = {
  id: 'b-001',
  grossesseId: 'g-001',
  mamanId: 'u-001',
  nom: 'Aminata Jr Diallo',
  dateNaissance: '2024-03-15',
  sexe: 'Féminin',
  poidsNaissance: 3.2,
  tailleNaissance: 49,
  groupeSanguin: 'O+',
  ageActuel: '12 mois',
  poidsActuel: 9.1,
  tailleActuelle: 74,
};

const mockVaccins = [
  { id: 'v-001', bebeId: 'b-001', nom: 'BCG', age: 'À la naissance', datePrevu: '2024-03-15', dateAdministre: '2024-03-15', statut: 'completed', professionnel: 'Sage-femme Aïssatou Ba' },
  { id: 'v-002', bebeId: 'b-001', nom: 'Hépatite B (1ère dose)', age: 'À la naissance', datePrevu: '2024-03-15', dateAdministre: '2024-03-15', statut: 'completed', professionnel: 'Sage-femme Aïssatou Ba' },
  { id: 'v-003', bebeId: 'b-001', nom: 'Pentavalent (1ère dose)', age: '6 semaines', datePrevu: '2024-04-26', dateAdministre: '2024-04-26', statut: 'completed', professionnel: 'Dr. Fatou Sow' },
  { id: 'v-004', bebeId: 'b-001', nom: 'VPO (1ère dose)', age: '6 semaines', datePrevu: '2024-04-26', dateAdministre: '2024-04-26', statut: 'completed', professionnel: 'Dr. Fatou Sow' },
  { id: 'v-005', bebeId: 'b-001', nom: 'Pentavalent (2ème dose)', age: '10 semaines', datePrevu: '2024-05-24', dateAdministre: '2024-05-24', statut: 'completed', professionnel: 'Dr. Fatou Sow' },
  { id: 'v-006', bebeId: 'b-001', nom: 'Pentavalent (3ème dose)', age: '14 semaines', datePrevu: '2024-06-21', dateAdministre: '2024-06-21', statut: 'completed', professionnel: 'Dr. Fatou Sow' },
  { id: 'v-007', bebeId: 'b-001', nom: 'ROR', age: '9 mois', datePrevu: '2024-12-15', dateAdministre: '2024-12-15', statut: 'completed', professionnel: 'Dr. Fatou Sow' },
  { id: 'v-008', bebeId: 'b-001', nom: 'Fièvre Jaune', age: '9 mois', datePrevu: '2024-12-15', dateAdministre: '2024-12-15', statut: 'completed', professionnel: 'Dr. Fatou Sow' },
  { id: 'v-009', bebeId: 'b-001', nom: 'Méningite A', age: '12 mois', datePrevu: '2025-03-15', dateAdministre: null, statut: 'upcoming', professionnel: null },
  { id: 'v-010', bebeId: 'b-001', nom: 'Pneumocoque', age: '15 mois', datePrevu: '2025-06-15', dateAdministre: null, statut: 'upcoming', professionnel: null },
];

const mockRendezVous = [
  { id: 'rdv-001', type: 'Consultation prénatale', date: '2025-04-05', heure: '09:30', professionnel: 'Dr. Fatou Sow', lieu: 'Hôpital Principal de Dakar', statut: 'prévu' },
  { id: 'rdv-002', type: 'Échographie', date: '2025-04-20', heure: '14:00', professionnel: 'Dr. Fatou Sow', lieu: 'Clinique de la Mère et de l\'Enfant', statut: 'prévu' },
];

const mockEvolGrossesse = [
  { semaine: 6, titre: '1er trimestre - semaine 6', description: 'Cœur du bébé commence à battre' },
  { semaine: 12, titre: '1er trimestre - semaine 12', description: 'Fin du premier trimestre. Le bébé mesure ~6cm' },
  { semaine: 20, titre: '2ème trimestre - semaine 20', description: 'Échographie morphologique. Le bébé fait ~250g' },
  { semaine: 26, titre: '2ème trimestre - semaine 26 (maintenant)', description: 'Le bébé ouvre les yeux, entend des sons', current: true },
  { semaine: 32, titre: '3ème trimestre - semaine 32', description: 'Préparation à la naissance, position tête en bas' },
  { semaine: 40, titre: 'Terme - semaine 40', description: 'Date d\'accouchement prévue' },
];

// ============ GROSSESSE ============

export const getGrossesse = async () => {
  await delay();
  return mockGrossesse;
};

export const createGrossesse = async (data) => {
  await delay();
  return {
    id: 'g-' + Date.now(),
    ...data,
    statut: 'EN_ATTENTE',
    dateCreation: new Date().toISOString(),
  };
};

export const updateGrossesse = async (id, data) => {
  await delay();
  return { id, ...data };
};

// ============ BÉBÉ ============

export const getBebe = async () => {
  await delay();
  return mockBebe;
};

export const getCroissanceBebe = async () => {
  await delay();
  return [
    { mois: 0, label: 'Naissance', poids: 3.2, taille: 49 },
    { mois: 1, label: '1 mois', poids: 4.1, taille: 53 },
    { mois: 2, label: '2 mois', poids: 5.0, taille: 57 },
    { mois: 3, label: '3 mois', poids: 5.8, taille: 60 },
    { mois: 6, label: '6 mois', poids: 7.6, taille: 67 },
    { mois: 9, label: '9 mois', poids: 8.7, taille: 72 },
    { mois: 12, label: '12 mois', poids: 9.1, taille: 74 },
  ];
};

// ============ VACCINATIONS ============

export const getVaccins = async () => {
  await delay();
  return mockVaccins;
};

export const getProchainVaccin = async () => {
  await delay();
  return mockVaccins.find(v => v.statut === 'upcoming');
};

// ============ RENDEZ-VOUS ============

export const getRendezVous = async () => {
  await delay();
  return mockRendezVous;
};

export const getEvolutionGrossesse = async () => {
  await delay();
  return mockEvolGrossesse;
};

export default {
  getGrossesse,
  createGrossesse,
  updateGrossesse,
  getBebe,
  getCroissanceBebe,
  getVaccins,
  getProchainVaccin,
  getRendezVous,
  getEvolutionGrossesse,
};
