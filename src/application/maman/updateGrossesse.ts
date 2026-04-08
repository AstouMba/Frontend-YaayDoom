import { localMamanRepository } from '../../infrastructure/maman/localMamanRepository';
import type { MamanRepository, UpdateGrossesseInput } from '../../domain/maman/types';

export const updateGrossesse = async (
  id: string,
  data: UpdateGrossesseInput,
  repository: MamanRepository = localMamanRepository
) => {
  return repository.updateGrossesse(id, data);
};

export default updateGrossesse;
