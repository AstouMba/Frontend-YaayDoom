import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const registerAccouchement = async (
  mamanId: string,
  payload: Record<string, any>,
  repository: ProfessionnelRepository = localProfessionnelRepository
) => {
  return repository.registerAccouchement(mamanId, payload);
};

export default registerAccouchement;
