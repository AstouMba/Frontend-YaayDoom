import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const getVaccinationsByPatient = async (
  patientId: string,
  repository: ProfessionnelRepository = localProfessionnelRepository
) => {
  return repository.getVaccinationsByPatient(patientId);
};

export default getVaccinationsByPatient;
