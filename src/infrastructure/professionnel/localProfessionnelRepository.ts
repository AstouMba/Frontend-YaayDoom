import { api } from '../../core/api/api';
import { weekFromDate } from '../../core/date';
import { getStoredSessionUser } from '../../core/session';
import type {
  FamilyDossier,
  Consultation,
  GrossesseProfessionnelle,
  Patient,
  PatientScanResult,
  ProfessionnelRepository,
  Vaccination,
} from '../../domain/professionnel/types';

const normalizeGrossesseStatut = (status: string | undefined | null): GrossesseProfessionnelle['statut'] => {
  if (status === 'VALIDEE' || status === 'en_cours') return 'VALIDEE';
  if (status === 'TERMINEE' || status === 'terminee') return 'TERMINEE';
  if (status === 'ANNULEE' || status === 'annulee') return 'ANNULEE';
  return 'EN_ATTENTE';
};

const pickGrossesseDate = (grossesse: Record<string, any>) =>
  grossesse.date_debut ||
  grossesse.dateDernieresRegles ||
  grossesse.date_derniere_regle ||
  grossesse.dateDerniereRegle ||
  grossesse.derniere_regle ||
  grossesse.last_menstrual_period ||
  grossesse.lmp ||
  '';

const normalizeVaccinationStatut = (vaccin: Record<string, any>): Vaccination['statut'] => {
  if (vaccin.dateAdministre || vaccin.date_vaccination) return 'ADMINISTRE';
  if (vaccin.prochaine_dose || vaccin.prochainRappel) return 'A_VENIR';
  return 'A_VENIR';
};

const pickConsultationDate = (consultation: Record<string, any>) =>
  consultation.date ||
  consultation.date_consultation ||
  consultation.dateConsultation ||
  consultation.created_at ||
  '';

const pickConsultationNotes = (consultation: Record<string, any>) =>
  consultation.notes ||
  consultation.commentaire ||
  consultation.observations ||
  consultation.diagnostic ||
  '';

const pickVaccinationDate = (vaccination: Record<string, any>) =>
  vaccination.dateAdministre ||
  vaccination.date_vaccination ||
  vaccination.date_administration ||
  vaccination.dateAdministration ||
  '';

const mapPatient = (bebe: Record<string, any>): Patient => ({
  id: `p-${String(bebe.id)}`,
  bebeId: String(bebe.id),
  mamanId: String(bebe.maman_id),
  nom: bebe.nom,
  dateDenaissance: bebe.date_naissance || null,
  sexe: bebe.sexe === 'M' ? 'Garcon' : bebe.sexe === 'F' ? 'Fille' : bebe.sexe || '-',
  nomMaman: bebe.maman_nom || `Maman #${bebe.maman_id}`,
  telephone: bebe.telephone || '-',
});

const mapGrossesse = (grossesse: Record<string, any>): GrossesseProfessionnelle => ({
  id: `g-${String(grossesse.id)}`,
  rawId: String(grossesse.id),
  mamanNom: grossesse.maman_nom || grossesse.mamanNom || `Maman #${grossesse.maman_id}`,
  mamanId: String(grossesse.maman_id),
  semaineGrossesse: grossesse.semaineGrossesse ?? grossesse.semaine_grossesse ?? weekFromDate(pickGrossesseDate(grossesse)),
  statut: normalizeGrossesseStatut(grossesse.statut),
  dateDernieresRegles: pickGrossesseDate(grossesse),
  datePresumeAccouchement:
    grossesse.date_fin_prevue ||
    grossesse.date_accouchement_prevue ||
    grossesse.dateAccouchementPrevue ||
    grossesse.date_presume_accouchement ||
    null,
  numeroTelephone: grossesse.telephone || grossesse.numero_telephone || grossesse.phone || '-',
  email: grossesse.email || grossesse.mail || '-',
  notes: grossesse.notes || grossesse.antecedentsMedicaux || grossesse.commentaire || '',
  dateDeclaration: grossesse.created_at || grossesse.updated_at || grossesse.date_declaration || grossesse.dateDeclaration || null,
});

const mapConsultation = (consultation: Record<string, any>): Consultation => ({
  id: String(consultation.id),
  patientName:
    consultation.patient_name ||
    consultation.patientName ||
    consultation.maman_nom ||
    consultation.mamanNom ||
    consultation.nom ||
    `Maman #${consultation.maman_id || consultation.patient_id || ''}`,
  patientId: `MAM-${consultation.maman_id || consultation.patient_id || ''}`,
  type: consultation.type || consultation.motif || consultation.categorie || 'Consultation',
  date: pickConsultationDate(consultation),
  tensionArterielle: consultation.tension_arterielle || consultation.tension || consultation.bp || '-',
  poids: consultation.poids || consultation.weight || '-',
  notes: pickConsultationNotes(consultation),
  semaineGrossesse: consultation.semaineGrossesse || consultation.semaine_grossesse || consultation.week || 0,
  mamanId: String(consultation.maman_id || consultation.patient_id || ''),
  professionnelId: String(consultation.professionnel_id || consultation.professional_id || ''),
  heure: consultation.heure || consultation.time || '09:00:00',
});

const mapVaccination = (vaccination: Record<string, any>, bebe?: Record<string, any>): Vaccination => ({
  id: String(vaccination.id),
  patientName:
    bebe?.maman_nom ||
    vaccination.patient_name ||
    vaccination.patientName ||
    vaccination.maman_nom ||
    `Maman #${bebe?.maman_id || vaccination.maman_id || ''}`,
  patientId: bebe ? `MAM-${bebe.maman_id}` : `MAM-${vaccination.maman_id || vaccination.patient_id || ''}`,
  bebeNom: bebe?.nom || bebe?.name || vaccination.bebe_nom || vaccination.bebeName || `Bebe #${vaccination.bebe_id}`,
  bebeId: String(vaccination.bebe_id || bebe?.id || ''),
  bebeAge: bebe?.age_actuel || bebe?.age || vaccination.bebe_age || '-',
  vaccin: vaccination.nom_vaccin || vaccination.nom || vaccination.vaccin || 'Vaccin',
  dateAdministration: pickVaccinationDate(vaccination) || vaccination.prochaine_dose || vaccination.prochainRappel || '',
  statut: normalizeVaccinationStatut(vaccination),
  prochainRappel: vaccination.prochaine_dose || vaccination.prochainRappel || vaccination.date_prochaine_dose || undefined,
  notes: vaccination.notes || vaccination.commentaire || vaccination.observations || '',
  raw: vaccination,
});

const resolvePatientId = (patientId: string) => String(patientId).replace('p-', '').replace('m-', '');
const resolveFamilyId = (value: unknown) => String(value || '').replace(/^famille-/, '').trim();

const makeUnsupportedError = (message: string) => {
  const error = new Error(message) as Error & { response?: { data?: { message: string } } };
  error.response = { data: { message } };
  return error;
};

const normalizeFamily = (data: Record<string, any>, fallbackId: string): FamilyDossier => {
  const raw = data?.data || data?.family || data;
  const familyId = resolveFamilyId(raw?.uuid || raw?.family_uuid || raw?.id || fallbackId);
  const bebes = Array.isArray(raw?.bebes)
    ? raw.bebes
    : Array.isArray(raw?.enfants)
      ? raw.enfants
      : Array.isArray(raw?.children)
        ? raw.children
        : [];

  const grossesses = Array.isArray(raw?.grossesses)
    ? raw.grossesses
    : raw?.grossesse
      ? [raw.grossesse]
      : [];

  const consultations = Array.isArray(raw?.consultations) ? raw.consultations : [];
  const vaccinations = Array.isArray(raw?.vaccinations) ? raw.vaccinations : [];

  return {
    id: familyId,
    maman: raw?.maman || raw?.mere || raw?.mother || null,
    bebes,
    grossesses,
    consultations,
    vaccinations,
    membres: Array.isArray(raw?.membres) ? raw.membres : undefined,
    estGemellaire: Boolean(raw?.estGemellaire ?? raw?.est_gemellaire ?? bebes.length > 1),
    raw,
  };
};

export const localProfessionnelRepository: ProfessionnelRepository = {
  async getPatients() {
    const { data } = await api.get('/bebes');
    const bebes = Array.isArray(data) ? data : [];
    return bebes.map(mapPatient);
  },

  async getPatientById(id: string) {
    const patients = await this.getPatients();
    return patients.find((patient) => patient.id === id || String(patient.bebeId) === String(id)) || null;
  },

  async getPatientByQRCode(code: string): Promise<PatientScanResult> {
    const { data } = await api.post('/scans/resolve', { qr_code: String(code).trim() });
    if (!data) {
      throw new Error('Patient non trouvé');
    }
    return data;
  },

  async getFamille(uuid: string) {
    const familyId = resolveFamilyId(uuid);
    const { data } = await api.get(`/familles/${familyId}`);
    return normalizeFamily(data, familyId);
  },

  async getFamilleMaman(uuid: string) {
    const familyId = resolveFamilyId(uuid);
    const { data } = await api.get(`/familles/${familyId}/maman`);
    return data;
  },

  async getFamilleBebe(uuid: string, bebeUuid: string) {
    const familyId = resolveFamilyId(uuid);
    const bebeId = resolveFamilyId(bebeUuid);
    const { data } = await api.get(`/familles/${familyId}/bebes/${bebeId}`);
    return data;
  },

  async getGrossesses() {
    const { data } = await api.get('/grossesses');
    const grossesses = Array.isArray(data) ? data : [];
    return grossesses.map(mapGrossesse);
  },

  async getGrossesseById(id: string) {
    const rawId = String(id).replace('g-', '');
    const { data } = await api.get(`/grossesses/${rawId}`);
    return data;
  },

  async validateGrossesse(id: string) {
    const rawId = String(id).replace('g-', '');
    const { data } = await api.post(`/grossesses/${rawId}/validate`, {});
    return data;
  },

  async rejectGrossesse(id: string) {
    throw makeUnsupportedError('Le rejet direct des grossesses a été retiré côté backend.');
  },

  async getGrossessesEnAttente() {
    const grossesses = await this.getGrossesses();
    return grossesses.filter((grossesse) => grossesse.statut === 'EN_ATTENTE');
  },

  async getConsultations(mamanId?: string) {
    const { data } = await api.get('/consultations');
    const consultations = Array.isArray(data) ? data : [];
    const formatted = consultations.map(mapConsultation);
    if (!mamanId) return formatted;
    const mid = resolvePatientId(mamanId);
    return formatted.filter((consultation) => String(consultation.mamanId) === mid);
  },

  async getAllConsultations() {
    return this.getConsultations();
  },

  async getConsultationById(id: string) {
    const rawId = String(id).replace('c-', '');
    const { data } = await api.get(`/consultations/${rawId}`);
    return data;
  },

  async createConsultation(patientId: string, payload: Record<string, any>) {
    const body = {
      maman_id: resolvePatientId(patientId),
      professionnel_id: getStoredSessionUser()?.id,
      date: payload.date || new Date().toISOString().slice(0, 10),
      heure: payload.heure || '09:00:00',
      type: payload.type || 'Consultation de suivi',
      notes: payload.notes || payload.diagnostic || null,
    };

    const { data } = await api.post('/consultations', body);
    return data;
  },

  async updateConsultation(id: string, data: Record<string, any>) {
    const rawId = String(id).replace('c-', '');
    const response = await api.patch(`/consultations/${rawId}`, data);
    return response.data;
  },

  async getVaccinations() {
    const [vaccinationsRes, bebesRes] = await Promise.all([api.get('/vaccinations'), api.get('/bebes')]);
    const vaccinations = Array.isArray(vaccinationsRes.data) ? vaccinationsRes.data : [];
    const bebes = Array.isArray(bebesRes.data) ? bebesRes.data : [];
    const bebeMap = new Map<string, Record<string, any>>(bebes.map((b) => [String(b.id), b] as const));
    return vaccinations.map((vaccination: Record<string, any>) => mapVaccination(vaccination, bebeMap.get(String(vaccination.bebe_id))));
  },

  async getVaccinationsByPatient(patientId: string) {
    const vaccinations = await this.getVaccinations();
    const pid = resolvePatientId(patientId);
    return vaccinations.filter((vaccination) => String(vaccination.bebeId) === pid);
  },

  async addVaccination(patientId: string, data: Record<string, any>) {
    const resolvedPatient = await this.getPatientById(patientId);
    const payload = {
      bebe_id: data.bebe_id || resolvedPatient?.bebeId,
      nom_vaccin: data.nom_vaccin || data.vaccin,
      date_vaccination: data.date_vaccination || data.dateAdministration || new Date().toISOString().slice(0, 10),
      prochaine_dose: data.prochaine_dose || data.prochainRappel || null,
      notes: data.notes || null,
    };

    const response = await api.post('/vaccinations', payload);
    return response.data;
  },

  async administrerVaccin(id: string) {
    throw makeUnsupportedError('La mise à jour directe des vaccinations a été retirée côté backend.');
  },

  async registerAccouchement(mamanId: string, payload: Record<string, any>) {
    const body = {
      maman_id: resolvePatientId(mamanId),
      grossesse_id: payload.grossesse_id || null,
      nom: payload.nom,
      date_naissance: payload.date_naissance,
      sexe: payload.sexe,
      poids: payload.poids || null,
      taille: payload.taille || null,
    };

    const { data } = await api.post('/bebes', body);
    return data;
  },

  async scanPatient(qrData: string) {
    const value = String(qrData || '').trim();
    if (!value) {
      throw new Error('Code QR vide');
    }

    const { data } = await api.post('/scans/resolve', { qr_code: value });
    return data;
  },
};

export default localProfessionnelRepository;
