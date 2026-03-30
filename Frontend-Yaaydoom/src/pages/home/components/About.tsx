export default function About() {
  return (
    <section id="a-propos" className="py-12 sm:py-16 px-4 sm:px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="relative order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-md" style={{ width: '100%', height: '250px sm:300px md:350px lg:400px' }}>
              <img 
                src="https://readdy.ai/api/search-image?query=African%20healthcare%20professional%20woman%20doctor%20in%20white%20medical%20coat%20using%20digital%20tablet%20in%20modern%20clinic.%20Warm%20professional%20medical%20environment%20with%20soft%20natural%20lighting.%20Clean%20simple%20background%20in%20cream%20and%20beige%20tones.%20Professional%20healthcare%20photography.%20High%20quality%20portrait%20with%20shallow%20depth%20of%20field.%20Confident%20and%20caring%20expression.&width=600&height=500&seq=yaaydoom-about-doctor-001&orientation=landscape" 
                alt="Professionnel de santé" 
                className="w-full h-full object-cover object-center"
              />
            </div>
          </div>

          {/* Contenu */}
          <div className="order-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4" style={{ color: 'var(--dark-brown)' }}>
              À propos de YaayDoom+
            </h2>
            <p className="text-sm leading-relaxed mb-5 sm:mb-6" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
              YaayDoom+ est une plateforme numérique innovante dédiée au suivi maternel et infantile. Notre mission est de faciliter l'accès aux soins de santé et d'améliorer le suivi médical des mamans et de leurs bébés.
            </p>

            {/* Points clés */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: 'var(--primary-teal)' }}>
                  <i className="ri-check-line text-white text-xs"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--dark-brown)' }}>
                    Plateforme sécurisée
                  </h4>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
                    Vos données médicales sont protégées et accessibles uniquement par vous et vos professionnels de santé.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: 'var(--primary-teal)' }}>
                  <i className="ri-check-line text-white text-xs"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--dark-brown)' }}>
                    Accessible partout
                  </h4>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
                    Consultez votre dossier médical à tout moment, depuis n'importe quel appareil connecté.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: 'var(--primary-teal)' }}>
                  <i className="ri-check-line text-white text-xs"></i>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1" style={{ color: 'var(--dark-brown)' }}>
                    Suivi personnalisé
                  </h4>
                  <p className="text-xs sm:text-sm" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
                    Recevez des informations et des rappels adaptés à votre situation et à celle de votre bébé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}