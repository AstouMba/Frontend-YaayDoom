import { localMamanRepository } from '../../infrastructure/maman/localMamanRepository';
import type { MamanRepository } from '../../domain/maman/types';

export const getCroissanceBebe = async (repository: MamanRepository = localMamanRepository) => {
  return repository.getCroissanceBebe();
};

export default getCroissanceBebe;
