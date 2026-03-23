/**
 * Auth Service - Authentication API calls
 */
import { api } from '../../../core/api/api';

// Simulate network delay
const delay = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Login user
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<{user: object, token: string}>}
 */
export const login = async (email, password) => {
  await delay();
  
  // Demo accounts
  const roles = {
    'maman@demo.com': 'maman',
    'pro@demo.com': 'professionnel',
    'admin@demo.com': 'admin',
  };
  
  const role = roles[email];
  if (!role || password !== 'demo1234') {
    throw new Error('Identifiants incorrects');
  }
  
  // Return mock user based on role
  const users = {
    maman: { id: 'u-001', name: 'Aminata Diallo', email: 'maman@demo.com', role: 'maman', phone: '+221 77 123 45 67', isValidated: true },
    professionnel: { id: 'u-002', name: 'Dr. Fatou Sow', email: 'pro@demo.com', role: 'professionnel', phone: '+221 76 234 56 78', isValidated: true, specialite: 'Gynécologue' },
    admin: { id: 'u-003', name: 'Administrateur', email: 'admin@demo.com', role: 'admin', isValidated: true },
  };
  
  return {
    user: users[role],
    token: 'demo-token-' + role,
  };
};

/**
 * Register new user
 * @param {object} userData 
 * @returns {Promise<{success: boolean, user: object}>}
 */
export const register = async (userData) => {
  await delay();
  
  // Simulate successful registration
  return {
    success: true,
    user: {
      id: 'u-' + Date.now(),
      ...userData,
      isValidated: userData.role === 'maman', // Mamans are auto-validated
    },
  };
};

/**
 * Logout user
 * @returns {Promise<void>}
 */
export const logout = async () => {
  await delay(200);
  // Clear local storage is handled by the store
};

/**
 * Get current user
 * @returns {Promise<object>}
 */
export const getCurrentUser = async () => {
  await delay();
  return { name: 'Fatou Diallo', email: 'maman@demo.com', role: 'maman' };
};

/**
 * Update user profile
 * @param {object} userData 
 * @returns {Promise<object>}
 */
export const updateProfile = async (userData) => {
  await delay();
  return { success: true, ...userData };
};

/**
 * Change password
 * @param {string} currentPassword 
 * @param {string} newPassword 
 * @returns {Promise<{success: boolean}>}
 */
export const changePassword = async (currentPassword, newPassword) => {
  await delay();
  
  // Demo validation
  if (currentPassword !== 'demo1234') {
    throw new Error('Mot de passe actuel incorrect');
  }
  
  return { success: true };
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
};
