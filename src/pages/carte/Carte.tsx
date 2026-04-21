import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../../context/AuthContext';
import { getBebe, getVaccins } from '../../application/maman';

export default function Carte() {
  const { user } = useAuth();
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [bebe, setBebe] = useState<any>(null);
  const [vaccinsCount, setVaccinsCount] = useState(0);
  const [consultationsCount] = useState(0);

  useEffect(() => {
    Promise.all([getBebe(), getVaccins()])
      .then(([bebeData, vaccins]) => {
        setBebe(bebeData || null);
        setVaccinsCount(Array.isArray(vaccins) ? vaccins.filter((v: any) => v.statut === 'completed').length : 0);
      })
      .catch(() => {
        setBebe(null);
        setVaccinsCount(0);
      });
  }, []);

  const carteData = useMemo(() => {
    const rawDate = bebe?.dateNaissance || '';
    const formattedDate = rawDate
      ? new Date(rawDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })
      : '-';

    const numeroCarnet = user?.id
      ? `YD-${String(user.id).replace(/-/g, '').slice(0, 8).toUpperCase()}`
      : 'YD-000000';
    const qrCodeData = user?.id || `${numeroCarnet}-${(bebe?.nom || 'BEBE').toUpperCase()}`;

    return {
      nomMaman: user?.name || 'Maman',
      nomBebe: bebe?.nom || 'Bebe',
      dateNaissance: formattedDate,
      sexe: bebe?.sexe || '-',
      groupeSanguin: '-',
      numeroCarnet,
      centreNaissance: 'Centre de sante',
      qrCodeData,
      dateCreation: new Date().toLocaleDateString('fr-FR'),
      lieuCreation: 'Dakar',
    };
  }, [bebe, user]);

  const handleDownloadPDF = () => {
    alert('Téléchargement du PDF en cours...');
  };

  const handleDownloadImage = () => {
    alert('Téléchargement de l\'image en cours...');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Carte de santé - YaayDoom+',
        text: `Carte de santé de ${carteData.nomBebe}`,
        url: window.location.href
      });
    } else {
      alert('Partage non disponible sur ce navigateur');
    }
  };

  return (
    <div className="p-6 max-w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Carte Numérique de Santé
            </h1>
            <p className="text-sm text-gray-500 mt-1">Document officiel de santé - République du Sénégal</p>
          </div>
          <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={handleShare}
              className="h-10 px-3 sm:px-5 border-2 border-teal-600 rounded-lg font-semibold text-sm text-teal-600 hover:bg-teal-50 flex items-center justify-center gap-2 cursor-pointer transition-colors flex-1 sm:flex-none"
            >
              <i className="ri-share-line text-base"></i>
              <span className="hidden sm:inline">Partager</span>
            </button>
            <button
              onClick={() => setShowDownloadOptions(!showDownloadOptions)}
              className="h-10 px-3 sm:px-5 text-white bg-orange-500 rounded-lg font-semibold text-sm hover:bg-orange-600 flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-md flex-1 sm:flex-none"
            >
              <i className="ri-download-line text-base"></i>
              <span className="hidden sm:inline">Télécharger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Download Options Dropdown */}
      {showDownloadOptions && (
        <div className="relative mb-6">
          <div className="absolute right-0 top-0 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-10 w-64">
            <button
              onClick={handleDownloadPDF}
              className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 cursor-pointer"
            >
              <i className="ri-file-pdf-line text-lg text-orange-500"></i>
              <div>
                <p className="font-semibold text-sm text-gray-800">Format PDF</p>
                <p className="text-xs text-gray-500">Idéal pour l'impression</p>
              </div>
            </button>
            <button
              onClick={handleDownloadImage}
              className="w-full px-5 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 border-t border-gray-100 cursor-pointer"
            >
              <i className="ri-image-line text-lg text-teal-600"></i>
              <div>
                <p className="font-semibold text-sm text-gray-800">Format Image</p>
                <p className="text-xs text-gray-500">PNG haute qualité</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* ID Card Display - Wider format */}
      <div className="flex flex-col items-center mb-8">
        {/* Senegal Style ID Card - Full width, wider */}
        <div className="relative w-full max-w-2xl aspect-[1.7/1] rounded-xl overflow-hidden shadow-2xl">
          {/* Card Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
          
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          {/* Card Content */}
          <div className="relative h-full p-5 flex flex-col">
            {/* Top Flag Strip */}
            <div className="flex gap-1 mb-4">
              <div className="flex-1 h-1.5 bg-green-600 rounded-full"></div>
              <div className="flex-1 h-1.5 bg-yellow-500 rounded-full"></div>
              <div className="flex-1 h-1.5 bg-red-600 rounded-full"></div>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-[9px] text-yellow-400 uppercase tracking-wider font-semibold">République du Sénégal</p>
                <p className="text-[11px] text-white/80">Ministère de la Santé et de l'Action Sociale</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                <i className="ri-heart-pulse-fill text-yellow-400 text-2xl"></i>
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-4">
              <h2 className="text-yellow-400 font-bold text-base tracking-wider">CARTE DE SANTÉ NUMÉRIQUE</h2>
              <p className="text-white/60 text-[9px]">N° {carteData.numeroCarnet}</p>
            </div>

            {/* Main Content - Photo & Info */}
            <div className="flex-1 flex flex-col sm:flex-row gap-3 sm:gap-5">
              {/* Photo placeholder */}
              <div className="w-20 sm:w-28 h-24 sm:h-32 bg-white/10 rounded-lg flex flex-col items-center justify-center border border-white/20">
                <i className="ri-baby-line text-4xl text-white/60 mb-2"></i>
                <p className="text-[8px] text-white/50">Photo</p>
              </div>

              {/* Info */}
              <div className="flex-1 space-y-2">
                <div>
                  <p className="text-[8px] text-white/60 uppercase">Nom complet</p>
                  <p className="text-white font-bold text-base leading-tight">{carteData.nomBebe}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[8px] text-white/60 uppercase">Date de naissance</p>
                    <p className="text-white text-sm">{carteData.dateNaissance}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-white/60 uppercase">Sexe</p>
                    <p className="text-white text-sm">{carteData.sexe}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[8px] text-white/60 uppercase">Groupe sanguin</p>
                    <p className="text-yellow-400 font-bold text-sm">{carteData.groupeSanguin}</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-white/60 uppercase">Mère</p>
                    <p className="text-white text-xs truncate">{carteData.nomMaman}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
              <div className="flex-1">
                <p className="text-[8px] text-white/60 mb-1">Scannez pour vérifier l'authenticité</p>
                <div className="flex items-center gap-3">
                  <div className="bg-white p-1 rounded">
                    <QRCodeSVG
                      value={carteData.qrCodeData}
                      size={40}
                      level="L"
                      fgColor="#1e293b"
                    />
                  </div>
                  <p className="text-[7px] text-white/50 font-mono">{carteData.qrCodeData}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[7px] text-white/60">Date de création</p>
                <p className="text-white text-[10px]">{carteData.dateCreation}</p>
              </div>
            </div>

            {/* Bottom Flag */}
            <div className="flex gap-1 mt-3">
              <div className="flex-1 h-1 bg-green-600 rounded-full"></div>
              <div className="flex-1 h-1 bg-yellow-500 rounded-full"></div>
              <div className="flex-1 h-1 bg-red-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-5 rounded-xl bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="ri-information-line text-xl text-blue-600"></i>
          </div>
          <div>
            <h3 className="font-bold text-blue-900 mb-2">
              Comment utiliser votre carte numérique ?
            </h3>
            <p className="text-sm text-blue-800">
              Présentez le QR Code lors de vos consultations médicales. Les professionnels de santé pourront scanner le code pour accéder instantanément au dossier médical complet de votre enfant.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <i className="ri-syringe-line text-teal-600 text-xl"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">Vaccins à jour</p>
              <p className="text-2xl font-bold text-gray-800">{vaccinsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <i className="ri-stethoscope-line text-orange-600 text-xl"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">Consultations</p>
              <p className="text-2xl font-bold text-gray-800">{consultationsCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <i className="ri-heart-pulse-line text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-xs text-gray-500">État de santé</p>
              <p className="text-2xl font-bold text-green-600">Excellent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
          <i className="ri-question-line text-teal-600"></i>
          Comment utiliser cette carte ?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="text-center p-4">
            <div className="w-14 h-14 mx-auto mb-3 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-teal-600">1</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Téléchargez
            </h4>
            <p className="text-sm text-gray-500">
              Téléchargez la carte en PDF ou image pour l'avoir toujours avec vous
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-14 h-14 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-500">2</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Présentez
            </h4>
            <p className="text-sm text-gray-500">
              Montrez le QR Code lors de vos consultations médicales
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-14 h-14 mx-auto mb-3 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-teal-600">3</span>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Accès instantané
            </h4>
            <p className="text-sm text-gray-500">
              Le professionnel accède immédiatement au dossier médical complet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
