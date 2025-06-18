import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

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

interface UsageLimit {
  current: number;
  limit: number;
}

export const useFundeer = () => {
  const { user, profile } = useAuth();
  const [usageLimit, setUsageLimit] = useState<UsageLimit>({ current: 0, limit: 1 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkUsageLimit();
    }
  }, [user]);

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

  const canGeneratePitchDeck = () => {
    if (!user) return false;
    return profile?.user_type === 'premium' || usageLimit.current < usageLimit.limit;
  };

  const generatePitchDeck = async (formData: any): Promise<PitchDeck | null> => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    if (!canGeneratePitchDeck()) {
      throw new Error('Usage limit reached. Upgrade to premium for unlimited access.');
    }

    setLoading(true);

    try {
      // Generate deck content (mock implementation)
      const deckContent = [
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

      // Save to database
      const { data, error } = await supabase
        .from('pitch_decks')
        .insert({
          user_id: user.id,
          ...formData,
          deck_content: deckContent
        })
        .select()
        .single();

      if (error) throw error;

      // Update usage count
      await checkUsageLimit();

      return data;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserPitchDecks = async (): Promise<PitchDeck[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('pitch_decks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching pitch decks:', error);
      return [];
    }
  };

  return {
    usageLimit,
    loading,
    canGeneratePitchDeck,
    generatePitchDeck,
    getUserPitchDecks,
    checkUsageLimit
  };
}; 