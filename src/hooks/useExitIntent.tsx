
import { useEffect } from 'react';

interface UseExitIntentProps {
  onExitIntent: (path: string | null) => void;
  isEnabled: boolean;
}

export const useExitIntent = ({ onExitIntent, isEnabled }: UseExitIntentProps) => {
  useEffect(() => {
    if (!isEnabled) return;

    let hasTriggered = false;

    const triggerOnce = (path: string | null = null) => {
      if (!hasTriggered) {
        hasTriggered = true;
        onExitIntent(path);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        triggerOnce();
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      triggerOnce();
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopState = () => {
      triggerOnce();
    };

    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        if (link.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) {
          return;
        }

        if (link.pathname === window.location.pathname && link.hash) {
          return;
        }

        const isInternalNav = link.origin === window.location.origin;
        if (isInternalNav && link.pathname !== window.location.pathname) {
          e.preventDefault();
          triggerOnce(link.pathname + link.search + link.hash);
        } else if (!isInternalNav) {
          e.preventDefault();
          triggerOnce(link.href);
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
  }, [onExitIntent, isEnabled]);
};
