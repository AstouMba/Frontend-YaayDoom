import type { AdminRepository } from '../../domain/admin/types';
import { localAdminRepository } from '../../infrastructure/admin/localAdminRepository';

export const rejectProfessionnel = async (
  id: string,
  motif: string,
  repository: AdminRepository = localAdminRepository
) => {
  return repository.rejectProfessionnel(id, motif);
};

export default rejectProfessionnel;
