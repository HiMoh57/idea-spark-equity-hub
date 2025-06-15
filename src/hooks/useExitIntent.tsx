
import { useEffect } from 'react';
import { useNavigate, useBlocker } from 'react-router-dom';

interface UseExitIntentProps {
  onExitIntent: () => void;
  isEnabled: boolean;
}

export const useExitIntent = ({ onExitIntent, isEnabled }: UseExitIntentProps) => {
  const navigate = useNavigate();
  
  // Block navigation when enabled
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isEnabled && currentLocation.pathname !== nextLocation.pathname
  );

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

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [onExitIntent, isEnabled]);

  // Handle blocked navigation
  useEffect(() => {
    if (blocker.state === 'blocked') {
      onExitIntent();
    }
  }, [blocker.state, onExitIntent]);
};
