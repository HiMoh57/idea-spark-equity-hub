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
                        placeholder="Enter the title of your idea that will be visible publicly."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="teaser">Teaser</Label>
                      <Input
                        id="teaser"
                        value={formData.teaser}
                        onChange={(e) => setFormData({ ...formData, teaser: e.target.value })}
                        placeholder="A brief teaser for your idea that will be visible publicly."
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe your idea in detail. Your idea will be locked🔒 and will only be accessible after someone pays which means that your idea is secure with us. "
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category that best suits you idea." />
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
                        <Button type="button" onClick={handleAddTag}>Add</Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map(tag => (
                          <Badge key={tag} variant="secondary">
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
                      />
                      <p className="text-sm text-slate-600">{formData.equityPercentage}%</p>
                    </div>
                    <Button type="button" onClick={handleNextStep}>Next</Button>
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
  <Select
    value={formData.marketSize}
    onValueChange={(value) => setFormData({ ...formData, marketSize: value })}
    required
  >
    <SelectTrigger>
      <SelectValue placeholder="Select market size" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="Small">Small (Niche Market)</SelectItem>
      <SelectItem value="Medium">Medium Market</SelectItem>
      <SelectItem value="Large">Large Market</SelectItem>
    </SelectContent>
  </Select>
</div>
                    <div>
                      <Label>Validation Methods</Label>
                      <div className="space-y-2">
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
                    <Button type="button" onClick={handleNextStep}>Next</Button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="attachments">Attachments</Label>
                      <Input
                        id="attachments"
                        type="file"
                        multiple
                        onChange={(e) => handleFileUpload(e.target.files)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="terms">Terms and Conditions</Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="terms"
                          checked={formData.terms}
                          onCheckedChange={(checked) => setFormData({ ...formData, terms: checked as boolean })}
                        />
                        <Label htmlFor="terms">I agree to the terms and conditions</Label>
                      </div>
                    </div>
                    <Button type="submit" disabled={submitting || uploading}>
                      {submitting ? 'Submitting...' : 'Submit Idea'}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitIdea;
