
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DelayedSignupBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Don't show for authenticated users
    if (user || isDismissed) return;

    // Check if already dismissed in this session
    if (sessionStorage.getItem('signupBannerDismissed')) {
      setIsDismissed(true);
      return;
    }

    let timeoutTriggered = false;
    let scrollTriggered = false;

    // Timer for 15 seconds
    const timer = setTimeout(() => {
      timeoutTriggered = true;
      if (!scrollTriggered) {
        setIsVisible(true);
      }
    }, 15000);

    // Scroll listener for 50%
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      
      if (scrollPercentage >= 50 && !scrollTriggered) {
        scrollTriggered = true;
        if (!timeoutTriggered) {
          clearTimeout(timer);
        }
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [user, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('signupBannerDismissed', 'true');
  };

  const handleSignup = () => {
    navigate('/auth');
  };

  if (!isVisible || user || isDismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 shadow-lg animate-in slide-in-from-top duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Zap className="h-5 w-5 text-yellow-300" />
          <span className="font-semibold">🚀 Get access to the smartest startup ideas. Sign up now!</span>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleSignup}
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 font-semibold"
          >
            Sign Up Free
          </Button>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DelayedSignupBanner;
