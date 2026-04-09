import type { ProfessionnelRepository } from '../../domain/professionnel/types';
import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';

export const getFamilleBebe = async (
  uuid: string,
  bebeUuid: string,
  repository: ProfessionnelRepository = localProfessionnelRepository
) => {
  return repository.getFamilleBebe(uuid, bebeUuid);
};

export default getFamilleBebe;
