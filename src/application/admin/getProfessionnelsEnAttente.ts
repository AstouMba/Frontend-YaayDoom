import type { AdminRepository } from '../../domain/admin/types';
import { localAdminRepository } from '../../infrastructure/admin/localAdminRepository';

export const getProfessionnelsEnAttente = async (
  repository: AdminRepository = localAdminRepository
) => {
  return repository.getProfessionnelsEnAttente();
};

export default getProfessionnelsEnAttente;
