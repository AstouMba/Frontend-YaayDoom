import { api } from '../../core/api/api';
import { formatDateFr, weekFromDate } from '../../core/date';
import { getStoredSessionUser } from '../../core/session';
import type {
  Bebe,
  CreateGrossesseInput,
  EvolutionGrossesseEtape,
  Grossesse,
  MamanRepository,
  RendezVous,
  Vaccin,
} from '../../domain/maman/types';

const getCurrentUserId = () => getStoredSessionUser()?.id ? String(getStoredSessionUser()?.id) : null;
const getCurrentUserName = () => getStoredSessionUser()?.name || 'Patiente';

const grossesseStatusToUi = (status: string): Grossesse['statut'] => {
  if (status === 'VALIDEE' || status === 'en_cours') return 'VALIDEE';
  if (status === 'TERMINEE' || status === 'terminee') return 'TERMINEE';
  if (status === 'ANNULEE' || status === 'annulee') return 'ANNULEE';
  return 'EN_ATTENTE';
};

const mapGrossesse = (current: Record<string, any>): Grossesse => ({
  id: String(current.id),
  mamanId: String(current.maman_id),
  mamanNom: getCurrentUserName(),
  dateDernieresRegles: current.date_debut,
  dateAccouchePrevue: current.date_fin_prevue || null,
  semaineGrossesse: weekFromDate(current.date_debut),
  nombreGrossessesPrecedentes: Number(current.nombre_grossesses_precedentes || 0),
  antecedentsMedicaux: current.notes || '',
  statut: grossesseStatusToUi(current.statut),
  professionnelValidateur: current.professionnel_validateur || '-',
  dateValidation: current.updated_at || null,
  trimestre: Math.max(1, Math.min(3, Math.ceil(weekFromDate(current.date_debut) / 13) || 1)),
});

const mapBebe = (bebe: Record<string, any>): Bebe => ({
  id: String(bebe.id),
  grossesseId: bebe.grossesse_id ? String(bebe.grossesse_id) : null,
  mamanId: String(bebe.maman_id),
  nom: bebe.nom,
  dateNaissance: bebe.date_naissance,
  sexe: bebe.sexe === 'M' ? 'Masculin' : bebe.sexe === 'F' ? 'Féminin' : bebe.sexe || 'Inconnu',
  poidsNaissance: Number(bebe.poids || 0),
  tailleNaissance: Number(bebe.taille || 0),
  groupeSanguin: bebe.groupe_sanguin || '-',
  ageActuel: bebe.age_actuel || `${Math.max(0, Math.floor((Date.now() - new Date(bebe.date_naissance).getTime()) / (1000 * 60 * 60 * 24 * 30)))} mois`,
  poidsActuel: Number(bebe.poids_actuel || bebe.poids || 0),
  tailleActuelle: Number(bebe.taille_actuelle || bebe.taille || 0),
  mamanNom: getCurrentUserName(),
});

const mapVaccin = (vaccin: Record<string, any>, bebe?: Record<string, any>): Vaccin => ({
  id: `v-${vaccin.id}`,
  bebeId: `b-${vaccin.bebe_id}`,
  nom: vaccin.nom_vaccin || vaccin.nom,
  age: vaccin.age || '-',
  datePrevu: formatDateFr(vaccin.prochaine_dose || vaccin.date_vaccination),
  dateAdministre: vaccin.date_vaccination ? formatDateFr(vaccin.date_vaccination) : null,
  statut: vaccin.date_vaccination ? 'completed' : 'upcoming',
  professionnel: vaccin.professionnel || null,
  notes: vaccin.notes || '',
  bebeNom: bebe?.nom || `Bebe #${vaccin.bebe_id}`,
});

const mapRendezVous = (rdv: Record<string, any>): RendezVous => ({
  id: `rdv-${rdv.id}`,
  type: rdv.motif || 'Rendez-vous médical',
  date: rdv.date,
  heure: rdv.heure,
  professionnel: rdv.professionnel || 'Professionnel de santé',
  lieu: rdv.lieu || 'Centre de santé',
  statut: rdv.statut || 'en_attente',
  notes: rdv.notes || '',
});

export const localMamanRepository: MamanRepository = {
  async getGrossesse() {
    const userId = getCurrentUserId();
    if (!userId) return null;

    const { data } = await api.get('/grossesses');
    const grossesses = Array.isArray(data) ? data : [];
    const current = grossesses.find((g) => String(g.maman_id) === String(userId));
    return current ? mapGrossesse(current) : null;
  },

  async createGrossesse(data: CreateGrossesseInput) {
    const payload = {
      maman_id: getCurrentUserId(),
      date_debut: data.dateDernieresRegles,
      date_fin_prevue: data.dateAccouchePrevue || null,
      statut: 'en_attente',
      notes: data.antecedentsMedicaux || data.notes || null,
    };

    const { data: created } = await api.post('/grossesses', payload);
    return created;
  },

  async updateGrossesse(id: string, data: Record<string, any>) {
    const { data: updated } = await api.put(`/grossesses/${id}`, data);
    return updated;
  },

  async getBebe() {
    const userId = getCurrentUserId();
    if (!userId) return null;

    const { data } = await api.get('/bebes');
    const bebes = Array.isArray(data) ? data : [];
    const bebe = bebes.find((b) => String(b.maman_id) === String(userId));
    return bebe ? mapBebe(bebe) : null;
  },

  async getCroissanceBebe() {
    const bebe = await this.getBebe();
    if (!bebe) return [];

    return [
      { mois: 0, label: 'Naissance', poids: Math.max(2.5, bebe.poidsNaissance || 3), taille: Math.max(45, bebe.tailleNaissance || 49) },
      { mois: 3, label: '3 mois', poids: Math.max(4.5, (bebe.poidsActuel || 8) - 3), taille: Math.max(55, (bebe.tailleActuelle || 70) - 12) },
      { mois: 6, label: '6 mois', poids: Math.max(6, (bebe.poidsActuel || 8) - 1.5), taille: Math.max(62, (bebe.tailleActuelle || 70) - 7) },
      { mois: 9, label: '9 mois', poids: Math.max(7, (bebe.poidsActuel || 8) - 0.6), taille: Math.max(68, (bebe.tailleActuelle || 70) - 3) },
      { mois: 12, label: '12 mois', poids: bebe.poidsActuel || 8, taille: bebe.tailleActuelle || 70 },
    ];
  },

  async getVaccins() {
    const userId = getCurrentUserId();
    if (!userId) return [];

    const [bebesRes, vaccinsRes] = await Promise.all([api.get('/bebes'), api.get('/vaccinations')]);
    const bebes = (Array.isArray(bebesRes.data) ? bebesRes.data : []).filter((b) => String(b.maman_id) === String(userId));
    const bebeMap = new Map<string, Record<string, any>>(bebes.map((b) => [String(b.id), b] as const));
    const vaccins = Array.isArray(vaccinsRes.data) ? vaccinsRes.data : [];

    return vaccins
      .filter((v) => bebeMap.has(String(v.bebe_id)))
      .map((v) => mapVaccin(v, bebeMap.get(String(v.bebe_id))));
  },

  async getProchainVaccin() {
    const vaccins = await this.getVaccins();
    return vaccins.find((vaccin) => vaccin.statut === 'upcoming') || null;
  },

  async getRendezVous() {
    const userId = getCurrentUserId();
    if (!userId) return [];

    const { data } = await api.get('/rendez-vous');
    const list = Array.isArray(data) ? data : [];
    return list.filter((rdv) => String(rdv.maman_id) === String(userId)).map(mapRendezVous);
  },

  async getEvolutionGrossesse() {
    const grossesse = await this.getGrossesse();
    const semaineActuelle = grossesse?.semaineGrossesse || 0;

    return [
      { semaine: 6, titre: '1er trimestre - semaine 6', description: 'Le coeur du bébé commence à battre' },
      { semaine: 12, titre: '1er trimestre - semaine 12', description: 'Fin du premier trimestre' },
      { semaine: 20, titre: '2ème trimestre - semaine 20', description: 'Échographie morphologique' },
      { semaine: semaineActuelle, titre: `Semaine ${semaineActuelle} (maintenant)`, description: 'Suivi en cours', current: true },
      { semaine: 32, titre: '3ème trimestre - semaine 32', description: 'Préparation à la naissance' },
      { semaine: 40, titre: 'Terme - semaine 40', description: 'Date d\'accouchement prévue' },
    ].sort((a, b) => a.semaine - b.semaine) as EvolutionGrossesseEtape[];
  },
};

export default localMamanRepository;
