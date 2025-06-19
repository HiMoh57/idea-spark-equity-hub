import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Clock, User, Lock, Bookmark, CheckCircle, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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
    problem_description?: string;
    validation_source?: string;
    market_size?: string;
    validation_methods?: string[];
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
  const [isInterested, setIsInterested] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasAccess, setHasAccess] = useState(showFullDescription);
  const [creatorName, setCreatorName] = useState('Anonymous');
  const [requestStatus, setRequestStatus] = useState<'none' | 'pending' | 'approved' | 'denied'>("none");
  const [requestId, setRequestId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkUserInteractions();
      fetchCreatorName();
      checkAccessRequest();
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
        .select(`
          status,
          payment_verifications(verification_status)
        `)
        .eq('idea_id', idea.id)
        .eq('requester_id', user.id)
        .single();

      if (accessData) {
        const verificationStatus = accessData.payment_verifications?.[0]?.verification_status;
        
        if (accessData.status === 'approved' && verificationStatus === 'verified') {
          setHasAccess(true);
        } else if (verificationStatus === 'pending') {
          setRequestStatus('pending');
        }
      }
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

  const checkAccessRequest = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('access_requests')
        .select('id, status')
        .eq('idea_id', idea.id)
        .eq('requester_id', user.id)
        .single();
      if (data) {
        setRequestId(data.id);
        setRequestStatus(data.status);
      } else {
        setRequestStatus('none');
        setRequestId(null);
      }
    } catch (e) {
      setRequestStatus('none');
      setRequestId(null);
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

  const handleRequestAccess = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to request access.",
        variant: "destructive"
      });
      return;
    }
    if (requestStatus === 'pending' || requestStatus === 'approved') return;
    try {
      const { data, error } = await supabase
        .from('access_requests')
        .insert({
          idea_id: idea.id,
          requester_id: user.id,
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      setRequestId(data.id);
      setRequestStatus('pending');
      toast({ title: 'Request sent!', description: 'The creator will review your request soon.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const isIdeaValidated = () => {
    const validationFields = [
      idea.problem_description,
      idea.validation_source,
      idea.market_size,
      idea.validation_methods?.length
    ].filter(Boolean);
    return validationFields.length >= 2;
  };

  return (
    <>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <Badge className="bg-slate-100 text-slate-800">
                {idea.category}
              </Badge>
              {isIdeaValidated() && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Validated
                </Badge>
              )}
              <div className="flex items-center text-xs text-slate-500">
                <Clock className="h-3 w-3 mr-1" />
                {new Date(idea.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {idea.tags?.map((tag) => (
                <Badge key={tag} className="bg-blue-100 text-blue-800">
                  {tag}
                </Badge>
              ))}
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

          <div className="space-y-3">
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

            {/* Generate Pitch Button */}
            <Link to={`/fundeer?ideaId=${idea.id}`}>
              <Button 
                variant="outline"
                size="sm"
                className="w-full bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 text-purple-700 hover:from-purple-100 hover:to-blue-100"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Pitch Deck
              </Button>
            </Link>

            {/* Request Access Button */}
            {!hasAccess && (
              <Button
                onClick={handleRequestAccess}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="sm"
                disabled={requestStatus === 'pending' || requestStatus === 'approved'}
              >
                {requestStatus === 'pending' && 'Request Pending'}
                {requestStatus === 'approved' && '✅ Access Granted'}
                {requestStatus === 'denied' && '❌ Request Denied'}
                {requestStatus === 'none' && '🔓 Request Access'}
              </Button>
            )}

            {requestStatus === 'approved' && user && (
              <Link to={`/chat?ideaId=${idea.id}&userId=${idea.creator_id}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 bg-gradient-to-r from-green-100 to-blue-100 border-green-200 text-green-700 hover:from-green-200 hover:to-blue-200"
                >
                  💬 Open Chat
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default IdeaCard;
