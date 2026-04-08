import type { AuthRepository, AuthSession } from '../../domain/auth/types';
import { localAuthRepository } from '../../infrastructure/auth/localAuthRepository';

const makeAuthError = (message: string) => {
  const error = new Error(message) as Error & { response?: { data?: { message: string } } };
  error.response = { data: { message } };
  return error;
};

export const loginUser = async (
  loginId: string,
  password: string,
  repository: AuthRepository = localAuthRepository
): Promise<AuthSession> => {
  const session = await repository.login(loginId, password);

  if (session.user.role === 'professionnel' && !session.user.isValidated) {
    throw makeAuthError('Votre compte est en attente de validation par un administrateur.');
  }

  return session;
};

export default loginUser;
