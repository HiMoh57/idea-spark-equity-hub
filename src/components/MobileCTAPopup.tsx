
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Smartphone } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const MobileCTAPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Only show on mobile for non-authenticated users
    if (!isMobile || user || isDismissed) return;

    // Check if already dismissed in this session
    if (sessionStorage.getItem('mobileCTADismissed')) {
      setIsDismissed(true);
      return;
    }

    // Show after 5 seconds on mobile
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isMobile, user, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('mobileCTADismissed', 'true');
  };

  const handleSignup = () => {
    navigate('/auth');
  };

  if (!isVisible || !isMobile || user || isDismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-2xl animate-in slide-in-from-bottom duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <Smartphone className="h-6 w-6 text-yellow-300" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Unlock Full Features</p>
            <p className="text-xs text-blue-100">Access premium startup ideas</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={handleSignup}
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
          >
            Sign Up
          </Button>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileCTAPopup;
