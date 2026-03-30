import { useEffect, useMemo, useState } from 'react';
import { getAllConsultations } from '../../features/professionnel/services/professionnelService';

type FilterType = 'TOUS' | 'Consultation prénatale' | 'Échographie' | 'Consultation de suivi' | 'Consultation d\'urgence';

interface Consultation {
  id: string;
  patientName: string;
  patientId: string;
  type: string;
  date: string;
  tensionArterielle: string;
  poids: string;
  notes: string;
  semaineGrossesse: number;
}

const Consultations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('TOUS');
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  useEffect(() => {
    getAllConsultations()
      .then((data) => setConsultations(Array.isArray(data) ? data : []))
      .catch(() => setConsultations([]));
  }, []);

  const filteredConsultations = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();

    return consultations.filter((c) => {
      const matchSearch =
        !q || c.patientName.toLowerCase().includes(q) || c.patientId.toLowerCase().includes(q);
      const matchType = filterType === 'TOUS' || c.type === filterType;
      return matchSearch && matchType;
    });
  }, [consultations, searchTerm, filterType]);

  return (
    <div className="p-6 max-w-full">
      <div className="mb-6">
        <h1 className="text-xl font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
          Consultations
        </h1>
        <p className="text-sm text-gray-600">
          Historique de toutes les consultations effectuees
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total consultations</p>
              <p className="text-xl font-bold" style={{ color: 'var(--primary-teal)' }}>
                {consultations.length}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
              <i className="ri-stethoscope-line text-lg" style={{ color: 'var(--primary-teal)' }}></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Prenatales</p>
              <p className="text-xl font-bold" style={{ color: 'var(--primary-orange)' }}>
                {consultations.filter((c) => c.type === 'Consultation prénatale').length}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
              <i className="ri-heart-pulse-line text-lg" style={{ color: 'var(--primary-orange)' }}></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Echographies</p>
              <p className="text-xl font-bold" style={{ color: 'var(--dark-brown)' }}>
                {consultations.filter((c) => c.type === 'Échographie').length}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
              <i className="ri-scan-line text-lg" style={{ color: 'var(--dark-brown)' }}></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 mb-1">Urgences</p>
              <p className="text-xl font-bold text-red-600">
                {consultations.filter((c) => c.type === 'Consultation d\'urgence').length}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50">
              <i className="ri-alarm-warning-line text-lg text-red-600"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Rechercher par nom ou ID patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as FilterType)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
            >
              <option value="TOUS">Tous les types</option>
              <option value="Consultation prénatale">Consultation prénatale</option>
              <option value="Échographie">Échographie</option>
              <option value="Consultation de suivi">Consultation de suivi</option>
              <option value="Consultation d'urgence">Consultation d'urgence</option>
            </select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {filteredConsultations.map((consultation) => (
          <div key={consultation.id} className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--background-soft)' }}>
                  <i className="ri-user-line text-base" style={{ color: 'var(--primary-orange)' }}></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--dark-brown)' }}>
                    {consultation.patientName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">ID: {consultation.patientId}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--background-soft)', color: 'var(--primary-teal)' }}>
                      <i className="ri-calendar-line mr-1"></i>
                      {new Date(consultation.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      {consultation.semaineGrossesse} SA
                    </span>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--primary-teal)', color: 'white' }}>
                    {consultation.type}
                  </span>
                </div>
              </div>

              <div className="flex-1 lg:max-w-2xl">
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <div className="text-xs text-gray-600 mb-1">Tension arterielle</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>
                      {consultation.tensionArterielle}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'var(--background-soft)' }}>
                    <div className="text-xs text-gray-600 mb-1">Poids</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--dark-brown)' }}>
                      {consultation.poids}
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1 font-medium">Notes et observations</div>
                  <p className="text-sm text-gray-700">{consultation.notes || 'Aucune note'}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredConsultations.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <i className="ri-inbox-line text-5xl text-gray-300 mb-3"></i>
          <p className="text-sm text-gray-500">Aucune consultation trouvee</p>
        </div>
      )}
    </div>
  );
};

export default Consultations;
