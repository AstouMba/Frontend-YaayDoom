export type AuthRole = 'maman' | 'professionnel' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  phone?: string;
  isValidated?: boolean;
  specialite?: string;
  matricule?: string;
  centreDeSante?: string;
  documentUrl?: string | null;
  documents?: Array<Record<string, any>>;
  decisionStatus?: 'approved' | 'rejected' | null;
  decisionMotif?: string | null;
  decisionDate?: string | null;
  decisionBy?: string | null;
  statut?: 'actif' | 'inactif' | string;
  dateInscription?: string;
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}

export interface RegistrationDocument {
  name: string;
  type: string;
  size: number;
}

export interface RegisterUserInput {
  role: Exclude<AuthRole, 'admin'>;
  fullName: string;
  email?: string;
  phone: string;
  birthDate?: string;
  password: string;
  passwordConfirmation?: string;
  specialty?: string;
  matricule?: string;
  healthCenter?: string;
  document?: RegistrationDocument | null;
}

export interface AuthRepository {
  login(loginId: string, password: string): Promise<AuthSession>;
  register(
    input: RegisterUserInput
  ): Promise<{ success: boolean; user: AuthUser; message: string; token?: string }>;
  uploadProfessionalDocuments(
    documents: File[]
  ): Promise<{ success: boolean; user: AuthUser; message: string }>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthUser | null>;
  updateProfile(userData: Partial<AuthUser>): Promise<AuthUser>;
  changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }>;
}
