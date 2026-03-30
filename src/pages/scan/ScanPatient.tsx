import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { scanPatient } from '../../features/professionnel/services/professionnelService';

interface PatientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  grossesse: {
    semaineActuelle: number;
    dateAccouchementPrevue: string;
    dateDernieresRegles: string;
    statut: 'EN_ATTENTE' | 'VALIDEE';
  };
  bebe?: {
    id: string;
    nom: string;
    dateNaissance: string;
    poids: string;
    taille: string;
    sexe: string;
  };
}

const ScanPatient = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [qrInput, setQrInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const decodeQrFromImageFile = async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Format de fichier non supporte. Choisissez une image.');
    }

    const BarcodeDetectorCtor = (window as any).BarcodeDetector;
    if (!BarcodeDetectorCtor) {
      throw new Error(
        'Ce navigateur ne supporte pas le decodage QR image. Utilisez Chrome/Edge ou saisissez le code manuellement.'
      );
    }

    const bitmap = await createImageBitmap(file);
    try {
      const detector = new BarcodeDetectorCtor({ formats: ['qr_code'] });
      const results = await detector.detect(bitmap);
      const qrValue = results?.[0]?.rawValue?.trim();

      if (!qrValue) {
        throw new Error('Aucun QR code detecte dans cette image.');
      }

      return qrValue;
    } finally {
      bitmap.close();
    }
  };

  const normalizePatient = (result: any): PatientData => {
    const grossesse = result?.grossesse || result;

    return {
      id: String(result?.id || `m-${grossesse?.mamanId || ''}`),
      name: result?.nomMaman || result?.nom || grossesse?.mamanNom || 'Patiente',
      email: result?.email || '-',
      phone: result?.telephone || '-',
      grossesse: {
        semaineActuelle: Number(grossesse?.semaineGrossesse || 0),
        dateAccouchementPrevue: grossesse?.datePresumeAccouchement || '',
        dateDernieresRegles: grossesse?.dateDernieresRegles || '',
        statut: grossesse?.statut === 'EN_ATTENTE' ? 'EN_ATTENTE' : 'VALIDEE',
      },
      bebe:
        result?.bebeId || result?.dateDenaissance
          ? {
              id: String(result?.bebeId || ''),
              nom: result?.nom || result?.bebeNom || 'Bebe',
              dateNaissance: result?.dateDenaissance || '',
              poids: '-',
              taille: '-',
              sexe: result?.sexe || '-',
            }
          : undefined,
    };
  };

  const runScan = async (code: string) => {
    const value = code.trim();
    if (!value) return;

    setScanning(true);
    setError('');
    setInfo('');

    try {
      const result = await scanPatient(value);
      const patientData = normalizePatient(result);
      navigate('/dashboard-pro/consultation-patient', { state: { patient: patientData } });
    } catch {
      setError('Patient non trouve. Verifiez le code QR.');
    } finally {
      setScanning(false);
    }
  };

  const handleScan = () => runScan(qrInput);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScanning(true);
    setError('');
    setInfo('');

    try {
      const decoded = await decodeQrFromImageFile(file);
      setInfo(`QR decode: ${decoded}`);
      await runScan(decoded);
    } catch (uploadError: any) {
      setError(uploadError?.message || 'Impossible de decoder le QR code depuis cette image.');
      setScanning(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-main)' }}>
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Link to="/dashboard-pro" className="flex items-center gap-2">
              <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary-teal)' }}>
                <i className="ri-heart-pulse-line text-white text-xl"></i>
              </div>
              <div>
                <span className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>YaayDoom+</span>
                <p className="text-xs" style={{ color: 'var(--primary-teal)' }}>Scanner Patient</p>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                <div className="w-7 h-7 flex items-center justify-center rounded-full" style={{ backgroundColor: 'var(--primary-teal)' }}>
                  <i className="ri-stethoscope-line text-white text-sm"></i>
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer text-sm"
                style={{ borderColor: '#EAD7C8', color: '#3A2A24' }}
              >
                <i className="ri-logout-box-line"></i>
                Deconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/dashboard-pro"
          className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
          style={{ color: 'var(--primary-teal)' }}
        >
          <i className="ri-arrow-left-line"></i>
          Retour au tableau de bord
        </Link>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
              <i className="ri-qr-scan-2-line text-4xl" style={{ color: 'var(--primary-teal)' }}></i>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--dark-brown)' }}>
              Scanner une patiente
            </h1>
            <p className="text-sm text-gray-600">
              Entrez le code QR (ex: `p-1`, `1`, nom du bebe) pour acceder au dossier
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200">
              <div className="flex items-center gap-2 text-red-800">
                <i className="ri-error-warning-line text-xl"></i>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}
          {info && (
            <div className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-800">
                <i className="ri-information-line text-xl"></i>
                <span className="font-medium">{info}</span>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              placeholder="Saisir le code QR"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <button
              onClick={handleScan}
              disabled={scanning || !qrInput.trim()}
              className="w-full h-12 rounded-lg text-white font-medium disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary-teal)' }}
            >
              {scanning ? 'Scan en cours...' : 'Scanner'}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="qr-upload"
            />
            <label
              htmlFor="qr-upload"
              className="w-full h-12 flex items-center justify-center rounded-lg border-2 border-dashed font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer"
              style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
            >
              Importer une image QR (decodage automatique)
            </label>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScanPatient;
