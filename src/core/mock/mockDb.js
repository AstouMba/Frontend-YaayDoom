import {
  mockConsultations,
  mockGrossesses,
  mockProfessionnelsEnAttente,
  mockStats,
  mockUtilisateurs,
  mockVaccins,
  mockBebes,
  mockRendezVous,
  mockCroissanceBebe,
  mockFamilles,
} from '../../mocks/db';

const MOCK_DB_KEY = 'yaydoom_mock_db';
const storage = typeof globalThis !== 'undefined' ? globalThis.localStorage : undefined;

const clone = (value) => JSON.parse(JSON.stringify(value));

const defaultDb = () => ({
  grossesses: clone(mockGrossesses),
  bebes: clone(mockBebes),
  vaccins: clone(mockVaccins),
  consultations: clone(mockConsultations),
  rendezVous: clone(mockRendezVous),
  croissanceBebe: clone(mockCroissanceBebe),
  familles: clone(mockFamilles),
  utilisateurs: clone(mockUtilisateurs),
  professionnelsEnAttente: clone(mockProfessionnelsEnAttente),
  stats: clone(mockStats),
});

export const isMockToken = (token) => typeof token === 'string' && token.startsWith('mock-token-');

export const isMockSession = () => {
  if (!storage) return false;
  return isMockToken(storage.getItem('yaydoom_token'));
};

export const getMockUser = () => {
  if (!storage) return null;

  try {
    const raw = storage.getItem('yaydoom_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getMockUserRole = () => getMockUser()?.role || null;

export const getMockDb = () => {
  if (!storage) {
    return defaultDb();
  }

  try {
    const raw = storage.getItem(MOCK_DB_KEY);
    if (!raw) return defaultDb();

    const parsed = JSON.parse(raw);
    return {
      ...defaultDb(),
      ...parsed,
    };
  } catch {
    return defaultDb();
  }
};

export const setMockDb = (db) => {
  if (!storage) return;
  storage.setItem(MOCK_DB_KEY, JSON.stringify(db));
};

export const updateMockDb = (updater) => {
  const db = getMockDb();
  const result = updater(db);
  setMockDb(db);
  return result === undefined ? db : result;
};

export const resetMockDb = () => {
  setMockDb(defaultDb());
};

export const weekFromDate = (startDate) => {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7)));
};

export const formatDateFr = (date) =>
  date
    ? new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';
