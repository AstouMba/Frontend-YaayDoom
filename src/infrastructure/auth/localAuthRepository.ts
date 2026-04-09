import { api } from '../../core/api/api';
import { clearStoredSession, getStoredSessionUser } from '../../core/session';
import type {
  AuthRepository,
  AuthSession,
  AuthUser,
  RegisterUserInput,
} from '../../domain/auth/types';

const makeAuthError = (message: string) => {
  const error = new Error(message) as Error & { response?: { data?: { message: string } } };
  error.response = { data: { message } };
  return error;
};

const extractErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const normalizeLoginValue = (value: string | undefined | null) =>
  String(value || '').trim().toLowerCase();

const normalizePhoneDigits = (value: string | undefined | null) =>
  normalizeLoginValue(value).replace(/\D/g, '');

const normalizeSenegalPhone = (value: string | undefined | null) => {
  const digits = normalizePhoneDigits(value);

  if (digits.startsWith('221') && digits.length > 9) {
    return digits.slice(-9);
  }

  return digits;
};

const buildLoginPayload = (loginId: string, password: string) => {
  const trimmedLoginId = String(loginId || '').trim();
  const normalizedPhone = normalizeSenegalPhone(trimmedLoginId);

  return {
    loginId: trimmedLoginId,
    identifier: trimmedLoginId,
    email: trimmedLoginId.includes('@') ? trimmedLoginId.toLowerCase() : trimmedLoginId,
    phone: normalizedPhone || trimmedLoginId,
    password,
  };
};

const normalizeUser = (user: Record<string, any>): AuthUser => ({
  id: String(user.id),
  name: user.name || user.nom || '',
  email: user.email || '',
  role: user.role,
  phone: user.phone || user.telephone || undefined,
  isValidated: Boolean(user.isValidated ?? user.is_validated),
  specialite: user.specialite || undefined,
  matricule: user.matricule || undefined,
  centreDeSante: user.centreDeSante || user.centre_de_sante || user.centreDesante || undefined,
  documentUrl: user.documentUrl || user.document_url || null,
  documents: Array.isArray(user.documents) ? user.documents : [],
  decisionStatus: user.decisionStatus ?? user.decision_status ?? null,
  decisionMotif: user.decisionMotif ?? user.decision_motif ?? null,
  decisionDate: user.decisionDate ?? user.decision_date ?? null,
  decisionBy: user.decisionBy ?? user.decision_by ?? null,
  statut: user.statut || user.status || undefined,
  dateInscription: user.dateInscription || user.created_at || undefined,
});

const buildRegisterPayload = (input: RegisterUserInput) => {
  const fullName = String(input.fullName || '').trim();
  const phone = String(input.phone || '').trim();
  const email = String(input.email || '').trim().toLowerCase();
  const specialty = String(input.specialty || '').trim();
  const matricule = String(input.matricule || '').trim();
  const healthCenter = String(input.healthCenter || '').trim();

  const payload: Record<string, any> = {
    role: input.role,
    fullName,
    phone,
    password: input.password,
    password_confirmation: input.passwordConfirmation || input.password,
  };

  if (input.role === 'maman') {
    if (input.birthDate) {
      payload.birthDate = input.birthDate;
    }
    return payload;
  }

  payload.email = email;
  payload.specialite = specialty;
  payload.matricule = matricule;
  payload.centre_de_sante = healthCenter;

  return payload;
};

export const localAuthRepository: AuthRepository = {
  async login(loginId, password): Promise<AuthSession> {
    try {
      const payload = buildLoginPayload(loginId, password);
      const { data } = await api.post('/auth/login', payload);
      const normalizedUser = normalizeUser(data.user || data.data?.user || data.data || {});
      const token =
        data.token ||
        data.access_token ||
        (data.token_type && data.access_token ? `${data.token_type} ${data.access_token}`.trim() : undefined);

      return {
        user: normalizedUser,
        token: token || '',
      };
    } catch (error) {
      throw makeAuthError(extractErrorMessage(error, 'Numéro de téléphone / email ou mot de passe incorrect.'));
    }
  },

  async register(input: RegisterUserInput) {
    const payload = buildRegisterPayload(input);

    try {
      const { data } = await api.post('/auth/register', payload);
      const normalizedUser = normalizeUser(data.user || data.data?.user || data.data || {});

      return {
        success: Boolean(data.success ?? true),
        user: normalizedUser,
        token: data.token || data.access_token || undefined,
        message:
          data.message ||
          (input.role === 'professionnel'
            ? 'Compte créé. Votre compte est en attente de validation.'
            : 'Compte créé avec succès.'),
      };
    } catch (error) {
      throw makeAuthError(extractErrorMessage(error, 'Impossible de créer le compte.'));
    }
  },

  async uploadProfessionalDocuments(documents: File[]) {
    const files = Array.isArray(documents) ? documents.filter(Boolean) : [];

    if (files.length === 0) {
      throw makeAuthError('Veuillez sélectionner au moins un document.');
    }

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('documents[]', file);
      });

      const { data } = await api.post('/auth/professional/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: Boolean(data.success ?? true),
        user: normalizeUser(data.user || data.data?.user || {}),
        message: data.message || 'Documents uploadés avec succès.',
      };
    } catch (error) {
      throw makeAuthError(extractErrorMessage(error, 'Impossible d’envoyer les documents.'));
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // Le backend peut répondre 204/401 selon l'implémentation. On nettoie quand même.
    }

    clearStoredSession();
  },

  async getCurrentUser() {
    try {
      const storedUser = getStoredSessionUser();
      if (storedUser) {
        return normalizeUser(storedUser);
      }

      const { data } = await api.get('/auth/me');
      const payload = data.user || data.data?.user || data.data || data;
      return payload ? normalizeUser(payload) : null;
    } catch {
      return null;
    }
  },

  async updateProfile(userData) {
    const { data } = await api.put('/auth/profile', userData);
    const payload = data.user || data.data?.user || data.data || data;
    return normalizeUser(payload);
  },

  async changePassword(currentPassword, newPassword) {
    const { data } = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });

    return {
      success: Boolean(data.success ?? true),
      message: data.message || 'Mot de passe mis à jour avec succès.',
    };
  },
};

export default localAuthRepository;
