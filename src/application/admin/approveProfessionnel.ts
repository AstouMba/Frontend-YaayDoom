import type { AdminRepository } from '../../domain/admin/types';
import { localAdminRepository } from '../../infrastructure/admin/localAdminRepository';

export const approveProfessionnel = async (
  id: string,
  motif: string,
  repository: AdminRepository = localAdminRepository
) => {
  return repository.approveProfessionnel(id, motif);
};

export default approveProfessionnel;
