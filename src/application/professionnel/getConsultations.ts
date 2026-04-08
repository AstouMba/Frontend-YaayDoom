import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const getConsultations = async (
  mamanId?: string,
  repository: ProfessionnelRepository = localProfessionnelRepository
) => {
  return repository.getConsultations(mamanId);
};

export default getConsultations;
