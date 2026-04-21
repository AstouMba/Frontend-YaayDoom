import { lazy } from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardMamanLayout from '../layouts/DashboardMamanLayout';
import DashboardProLayout from '../layouts/DashboardProLayout';
import DashboardAdminLayout from '../layouts/DashboardAdminLayout';
import DossierFamilial from '../components/famille/DossierFamilial';

// Pages originales dans src/pages/
const HomePage = lazy(() => import('../pages/home/page'));
const NotFound = lazy(() => import('../pages/NotFound'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));

// Pages maman
const DashboardMaman = lazy(() => import('../pages/dashboard/DashboardMaman'));
const Bebe = lazy(() => import('../pages/bebe/Bebe'));
const Vaccination = lazy(() => import('../pages/vaccination/Vaccination'));
const CreateGrossesse = lazy(() => import('../pages/grossesse/CreateGrossesse'));
const Grossesse = lazy(() => import('../pages/grossesse/Grossesse'));
const RendezVous = lazy(() => import('../pages/rendezvous/RendezVous'));

// Pages professionnel
const DashboardPro = lazy(() => import('../pages/dashboard/DashboardPro'));
const Consultations = lazy(() => import('../pages/dashboard/Consultations'));
const Grossesses = lazy(() => import('../pages/dashboard/Grossesses'));
const VaccinationsPro = lazy(() => import('../pages/dashboard/VaccinationsPro'));
const ScanPatient = lazy(() => import('../pages/scan/ScanPatient'));
const ConsultationPatient = lazy(() => import('../pages/consultation/ConsultationPatient'));

// Pages admin
const DashboardAdmin = lazy(() => import('../pages/admin/DashboardAdmin'));
const Statistiques = lazy(() => import('../pages/admin/Statistiques'));
const Utilisateurs = lazy(() => import('../pages/admin/Utilisateurs'));
const Validation = lazy(() => import('../pages/admin/Validation'));

const routes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },

  // ─── Maman ──────────────────────────────────────────────────────────
  {
    path: '/dashboard-maman',
    element: (
      <ProtectedRoute allowedRoles={['maman']}>
        <DashboardMamanLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardMaman /> },
      { path: 'bebe', element: <Bebe /> },
      { path: 'vaccination', element: <Vaccination /> },
      { path: 'carte', element: <Navigate to="/dashboard-maman" replace /> },
      { path: 'grossesse', element: <Grossesse /> },
      { path: 'rendez-vous', element: <RendezVous /> },
      { path: 'create-grossesse', element: <CreateGrossesse /> },
    ],
  },

  // ─── Professionnel ──────────────────────────────────────────────────
  {
    path: '/dashboard-pro',
    element: (
      <ProtectedRoute allowedRoles={['professionnel']}>
        <DashboardProLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPro /> },
      { path: 'consultations', element: <Consultations /> },
      { path: 'grossesses', element: <Grossesses /> },
      { path: 'vaccinations', element: <VaccinationsPro /> },
      { path: 'scan', element: <ScanPatient /> },
      { path: 'consultation-patient', element: <ConsultationPatient /> },
    ],
  },

  // ─── Dossier Familial ─────────────────────────────────────────────────
  {
    path: '/famille/:id',
    element: (
      <ProtectedRoute allowedRoles={['professionnel']}>
        <DashboardProLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <DossierFamilial /> }],
  },

  // ─── Anciens liens scan (redirection) ───────────────────────────────
  {
    path: '/scan-patient',
    element: (
      <ProtectedRoute allowedRoles={['professionnel']}>
        <DashboardProLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <ScanPatient /> }],
  },
  {
    path: '/consultation-patient',
    element: (
      <ProtectedRoute allowedRoles={['professionnel']}>
        <DashboardProLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <ConsultationPatient /> }],
  },

  // ─── Admin ──────────────────────────────────────────────────────────
  {
    path: '/dashboard-admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardAdminLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <DashboardAdmin /> }],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <DashboardAdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'validation', element: <Validation /> },
      { path: 'utilisateurs', element: <Utilisateurs /> },
      { path: 'statistiques', element: <Statistiques /> },
    ],
  },

  { path: '*', element: <NotFound /> },
];

export default routes;
