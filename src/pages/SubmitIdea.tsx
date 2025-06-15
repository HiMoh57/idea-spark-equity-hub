import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, X, AlertCircle, ArrowLeft, Upload, Shield, Lock, FileText, Home, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useModal } from '@/contexts/ModalContext';
import { useExitIntent } from '@/hooks/useExitIntent';

interface FormData {
  title: string;
  teaser: string;
  description: string;
  category: string;
  tags: string[];
  newTag: string;
  equityPercentage: number;
  equity: number;
  attachments: File[];
  terms: boolean;
  problemDescription: string;
  validationSource: string;
  marketSize: string;
  validationMethods: string[];
}

const SubmitIdea = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setHasInteractedWithForm, showExitIntentModalWithPath, hasInteractedWithForm } = useModal();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    teaser: '',
    description: '',
    category: '',
    tags: [],
    newTag: '',
    equityPercentage: 5,
    equity: 10,
    attachments: [],
    terms: false,
    problemDescription: '',
    validationSource: '',
    marketSize: '',
    validationMethods: []
  });

  // Check if form has been interacted with
  const checkFormInteraction = () => {
    const hasData = formData.title.trim() || 
                   formData.teaser.trim() || 
                   formData.description.trim() || 
                   formData.category ||
                   formData.problemDescription.trim() ||
                   formData.validationSource.trim() ||
                   formData.tags.length > 0;
    
    if (hasData && !hasInteractedWithForm) {
      setHasInteractedWithForm(true);
    }
  };

  // Set up exit intent detection
  useExitIntent({
    onExitIntent: showExitIntentModalWithPath,
    isEnabled: hasInteractedWithForm && !user,
  });

  // Check form interaction whenever formData changes
  useEffect(() => {
    checkFormInteraction();
  }, [formData, hasInteractedWithForm, setHasInteractedWithForm]);

  const categories = ['HealthTech', 'EdTech', 'FinTech', 'Sustainability', 'AgriTech', 'Enterprise', 'Consumer', 'AI', 'Other'];

  const validationMethodOptions = [
    "I've faced it myself",
    "I've seen others complain about it",
    "I've done surveys or interviews",
    "It's a trending topic"
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

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

  const handlePrevStep = () => {
    setStep(step - 1);
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
    if (!user) return;

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

      // Then create the idea with file URLs and validation fields
      const { error } = await supabase
        .from('ideas')
        .insert({
          creator_id: user.id as string,
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
        equity: 10,
        attachments: [],
        terms: false,
        problemDescription: '',
        validationSource: '',
        marketSize: '',
        validationMethods: []
      });
      setStep(1);
      setHasInteractedWithForm(false);
    } catch (error: any) {
      toast({
        title: "Error submitting idea",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  if (authLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Lightbulb className="h-8 w-8 text-blue-600 animate-pulse" />
        </div>
      </div>
    </div>;
  }

  if (!user) {
    return null;
  }

  const stepTitles = [
    "Basic Information",
    "Validation Details", 
    "Final Review"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200/50 mb-8">
              <Sparkles className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-semibold text-blue-700">Submit Your Vision</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              Share Your <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Startup Idea</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Transform your innovative concept into reality. Our secure platform protects your intellectual property while connecting you with passionate executors.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-8">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 ${
                    stepNum === step 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110' 
                      : stepNum < step 
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}>
                    {stepNum < step ? <CheckCircle className="h-6 w-6" /> : stepNum}
                    {stepNum === step && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-ping opacity-75" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${stepNum === step ? 'text-blue-600' : stepNum < step ? 'text-green-600' : 'text-slate-400'}`}>
                      Step {stepNum}
                    </p>
                    <p className={`text-xs ${stepNum === step ? 'text-slate-900' : 'text-slate-500'}`}>
                      {stepTitles[stepNum - 1]}
                    </p>
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-1 mx-6 rounded-full transition-colors duration-300 ${
                      stepNum < step ? 'bg-green-500' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-white/50">
              <CardTitle className="text-2xl font-bold text-slate-900 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <span className="text-white font-bold">{step}</span>
                </div>
                {stepTitles[step - 1]}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-lg font-semibold text-slate-900">Title *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter a catchy title for your idea"
                          required
                          className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-lg font-semibold text-slate-900">Category *</Label>
                        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                          <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl">
                            <SelectValue placeholder="Select your category" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/95 backdrop-blur-xl">
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="teaser" className="text-lg font-semibold text-slate-900">Teaser *</Label>
                      <Input
                        id="teaser"
                        value={formData.teaser}
                        onChange={(e) => setFormData({ ...formData, teaser: e.target.value })}
                        placeholder="A brief, compelling description that will be publicly visible"
                        required
                        className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-lg font-semibold text-slate-900 flex items-center">
                        Full Description *
                        <Lock className="h-4 w-4 ml-2 text-green-600" />
                        <span className="text-sm text-green-600 ml-1">Secured</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your idea in detail. This will be protected and only accessible to verified users who pay for access."
                        required
                        rows={6}
                        className="text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl resize-none"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label className="text-lg font-semibold text-slate-900">Tags</Label>
                      <div className="flex gap-3">
                        <Input
                          value={formData.newTag}
                          onChange={(e) => setFormData({ ...formData, newTag: e.target.value })}
                          placeholder="Add relevant tags"
                          className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        />
                        <Button type="button" onClick={handleAddTag} className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold">
                          <Plus className="h-5 w-5 mr-2" />
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {formData.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="px-4 py-2 text-lg bg-blue-100 text-blue-800 hover:bg-blue-200 rounded-xl">
                            {tag}
                            <X className="h-4 w-4 ml-2 cursor-pointer hover:text-red-600" onClick={() => handleRemoveTag(tag)} />
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-lg font-semibold text-slate-900">Equity Percentage: {formData.equityPercentage}%</Label>
                      <div className="px-4">
                        <Slider
                          value={[formData.equityPercentage]}
                          onValueChange={(value) => setFormData({ ...formData, equityPercentage: value[0] })}
                          min={5}
                          max={15}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-slate-500 mt-2">
                          <span>5% (Minimum)</span>
                          <span>15% (Maximum)</span>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 bg-blue-50 p-4 rounded-xl border border-blue-200">
                        💡 This is the equity percentage you're willing to offer to an executor who brings your idea to life.
                      </p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <Label htmlFor="problemDescription" className="text-lg font-semibold text-slate-900">Problem Description *</Label>
                      <Textarea
                        id="problemDescription"
                        value={formData.problemDescription}
                        onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                        placeholder="Clearly describe the problem your idea solves. What pain point does it address?"
                        required
                        rows={4}
                        className="text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl resize-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="validationSource" className="text-lg font-semibold text-slate-900">Validation Source *</Label>
                      <Input
                        id="validationSource"
                        value={formData.validationSource}
                        onChange={(e) => setFormData({ ...formData, validationSource: e.target.value })}
                        placeholder="How did you validate this problem exists? (e.g., personal experience, market research, surveys)"
                        required
                        className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="marketSize" className="text-lg font-semibold text-slate-900">Market Size *</Label>
                      <Select
                        value={formData.marketSize}
                        onValueChange={(value) => setFormData({ ...formData, marketSize: value })}
                        required
                      >
                        <SelectTrigger className="h-12 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl">
                          <SelectValue placeholder="Select estimated market size" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-xl">
                          <SelectItem value="Small">Small - Niche Market ($1M-$10M)</SelectItem>
                          <SelectItem value="Medium">Medium Market ($10M-$100M)</SelectItem>
                          <SelectItem value="Large">Large Market ($100M+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-lg font-semibold text-slate-900">Validation Methods * (Select all that apply)</Label>
                      <div className="grid md:grid-cols-2 gap-4">
                        {validationMethodOptions.map(method => (
                          <div key={method} className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-blue-300 transition-colors">
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
                              className="w-5 h-5"
                            />
                            <Label htmlFor={method} className="text-base font-medium cursor-pointer">{method}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <Label htmlFor="attachments" className="text-lg font-semibold text-slate-900 flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        Supporting Documents (Optional)
                      </Label>
                      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                        <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <Input
                          id="attachments"
                          type="file"
                          multiple
                          onChange={(e) => handleFileUpload(e.target.files)}
                          className="hidden"
                        />
                        <Label htmlFor="attachments" className="cursor-pointer">
                          <span className="text-lg font-medium text-blue-600 hover:text-blue-700">Click to upload files</span>
                          <p className="text-sm text-slate-500 mt-2">Upload mockups, research, or any supporting documents</p>
                        </Label>
                      </div>
                      {formData.attachments.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-slate-700">Uploaded files:</p>
                          {formData.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <span className="text-sm text-slate-700">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  attachments: prev.attachments.filter((_, i) => i !== index)
                                }))}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                        <Checkbox
                          id="terms"
                          checked={formData.terms}
                          onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
                          className="w-5 h-5 mt-1"
                        />
                        <div>
                          <Label htmlFor="terms" className="text-base font-medium cursor-pointer text-slate-900">
                            I agree to the terms and conditions *
                          </Label>
                          <p className="text-sm text-slate-600 mt-1">
                            By submitting your idea, you acknowledge that it will be protected by our secure platform and only accessible to verified users who pay for access.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Summary Section */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        Submission Summary
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Title:</strong> {formData.title}</p>
                          <p><strong>Category:</strong> {formData.category}</p>
                          <p><strong>Equity Offered:</strong> {formData.equityPercentage}%</p>
                        </div>
                        <div>
                          <p><strong>Tags:</strong> {formData.tags.join(', ') || 'None'}</p>
                          <p><strong>Market Size:</strong> {formData.marketSize}</p>
                          <p><strong>Attachments:</strong> {formData.attachments.length} files</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center pt-8 border-t border-slate-200">
                  <div>
                    {step > 1 && (
                      <Button
                        type="button"
                        onClick={handlePrevStep}
                        variant="outline"
                        className="px-8 py-3 border-2 border-slate-300 hover:border-slate-400 rounded-xl font-semibold"
                      >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Previous
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    {step < 3 ? (
                      <Button
                        type="button"
                        onClick={handleNextStep}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Next Step
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={submitting || uploading}
                        className="px-12 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-5 w-5 mr-3" />
                            Submit Your Idea
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitIdea;
