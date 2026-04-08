import { useState } from 'react';

export interface MembreFamilial {
  id: string;
  nom: string;
  type: 'maman' | 'bebe';
  age?: number;
  lien?: string;
}

export interface DossierFamilial {
  estGemellaire: boolean;
  membres: MembreFamilial[];
}

interface FamilyOverviewProps {
  dossier: DossierFamilial;
  onSelectMember: (membre: MembreFamilial) => void;
}

const FamilyOverview = ({ dossier, onSelectMember }: FamilyOverviewProps) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(dossier.membres[0]?.id || null);

  const handleSelectMember = (membre: MembreFamilial) => {
    setSelectedMemberId(membre.id);
    onSelectMember(membre);
  };

  const mereMembre = dossier.membres.find((m) => m.type === 'maman');
  const bebesMembres = dossier.membres.filter((m) => m.type === 'bebe');

  return (
    <div className="space-y-4">
      {mereMembre && (
        <div
          onClick={() => handleSelectMember(mereMembre)}
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            selectedMemberId === mereMembre.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
          }`}
          style={{ borderColor: selectedMemberId === mereMembre.id ? 'var(--primary-teal)' : '#EAD7C8' }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'var(--primary-teal)' }}>
              <i className="ri-woman-line text-2xl"></i>
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: 'var(--dark-brown)' }}>Mère</p>
              <p className="font-bold text-lg" style={{ color: 'var(--dark-brown)' }}>{mereMembre.nom}</p>
              {mereMembre.age && <p className="text-sm text-gray-500">{mereMembre.age} ans</p>}
            </div>
          </div>
        </div>
      )}

      {dossier.estGemellaire && (
        <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: 'var(--primary-orange)' }}>
          <i className="ri-woman-line text-xl text-white"></i>
          <span className="font-medium text-white">Grossesse Gémellaire</span>
        </div>
      )}

      {bebesMembres.length > 0 && (
        <div className="space-y-3">
          <p className="font-medium text-sm" style={{ color: 'var(--dark-brown)' }}>
            {bebesMembres.length === 1 ? 'Enfant' : 'Enfants'}
          </p>
          {bebesMembres.map((bebe) => (
            <div
              key={bebe.id}
              onClick={() => handleSelectMember(bebe)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedMemberId === bebe.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
              }`}
              style={{ borderColor: selectedMemberId === bebe.id ? 'var(--primary-teal)' : '#EAD7C8' }}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'var(--primary-orange)' }}>
                  <i className="ri-baby-line text-2xl"></i>
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: 'var(--dark-brown)' }}>{bebe.nom}</p>
                  {bebe.age && <p className="text-sm text-gray-500">{bebe.age} mois</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FamilyOverview;
