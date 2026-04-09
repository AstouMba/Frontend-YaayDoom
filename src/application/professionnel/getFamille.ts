import type { FamilyDossier, ProfessionnelRepository } from '../../domain/professionnel/types';
import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';

export const getFamille = async (
  uuid: string,
  repository: ProfessionnelRepository = localProfessionnelRepository
): Promise<FamilyDossier> => {
  return repository.getFamille(uuid);
};

export default getFamille;
