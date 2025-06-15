
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import SubmitIdea from "./pages/SubmitIdea";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Disclaimer from "./pages/Disclaimer";
import Pricing from "./pages/Pricing";
import PaymentSuccess from "./pages/PaymentSuccess";
import NotFound from "./pages/NotFound";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import HowItWorks from "./pages/HowItWorks";
import AboutUs from "./pages/AboutUs";
import ViewRequest from "./pages/ViewRequest";
import EditIdea from "./pages/EditIdea";
import ViewProposal from "./pages/ViewProposal";
import RealtimeNotifications from "./components/RealtimeNotifications";
import { useAuth } from '@/hooks/useAuth';
import OnboardingModal from '@/components/OnboardingModal';
import { ModalProvider } from '@/contexts/ModalContext';
import WelcomeModal from '@/components/WelcomeModal';
import ExitIntentModal from '@/components/ExitIntentModal';
import DelayedSignupBanner from '@/components/DelayedSignupBanner';
import MobileCTAPopup from '@/components/MobileCTAPopup';
import DesktopExitIntentModal from '@/components/DesktopExitIntentModal';

const queryClient = new QueryClient();

const App = () => {
  const { showOnboarding, setShowOnboarding } = useAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ModalProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RealtimeNotifications />
            <DelayedSignupBanner />
            <MobileCTAPopup />
            <DesktopExitIntentModal />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/submit-idea" element={<SubmitIdea />} />
              <Route path="/edit-idea/:id" element={<EditIdea />} />
              <Route path="/view-request/:id" element={<ViewRequest />} />
              <Route path="/view-proposal/:id" element={<ViewProposal />} />
              <Route path="/profile/:id" element={<PublicProfile />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/disclaimer" element={<Disclaimer />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <OnboardingModal 
              isOpen={showOnboarding} 
              onClose={() => setShowOnboarding(false)} 
            />
            <WelcomeModal />
            <ExitIntentModal />
          </BrowserRouter>
        </ModalProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
