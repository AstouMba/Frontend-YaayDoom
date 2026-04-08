import type { AuthRepository } from '../../domain/auth/types';
import { localAuthRepository } from '../../infrastructure/auth/localAuthRepository';

export const changePassword = async (
  currentPassword: string,
  newPassword: string,
  repository: AuthRepository = localAuthRepository
) => {
  return repository.changePassword(currentPassword, newPassword);
};

export default changePassword;
