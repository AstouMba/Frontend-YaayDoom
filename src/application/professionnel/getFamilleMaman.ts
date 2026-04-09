import type { ProfessionnelRepository } from '../../domain/professionnel/types';
import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';

export const getFamilleMaman = async (
  uuid: string,
  repository: ProfessionnelRepository = localProfessionnelRepository
) => {
  return repository.getFamilleMaman(uuid);
};

export default getFamilleMaman;
