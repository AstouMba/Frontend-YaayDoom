import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getConsultations, getGrossesses, getVaccinationsByPatient } from '../../application/professionnel';
import { getFamille } from '../../application/professionnel/getFamille';
import FamilyOverview, { type DossierFamilial as FamilyOverviewDossier, type MembreFamilial } from './FamilyOverview';
import type {
  Consultation,
  FamilyDossier,
  GrossesseProfessionnelle,
  Vaccination,
} from '../../domain/professionnel/types';

type ScanLocationState = {
  scan?: Record<string, any>;
  family?: FamilyDossier | Record<string, any>;
  patient?: Record<string, any>;
};

const familyMemberId = (value: unknown) => String(value || '').trim();

const extractFamilyId = (payload: Record<string, any> | null | undefined, fallback = '') => {
  const id = payload?.familleId || payload?.famille_uuid || payload?.familleUuid || payload?.familyId || payload?.family_uuid || payload?.uuid || payload?.id;
  return familyMemberId(id || fallback);
};

const mapFamilyMember = (member: Record<string, any>, type: 'maman' | 'bebe'): MembreFamilial => ({
  id: familyMemberId(member.id || member.uuid || member.maman_id || member.bebe_id),
  nom: member.nom || member.name || member.maman_nom || member.bebe_nom || member.prenom || 'Inconnu',
  type,
  age: member.age || member.age_actuel || undefined,
  lien: member.lien || member.relationship || undefined,
});

const mapConsultation = (consultation: Record<string, any>): Consultation => ({
  id: String(consultation.id),
  patientName: consultation.patient_name || consultation.maman_nom || consultation.nom || `Maman #${consultation.maman_id}`,
  patientId: `MAM-${consultation.maman_id || consultation.patient_id || ''}`,
  type: consultation.type || consultation.motif || 'Consultation',
  date: consultation.date || consultation.created_at || '',
  tensionArterielle: consultation.tension_arterielle || consultation.tension || '-',
  poids: consultation.poids || '-',
  notes: consultation.notes || '',
  semaineGrossesse: consultation.semaineGrossesse || consultation.semaine_grossesse || 0,
  mamanId: String(consultation.maman_id || consultation.patient_id || ''),
  professionnelId: String(consultation.professionnel_id || ''),
  heure: consultation.heure || '09:00:00',
});

const mapVaccination = (vaccination: Record<string, any>, bebe?: Record<string, any>): Vaccination => ({
  id: String(vaccination.id),
  patientName: bebe ? bebe.maman_nom || `Maman #${bebe.maman_id}` : '-',
  patientId: bebe ? `MAM-${bebe.maman_id}` : '-',
  bebeNom: bebe?.nom || bebe?.name || `Bebe #${vaccination.bebe_id}`,
  bebeId: String(vaccination.bebe_id || bebe?.id || ''),
  bebeAge: bebe?.age_actuel || bebe?.age || '-',
  vaccin: vaccination.nom_vaccin || vaccination.nom || vaccination.vaccin || 'Vaccin',
  dateAdministration: vaccination.date_vaccination || vaccination.prochaine_dose || '',
  statut: vaccination.date_vaccination ? 'ADMINISTRE' : 'A_VENIR',
  prochainRappel: vaccination.prochaine_dose || undefined,
  notes: vaccination.notes || '',
  raw: vaccination,
});

const normalizeFamily = (payload: Record<string, any> | null | undefined, fallbackId: string): FamilyDossier => {
  const raw = payload?.data || payload?.family || payload || {};
  const bebes = Array.isArray(raw.bebes) ? raw.bebes : Array.isArray(raw.enfants) ? raw.enfants : [];
  const grossesses = Array.isArray(raw.grossesses) ? raw.grossesses : raw.grossesse ? [raw.grossesse] : [];
  const consultations = Array.isArray(raw.consultations) ? raw.consultations : [];
  const vaccinations = Array.isArray(raw.vaccinations) ? raw.vaccinations : [];

  return {
    id: extractFamilyId(raw, fallbackId),
    maman: raw.maman || raw.mere || raw.mother || null,
    bebes,
    grossesses,
    consultations,
    vaccinations,
    membres: Array.isArray(raw.membres)
      ? raw.membres
      : [
          ...(raw.maman || raw.mere || raw.mother ? [mapFamilyMember(raw.maman || raw.mere || raw.mother, 'maman')] : []),
          ...bebes.map((bebe: Record<string, any>) => mapFamilyMember(bebe, 'bebe')),
        ],
    estGemellaire: Boolean(raw.estGemellaire ?? raw.est_gemellaire ?? bebes.length > 1),
    raw,
  };
};

const buildConsultationPayload = (
  family: FamilyDossier,
  selectedMember?: { id: string; nom: string; type: 'maman' | 'bebe'; lien?: string } | null
) => {
  const maman = family.maman || family.raw?.maman || family.raw?.mere || family.raw?.mother || {};
  const bebe =
    selectedMember?.type === 'bebe'
      ? family.bebes.find((item) => familyMemberId(item.id || item.uuid || item.bebe_id) === selectedMember.id)
      : family.bebes[0];
  const grossesse = family.grossesses[0] || family.raw?.grossesse || {};

  return {
    id: family.id,
    name: maman.nom || maman.name || selectedMember?.nom || 'Patiente',
    email: maman.email || '-',
    phone: maman.telephone || maman.phone || '-',
    grossesse: {
      semaineActuelle: Number(grossesse.semaineGrossesse || grossesse.semaine_grossesse || 0),
      dateAccouchementPrevue: grossesse.datePresumeAccouchement || grossesse.date_fin_prevue || '',
      dateDernieresRegles: grossesse.dateDernieresRegles || grossesse.date_debut || '',
      statut: grossesse.statut === 'EN_ATTENTE' ? 'EN_ATTENTE' : 'VALIDEE',
    },
    bebe: bebe
      ? {
          id: String(bebe.id || bebe.bebe_id || ''),
          nom: bebe.nom || bebe.name || 'Bebe',
          dateNaissance: bebe.date_naissance || bebe.dateNaissance || '',
          poids: String(bebe.poids || bebe.poids_actuel || '-'),
          taille: String(bebe.taille || bebe.taille_actuelle || '-'),
          sexe: bebe.sexe || '-',
        }
      : undefined,
  };
};

const DossierFamilial = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = (location.state || {}) as ScanLocationState;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [family, setFamily] = useState<FamilyDossier | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [grossesses, setGrossesses] = useState<GrossesseProfessionnelle[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!id) {
        setError('Identifiant de dossier manquant.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fromState = locationState.family ? normalizeFamily(locationState.family, id) : null;
        const resolvedFamily = fromState || (await getFamille(id));
        setFamily(resolvedFamily);

        const mamanId =
          String(resolvedFamily.maman?.id || resolvedFamily.raw?.maman?.id || resolvedFamily.raw?.maman_id || resolvedFamily.raw?.mother?.id || '').trim() || '';
        const bebeId =
          String(resolvedFamily.bebes[0]?.id || resolvedFamily.raw?.bebe?.id || resolvedFamily.raw?.bebe_id || '').trim() || '';

        const [allGrossesses, allConsultations, patientVaccinations] = await Promise.all([
          getGrossesses().catch(() => []),
          mamanId ? getConsultations(mamanId).catch(() => []) : Promise.resolve([]),
          bebeId ? getVaccinationsByPatient(bebeId).catch(() => []) : Promise.resolve([]),
        ]);

        setGrossesses(allGrossesses);
        setConsultations(
          Array.isArray(resolvedFamily.consultations) && resolvedFamily.consultations.length > 0
            ? resolvedFamily.consultations.map(mapConsultation)
            : allConsultations
        );
        setVaccinations(
          Array.isArray(resolvedFamily.vaccinations) && resolvedFamily.vaccinations.length > 0
            ? resolvedFamily.vaccinations.map((vaccination: Record<string, any>) => mapVaccination(vaccination))
            : patientVaccinations
        );

        const firstMember = resolvedFamily.membres?.[0] || null;
        setSelectedMemberId(firstMember?.id || null);
      } catch (err: any) {
        try {
          const scanSnapshot = locationState.scan;
          if (!scanSnapshot) {
            throw err;
          }

          const fallbackFamily = normalizeFamily(
            {
              maman: {
                id: scanSnapshot.mamanId,
                nom: scanSnapshot.nomMaman || scanSnapshot.nom,
                telephone: scanSnapshot.telephone,
                email: scanSnapshot.email,
              },
              bebes: scanSnapshot.bebe ? [scanSnapshot.bebe] : [],
              grossesse: scanSnapshot.grossesse,
              consultations: [],
              vaccinations: [],
            },
            scanSnapshot.familleId || scanSnapshot.familleUuid || id
          );
          setFamily(fallbackFamily);
          setGrossesses([]);
          setConsultations([]);
          setVaccinations([]);
          setSelectedMemberId(fallbackFamily.membres?.[0]?.id || null);
        } catch {
          setError(err?.message || 'Impossible de charger le dossier familial.');
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, locationState.family]);

  const selectedMember = useMemo(
    () => family?.membres?.find((member) => member.id === selectedMemberId) || family?.membres?.[0] || null,
    [family, selectedMemberId]
  );

  const selectedFamilyMember = useMemo(() => {
    if (!family) return null;
    if (!selectedMember) return null;
    return selectedMember.type === 'maman'
      ? family.maman || family.raw?.maman || family.raw?.mere || family.raw?.mother || null
      : family.bebes.find((item) => familyMemberId(item.id || item.uuid || item.bebe_id) === selectedMember.id) || null;
  }, [family, selectedMember]);

  const activesPatientes = family?.membres?.length || 0;
  const activeGrossesse = family?.grossesses?.[0] || grossesses.find((item) => String(item.mamanId) === String(family?.maman?.id || family?.raw?.maman_id || ''));
  const familyOverview: FamilyOverviewDossier = {
    estGemellaire: Boolean(family?.estGemellaire),
    membres:
      family?.membres?.map((member) => ({
        id: member.id,
        nom: member.nom,
        type: member.type,
        age: typeof member.age === 'number' ? member.age : undefined,
        lien: member.lien,
      })) || [],
  };

  const goToConsultation = () => {
    if (!family) return;
    navigate('/dashboard-pro/consultation-patient', {
      state: { patient: buildConsultationPayload(family, selectedMember) },
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-white p-8 text-center border border-gray-100">
          Chargement du dossier familial...
        </div>
      </div>
    );
  }

  if (error || !family) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-white p-8 border border-red-200">
          <p className="font-semibold text-red-600 mb-2">Dossier introuvable</p>
          <p className="text-sm text-gray-600">{error || 'Aucune donnée n’a été retournée par le backend.'}</p>
          <button
            onClick={() => navigate('/dashboard-pro/scan')}
            className="mt-4 px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: 'var(--primary-teal)' }}
          >
            Revenir au scan
          </button>
        </div>
      </div>
    );
  }

  const motherName = (family.maman?.nom || family.raw?.maman?.nom || family.raw?.mere?.nom || selectedMember?.nom || 'la patiente') as string;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <nav className="flex items-center gap-1.5 text-sm flex-wrap">
        <Link to="/dashboard-pro" className="text-gray-500 hover:text-gray-700 transition-colors">
          Tableau de bord
        </Link>
        <i className="ri-arrow-right-s-line text-gray-400"></i>
        <Link to="/dashboard-pro/scan" className="text-gray-500 hover:text-gray-700 transition-colors">
          Scanner patient
        </Link>
        <i className="ri-arrow-right-s-line text-gray-400"></i>
        <span className="font-medium" style={{ color: 'var(--primary-teal)' }}>
          Dossier familial
        </span>
      </nav>

      <div className="rounded-xl p-5" style={{ backgroundColor: '#E6F5F3', border: '1px solid #C2E8E2' }}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-wide" style={{ color: 'var(--primary-teal)' }}>
              Dossier backend
            </p>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--dark-brown)' }}>
              Famille de {motherName}
            </h1>
            <p className="text-sm text-gray-600">
              {activesPatientes} membre{activesPatientes > 1 ? 's' : ''} • {consultations.length} consultation{consultations.length > 1 ? 's' : ''} • {vaccinations.length} vaccin{vaccinations.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={goToConsultation}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--primary-teal)' }}
            >
              Créer une consultation
            </button>
            <button
              onClick={() => navigate('/dashboard-pro/scan')}
              className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-white transition-colors"
              style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
            >
              Nouveau scan
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-2">Patiente</p>
          <p className="font-bold text-lg" style={{ color: 'var(--dark-brown)' }}>{motherName}</p>
          <p className="text-sm text-gray-600">ID famille: {family.id}</p>
          <p className="text-sm text-gray-600">Téléphone: {family.maman?.telephone || family.raw?.maman?.telephone || '-'}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-2">Grossesse</p>
          <p className="font-bold text-lg" style={{ color: 'var(--dark-brown)' }}>
            {activeGrossesse?.statut || family.raw?.grossesse?.statut || 'EN_ATTENTE'}
          </p>
          <p className="text-sm text-gray-600">Semaine: {activeGrossesse?.semaineGrossesse ?? family.raw?.grossesse?.semaineGrossesse ?? '-'}</p>
          <p className="text-sm text-gray-600">DPA: {activeGrossesse?.datePresumeAccouchement || family.raw?.grossesse?.datePresumeAccouchement || '-'}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-2">Patient sélectionné</p>
          <p className="font-bold text-lg" style={{ color: 'var(--dark-brown)' }}>{selectedMember?.nom || '-'}</p>
          <p className="text-sm text-gray-600">Type: {selectedMember?.type || '-'}</p>
          <p className="text-sm text-gray-600">Lien: {selectedMember?.lien || '-'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold mb-4" style={{ color: 'var(--dark-brown)' }}>
            Membres
          </h2>
          <FamilyOverview
            dossier={familyOverview}
            onSelectMember={(member) => setSelectedMemberId(member.id)}
          />
        </section>

        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold mb-4" style={{ color: 'var(--dark-brown)' }}>
            Détail du membre
          </h2>
          {selectedFamilyMember ? (
            <div className="space-y-3">
              <div className="rounded-lg border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Nom</p>
                <p className="font-semibold" style={{ color: 'var(--dark-brown)' }}>{selectedMember?.nom || '-'}</p>
              </div>
              {selectedMember?.type === 'maman' ? (
                <>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="font-semibold" style={{ color: 'var(--dark-brown)' }}>
                      {family.maman?.telephone || family.raw?.maman?.telephone || '-'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Grossesse active</p>
                    <p className="font-semibold" style={{ color: 'var(--dark-brown)' }}>
                      {activeGrossesse?.statut || 'EN_ATTENTE'}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Date de naissance</p>
                    <p className="font-semibold" style={{ color: 'var(--dark-brown)' }}>
                      {selectedFamilyMember?.date_naissance || selectedFamilyMember?.dateNaissance || '-'}
                    </p>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <p className="text-sm text-gray-500">Sexe</p>
                    <p className="font-semibold" style={{ color: 'var(--dark-brown)' }}>
                      {selectedFamilyMember?.sexe || '-'}
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun membre sélectionné.</p>
          )}
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold mb-4" style={{ color: 'var(--dark-brown)' }}>
            Consultations
          </h2>
          <div className="space-y-3">
            {consultations.map((consultation) => (
              <div key={consultation.id} className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold" style={{ color: 'var(--dark-brown)' }}>{consultation.type}</p>
                  <p className="text-xs text-gray-500">{consultation.date}</p>
                </div>
                <p className="text-sm text-gray-600 mt-1">{consultation.notes || 'Aucune note'}</p>
              </div>
            ))}
            {consultations.length === 0 && <p className="text-sm text-gray-500">Aucune consultation trouvée.</p>}
          </div>
        </section>

        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold mb-4" style={{ color: 'var(--dark-brown)' }}>
            Vaccinations
          </h2>
          <div className="space-y-3">
            {vaccinations.map((vaccination) => (
              <div key={vaccination.id} className="p-4 rounded-lg border border-gray-200">
                <p className="font-semibold" style={{ color: 'var(--dark-brown)' }}>{vaccination.vaccin}</p>
                <p className="text-sm text-gray-600">
                  {vaccination.statut === 'ADMINISTRE'
                    ? `Administré le ${vaccination.dateAdministration}`
                    : `Prévu le ${vaccination.dateAdministration || vaccination.prochainRappel || '-'}`}
                </p>
                <p className="text-xs mt-2 uppercase tracking-wide" style={{ color: 'var(--primary-teal)' }}>
                  {vaccination.statut}
                </p>
              </div>
            ))}
            {vaccinations.length === 0 && <p className="text-sm text-gray-500">Aucune vaccination trouvée.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DossierFamilial;
