import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const getGrossesses = async (repository: ProfessionnelRepository = localProfessionnelRepository) => {
  return repository.getGrossesses();
};

export default getGrossesses;
