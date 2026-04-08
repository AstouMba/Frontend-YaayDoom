import { localProfessionnelRepository } from '../../infrastructure/professionnel/localProfessionnelRepository';
import type { ProfessionnelRepository } from '../../domain/professionnel/types';

export const scanPatient = async (qrData: string, repository: ProfessionnelRepository = localProfessionnelRepository) => {
  return repository.scanPatient(qrData);
};

export default scanPatient;
