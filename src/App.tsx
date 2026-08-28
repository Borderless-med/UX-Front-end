import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { Suspense } from 'react';
import { AuthProvider } from "@/contexts/AuthContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { SecurityProvider } from "@/contexts/SecurityContext";
import CookieConsentBanner from "@/components/cookies/CookieConsentBanner";
import CookiePreferences from "@/components/cookies/CookiePreferences";
import MetaPixelTracker from "@/components/analytics/MetaPixelTracker";
import { Analytics } from '@vercel/analytics/react';

// Critical: Load immediately for homepage
import HomeV3_OralLink from "./pages/HomeV3_OralLink";

// Lazy load: Heavy components not needed for initial render
const ChatWidget = React.lazy(() => import("@/components/ChatWidget"));
const Compare = React.lazy(() => import("./pages/Compare"));
const ComparePrototype = React.lazy(() => import("./pages/ComparePrototype"));
const Clinics = React.lazy(() => import("./pages/Clinics"));
const HowItWorks = React.lazy(() => import("./pages/HowItWorks"));
const HowItWorksPrototype = React.lazy(() => import("./pages/HowItWorksPrototype"));
const BookNow = React.lazy(() => import("./pages/BookNow"));
const WinToothbrush = React.lazy(() => import("./pages/WinToothbrush"));
const PartnerApplication = React.lazy(() => import("./pages/PartnerApplication"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const TravelGuide = React.lazy(() => import("./pages/TravelGuide"));
const AIScanPage = React.lazy(() => import("./pages/AIScanPage"));
const FindClinicsPrototype1 = React.lazy(() => import("./pages/FindClinicsPrototype1"));

// Static pages: Can be lazy loaded
const QA = React.lazy(() => import("./pages/QA"));
const PrivacyPolicy = React.lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = React.lazy(() => import("./pages/TermsOfService"));
const DirectoryDisclaimer = React.lazy(() => import("./pages/DirectoryDisclaimer"));
const MedicalDisclaimer = React.lazy(() => import("./pages/MedicalDisclaimer"));
const CookiePolicy = React.lazy(() => import("./pages/CookiePolicy"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const DebugTest = React.lazy(() => import("./pages/DebugTest"));
const ConfirmWhatsApp = React.lazy(() => import("./pages/ConfirmWhatsApp"));
const OptOutReport = React.lazy(() => import("./pages/OptOutReport"));
const TestClinicSignup = React.lazy(() => import("./pages/TestClinicSignup"));
const CreatePassword = React.lazy(() => import("./pages/CreatePassword"));
const AuthCallback = React.lazy(() => import("./pages/AuthCallback"));
const HomePrototype_v2 = React.lazy(() => import("./pages/HomePrototype_v2"));
const HomePrototype = React.lazy(() => import("./pages/HomePrototype"));
const PrototypeHub = React.lazy(() => import("./pages/PrototypeHub"));
const TemplateDemo = React.lazy(() => import("./pages/TemplateDemo"));
const AdminRoute = React.lazy(() => import("@/components/admin/AdminRoute"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: 'linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ 
        width: '48px', 
        height: '48px', 
        border: '4px solid #e5e7eb', 
        borderTopColor: '#2563eb',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto'
      }} />
    </div>
  </div>
);

// Subdomain routing: orallink.orachope.org → serve the OralLink mockup page
if (typeof window !== 'undefined' && window.location.hostname === 'orallink.orachope.org') {
  window.location.replace('/mockup-orallink-subdomain-v3.html');
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecurityProvider>
        <CookieConsentProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            <MetaPixelTracker />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomeV3_OralLink />} />  {/* REVERT: swap HomeV3_OralLink → HomePrototype_v2 to restore original OraChope homepage */}
                <Route path="/win" element={<WinToothbrush />} />
                <Route path="/book-now" element={<BookNow />} />
                <Route path="/compare" element={<ComparePrototype />} />
                <Route path="/clinics" element={<FindClinicsPrototype1 />} />
                <Route path="/how-it-works" element={<HowItWorksPrototype />} />
                <Route path="/qa" element={<QA />} />
                <Route path="/partner-application" element={<PartnerApplication />} />
                <Route path="/opt-out-report" element={<OptOutReport />} />
                <Route path="/test-clinic-signup" element={<TestClinicSignup />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/directory-disclaimer" element={<DirectoryDisclaimer />} />
                <Route path="/medical-disclaimer" element={<MedicalDisclaimer />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/confirm-whatsapp" element={<ConfirmWhatsApp />} />
                <Route path="/debug-test" element={<DebugTest />} />
                <Route path="/create-password" element={<CreatePassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/home-prototype" element={<HomePrototype />} />
                <Route path="/home-prototype-v2" element={<HomePrototype_v2 />} />
                <Route path="/prototype-hub" element={<PrototypeHub />} />
                <Route path="/template-demo" element={<TemplateDemo />} />
                <Route path="/find-clinics-prototype1" element={<FindClinicsPrototype1 />} />
                <Route path="/travel-guide" element={<TravelGuide />} />
                <Route path="/admin/dashboard" element={
                  <Suspense fallback={<PageLoader />}>
                    <AdminRoute><AdminDashboard /></AdminRoute>
                  </Suspense>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <CookieConsentBanner />
            <CookiePreferences />
            <Suspense fallback={null}>
              <ChatWidget />
            </Suspense>
            <Analytics /> {/* --- CHANGE 2 of 2: Added this component here --- */}
          </BrowserRouter>
          </AuthProvider>
        </CookieConsentProvider>
      </SecurityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
