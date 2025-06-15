
import React, { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownWelcome, setHasShownWelcome] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !hasShownWelcome) {
      // Check if this is a new user (created within last 5 minutes)
      const userCreatedAt = new Date(user.created_at);
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      const isNewUser = userCreatedAt > fiveMinutesAgo;
      const hasSeenWelcome = localStorage.getItem(`welcome_shown_${user.id}`);
      
      if (isNewUser && !hasSeenWelcome) {
        setTimeout(() => {
          setIsOpen(true);
          setHasShownWelcome(true);
          localStorage.setItem(`welcome_shown_${user.id}`, 'true');
        }, 1000);
      }
    }
  }, [user, hasShownWelcome]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSubmitIdea = () => {
    setIsOpen(false);
    navigate('/submit-idea');
  };

  const getUserFirstName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(' ')[0];
    }
    return user?.email?.split('@')[0] || 'there';
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="sm:max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <AlertDialogTitle className="text-2xl font-bold text-slate-900">
            Hey {getUserFirstName()}, welcome to IdeoPark! 🎉
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="text-center space-y-4 py-4">
          <p className="text-slate-600 text-lg leading-relaxed">
            Ready to turn your ideas into reality?
          </p>
          
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <span className="text-2xl">🚀</span>
              <span className="font-semibold text-slate-800">Submit your first idea</span>
            </div>
            <p className="text-slate-700 text-sm">and start earning equity from day one!</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="text-2xl mb-1">💡</div>
              <div className="text-slate-600">Share Ideas</div>
            </div>
            <div>
              <div className="text-2xl mb-1">🤝</div>
              <div className="text-slate-600">Find Partners</div>
            </div>
            <div>
              <div className="text-2xl mb-1">📈</div>
              <div className="text-slate-600">Earn Equity</div>
            </div>
          </div>
        </div>
        
        <AlertDialogFooter className="flex flex-col space-y-3">
          <Button
            onClick={handleSubmitIdea}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-xl"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Submit My First Idea
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button
            onClick={handleClose}
            variant="ghost"
            className="w-full text-slate-600 hover:text-slate-800"
          >
            I'll explore first
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WelcomeModal;
