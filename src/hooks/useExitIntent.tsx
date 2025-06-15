
import { useEffect, useRef } from 'react';

interface UseExitIntentProps {
  onExitIntent: (path: string | null) => void;
  isEnabled: boolean;
}

export const useExitIntent = ({ onExitIntent, isEnabled }: UseExitIntentProps) => {
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    if (!isEnabled) {
      hasTriggeredRef.current = false;
      return;
    }

    console.log('Exit intent enabled, setting up listeners');

    const triggerOnce = (path: string | null = null) => {
      if (!hasTriggeredRef.current) {
        console.log('Exit intent triggered with path:', path);
        hasTriggeredRef.current = true;
        onExitIntent(path);
      }
    };

    // Handle mouse leaving the top of the screen
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && e.relatedTarget === null) {
        console.log('Mouse left screen top');
        triggerOnce();
      }
    };

    // Handle browser back/forward/refresh
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log('Before unload triggered');
      triggerOnce();
      e.preventDefault();
      e.returnValue = '';
    };

    // Handle browser back button
    const handlePopState = (e: PopStateEvent) => {
      console.log('Popstate triggered');
      e.preventDefault();
      triggerOnce();
    };

    // Handle all link clicks (internal navigation)
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        console.log('Link clicked:', link.href, 'Current:', window.location.href);
        
        // Skip if it's the same page or just an anchor
        if (link.href === window.location.href || 
            (link.pathname === window.location.pathname && link.hash)) {
          return;
        }

        // Skip if opening in new tab
        if (link.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) {
          return;
        }

        // Always prevent navigation and trigger modal
        e.preventDefault();
        e.stopPropagation();
        
        const fullPath = link.pathname + link.search + link.hash;
        console.log('Preventing navigation to:', fullPath);
        triggerOnce(fullPath);
      }
    };

    // Add event listeners
    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);
    document.addEventListener('click', handleLinkClick, true); // Use capture phase

    // Cleanup
    return () => {
      console.log('Cleaning up exit intent listeners');
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick, true);
      hasTriggeredRef.current = false;
    };
  }, [onExitIntent, isEnabled]);
};
