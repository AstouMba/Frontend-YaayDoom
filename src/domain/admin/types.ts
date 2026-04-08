export type AdminUserRole = 'maman' | 'professionnel' | 'admin' | 'user';
export type AdminUserStatus = 'actif' | 'inactif';

export interface AdminStats {
  totalMamans: number;
  totalProfessionnels: number;
  grossessesActives: number;
  professionnelsEnAttente: number;
  consultationsTotal: number;
  vaccinationsTotal: number;
  grossessesParMois: number[];
  labelsParMois: string[];
}

export interface AdminUser {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: AdminUserRole;
  specialite?: string;
  dateInscription: string;
  statut: AdminUserStatus;
}

export interface PendingProfessional {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  specialite: string;
  matricule: string;
  centreDesante: string;
  documentUrl?: string;
  documents?: Array<Record<string, any>>;
  decisionStatus?: 'approved' | 'rejected' | null;
  decisionMotif?: string | null;
  decisionDate?: string | null;
  decisionBy?: string | null;
  isValidated?: boolean;
  statut?: AdminUserStatus | string;
  dateInscription: string;
}

export interface AdminUserQuery {
  role?: AdminUserRole | 'tous';
  search?: string;
}

export interface AdminRepository {
  getStatistiques(): Promise<AdminStats>;
  getUtilisateurs(params?: AdminUserQuery): Promise<AdminUser[]>;
  getAllUsers(): Promise<AdminUser[]>;
  getUtilisateurById(id: string): Promise<AdminUser | null>;
  updateUtilisateur(id: string, payload: Record<string, any>): Promise<AdminUser>;
  updateUserRole(userId: string, newRole: AdminUserRole): Promise<AdminUser>;
  updateUserStatus(userId: string, newStatus: AdminUserStatus): Promise<AdminUser>;
  deleteUtilisateur(id: string): Promise<{ success: boolean }>;
  deleteUser(userId: string): Promise<{ success: boolean }>;
  getProfessionnelsEnAttente(): Promise<PendingProfessional[]>;
  approveProfessionnel(
    id: string,
    motif: string
  ): Promise<{ success: boolean; motif: string; professionnel?: PendingProfessional }>;
  rejectProfessionnel(
    id: string,
    motif: string
  ): Promise<{ success: boolean; motif: string; professionnel?: PendingProfessional }>;
}
