import type { AuthRepository, RegisterUserInput } from '../../domain/auth/types';
import { localAuthRepository } from '../../infrastructure/auth/localAuthRepository';

export const registerUser = async (
  input: RegisterUserInput,
  repository: AuthRepository = localAuthRepository
) => {
  return repository.register(input);
};

export default registerUser;
