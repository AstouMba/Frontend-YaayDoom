import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--primary-teal)' }}>
              <i className="ri-heart-pulse-line text-white text-base sm:text-lg"></i>
            </div>
            <span className="text-lg sm:text-xl font-bold" style={{ color: 'var(--dark-brown)' }}>
              YaayDoom<span style={{ color: 'var(--primary-teal)' }}>+</span>
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => scrollToSection('accueil')}
              className="text-sm font-medium transition-colors duration-300 hover:opacity-70"
              style={{ color: 'var(--dark-brown)' }}
            >
              Accueil
            </button>
            <button
              onClick={() => scrollToSection('a-propos')}
              className="text-sm font-medium transition-colors duration-300 hover:opacity-70"
              style={{ color: 'var(--dark-brown)' }}
            >
              À propos
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="text-sm font-medium transition-colors duration-300 hover:opacity-70"
              style={{ color: 'var(--dark-brown)' }}
            >
              FAQ
            </button>
            <Link
              to="/login"
              className="px-4 sm:px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-300 hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: 'var(--primary-teal)' }}
            >
              Se connecter
            </Link>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`} style={{ color: 'var(--dark-brown)' }}></i>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t -mx-4 sm:-mx-6 px-4 sm:px-6 bg-white" style={{ borderColor: 'var(--dark-brown)', opacity: 0.2 }}>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => scrollToSection('accueil')}
                className="text-base font-medium text-left py-3 px-4 rounded-lg hover:bg-gray-100"
                style={{ color: 'var(--dark-brown)' }}
              >
                Accueil
              </button>
              <button
                onClick={() => scrollToSection('a-propos')}
                className="text-base font-medium text-left py-3 px-4 rounded-lg hover:bg-gray-100"
                style={{ color: 'var(--dark-brown)' }}
              >
                À propos
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-base font-medium text-left py-3 px-4 rounded-lg hover:bg-gray-100"
                style={{ color: 'var(--dark-brown)' }}
              >
                FAQ
              </button>
              <div className="my-2"></div>
              <Link
                to="/login"
                className="px-5 py-3 rounded-lg text-base font-semibold text-white text-center transition-all duration-300 hover:opacity-90"
                style={{ backgroundColor: 'var(--primary-teal)' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Se connecter
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}