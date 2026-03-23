import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Role = 'maman' | 'professionnel';

interface FormData {
  fullName: string;
  phone: string;
  birthDate: string;
  password: string;
  confirmPassword: string;
  specialty: string;
  matricule: string;
  healthCenter: string;
  document: File | null;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>('maman');
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData & { general: string }>>({});
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    fullName: '',
    phone: '',
    birthDate: '',
    password: '',
    confirmPassword: '',
    specialty: '',
    matricule: '',
    healthCenter: '',
    document: null,
  });

  const specialties = ['Gynécologue', 'Sage-femme', 'Médecin généraliste', 'Pédiatre', 'Infirmier(ère)'];

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateStep1 = () => {
    const e: Partial<FormData> = {};
    if (!form.fullName.trim()) e.fullName = 'Votre nom est requis';
    if (!form.phone.trim()) e.phone = 'Votre numéro de téléphone est requis';
    if (!form.birthDate) e.birthDate = 'Votre date de naissance est requise';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Partial<FormData> = {};
    if (role === 'professionnel') {
      if (!form.specialty) e.specialty = 'Votre spécialité est requise';
      if (!form.matricule.trim()) e.matricule = 'Votre matricule est requis';
      if (!form.healthCenter.trim()) e.healthCenter = 'Le centre de santé est requis';
      if (!form.document) (e as any).general = 'Le document justificatif est requis';
    }
    if (!form.password || form.password.length < 6) e.password = 'Le mot de passe doit avoir au moins 6 caractères';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne sont pas identiques';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, general: 'Fichier trop volumineux (max 5MB)' }));
      return;
    }
    setForm(prev => ({ ...prev, document: file }));
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setDocumentPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setDocumentPreview('pdf');
    }
    setErrors(prev => ({ ...prev, general: undefined }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F7F3EF' }}>
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center border" style={{ borderColor: '#DDD0C8' }}>
          <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5" style={{ backgroundColor: 'var(--primary-teal)' }}>
            <i className="ri-check-line text-3xl text-white"></i>
          </div>
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--dark-brown)' }}>Compte créé avec succès !</h2>
          {role === 'professionnel' ? (
            <p className="text-sm text-gray-600 mb-6">
              Votre compte est en attente de validation par un administrateur. Vous recevrez une notification par SMS.
            </p>
          ) : (
            <p className="text-sm text-gray-600 mb-6">
              Bienvenue sur YaayDoom+ ! Vous pouvez maintenant vous connecter et suivre votre grossesse.
            </p>
          )}
          <button
            onClick={() => navigate('/login')}
            className="w-full h-11 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 cursor-pointer whitespace-nowrap"
            style={{ backgroundColor: 'var(--primary-teal)' }}
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F7F3EF' }}>
      {/* Panneau gauche */}
      <div className="hidden lg:flex w-5/12 flex-col justify-between p-12" style={{ backgroundColor: 'var(--primary-teal)' }}>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/20">
            <i className="ri-heart-pulse-fill text-white text-xl"></i>
          </div>
          <span className="text-2xl font-bold text-white">YaayDoom+</span>
        </Link>

        <div>
          <h2 className="text-3xl font-bold text-white leading-tight mb-5">
            <span>Rejoignez-nous</span><br />
            <span className="text-white/75">pour un suivi simplifié.</span>
          </h2>
          <div className="space-y-3">
            {[
              { icon: 'ri-shield-check-line', text: 'Vos données sont sécurisées' },
              { icon: 'ri-calendar-check-line', text: 'Suivez vos rendez-vous facilement' },
              { icon: 'ri-file-certificate-line', text: 'Votre carte digitale avec QR code' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/15 flex-shrink-0">
                  <i className={`${item.icon} text-white text-sm`}></i>
                </div>
                <span className="text-sm text-white/85">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/50"><span>© {new Date().getFullYear()} YaayDoom+</span></p>
      </div>

      {/* Formulaire */}
      <div className="flex-1 flex items-start justify-center p-6 lg:p-8 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--primary-teal)' }}>
                <i className="ri-heart-pulse-fill text-white text-sm"></i>
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--primary-teal)' }}>YaayDoom+</span>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
              Créer mon compte
            </h1>
            {role === 'professionnel' && (
              <p className="text-sm text-gray-500">Étape {step} sur 2</p>
            )}
          </div>

          {/* Progress pour professionnel */}
          {role === 'professionnel' && (
            <div className="flex gap-2 mb-7">
              {[1, 2].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? '' : 'bg-gray-200'}`}
                  style={s <= step ? { backgroundColor: 'var(--primary-teal)' } : {}} />
              ))}
            </div>
          )}

          {/* Sélection du rôle */}
          <div className="mb-6">
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--dark-brown)' }}>Je suis...</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { val: 'maman', icon: 'ri-parent-line', label: 'Maman', sub: 'Je suis enceinte ou j\'ai un bébé' },
                { val: 'professionnel', icon: 'ri-stethoscope-line', label: 'Professionnel', sub: 'Médecin, Sage-femme...' },
              ] as const).map(r => (
                <button
                  key={r.val}
                  type="button"
                  onClick={() => { setRole(r.val); setStep(1); }}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                    role === r.val ? 'border-[var(--primary-teal)] bg-white' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 flex items-center justify-center rounded-lg"
                      style={{ backgroundColor: role === r.val ? 'var(--primary-teal)' : '#e5e7eb', color: role === r.val ? 'white' : '#6b7280' }}>
                      <i className={`${r.icon} text-sm`}></i>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--dark-brown)' }}>{r.label}</span>
                  </div>
                  <p className="text-xs text-gray-500">{r.sub}</p>
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={role === 'maman' ? handleSubmit : (step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit)}
            autoComplete="off"
          >
            {/* FORMULAIRE SIMPLIFIÉ POUR MAMAN - Une seule étape */}
            {role === 'maman' ? (
              <div className="space-y-4">
                {/* Nom complet - Grand et visible */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Votre nom complet
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => update('fullName', e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl border text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white ${errors.fullName ? 'border-red-400' : ''}`}
                    style={{ borderColor: errors.fullName ? undefined : '#DDD0C8' }}
                    placeholder="Ex: Aminata Diallo"
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                {/* Téléphone - Simple */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Votre numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl border text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white ${errors.phone ? 'border-red-400' : ''}`}
                    style={{ borderColor: errors.phone ? undefined : '#DDD0C8' }}
                    placeholder="77 123 45 67"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  <p className="text-xs text-gray-400 mt-1">Nous vous enverons un code de confirmation</p>
                </div>


                {/* Date de naissance */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Votre date de naissance
                  </label>
                  <input
                    type="date"
                    value={form.birthDate}
                    onChange={e => update('birthDate', e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl border text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white ${errors.birthDate ? 'border-red-400' : ''}`}
                    style={{ borderColor: errors.birthDate ? undefined : '#DDD0C8' }}
                  />
                  {errors.birthDate && <p className="text-xs text-red-500 mt-1">{errors.birthDate}</p>}
                </div>

                {/* Mot de passe - Simple */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Créer un mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => update('password', e.target.value)}
                      minLength={6}
                      className={`w-full h-12 px-4 pr-12 rounded-xl border text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white ${errors.password ? 'border-red-400' : ''}`}
                      style={{ borderColor: errors.password ? undefined : '#DDD0C8' }}
                      placeholder="Minimum 6 caractères"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                      <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`}></i>
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                {/* Confirmer mot de passe */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    Confirmer le mot de passe
                  </label>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => update('confirmPassword', e.target.value)}
                    className={`w-full h-12 px-4 rounded-xl border text-base focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white ${errors.confirmPassword ? 'border-red-400' : ''}`}
                    style={{ borderColor: errors.confirmPassword ? undefined : '#DDD0C8' }}
                    placeholder="Répétez le mot de passe"
                  />
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl text-white font-semibold text-base transition-all hover:opacity-90 cursor-pointer flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--primary-teal)' }}
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <i className="ri-user-add-line"></i>
                      Créer mon compte
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* FORMULAIRE PROFESSIONNEL - 2 étapes */
              <>
                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                        Votre nom complet
                      </label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={e => update('fullName', e.target.value)}
                        className={`w-full h-11 px-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white ${errors.fullName ? 'border-red-400' : ''}`}
                        style={{ borderColor: errors.fullName ? undefined : '#DDD0C8' }}
                        placeholder="Dr. Nom Prénom"
                      />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                        Numéro de téléphone
                      </label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={e => update('phone', e.target.value)}
                        className={`w-full h-11 px-4 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white ${errors.phone ? 'border-red-400' : ''}`}
                        style={{ borderColor: errors.phone ? undefined : '#DDD0C8' }}
                        placeholder="+221 XX XXX XX XX"
                      />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full h-11 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 cursor-pointer"
                      style={{ backgroundColor: 'var(--primary-teal)' }}
                    >
                      Suivant <i className="ri-arrow-right-line ml-1"></i>
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    {/* Informations professionnelles */}
                    <div className="p-4 rounded-xl border" style={{ backgroundColor: 'white', borderColor: '#DDD0C8' }}>
                      <p className="text-xs font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
                        <i className="ri-hospital-line mr-1.5"></i>
                        Informations professionnelles
                      </p>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--dark-brown)' }}>Spécialité</label>
                          <select
                            value={form.specialty}
                            onChange={e => update('specialty', e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white"
                            style={{ borderColor: '#DDD0C8' }}
                          >
                            <option value="">Choisir...</option>
                            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          {errors.specialty && <p className="text-xs text-red-500 mt-1">{errors.specialty}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--dark-brown)' }}>Matricule</label>
                          <input
                            type="text"
                            value={form.matricule}
                            onChange={e => update('matricule', e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white"
                            style={{ borderColor: '#DDD0C8' }}
                            placeholder="MAT123456"
                          />
                          {errors.matricule && <p className="text-xs text-red-500 mt-1">{errors.matricule}</p>}
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1" style={{ color: 'var(--dark-brown)' }}>Centre de santé</label>
                          <input
                            type="text"
                            value={form.healthCenter}
                            onChange={e => update('healthCenter', e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white"
                            style={{ borderColor: '#DDD0C8' }}
                            placeholder="Nom de l'établissement"
                          />
                          {errors.healthCenter && <p className="text-xs text-red-500 mt-1">{errors.healthCenter}</p>}
                        </div>
                      </div>
                    </div>

                    {/* Upload document */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                        Pièce d'identité ou diplôme
                      </label>
                      {!form.document ? (
                        <label
                          htmlFor="doc"
                          className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl cursor-pointer hover:border-[var(--primary-teal)] bg-white"
                          style={{ borderColor: '#DDD0C8' }}
                        >
                          <i className="ri-upload-cloud-2-line text-xl mb-1" style={{ color: 'var(--primary-teal)' }}></i>
                          <p className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}>Cliquer pour ajouter</p>
                          <input id="doc" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                        </label>
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl border bg-white" style={{ borderColor: 'var(--primary-teal)' }}>
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: documentPreview === 'pdf' ? 'var(--primary-orange)' : 'var(--primary-teal)' }}>
                            <i className={`${documentPreview === 'pdf' ? 'ri-file-pdf-line' : 'ri-image-line'} text-white`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--dark-brown)' }}>{form.document.name}</p>
                          </div>
                          <button type="button" onClick={() => { setForm(p => ({ ...p, document: null })); setDocumentPreview(null); }}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-100">
                            <i className="ri-close-line text-sm text-red-600"></i>
                          </button>
                        </div>
                      )}
                      {(errors as any).general && <p className="text-xs text-red-500 mt-1">{(errors as any).general}</p>}
                    </div>

                    {/* Mots de passe */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--dark-brown)' }}>Mot de passe</label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={form.password}
                          onChange={e => update('password', e.target.value)}
                          minLength={6}
                          className={`w-full h-10 px-3 rounded-lg border text-sm focus:outline-none bg-white ${errors.password ? 'border-red-400' : ''}`}
                          style={{ borderColor: errors.password ? undefined : '#DDD0C8' }}
                          placeholder="Min. 6 caractères"
                        />
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1" style={{ color: 'var(--dark-brown)' }}>Confirmer</label>
                        <input
                          type={showConfirm ? 'text' : 'password'}
                          value={form.confirmPassword}
                          onChange={e => update('confirmPassword', e.target.value)}
                          className={`w-full h-10 px-3 rounded-lg border text-sm focus:outline-none bg-white ${errors.confirmPassword ? 'border-red-400' : ''}`}
                          style={{ borderColor: errors.confirmPassword ? undefined : '#DDD0C8' }}
                          placeholder="Répéter"
                        />
                        {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button type="button" onClick={() => setStep(1)}
                        className="flex-1 h-11 rounded-lg border text-sm font-medium hover:bg-gray-50"
                        style={{ borderColor: '#DDD0C8', color: 'var(--dark-brown)' }}>
                        <i className="ri-arrow-left-line mr-1"></i> Retour
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 h-11 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{ backgroundColor: 'var(--primary-teal)' }}
                      >
                        {loading ? <i className="ri-loader-4-line animate-spin"></i> : <><i className="ri-user-add-line mr-1"></i>Créer</>}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Déjà inscrit ?{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--primary-orange)' }}>
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
