import { localMamanRepository } from '../../infrastructure/maman/localMamanRepository';
import type { MamanRepository } from '../../domain/maman/types';

export const getProchainVaccin = async (repository: MamanRepository = localMamanRepository) => {
  return repository.getProchainVaccin();
};

export default getProchainVaccin;
