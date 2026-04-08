import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const rejectGrossesse = async (id: string, repository: ProfessionnelRepository = localProfessionnelRepository) => {
  return repository.rejectGrossesse(id);
};

export default rejectGrossesse;
