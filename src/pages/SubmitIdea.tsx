
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useExitIntent } from '@/hooks/useExitIntent';
import { useModal } from '@/contexts/ModalContext';
import ProgressSaveModal from '@/components/ProgressSaveModal';
import PostSubmitModal from '@/components/PostSubmitModal';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const SubmitIdea = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showExitIntentModalWithPath } = useModal();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showPostSubmitModal, setShowPostSubmitModal] = useState(false);
  const [incompleteSubmissionId, setIncompleteSubmissionId] = useState<string | null>(null);

  // Track form interaction for unauthenticated users
  useEffect(() => {
    if (user || hasInteracted) return;

    const handleFormChange = () => {
      if (!user && !hasInteracted) {
        setHasInteracted(true);
        // Show progress save modal after 3 seconds of interaction
        const timer = setTimeout(() => {
          setShowProgressModal(true);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    };

    // Add listeners to all form inputs
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
      input.addEventListener('input', handleFormChange);
      input.addEventListener('change', handleFormChange);
    });

    return () => {
      formInputs.forEach(input => {
        input.removeEventListener('input', handleFormChange);
        input.removeEventListener('change', handleFormChange);
      });
    };
  }, [user, hasInteracted]);

  // Track incomplete submissions for email reminders
  useEffect(() => {
    if (!user) return;

    const timer = setTimeout(() => {
      if (title || description || category) {
        saveIncompleteSubmission();
      }
    }, 10000); // Save after 10 seconds of inactivity

    return () => clearTimeout(timer);
  }, [title, description, category, user]);

  const saveIncompleteSubmission = async () => {
    if (!user || !title) return;

    try {
      const { data, error } = await supabase
        .from('incomplete_submissions')
        .upsert({
          user_id: user.id,
          email: user.email || '',
          title,
          description,
          category,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;
      setIncompleteSubmissionId(data.id);
      console.log('Saved incomplete submission:', data.id);
    } catch (error) {
      console.error('Error saving incomplete submission:', error);
    }
  };

  useExitIntent({
    onExitIntent: (path) => {
      if (!user && hasInteracted) {
        showExitIntentModalWithPath(path);
      }
    },
    isEnabled: !user && hasInteracted,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You must be signed in to submit an idea.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          category,
          userId: user.id,
        }),
      });

      if (response.ok) {
        // Delete incomplete submission if it exists
        if (incompleteSubmissionId) {
          await supabase
            .from('incomplete_submissions')
            .delete()
            .eq('id', incompleteSubmissionId);
        }

        toast({
          title: "Success",
          description: "Your idea has been submitted!",
        });
        
        // Show post-submit modal instead of navigating immediately
        setShowPostSubmitModal(true);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to submit idea.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserProfileLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/profile/${user?.id}`;
  };

  const handlePostSubmitClose = () => {
    setShowPostSubmitModal(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
          <div className="px-6 py-8">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-8">
              Share Your Startup Idea
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title" className="block text-sm font-medium text-slate-700">
                  Idea Title
                </Label>
                <div className="mt-1">
                  <Input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="A catchy title for your idea"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="block text-sm font-medium text-slate-700">
                  Description
                </Label>
                <div className="mt-1">
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Describe your idea in detail"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category" className="block text-sm font-medium text-slate-700">
                  Category
                </Label>
                <div className="mt-1">
                  <Select onValueChange={setCategory} defaultValue={category}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI">Artificial Intelligence</SelectItem>
                      <SelectItem value="Web3">Web3</SelectItem>
                      <SelectItem value="SaaS">SaaS</SelectItem>
                      <SelectItem value="HealthTech">HealthTech</SelectItem>
                      <SelectItem value="EdTech">EdTech</SelectItem>
                      <SelectItem value="FinTech">FinTech</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Submitting... </>
                  ) : (
                    <>
                      Submit Idea <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
      
      <ProgressSaveModal
        isOpen={showProgressModal && !user}
        onClose={() => setShowProgressModal(false)}
        onSignup={() => {
          setShowProgressModal(false);
          navigate('/auth');
        }}
      />

      <PostSubmitModal
        isOpen={showPostSubmitModal}
        onClose={handlePostSubmitClose}
        userProfileLink={getUserProfileLink()}
      />
    </div>
  );
};

export default SubmitIdea;
