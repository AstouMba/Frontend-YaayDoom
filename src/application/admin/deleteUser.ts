import type { AdminRepository } from '../../domain/admin/types';
import { localAdminRepository } from '../../infrastructure/admin/localAdminRepository';

export const deleteUser = async (
  userId: string,
  repository: AdminRepository = localAdminRepository
) => {
  return repository.deleteUser(userId);
};

export default deleteUser;
