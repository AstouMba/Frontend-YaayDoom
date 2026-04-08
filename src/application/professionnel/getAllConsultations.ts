import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const getAllConsultations = async (repository: ProfessionnelRepository = localProfessionnelRepository) => {
  return repository.getAllConsultations();
};

export default getAllConsultations;
