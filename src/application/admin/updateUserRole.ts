import type { AdminRepository, AdminUserRole } from '../../domain/admin/types';
import { localAdminRepository } from '../../infrastructure/admin/localAdminRepository';

export const updateUserRole = async (
  userId: string,
  newRole: AdminUserRole,
  repository: AdminRepository = localAdminRepository
) => {
  return repository.updateUserRole(userId, newRole);
};

export default updateUserRole;
