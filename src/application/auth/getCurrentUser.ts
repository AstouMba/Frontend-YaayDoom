import type { AuthRepository } from '../../domain/auth/types';
import { localAuthRepository } from '../../infrastructure/auth/localAuthRepository';

export const getCurrentUser = async (repository: AuthRepository = localAuthRepository) => {
  return repository.getCurrentUser();
};

export default getCurrentUser;
