import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface PatientData {
  id: string;
  name: string;
  email: string;
  phone: string;
  grossesse: {
    semaineActuelle: number;
    dateAccouchementPrevue: string;
    dateDernieresRegles: string;
    statut: 'EN_ATTENTE' | 'VALIDÉ';
  };
  bebe?: {
    nom: string;
    dateNaissance: string;
    poids: string;
    taille: string;
  };
}

const ScanPatient = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simuler le scan du QR Code
  const handleScan = () => {
    setScanning(true);
    setError('');

    // Simulation d'un scan réussi après 2 secondes
    setTimeout(() => {
      // Données simulées d'une patiente - redirige vers FAM-001 (simple)
      const mockPatientData: PatientData = {
        id: 'MAM-2025-001',
        name: 'Aminata Diallo',
        email: 'maman@demo.com',
        phone: '+221 77 123 45 67',
        grossesse: {
          semaineActuelle: 26,
          dateAccouchementPrevue: '2025-06-17',
          dateDernieresRegles: '2024-09-10',
          statut: 'VALIDÉ'
        }
      };

      setPatientData(mockPatientData);
      setScanning(false);
      
      // Rediriger vers le dossier familial (FAM-001 = Simple)
      navigate('/famille/FAM-001');
    }, 2000);
  };

  // Simuler l'upload d'une image QR Code - Famille jumeaux
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScanning(true);
      setError('');

      // Simulation de lecture du QR Code - FAM-002 (jumeaux)
      setTimeout(() => {
        const mockPatientData: PatientData = {
          id: 'MAM-2025-002',
          name: 'Fatou Sall',
          email: 'fatou.sall@demo.com',
          phone: '+221 76 234 56 78',
          grossesse: {
            semaineActuelle: 10,
            dateAccouchementPrevue: '2025-10-12',
            dateDernieresRegles: '2025-01-05',
            statut: 'VALIDÉ'
          }
        };

        setPatientData(mockPatientData);
        setScanning(false);
        
        // Rediriger vers le dossier familial (FAM-002 = Jumeaux)
        navigate('/famille/FAM-002');
      }, 1500);
    }
  };

  const handleReset = () => {
    setPatientData(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-main)' }}>
      {/* Header */}
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
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/dashboard-pro"
          className="inline-flex items-center gap-2 mb-6 text-sm font-medium hover:opacity-80 transition-opacity cursor-pointer"
          style={{ color: 'var(--primary-teal)' }}
        >
          <i className="ri-arrow-left-line"></i>
          Retour au tableau de bord
        </Link>

        {/* Scanner Interface */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
              <i className="ri-qr-scan-2-line text-4xl" style={{ color: 'var(--primary-teal)' }}></i>
            </div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--dark-brown)' }}>
              Scanner une patiente
            </h1>
            <p className="text-sm text-gray-600">
              Scannez le QR Code de la carte maman pour accéder à son dossier familial
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

          {scanning ? (
            // Scanning Animation
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-lg border-4 animate-pulse" style={{ borderColor: 'var(--primary-teal)' }}></div>
                <div className="absolute inset-4 rounded-lg border-4 animate-pulse animation-delay-200" style={{ borderColor: 'var(--primary-orange)' }}></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="ri-qr-code-line text-5xl" style={{ color: 'var(--primary-teal)' }}></i>
                </div>
              </div>
              <p className="text-base font-medium" style={{ color: 'var(--dark-brown)' }}>
                Scan en cours...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Veuillez patienter
              </p>
            </div>
          ) : (
            // Scan Options
            <div className="space-y-4">
              {/* Option 1: Scan avec caméra */}
              <button
                onClick={handleScan}
                className="w-full h-24 flex flex-col items-center justify-center gap-2 rounded-lg text-white font-medium text-base hover:opacity-90 transition-opacity cursor-pointer"
                style={{ backgroundColor: 'var(--primary-teal)' }}
              >
                <i className="ri-camera-line text-3xl"></i>
                <span>Scanner avec la caméra</span>
                <span className="text-xs opacity-80">(Famille Simple)</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">ou</span>
                </div>
              </div>

              {/* Option 2: Upload image */}
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
                className="w-full h-24 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed font-medium text-base hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
              >
                <i className="ri-image-add-line text-3xl"></i>
                <span>Importer une image QR Code</span>
                <span className="text-xs opacity-80">(Famille Jumeaux)</span>
              </label>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 p-4 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
            <div className="flex items-start gap-3">
              <i className="ri-information-line text-lg flex-shrink-0" style={{ color: 'var(--primary-teal)' }}></i>
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">Comment scanner ?</p>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Demandez à la patiente de présenter sa carte maman</li>
                  <li>Cliquez sur "Scanner avec la caméra"</li>
                  <li>Pointez la caméra vers le QR Code</li>
                  <li>Le dossier familial s'affichera automatiquement</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScanPatient;
