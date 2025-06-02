
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, Plus, X, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';

const SubmitIdea = () => {
  const [formData, setFormData] = useState({
    title: '',
    teaser: '',
    description: '',
    category: '',
    tags: [] as string[],
    newTag: '',
    equityPercentage: '3',
    boardSeat: true,
  });

  const categories = ['HealthTech', 'EdTech', 'FinTech', 'Sustainability', 'AgriTech', 'Enterprise', 'Consumer', 'Other'];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Idea submitted:', formData);
    // Handle idea submission logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-3 w-fit mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Submit Your Startup Idea</h1>
            <p className="text-slate-600">Share your vision with the world. Protect your idea while finding the perfect executor.</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Idea Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Idea Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Give your idea a compelling name"
                    required
                    className="mt-1"
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
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={formData.newTag}
                      onChange={(e) => setFormData({...formData, newTag: e.target.value})}
                      placeholder="Add a tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-600" 
                          onClick={() => handleRemoveTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Partnership Terms</h3>
                  
                  <div>
                    <Label htmlFor="equity">Equity Percentage for Executor</Label>
                    <Select value={formData.equityPercentage} onValueChange={(value) => setFormData({...formData, equityPercentage: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3% Equity</SelectItem>
                        <SelectItem value="4">4% Equity</SelectItem>
                        <SelectItem value="5">5% Equity</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-slate-500 mt-1">
                      You retain this percentage and potential board representation if the idea is executed.
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">How it works:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Your teaser will be visible to all users</li>
                    <li>• Full details are protected behind a paywall ($25)</li>
                    <li>• Interested executors must agree to your equity terms</li>
                    <li>• You maintain control over who accesses your full idea</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Submit Idea for Review
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitIdea;
