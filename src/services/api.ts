import axios from 'axios';

// Instance axios conservée pour usage futur avec un vrai backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

export default api;

// ─── Simulation locale ───────────────────────────────────────────────────────

const delay = (ms = 600) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  login: async (email: string, _password: string) => {
    await delay();
    const roles: Record<string, string> = {
      'maman@demo.com': 'maman',
      'pro@demo.com': 'professionnel',
      'admin@demo.com': 'admin',
    };
    const role = roles[email];
    if (!role) throw new Error('Identifiants incorrects');
    return { token: 'demo-token', role, email };
  },

  register: async (userData: any) => {
    await delay();
    return { success: true, ...userData };
  },

  logout: async () => {
    await delay(200);
  },

  getCurrentUser: async () => {
    await delay();
    return { name: 'Fatou Diallo', email: 'maman@demo.com', role: 'maman' };
  },
};

export const grossesseService = {
  create: async (data: any) => {
    await delay();
    return { id: 'g-001', statut: 'EN_ATTENTE', ...data };
  },

  getAll: async () => {
    await delay();
    return [
      { id: 'g-001', statut: 'VALIDEE', semaineGrossesse: 24, prochainRDV: '15 Janvier 2025' },
    ];
  },

  getById: async (id: string) => {
    await delay();
    return { id, statut: 'VALIDEE', semaineGrossesse: 24 };
  },

  validate: async (id: string) => {
    await delay();
    return { id, statut: 'VALIDEE' };
  },
};

export const bebeService = {
  getById: async (id: string) => {
    await delay();
    return { id, nom: 'Amadou Diallo', dateNaissance: '2024-03-10', poids: 3.8, taille: 52 };
  },

  getConsultations: async (_bebeId: string) => {
    await delay();
    return [];
  },

  addConsultation: async (_bebeId: string, data: any) => {
    await delay();
    return { id: 'c-001', ...data };
  },
};

export const vaccinationService = {
  getCalendar: async (_bebeId: string) => {
    await delay();
    return [];
  },

  addVaccin: async (_bebeId: string, data: any) => {
    await delay();
    return { id: 'v-001', ...data };
  },

  markAsAdministered: async (vaccinId: string) => {
    await delay();
    return { id: vaccinId, statut: 'ADMINISTRE' };
  },
};

export const adminService = {
  getPendingProfessionals: async () => {
    await delay();
    return [];
  },

  approveProfessional: async (id: string) => {
    await delay();
    return { id, statut: 'APPROUVE' };
  },

  rejectProfessional: async (id: string) => {
    await delay();
    return { id, statut: 'REJETE' };
  },

  getStatistics: async () => {
    await delay();
    return { mamans: 142, professionnels: 38, grossessesActives: 97 };
  },
};
