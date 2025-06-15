
import React, { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Star, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const DesktopExitIntentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Only work for non-authenticated users
    if (user || hasTriggered) return;

    // Check if already triggered in this session
    if (sessionStorage.getItem('exitIntentTriggered')) {
      setHasTriggered(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Trigger when mouse leaves the top of the viewport (desktop only)
      if (!isMobile && e.clientY <= 0 && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem('exitIntentTriggered', 'true');
      }
    };

    const handleTouchStart = () => {
      // For mobile, trigger on scroll to top
      if (isMobile && window.scrollY === 0 && !hasTriggered) {
        setTimeout(() => {
          if (window.scrollY === 0 && !hasTriggered) {
            setIsOpen(true);
            setHasTriggered(true);
            sessionStorage.setItem('exitIntentTriggered', 'true');
          }
        }, 1000); // Delay to avoid accidental triggers
      }
    };

    const handleVisibilityChange = () => {
      // Trigger when page becomes hidden (works on both desktop and mobile)
      if (document.visibilityState === 'hidden' && !hasTriggered) {
        setIsOpen(true);
        setHasTriggered(true);
        sessionStorage.setItem('exitIntentTriggered', 'true');
      }
    };

    // Add appropriate event listeners based on device type
    if (isMobile) {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else {
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      if (isMobile) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      } else {
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      }
    };
  }, [isMobile, user, hasTriggered]);

  const handleSignup = () => {
    setIsOpen(false);
    navigate('/auth');
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (user) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-lg border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-slate-900">
            Wait! Want 5% equity for your idea?
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="text-center space-y-6 py-6">
          <p className="text-slate-600 text-lg leading-relaxed">
            Don't leave without unlocking premium startup opportunities!
          </p>
          
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold text-slate-800">Get 5-15% equity</span>
            </div>
            <p className="text-slate-700">for sharing your brilliant ideas</p>
          </div>
          
          <p className="text-slate-700 font-medium">
            Join thousands who've already started their entrepreneurial journey.
          </p>
        </div>
        
        <AlertDialogFooter className="flex flex-col space-y-3">
          <Button
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl"
          >
            <Star className="h-5 w-5 mr-2" />
            Sign Up Now & Get Started
          </Button>
          <Button
            onClick={handleClose}
            variant="ghost"
            className="w-full text-slate-600 hover:text-slate-800"
          >
            Maybe Later
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DesktopExitIntentModal;
