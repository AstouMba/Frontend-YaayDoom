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
    id: 'u-004',
    name: 'Fatou Sall',
    email: 'fatou.sall@demo.com',
    password: 'demo1234',
    role: 'maman' as const,
    phone: '+221 76 234 56 78',
    dateNaissance: '1996-07-20',
    isValidated: true,
    statut: 'actif',
    dateInscription: '2024-10-15',
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
  // Jumeaux - Famille 2
  {
    id: 'b-002',
    grossesseId: 'g-002',
    mamanId: 'u-004',
    nom: 'Moussa Sall',
    dateNaissance: '2024-07-20',
    sexe: 'Masculin',
    poidsNaissance: 2.8,
    tailleOrigine: 46,
    groupeSanguin: 'A+',
    ageActuel: '8 mois',
    poidsActuel: 7.2,
    tailleActuelle: 68,
  },
  {
    id: 'b-003',
    grossesseId: 'g-002',
    mamanId: 'u-004',
    nom: 'Mariama Sall',
    dateNaissance: '2024-07-20',
    sexe: 'Féminin',
    poidsOrigine: 2.5,
    tailleOrigine: 45,
    groupeSanguin: 'O+',
    ageActuel: '8 mois',
    poidsActuel: 6.8,
    tailleActuelle: 66,
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
  { id: 'v-010', bebeId: 'b-001', nom: 'Pneumocoque', age: '24 mois', datePrevu: '2026-09-15', dateAdministre: null, statut: 'upcoming', professionnel: null, notes: '' },
  { id: 'v-011', bebeId: 'b-001', nom: 'Rappel DTC + Polio', age: '18 mois', datePrevu: '2027-03-15', dateAdministre: null, statut: 'upcoming', professionnel: null, notes: '' },
];

export const mockConsultations = [
  {
    id: 'c-001',
    mamanId: 'u-001',
    bebeId: 'b-001',
    professionnelId: 'u-002',
    type: 'Consultation prénatale',
    date: '2025-04-05',
    heure: '09:30:00',
    notes: '3ème consultation prénatale - contrôle routine. Tension stable et bébé en bonne santé.',
    tensionArterielle: '12/8',
    poids: '68',
    semaineGrossesse: 24,
  },
  {
    id: 'c-002',
    mamanId: 'u-001',
    bebeId: 'b-001',
    professionnelId: 'u-002',
    type: 'Échographie',
    date: '2025-04-20',
    heure: '14:00:00',
    notes: 'Échographie du 3ème trimestre avec croissance normale.',
    tensionArterielle: '11/7',
    poids: '68.5',
    semaineGrossesse: 26,
  },
  {
    id: 'c-003',
    mamanId: 'u-004',
    bebeId: 'b-002',
    professionnelId: 'u-002',
    type: "Consultation d'urgence",
    date: '2025-04-12',
    heure: '18:00:00',
    notes: 'Douleurs abdominales modérées. Repos et surveillance recommandés.',
    tensionArterielle: '12/7',
    poids: '61',
    semaineGrossesse: 10,
  },
];

export const mockCroissanceBebe = [
  // Bebe b-001 (Aminata Jr)
  { bebeId: 'b-001', mois: 0, label: 'Naissance', poids: 3.2, taille: 49 },
  { bebeId: 'b-001', mois: 1, label: '1 mois', poids: 4.1, taille: 53 },
  { bebeId: 'b-001', mois: 2, label: '2 mois', poids: 5.0, taille: 57 },
  { bebeId: 'b-001', mois: 3, label: '3 mois', poids: 5.8, taille: 60 },
  { bebeId: 'b-001', mois: 4, label: '4 mois', poids: 6.5, taille: 63 },
  { bebeId: 'b-001', mois: 5, label: '5 mois', poids: 7.1, taille: 65 },
  { bebeId: 'b-001', mois: 6, label: '6 mois', poids: 7.6, taille: 67 },
  { bebeId: 'b-001', mois: 7, label: '7 mois', poids: 8.0, taille: 69 },
  { bebeId: 'b-001', mois: 8, label: '8 mois', poids: 8.4, taille: 71 },
  { bebeId: 'b-001', mois: 9, label: '9 mois', poids: 8.7, taille: 72 },
  { bebeId: 'b-001', mois: 10, label: '10 mois', poids: 8.9, taille: 73 },
  { bebeId: 'b-001', mois: 11, label: '11 mois', poids: 9.1, taille: 74 },
  // Jumeau b-002 (Moussa)
  { bebeId: 'b-002', mois: 0, label: 'Naissance', poids: 2.8, taille: 46 },
  { bebeId: 'b-002', mois: 1, label: '1 mois', poids: 3.6, taille: 51 },
  { bebeId: 'b-002', mois: 2, label: '2 mois', poids: 4.4, taille: 55 },
  { bebeId: 'b-002', mois: 3, label: '3 mois', poids: 5.1, taille: 58 },
  { bebeId: 'b-002', mois: 4, label: '4 mois', poids: 5.7, taille: 61 },
  { bebeId: 'b-002', mois: 5, label: '5 mois', poids: 6.2, taille: 63 },
  { bebeId: 'b-002', mois: 6, label: '6 mois', poids: 6.6, taille: 65 },
  { bebeId: 'b-002', mois: 7, label: '7 mois', poids: 6.9, taille: 67 },
  { bebeId: 'b-002', mois: 8, label: '8 mois', poids: 7.2, taille: 68 },
  // Jumeau b-003 (Mariama)
  { bebeId: 'b-003', mois: 0, label: 'Naissance', poids: 2.5, taille: 45 },
  { bebeId: 'b-003', mois: 1, label: '1 mois', poids: 3.3, taille: 50 },
  { bebeId: 'b-003', mois: 2, label: '2 mois', poids: 4.1, taille: 54 },
  { bebeId: 'b-003', mois: 3, label: '3 mois', poids: 4.8, taille: 57 },
  { bebeId: 'b-003', mois: 4, label: '4 mois', poids: 5.4, taille: 59 },
  { bebeId: 'b-003', mois: 5, label: '5 mois', poids: 5.9, taille: 61 },
  { bebeId: 'b-003', mois: 6, label: '6 mois', poids: 6.3, taille: 63 },
  { bebeId: 'b-003', mois: 7, label: '7 mois', poids: 6.6, taille: 65 },
  { bebeId: 'b-003', mois: 8, label: '8 mois', poids: 6.8, taille: 66 },
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
  { id: 9, nom: 'Awa Ndiaye', email: 'admin@demo.com', telephone: '+221 77 000 00 00', role: 'admin' as const, dateInscription: '2024-01-01', statut: 'actif' as const },
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

// ─── Dossier Familial - Types et Données ─────────────────────────────────────────

export interface MembreFamilial {
  id: string;
  type: 'maman' | 'bebe';
  lien: string;
  nom: string;
  photoUrl?: string;
  age?: number;
  estActif: boolean;
  // Champs affichage maman
  email?: string;
  phone?: string;
  semainesGrossesse?: number;
  dateAccouchementPrevue?: string;
  statutGrossesse?: 'VALIDÉE' | 'EN_ATTENTE';
  // Champs affichage bébé
  sexe?: 'Masculin' | 'Féminin';
  dateNaissance?: string;
  poids?: number;
  taille?: number;
  vaccinsEnRetard?: number;
}

export interface DossierFamilial {
  id: string;
  mamanId: string;
  membres: MembreFamilial[];
  grossesses: typeof mockGrossesses;
  estGemellaire: boolean;
}

// Famille 1: Simple (1 maman + 1 bebe)
export const mockFamille1: DossierFamilial = {
  id: 'FAM-001',
  mamanId: 'u-001',
  estGemellaire: false,
  membres: [
    {
      id: 'u-001', type: 'maman', lien: 'mere', nom: 'Aminata Diallo', age: 32, estActif: true,
      email: 'aminata.diallo@email.com', phone: '+221 77 123 45 67',
      semainesGrossesse: 24, dateAccouchementPrevue: '15 août 2025', statutGrossesse: 'VALIDÉE',
    },
    {
      id: 'b-001', type: 'bebe', lien: 'fille', nom: 'Aminata Jr Diallo', age: 18, estActif: true,
      sexe: 'Féminin', dateNaissance: '10/09/2023', poids: 11.2, taille: 80, vaccinsEnRetard: 1,
    },
  ],
  grossesses: [mockGrossesses[0]],
};

// Famille 2: Jumeaux (1 maman + 2 bebes)
export const mockFamille2: DossierFamilial = {
  id: 'FAM-002',
  mamanId: 'u-004',
  estGemellaire: true,
  membres: [
    {
      id: 'u-004', type: 'maman', lien: 'mere', nom: 'Fatou Sall', age: 28, estActif: true,
      email: 'fatou.sall@email.com', phone: '+221 76 234 56 78',
      semainesGrossesse: 10, dateAccouchementPrevue: '12 octobre 2025', statutGrossesse: 'EN_ATTENTE',
    },
    {
      id: 'b-002', type: 'bebe', lien: 'jumeau1', nom: 'Moussa Sall', age: 8, estActif: true,
      sexe: 'Masculin', dateNaissance: '20/07/2024', poids: 7.2, taille: 68, vaccinsEnRetard: 0,
    },
    {
      id: 'b-003', type: 'bebe', lien: 'jumeau2', nom: 'Mariama Sall', age: 8, estActif: true,
      sexe: 'Féminin', dateNaissance: '20/07/2024', poids: 6.8, taille: 66, vaccinsEnRetard: 2,
    },
  ],
  grossesses: [mockGrossesses[1]],
};

export const mockFamilles: DossierFamilial[] = [mockFamille1, mockFamille2];
