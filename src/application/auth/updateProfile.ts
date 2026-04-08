import type { AuthRepository } from '../../domain/auth/types';
import { localAuthRepository } from '../../infrastructure/auth/localAuthRepository';

export const updateProfile = async (
  userData: Record<string, any>,
  repository: AuthRepository = localAuthRepository
) => {
  return repository.updateProfile(userData);
};

export default updateProfile;
