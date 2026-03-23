export default function Features() {
  const features = [
    {
      icon: 'ri-heart-pulse-line',
      title: 'Suivi de grossesse',
      description: 'Suivez chaque étape de votre grossesse avec des informations personnalisées et des rappels de rendez-vous.',
      color: 'var(--primary-teal)'
    },
    {
      icon: 'ri-baby-line',
      title: 'Dossier bébé',
      description: 'Centralisez toutes les informations médicales de votre bébé : poids, taille, consultations et courbe de croissance.',
      color: 'var(--primary-orange)'
    },
    {
      icon: 'ri-syringe-line',
      title: 'Calendrier vaccinal',
      description: 'Ne manquez aucun vaccin grâce au calendrier intelligent avec notifications et suivi complet.',
      color: 'var(--primary-teal)'
    },
    {
      icon: 'ri-qr-code-line',
      title: 'Carte numérique',
      description: 'Accédez instantanément à votre dossier médical via QR code lors de vos consultations.',
      color: 'var(--primary-orange)'
    }
  ];

  return (
    <section className="py-16 px-6" style={{ backgroundColor: 'var(--background-main)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Titre section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: 'var(--dark-brown)' }}>
            Fonctionnalités principales
          </h2>
          <p className="text-sm max-w-2xl mx-auto" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
            Une plateforme complète pour accompagner votre maternité
          </p>
        </div>

        {/* Grille de fonctionnalités */}
        <div className="grid md:grid-cols-2 gap-5">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0"
                  style={{ backgroundColor: feature.color, opacity: 0.1 }}
                >
                  <i className={`${feature.icon} text-lg`} style={{ color: feature.color }}></i>
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--dark-brown)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--dark-brown)', opacity: 0.7 }}>
                    {feature.description}
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