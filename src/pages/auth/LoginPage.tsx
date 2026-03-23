import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      user: { id: '1', name: 'Aminata Diallo', email: 'maman@demo.com', role: 'maman' as const, phone: '+221 77 123 45 67', isValidated: true },
      password: 'demo1234',
    },
    {
      user: { id: '2', name: 'Dr. Fatou Sow', email: 'pro@demo.com', role: 'professionnel' as const, phone: '+221 76 234 56 78', isValidated: true },
      password: 'demo1234',
    },
    {
      user: { id: '3', name: 'Administrateur', email: 'admin@demo.com', role: 'admin' as const, isValidated: true },
      password: 'demo1234',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const match = demoAccounts.find(a => a.user.email === email && a.password === password);

    setTimeout(() => {
      if (match) {
        login(match.user, 'demo-token-' + match.user.role);
      } else {
        setError('Email ou mot de passe incorrect.');
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F3EF' }}>
      {/* Panneau gauche - Branding */}
      <div className="hidden lg:flex w-5/12 flex-col justify-between p-12" style={{ backgroundColor: 'var(--primary-teal)' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20">
            <i className="ri-heart-pulse-fill text-white text-xl"></i>
          </div>
          <span className="text-2xl font-bold text-white">YaayDoom+</span>
        </Link>

        {/* Centre */}
        <div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-5">
            Votre santé maternelle,<br />
            <span className="text-white/75">numérisée et sécurisée.</span>
          </h2>

          <div className="space-y-4">
            {[
              { icon: 'ri-pregnant-line', text: 'Suivi de grossesse complet' },
              { icon: 'ri-qr-code-line', text: 'Carte numérique avec QR code' },
              { icon: 'ri-syringe-line', text: 'Calendrier vaccinal du bébé' },
              { icon: 'ri-stethoscope-line', text: 'Connexion avec les professionnels' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-white/15 flex-shrink-0">
                  <i className={`${item.icon} text-white text-base`}></i>
                </div>
                <span className="text-sm text-white/85">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer branding */}
        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} YaayDoom+ · Plateforme certifiée santé
        </p>
      </div>

      {/* Panneau droit - Formulaire */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 flex items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--primary-teal)' }}>
                <i className="ri-heart-pulse-fill text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold" style={{ color: 'var(--primary-teal)' }}>YaayDoom+</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
              Connexion
            </h1>
            <p className="text-sm text-gray-500">Entrez vos identifiants pour accéder à votre espace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-red-50 border-red-200">
                <i className="ri-error-warning-line text-red-500 flex-shrink-0"></i>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--dark-brown)' }}>
                Adresse email
              </label>
              <div className="relative">
                <i className="ri-mail-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 h-11 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] transition-all bg-white"
                  style={{ borderColor: '#DDD0C8' }}
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>
                  Mot de passe
                </label>
                <Link to="/forgot-password" className="text-xs text-teal-600 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <i className="ri-lock-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-10 pr-11 h-11 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] transition-all bg-white"
                  style={{ borderColor: '#DDD0C8' }}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-base`}></i>
                </button>
              </div>
            </div>

            {/* Bouton connexion */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
              style={{ backgroundColor: 'var(--primary-teal)' }}
            >
              {loading ? (
                <>
                  <i className="ri-loader-4-line animate-spin"></i>
                  Connexion en cours...
                </>
              ) : (
                <>
                  <i className="ri-login-box-line"></i>
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Inscription */}
          <div className="mt-6 pt-5 border-t" style={{ borderColor: '#DDD0C8' }}>
            <p className="text-center text-sm text-gray-500">
              Vous n'avez pas de compte ?{' '}
              <Link
                to="/register"
                className="font-semibold hover:underline transition-all"
                style={{ color: 'var(--primary-orange)' }}
              >
                Créer un compte
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-all cursor-pointer">
              <i className="ri-arrow-left-line"></i>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
