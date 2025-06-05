
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Clock, User, Lock, MessageSquare, Bookmark } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import StripePaymentModal from './StripePaymentModal';

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    teaser: string;
    description?: string;
    category: string;
    tags: string[];
    views: number;
    interests: number;
    created_at: string;
    creator_id: string;
    equity_percentage: number;
  };
  showFullDescription?: boolean;
  onAccessGranted?: () => void;
}

const IdeaCard: React.FC<IdeaCardProps> = ({ 
  idea, 
  showFullDescription = false, 
  onAccessGranted 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isInterested, setIsInterested] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasAccess, setHasAccess] = useState(showFullDescription);
  const [creatorName, setCreatorName] = useState('Anonymous');

  useEffect(() => {
    if (user) {
      checkUserInteractions();
      fetchCreatorName();
    }
  }, [user, idea.id]);

  const checkUserInteractions = async () => {
    if (!user) return;

    try {
      // Check if user has shown interest
      const { data: interestData } = await supabase
        .from('user_idea_interests')
        .select('id')
        .eq('idea_id', idea.id)
        .eq('user_id', user.id)
        .single();

      setIsInterested(!!interestData);

      // Check if user has saved this idea
      const { data: savedData } = await supabase
        .from('saved_ideas')
        .select('id')
        .eq('idea_id', idea.id)
        .eq('user_id', user.id)
        .single();

      setIsSaved(!!savedData);

      // Check if user has access to full description
      const { data: accessData } = await supabase
        .from('access_requests')
        .select('status')
        .eq('idea_id', idea.id)
        .eq('requester_id', user.id)
        .eq('status', 'approved')
        .single();

      setHasAccess(!!accessData || showFullDescription);
    } catch (error) {
      // Errors are expected when no records exist
    }
  };

  const fetchCreatorName = async () => {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', idea.creator_id)
        .single();

      if (profileData?.full_name) {
        setCreatorName(profileData.full_name);
      }
    } catch (error) {
      console.error('Error fetching creator name:', error);
    }
  };

  const handleToggleInterest = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to show interest in ideas.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data, error } = await supabase.rpc(
        'toggle_idea_interest_with_notification',
        { idea_uuid: idea.id }
      );

      if (error) throw error;

      setIsInterested(data);
      toast({
        title: data ? "Interest added!" : "Interest removed",
        description: data ? "You'll be notified of updates." : "You're no longer following this idea."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save ideas.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isSaved) {
        await supabase
          .from('saved_ideas')
          .delete()
          .eq('idea_id', idea.id)
          .eq('user_id', user.id);
        
        setIsSaved(false);
        toast({ title: "Idea removed from saved list" });
      } else {
        await supabase
          .from('saved_ideas')
          .insert({
            idea_id: idea.id,
            user_id: user.id
          });
        
        setIsSaved(true);
        toast({ title: "Idea saved successfully!" });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleRequestAccess = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to access full idea descriptions.",
        variant: "destructive"
      });
      return;
    }

    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "Payment successful!",
      description: "You now have access to the full idea description."
    });
    setHasAccess(true);
    onAccessGranted?.();
  };

  return (
    <>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
              {idea.category}
            </Badge>
            <div className="flex items-center text-xs text-slate-500">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(idea.created_at).toLocaleDateString()}
            </div>
          </div>

          <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
            {idea.title}
          </h3>

          <p className="text-slate-600 mb-4 line-clamp-3">
            {idea.teaser}
          </p>

          {hasAccess && idea.description && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2">Full Description:</h4>
              <p className="text-blue-800 text-sm whitespace-pre-line">
                {idea.description}
              </p>
              <div className="mt-3 text-sm text-blue-700">
                <strong>Equity Offered:</strong> {idea.equity_percentage}%
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            {idea.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {creatorName}
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {idea.views}
              </div>
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {idea.interests}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleInterest}
                className={isInterested ? "bg-red-50 border-red-200 text-red-700" : ""}
              >
                <Heart className={`h-4 w-4 mr-1 ${isInterested ? 'fill-red-500 text-red-500' : ''}`} />
                {isInterested ? 'Interested' : 'Show Interest'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleSave}
                className={isSaved ? "bg-blue-50 border-blue-200 text-blue-700" : ""}
              >
                <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? 'fill-blue-500 text-blue-500' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>

            {!hasAccess && (
              <Button 
                onClick={handleRequestAccess}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="sm"
              >
                <Lock className="h-4 w-4 mr-2" />
                Access Full Details - $15
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <StripePaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        ideaId={idea.id}
        ideaTitle={idea.title}
        amount={15}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default IdeaCard;
