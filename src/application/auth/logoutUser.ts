import type { AuthRepository } from '../../domain/auth/types';
import { localAuthRepository } from '../../infrastructure/auth/localAuthRepository';

export const logoutUser = async (repository: AuthRepository = localAuthRepository) => {
  return repository.logout();
};

export default logoutUser;
