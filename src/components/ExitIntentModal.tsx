
import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useModal } from '@/contexts/ModalContext';
import { useNavigate } from 'react-router-dom';
import { Star, Heart, Shield } from 'lucide-react';

const ExitIntentModal = () => {
  const { showExitIntentModal, dismissExitIntentModal } = useModal();
  const navigate = useNavigate();

  const handleLoginToSave = () => {
    navigate('/auth');
    dismissExitIntentModal();
  };

  const handleLeaveAnyway = () => {
    dismissExitIntentModal();
    // Navigate to home page when leaving anyway
    navigate('/');
  };

  return (
    <AlertDialog open={showExitIntentModal} onOpenChange={dismissExitIntentModal}>
      <AlertDialogContent className="sm:max-w-lg border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-white" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-slate-900">
            Wait! Your idea is almost ready to shine 🌟
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="text-center space-y-6 py-6">
          <p className="text-slate-600 text-lg leading-relaxed">
            We noticed you're leaving without finishing…
          </p>
          
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-semibold text-slate-800">We believe every idea matters</span>
            </div>
            <p className="text-slate-700">— especially yours.</p>
          </div>
          
          <p className="text-slate-700 font-medium">
            Want to save your progress?
          </p>
        </div>
        
        <AlertDialogFooter className="flex flex-col sm:flex-col space-y-3 sm:space-y-3 sm:space-x-0">
          <Button
            onClick={handleLoginToSave}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Shield className="h-5 w-5 mr-2" />
            Login to Save My Idea
          </Button>
          <Button
            onClick={handleLeaveAnyway}
            variant="ghost"
            className="w-full text-slate-600 hover:text-slate-800 py-3 px-6 rounded-xl hover:bg-slate-100 transition-all duration-300"
          >
            No Thanks, I'll Leave Anyway
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExitIntentModal;
