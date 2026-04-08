import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const addVaccination = async (
  patientId: string,
  data: Record<string, any>,
  repository: ProfessionnelRepository = localProfessionnelRepository
) => {
  return repository.addVaccination(patientId, data);
};

export default addVaccination;
