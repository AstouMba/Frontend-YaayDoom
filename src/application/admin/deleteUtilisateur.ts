import type { AdminRepository } from '../../domain/admin/types';
import { localAdminRepository } from '../../infrastructure/admin/localAdminRepository';

export const deleteUtilisateur = async (
  id: string,
  repository: AdminRepository = localAdminRepository
) => {
  return repository.deleteUtilisateur(id);
};

export default deleteUtilisateur;
