import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const getPatients = async (repository: ProfessionnelRepository = localProfessionnelRepository) => {
  return repository.getPatients();
};

export default getPatients;
