export type ProfessionnelStatutGrossesse = 'EN_ATTENTE' | 'VALIDEE' | 'TERMINEE' | 'ANNULEE';
export type VaccinationStatut = 'ADMINISTRE' | 'A_VENIR' | 'EN_RETARD';

export interface Patient {
  id: string;
  bebeId: string;
  mamanId: string;
  nom: string;
  dateDenaissance: string | null;
  sexe: string;
  nomMaman: string;
  telephone: string;
}

export interface FamilyMember {
  id: string;
  type: 'maman' | 'bebe';
  nom: string;
  lien?: string;
  age?: number | string;
  estActif?: boolean;
  raw?: Record<string, any>;
}

export interface FamilyDossier {
  id: string;
  maman?: Record<string, any> | null;
  bebes: Record<string, any>[];
  grossesses: Record<string, any>[];
  consultations: Record<string, any>[];
  vaccinations: Record<string, any>[];
  membres?: FamilyMember[];
  estGemellaire?: boolean;
  raw?: Record<string, any>;
}

export interface GrossesseProfessionnelle {
  id: string;
  rawId?: string;
  mamanNom: string;
  mamanId: string;
  semaineGrossesse: number;
  statut: ProfessionnelStatutGrossesse;
  dateDernieresRegles: string;
  datePresumeAccouchement?: string;
  numeroTelephone: string;
  email?: string;
  notes?: string;
  dateDeclaration?: string | null;
}

export interface Consultation {
  id: string;
  patientName: string;
  patientId: string;
  type: string;
  date: string;
  tensionArterielle: string;
  poids: string;
  notes: string;
  semaineGrossesse: number;
  mamanId: string;
  professionnelId: string;
  heure: string;
}

export interface Vaccination {
  id: string;
  patientName: string;
  patientId: string;
  bebeNom: string;
  bebeId: string;
  bebeAge: string;
  vaccin: string;
  dateAdministration: string;
  statut: VaccinationStatut;
  prochainRappel?: string;
  notes: string;
  raw?: any;
}

export interface PatientScanResult extends Patient {
  grossesse?: GrossesseProfessionnelle;
  familleId?: string;
  familleUuid?: string;
  famille?: FamilyDossier;
}

export interface ProfessionnelRepository {
  getPatients(): Promise<Patient[]>;
  getPatientById(id: string): Promise<Patient | null>;
  getPatientByQRCode(code: string): Promise<PatientScanResult>;
  getFamille(uuid: string): Promise<FamilyDossier>;
  getFamilleMaman(uuid: string): Promise<Record<string, any>>;
  getFamilleBebe(uuid: string, bebeUuid: string): Promise<Record<string, any>>;
  getGrossesses(): Promise<GrossesseProfessionnelle[]>;
  getGrossesseById(id: string): Promise<any>;
  validateGrossesse(id: string): Promise<any>;
  rejectGrossesse(id: string): Promise<any>;
  getGrossessesEnAttente(): Promise<GrossesseProfessionnelle[]>;
  getConsultations(mamanId?: string): Promise<Consultation[]>;
  getAllConsultations(): Promise<Consultation[]>;
  getConsultationById(id: string): Promise<any>;
  createConsultation(patientId: string, payload: Record<string, any>): Promise<any>;
  updateConsultation(id: string, data: Record<string, any>): Promise<any>;
  getVaccinations(): Promise<Vaccination[]>;
  getVaccinationsByPatient(patientId: string): Promise<Vaccination[]>;
  addVaccination(patientId: string, data: Record<string, any>): Promise<any>;
  administrerVaccin(id: string): Promise<any>;
  registerAccouchement(mamanId: string, payload: Record<string, any>): Promise<any>;
  scanPatient(qrData: string): Promise<PatientScanResult>;
}
