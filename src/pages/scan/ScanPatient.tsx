import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import jsQR from 'jsqr';
import { useAuth } from '../../context/AuthContext';
import { scanPatient } from '../../application/professionnel';

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
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanLoopRef = useRef<ReturnType<typeof globalThis.setInterval> | null>(null);
  const scanLockRef = useRef(false);

  const extractFamilyId = (result: any) =>
    String(
      result?.familleId ||
        result?.famille_uuid ||
        result?.familleUuid ||
        result?.familyId ||
        result?.family_uuid ||
        result?.uuid ||
        result?.id ||
        ''
    ).trim();

  const stopCamera = () => {
    if (scanLoopRef.current !== null) {
      globalThis.clearInterval(scanLoopRef.current);
      scanLoopRef.current = null;
    }

    const stream = streamRef.current;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setScanning(false);
    setCameraActive(false);
    setCameraReady(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const getCanvas = () => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
    }

    return canvasRef.current;
  };

  const decodeQrFromCanvas = (canvas: HTMLCanvasElement): string => {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Impossible de lire cette image.');
    }

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height);

    if (!qrCode?.data) {
      throw new Error('Aucun QR code détecté.');
    }

    return qrCode.data.trim();
  };

  const decodeQrFromImageFile = async (file: File): Promise<string> => {
    if (!file.type.startsWith('image/')) {
      throw new Error('Format de fichier non supporte. Choisissez une image.');
    }

    const bitmap = await createImageBitmap(file);
    try {
      const canvas = getCanvas();
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;

      const context = canvas.getContext('2d');
      if (!context) {
        throw new Error('Impossible de décoder cette image.');
      }

      context.drawImage(bitmap, 0, 0);
      return decodeQrFromCanvas(canvas);
    } finally {
      bitmap.close();
    }
  };

  const waitForVideoReady = (video: HTMLVideoElement) =>
    new Promise<void>((resolve, reject) => {
      const timeoutId = globalThis.setTimeout(() => {
        cleanup();
        reject(new Error('La caméra ne renvoie pas d’image.'));
      }, 5000);

      const cleanup = () => {
        globalThis.clearTimeout(timeoutId);
        video.removeEventListener('loadedmetadata', onReady);
        video.removeEventListener('canplay', onReady);
      };

      const onReady = () => {
        cleanup();
        resolve();
      };

      video.addEventListener('loadedmetadata', onReady);
      video.addEventListener('canplay', onReady);
    });

  const looksLikeBlackFrame = (video: HTMLVideoElement) => {
    const canvas = getCanvas();
    const width = 80;
    const height = 60;
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) return false;

    context.drawImage(video, 0, 0, width, height);
    const { data } = context.getImageData(0, 0, width, height);

    let brightPixels = 0;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (brightness > 20) {
        brightPixels += 1;
      }
    }

    return brightPixels < (width * height) / 20;
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
    if (scanLockRef.current) return;

    const value = code.trim();
    if (!value) return;

    scanLockRef.current = true;
    setScanning(true);
    setError('');
    setInfo('');

    try {
      const result = await scanPatient(value);
      const patientData = normalizePatient(result);
      const familyId = extractFamilyId(result);

      if (familyId) {
        navigate(`/famille/${familyId}`, { state: { scan: result, patient: patientData } });
        return;
      }

      navigate('/dashboard-pro/consultation-patient', { state: { patient: patientData } });
    } catch {
      setError('Patient non trouve. Verifiez le code QR.');
    } finally {
      setScanning(false);
      scanLockRef.current = false;
    }
  };

  const startCameraScan = async (facingMode: 'environment' | 'user' = cameraFacing) => {
    setError('');
    setInfo('');
    setCameraFacing(facingMode);

    const mediaDevices = globalThis.navigator?.mediaDevices;

    if (!mediaDevices?.getUserMedia) {
      setError('La caméra n’est pas disponible sur cet appareil.');
      return;
    }

    try {
      const videoEl = videoRef.current;
      if (!videoEl) {
        setError('Impossible d’ouvrir la caméra.');
        return;
      }

      const openStream = async (constraints: MediaStreamConstraints) =>
        mediaDevices.getUserMedia({
          ...constraints,
          audio: false,
        });

      let stream: MediaStream;
      try {
        stream = await openStream({
          video: {
            facingMode: { ideal: facingMode },
          },
        });
      } catch {
        stream = await openStream({ video: true });
      }

      streamRef.current = stream;
      setCameraActive(true);

      videoEl.srcObject = stream;
      await waitForVideoReady(videoEl);
      await videoEl.play().catch(() => {});

      if (!videoEl.videoWidth || !videoEl.videoHeight) {
        throw new Error('La caméra ne renvoie pas d’image.');
      }

      if (looksLikeBlackFrame(videoEl)) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;

        const fallbackStream = await openStream({ video: true });
        streamRef.current = fallbackStream;
        videoEl.srcObject = fallbackStream;
        await waitForVideoReady(videoEl);
        await videoEl.play().catch(() => {});

        if (!videoEl.videoWidth || !videoEl.videoHeight || looksLikeBlackFrame(videoEl)) {
          throw new Error('La caméra reste noire sur cet appareil.');
        }
      }

      setCameraReady(true);

      scanLoopRef.current = globalThis.setInterval(async () => {
        if (!videoRef.current || scanLockRef.current) return;

        try {
          const video = videoRef.current;
          if (!video.videoWidth || !video.videoHeight) return;

          const canvas = getCanvas();
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          const context = canvas.getContext('2d');
          if (!context) return;

          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const rawValue = decodeQrFromCanvas(canvas);

          if (rawValue) {
            stopCamera();
            await runScan(rawValue);
          }
        } catch {
          // On garde la caméra ouverte et on réessaie au prochain tick.
        }
      }, 700);
    } catch {
      stopCamera();
      setError('Impossible d’activer la caméra. Vérifiez les permissions ou essayez l’import d’image.');
    }
  };

  const toggleCameraFacing = async () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    stopCamera();
    setCameraFacing(nextFacing);
    await startCameraScan(nextFacing);
  };

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
              Scannez le QR de la carte avec la caméra ou importez une image QR.
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
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-black/5">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full aspect-video bg-black object-cover"
                  playsInline
                  muted
                  autoPlay
                  style={{ opacity: cameraActive ? 1 : 0, position: cameraActive ? 'relative' as const : 'absolute' as const, inset: cameraActive ? undefined : 0 }}
                />
                {cameraActive ? (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-44 h-44 border-2 border-dashed border-white/80 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.18)]" />
                  </div>
                ) : (
                <div className="aspect-video flex flex-col items-center justify-center gap-3 text-center px-4">
                  <i className="ri-camera-line text-4xl" style={{ color: 'var(--primary-teal)' }}></i>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Aucune caméra active</p>
                    <p className="text-xs text-gray-500">
                      Lancez la caméra pour scanner le QR en direct.
                    </p>
                  </div>
                </div>
                )}
              </div>
            </div>

            {cameraActive && (
              <div className="rounded-lg border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
                <div className="flex items-center gap-2">
                  <i className="ri-focus-3-line text-base"></i>
                  <span>Placez le QR au centre du cadre pour lancer le scan.</span>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={cameraActive ? toggleCameraFacing : () => startCameraScan(cameraFacing)}
                className="flex-1 h-12 rounded-lg text-white font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--primary-orange)' }}
              >
                <i className={cameraActive ? 'ri-camera-switch-line' : 'ri-camera-line'}></i>
                {cameraActive
                  ? 'Basculer caméra avant/arrière'
                  : `Caméra ${cameraFacing === 'environment' ? 'arrière' : 'avant'}`}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  setCameraReady(false);
                }}
                className="flex-1 h-12 rounded-lg border font-medium flex items-center justify-center gap-2 hover:bg-gray-50"
                style={{ borderColor: '#DDD0C8', color: 'var(--dark-brown)' }}
              >
                <i className="ri-reset-left-line"></i>
                Réinitialiser
              </button>
            </div>

            <div className="text-xs text-gray-500 flex items-center gap-2">
              <i className="ri-information-line"></i>
              {cameraReady
                ? `Caméra ${cameraFacing === 'user' ? 'avant' : 'arrière'} prête, placez le QR dans le cadre.`
                : 'Vous pouvez importer une image QR si besoin.'}
            </div>

            <label
              htmlFor="qr-upload"
              className="w-full h-12 flex items-center justify-center rounded-lg border-2 border-dashed font-medium text-sm hover:bg-gray-50 transition-colors cursor-pointer"
              style={{ borderColor: 'var(--primary-teal)', color: 'var(--primary-teal)' }}
            >
              Importer une image QR
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="qr-upload"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScanPatient;
