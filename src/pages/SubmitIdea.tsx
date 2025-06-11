import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, X, AlertCircle, ArrowLeft, Upload, Shield, Lock, FileText, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

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

  const validateStep1 = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your idea",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.teaser.trim()) {
      toast({
        title: "Teaser Required",
        description: "Please enter a teaser for your idea",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast({
        title: "Description Required",
        description: "Please enter a description for your idea",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.category) {
      toast({
        title: "Category Required",
        description: "Please select a category for your idea",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.attachments.length === 0) {
      toast({
        title: "Attachments Required",
        description: "Please upload at least one attachment",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
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

      navigate('/explore');
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
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-24 h-1 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(-1)}
                  className="rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-2xl font-bold text-slate-900">
                  {step === 1 ? "Basic Information" : step === 2 ? "Details & Equity" : "Review & Submit"}
                </h1>
              </div>
              <p className="text-slate-600">
                {step === 1 ? "Tell us about your idea" : 
                 step === 2 ? "Set your equity terms and add details" : 
                 "Review your submission before finalizing"}
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Idea Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Enter a clear, concise title"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="teaser">Public Teaser (One-liner)</Label>
                        <Input
                          id="teaser"
                          value={formData.teaser}
                          onChange={(e) => setFormData({...formData, teaser: e.target.value})}
                          placeholder="A brief, exciting description visible to everyone"
                          required
                          className="mt-1"
                          maxLength={120}
                        />
                        <p className="text-xs text-slate-500 mt-1">{formData.teaser.length}/120 characters</p>
                      </div>
                      <div>
                        <Label htmlFor="description">Full Description (Protected)</Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Detailed description of your idea, market opportunity, potential implementation, etc. This will only be visible to users who pay for access."
                          required
                          className="mt-1 min-h-[200px]"
                        />
                        <div className="flex items-center mt-2 text-xs text-amber-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          This detailed description will be protected and only shown to verified users who pay for access.
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({ ...formData, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label>Equity Offer</Label>
                        <div className="mt-2">
                          <Slider
                            value={[formData.equity]}
                            onValueChange={(value) => setFormData({ ...formData, equity: value[0] })}
                            min={5}
                            max={15}
                            step={1}
                            className="mb-4"
                          />
                          <div className="text-center text-2xl font-bold text-blue-600">
                            {formData.equity}%
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label>Attachments (Required)</Label>
                        <div className="mt-2 border-2 border-dashed border-slate-200 rounded-lg p-6 text-center">
                          <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                          <p className="text-sm text-slate-600">
                            Drag and drop files here, or click to select files
                          </p>
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            id="file-upload"
                            onChange={(e) => handleFileUpload(e.target.files)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-4"
                            onClick={() => document.getElementById('file-upload')?.click()}
                          >
                            Select Files
                          </Button>
                        </div>
                        {formData.attachments.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {formData.attachments.map((file, index) => (
                              <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                                <span className="text-sm truncate">{file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      attachments: prev.attachments.filter((_, i) => i !== index)
                                    }));
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="space-y-6">
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Security & Privacy</h3>
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <Shield className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <p>Your idea is protected by our secure platform and will only be visible to approved executors.</p>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-2">Terms & Conditions</h3>
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <FileText className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                          <p>By submitting your idea, you agree to our terms and conditions regarding intellectual property and equity distribution.</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="terms"
                            checked={formData.terms}
                            onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
                          />
                          <Label htmlFor="terms" className="text-sm text-gray-600">
                            I agree to the terms and conditions
                          </Label>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Problem Description */}
                <div className="space-y-2">
                  <Label htmlFor="problemDescription">What problem does this idea solve?</Label>
                  <Textarea
                    id="problemDescription"
                    value={formData.problemDescription}
                    onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                    placeholder="Describe the pain point, who experiences it, and why it matters."
                    required
                    className="min-h-[100px]"
                  />
                </div>

                {/* Validation Source */}
                <div className="space-y-2">
                  <Label htmlFor="validationSource">Add a link that shows this problem exists</Label>
                  <Input
                    id="validationSource"
                    type="url"
                    value={formData.validationSource}
                    onChange={(e) => setFormData({ ...formData, validationSource: e.target.value })}
                    placeholder="Paste a link to a Reddit post, tweet, article, or trend"
                  />
                </div>

                {/* Market Size */}
                <div className="space-y-2">
                  <Label htmlFor="marketSize">How big is the market for this idea?</Label>
                  <Select
                    value={formData.marketSize}
                    onValueChange={(value) => setFormData({ ...formData, marketSize: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select market size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Small">Small (Niche < ₹10 Cr)</SelectItem>
                      <SelectItem value="Medium">Medium (₹10–100 Cr)</SelectItem>
                      <SelectItem value="Large">Large (₹100 Cr+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Validation Methods */}
                <div className="space-y-2">
                  <Label>How do you know this problem is real?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {validationMethodOptions.map((method) => (
                      <div key={method} className="flex items-center space-x-2">
                        <Checkbox
                          id={method}
                          checked={formData.validationMethods.includes(method)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData({
                                ...formData,
                                validationMethods: [...formData.validationMethods, method]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                validationMethods: formData.validationMethods.filter(m => m !== method)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={method}>{method}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  {step > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                    >
                      Back
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="ml-auto"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="ml-auto"
                      disabled={!formData.terms || submitting || uploading}
                    >
                      {submitting || uploading ? "Submitting..." : "Submit Idea"}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SubmitIdea;
