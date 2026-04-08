import { api } from '../../core/api/api';
import { mockUsers } from '../../mocks/db';
import type {
  AuthRepository,
  AuthSession,
  AuthUser,
  RegisterUserInput,
} from '../../domain/auth/types';

const USERS_STORAGE_KEY = 'yaydoom_mock_users';
const storage = typeof globalThis !== 'undefined' ? globalThis.localStorage : undefined;

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

const cloneUsers = (users: Record<string, any>[]) => users.map((user) => ({ ...user }));

const loadUsers = () => {
  if (typeof storage === 'undefined') return cloneUsers(mockUsers as Record<string, any>[]);

  try {
    const raw = storage.getItem(USERS_STORAGE_KEY);
    if (!raw) return cloneUsers(mockUsers as Record<string, any>[]);

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : cloneUsers(mockUsers as Record<string, any>[]);
  } catch {
    return cloneUsers(mockUsers as Record<string, any>[]);
  }
};

const saveUsers = (users: Record<string, any>[]) => {
  if (typeof storage === 'undefined') return;
  storage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const findUserByLogin = (loginId: string) => {
  const normalizedLogin = normalizeLoginValue(loginId);
  const loginPhone = normalizeSenegalPhone(loginId);
  const users = loadUsers();

  const matchesLogin = (user: Record<string, any>) => {
    const email = normalizeLoginValue(user.email);
    const phone = normalizeSenegalPhone(user.phone);

    return email === normalizedLogin || phone === loginPhone;
  };

  return users.filter(matchesLogin);
};

const createToken = (userId: string) => `mock-token-${userId}`;

const buildRegisterPayload = (input: RegisterUserInput) => {
  const payload: Record<string, any> = {
    role: input.role,
    fullName: input.fullName,
    phone: input.phone,
    password: input.password,
    password_confirmation: input.passwordConfirmation || input.password,
  };

  if (input.role === 'maman') {
    if (input.birthDate) {
      payload.birthDate = input.birthDate;
    }
    return payload;
  }

  payload.email = input.email || '';
  payload.specialite = input.specialty || '';
  payload.matricule = input.matricule || '';
  payload.centre_de_sante = input.healthCenter || '';

  return payload;
};

export const localAuthRepository: AuthRepository = {
  async login(loginId, password): Promise<AuthSession> {
    try {
      const { data } = await api.post('/auth/login', { loginId, password });
      const normalizedUser = normalizeUser(data.user || data.data?.user || {});
      const token = data.token || data.access_token || createToken(normalizedUser.id);

      return {
        user: normalizedUser,
        token,
      };
    } catch (error) {
      if (!error?.response) {
        const matchingUsers = findUserByLogin(loginId);
        const user = matchingUsers.find((candidate) => candidate.password === password);

        if (user) {
          const normalizedUser = normalizeUser(user);
          return {
            user: normalizedUser,
            token: createToken(normalizedUser.id),
          };
        }
      }

      throw makeAuthError(extractErrorMessage(error, 'Numéro de téléphone / email ou mot de passe incorrect.'));
    }
  },

  async register(input: RegisterUserInput) {
    const payload = buildRegisterPayload(input);

    try {
      const { data } = await api.post('/auth/register', payload);
      const normalizedUser = normalizeUser(data.user || data.data?.user || {});

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
      if (error?.response) {
        throw makeAuthError(extractErrorMessage(error, 'Impossible de créer le compte.'));
      }

      const users = loadUsers();
      const normalizedEmail = normalizeLoginValue(input.email);
      const rawPhone = String(input.phone || '').trim();
      const normalizedPhone = normalizeSenegalPhone(rawPhone);

      const existingUser = users.find((user) => {
        const email = normalizeLoginValue(user.email);
        const phone = normalizeSenegalPhone(user.phone);
        return (normalizedEmail && email === normalizedEmail) || (normalizedPhone && phone === normalizedPhone);
      });

      if (existingUser) {
        throw makeAuthError('Un compte existe déjà avec cet email ou ce numéro de téléphone.');
      }

      const newUser = {
        id: `u-${Date.now()}`,
        name: input.fullName,
        email: input.email || `${normalizedPhone || Date.now()}@yaaydoom.local`,
        phone: rawPhone || undefined,
        password: input.password,
        role: input.role,
        specialite: input.specialty || undefined,
        matricule: input.matricule || undefined,
        centre_de_sante: input.healthCenter || undefined,
        isValidated: input.role === 'professionnel' ? false : true,
      };

      users.push(newUser);
      saveUsers(users);

      return {
        success: true,
        user: normalizeUser(newUser),
        message:
          input.role === 'professionnel'
            ? 'Compte créé. Votre compte est en attente de validation.'
            : 'Compte créé avec succès.',
      };
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
      if (error?.response) {
        throw makeAuthError(extractErrorMessage(error, 'Impossible d’envoyer les documents.'));
      }

      const users = loadUsers();
      const storedUser = await this.getCurrentUser();

      if (!storedUser) {
        throw makeAuthError('Aucun utilisateur connecté pour recevoir les documents.');
      }

      const index = users.findIndex((user) => String(user.id) === String(storedUser.id));
      if (index === -1) {
        throw makeAuthError('Utilisateur introuvable.');
      }

      const documentUrl = `/storage/mock/${files[0].name}`;
      const uploadedDocument = files.map((file) => ({
        name: file.name,
        type: file.type,
        size: file.size,
        url: `/storage/mock/${file.name}`,
      }));

      users[index] = {
        ...users[index],
        documentUrl,
        documents: uploadedDocument,
      };
      saveUsers(users);

      const updatedUser = normalizeUser(users[index]);
      if (typeof storage !== 'undefined') {
        storage.setItem('yaydoom_user', JSON.stringify(updatedUser));
      }

      return {
        success: true,
        user: updatedUser,
        message: 'Documents uploadés avec succès.',
      };
    }
  },

  async logout() {
    if (typeof storage === 'undefined') return;
    storage.removeItem('yaydoom_token');
    storage.removeItem('yaydoom_user');
  },

  async getCurrentUser() {
    if (typeof storage === 'undefined') return null;

    try {
      const storedUser = storage.getItem('yaydoom_user');
      return storedUser ? normalizeUser(JSON.parse(storedUser)) : null;
    } catch {
      return null;
    }
  },

  async updateProfile(userData) {
    const users = loadUsers();
    const storedUser = await this.getCurrentUser();

    if (!storedUser) {
      throw makeAuthError('Aucun utilisateur connecté.');
    }

    const index = users.findIndex((user) => String(user.id) === String(storedUser.id));
    if (index === -1) {
      throw makeAuthError('Utilisateur introuvable.');
    }

    users[index] = {
      ...users[index],
      ...userData,
    };
    saveUsers(users);

    const updatedUser = normalizeUser(users[index]);
    if (typeof storage !== 'undefined') {
      storage.setItem('yaydoom_user', JSON.stringify(updatedUser));
    }

    return updatedUser;
  },

  async changePassword(currentPassword, newPassword) {
    const users = loadUsers();
    const storedUser = await this.getCurrentUser();

    if (!storedUser) {
      throw makeAuthError('Aucun utilisateur connecté.');
    }

    const index = users.findIndex((user) => String(user.id) === String(storedUser.id));
    if (index === -1) {
      throw makeAuthError('Utilisateur introuvable.');
    }

    if (users[index].password !== currentPassword) {
      throw makeAuthError('Le mot de passe actuel est incorrect.');
    }

    users[index] = {
      ...users[index],
      password: newPassword,
    };
    saveUsers(users);

    return {
      success: true,
      message: 'Mot de passe mis à jour avec succès.',
    };
  },
};

export default localAuthRepository;
