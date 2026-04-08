import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const administrerVaccin = async (id: string, repository: ProfessionnelRepository = localProfessionnelRepository) => {
  return repository.administrerVaccin(id);
};

export default administrerVaccin;
