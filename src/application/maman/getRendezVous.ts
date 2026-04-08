import { localMamanRepository } from '../../infrastructure/maman/localMamanRepository';
import type { MamanRepository } from '../../domain/maman/types';

export const getRendezVous = async (repository: MamanRepository = localMamanRepository) => {
  return repository.getRendezVous();
};

export default getRendezVous;
