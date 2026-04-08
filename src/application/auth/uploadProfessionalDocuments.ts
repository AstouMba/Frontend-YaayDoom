import type { AuthRepository } from '../../domain/auth/types';
import { localAuthRepository } from '../../infrastructure/auth/localAuthRepository';

export const uploadProfessionalDocuments = async (
  documents: File[],
  repository: AuthRepository = localAuthRepository
) => {
  return repository.uploadProfessionalDocuments(documents);
};

export default uploadProfessionalDocuments;
