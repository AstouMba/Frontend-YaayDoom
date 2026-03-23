import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{ color: 'var(--dark-brown)' }}>
          Prête à commencer votre suivi ?
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
          Rejoignez des milliers de mamans qui font confiance à YaayDoom+
        </p>

        {/* Bouton CTA */}
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm text-white hover:opacity-90 transition-all duration-300 shadow-sm whitespace-nowrap"
          style={{ backgroundColor: 'var(--primary-teal)' }}
        >
          Créer mon compte
          <i className="ri-arrow-right-line text-base"></i>
        </Link>

        {/* Texte sous le bouton */}
        <div className="mt-6 flex items-center justify-center gap-6 text-xs" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
          <div className="flex items-center gap-2">
            <i className="ri-check-line text-sm" style={{ color: 'var(--primary-teal)' }}></i>
            <span>Gratuit</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-shield-check-line text-sm" style={{ color: 'var(--primary-teal)' }}></i>
            <span>Sécurisé</span>
          </div>
          <div className="flex items-center gap-2">
            <i className="ri-award-line text-sm" style={{ color: 'var(--primary-teal)' }}></i>
            <span>Certifié</span>
          </div>
        </div>
      </div>
    </section>
  );
}