
import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  showWelcomeModal: boolean;
  showExitIntentModal: boolean;
  hasInteractedWithForm: boolean;
  intendedPath: string | null;
  setShowWelcomeModal: (show: boolean) => void;
  showExitIntentModalWithPath: (path: string | null) => void;
  setHasInteractedWithForm: (interacted: boolean) => void;
  dismissWelcomeModal: () => void;
  dismissExitIntentModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showExitIntentModal, setShowExitIntentModal] = useState(false);
  const [hasInteractedWithForm, setHasInteractedWithForm] = useState(false);
  const [intendedPath, setIntendedPath] = useState<string | null>(null);

  const dismissWelcomeModal = () => {
    setShowWelcomeModal(false);
    // Remember that user has seen the welcome modal in this session
    sessionStorage.setItem('welcomeModalShown', 'true');
  };

  const showExitIntentModalWithPath = (path: string | null) => {
    setIntendedPath(path);
    setShowExitIntentModal(true);
  };

  const dismissExitIntentModal = () => {
    setShowExitIntentModal(false);
    // Reset form interaction state when modal is dismissed
    setHasInteractedWithForm(false);
    setIntendedPath(null);
  };

  return (
    <ModalContext.Provider
      value={{
        showWelcomeModal,
        showExitIntentModal,
        hasInteractedWithForm,
        intendedPath,
        setShowWelcomeModal,
        showExitIntentModalWithPath,
        setHasInteractedWithForm,
        dismissWelcomeModal,
        dismissExitIntentModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
