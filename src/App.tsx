
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Compare from "./pages/Compare";
import Clinics from "./pages/Clinics";
import HowItWorks from "./pages/HowItWorks";
import QA from "./pages/QA";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DirectoryDisclaimer from "./pages/DirectoryDisclaimer";
import NotFound from "./pages/NotFound";
import PartnerApplication from "./pages/PartnerApplication";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/clinics" element={<Clinics />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/qa" element={<QA />} />
            <Route path="/partner-application" element={<PartnerApplication />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/directory-disclaimer" element={<DirectoryDisclaimer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
