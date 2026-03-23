/**
 * Admin Service - API pour administrateurs
 */
import { api } from '../../../core/api/api';

const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock data
const mockUtilisateurs = [
  { id: 1, nom: 'Fatou Diop', email: 'fatou.diop@email.com', telephone: '+221 77 123 45 67', role: 'maman', dateInscription: '2024-09-10', statut: 'active' },
  { id: 2, nom: 'Dr. Aminata Ba', email: 'aminata.ba@hopital.sn', telephone: '+221 77 234 56 78', role: 'professionnel', specialite: 'Gynécologue', dateInscription: '2024-08-05', statut: 'active' },
  { id: 3, nom: 'Mariama Sow', email: 'mariama.sow@email.com', telephone: '+221 76 345 67 89', role: 'maman', dateInscription: '2024-09-12', statut: 'active' },
  { id: 4, nom: 'Fatou Sall', email: 'fatou.sall@clinique.sn', telephone: '+221 76 456 78 90', role: 'professionnel', specialite: 'Sage-femme', dateInscription: '2024-08-08', statut: 'active' },
  { id: 5, nom: 'Aïssatou Ndiaye', email: 'aissatou.ndiaye@email.com', telephone: '+221 77 567 89 01', role: 'maman', dateInscription: '2024-10-15', statut: 'active' },
  { id: 6, nom: 'Dr. Moussa Diop', email: 'moussa.diop@centre.sn', telephone: '+221 77 678 90 12', role: 'professionnel', specialite: 'Pédiatre', dateInscription: '2024-08-03', statut: 'inactive' },
];

const mockProfessionnelsEnAttente = [
  { id: 1, nom: 'Dr. Aminata Ba', email: 'aminata.ba@hopital.sn', telephone: '+221 77 123 45 67', specialite: 'Gynécologue', matricule: 'GYN-2024-001', centreDesante: 'Hôpital Principal de Dakar', dateInscription: '2025-01-15' },
  { id: 2, nom: 'Fatou Sall', email: 'fatou.sall@clinique.sn', telephone: '+221 76 234 56 78', specialite: 'Sage-femme', matricule: 'SF-2024-012', centreDesante: 'Clinique de la Mère et de l\'Enfant', dateInscription: '2025-01-16' },
  { id: 3, nom: 'Dr. Moussa Diop', email: 'moussa.diop@centre.sn', telephone: '+221 77 345 67 89', specialite: 'Pédiatre', matricule: 'PED-2024-008', centreDesante: 'Centre de Santé de Pikine', dateInscription: '2025-01-17' },
];

const mockStats = {
  totalMamans: 156,
  totalProfessionnels: 23,
  grossessesActives: 89,
  professionnelsEnAttente: 8,
  consultationsTotal: 342,
  vaccinationsTotal: 1087,
  grossessesParMois: [12, 19, 15, 22, 18, 25, 20, 28, 24, 31, 22, 18],
  labelsParMois: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
};

// ============ STATISTIQUES ============

export const getStatistiques = async () => {
  await delay();
  return mockStats;
};

// ============ UTILISATEURS ============

export const getUtilisateurs = async () => {
  await delay();
  return mockUtilisateurs;
};

export const getAllUsers = async () => {
  await delay();
  return mockUtilisateurs;
};

export const getUtilisateurById = async (id) => {
  await delay();
  return mockUtilisateurs.find(u => u.id === parseInt(id));
};

export const updateUtilisateur = async (id, data) => {
  await delay();
  return { id, ...data };
};

export const updateUserRole = async (userId, newRole) => {
  await delay();
  const user = mockUtilisateurs.find(u => u.id === userId);
  if (user) {
    user.role = newRole;
  }
  return { id: userId, role: newRole };
};

export const deleteUtilisateur = async (id) => {
  await delay();
  return { id, success: true };
};

export const deleteUser = async (userId) => {
  await delay();
  return { id: userId, success: true };
};

// ============ PROFESSIONNELS EN ATTENTE ============

export const getProfessionnelsEnAttente = async () => {
  await delay();
  return mockProfessionnelsEnAttente;
};

export const approveProfessionnel = async (id) => {
  await delay();
  return { id, statut: 'APPROUVE' };
};

export const rejectProfessionnel = async (id, motif) => {
  await delay();
  return { id, statut: 'REJETE', motif };
};

export default {
  getStatistiques,
  getUtilisateurs,
  getAllUsers,
  getUtilisateurById,
  updateUtilisateur,
  updateUserRole,
  deleteUtilisateur,
  deleteUser,
  getProfessionnelsEnAttente,
  approveProfessionnel,
  rejectProfessionnel,
};
