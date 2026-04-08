import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const createConsultation = async (
  patientId: string,
  payload: Record<string, any>,
  repository: ProfessionnelRepository = localProfessionnelRepository
) => {
  return repository.createConsultation(patientId, payload);
};

export default createConsultation;
