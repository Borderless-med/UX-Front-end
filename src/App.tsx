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
const ChatWidget = React.lazy(() => import("@/components/ChatWidget"));
import Index from "./pages/Index";
import Compare from "./pages/Compare";
import ComparePrototype from "./pages/ComparePrototype";
import Clinics from "./pages/Clinics";
import HowItWorks from "./pages/HowItWorks";
import HowItWorksPrototype from "./pages/HowItWorksPrototype";
import QA from "./pages/QA";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DirectoryDisclaimer from "./pages/DirectoryDisclaimer";
import MedicalDisclaimer from "./pages/MedicalDisclaimer";
import CookiePolicy from "./pages/CookiePolicy";
import NotFound from "./pages/NotFound";
import DebugTest from "./pages/DebugTest";
import PartnerApplication from "./pages/PartnerApplication";
import ConfirmWhatsApp from "./pages/ConfirmWhatsApp";
import OptOutReport from "./pages/OptOutReport";
import TestClinicSignup from "./pages/TestClinicSignup";
import BookNow from "./pages/BookNow";
import { Analytics } from '@vercel/analytics/react'; // --- CHANGE 1 of 2: Added this import line ---
import CreatePassword from "./pages/CreatePassword";
import HomePrototype_v2 from "./pages/HomePrototype_v2";
import HomePrototype from "./pages/HomePrototype";
import FindClinicsPrototype1 from "./pages/FindClinicsPrototype1";
import PrototypeHub from "./pages/PrototypeHub";
import TemplateDemo from "./pages/TemplateDemo";
import TravelGuide from "./pages/TravelGuide";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecurityProvider>
        <CookieConsentProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
            {(() => {
              const usePrototypes = (import.meta as any).env?.VITE_USE_PROTOTYPES === 'true' || (import.meta as any).env?.MODE === 'development';
              return (
            <Routes>
              <Route path="/" element={usePrototypes ? <HomePrototype_v2 /> : <Index />} />
              <Route path="/book-now" element={<BookNow />} />
              <Route path="/compare" element={usePrototypes ? <ComparePrototype /> : <Compare />} />
              <Route path="/clinics" element={usePrototypes ? <FindClinicsPrototype1 /> : <Clinics />} />
              <Route path="/how-it-works" element={usePrototypes ? <HowItWorksPrototype /> : <HowItWorks />} />
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
              <Route path="/home-prototype" element={<HomePrototype />} />
              <Route path="/home-prototype-v2" element={<HomePrototype_v2 />} />
              <Route path="/prototype-hub" element={<PrototypeHub />} />
              <Route path="/template-demo" element={<TemplateDemo />} />
              <Route path="/find-clinics-prototype1" element={<FindClinicsPrototype1 />} />
              <Route path="/travel-guide" element={<TravelGuide />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
              );
            })()}
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
