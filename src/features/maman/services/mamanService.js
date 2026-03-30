/**
 * Maman Service - Grossesse et bébé API
 */
import { api } from '../../../core/api/api';

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('yaydoom_user') || 'null');
  } catch {
    return null;
  }
};

const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user?.id ? String(user.id) : null;
};

const formatDateFr = (isoDate) => {
  if (!isoDate) return '';
  return new Date(isoDate).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

const weekFromDate = (startDate) => {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const weeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));
  return Math.max(0, weeks);
};

const grossesseStatusToUi = (status) => {
  if (status === 'en_cours') return 'VALIDEE';
  if (status === 'terminee') return 'TERMINEE';
  if (status === 'annulee') return 'ANNULEE';
  return 'EN_ATTENTE';
};

export const getGrossesse = async () => {
  const userId = getCurrentUserId();
  const { data } = await api.get('/grossesses');
  const grossesses = Array.isArray(data) ? data : [];
  const current = grossesses.find((g) => String(g.maman_id) === String(userId)) || grossesses[0];

  if (!current) return null;

  return {
    id: String(current.id),
    mamanId: String(current.maman_id),
    mamanNom: getCurrentUser()?.name || 'Patiente',
    dateDernieresRegles: current.date_debut,
    dateAccouchePrevue: current.date_fin_prevue,
    semaineGrossesse: weekFromDate(current.date_debut),
    nombreGrossessesPrecedentes: 0,
    antecedentsMedicaux: current.notes || '',
    statut: grossesseStatusToUi(current.statut),
    professionnelValidateur: '-',
    dateValidation: current.updated_at,
    trimestre: Math.max(1, Math.min(3, Math.ceil(weekFromDate(current.date_debut) / 13))),
  };
};

export const createGrossesse = async (data) => {
  const userId = getCurrentUserId();
  const payload = {
    maman_id: userId,
    date_debut: data.dateDernieresRegles,
    date_fin_prevue: data.dateAccouchePrevue || null,
    statut: 'en_attente',
    notes: data.antecedentsMedicaux || data.notes || null,
  };

  const { data: created } = await api.post('/grossesses', payload);
  return created;
};

export const updateGrossesse = async (id, data) => {
  const { data: updated } = await api.put(`/grossesses/${id}`, data);
  return updated;
};

export const getBebe = async () => {
  const userId = getCurrentUserId();
  const { data } = await api.get('/bebes');
  const bebes = Array.isArray(data) ? data : [];
  const bebe = bebes.find((b) => String(b.maman_id) === String(userId)) || bebes[0];

  if (!bebe) return null;

  const naissance = new Date(bebe.date_naissance);
  const ageMonths = Math.max(
    0,
    (new Date().getFullYear() - naissance.getFullYear()) * 12 +
      (new Date().getMonth() - naissance.getMonth())
  );

  return {
    id: String(bebe.id),
    grossesseId: bebe.grossesse_id ? String(bebe.grossesse_id) : null,
    mamanId: String(bebe.maman_id),
    nom: bebe.nom,
    dateNaissance: bebe.date_naissance,
    sexe: bebe.sexe === 'M' ? 'Masculin' : 'Féminin',
    poidsNaissance: Number(bebe.poids || 0),
    tailleNaissance: Number(bebe.taille || 0),
    groupeSanguin: '-',
    ageActuel: `${ageMonths} mois`,
    poidsActuel: Number(bebe.poids || 0),
    tailleActuelle: Number(bebe.taille || 0),
  };
};

export const getCroissanceBebe = async () => {
  const bebe = await getBebe();
  if (!bebe) return [];

  return [
    { mois: 0, label: 'Naissance', poids: Math.max(2.5, bebe.poidsNaissance || 3), taille: Math.max(45, bebe.tailleNaissance || 49) },
    { mois: 3, label: '3 mois', poids: Math.max(4.5, (bebe.poidsActuel || 8) - 3), taille: Math.max(55, (bebe.tailleActuelle || 70) - 12) },
    { mois: 6, label: '6 mois', poids: Math.max(6, (bebe.poidsActuel || 8) - 1.5), taille: Math.max(62, (bebe.tailleActuelle || 70) - 7) },
    { mois: 9, label: '9 mois', poids: Math.max(7, (bebe.poidsActuel || 8) - 0.6), taille: Math.max(68, (bebe.tailleActuelle || 70) - 3) },
    { mois: 12, label: '12 mois', poids: bebe.poidsActuel || 8, taille: bebe.tailleActuelle || 70 },
  ];
};

export const getVaccins = async () => {
  const userId = getCurrentUserId();
  const [bebesRes, vaccinsRes] = await Promise.all([
    api.get('/bebes'),
    api.get('/vaccinations'),
  ]);

  const bebes = (Array.isArray(bebesRes.data) ? bebesRes.data : []).filter(
    (b) => String(b.maman_id) === String(userId)
  );
  const bebeIds = new Set(bebes.map((b) => String(b.id)));

  const vaccins = Array.isArray(vaccinsRes.data) ? vaccinsRes.data : [];

  return vaccins
    .filter((v) => bebeIds.has(String(v.bebe_id)))
    .map((v) => {
      const dateAdmin = v.date_vaccination ? formatDateFr(v.date_vaccination) : null;
      const datePrev = formatDateFr(v.prochaine_dose || v.date_vaccination);
      const isCompleted = Boolean(v.date_vaccination);
      return {
        id: `v-${v.id}`,
        bebeId: `b-${v.bebe_id}`,
        nom: v.nom_vaccin,
        age: '-',
        datePrevu: datePrev,
        dateAdministre: dateAdmin,
        statut: isCompleted ? 'completed' : 'upcoming',
        professionnel: null,
      };
    });
};

export const getProchainVaccin = async () => {
  const vaccins = await getVaccins();
  return vaccins.find((v) => v.statut === 'upcoming') || null;
};

export const getRendezVous = async () => {
  const userId = getCurrentUserId();
  const { data } = await api.get('/rendez-vous');
  const list = Array.isArray(data) ? data : [];

  return list
    .filter((r) => String(r.maman_id) === String(userId))
    .map((r) => ({
      id: `rdv-${r.id}`,
      type: r.motif || 'Rendez-vous médical',
      date: r.date,
      heure: r.heure,
      professionnel: 'Professionnel de santé',
      lieu: 'Centre de santé',
      statut: r.statut || 'en_attente',
      notes: '',
    }));
};

export const getEvolutionGrossesse = async () => {
  const grossesse = await getGrossesse();
  const semaineActuelle = grossesse?.semaineGrossesse || 0;

  return [
    { semaine: 6, titre: '1er trimestre - semaine 6', description: 'Le coeur du bébé commence à battre' },
    { semaine: 12, titre: '1er trimestre - semaine 12', description: 'Fin du premier trimestre' },
    { semaine: 20, titre: '2ème trimestre - semaine 20', description: 'Échographie morphologique' },
    { semaine: semaineActuelle, titre: `Semaine ${semaineActuelle} (maintenant)`, description: 'Suivi en cours', current: true },
    { semaine: 32, titre: '3ème trimestre - semaine 32', description: 'Préparation à la naissance' },
    { semaine: 40, titre: 'Terme - semaine 40', description: 'Date d\'accouchement prévue' },
  ].sort((a, b) => a.semaine - b.semaine);
};

export default {
  getGrossesse,
  createGrossesse,
  updateGrossesse,
  getBebe,
  getCroissanceBebe,
  getVaccins,
  getProchainVaccin,
  getRendezVous,
  getEvolutionGrossesse,
};
