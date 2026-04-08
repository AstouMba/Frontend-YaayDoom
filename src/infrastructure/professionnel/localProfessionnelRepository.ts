import { api } from '../../core/api/api';
import {
  getMockDb,
  getMockUser,
  isMockSession,
  updateMockDb,
  weekFromDate,
} from '../../core/mock/mockDb';
import type {
  Consultation,
  GrossesseProfessionnelle,
  Patient,
  PatientScanResult,
  ProfessionnelRepository,
  Vaccination,
} from '../../domain/professionnel/types';

const createId = (prefix: string) => `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

const normalizeGrossesseStatut = (status: string | undefined | null): GrossesseProfessionnelle['statut'] => {
  if (status === 'VALIDEE' || status === 'en_cours') return 'VALIDEE';
  if (status === 'TERMINEE' || status === 'terminee') return 'TERMINEE';
  if (status === 'ANNULEE' || status === 'annulee') return 'ANNULEE';
  return 'EN_ATTENTE';
};

const normalizeVaccinationStatut = (vaccin: Record<string, any>): Vaccination['statut'] => {
  if (vaccin.dateAdministre || vaccin.date_vaccination) return 'ADMINISTRE';
  if (!vaccin.prochainRappel && !vaccin.prochaine_dose) return 'A_VENIR';
  const nextDate = String(vaccin.prochainRappel || vaccin.prochaine_dose);
  const today = new Date().toISOString().slice(0, 10);
  return nextDate < today ? 'EN_RETARD' : 'A_VENIR';
};

const mapPatient = (bebe: Record<string, any>, db = getMockDb()): Patient => {
  const maman = (db.utilisateurs || []).find((user: Record<string, any>) => String(user.id) === String(bebe.mamanId));

  return {
    id: `p-${String(bebe.id)}`,
    bebeId: String(bebe.id),
    mamanId: String(bebe.mamanId),
    nom: bebe.nom,
    dateDenaissance: bebe.dateNaissance || null,
    sexe: bebe.sexe === 'Masculin' ? 'Garcon' : bebe.sexe === 'Féminin' ? 'Fille' : bebe.sexe,
    nomMaman: bebe.mamanNom || maman?.nom || `Maman #${bebe.mamanId}`,
    telephone: bebe.telephone || maman?.telephone || '-',
  };
};

const mapGrossesse = (grossesse: Record<string, any>, db = getMockDb()): GrossesseProfessionnelle => {
  const maman = (db.utilisateurs || []).find((user: Record<string, any>) => String(user.id) === String(grossesse.mamanId));

  return {
    id: `g-${String(grossesse.id)}`,
    rawId: String(grossesse.id),
    mamanNom: grossesse.mamanNom || maman?.nom || `Maman #${grossesse.mamanId}`,
    mamanId: String(grossesse.mamanId),
    semaineGrossesse: grossesse.semaineGrossesse ?? weekFromDate(grossesse.dateDernieresRegles),
    statut: normalizeGrossesseStatut(grossesse.statut),
    dateDernieresRegles: grossesse.dateDernieresRegles,
    datePresumeAccouchement: grossesse.dateAccouchementPrevue || grossesse.dateAccouchePrevue || grossesse.datePresumeAccouchement,
    numeroTelephone: grossesse.numeroTelephone || maman?.telephone || '-',
    email: grossesse.email || maman?.email || '-',
    notes: grossesse.notes || grossesse.antecedentsMedicaux || '',
    dateDeclaration: grossesse.dateDeclaration || grossesse.dateValidation || null,
  };
};

const mapConsultation = (consultation: Record<string, any>, db = getMockDb()): Consultation => {
  const grossesse = (db.grossesses || []).find((g: Record<string, any>) => String(g.mamanId) === String(consultation.mamanId));
  const maman = (db.utilisateurs || []).find((user: Record<string, any>) => String(user.id) === String(consultation.mamanId));

  return {
    id: String(consultation.id),
    patientName: grossesse?.mamanNom || maman?.nom || `Maman #${consultation.mamanId}`,
    patientId: `MAM-${consultation.mamanId}`,
    type: consultation.type,
    date: consultation.date,
    tensionArterielle: consultation.tensionArterielle || '-',
    poids: consultation.poids || '-',
    notes: consultation.notes || '',
    semaineGrossesse: consultation.semaineGrossesse || grossesse?.semaineGrossesse || 0,
    mamanId: String(consultation.mamanId),
    professionnelId: String(consultation.professionnelId || ''),
    heure: consultation.heure || '09:00:00',
  };
};

const mapVaccination = (vaccination: Record<string, any>, db = getMockDb()): Vaccination => {
  const bebe = (db.bebes || []).find((item: Record<string, any>) => String(item.id) === String(vaccination.bebeId));

  return {
    id: String(vaccination.id),
    patientName: bebe ? `Maman #${bebe.mamanId}` : '-',
    patientId: bebe ? `MAM-${bebe.mamanId}` : '-',
    bebeNom: bebe?.nom || `Bebe #${vaccination.bebeId}`,
    bebeId: String(vaccination.bebeId),
    bebeAge: bebe?.ageActuel || '-',
    vaccin: vaccination.nom || vaccination.nom_vaccin,
    dateAdministration: vaccination.dateAdministre || vaccination.date_vaccination || vaccination.prochainRappel || vaccination.prochaine_dose || '',
    statut: normalizeVaccinationStatut(vaccination),
    prochainRappel: vaccination.prochainRappel || vaccination.prochaine_dose || undefined,
    notes: vaccination.notes || '',
    raw: vaccination,
  };
};

const getCurrentUser = () => getMockUser();

const resolvePatientId = (patientId: string) => String(patientId).replace('p-', '').replace('m-', '');

export const localProfessionnelRepository: ProfessionnelRepository = {
  async getPatients() {
    if (!isMockSession()) {
      const { data } = await api.get('/bebes');
      const bebes = Array.isArray(data) ? data : [];

      return bebes.map((b: Record<string, any>) => ({
        id: `p-${String(b.id)}`,
        bebeId: String(b.id),
        mamanId: String(b.maman_id),
        nom: b.nom,
        dateDenaissance: b.date_naissance || null,
        sexe: b.sexe === 'M' ? 'Garcon' : 'Fille',
        nomMaman: `Maman #${b.maman_id}`,
        telephone: '-',
      }));
    }

    const db = getMockDb();
    return (db.bebes || []).map((bebe: Record<string, any>) => mapPatient(bebe, db));
  },

  async getPatientById(id: string) {
    const patients = await localProfessionnelRepository.getPatients();
    return patients.find((patient) => patient.id === id || String(patient.bebeId) === String(id)) || null;
  },

  async getPatientByQRCode(code: string): Promise<PatientScanResult> {
    const value = String(code).trim().toLowerCase();
    if (!value) {
      throw new Error('Code QR vide');
    }

    const patients = await localProfessionnelRepository.getPatients();
    const byPatient = patients.find(
      (patient) =>
        patient.id.toLowerCase() === value ||
        String(patient.bebeId) === value ||
        patient.nom.toLowerCase().includes(value)
    );

    if (byPatient) {
      return byPatient;
    }

    const grossesses = await localProfessionnelRepository.getGrossesses();
    const byGrossesse = grossesses.find(
      (grossesse) => String(grossesse.rawId) === value || grossesse.id.toLowerCase() === value || String(grossesse.mamanId) === value
    );

    if (byGrossesse) {
      return {
        id: `m-${byGrossesse.mamanId}`,
        bebeId: '',
        mamanId: byGrossesse.mamanId,
        nom: byGrossesse.mamanNom,
        dateDenaissance: null,
        sexe: '-',
        nomMaman: byGrossesse.mamanNom,
        telephone: byGrossesse.numeroTelephone || '-',
        grossesse: byGrossesse,
      };
    }

    throw new Error('Patient non trouve');
  },

  async getGrossesses() {
    if (!isMockSession()) {
      const { data } = await api.get('/grossesses');
      const grossesses = Array.isArray(data) ? data : [];

      return grossesses.map((g: Record<string, any>) => ({
        id: `g-${String(g.id)}`,
        rawId: String(g.id),
        mamanNom: `Maman #${g.maman_id}`,
        mamanId: String(g.maman_id),
        semaineGrossesse: weekFromDate(g.date_debut),
        statut: normalizeGrossesseStatut(g.statut),
        dateDernieresRegles: g.date_debut,
        datePresumeAccouchement: g.date_fin_prevue,
        numeroTelephone: '-',
        email: '-',
        notes: g.notes || '',
        dateDeclaration: g.created_at,
      }));
    }

    const db = getMockDb();
    return (db.grossesses || []).map((grossesse: Record<string, any>) => mapGrossesse(grossesse, db));
  },

  async getGrossesseById(id: string) {
    if (!isMockSession()) {
      const rawId = String(id).replace('g-', '');
      const { data } = await api.get(`/grossesses/${rawId}`);
      return data;
    }

    const db = getMockDb();
    const rawId = String(id).replace('g-', '');
    const grossesse = (db.grossesses || []).find((item: Record<string, any>) => String(item.id) === String(rawId));
    return grossesse ? mapGrossesse(grossesse, db) : null;
  },

  async validateGrossesse(id: string) {
    if (!isMockSession()) {
      const rawId = String(id).replace('g-', '');
      const { data } = await api.patch(`/grossesses/${rawId}`, { statut: 'en_cours' });
      return data;
    }

    const rawId = String(id).replace('g-', '');
    return updateMockDb((db) => {
      db.grossesses = (db.grossesses || []).map((grossesse: Record<string, any>) =>
        String(grossesse.id) === String(rawId)
          ? { ...grossesse, statut: 'VALIDEE', dateValidation: new Date().toISOString().slice(0, 10) }
          : grossesse
      );
      const updated = (db.grossesses || []).find((grossesse: Record<string, any>) => String(grossesse.id) === String(rawId));
      return updated ? mapGrossesse(updated, db) : null;
    });
  },

  async rejectGrossesse(id: string) {
    if (!isMockSession()) {
      const rawId = String(id).replace('g-', '');
      const { data } = await api.patch(`/grossesses/${rawId}`, { statut: 'annulee' });
      return data;
    }

    const rawId = String(id).replace('g-', '');
    return updateMockDb((db) => {
      db.grossesses = (db.grossesses || []).map((grossesse: Record<string, any>) =>
        String(grossesse.id) === String(rawId) ? { ...grossesse, statut: 'ANNULEE' } : grossesse
      );
      const updated = (db.grossesses || []).find((grossesse: Record<string, any>) => String(grossesse.id) === String(rawId));
      return updated ? mapGrossesse(updated, db) : null;
    });
  },

  async getGrossessesEnAttente() {
    const grossesses = await localProfessionnelRepository.getGrossesses();
    return grossesses.filter((grossesse) => grossesse.statut === 'EN_ATTENTE');
  },

  async getConsultations(mamanId?: string) {
    if (!isMockSession()) {
      const [consultationsRes, grossesses] = await Promise.all([api.get('/consultations'), localProfessionnelRepository.getGrossesses()]);
      const consultations = Array.isArray(consultationsRes.data) ? consultationsRes.data : [];
      const grossesseMap = new Map<string, GrossesseProfessionnelle>(
        grossesses.map((grossesse) => [String(grossesse.mamanId), grossesse] as const)
      );

      const formatted = consultations.map((consultation: Record<string, any>) => {
        const maman = grossesseMap.get(String(consultation.maman_id));
        return {
          id: String(consultation.id),
          patientName: maman?.mamanNom || `Maman #${consultation.maman_id}`,
          patientId: `MAM-${consultation.maman_id}`,
          type: consultation.type,
          date: consultation.date,
          tensionArterielle: '-',
          poids: '-',
          notes: consultation.notes || '',
          semaineGrossesse: maman?.semaineGrossesse || 0,
          mamanId: String(consultation.maman_id),
          professionnelId: String(consultation.professionnel_id),
          heure: consultation.heure,
        } as Consultation;
      });

      if (!mamanId) return formatted;
      const mid = resolvePatientId(mamanId);
      return formatted.filter((consultation) => String(consultation.mamanId) === mid);
    }

    const db = getMockDb();
    const grossesses = await localProfessionnelRepository.getGrossesses();
    const formatted = (db.consultations || []).map((consultation: Record<string, any>) => mapConsultation(consultation, db));

    if (!mamanId) return formatted;
    const mid = resolvePatientId(mamanId);
    return formatted.filter((consultation) => String(consultation.mamanId) === mid);
  },

  async getAllConsultations() {
    return localProfessionnelRepository.getConsultations();
  },

  async getConsultationById(id: string) {
    if (!isMockSession()) {
      const rawId = String(id).replace('c-', '');
      const { data } = await api.get(`/consultations/${rawId}`);
      return data;
    }

    const db = getMockDb();
    const rawId = String(id).replace('c-', '');
    const consultation = (db.consultations || []).find((item: Record<string, any>) => String(item.id) === String(rawId));
    return consultation ? mapConsultation(consultation, db) : null;
  },

  async createConsultation(patientId: string, payload: Record<string, any>) {
    if (!isMockSession()) {
      const pro = getCurrentUser();
      const mamanId = resolvePatientId(patientId);

      const body = {
        maman_id: mamanId,
        professionnel_id: String(pro?.id),
        date: payload.date || new Date().toISOString().slice(0, 10),
        heure: payload.heure || '09:00:00',
        type: payload.type || 'Consultation de suivi',
        notes: payload.notes || payload.diagnostic || null,
      };

      const { data } = await api.post('/consultations', body);
      return data;
    }

    const user = getCurrentUser();
    const mamanId = resolvePatientId(patientId);
    const id = createId('c');

    return updateMockDb((db) => {
      const consultation = {
        id,
        mamanId,
        professionnelId: String(user?.id || ''),
        date: payload.date || new Date().toISOString().slice(0, 10),
        heure: payload.heure || '09:00:00',
        type: payload.type || 'Consultation de suivi',
        notes: payload.notes || payload.diagnostic || '',
        tensionArterielle: payload.tensionArterielle || '-',
        poids: payload.poids || '-',
        semaineGrossesse: payload.semaineGrossesse || 0,
      };

      db.consultations = [consultation, ...(db.consultations || [])];
      return consultation;
    });
  },

  async updateConsultation(id: string, data: Record<string, any>) {
    if (!isMockSession()) {
      const rawId = String(id).replace('c-', '');
      const response = await api.patch(`/consultations/${rawId}`, data);
      return response.data;
    }

    const rawId = String(id).replace('c-', '');
    return updateMockDb((db) => {
      db.consultations = (db.consultations || []).map((consultation: Record<string, any>) =>
        String(consultation.id) === String(rawId) ? { ...consultation, ...data } : consultation
      );
      const updated = (db.consultations || []).find((consultation: Record<string, any>) => String(consultation.id) === String(rawId));
      return updated ? mapConsultation(updated, db) : null;
    });
  },

  async getVaccinations() {
    if (!isMockSession()) {
      const [vaccinationsRes, bebesRes] = await Promise.all([api.get('/vaccinations'), api.get('/bebes')]);
      const vaccinations = Array.isArray(vaccinationsRes.data) ? vaccinationsRes.data : [];
      const bebes = Array.isArray(bebesRes.data) ? bebesRes.data : [];
      const bebeMap = new Map<string, Record<string, any>>(bebes.map((b: Record<string, any>) => [String(b.id), b] as const));

      return vaccinations.map((vaccination: Record<string, any>) => {
        const bebe = bebeMap.get(String(vaccination.bebe_id));
        return {
          id: String(vaccination.id),
          patientName: bebe ? `Maman #${bebe.maman_id}` : '-',
          patientId: bebe ? `MAM-${bebe.maman_id}` : '-',
          bebeNom: bebe?.nom || `Bebe #${vaccination.bebe_id}`,
          bebeId: String(vaccination.bebe_id),
          bebeAge: '-',
          vaccin: vaccination.nom_vaccin,
          dateAdministration: vaccination.date_vaccination || vaccination.prochaine_dose,
          statut: normalizeVaccinationStatut(vaccination),
          prochainRappel: vaccination.prochaine_dose || undefined,
          notes: vaccination.notes || '',
          raw: vaccination,
        } as Vaccination;
      });
    }

    const db = getMockDb();
    return (db.vaccins || []).map((vaccination: Record<string, any>) => mapVaccination(vaccination, db));
  },

  async getVaccinationsByPatient(patientId: string) {
    const vaccinations = await localProfessionnelRepository.getVaccinations();
    const pid = resolvePatientId(patientId);
    return vaccinations.filter((vaccination) => String(vaccination.patientId).endsWith(String(pid)) || String(vaccination.bebeId) === pid);
  },

  async addVaccination(patientId: string, data: Record<string, any>) {
    if (!isMockSession()) {
      const resolvedPatient = await localProfessionnelRepository.getPatientById(patientId);
      const payload = {
        bebe_id: data.bebe_id || resolvedPatient?.bebeId,
        nom_vaccin: data.nom_vaccin || data.vaccin,
        date_vaccination: data.date_vaccination || data.dateAdministration || new Date().toISOString().slice(0, 10),
        prochaine_dose: data.prochaine_dose || data.prochainRappel || null,
        notes: data.notes || null,
      };

      const response = await api.post('/vaccinations', payload);
      return response.data;
    }

    const resolvedPatient = await localProfessionnelRepository.getPatientById(patientId);
    const bebeId = String(data.bebe_id || resolvedPatient?.bebeId || '');

    return updateMockDb((db) => {
      const vaccination = {
        id: createId('v'),
        bebeId,
        nom: data.nom_vaccin || data.vaccin || 'Vaccin',
        age: data.age || '-',
        datePrevu: data.dateAdministration || new Date().toISOString().slice(0, 10),
        dateAdministre: data.date_vaccination || null,
        professionnel: data.professionnel || getCurrentUser()?.name || null,
        notes: data.notes || '',
      };

      db.vaccins = [vaccination, ...(db.vaccins || [])];
      return mapVaccination(vaccination, db);
    });
  },

  async administrerVaccin(id: string) {
    if (!isMockSession()) {
      const rawId = String(id).replace('v-', '');
      const response = await api.patch(`/vaccinations/${rawId}`, {
        date_vaccination: new Date().toISOString().slice(0, 10),
      });
      return response.data;
    }

    const rawId = String(id).replace('v-', '');
    return updateMockDb((db) => {
      db.vaccins = (db.vaccins || []).map((vaccin: Record<string, any>) =>
        String(vaccin.id) === String(rawId) ? { ...vaccin, dateAdministre: new Date().toISOString().slice(0, 10) } : vaccin
      );
      const updated = (db.vaccins || []).find((vaccin: Record<string, any>) => String(vaccin.id) === String(rawId));
      return updated ? mapVaccination(updated, db) : null;
    });
  },

  async registerAccouchement(mamanId: string, payload: Record<string, any>) {
    if (!isMockSession()) {
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
    }

    const rawMamanId = resolvePatientId(mamanId);
    return updateMockDb((db) => {
      const bebe = {
        id: createId('b'),
        mamanId: rawMamanId,
        grossesseId: payload.grossesse_id || null,
        nom: payload.nom,
        dateNaissance: payload.date_naissance,
        sexe: payload.sexe === 'M' ? 'Masculin' : payload.sexe === 'F' ? 'Féminin' : payload.sexe,
        poidsNaissance: Number(payload.poids || 0),
        tailleNaissance: Number(payload.taille || 0),
        poidsActuel: Number(payload.poids || 0),
        tailleActuelle: Number(payload.taille || 0),
        groupeSanguin: payload.groupeSanguin || '-',
        ageActuel: '0 mois',
      };

      db.bebes = [bebe, ...(db.bebes || [])];
      db.grossesses = (db.grossesses || []).map((grossesse: Record<string, any>) =>
        String(grossesse.mamanId) === String(rawMamanId) ? { ...grossesse, statut: 'TERMINEE' } : grossesse
      );
      return bebe;
    });
  },

  async scanPatient(qrData: string) {
    const value = String(qrData || '').trim();
    if (!value) {
      throw new Error('Code QR vide');
    }

    if (!isMockSession()) {
      const { data } = await api.post('/scans/resolve', { qr_code: value });
      return data;
    }

    const patient = await localProfessionnelRepository.getPatientByQRCode(value);
    if (patient?.grossesse) return patient;

    const grossesses = await localProfessionnelRepository.getGrossesses();
    const matchedGrossesse = grossesses.find(
      (grossesse) =>
        String(grossesse.mamanId) === String(patient.mamanId) ||
        String(grossesse.rawId) === String(patient.id).replace('m-', '')
    );

    return matchedGrossesse
      ? {
          ...patient,
          grossesse: matchedGrossesse,
        }
      : patient;
  },
};

export default localProfessionnelRepository;
