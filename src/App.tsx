import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { SecurityProvider } from "@/contexts/SecurityContext";
import CookieConsentBanner from "@/components/cookies/CookieConsentBanner";
import CookiePreferences from "@/components/cookies/CookiePreferences";
import ChatWidget from "@/components/ChatWidget";
import Index from "./pages/Index";
import Compare from "./pages/Compare";
import Clinics from "./pages/Clinics";
import HowItWorks from "./pages/HowItWorks";
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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/book-now" element={<BookNow />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/clinics" element={<Clinics />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
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
              <Route path="*" element={<NotFound />} />
            </Routes>
            <CookieConsentBanner />
            <CookiePreferences />
            <ChatWidget />
            <Analytics /> {/* --- CHANGE 2 of 2: Added this component here --- */}
          </BrowserRouter>
          </AuthProvider>
        </CookieConsentProvider>
      </SecurityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
