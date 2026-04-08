import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const getVaccinations = async (repository: ProfessionnelRepository = localProfessionnelRepository) => {
  return repository.getVaccinations();
};

export default getVaccinations;
