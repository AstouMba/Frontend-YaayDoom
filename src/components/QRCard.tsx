import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCardProps {
  userName: string;
  userId: string;
}

const CARD_WIDTH = 1400;
const CARD_HEIGHT = 850;

const escapeXml = (value: string) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const buildCardSvg = (userName: string, userId: string, qrMarkup: string) => {
  const safeName = escapeXml(userName);
  const safeId = escapeXml(userId);

  return `
  <svg xmlns="http://www.w3.org/2000/svg" width="${CARD_WIDTH}" height="${CARD_HEIGHT}" viewBox="0 0 ${CARD_WIDTH} ${CARD_HEIGHT}" fill="none">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="${CARD_WIDTH}" y2="${CARD_HEIGHT}" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#f0fbf8"/>
        <stop offset="55%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#fff4ea"/>
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="10" stdDeviation="18" flood-color="#2F8F83" flood-opacity="0.18"/>
      </filter>
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#3A2A24" flood-opacity="0.12"/>
      </filter>
    </defs>

    <rect width="${CARD_WIDTH}" height="${CARD_HEIGHT}" fill="url(#bg)"/>

    <g opacity="0.08" fill="#2F8F83">
      ${Array.from({ length: 28 }, (_, row) =>
        Array.from({ length: 58 }, (_, col) => {
          const x = 26 + col * 46;
          const y = 26 + row * 46;
          return x < CARD_WIDTH && y < CARD_HEIGHT ? `<circle cx="${x}" cy="${y}" r="1.8" />` : '';
        }).join('')
      ).join('')}
    </g>

    <rect x="55" y="55" width="${CARD_WIDTH - 110}" height="${CARD_HEIGHT - 110}" rx="42" fill="#ffffff" filter="url(#shadow)"/>

    <rect x="92" y="92" width="190" height="48" rx="24" fill="#2F8F83"/>
    <text x="123" y="124" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700">YaayDoom+</text>

    <text x="92" y="186" fill="#3A2A24" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="700">Carte Maman</text>
    <text x="92" y="224" fill="#6b7280" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="400">Présentez cette carte lors des consultations</text>

    <rect x="${CARD_WIDTH - 198}" y="92" width="90" height="90" rx="26" fill="#ffffff" stroke="rgba(47, 143, 131, 0.15)" stroke-width="2"/>
    <text x="${CARD_WIDTH - 166}" y="146" fill="#2F8F83" font-family="Segoe UI Symbol, Arial, sans-serif" font-size="34" font-weight="700">⟡</text>

    <rect x="92" y="270" width="${CARD_WIDTH - 184}" height="152" rx="28" fill="rgba(255,255,255,0.92)" stroke="rgba(47, 143, 131, 0.12)" stroke-width="2"/>
    <circle cx="154" cy="346" r="34" fill="#2F8F83"/>
    <text x="142" y="355" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700">♀</text>
    <text x="218" y="338" fill="#3A2A24" font-family="Inter, Arial, sans-serif" font-size="36" font-weight="700">${safeName}</text>
    <text x="218" y="373" fill="#6b7280" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="500">ID: ${safeId}</text>

    <rect x="445" y="455" width="510" height="310" rx="34" fill="#ffffff" filter="url(#softShadow)"/>
    <g transform="translate(555 520)">
      ${qrMarkup}
    </g>

    <rect x="92" y="634" width="310" height="68" rx="18" fill="#e9d7c6"/>
    <text x="247" y="674" fill="#3A2A24" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="600" text-anchor="middle">Scannez pour accéder au dossier</text>

    <text x="92" y="${CARD_HEIGHT - 102}" fill="#6b7280" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="600">Carte numérique sécurisée</text>
    <text x="${CARD_WIDTH - 92}" y="${CARD_HEIGHT - 102}" fill="#6b7280" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="600" text-anchor="end">${safeId}</text>

    <rect x="92" y="${CARD_HEIGHT - 78}" width="238" height="12" rx="6" fill="#2F8F83"/>
    <rect x="338" y="${CARD_HEIGHT - 78}" width="238" height="12" rx="6" fill="#E6A74A"/>
    <rect x="584" y="${CARD_HEIGHT - 78}" width="238" height="12" rx="6" fill="#E46A3C"/>
  </svg>`;
};

const downloadSvg = (svgMarkup: string, filename: string) => {
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default function QRCard({ userName, userId }: QRCardProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const getQrMarkup = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) {
      throw new Error('QR code introuvable');
    }
    return svg.outerHTML;
  };

  const handleDownload = () => {
    try {
      const markup = getQrMarkup();
      const svg = buildCardSvg(userName, userId, markup);
      downloadSvg(svg, `carte-yaaydoom-${String(userName || 'maman').toLowerCase().replace(/\s+/g, '-')}.svg`);
    } catch (error) {
      console.error(error);
      alert('Impossible de télécharger la carte pour le moment.');
    }
  };

  const handlePrint = () => {
    try {
      const markup = getQrMarkup();
      const svg = buildCardSvg(userName, userId, markup);
      const printWindow = window.open('', '_blank', 'width=1400,height=900');

      if (!printWindow) {
        throw new Error('Impossible d’ouvrir la fenêtre d’impression');
      }

      printWindow.document.write(`
        <!doctype html>
        <html>
          <head>
            <title>Carte YaayDoom+</title>
            <style>
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                background: #f3ece6;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              svg {
                width: min(95vw, 1200px);
                height: auto;
                display: block;
              }
              @media print {
                body { background: white; }
                svg { width: 100%; }
              }
            </style>
          </head>
          <body>
            ${svg}
            <script>
              const finish = () => {
                window.focus();
                window.print();
                window.onafterprint = () => window.close();
              };
              if (document.readyState === 'complete') finish();
              else window.addEventListener('load', finish, { once: true });
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error(error);
      alert('Impossible d’imprimer la carte pour le moment.');
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-teal-200 bg-white shadow-[0_24px_60px_rgba(47,143,131,0.16)]">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-orange-50 opacity-80"></div>
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #2F8F83 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm">
              <i className="ri-heart-pulse-fill text-xs"></i>
              YaayDoom+
            </div>
            <p className="mt-2 text-sm font-semibold text-[var(--dark-brown)]">Carte Maman</p>
            <p className="text-xs text-gray-500">Présentez cette carte lors des consultations</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 text-teal-600 shadow-sm border border-teal-100">
            <i className="ri-nfc-line text-2xl"></i>
          </div>
        </div>

        <div className="rounded-2xl bg-white/90 p-4 sm:p-5 border border-teal-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <i className="ri-user-heart-fill text-xl"></i>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-[var(--dark-brown)] truncate">{userName}</p>
              <p className="text-[11px] text-gray-500 font-mono truncate">ID: {userId}</p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex justify-center">
          <div className="rounded-[28px] bg-white p-4 shadow-[0_10px_30px_rgba(58,42,36,0.12)] border border-gray-100">
            <QRCodeSVG value={userId} size={190} level="M" fgColor="#111827" />
          </div>
        </div>

        <div className="mt-5 rounded-xl bg-[var(--background-soft)]/75 px-4 py-3">
          <p className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-[var(--dark-brown)]">
            <i className="ri-information-fill text-[var(--primary-teal)]"></i>
            Scannez ce code pour accéder au dossier de santé
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-gray-500">
          <span className="font-medium">Carte numérique sécurisée</span>
          <span className="font-mono">{userId}</span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
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

      <div ref={qrRef} className="hidden">
        <QRCodeSVG value={userId} size={190} level="M" fgColor="#111827" />
      </div>
    </div>
  );
}
