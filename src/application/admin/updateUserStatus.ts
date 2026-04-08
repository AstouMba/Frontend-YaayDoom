import type { AdminRepository, AdminUserStatus } from '../../domain/admin/types';
import { localAdminRepository } from '../../infrastructure/admin/localAdminRepository';

export const updateUserStatus = async (
  userId: string,
  newStatus: AdminUserStatus,
  repository: AdminRepository = localAdminRepository
) => {
  return repository.updateUserStatus(userId, newStatus);
};

export default updateUserStatus;
