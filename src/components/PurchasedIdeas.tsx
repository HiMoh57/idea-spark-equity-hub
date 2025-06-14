import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Calendar, DollarSign, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import ProposalModal from '@/components/ProposalModal';

interface PurchasedIdea {
  id: string;
  title: string;
  teaser: string;
  description: string;
  category: string;
  tags: string[];
  equity_percentage: number;
  creator_id: string;
  access_granted_at: string;
  payment_amount: number;
  verification_status: string;
  problem_description?: string;
  validation_source?: string;
  market_size?: string;
  validation_methods?: string[];
  attachments?: string[];
}

const PurchasedIdeas = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [purchasedIdeas, setPurchasedIdeas] = useState<PurchasedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchPurchasedIdeas();
    }
  }, [user]);

  const fetchPurchasedIdeas = async () => {
    try {
      console.log('Fetching purchased ideas for user:', user?.id);
      
      // Query to get access requests with payment verifications and idea details
      const { data: purchasedData, error } = await supabase
        .from('access_requests')
        .select(`
          id,
          idea_id,
          payment_amount,
          created_at,
          status,
          payment_verifications!inner (
            verification_status,
            verified_at
          ),
          ideas!inner (
            id,
            title,
            teaser,
            description,
            category,
            tags,
            equity_percentage,
            creator_id,
            problem_description,
            validation_source,
            market_size,
            validation_methods,
            attachments
          )
        `)
        .eq('requester_id', user?.id)
        .eq('payment_verifications.verification_status', 'verified');

      if (error) {
        console.error('Error fetching purchased ideas:', error);
        throw error;
      }

      console.log('Raw purchased data:', purchasedData);

      if (!purchasedData || purchasedData.length === 0) {
        console.log('No purchased ideas found');
        setPurchasedIdeas([]);
        setLoading(false);
        return;
      }

      // Transform the data to match our interface
      const formattedIdeas: PurchasedIdea[] = purchasedData.map((item: any) => ({
        id: item.ideas.id,
        title: item.ideas.title,
        teaser: item.ideas.teaser,
        description: item.ideas.description,
        category: item.ideas.category,
        tags: item.ideas.tags || [],
        equity_percentage: item.ideas.equity_percentage,
        creator_id: item.ideas.creator_id,
        access_granted_at: item.payment_verifications[0]?.verified_at || item.created_at,
        payment_amount: item.payment_amount || 0,
        verification_status: item.payment_verifications[0]?.verification_status || 'pending',
        problem_description: item.ideas.problem_description,
        validation_source: item.ideas.validation_source,
        market_size: item.ideas.market_size,
        validation_methods: item.ideas.validation_methods,
        attachments: item.ideas.attachments
      }));

      console.log('Formatted purchased ideas:', formattedIdeas);
      setPurchasedIdeas(formattedIdeas);
    } catch (error: any) {
      console.error('Error fetching purchased ideas:', error);
      toast({
        title: "Error loading purchased ideas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (purchasedIdeas.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Purchased Ideas</h3>
          <p className="text-gray-600">You haven't purchased access to any ideas yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchasedIdeas.map((idea) => (
          <Card key={idea.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{idea.title}</CardTitle>
                <Badge variant="outline">{idea.category}</Badge>
              </div>
              <p className="text-sm text-gray-600">{idea.teaser}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Description (always for purchased) */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Full Description</h4>
                  <p className="text-sm text-green-800">{idea.description}</p>
                </div>

                {/* Problem Description */}
                {idea.problem_description && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Problem Description</h4>
                    <p className="text-sm text-blue-800">{idea.problem_description}</p>
                  </div>
                )}

                {/* Market Size */}
                {idea.market_size && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Market Size</h4>
                    <p className="text-sm text-blue-800">{idea.market_size}</p>
                  </div>
                )}

                {/* Validation Methods */}
                {idea.validation_methods && idea.validation_methods.length > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Validation Methods</h4>
                    <ul className="text-sm text-blue-800 list-disc list-inside">
                      {idea.validation_methods.map((method, index) => (
                        <li key={index}>{method}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Attachments - visible for purchased */}
                {idea.attachments && idea.attachments.length > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
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
                )}

                <div className="flex flex-wrap gap-1">
                  {idea.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {idea.equity_percentage}% Equity
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(idea.access_granted_at).toLocaleDateString()}
                  </div>
                </div>

                <Button
                  onClick={() => setSelectedIdea(idea.id)}
                  className="w-full"
                  variant="outline"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Submit Proposal
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedIdea && (
        <ProposalModal
          isOpen={!!selectedIdea}
          onClose={() => setSelectedIdea(null)}
          ideaId={selectedIdea}
          onProposalSubmitted={fetchPurchasedIdeas}
        />
      )}
    </div>
  );
};

export default PurchasedIdeas;
