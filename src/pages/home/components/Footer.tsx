import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="py-12 px-6" style={{ backgroundColor: 'var(--background-soft)' }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo et description */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary-teal)' }}>
                <i className="ri-heart-pulse-line text-white text-base"></i>
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--dark-brown)' }}>
                YaayDoom<span style={{ color: 'var(--primary-teal)' }}>+</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
              Plateforme numérique de suivi maternel et infantile
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--dark-brown)' }}>
              Liens rapides
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('accueil');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--dark-brown)', opacity: 0.7 }}
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('a-propos');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--dark-brown)', opacity: 0.7 }}
                >
                  À propos
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const element = document.getElementById('faq');
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--dark-brown)', opacity: 0.7 }}
                >
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-3" style={{ color: 'var(--dark-brown)' }}>
              Contact
            </h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <i className="ri-mail-line text-sm" style={{ color: 'var(--primary-teal)' }}></i>
                <span className="text-xs" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
                  contact@yaaydoom.com
                </span>
              </li>
              <li className="flex items-center gap-2">
                <i className="ri-phone-line text-sm" style={{ color: 'var(--primary-teal)' }}></i>
                <span className="text-xs" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
                  +221 XX XXX XX XX
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t" style={{ borderColor: 'var(--dark-brown)', opacity: 0.1 }}>
          <p className="text-center text-xs" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
            © 2024 YaayDoom+. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}