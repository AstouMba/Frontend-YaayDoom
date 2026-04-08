import { Link } from 'react-router-dom';
import HomeGallery from './HomeGallery';

export default function Hero() {
  return (
    <section id="accueil" className="pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Contenu texte */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg mb-4 sm:mb-6 bg-white border" style={{ borderColor: 'var(--primary-teal)' }}>
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-shield-check-line text-sm" style={{ color: 'var(--primary-teal)' }}></i>
              </div>
              <span className="text-xs font-medium" style={{ color: 'var(--primary-teal)' }}>
                Plateforme certifiée santé
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
              <span style={{ color: 'var(--dark-brown)' }}>Le suivi maternel</span>
              <br />
              <span style={{ color: 'var(--dark-brown)' }}>et infantile</span>
              <br />
              <span style={{ color: 'var(--primary-teal)' }}>digitalisé</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed mb-6 sm:mb-8" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
              Accompagnez votre grossesse et le développement de votre bébé avec une plateforme sécurisée, complète et accessible partout.
            </p>

            {/* Bouton CTA */}
            <div className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link
                to="/register"
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-sm text-white hover:opacity-90 transition-all duration-300 shadow-sm flex items-center gap-2 whitespace-nowrap"
                style={{ backgroundColor: 'var(--primary-teal)' }}
              >
                Commencer
                <i className="ri-arrow-right-line text-base"></i>
              </Link>
            </div>
          </div>

          {/* Image illustrative */}
          <div className="relative order-1 lg:order-2">
            <HomeGallery
              heroSrc="/home/maman-bebe.png"
              doctorSrc="/home/pro-bebe.png"
              pregnancySrc="/home/grossesse.png"
            />
          </div>
        </div>

        {/* Icônes décoratives */}
        <div className="mt-10 sm:mt-16 flex justify-center gap-6 sm:gap-8 flex-wrap">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center rounded-lg bg-white shadow-sm">
              <i className="ri-heart-pulse-line text-lg sm:text-xl" style={{ color: 'var(--primary-teal)' }}></i>
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--dark-brown)' }}>Suivi grossesse</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center rounded-lg bg-white shadow-sm">
              <i className="ri-baby-line text-lg sm:text-xl" style={{ color: 'var(--primary-teal)' }}></i>
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--dark-brown)' }}>Dossier bébé</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center rounded-lg bg-white shadow-sm">
              <i className="ri-syringe-line text-lg sm:text-xl" style={{ color: 'var(--primary-teal)' }}></i>
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--dark-brown)' }}>Vaccination</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center rounded-lg bg-white shadow-sm">
              <i className="ri-qr-code-line text-lg sm:text-xl" style={{ color: 'var(--primary-teal)' }}></i>
            </div>
            <span className="text-xs font-medium" style={{ color: 'var(--dark-brown)' }}>Carte QR</span>
          </div>
        </div>
      </div>
    </section>
  );
}
