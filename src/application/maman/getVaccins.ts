import { localMamanRepository } from '../../infrastructure/maman/localMamanRepository';
import type { MamanRepository } from '../../domain/maman/types';

export const getVaccins = async (repository: MamanRepository = localMamanRepository) => {
  return repository.getVaccins();
};

export default getVaccins;
