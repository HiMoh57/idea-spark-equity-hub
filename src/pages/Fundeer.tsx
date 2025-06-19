import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import FundeerForm from '@/components/FundeerForm';
import PitchDeckViewer from '@/components/PitchDeckViewer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Download, Copy, ArrowLeft } from 'lucide-react';
import jsPDF from 'jspdf';

interface Idea {
  id: string;
  title: string;
  teaser: string;
  description?: string;
  problem_description?: string;
  category: string;
  tags: string[];
}

interface PitchDeck {
  id: string;
  title: string;
  problem_statement: string;
  solution: string;
  business_model: string;
  target_market: string;
  competitor_summary: string;
  traction: string;
  team: string;
  ask_and_use_of_funds: string;
  deck_content: any[];
  created_at: string;
}

const Fundeer = () => {
  const [searchParams] = useSearchParams();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'generating' | 'viewer'>('form');
  const [usageLimit, setUsageLimit] = useState<{ current: number; limit: number }>({ current: 0, limit: 1 });

  const ideaId = searchParams.get('ideaId');

  useEffect(() => {
    if (ideaId) {
      fetchIdea();
    }
    if (user) {
      checkUsageLimit();
    }
  }, [ideaId, user]);

  const fetchIdea = async () => {
    try {
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('id', ideaId)
        .single();

      if (error) throw error;
      setIdea(data);
    } catch (error: any) {
      toast({
        title: "Error loading idea",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const checkUsageLimit = async () => {
    if (!user) return;

    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      
      const { data, error } = await supabase
        .from('pitch_deck_usage')
        .select('usage_count')
        .eq('user_id', user.id)
        .eq('month_year', currentMonth)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      const currentUsage = data?.usage_count || 0;
      const limit = profile?.user_type === 'premium' ? 999 : 1;
      
      setUsageLimit({ current: currentUsage, limit });
    } catch (error: any) {
      console.error('Error checking usage limit:', error);
    }
  };

  const handleFormSubmit = async (formData: any) => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to generate pitch decks.",
        variant: "destructive"
      });
      return;
    }

    if (profile?.user_type !== 'premium' && usageLimit.current >= usageLimit.limit) {
      toast({
        title: "Usage limit reached",
        description: "You've reached your monthly limit. Upgrade to premium for unlimited pitch decks.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setCurrentStep('generating');

    try {
      // --- Backend usage enforcement ---
      if (profile?.user_type !== 'premium') {
        const { data: canUse, error: usageError } = await supabase.rpc('increment_pitch_deck_usage', { user_uuid: user.id });
        if (usageError) throw usageError;
        if (!canUse) {
          toast({
            title: "Usage limit reached (server)",
            description: "You've reached your monthly limit. Upgrade to premium for unlimited pitch decks.",
            variant: "destructive"
          });
          setCurrentStep('form');
          setIsGenerating(false);
          await checkUsageLimit();
          return;
        }
      }
      // --- End backend usage enforcement ---

      const deckContent = await generatePitchDeck(formData);
      
      const { data, error } = await supabase
        .from('pitch_decks')
        .insert({
          user_id: user.id,
          idea_id: ideaId,
          ...formData,
          deck_content: deckContent
        })
        .select()
        .single();

      if (error) throw error;

      setPitchDeck(data);
      setCurrentStep('viewer');
      
      await checkUsageLimit();
      
      toast({
        title: "Pitch deck generated!",
        description: "Your investor-ready pitch deck is ready to view and download."
      });
    } catch (error: any) {
      toast({
        title: "Error generating pitch deck",
        description: error.message,
        variant: "destructive"
      });
      setCurrentStep('form');
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePitchDeck = async (formData: any): Promise<any[]> => {
    const slides = [
      {
        type: 'title',
        title: formData.title,
        subtitle: 'Investor Pitch Deck',
        background: 'gradient-to-br from-blue-600 to-purple-700'
      },
      {
        type: 'problem',
        title: 'The Problem',
        content: formData.problem_statement,
        background: 'bg-red-50'
      },
      {
        type: 'solution',
        title: 'Our Solution',
        content: formData.solution,
        background: 'bg-green-50'
      },
      {
        type: 'business-model',
        title: 'Business Model',
        content: formData.business_model,
        background: 'bg-blue-50'
      },
      {
        type: 'market',
        title: 'Target Market',
        content: formData.target_market,
        background: 'bg-yellow-50'
      },
      {
        type: 'competition',
        title: 'Competitive Landscape',
        content: formData.competitor_summary,
        background: 'bg-purple-50'
      },
      {
        type: 'traction',
        title: 'Traction & Milestones',
        content: formData.traction,
        background: 'bg-indigo-50'
      },
      {
        type: 'team',
        title: 'Our Team',
        content: formData.team,
        background: 'bg-pink-50'
      },
      {
        type: 'ask',
        title: 'Investment Ask',
        content: formData.ask_and_use_of_funds,
        background: 'bg-emerald-50'
      }
    ];

    return slides;
  };

  const handleDownloadPDF = async () => {
    if (!pitchDeck) return;
    try {
      const slides = pitchDeck.deck_content || [];
      if (!Array.isArray(slides) || slides.length === 0) {
        toast({
          title: 'Download failed',
          description: 'No slides found in this pitch deck.',
          variant: 'destructive'
        });
        return;
      }
      const doc = new jsPDF();
      slides.forEach((slide, idx) => {
        if (idx !== 0) doc.addPage();
        doc.setFontSize(22);
        doc.text(slide.title || '', 20, 30);
        doc.setFontSize(14);
        if (slide.subtitle) {
          doc.text(slide.subtitle, 20, 45);
        }
        if (slide.content) {
          doc.text(doc.splitTextToSize(slide.content, 170), 20, 60);
        }
      });
      doc.save(`${pitchDeck.title.replace(/[^a-z0-9]/gi, '_')}_PitchDeck.pdf`);
      toast({
        title: 'Download complete',
        description: 'Your pitch deck has been downloaded successfully.'
      });
    } catch (err: any) {
      toast({
        title: 'Download failed',
        description: err?.message || 'An error occurred while generating the PDF.',
        variant: 'destructive'
      });
    }
  };

  const handleCopyPitchText = async () => {
    if (!pitchDeck) return;
    
    const pitchText = `
${pitchDeck.title}

PROBLEM STATEMENT:
${pitchDeck.problem_statement}

SOLUTION:
${pitchDeck.solution}

BUSINESS MODEL:
${pitchDeck.business_model}

TARGET MARKET:
${pitchDeck.target_market}

COMPETITIVE LANDSCAPE:
${pitchDeck.competitor_summary}

TRACTION:
${pitchDeck.traction}

TEAM:
${pitchDeck.team}

INVESTMENT ASK:
${pitchDeck.ask_and_use_of_funds}
    `.trim();

    try {
      await navigator.clipboard.writeText(pitchText);
      toast({
        title: "Copied to clipboard",
        description: "Pitch text has been copied to your clipboard."
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the text manually.",
        variant: "destructive"
      });
    }
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
    setPitchDeck(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              AI-Powered Pitch Deck Generator
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
              Fundeer
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Transform your startup idea into an investor-ready pitch deck in minutes
            </p>

            {user && (
              <div className="mt-8 inline-flex items-center gap-4 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-slate-200">
                <div className="text-sm text-slate-600">
                  Usage: {usageLimit.current}/{usageLimit.limit} this month
                </div>
                {profile?.user_type !== 'premium' && usageLimit.current >= usageLimit.limit && (
                  <Button size="sm" variant="outline" className="text-xs">
                    Upgrade to Premium
                  </Button>
                )}
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto">
            {currentStep === 'form' && (
              <FundeerForm 
                idea={idea}
                onSubmit={handleFormSubmit}
                usageLimit={usageLimit}
                userType={profile?.user_type}
              />
            )}

            {currentStep === 'generating' && (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    Generating Your Pitch Deck
                  </h3>
                  <p className="text-slate-600 max-w-md mx-auto">
                    Our AI is crafting a professional, investor-ready pitch deck for your idea...
                  </p>
                </CardContent>
              </Card>
            )}

            {currentStep === 'viewer' && pitchDeck && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-slate-200">
                  <Button 
                    variant="outline" 
                    onClick={handleBackToForm}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Create Another
                  </Button>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      onClick={handleCopyPitchText}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Text
                    </Button>
                    <Button 
                      onClick={handleDownloadPDF}
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>

                <PitchDeckViewer pitchDeck={pitchDeck} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fundeer; 