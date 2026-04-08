import { api } from '../../core/api/api';
import {
  formatDateFr,
  getMockDb,
  getMockUser,
  isMockSession,
  updateMockDb,
  weekFromDate,
} from '../../core/mock/mockDb';
import type {
  Bebe,
  CreateGrossesseInput,
  EvolutionGrossesseEtape,
  Grossesse,
  MamanRepository,
  RendezVous,
  Vaccin,
} from '../../domain/maman/types';

const getCurrentUserId = () => {
  const user = getMockUser();
  return user?.id ? String(user.id) : null;
};

const grossesseStatusToUi = (status: string): Grossesse['statut'] => {
  if (status === 'VALIDEE' || status === 'en_cours') return 'VALIDEE';
  if (status === 'TERMINEE' || status === 'terminee') return 'TERMINEE';
  if (status === 'ANNULEE' || status === 'annulee') return 'ANNULEE';
  return 'EN_ATTENTE';
};

const buildGrossesse = (current: Record<string, any>, user: Record<string, any> | null): Grossesse => ({
  id: String(current.id),
  mamanId: String(current.mamanId),
  mamanNom: user?.name || current.mamanNom || 'Patiente',
  dateDernieresRegles: current.dateDernieresRegles,
  dateAccouchePrevue: current.dateAccouchePrevue || current.dateAccouchementPrevue || null,
  semaineGrossesse: current.semaineGrossesse ?? weekFromDate(current.dateDernieresRegles),
  nombreGrossessesPrecedentes: current.nombreGrossessesPrecedentes ?? 0,
  antecedentsMedicaux: current.antecedentsMedicaux || '',
  statut: grossesseStatusToUi(current.statut),
  professionnelValidateur: current.professionnelValidateur || '-',
  dateValidation: current.dateValidation || null,
  trimestre: current.trimestre ?? Math.max(1, Math.min(3, Math.ceil((current.semaineGrossesse ?? 0) / 13) || 1)),
});

const buildBebe = (bebe: Record<string, any>, user: Record<string, any> | null): Bebe => ({
  id: String(bebe.id),
  grossesseId: bebe.grossesseId ? String(bebe.grossesseId) : null,
  mamanId: String(bebe.mamanId),
  nom: bebe.nom,
  dateNaissance: bebe.dateNaissance,
  sexe: bebe.sexe,
  poidsNaissance: Number(bebe.poidsNaissance || bebe.poids || 0),
  tailleNaissance: Number(bebe.tailleNaissance || bebe.taille || 0),
  groupeSanguin: bebe.groupeSanguin || '-',
  ageActuel: bebe.ageActuel || `${Math.max(0, Math.floor((new Date().getTime() - new Date(bebe.dateNaissance).getTime()) / (1000 * 60 * 60 * 24 * 30)))} mois`,
  poidsActuel: Number(bebe.poidsActuel || bebe.poids || 0),
  tailleActuelle: Number(bebe.tailleActuelle || bebe.taille || 0),
  mamanNom: user?.name || bebe.mamanNom || 'Patiente',
});

const buildVaccin = (vaccin: Record<string, any>, bebe?: Record<string, any>): Vaccin => ({
  id: `v-${vaccin.id}`,
  bebeId: `b-${vaccin.bebeId}`,
  nom: vaccin.nom,
  age: vaccin.age || '-',
  datePrevu: formatDateFr(vaccin.datePrevu),
  dateAdministre: vaccin.dateAdministre ? formatDateFr(vaccin.dateAdministre) : null,
  statut: vaccin.dateAdministre ? 'completed' : 'upcoming',
  professionnel: vaccin.professionnel || null,
  notes: vaccin.notes || '',
  bebeNom: bebe?.nom || `Bebe #${vaccin.bebeId}`,
});

export const localMamanRepository: MamanRepository = {
  async getGrossesse() {
    if (!isMockSession()) {
      const userId = getCurrentUserId();
      const { data } = await api.get('/grossesses');
      const grossesses = Array.isArray(data) ? data : [];
      const current = grossesses.find((g) => String(g.maman_id) === String(userId));

      if (!current) return null;

      return {
        id: String(current.id),
        mamanId: String(current.maman_id),
        mamanNom: getMockUser()?.name || 'Patiente',
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
    }

    const db = getMockDb();
    const user = getMockUser();
    const userId = getCurrentUserId();
    const current =
      db.grossesses.find((g) => String(g.mamanId) === String(userId)) ||
      db.grossesses.find((g) => String(g.mamanId) === String(userId?.replace('m-', '')));

    return current ? buildGrossesse(current, user) : null;
  },

  async createGrossesse(data: CreateGrossesseInput) {
    if (!isMockSession()) {
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
    }

    const user = getMockUser();
    const userId = getCurrentUserId();

    return updateMockDb((db) => {
      const id = `g-${Date.now()}`;
      const existingIndex = db.grossesses.findIndex((g) => String(g.mamanId) === String(userId));
      const record = {
        id: existingIndex >= 0 ? db.grossesses[existingIndex].id : id,
        mamanId: userId,
        mamanNom: user?.name || 'Patiente',
        dateDernieresRegles: data.dateDernieresRegles,
        dateAccouchePrevue: data.dateAccouchePrevue || null,
        dateAccouchementPrevue: data.dateAccouchePrevue || null,
        semaineGrossesse: weekFromDate(data.dateDernieresRegles),
        nombreGrossessesPrecedentes: 0,
        antecedentsMedicaux: data.antecedentsMedicaux || data.notes || '',
        statut: 'EN_ATTENTE',
        professionnelValidateur: '-',
        dateValidation: null,
        trimestre: Math.max(1, Math.min(3, Math.ceil(weekFromDate(data.dateDernieresRegles) / 13) || 1)),
      };

      if (existingIndex >= 0) {
        db.grossesses[existingIndex] = record;
      } else {
        db.grossesses.unshift(record);
      }

      return record;
    });
  },

  async updateGrossesse(id: string, data: Record<string, any>) {
    if (!isMockSession()) {
      const { data: updated } = await api.put(`/grossesses/${id}`, data);
      return updated;
    }

    return updateMockDb((db) => {
      db.grossesses = db.grossesses.map((grossesse) =>
        String(grossesse.id) === String(id) ? { ...grossesse, ...data } : grossesse
      );
      return db.grossesses.find((grossesse) => String(grossesse.id) === String(id));
    });
  },

  async getBebe() {
    if (!isMockSession()) {
      const userId = getCurrentUserId();
      const { data } = await api.get('/bebes');
      const bebes = Array.isArray(data) ? data : [];
      const bebe = bebes.find((b) => String(b.maman_id) === String(userId));

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
    }

    const db = getMockDb();
    const userId = getCurrentUserId();
    const user = getMockUser();
    const bebe = db.bebes.find((item) => String(item.mamanId) === String(userId));
    return bebe ? buildBebe(bebe, user) : null;
  },

  async getCroissanceBebe() {
    const bebe = await this.getBebe();
    if (!bebe) return [];

    if (!isMockSession()) {
      return [
        { mois: 0, label: 'Naissance', poids: Math.max(2.5, bebe.poidsNaissance || 3), taille: Math.max(45, bebe.tailleNaissance || 49) },
        { mois: 3, label: '3 mois', poids: Math.max(4.5, (bebe.poidsActuel || 8) - 3), taille: Math.max(55, (bebe.tailleActuelle || 70) - 12) },
        { mois: 6, label: '6 mois', poids: Math.max(6, (bebe.poidsActuel || 8) - 1.5), taille: Math.max(62, (bebe.tailleActuelle || 70) - 7) },
        { mois: 9, label: '9 mois', poids: Math.max(7, (bebe.poidsActuel || 8) - 0.6), taille: Math.max(68, (bebe.tailleActuelle || 70) - 3) },
        { mois: 12, label: '12 mois', poids: bebe.poidsActuel || 8, taille: bebe.tailleActuelle || 70 },
      ];
    }

    const db = getMockDb();
    return (db.croissanceBebe || [])
      .filter((item) => String(item.bebeId) === String(bebe.id))
      .map((item) => ({
        mois: item.mois,
        label: item.label,
        poids: item.poids,
        taille: item.taille,
      }));
  },

  async getVaccins() {
    if (!isMockSession()) {
      const userId = getCurrentUserId();
      const [bebesRes, vaccinsRes] = await Promise.all([api.get('/bebes'), api.get('/vaccinations')]);

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
            notes: '',
            bebeNom: `Bebe #${v.bebe_id}`,
          } as Vaccin;
        });
    }

    const db = getMockDb();
    const userId = getCurrentUserId();
    const bebeIds = new Set(
      (db.bebes || []).filter((bebe) => String(bebe.mamanId) === String(userId)).map((bebe) => String(bebe.id))
    );

    return (db.vaccins || [])
      .filter((vaccin) => bebeIds.has(String(vaccin.bebeId)))
      .map((vaccin) => {
        const bebe = (db.bebes || []).find((item) => String(item.id) === String(vaccin.bebeId));
        return buildVaccin(vaccin, bebe);
      });
  },

  async getProchainVaccin() {
    const vaccins = await this.getVaccins();
    return vaccins.find((v) => v.statut === 'upcoming') || null;
  },

  async getRendezVous() {
    if (!isMockSession()) {
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
    }

    const db = getMockDb();
    const userId = getCurrentUserId();
    return (db.rendezVous || [])
      .filter((rdv) => String(rdv.mamanId) === String(userId))
      .map((rdv) => ({
        id: rdv.id,
        type: rdv.type,
        date: rdv.date,
        heure: rdv.heure,
        professionnel: rdv.professionnel,
        lieu: rdv.lieu,
        statut: rdv.statut,
        notes: rdv.notes,
      })) as RendezVous[];
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
