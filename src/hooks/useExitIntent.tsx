
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface UseExitIntentProps {
  onExitIntent: () => void;
  isEnabled: boolean;
}

export const useExitIntent = ({ onExitIntent, isEnabled }: UseExitIntentProps) => {
  const location = useLocation();

  useEffect(() => {
    if (!isEnabled) return;

    let hasTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the page
      if (e.clientY <= 0 && !hasTriggered) {
        hasTriggered = true;
        onExitIntent();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!hasTriggered) {
        hasTriggered = true;
        onExitIntent();
        // This will show browser's default confirmation dialog
        e.preventDefault();
        e.returnValue = '';
      }
    };

    // Handle navigation within the app
    const handlePopState = () => {
      if (!hasTriggered && isEnabled) {
        hasTriggered = true;
        onExitIntent();
      }
    };

    // Handle clicks on links that would navigate away
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a, [role="button"]');
      
      if (link && !hasTriggered && isEnabled) {
        // Check if it's a navigation link (not just any button)
        const href = link.getAttribute('href');
        const role = link.getAttribute('role');
        
        if (href || role === 'button') {
          hasTriggered = true;
          e.preventDefault();
          onExitIntent();
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleLinkClick, true);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick, true);
    };
  }, [onExitIntent, isEnabled, location]);
};
