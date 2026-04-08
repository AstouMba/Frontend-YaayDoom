import type { AdminRepository, AdminUserQuery } from '../../domain/admin/types';
import { localAdminRepository } from '../../infrastructure/admin/localAdminRepository';

export const getUtilisateurs = async (
  params: AdminUserQuery = {},
  repository: AdminRepository = localAdminRepository
) => {
  return repository.getUtilisateurs(params);
};

export default getUtilisateurs;
