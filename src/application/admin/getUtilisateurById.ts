import type { AdminRepository } from '../../domain/admin/types';
import { localAdminRepository } from '../../infrastructure/admin/localAdminRepository';

export const getUtilisateurById = async (
  id: string,
  repository: AdminRepository = localAdminRepository
) => {
  return repository.getUtilisateurById(id);
};

export default getUtilisateurById;
