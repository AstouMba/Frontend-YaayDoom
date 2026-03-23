# Diagrammes UML - YaayDoom+

## 1. Diagramme des Cas d'Utilisation (Use Case Diagram)

```mermaid
graph TB
    subgraph Acteurs
        M["👩 Maman"]
        P["👨‍⚕️ Professionnel"]
        A["⚙️ Administrateur"]
    end

    subgraph Cas d'Utilisation Maman
        M1["S'inscrire / Se connecter"]
        M2["Déclarer grossesse"]
        M3["Suivre ma grossesse"]
        M4["Consulter dossier bébé"]
        M5["Voir calendrier vaccinal"]
        M6["Télécharger carte QR"]
        M7["Prendre rendez-vous"]
        M8["Consulter historique médical"]
    end

    subgraph Cas d'Utilisation Professionnel
        P1["Se connecter"]
        P2["Valider grossesses"]
        P3["Enregistrer consultations"]
        P4["Mettre à jour vaccinations"]
        P5["Scanner QR code patient"]
        P6["Consulter dossiers patients"]
        P7["Gérer rendez-vous"]
    end

    subgraph Cas d'Utilisation Administrateur
        A1["Se connecter"]
        A2["Gérer utilisateurs"]
        A3["Valider professionnels"]
        A4["Consulter statistiques"]
        A5["Valider déclarations"]
    end

    M --> M1
    M --> M2
    M --> M3
    M --> M4
    M --> M5
    M --> M6
    M --> M7
    M --> M8

    P --> P1
    P --> P2
    P --> P3
    P --> P4
    P --> P5
    P --> P6
    P --> P7

    A --> A1
    A --> A2
    A --> A3
    A --> A4
    A --> A5
```

## 2. Diagramme de Classes (Class Diagram)

```mermaid
classDiagram
    class User {
        +id: string
        +email: string
        +password: string
        +name: string
        +role: Role
        +createdAt: Date
        +login()
        +logout()
    }

    class Role {
        <<enumeration>>
        MAMAN
        PROFESSIONNEL
        ADMIN
    }

    class Maman {
        +id: string
        +userId: string
        +dateDernieresRegles: Date
        +semaineGrossesse: number
        +statutGrossesse: StatutGrossesse
        +declareGrossesse()
        +consulterBebe()
        +voirVaccination()
        +telechargerCarte()
    }

    class Professionnel {
        +id: string
        +userId: string
        +specialite: string
        +structure: string
        +valide: boolean
        +validerGrossesse()
        +enregistrerConsultation()
        +mettreAJourVaccination()
        +scannerQR()
    }

    class Administrateur {
        +id: string
        +userId: string
        +gererUtilisateurs()
        +validerProfessionnels()
        +consulterStatistiques()
    }

    class Bebe {
        +id: string
        +nom: string
        +dateNaissance: Date
        +sexe: string
        +poidsActuel: number
        +tailleActuelle: number
        +groupeSanguin: string
        +mamanId: string
        +updateCroissance()
    }

    class Grossesse {
        +id: string
        +mamanId: string
        +dateDebut: Date
        +datePrevue: number
        +statut: StatutGrossesse
        +semaineActuelle: number
        +validePar: string
        +valider()
        +getEvolution()
    }

    class RendezVous {
        +id: string
        +patientId: string
        +professionnelId: string
        +type: string
        +date: Date
        +heure: string
        +lieu: string
        +statut: StatutRDV
        +prendre()
        +annuler()
    }

    class Consultation {
        +id: string
        +patientId: string
        +professionnelId: string
        +bebeId: string
        +grossesseId: string
        +type: string
        +date: Date
        +notes: string
        +poids: number
        +taille: number
        +enregistrer()
    }

    class Vaccination {
        +id: string
        +bebeId: string
        +nom: string
        +ageRecommande: string
        +datePrevue: Date
        +dateAdministre: Date
        +statut: StatutVaccin
        +professionnel: string
        +administrer()
    }

    class CarteSante {
        +id: string
        +bebeId: string
        +numero: string
        +qrCode: string
        +dateCreation: Date
        +genererQR()
        +telecharger()
    }

    class StatutGrossesse {
        <<enumeration>>
        EN_ATTENTE
        VALIDEE
        TERMINEE
    }

    class StatutRDV {
        <<enumeration>>
        PRÉVU
        TERMINÉ
        ANNULÉ
    }

    class StatutVaccin {
        <<enumeration>>
        COMPLETED
        UPCOMING
        OVERDUE
    }

    User <|-- Maman
    User <|-- Professionnel
    User <|-- Administrateur
    
    Maman "1" --> "0..*" Bebe : a
    Maman "1" --> "0..1" Grossesse : a
    Maman "1" --> "0..*" RendezVous : prend
    Maman "1" --> "1" CarteSante : possède
    
    Bebe "1" --> "0..*" Consultation : a
    Bebe "1" --> "0..*" Vaccination : a
    
    Grossesse "1" --> "0..*" Consultation : a
    
    Professionnel "1" --> "0..*" Consultation : effectue
    Professionnel "1" --> "0..*" RendezVous : gère
    Professionnel "1" --> "0..*" Vaccination : administre
    Professionnel "1" --> "0..*" Grossesse : valide
    
    RendezVous "1" --> "1" Consultation : mène à
```

## 3. Diagrammes de Séquence

### 3.1 Déclaration de Grossesse

```mermaid
sequenceDiagram
    participant M as Maman
    participant Sys as Système
    participant P as Professionnel

    M->>Sys: Déclare sa grossesse
    Sys->>Sys: Enregistre déclaration
    Sys-->>M: Confirmation (statut: EN_ATTENTE)
    
    Note over P: Validation par professionnel
    
    P->>Sys: Valide la grossesse
    Sys->>Sys: Met à jour le statut
    Sys-->>M: Notification (statut: VALIDÉE)
```

### 3.2 Consultation de Bébé

```mermaid
sequenceDiagram
    participant M as Maman
    participant Sys as Système
    participant P as Professionnel

    M->>Sys: Consulte dossier bébé
    Sys-->>M: Affiche informations
    
    Note over P: Lors d'une consultation
    
    P->>Sys: Enregistre consultation
    Sys->>Sys: Sauvegarde données (poids, taille, notes)
    Sys-->>M: Mise à jour du dossier
    
    P->>Sys: Met à jour vaccination
    Sys->>Sys: Enregistre vaccin administré
    Sys-->>M: Notification nouveau vaccin
```

### 3.3 Scan QR Code par Professionnel

```mermaid
sequenceDiagram
    participant P as Professionnel
    participant Sys as Système
    participant M as Maman

    P->>Sys: Scan QR Code patient
    Sys->>Sys: Recherche patient par QR
    Sys-->>P: Affiche dossier médical
    
    P->>Sys: Enregistre nouvelle consultation
    Sys->>Sys: Sauvegarde consultation
    
    P->>Sys: Met à jour vaccinations
    Sys->>Sys: Met à jour statut vaccins
    
    Sys-->>M: Notification mise à jour
```

### 3.4 Création de Compte Professionnel

```mermaid
sequenceDiagram
    participant P as Professionnel
    participant Sys as Système
    participant A as Administrateur

    P->>Sys: Crée un compte
    Sys->>Sys: Enregistre compte (non validé)
    Sys-->>P: Compte créé (en attente validation)
    
    Note over A: Validation par administrateur
    
    A->>Sys: Valide le professionnel
    Sys->>Sys: Active le compte
    Sys-->>P: Notification compte activé
```

### 3.5 Prise de Rendez-vous

```mermaid
sequenceDiagram
    participant M as Maman
    participant Sys as Système

    M->>Sys: Demande rendez-vous
    Sys->>Sys: Vérifie disponibilité
    Sys-->>M: Propose créneaux disponibles
    
    M->>Sys: Confirme rendez-vous
    Sys->>Sys: Enregistre rendez-vous
    Sys-->>M: Rendez-vous confirmé
    
    Note over M: Jour J
    
    M->>Sys: Se présente au rendez-vous
    Sys-->>M: Marque rendez-vous terminé
```

## 4. Résumé des Acteurs et Cas d'Utilisation

| Acteur | Cas d'utilisation principaux |
|--------|----------------------------|
| **Maman** | S'inscrire, Se connecter, Déclarer grossesse, Suivre grossesse, Consulter dossier bébé, Voir vaccinations, Télécharger carte QR, Prendre rendez-vous |
| **Professionnel** | Se connecter, Valider grossesses, Enregistrer consultations, Mettre à jour vaccinations, Scanner QR, Consulter dossiers, Gérer rendez-vous |
| **Administrateur** | Se connecter, Gérer utilisateurs, Valider professionnels, Consulter statistiques, Valider déclarations |
