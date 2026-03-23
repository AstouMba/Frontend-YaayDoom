import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

type Role = 'maman' | 'professionnel';

interface FormData {
  fullName: string;
  email: string;
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

  const [form, setForm] = useState<FormData>({
    fullName: '', email: '', phone: '', birthDate: '',
    password: '', confirmPassword: '',
    specialty: '', matricule: '', healthCenter: '', document: null,
  });

  const specialties = ['Gynécologue', 'Sage-femme', 'Médecin généraliste', 'Pédiatre', 'Infirmier(ère)'];

  const update = (field: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateStep1 = () => {
    const e: Partial<FormData> = {};
    if (!form.fullName.trim()) e.fullName = 'Nom complet requis';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email invalide';
    if (!form.phone.trim()) e.phone = 'Téléphone requis';
    if (role === 'maman' && !form.birthDate) e.birthDate = 'Date de naissance requise';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Partial<FormData> = {};
    if (role === 'professionnel') {
      if (!form.specialty) e.specialty = 'Spécialité requise';
      if (!form.matricule.trim()) e.matricule = 'Matricule requis';
      if (!form.healthCenter.trim()) e.healthCenter = 'Centre de santé requis';
      if (!form.document) (e as any).general = 'Document justificatif requis';
    }
    if (!form.password || form.password.length < 8) e.password = 'Au moins 8 caractères';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Les mots de passe ne correspondent pas';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
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
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--dark-brown)' }}>Inscription réussie !</h2>
          {role === 'professionnel' ? (
            <p className="text-sm text-gray-600 mb-6">
              Votre compte professionnel a été créé et est en attente de validation par un administrateur. Vous serez notifié par email une fois votre compte approuvé.
            </p>
          ) : (
            <p className="text-sm text-gray-600 mb-6">
              Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.
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
            <span>Rejoignez des milliers</span><br />
            <span className="text-white/75">de mamans et professionnels.</span>
          </h2>
          <div className="space-y-3">
            {[
              { icon: 'ri-shield-check-line', text: 'Données médicales sécurisées' },
              { icon: 'ri-team-line', text: 'Connexion avec vos professionnels de santé' },
              { icon: 'ri-calendar-check-line', text: 'Suivi des rendez-vous et vaccins' },
              { icon: 'ri-file-certificate-line', text: 'Dossier médical numérique complet' },
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

        <p className="text-xs text-white/50"><span>© {new Date().getFullYear()} YaayDoom+ · Plateforme certifiée santé</span></p>
      </div>

      {/* Formulaire */}
      <div className="flex-1 flex items-start justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg py-4">
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
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}><span>Créer un compte</span></h1>
            <p className="text-sm text-gray-500"><span>Étape {step} sur 2</span></p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-7">
            {[1, 2].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? '' : 'bg-gray-200'}`}
                style={s <= step ? { backgroundColor: 'var(--primary-teal)' } : {}} />
            ))}
          </div>

          {/* Sélection du rôle */}
          {step === 1 && (
            <div className="mb-6" key="role-selector">
              <p className="text-sm font-semibold mb-3" style={{ color: 'var(--dark-brown)' }}><span>Je suis...</span></p>
              <div className="grid grid-cols-2 gap-3">
                {([
                  { val: 'maman', icon: 'ri-parent-line', label: 'Maman', sub: 'Suivi de grossesse et bébé' },
                  { val: 'professionnel', icon: 'ri-stethoscope-line', label: 'Professionnel', sub: 'Médecin, Sage-femme...' },
                ] as const).map(r => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => setRole(r.val)}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      role === r.val ? 'border-[var(--primary-teal)] bg-white' : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-8 h-8 flex items-center justify-center rounded-lg"
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
          )}

          <form
            key={`step-${step}`}
            onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}
            autoComplete="off"
            translate="no"
          >
            {step === 1 && (
              <div className="space-y-4">
                {/* Nom complet */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    <span>Nom complet</span> <span style={{ color: 'var(--primary-orange)' }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={e => update('fullName', e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white ${errors.fullName ? 'border-red-400' : ''}`}
                    style={{ borderColor: errors.fullName ? undefined : '#DDD0C8' }}
                    placeholder="Votre nom complet"
                    autoComplete="off"
                  />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1"><span>{errors.fullName}</span></p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    <span>Email</span> <span style={{ color: 'var(--primary-orange)' }}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email-register"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    className={`w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white ${errors.email ? 'border-red-400' : ''}`}
                    style={{ borderColor: errors.email ? undefined : '#DDD0C8' }}
                    placeholder="votre@email.com"
                    autoComplete="off"
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1"><span>{errors.email}</span></p>}
                </div>

                {/* Téléphone */}
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                    <span>Téléphone</span> <span style={{ color: 'var(--primary-orange)' }}>*</span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white"
                    style={{ borderColor: '#DDD0C8' }}
                    placeholder="+221 XX XXX XX XX"
                    autoComplete="off"
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1"><span>{errors.phone}</span></p>}
                </div>

                {/* Date de naissance (Maman) */}
                {role === 'maman' && (
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      <span>Date de naissance</span> <span style={{ color: 'var(--primary-orange)' }}>*</span>
                    </label>
                    <input
                      type="date"
                      value={form.birthDate}
                      onChange={e => update('birthDate', e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white"
                      style={{ borderColor: '#DDD0C8' }}
                      autoComplete="off"
                    />
                    {errors.birthDate && <p className="text-xs text-red-500 mt-1"><span>{errors.birthDate}</span></p>}
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                {/* Informations professionnelles */}
                {role === 'professionnel' && (
                  <>
                    <div className="p-4 rounded-xl border" style={{ backgroundColor: 'white', borderColor: '#DDD0C8' }}>
                      <p className="text-xs font-semibold mb-3" style={{ color: 'var(--primary-teal)' }}>
                        <i className="ri-hospital-line mr-1.5"></i>
                        <span>Informations professionnelles</span>
                      </p>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                              <span>Spécialité</span> <span style={{ color: 'var(--primary-orange)' }}>*</span>
                            </label>
                            <select
                              value={form.specialty}
                              onChange={e => update('specialty', e.target.value)}
                              className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-teal)] bg-white cursor-pointer"
                              style={{ borderColor: '#DDD0C8' }}
                            >
                              <option value=""><span>Choisir...</span></option>
                              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            {errors.specialty && <p className="text-xs text-red-500 mt-1"><span>{errors.specialty}</span></p>}
                          </div>
                          <div>
                            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                              <span>Matricule</span> <span style={{ color: 'var(--primary-orange)' }}>*</span>
                            </label>
                            <input
                              type="text"
                              value={form.matricule}
                              onChange={e => update('matricule', e.target.value)}
                              className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none bg-white"
                              style={{ borderColor: '#DDD0C8' }}
                              placeholder="MAT123456"
                              autoComplete="off"
                            />
                            {errors.matricule && <p className="text-xs text-red-500 mt-1"><span>{errors.matricule}</span></p>}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                            <span>Centre de santé</span> <span style={{ color: 'var(--primary-orange)' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={form.healthCenter}
                            onChange={e => update('healthCenter', e.target.value)}
                            className="w-full h-10 px-3 rounded-lg border text-sm focus:outline-none bg-white"
                            style={{ borderColor: '#DDD0C8' }}
                            placeholder="Nom de l'établissement"
                            autoComplete="off"
                          />
                          {errors.healthCenter && <p className="text-xs text-red-500 mt-1"><span>{errors.healthCenter}</span></p>}
                        </div>
                      </div>
                    </div>

                    {/* Upload document */}
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                        <span>Document justificatif</span> <span style={{ color: 'var(--primary-orange)' }}>*</span>
                      </label>
                      {!form.document ? (
                        <label
                          htmlFor="document"
                          className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-all hover:border-[var(--primary-teal)] bg-white"
                          style={{ borderColor: '#DDD0C8' }}
                        >
                          <i className="ri-upload-cloud-2-line text-2xl mb-1.5" style={{ color: 'var(--primary-teal)' }}></i>
                          <p className="text-sm font-medium" style={{ color: 'var(--dark-brown)' }}><span>Cliquer pour uploader</span></p>
                          <p className="text-xs text-gray-400 mt-0.5"><span>PDF, JPG, PNG – Max 5MB</span></p>
                          <input id="document" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                        </label>
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl border bg-white" style={{ borderColor: 'var(--primary-teal)' }}>
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: documentPreview === 'pdf' ? 'var(--primary-orange)' : 'var(--primary-teal)' }}>
                            <i className={`${documentPreview === 'pdf' ? 'ri-file-pdf-line' : 'ri-image-line'} text-white text-base`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--dark-brown)' }}>{form.document.name}</p>
                            <p className="text-xs text-gray-500"><span>{(form.document.size / 1024).toFixed(0)} KB</span></p>
                          </div>
                          <button type="button" onClick={() => { setForm(p => ({ ...p, document: null })); setDocumentPreview(null); }}
                            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-100 hover:bg-red-200 transition-all cursor-pointer flex-shrink-0">
                            <i className="ri-close-line text-sm text-red-600"></i>
                          </button>
                        </div>
                      )}
                      {(errors as any).general && <p className="text-xs text-red-500 mt-1"><span>{(errors as any).general}</span></p>}
                    </div>
                  </>
                )}

                {/* Mots de passe */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      <span>Mot de passe</span> <span style={{ color: 'var(--primary-orange)' }}>*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="new-password"
                        value={form.password}
                        onChange={e => update('password', e.target.value)}
                        minLength={8}
                        className={`w-full h-10 px-3 pr-9 rounded-lg border text-sm focus:outline-none bg-white ${errors.password ? 'border-red-400' : ''}`}
                        style={{ borderColor: errors.password ? undefined : '#DDD0C8' }}
                        placeholder="Min. 8 caractères"
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                        <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm`}></i>
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1"><span>{errors.password}</span></p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--dark-brown)' }}>
                      <span>Confirmer</span> <span style={{ color: 'var(--primary-orange)' }}>*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={form.confirmPassword}
                        onChange={e => update('confirmPassword', e.target.value)}
                        className={`w-full h-10 px-3 pr-9 rounded-lg border text-sm focus:outline-none bg-white ${errors.confirmPassword ? 'border-red-400' : ''}`}
                        style={{ borderColor: errors.confirmPassword ? undefined : '#DDD0C8' }}
                        placeholder="Répéter"
                        autoComplete="new-password"
                      />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                        <i className={`${showConfirm ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm`}></i>
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1"><span>{errors.confirmPassword}</span></p>}
                  </div>
                </div>
              </div>
            )}

            <div className={`mt-6 flex gap-3`}>
              {step === 2 && (
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 h-11 rounded-lg border text-sm font-medium transition-all hover:bg-gray-50 cursor-pointer whitespace-nowrap"
                  style={{ borderColor: '#DDD0C8', color: 'var(--dark-brown)' }}>
                  <i className="ri-arrow-left-line mr-1.5"></i>
                  <span>Retour</span>
                </button>
              )}
              <button type="submit"
                className="flex-1 h-11 rounded-lg text-white font-semibold text-sm transition-all hover:opacity-90 cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: 'var(--primary-teal)' }}>
                {step === 1
                  ? <span>Suivant <i className="ri-arrow-right-line ml-1.5"></i></span>
                  : <span><i className="ri-user-add-line mr-1.5"></i>Créer mon compte</span>
                }
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-gray-500">
              <span>Déjà un compte ?</span>{' '}
              <Link to="/login" className="font-semibold hover:underline" style={{ color: 'var(--primary-orange)' }}>
                <span>Se connecter</span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
