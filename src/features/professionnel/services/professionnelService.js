/**
 * Professionnel Service - API pour professionnels de sante
 */
import { api } from '../../../core/api/api';

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('yaydoom_user') || 'null');
  } catch {
    return null;
  }
};

const weekFromDate = (startDate) => {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)));
};

const grossesseStatutUi = (status) => {
  if (status === 'en_cours') return 'VALIDEE';
  if (status === 'terminee') return 'TERMINEE';
  if (status === 'annulee') return 'ANNULEE';
  return 'EN_ATTENTE';
};

const vaccinationStatus = (v) => {
  if (v.date_vaccination) return 'ADMINISTRE';
  if (!v.prochaine_dose) return 'A_VENIR';
  const today = new Date().toISOString().slice(0, 10);
  return v.prochaine_dose < today ? 'EN_RETARD' : 'A_VENIR';
};

export const getPatients = async () => {
  const { data } = await api.get('/bebes');
  const bebes = Array.isArray(data) ? data : [];

  return bebes.map((b) => ({
    id: `p-${String(b.id)}`,
    bebeId: String(b.id),
    mamanId: String(b.maman_id),
    nom: b.nom,
    dateDenaissance: b.date_naissance,
    sexe: b.sexe === 'M' ? 'Garcon' : 'Fille',
    nomMaman: `Maman #${b.maman_id}`,
    telephone: '-',
  }));
};

export const getPatientById = async (id) => {
  const patients = await getPatients();
  return patients.find((p) => p.id === id || String(p.bebeId) === String(id)) || null;
};

export const getPatientByQRCode = async (code) => {
  const value = String(code).trim().toLowerCase();
  const patients = await getPatients();

  const byPatient = patients.find(
    (p) =>
      p.id.toLowerCase() === value ||
      String(p.bebeId) === value ||
      p.nom.toLowerCase().includes(value)
  );

  if (byPatient) return byPatient;

  const grossesses = await getGrossesses();
  const byGrossesse = grossesses.find(
    (g) => String(g.rawId) === value || g.id.toLowerCase() === value || String(g.mamanId) === value
  );

  if (byGrossesse) {
    return {
      id: `m-${byGrossesse.mamanId}`,
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
};

export const getGrossesses = async () => {
  const { data } = await api.get('/grossesses');
  const grossesses = Array.isArray(data) ? data : [];

  return grossesses.map((g) => ({
    id: `g-${String(g.id)}`,
    rawId: String(g.id),
    mamanNom: `Maman #${g.maman_id}`,
    mamanId: String(g.maman_id),
    semaineGrossesse: weekFromDate(g.date_debut),
    statut: grossesseStatutUi(g.statut),
    dateDernieresRegles: g.date_debut,
    datePresumeAccouchement: g.date_fin_prevue,
    numeroTelephone: '-',
    email: '-',
    notes: g.notes || '',
    dateDeclaration: g.created_at,
  }));
};

export const getGrossesseById = async (id) => {
  const rawId = String(id).replace('g-', '');
  const { data } = await api.get(`/grossesses/${rawId}`);
  return data;
};

export const validateGrossesse = async (id) => {
  const rawId = String(id).replace('g-', '');
  const { data } = await api.patch(`/grossesses/${rawId}`, { statut: 'en_cours' });
  return data;
};

export const rejectGrossesse = async (id) => {
  const rawId = String(id).replace('g-', '');
  const { data } = await api.patch(`/grossesses/${rawId}`, { statut: 'annulee' });
  return data;
};

export const getGrossessesEnAttente = async () => {
  const grossesses = await getGrossesses();
  return grossesses.filter((g) => g.statut === 'EN_ATTENTE');
};

export const getConsultations = async (mamanId) => {
  const [consultationsRes, grossesses] = await Promise.all([api.get('/consultations'), getGrossesses()]);
  const consultations = Array.isArray(consultationsRes.data) ? consultationsRes.data : [];
  const grossesseMap = new Map(grossesses.map((g) => [String(g.mamanId), g]));

  const formatted = consultations.map((c) => {
    const maman = grossesseMap.get(String(c.maman_id));
    return {
      id: String(c.id),
      patientName: maman?.mamanNom || `Maman #${c.maman_id}`,
      patientId: `MAM-${c.maman_id}`,
      type: c.type,
      date: c.date,
      tensionArterielle: '-',
      poids: '-',
      notes: c.notes || '',
      semaineGrossesse: maman?.semaineGrossesse || 0,
      mamanId: String(c.maman_id),
      professionnelId: String(c.professionnel_id),
      heure: c.heure,
    };
  });

  if (!mamanId) return formatted;
  const mid = String(mamanId).replace('p-', '').replace('m-', '');
  return formatted.filter((c) => String(c.mamanId) === mid);
};

export const getAllConsultations = async () => getConsultations();

export const getConsultationById = async (id) => {
  const rawId = String(id).replace('c-', '');
  const { data } = await api.get(`/consultations/${rawId}`);
  return data;
};

export const createConsultation = async (patientId, payload) => {
  const pro = getCurrentUser();
  const mamanId = String(patientId).replace('p-', '').replace('m-', '');

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
};

export const updateConsultation = async (id, data) => {
  const rawId = String(id).replace('c-', '');
  const response = await api.patch(`/consultations/${rawId}`, data);
  return response.data;
};

export const getVaccinations = async () => {
  const [vaccinationsRes, bebesRes] = await Promise.all([api.get('/vaccinations'), api.get('/bebes')]);
  const vaccinations = Array.isArray(vaccinationsRes.data) ? vaccinationsRes.data : [];
  const bebes = Array.isArray(bebesRes.data) ? bebesRes.data : [];
  const bebeMap = new Map(bebes.map((b) => [String(b.id), b]));

  return vaccinations.map((v) => {
    const bebe = bebeMap.get(String(v.bebe_id));
    return {
      id: String(v.id),
      patientName: bebe ? `Maman #${bebe.maman_id}` : '-',
      patientId: bebe ? `MAM-${bebe.maman_id}` : '-',
      bebeNom: bebe?.nom || `Bebe #${v.bebe_id}`,
      bebeId: String(v.bebe_id),
      bebeAge: '-',
      vaccin: v.nom_vaccin,
      dateAdministration: v.date_vaccination || v.prochaine_dose,
      statut: vaccinationStatus(v),
      prochainRappel: v.prochaine_dose || undefined,
      notes: v.notes || '',
      raw: v,
    };
  });
};

export const getVaccinationsByPatient = async (patientId) => {
  const vaccinations = await getVaccinations();
  const pid = String(patientId).replace('p-', '').replace('m-', '');

  return vaccinations.filter((v) => String(v.patientId).endsWith(String(pid)) || String(v.bebeId) === pid);
};

export const addVaccination = async (patientId, data) => {
  const resolvedPatient = await getPatientById(patientId);
  const payload = {
    bebe_id: data.bebe_id || resolvedPatient?.bebeId,
    nom_vaccin: data.nom_vaccin || data.vaccin,
    date_vaccination: data.date_vaccination || data.dateAdministration || new Date().toISOString().slice(0, 10),
    prochaine_dose: data.prochaine_dose || data.prochainRappel || null,
    notes: data.notes || null,
  };

  const response = await api.post('/vaccinations', payload);
  return response.data;
};

export const administrerVaccin = async (id) => {
  const rawId = String(id).replace('v-', '');
  const response = await api.patch(`/vaccinations/${rawId}`, {
    date_vaccination: new Date().toISOString().slice(0, 10),
  });
  return response.data;
};

export const registerAccouchement = async (mamanId, payload) => {
  const body = {
    maman_id: String(mamanId).replace('m-', '').replace('p-', ''),
    grossesse_id: payload.grossesse_id || null,
    nom: payload.nom,
    date_naissance: payload.date_naissance,
    sexe: payload.sexe,
    poids: payload.poids || null,
    taille: payload.taille || null,
  };

  const { data } = await api.post('/bebes', body);
  return data;
};

export const scanPatient = async (qrData) => {
  const value = String(qrData || '').trim();
  if (!value) {
    throw new Error('Code QR vide');
  }

  const { data } = await api.post('/scans/resolve', { qr_code: value });
  return data;
};

export default {
  getPatients,
  getPatientById,
  getPatientByQRCode,
  getGrossesses,
  getGrossesseById,
  validateGrossesse,
  rejectGrossesse,
  getGrossessesEnAttente,
  getConsultations,
  getAllConsultations,
  getConsultationById,
  createConsultation,
  updateConsultation,
  getVaccinations,
  getVaccinationsByPatient,
  addVaccination,
  administrerVaccin,
  registerAccouchement,
  scanPatient,
};
