import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const validateGrossesse = async (id: string, repository: ProfessionnelRepository = localProfessionnelRepository) => {
  return repository.validateGrossesse(id);
};

export default validateGrossesse;
