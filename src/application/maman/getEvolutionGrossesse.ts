import { localMamanRepository } from '../../infrastructure/maman/localMamanRepository';
import type { MamanRepository } from '../../domain/maman/types';

export const getEvolutionGrossesse = async (repository: MamanRepository = localMamanRepository) => {
  return repository.getEvolutionGrossesse();
};

export default getEvolutionGrossesse;
