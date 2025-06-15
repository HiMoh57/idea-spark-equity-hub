
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, Calendar, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import VerifiedPosterBadge from './VerifiedPosterBadge';

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    teaser: string;
    category: string;
    views: number;
    interests: number;
    created_at: string;
    creator_id: string;
    profiles?: {
      full_name?: string;
      is_verified_poster?: boolean;
    };
  };
  onViewDetails: (id: string) => void;
}

const IdeaCard = ({ idea, onViewDetails }: IdeaCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isInterested, setIsInterested] = useState(false);
  const [interestCount, setInterestCount] = useState(idea.interests || 0);

  const handleInterest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to show interest in ideas.",
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc('toggle_idea_interest_with_notification', {
        idea_uuid: idea.id
      });

      if (error) throw error;

      setIsInterested(data);
      setInterestCount(prev => data ? prev + 1 : prev - 1);

      toast({
        title: data ? "Interest added!" : "Interest removed",
        description: data ? "You'll be notified of updates." : "No longer following this idea.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update interest.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 cursor-pointer group border border-slate-200 hover:border-blue-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className="text-xs font-medium">
            {idea.category}
          </Badge>
          {idea.profiles?.is_verified_poster && (
            <VerifiedPosterBadge isVerified={true} />
          )}
        </div>
        <CardTitle className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {idea.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {idea.teaser}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {idea.views || 0}
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {interestCount}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(idea.created_at)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <User className="h-3 w-3" />
              {idea.profiles?.full_name || 'Anonymous'}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleInterest}
              className={`text-xs ${isInterested ? 'bg-red-50 border-red-200 text-red-600' : 'hover:bg-blue-50 hover:border-blue-200'}`}
            >
              <Heart className={`h-3 w-3 mr-1 ${isInterested ? 'fill-current' : ''}`} />
              {isInterested ? 'Interested' : 'Interest'}
            </Button>
            
            <Button
              onClick={() => onViewDetails(idea.id)}
              size="sm"
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Details
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
