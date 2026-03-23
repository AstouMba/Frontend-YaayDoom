import { useState } from 'react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Comment créer mon compte ?',
      answer: 'Cliquez sur "Se connecter" puis "S\'inscrire". Choisissez votre rôle (Maman ou Professionnel) et remplissez le formulaire. Pour les professionnels, un document justificatif est requis et votre compte sera validé par un administrateur.'
    },
    {
      question: 'Mes données sont-elles sécurisées ?',
      answer: 'Oui, toutes vos données médicales sont cryptées et stockées de manière sécurisée. Seuls vous et les professionnels de santé autorisés peuvent y accéder.'
    },
    {
      question: 'Comment fonctionne la carte QR ?',
      answer: 'Votre carte numérique contient un QR code unique. Lors d\'une consultation, le professionnel de santé scanne ce code pour accéder instantanément à votre dossier médical.'
    },
    {
      question: 'Puis-je suivre plusieurs bébés ?',
      answer: 'Oui, vous pouvez créer et gérer plusieurs dossiers bébé depuis votre compte. Chaque bébé aura son propre suivi médical et calendrier vaccinal.'
    },
    {
      question: 'L\'application est-elle gratuite ?',
      answer: 'Oui, YaayDoom+ est entièrement gratuit pour les mamans. Notre objectif est de rendre le suivi maternel et infantile accessible à tous.'
    }
  ];

  return (
    <section id="faq" className="py-16 px-6" style={{ backgroundColor: 'var(--background-main)' }}>
      <div className="max-w-3xl mx-auto">
        {/* Titre */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--dark-brown)' }}>
            Questions fréquentes
          </h2>
          <p className="text-sm" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
            Trouvez rapidement les réponses à vos questions
          </p>
        </div>

        {/* Liste FAQ */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="font-semibold text-sm pr-4" style={{ color: 'var(--dark-brown)' }}>
                  {faq.question}
                </span>
                <i
                  className={`ri-arrow-down-s-line text-lg transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  style={{ color: 'var(--primary-teal)' }}
                ></i>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-5 pb-4">
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}