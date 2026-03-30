/**
 * Admin Service - API pour administrateurs
 */
import { api } from '../../../core/api/api';

export const getStatistiques = async () => {
  const { data } = await api.get('/admin/stats');
  return data;
};

export const getUtilisateurs = async (params = {}) => {
  const { data } = await api.get('/admin/users', { params });
  return data;
};

export const getAllUsers = async () => {
  return getUtilisateurs();
};

export const getUtilisateurById = async (id) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

export const updateUtilisateur = async (id, payload) => {
  const { data } = await api.put(`/users/${id}`, payload);
  return data;
};

export const updateUserRole = async (userId, newRole) => {
  const { data } = await api.patch(`/admin/users/${userId}/role`, { role: newRole });
  return data;
};

export const updateUserStatus = async (userId, newStatus) => {
  const { data } = await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
  return data;
};

export const deleteUtilisateur = async (id) => {
  const { data } = await api.delete(`/users/${id}`);
  return data;
};

export const deleteUser = async (userId) => {
  return deleteUtilisateur(userId);
};

export const getProfessionnelsEnAttente = async () => {
  const { data } = await api.get('/admin/professionnels/pending');
  return data;
};

export const approveProfessionnel = async (id) => {
  const { data } = await api.post(`/admin/professionnels/${id}/approve`);
  return data;
};

export const rejectProfessionnel = async (id, motif) => {
  const { data } = await api.post(`/admin/professionnels/${id}/reject`, { motif });
  return data;
};

export default {
  getStatistiques,
  getUtilisateurs,
  getAllUsers,
  getUtilisateurById,
  updateUtilisateur,
  updateUserRole,
  updateUserStatus,
  deleteUtilisateur,
  deleteUser,
  getProfessionnelsEnAttente,
  approveProfessionnel,
  rejectProfessionnel,
};
