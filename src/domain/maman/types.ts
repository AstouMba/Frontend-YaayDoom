export type GrossesseStatut = 'EN_ATTENTE' | 'VALIDEE' | 'TERMINEE' | 'ANNULEE';

export interface Grossesse {
  id: string;
  mamanId: string;
  mamanNom: string;
  dateDernieresRegles: string;
  dateAccouchePrevue: string | null;
  semaineGrossesse: number;
  nombreGrossessesPrecedentes: number;
  antecedentsMedicaux: string;
  statut: GrossesseStatut;
  professionnelValidateur: string;
  dateValidation: string | null;
  trimestre: number;
}

export interface Bebe {
  id: string;
  grossesseId: string | null;
  mamanId: string;
  nom: string;
  dateNaissance: string;
  sexe: string;
  poidsNaissance: number;
  tailleNaissance: number;
  groupeSanguin: string;
  ageActuel: string;
  poidsActuel: number;
  tailleActuelle: number;
  mamanNom?: string;
}

export interface Vaccin {
  id: string;
  bebeId: string;
  nom: string;
  age: string;
  datePrevu: string;
  dateAdministre: string | null;
  statut: 'completed' | 'upcoming';
  professionnel: string | null;
  notes: string;
  bebeNom: string;
}

export interface RendezVous {
  id: string;
  type: string;
  date: string;
  heure: string;
  professionnel: string;
  lieu: string;
  statut: string;
  notes: string;
}

export interface EvolutionGrossesseEtape {
  semaine: number;
  titre: string;
  description: string;
  current?: boolean;
}

export interface CreateGrossesseInput {
  dateDernieresRegles: string;
  dateAccouchePrevue?: string | null;
  antecedentsMedicaux?: string;
  notes?: string;
}

export interface UpdateGrossesseInput {
  [key: string]: any;
}

export interface MamanRepository {
  getGrossesse(): Promise<Grossesse | null>;
  createGrossesse(data: CreateGrossesseInput): Promise<any>;
  updateGrossesse(id: string, data: UpdateGrossesseInput): Promise<any>;
  getBebe(): Promise<Bebe | null>;
  getCroissanceBebe(): Promise<Array<{ mois: number; label: string; poids: number; taille: number }>>;
  getVaccins(): Promise<Vaccin[]>;
  getProchainVaccin(): Promise<Vaccin | null>;
  getRendezVous(): Promise<RendezVous[]>;
  getEvolutionGrossesse(): Promise<EvolutionGrossesseEtape[]>;
}
