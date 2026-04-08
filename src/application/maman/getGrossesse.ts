import { localMamanRepository } from '../../infrastructure/maman/localMamanRepository';
import type { MamanRepository } from '../../domain/maman/types';

export const getGrossesse = async (repository: MamanRepository = localMamanRepository) => {
  return repository.getGrossesse();
};

export default getGrossesse;
