# Schema Technique - Dossier Familial YaayDoom+

## 1. Principe
Chaque membre conserve son dossier médical indépendant. Le Dossier Familial est une **couche de navigation unifiée**.

## 2. Structures de Donnees

### DossierFamilial
```typescript
interface DossierFamilial {
  id: string;           // QR Code ID
  mamanId: string;
  membres: MembreFamilial[];
  grossesses: Grossesse[];
  estGemellaire: boolean;
}

interface MembreFamilial {
  id: string;
  type: 'maman' | 'bebe';
  lien: string;
  nom: string;
  photoUrl?: string;
  age?: number;
  estActif: boolean;
}
```

### Panels
- **Maman**: 3 onglets (Infos Grossesse, Consultations, RDV)
- **Bebe**: 3 onglets (Vaccinal, MesuresJour, Evolution + Courbe OMS)

## 3. Familles Test
1. **Simple**: Aminata Diallo + 1 bebe
2. **Jumeaux**: Fatou Sall + Moussa + Mariama

## 4. Composants a Creer
```
src/components/famille/
├── DossierFamilial.tsx
├── FamilyOverview.tsx
├── ConsultationMamanPanel.tsx
├── ConsultationBebePanel.tsx
├── CourbeCroissance.tsx
└── types.ts
```

## 5. Routes
```
/famille/:id         # FamilyOverview
/famille/:id/maman   # Panel mere
/famille/:id/bebe/:id # Panel bebe
```

## 6. Checklist
- [ ] Mock DB familles test
- [ ] Types TypeScript
- [ ] DossierFamilial container
- [ ] FamilyOverview selecteur
- [ ] Panels mere/bebe
- [ ] Courbe croissance OMS
- [ ] Integration ScanPatient
