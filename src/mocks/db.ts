// ─── Mock Database YaayDoom+ ────────────────────────────────────────────────
// Ce fichier simule un backend JSON Server temporaire.
// À remplacer par les vrais appels API lorsque le backend sera prêt.

export const mockUsers = [
  {
    id: 'u-001',
    name: 'Aminata Diallo',
    email: 'maman@demo.com',
    password: 'demo1234',
    role: 'maman' as const,
    phone: '+221 77 123 45 67',
    dateNaissance: '1992-03-15',
    isValidated: true,
    statut: 'actif',
    dateInscription: '2024-09-01',
  },
  {
    id: 'u-002',
    name: 'Dr. Fatou Sow',
    email: 'pro@demo.com',
    password: 'demo1234',
    role: 'professionnel' as const,
    phone: '+221 76 234 56 78',
    specialite: 'Gynécologue',
    matricule: 'GYN-2024-001',
    centreDesante: 'Hôpital Principal de Dakar',
    isValidated: true,
    statut: 'actif',
    dateInscription: '2024-08-15',
  },
  {
    id: 'u-003',
    name: 'Administrateur',
    email: 'admin@demo.com',
    password: 'demo1234',
    role: 'admin' as const,
    isValidated: true,
    statut: 'actif',
    dateInscription: '2024-01-01',
  },
];

export const mockGrossesses = [
  {
    id: 'g-001',
    mamanId: 'u-001',
    mamanNom: 'Aminata Diallo',
    dateDernieresRegles: '2024-09-10',
    dateAccouchementPrevue: '2025-06-17',
    semaineGrossesse: 26,
    nombreGrossessesPrecedentes: 1,
    antecedentsMedicaux: 'Légère anémie en fin de grossesse précédente.',
    statut: 'VALIDEE' as const,
    professionnelValidateur: 'Dr. Fatou Sow',
    dateValidation: '2024-09-20',
    trimestre: 2,
  },
  {
    id: 'g-002',
    mamanId: 'u-004',
    mamanNom: 'Fatou Sall',
    dateDernieresRegles: '2025-01-05',
    dateAccouchementPrevue: '2025-10-12',
    semaineGrossesse: 10,
    nombreGrossessesPrecedentes: 0,
    antecedentsMedicaux: '',
    statut: 'EN_ATTENTE' as const,
    professionnelValidateur: null,
    dateValidation: null,
    trimestre: 1,
  },
];

export const mockRendezVous = [
  {
    id: 'rdv-001',
    grossesseId: 'g-001',
    mamanId: 'u-001',
    type: 'Consultation prénatale',
    date: '2025-04-05',
    heure: '09:30',
    professionnel: 'Dr. Fatou Sow',
    lieu: 'Hôpital Principal de Dakar',
    statut: 'prévu',
    notes: '3ème consultation prénatale – contrôle routine',
  },
  {
    id: 'rdv-002',
    grossesseId: 'g-001',
    mamanId: 'u-001',
    type: 'Échographie',
    date: '2025-04-20',
    heure: '14:00',
    professionnel: 'Dr. Fatou Sow',
    lieu: 'Clinique de la Mère et de l\'Enfant',
    statut: 'prévu',
    notes: 'Échographie du 3ème trimestre',
  },
];

export const mockEvolGrossesse = [
  { semaine: 6, titre: '1er trimestre - semaine 6', description: 'Cœur du bébé commence à battre' },
  { semaine: 12, titre: '1er trimestre - semaine 12', description: 'Fin du premier trimestre. Le bébé mesure ~6cm' },
  { semaine: 20, titre: '2ème trimestre - semaine 20', description: 'Échographie morphologique. Le bébé fait ~250g' },
  { semaine: 26, titre: '2ème trimestre - semaine 26 (maintenant)', description: 'Le bébé ouvre les yeux, entend des sons', current: true },
  { semaine: 32, titre: '3ème trimestre - semaine 32', description: 'Préparation à la naissance, position tête en bas' },
  { semaine: 40, titre: 'Terme - semaine 40', description: 'Date d\'accouchement prévue' },
];

export const mockBebes = [
  {
    id: 'b-001',
    grossesseId: 'g-001',
    mamanId: 'u-001',
    nom: 'Aminata Jr Diallo',
    dateNaissance: '2024-03-15',
    sexe: 'Féminin',
    poidsNaissance: 3.2,
    tailleNaissance: 49,
    groupeSanguin: 'O+',
    ageActuel: '12 mois',
    poidsActuel: 9.1,
    tailleActuelle: 74,
  },
];

export const mockVaccins = [
  { id: 'v-001', bebeId: 'b-001', nom: 'BCG', age: 'À la naissance', datePrevu: '2024-03-15', dateAdministre: '2024-03-15', statut: 'completed', professionnel: 'Sage-femme Aïssatou Ba', notes: 'Administration à la maternité' },
  { id: 'v-002', bebeId: 'b-001', nom: 'Hépatite B (1ère dose)', age: 'À la naissance', datePrevu: '2024-03-15', dateAdministre: '2024-03-15', statut: 'completed', professionnel: 'Sage-femme Aïssatou Ba', notes: '' },
  { id: 'v-003', bebeId: 'b-001', nom: 'Pentavalent (1ère dose)', age: '6 semaines', datePrevu: '2024-04-26', dateAdministre: '2024-04-26', statut: 'completed', professionnel: 'Dr. Fatou Sow', notes: '' },
  { id: 'v-004', bebeId: 'b-001', nom: 'VPO (1ère dose)', age: '6 semaines', datePrevu: '2024-04-26', dateAdministre: '2024-04-26', statut: 'completed', professionnel: 'Dr. Fatou Sow', notes: '' },
  { id: 'v-005', bebeId: 'b-001', nom: 'Pentavalent (2ème dose)', age: '10 semaines', datePrevu: '2024-05-24', dateAdministre: '2024-05-24', statut: 'completed', professionnel: 'Dr. Fatou Sow', notes: '' },
  { id: 'v-006', bebeId: 'b-001', nom: 'Pentavalent (3ème dose)', age: '14 semaines', datePrevu: '2024-06-21', dateAdministre: '2024-06-21', statut: 'completed', professionnel: 'Dr. Fatou Sow', notes: '' },
  { id: 'v-007', bebeId: 'b-001', nom: 'ROR (Rougeole-Oreillons-Rubéole)', age: '9 mois', datePrevu: '2024-12-15', dateAdministre: '2024-12-15', statut: 'completed', professionnel: 'Dr. Fatou Sow', notes: '' },
  { id: 'v-008', bebeId: 'b-001', nom: 'Fièvre Jaune', age: '9 mois', datePrevu: '2024-12-15', dateAdministre: '2024-12-15', statut: 'completed', professionnel: 'Dr. Fatou Sow', notes: '' },
  { id: 'v-009', bebeId: 'b-001', nom: 'Méningite A', age: '12 mois', datePrevu: '2025-03-15', dateAdministre: null, statut: 'upcoming', professionnel: null, notes: '' },
  { id: 'v-010', bebeId: 'b-001', nom: 'Pneumocoque', age: '15 mois', datePrevu: '2025-06-15', dateAdministre: null, statut: 'upcoming', professionnel: null, notes: '' },
  { id: 'v-011', bebeId: 'b-001', nom: 'Rappel DTC + Polio', age: '18 mois', datePrevu: '2025-09-15', dateAdministre: null, statut: 'upcoming', professionnel: null, notes: '' },
];

export const mockCroissanceBebe = [
  { mois: 0, label: 'Naissance', poids: 3.2, taille: 49 },
  { mois: 1, label: '1 mois', poids: 4.1, taille: 53 },
  { mois: 2, label: '2 mois', poids: 5.0, taille: 57 },
  { mois: 3, label: '3 mois', poids: 5.8, taille: 60 },
  { mois: 4, label: '4 mois', poids: 6.5, taille: 63 },
  { mois: 5, label: '5 mois', poids: 7.1, taille: 65 },
  { mois: 6, label: '6 mois', poids: 7.6, taille: 67 },
  { mois: 7, label: '7 mois', poids: 8.0, taille: 69 },
  { mois: 8, label: '8 mois', poids: 8.4, taille: 71 },
  { mois: 9, label: '9 mois', poids: 8.7, taille: 72 },
  { mois: 10, label: '10 mois', poids: 8.9, taille: 73 },
  { mois: 11, label: '11 mois', poids: 9.1, taille: 74 },
];

export const mockUtilisateurs = [
  { id: 1, nom: 'Fatou Diop', email: 'fatou.diop@email.com', telephone: '+221 77 123 45 67', role: 'maman' as const, dateInscription: '2024-09-10', statut: 'actif' as const },
  { id: 2, nom: 'Dr. Aminata Ba', email: 'aminata.ba@hopital.sn', telephone: '+221 77 234 56 78', role: 'professionnel' as const, specialite: 'Gynécologue', dateInscription: '2024-08-05', statut: 'actif' as const },
  { id: 3, nom: 'Mariama Sow', email: 'mariama.sow@email.com', telephone: '+221 76 345 67 89', role: 'maman' as const, dateInscription: '2024-09-12', statut: 'actif' as const },
  { id: 4, nom: 'Fatou Sall', email: 'fatou.sall@clinique.sn', telephone: '+221 76 456 78 90', role: 'professionnel' as const, specialite: 'Sage-femme', dateInscription: '2024-08-08', statut: 'actif' as const },
  { id: 5, nom: 'Aïssatou Ndiaye', email: 'aissatou.ndiaye@email.com', telephone: '+221 77 567 89 01', role: 'maman' as const, dateInscription: '2024-10-15', statut: 'actif' as const },
  { id: 6, nom: 'Dr. Moussa Diop', email: 'moussa.diop@centre.sn', telephone: '+221 77 678 90 12', role: 'professionnel' as const, specialite: 'Pédiatre', dateInscription: '2024-08-03', statut: 'actif' as const },
  { id: 7, nom: 'Khadija Fall', email: 'khadija.fall@email.com', telephone: '+221 78 789 01 23', role: 'maman' as const, dateInscription: '2024-11-01', statut: 'inactif' as const },
  { id: 8, nom: 'Rokhaya Mbaye', email: 'rokhaya.mbaye@email.com', telephone: '+221 77 890 12 34', role: 'maman' as const, dateInscription: '2024-11-20', statut: 'actif' as const },
];

export const mockProfessionnelsEnAttente = [
  { id: 1, nom: 'Dr. Aminata Ba', email: 'aminata.ba@hopital.sn', telephone: '+221 77 123 45 67', specialite: 'Gynécologue', matricule: 'GYN-2024-001', centreDesante: 'Hôpital Principal de Dakar', documentUrl: '/documents/attestation-aminata-ba.pdf', dateInscription: '2025-01-15' },
  { id: 2, nom: 'Fatou Sall', email: 'fatou.sall@clinique.sn', telephone: '+221 76 234 56 78', specialite: 'Sage-femme', matricule: 'SF-2024-012', centreDesante: 'Clinique de la Mère et de l\'Enfant', documentUrl: '/documents/diplome-fatou-sall.pdf', dateInscription: '2025-01-16' },
  { id: 3, nom: 'Dr. Moussa Diop', email: 'moussa.diop@centre.sn', telephone: '+221 77 345 67 89', specialite: 'Pédiatre', matricule: 'PED-2024-008', centreDesante: 'Centre de Santé de Pikine', documentUrl: '/documents/carte-pro-moussa-diop.pdf', dateInscription: '2025-01-17' },
];

export const mockStats = {
  totalMamans: 156,
  totalProfessionnels: 23,
  grossessesActives: 89,
  professionnelsEnAttente: 8,
  consultationsTotal: 342,
  vaccinationsTotal: 1087,
  grossessesParMois: [12, 19, 15, 22, 18, 25, 20, 28, 24, 31, 22, 18],
  labelsParMois: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
};
