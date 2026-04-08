import { api } from '../../core/api/api';
import {
  getMockDb,
  isMockSession,
  updateMockDb,
} from '../../core/mock/mockDb';
import { mockStats } from '../../mocks/db';
import type {
  AdminRepository,
  AdminStats,
  AdminUser,
  AdminUserQuery,
  AdminUserRole,
  AdminUserStatus,
  PendingProfessional,
} from '../../domain/admin/types';

const normalizeUser = (user: Record<string, any>): AdminUser => ({
  id: String(user.id),
  nom: user.nom,
  email: user.email,
  telephone: user.telephone,
  role: (user.role || 'user') as AdminUserRole,
  specialite: user.specialite || undefined,
  dateInscription: user.dateInscription,
  statut: (user.statut || 'actif') as AdminUserStatus,
});

const normalizePendingPro = (pro: Record<string, any>): PendingProfessional => ({
  id: String(pro.id),
  nom: pro.nom || pro.name || '',
  email: pro.email || '',
  telephone: pro.telephone || pro.phone || '',
  specialite: pro.specialite || '',
  matricule: pro.matricule || '',
  centreDesante: pro.centreDesante || pro.centreDeSante || pro.centre_de_sante || '',
  documentUrl: pro.documentUrl || pro.document_url || '/documents/mock-dossier.pdf',
  documents: Array.isArray(pro.documents) ? pro.documents : [],
  decisionStatus: pro.decisionStatus ?? pro.decision_status ?? null,
  decisionMotif: pro.decisionMotif ?? pro.decision_motif ?? null,
  decisionDate: pro.decisionDate ?? pro.decision_date ?? null,
  decisionBy: pro.decisionBy ?? pro.decision_by ?? null,
  isValidated: Boolean(pro.isValidated ?? pro.is_validated),
  statut: pro.statut || 'actif',
  dateInscription: pro.dateInscription,
});

const buildStats = (db: Record<string, any>): AdminStats => {
  const users = Array.isArray(db.utilisateurs) ? db.utilisateurs : [];
  const grossesses = Array.isArray(db.grossesses) ? db.grossesses : [];
  const pending = Array.isArray(db.professionnelsEnAttente) ? db.professionnelsEnAttente : [];
  const consultations = Array.isArray(db.consultations) ? db.consultations : [];
  const stats = db.stats || mockStats;

  return {
    totalMamans: users.filter((user: Record<string, any>) => user.role === 'maman').length,
    totalProfessionnels: users.filter((user: Record<string, any>) => user.role === 'professionnel').length,
    grossessesActives: grossesses.filter((g: Record<string, any>) => g.statut === 'VALIDEE' || g.statut === 'EN_ATTENTE').length,
    professionnelsEnAttente: pending.length,
    consultationsTotal: consultations.length,
    vaccinationsTotal: Array.isArray(db.vaccins) ? db.vaccins.length : 0,
    grossessesParMois: stats.grossessesParMois || mockStats.grossessesParMois,
    labelsParMois: stats.labelsParMois || mockStats.labelsParMois,
  };
};

const getMockUsers = async (params: AdminUserQuery = {}) => {
  const db = getMockDb();
  const role = params.role ? String(params.role) : null;
  const q = params.search ? String(params.search).trim().toLowerCase() : '';

  return (db.utilisateurs || [])
    .map(normalizeUser)
    .filter((user: AdminUser) => {
      const matchRole = !role || role === 'tous' || user.role === role;
      const matchSearch =
        !q ||
        user.nom.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.telephone.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
};

const getMockUserById = async (id: string) => {
  const db = getMockDb();
  const user = (db.utilisateurs || []).find((item: Record<string, any>) => String(item.id) === String(id));
  return user ? normalizeUser(user) : null;
};

const updateMockUser = async (id: string, payload: Record<string, any>) => {
  const updated = updateMockDb((db) => {
    db.utilisateurs = (db.utilisateurs || []).map((user: Record<string, any>) =>
      String(user.id) === String(id) ? { ...user, ...payload } : user
    );
    return db;
  });

  return normalizeUser((updated.utilisateurs || []).find((user: Record<string, any>) => String(user.id) === String(id)) || {});
};

const deleteMockUser = async (id: string) => {
  updateMockDb((db) => {
    db.utilisateurs = (db.utilisateurs || []).filter((user: Record<string, any>) => String(user.id) !== String(id));
    return db;
  });

  return { success: true };
};

const getMockProfessionnelsEnAttente = async () => {
  const db = getMockDb();
  return (db.professionnelsEnAttente || []).map(normalizePendingPro);
};

const getMockProfessionnelsPendingFromUsers = async () => {
  const db = getMockDb();
  return (db.utilisateurs || [])
    .filter(
      (user: Record<string, any>) =>
        user.role === 'professionnel' &&
        !Boolean(user.isValidated ?? user.is_validated) &&
        !user.decisionStatus &&
        !user.decision_status
    )
    .map(normalizePendingPro);
};

const approveMockProfessionnel = async (id: string, motif: string) => {
  const pending = await getMockProfessionnelsEnAttente();
  const approved = pending.find((pro) => String(pro.id) === String(id));
  let updatedProfessional: PendingProfessional | null = null;

  updateMockDb((db) => {
    db.professionnelsEnAttente = (db.professionnelsEnAttente || []).filter(
      (pro: Record<string, any>) => String(pro.id) !== String(id)
    );

    if (approved) {
      const existingIndex = (db.utilisateurs || []).findIndex(
        (user: Record<string, any>) => String(user.id) === String(id)
      );
      const normalizedUser = {
        id: approved.id,
        nom: approved.nom,
        email: approved.email,
        telephone: approved.telephone,
        role: 'professionnel',
        specialite: approved.specialite,
        dateInscription: approved.dateInscription,
        statut: 'actif',
      };
      updatedProfessional = {
        ...approved,
        decisionStatus: 'approved',
        decisionMotif: motif,
        decisionDate: new Date().toISOString(),
        decisionBy: 'admin',
        isValidated: true,
        statut: 'actif',
      };

      if (existingIndex >= 0) {
        db.utilisateurs[existingIndex] = { ...db.utilisateurs[existingIndex], ...normalizedUser };
      } else {
        db.utilisateurs.push(normalizedUser);
      }
    }

    return db;
  });

  return { success: true, motif, professionnel: updatedProfessional || undefined };
};

const rejectMockProfessionnel = async (id: string, motif: string) => {
  const pending = await getMockProfessionnelsEnAttente();
  const rejected = pending.find((pro) => String(pro.id) === String(id));
  const updatedProfessional = rejected
    ? {
        ...rejected,
        decisionStatus: 'rejected' as const,
        decisionMotif: motif,
        decisionDate: new Date().toISOString(),
        decisionBy: 'admin',
        isValidated: false,
        statut: 'inactif',
      }
    : null;

  updateMockDb((db) => {
    db.professionnelsEnAttente = (db.professionnelsEnAttente || []).filter(
      (pro: Record<string, any>) => String(pro.id) !== String(id)
    );
    return db;
  });

  return { success: true, motif, professionnel: updatedProfessional || undefined };
};

export const localAdminRepository: AdminRepository = {
  async getStatistiques() {
    if (!isMockSession()) {
      const { data } = await api.get('/admin/stats');
      return data;
    }

    return buildStats(getMockDb());
  },

  async getUtilisateurs(params: AdminUserQuery = {}) {
    if (!isMockSession()) {
      const { data } = await api.get('/admin/users', { params });
      return data;
    }

    return getMockUsers(params);
  },

  async getAllUsers() {
    return getMockUsers();
  },

  async getUtilisateurById(id: string) {
    if (!isMockSession()) {
      const { data } = await api.get(`/users/${id}`);
      return data;
    }

    return getMockUserById(id);
  },

  async updateUtilisateur(id: string, payload: Record<string, any>) {
    if (!isMockSession()) {
      const { data } = await api.put(`/users/${id}`, payload);
      return data;
    }

    return updateMockUser(id, payload);
  },

  async updateUserRole(userId: string, newRole: AdminUserRole) {
    if (!isMockSession()) {
      const { data } = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      return data;
    }

    return updateMockUser(userId, { role: newRole });
  },

  async updateUserStatus(userId: string, newStatus: AdminUserStatus) {
    if (!isMockSession()) {
      const { data } = await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      return data;
    }

    return updateMockUser(userId, { statut: newStatus });
  },

  async deleteUtilisateur(id: string) {
    if (!isMockSession()) {
      const { data } = await api.delete(`/users/${id}`);
      return data;
    }

    return deleteMockUser(id);
  },

  async deleteUser(userId: string) {
    return deleteMockUser(userId);
  },

  async getProfessionnelsEnAttente() {
    if (!isMockSession()) {
      const { data } = await api.get('/admin/professionnels/pending');
      const pending = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

      if (pending.length > 0) {
        return pending.map(normalizePendingPro);
      }

      const { data: usersData } = await api.get('/admin/users', {
        params: { role: 'professionnel' },
      });
      const users = Array.isArray(usersData) ? usersData : Array.isArray(usersData?.data) ? usersData.data : [];

      return users
        .filter(
          (user: Record<string, any>) =>
            !Boolean(user.isValidated ?? user.is_validated) &&
            !user.decisionStatus &&
            !user.decision_status
        )
        .map(normalizePendingPro);
    }

    const pending = await getMockProfessionnelsEnAttente();
    return pending.length > 0 ? pending : getMockProfessionnelsPendingFromUsers();
  },

  async approveProfessionnel(id: string, motif: string) {
    if (!isMockSession()) {
      const { data } = await api.post(`/admin/professionnels/${id}/approve`, { motif });
      return data;
    }

    return approveMockProfessionnel(id, motif);
  },

  async rejectProfessionnel(id: string, motif: string) {
    if (!isMockSession()) {
      const { data } = await api.post(`/admin/professionnels/${id}/reject`, { motif });
      return data;
    }

    return rejectMockProfessionnel(id, motif);
  },
};

export default localAdminRepository;
