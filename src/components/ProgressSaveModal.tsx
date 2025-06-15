
import React from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Save, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProgressSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: () => void;
}

const ProgressSaveModal = ({ isOpen, onClose, onSignup }: ProgressSaveModalProps) => {
  const navigate = useNavigate();

  const handleSignup = () => {
    onSignup();
    navigate('/auth');
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-4">
            <Save className="h-8 w-8 text-white" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-slate-900">
            Save Your Progress
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="text-center space-y-4 py-4">
          <p className="text-slate-600 text-lg leading-relaxed">
            Don't lose your amazing idea! 
          </p>
          
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="font-semibold text-slate-800">Login to save your progress</span>
            </div>
            <p className="text-slate-700 text-sm">and come back anytime to continue.</p>
          </div>
        </div>
        
        <AlertDialogFooter className="flex flex-col space-y-3">
          <Button
            onClick={handleSignup}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Progress & Continue
          </Button>
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-slate-600 hover:text-slate-800"
          >
            Continue Without Saving
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ProgressSaveModal;
