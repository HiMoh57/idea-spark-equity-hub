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
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Plus, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FormData {
  title: string;
  teaser: string;
  description: string;
  category: string;
  tags: string[];
  newTag: string;
  equityPercentage: number;
  attachments: File[];
  terms: boolean;
  problemDescription: string;
  validationSource: string;
  marketSize: string;
  validationMethods: string[];
}

const SubmitIdea = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showExitIntentModalWithPath } = useModal();
  
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showPostSubmitModal, setShowPostSubmitModal] = useState(false);
  const [incompleteSubmissionId, setIncompleteSubmissionId] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    teaser: '',
    description: '',
    category: '',
    tags: [],
    newTag: '',
    equityPercentage: 5,
    attachments: [],
    terms: false,
    problemDescription: '',
    validationSource: '',
    marketSize: '',
    validationMethods: []
  });

  const categories = ['HealthTech', 'EdTech', 'FinTech', 'Sustainability', 'AgriTech', 'Enterprise', 'Consumer', 'AI', 'Other'];

  const validationMethodOptions = [
    "I've faced it myself",
    "I've seen others complain about it",
    "I've done surveys or interviews",
    "It's a trending topic"
  ];

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
      if (formData.title || formData.description || formData.category || formData.teaser || formData.problemDescription) {
        saveIncompleteSubmission();
      }
    }, 10000); // Save after 10 seconds of inactivity

    return () => clearTimeout(timer);
  }, [formData.title, formData.description, formData.category, formData.teaser, formData.problemDescription, user]);

  const saveIncompleteSubmission = async () => {
    if (!user || !formData.title) return;

    try {
      const { data, error } = await supabase
        .from('incomplete_submissions')
        .upsert({
          user_id: user.id,
          email: user.email || '',
          title: formData.title,
          teaser: formData.teaser,
          problem_description: formData.problemDescription,
          description: formData.description,
          category: formData.category,
          tags: formData.tags.join(','),
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

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim()],
        newTag: ''
      });
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.title || !formData.description || !formData.category) {
          toast({
            title: "Missing Information",
            description: "Please fill in all required fields before proceeding.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        if (!formData.problemDescription || !formData.validationSource || !formData.marketSize || formData.validationMethods.length === 0) {
          toast({
            title: "Missing Validation Information",
            description: "Please provide all validation details to ensure your idea is well-researched.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 3:
        if (!formData.terms) {
          toast({
            title: "Missing Information",
            description: "Please agree to the terms and conditions before submitting.",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNextStep = () => {
    if (!validateStep()) {
      return;
    }
    setStep(step + 1);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const newFiles = Array.from(files);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...newFiles]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You must be signed in to submit an idea.",
      });
      return;
    }

    setSubmitting(true);
    setUploading(true);

    try {
      // Upload files first
      const fileUrls = [];
      for (const file of formData.attachments) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('attachments')
          .getPublicUrl(filePath);

        fileUrls.push(publicUrl);
      }

      // Submit idea directly to Supabase
      const { error } = await supabase
        .from('ideas')
        .insert({
          creator_id: user.id,
          title: formData.title,
          teaser: formData.teaser,
          description: formData.description,
          category: formData.category,
          tags: formData.tags,
          equity_percentage: formData.equityPercentage,
          attachments: fileUrls,
          problem_description: formData.problemDescription,
          validation_source: formData.validationSource,
          market_size: formData.marketSize,
          validation_methods: formData.validationMethods
        });

      if (error) throw error;

      // Delete incomplete submission if it exists
      if (incompleteSubmissionId) {
        await supabase
          .from('incomplete_submissions')
          .delete()
          .eq('id', incompleteSubmissionId);
      }

      toast({
        title: "Idea submitted successfully!",
        description: "Your idea is now under review and will be published automatically once approved.",
      });

      // Reset form
      setFormData({
        title: '',
        teaser: '',
        description: '',
        category: '',
        tags: [],
        newTag: '',
        equityPercentage: 5,
        attachments: [],
        terms: false,
        problemDescription: '',
        validationSource: '',
        marketSize: '',
        validationMethods: []
      });
      setStep(1);
      
      // Show post-submit modal
      setShowPostSubmitModal(true);
    } catch (error: any) {
      toast({
        title: "Error submitting idea",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setUploading(false);
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

  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Submit Your Idea
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Share your innovative concept with the world. Let's turn your vision into reality.
            </p>
          </div>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter the title of your idea"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="teaser">Teaser</Label>
                      <Input
                        id="teaser"
                        value={formData.teaser}
                        onChange={(e) => setFormData({ ...formData, teaser: e.target.value })}
                        placeholder="A brief teaser for your idea"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your idea in detail"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex gap-2">
                        <Input
                          id="tags"
                          value={formData.newTag}
                          onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                          placeholder="Add a tag"
                        />
                        <Button type="button" onClick={handleAddTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer">
                            {tag}
                            <X className="h-3 w-3 ml-1" onClick={() => handleRemoveTag(tag)} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="equityPercentage">Equity Percentage</Label>
                      <Slider
                        id="equityPercentage"
                        value={[formData.equityPercentage]}
                        onValueChange={(value) => setFormData({ ...formData, equityPercentage: value[0] })}
                        min={5}
                        max={15}
                        step={1}
                        className="mt-2"
                      />
                      <p className="text-sm text-slate-600 mt-1">{formData.equityPercentage}%</p>
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleNextStep}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Next
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="problemDescription">Problem Description</Label>
                      <Textarea
                        id="problemDescription"
                        value={formData.problemDescription}
                        onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                        placeholder="Describe the problem your idea solves"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="validationSource">Validation Source</Label>
                      <Input
                        id="validationSource"
                        value={formData.validationSource}
                        onChange={(e) => setFormData({ ...formData, validationSource: e.target.value })}
                        placeholder="How did you validate this problem?"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="marketSize">Market Size</Label>
                      <Input
                        id="marketSize"
                        value={formData.marketSize}
                        onChange={(e) => setFormData({ ...formData, marketSize: e.target.value })}
                        placeholder="Estimated market size"
                        required
                      />
                    </div>
                    <div>
                      <Label>Validation Methods</Label>
                      <div className="space-y-2 mt-2">
                        {validationMethodOptions.map(method => (
                          <div key={method} className="flex items-center space-x-2">
                            <Checkbox
                              id={method}
                              checked={formData.validationMethods.includes(method)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData({ ...formData, validationMethods: [...formData.validationMethods, method] });
                                } else {
                                  setFormData({ ...formData, validationMethods: formData.validationMethods.filter(m => m !== method) });
                                }
                              }}
                            />
                            <Label htmlFor={method}>{method}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={handleNextStep}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="attachments">Attachments (Optional)</Label>
                      <Input
                        id="attachments"
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="mt-1"
                      />
                      {formData.attachments.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm text-slate-600">
                            {formData.attachments.length} file(s) selected
                          </p>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.terms}
                          onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
                        />
                        <Label htmlFor="terms">I agree to the terms and conditions</Label>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                        Back
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={submitting || uploading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {submitting ? 'Submitting...' : 'Submit Idea'}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

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
