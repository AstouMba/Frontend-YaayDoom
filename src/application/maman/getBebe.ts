import { localMamanRepository } from '../../infrastructure/maman/localMamanRepository';
import type { MamanRepository } from '../../domain/maman/types';

export const getBebe = async (repository: MamanRepository = localMamanRepository) => {
  return repository.getBebe();
};

export default getBebe;
