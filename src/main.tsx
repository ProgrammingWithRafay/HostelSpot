import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import OwnerRoute from './components/OwnerRoute';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Hostels = lazy(() => import('./pages/Hostels'));
const Cities = lazy(() => import('./pages/Cities'));
const HostelDetail = lazy(() => import('./pages/HostelDetail'));
const Book = lazy(() => import('./pages/Book'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Admin = lazy(() => import('./pages/Admin'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));
const OwnerDashboard = lazy(() => import('./pages/OwnerDashboard'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
import { Toaster } from 'sonner';
import './index.css';


function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
          <Navbar />
          <main className="flex-1">
            <Suspense fallback={
              <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            }>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/cities" element={<Cities />} />
                <Route path="/hostels" element={<Hostels />} />
                <Route path="/hostels/:id" element={<HostelDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />

                {/* Protected routes */}
                <Route path="/book/:id" element={
                  <ProtectedRoute><Book /></ProtectedRoute>
                } />
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />

                {/* Admin route */}
                <Route path="/admin" element={
                  <AdminRoute><Admin /></AdminRoute>
                } />

                {/* Owner route */}
                <Route path="/owner-dashboard" element={
                  <OwnerRoute><OwnerDashboard /></OwnerRoute>
                } />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <Toaster richColors position="top-center" expand={false} />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
