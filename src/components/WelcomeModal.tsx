
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useModal } from '@/contexts/ModalContext';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, Sparkles, TrendingUp } from 'lucide-react';

const WelcomeModal = () => {
  const { showWelcomeModal, dismissWelcomeModal } = useModal();
  const navigate = useNavigate();

  const handleJoinNow = () => {
    navigate('/auth');
    dismissWelcomeModal();
  };

  return (
    <Dialog open={showWelcomeModal} onOpenChange={dismissWelcomeModal}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <button
          onClick={dismissWelcomeModal}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 z-10"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader className="text-center space-y-4 pt-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Hey! You haven't joined IdeoPark yet?
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-6 py-6">
          <p className="text-slate-600 text-lg">You're missing out on:</p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <span className="text-green-800 font-medium">Real equity for your ideas</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
              <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0" />
              <span className="text-blue-800 font-medium">A place to be discovered</span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
              <CheckCircle className="h-6 w-6 text-purple-600 flex-shrink-0" />
              <span className="text-purple-800 font-medium">The future of startup creation</span>
            </div>
          </div>
          
          <div className="pt-4">
            <p className="text-slate-700 font-medium mb-4">👉 Click below to join the movement.</p>
            <Button
              onClick={handleJoinNow}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Join Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WelcomeModal;
