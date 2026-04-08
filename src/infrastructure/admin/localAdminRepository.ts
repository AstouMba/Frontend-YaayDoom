import { api } from '../../core/api/api';
import type {
  AdminRepository,
  AdminUser,
  AdminUserQuery,
  AdminUserRole,
  AdminUserStatus,
  PendingProfessional,
} from '../../domain/admin/types';

const normalizePendingPro = (pro: Record<string, any>): PendingProfessional => ({
  id: String(pro.id),
  nom: pro.nom || pro.name || '',
  email: pro.email || '',
  telephone: pro.telephone || pro.phone || '',
  specialite: pro.specialite || '',
  matricule: pro.matricule || '',
  centreDesante: pro.centreDesante || pro.centreDeSante || pro.centre_de_sante || '',
  documentUrl: pro.documentUrl || pro.document_url || '/documents/dossier.pdf',
  documents: Array.isArray(pro.documents) ? pro.documents : [],
  decisionStatus: pro.decisionStatus ?? pro.decision_status ?? null,
  decisionMotif: pro.decisionMotif ?? pro.decision_motif ?? null,
  decisionDate: pro.decisionDate ?? pro.decision_date ?? null,
  decisionBy: pro.decisionBy ?? pro.decision_by ?? null,
  isValidated: Boolean(pro.isValidated ?? pro.is_validated),
  statut: pro.statut || 'actif',
  dateInscription: pro.dateInscription,
});

export const localAdminRepository: AdminRepository = {
  async getStatistiques() {
    const { data } = await api.get('/admin/stats');
    return data;
  },

  async getUtilisateurs(params: AdminUserQuery = {}) {
    const { data } = await api.get('/admin/users', { params });
    return data;
  },

  async getAllUsers() {
    const { data } = await api.get('/admin/users');
    return data;
  },

  async getUtilisateurById(id: string) {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  async updateUtilisateur(id: string, payload: Record<string, any>) {
    const { data } = await api.put(`/users/${id}`, payload);
    return data;
  },

  async updateUserRole(userId: string, newRole: AdminUserRole) {
    const { data } = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
    return data;
  },

  async updateUserStatus(userId: string, newStatus: AdminUserStatus) {
    const { data } = await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
    return data;
  },

  async deleteUtilisateur(id: string) {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },

  async deleteUser(userId: string) {
    const { data } = await api.delete(`/users/${userId}`);
    return data;
  },

  async getProfessionnelsEnAttente() {
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
  },

  async approveProfessionnel(id: string, motif: string) {
    const { data } = await api.post(`/admin/professionnels/${id}/approve`, { motif });
    return data;
  },

  async rejectProfessionnel(id: string, motif: string) {
    const { data } = await api.post(`/admin/professionnels/${id}/reject`, { motif });
    return data;
  },
};

export default localAdminRepository;
