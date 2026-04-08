import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPatients, getConsultations, getGrossesses, getVaccinationsByPatient, scanPatient } from '../../application/professionnel';
import type {
  Consultation,
  GrossesseProfessionnelle,
  Patient,
  PatientScanResult,
  Vaccination,
} from '../../domain/professionnel/types';

const DossierFamilial = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patient, setPatient] = useState<PatientScanResult | null>(null);
  const [siblings, setSiblings] = useState<Patient[]>([]);
  const [grossesse, setGrossesse] = useState<GrossesseProfessionnelle | null>(null);
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
        const resolved = await scanPatient(id);
        setPatient(resolved);

        const [allPatients, allGrossesses, allConsultations, patientVaccinations] = await Promise.all([
          getPatients(),
          getGrossesses(),
          getConsultations(resolved.mamanId),
          getVaccinationsByPatient(resolved.bebeId || resolved.id),
        ]);

        setSiblings(allPatients.filter((item) => item.mamanId === resolved.mamanId));
        setGrossesse(
          allGrossesses.find(
            (item) => item.mamanId === resolved.mamanId || String(item.rawId || item.id).replace('g-', '') === String(resolved.grossesse?.rawId || resolved.grossesse?.id || '')
          ) || resolved.grossesse || null
        );
        setConsultations(allConsultations);
        setVaccinations(patientVaccinations);
      } catch (err: any) {
        setError(err?.message || 'Impossible de charger le dossier familial.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const activePatient = useMemo(() => patient, [patient]);
  const motherName = activePatient?.grossesse?.mamanNom || activePatient?.nomMaman || 'la patiente';

  if (loading) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-white p-8 text-center border border-gray-100">
          Chargement du dossier familial...
        </div>
      </div>
    );
  }

  if (error || !activePatient) {
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

  const bebeCount = siblings.length;

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
              {bebeCount} enfant{bebeCount > 1 ? 's' : ''} • {consultations.length} consultation{consultations.length > 1 ? 's' : ''} • {vaccinations.length} vaccin{vaccinations.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={() => navigate('/dashboard-pro/scan')}
            className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-white transition-colors"
            style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
          >
            Nouveau scan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-2">Patiente</p>
          <p className="font-bold text-lg" style={{ color: 'var(--dark-brown)' }}>{motherName}</p>
          <p className="text-sm text-gray-600">ID maman: {activePatient.mamanId}</p>
          <p className="text-sm text-gray-600">Téléphone: {activePatient.telephone || '-'}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-2">Grossesse</p>
          <p className="font-bold text-lg" style={{ color: 'var(--dark-brown)' }}>
            {grossesse?.statut || activePatient.grossesse?.statut || 'EN_ATTENTE'}
          </p>
          <p className="text-sm text-gray-600">Semaine: {grossesse?.semaineGrossesse ?? activePatient.grossesse?.semaineGrossesse ?? '-'}</p>
          <p className="text-sm text-gray-600">DPA: {grossesse?.datePresumeAccouchement || activePatient.grossesse?.datePresumeAccouchement || '-'}</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 mb-2">Patient scanné</p>
          <p className="font-bold text-lg" style={{ color: 'var(--dark-brown)' }}>{activePatient.nom}</p>
          <p className="text-sm text-gray-600">ID bébé: {activePatient.bebeId || '-'}</p>
          <p className="text-sm text-gray-600">Sexe: {activePatient.sexe || '-'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold mb-4" style={{ color: 'var(--dark-brown)' }}>
            Enfants
          </h2>
          <div className="space-y-3">
            {siblings.map((child) => (
              <div key={child.id} className="p-4 rounded-lg border border-gray-200">
                <p className="font-semibold" style={{ color: 'var(--dark-brown)' }}>{child.nom}</p>
                <p className="text-sm text-gray-600">ID: {child.id}</p>
                <p className="text-sm text-gray-600">Né(e) le: {child.dateDenaissance || '-'}</p>
              </div>
            ))}
            {siblings.length === 0 && <p className="text-sm text-gray-500">Aucun enfant trouvé dans le backend.</p>}
          </div>
        </section>

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
      </div>

      <section className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <h2 className="font-bold mb-4" style={{ color: 'var(--dark-brown)' }}>
          Vaccinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {vaccinations.map((vaccination) => (
            <div key={vaccination.id} className="p-4 rounded-lg border border-gray-200">
              <p className="font-semibold" style={{ color: 'var(--dark-brown)' }}>{vaccination.nom}</p>
              <p className="text-sm text-gray-600">{vaccination.dateAdministre ? `Administré le ${vaccination.dateAdministre}` : `Prévu le ${vaccination.datePrevu}`}</p>
              <p className="text-xs mt-2 uppercase tracking-wide" style={{ color: 'var(--primary-teal)' }}>
                {vaccination.statut}
              </p>
            </div>
          ))}
          {vaccinations.length === 0 && <p className="text-sm text-gray-500">Aucune vaccination trouvée.</p>}
        </div>
      </section>
    </div>
  );
};

export default DossierFamilial;
