import { localMamanRepository } from '../../infrastructure/maman/localMamanRepository';
import type { CreateGrossesseInput, MamanRepository } from '../../domain/maman/types';

export const createGrossesse = async (
  data: CreateGrossesseInput,
  repository: MamanRepository = localMamanRepository
) => {
  return repository.createGrossesse(data);
};

export default createGrossesse;
