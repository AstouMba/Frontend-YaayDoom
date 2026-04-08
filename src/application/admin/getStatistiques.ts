import type { AdminRepository } from '../../domain/admin/types';
import { localAdminRepository } from '../../infrastructure/admin/localAdminRepository';

export const getStatistiques = async (repository: AdminRepository = localAdminRepository) => {
  return repository.getStatistiques();
};

export default getStatistiques;
