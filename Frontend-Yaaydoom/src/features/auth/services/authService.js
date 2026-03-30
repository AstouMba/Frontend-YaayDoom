/**
 * Auth Service - Authentication API calls
 */
import { api } from '../../../core/api/api';

const normalizeUser = (user) => ({
  id: String(user.id),
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone || undefined,
  isValidated: Boolean(user.is_validated),
  specialite: user.specialite || undefined,
});

/**
 * Login user - supports both phone and email
 * @param {string} loginId - phone number or email
 * @param {string} password
 * @returns {Promise<{user: object, token: string}>}
 */
export const login = async (loginId, password) => {
  const payload = {
    login: loginId,
    email: loginId.includes('@') ? loginId : undefined,
    password,
  };

  const response = await api.post('/auth/login', payload);

  return {
    user: normalizeUser(response.data.user),
    token: response.data.token,
  };
};

/**
 * Register new user
 * @param {object} userData
 * @returns {Promise<{success: boolean, user: object, message?: string}>}
 */
export const register = async (userData) => {
  const sanitizedPhone = (userData.phone || '').replace(/\s+/g, '');

  const payload = {
    name: userData.fullName,
    phone: sanitizedPhone || null,
    email: userData.email || `${sanitizedPhone || Date.now()}@yaaydoom.local`,
    password: userData.password,
    role: userData.role,
    specialite: userData.specialty || null,
    matricule: userData.matricule || null,
    centre_de_sante: userData.healthCenter || null,
  };

  const response = await api.post('/auth/register', payload);

  return {
    success: true,
    user: normalizeUser(response.data.user),
    message: response.data.message,
  };
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await api.post('/auth/logout');
};

/**
 * Get current user
 * @returns {Promise<object>}
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return normalizeUser(response.data);
};

/**
 * Update user profile
 * @param {object} userData
 * @returns {Promise<object>}
 */
export const updateProfile = async (userData) => {
  const response = await api.patch('/auth/me', userData);
  return response.data;
};

/**
 * Change password
 * @param {string} currentPassword
 * @param {string} newPassword
 * @returns {Promise<{success: boolean}>}
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await api.post('/auth/change-password', { currentPassword, newPassword });
  return response.data;
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
};
