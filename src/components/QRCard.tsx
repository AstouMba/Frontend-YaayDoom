import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCardProps {
  userName: string;
  userId: string;
}

export default function QRCard({ userName, userId }: QRCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    // Logique de téléchargement PDF à implémenter avec l'API
    console.log('Télécharger PDF');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 border-2 border-[var(--primary-teal)]">
      <div ref={cardRef} className="text-center">
        {/* En-tête de la carte */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[var(--dark-brown)] mb-1">
            YaayDoom+
          </h2>
          <p className="text-base text-[var(--primary-teal)] font-semibold">
            Carte Maman
          </p>
        </div>

        {/* Informations maman */}
        <div className="mb-6 bg-gray-50 rounded-lg p-5">
          <div className="flex items-center justify-center gap-3 mb-2">
            <i className="ri-user-heart-fill text-3xl text-[var(--primary-teal)]"></i>
            <h3 className="text-xl font-bold text-[var(--dark-brown)]">
              {userName}
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            ID: <span className="font-mono font-semibold">{userId}</span>
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <QRCodeSVG value={userId} size={180} level="M" fgColor="#1e293b" />
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[var(--background-soft)] rounded-lg p-4 mb-6">
          <p className="text-sm text-[var(--dark-brown)] flex items-center justify-center gap-2">
            <i className="ri-information-fill text-[var(--primary-teal)]"></i>
            Présentez ce code lors de vos consultations
          </p>
        </div>
      </div>

      {/* Boutons d'action */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={handleDownloadPDF}
          className="h-12 bg-[var(--primary-orange)] hover:shadow-md text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer"
        >
          <i className="ri-download-2-fill text-lg"></i>
          Télécharger
        </button>
        <button
          onClick={handlePrint}
          className="h-12 bg-[var(--primary-teal)] hover:shadow-md text-white rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap cursor-pointer"
        >
          <i className="ri-printer-fill text-lg"></i>
          Imprimer
        </button>
      </div>
    </div>
  );
}
