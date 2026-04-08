import type { AdminRepository } from '../../domain/admin/types';
import { localAdminRepository } from '../../infrastructure/admin/localAdminRepository';

export const getAllUsers = async (repository: AdminRepository = localAdminRepository) => {
  return repository.getAllUsers();
};

export default getAllUsers;
