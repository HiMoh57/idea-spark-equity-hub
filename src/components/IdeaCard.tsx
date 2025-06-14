
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Eye, Heart, Clock, User, Lock, Bookmark, CheckCircle, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import UpiPaymentModal from './UpiPaymentModal';

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
    attachments?: string[];
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
  const [pendingVerification, setPendingVerification] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);

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

      // Check if user has access to full description - UPI payment system
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
          setAccessGranted(true);
        } else if (verificationStatus === 'pending') {
          setPendingVerification(true);
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

  const handlePaymentSubmitted = () => {
    toast({
      title: "Payment submitted for verification!",
      description: "We'll verify your payment and grant access within 24 hours."
    });
    setPendingVerification(true);
    onAccessGranted?.();
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

  // Helper to safely render attachments block
  const renderAttachments = () => {
    if (idea.attachments && idea.attachments.length > 0) {
      return (
        <div className="bg-blue-50 p-3 rounded-lg mb-3">
          <h4 className="font-medium text-blue-900 mb-2">Attachments</h4>
          <ul className="list-disc list-inside text-blue-800">
            {idea.attachments.map((fileUrl, index) => (
              <li key={index}>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600 hover:text-blue-800"
                >
                  {fileUrl.split('/').pop()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Card className="group relative border-0 bg-white/90 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden hover:scale-[1.02] transform">
        {/* Premium gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardContent className="relative p-0">
          {/* Header Section */}
          <div className="p-6 pb-4 border-b border-slate-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-blue-100">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                    {creatorName[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-slate-900">{creatorName}</p>
                  <div className="flex items-center text-xs text-slate-500 gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(idea.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <Badge className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200 font-medium">
                  {idea.category}
                </Badge>
                {isIdeaValidated() && (
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Validated
                  </Badge>
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
              {idea.title}
            </h3>

            <p className="text-slate-600 mb-4 line-clamp-2 leading-relaxed">
              {idea.teaser}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {idea.tags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs bg-slate-50 hover:bg-blue-50 border-slate-200 hover:border-blue-200 transition-colors">
                  {tag}
                </Badge>
              ))}
              {idea.tags?.length > 3 && (
                <Badge variant="outline" className="text-xs bg-slate-50 border-slate-200">
                  +{idea.tags.length - 3} more
                </Badge>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-1 text-slate-500">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">{idea.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-red-500">
                  <Heart className="h-4 w-4" />
                  <span className="font-medium">{idea.interests.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">{idea.equity_percentage}% equity</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-orange-500">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs font-medium">Trending</span>
              </div>
            </div>
          </div>

          {/* Full Description Section */}
          {hasAccess && (
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-slate-900">Full Access Granted</h4>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                {/* Description */}
                {idea.description && (
                  <>
                    <h5 className="font-semibold text-slate-900 mb-2">Description</h5>
                    <p className="text-slate-700 whitespace-pre-line leading-relaxed mb-4">
                      {idea.description}
                    </p>
                  </>
                )}

                {/* Problem Description */}
                {idea.problem_description && (
                  <>
                    <h5 className="font-semibold text-blue-900 mb-2">Problem Description</h5>
                    <p className="text-blue-800 mb-4">{idea.problem_description}</p>
                  </>
                )}

                {/* Market Size */}
                {idea.market_size && (
                  <>
                    <h5 className="font-semibold text-blue-900 mb-2">Market Size</h5>
                    <p className="text-blue-800 mb-4">{idea.market_size}</p>
                  </>
                )}

                {/* Validation Methods */}
                {idea.validation_methods && idea.validation_methods.length > 0 && (
                  <>
                    <h5 className="font-semibold text-blue-900 mb-2">Validation Methods</h5>
                    <ul className="list-disc list-inside text-blue-800 mb-4">
                      {idea.validation_methods.map((method, idx) => (
                        <li key={idx}>{method}</li>
                      ))}
                    </ul>
                  </>
                )}

                {/* Attachments */}
                {renderAttachments()}

                {/* Equity */}
                <div className="flex items-center gap-2 text-sm mt-1">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-green-700">Equity Offered: {idea.equity_percentage}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Section */}
          <div className="p-6 pt-4">
            <div className="flex gap-3 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleInterest}
                className={`flex-1 transition-all duration-300 ${
                  isInterested 
                    ? "bg-red-50 border-red-200 text-red-700 hover:bg-red-100" 
                    : "hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                }`}
              >
                <Heart className={`h-4 w-4 mr-2 ${isInterested ? 'fill-red-500 text-red-500' : ''}`} />
                {isInterested ? 'Interested' : 'Show Interest'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleSave}
                className={`flex-1 transition-all duration-300 ${
                  isSaved 
                    ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" 
                    : "hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700"
                }`}
              >
                <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? 'fill-blue-500 text-blue-500' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>

            {/* Access Controls */}
            {!hasAccess && !pendingVerification && !accessGranted && (
              <Button 
                onClick={handleRequestAccess}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                size="sm"
              >
                <Lock className="h-4 w-4 mr-2" />
                Unlock Full Details - ₹150
              </Button>
            )}

            {pendingVerification && !accessGranted && (
              <div className="w-full p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <p className="text-sm text-yellow-800 font-semibold">Payment Under Verification</p>
                </div>
                <p className="text-xs text-yellow-700">Access will be granted within 24 hours</p>
              </div>
            )}

            {accessGranted && (
              <div className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <p className="text-sm text-green-800 font-semibold">Full Access Granted</p>
                </div>
                <p className="text-xs text-green-700">Check your dashboard for complete details</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <UpiPaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        ideaId={idea.id}
        ideaTitle={idea.title}
        onPaymentSubmitted={handlePaymentSubmitted}
      />
    </>
  );
};

export default IdeaCard;
