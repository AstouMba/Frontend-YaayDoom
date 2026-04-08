import type { AdminRepository } from '../../domain/admin/types';
import { localAdminRepository } from '../../infrastructure/admin/localAdminRepository';

export const updateUtilisateur = async (
  id: string,
  payload: Record<string, any>,
  repository: AdminRepository = localAdminRepository
) => {
  return repository.updateUtilisateur(id, payload);
};

export default updateUtilisateur;
