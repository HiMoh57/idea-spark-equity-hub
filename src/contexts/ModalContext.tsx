
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ModalContextType {
  showWelcomeModal: boolean;
  showExitIntentModal: boolean;
  hasInteractedWithForm: boolean;
  setShowWelcomeModal: (show: boolean) => void;
  setShowExitIntentModal: (show: boolean) => void;
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

  const dismissWelcomeModal = () => {
    setShowWelcomeModal(false);
    // Remember that user has seen the welcome modal in this session
    sessionStorage.setItem('welcomeModalShown', 'true');
  };

  const dismissExitIntentModal = () => {
    setShowExitIntentModal(false);
  };

  return (
    <ModalContext.Provider
      value={{
        showWelcomeModal,
        showExitIntentModal,
        hasInteractedWithForm,
        setShowWelcomeModal,
        setShowExitIntentModal,
        setHasInteractedWithForm,
        dismissWelcomeModal,
        dismissExitIntentModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
