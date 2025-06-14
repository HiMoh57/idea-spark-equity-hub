
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
      
      // First get access requests with verified payments
      const { data: accessRequestsData, error: accessError } = await supabase
        .from('access_requests')
        .select(`
          id,
          idea_id,
          payment_amount,
          created_at,
          status,
          payment_verifications!inner(
            verification_status
          )
        `)
        .eq('requester_id', user?.id)
        .eq('status', 'approved')
        .eq('payment_verifications.verification_status', 'verified');

      if (accessError) {
        console.error('Access requests error:', accessError);
        throw accessError;
      }

      console.log('Access requests data:', accessRequestsData);

      if (!accessRequestsData || accessRequestsData.length === 0) {
        setPurchasedIdeas([]);
        setLoading(false);
        return;
      }

      // Get the idea IDs from access requests
      const ideaIds = accessRequestsData.map(req => req.idea_id);
      
      // Now fetch the full idea details
      const { data: ideasData, error: ideasError } = await supabase
        .from('ideas')
        .select(`
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
          validation_methods
        `)
        .in('id', ideaIds);

      if (ideasError) {
        console.error('Ideas error:', ideasError);
        throw ideasError;
      }

      console.log('Ideas data:', ideasData);

      // Combine the data
      const formattedIdeas = ideasData?.map(idea => {
        const accessRequest = accessRequestsData.find(req => req.idea_id === idea.id);
        return {
          id: idea.id,
          title: idea.title,
          teaser: idea.teaser,
          description: idea.description,
          category: idea.category,
          tags: idea.tags || [],
          equity_percentage: idea.equity_percentage,
          creator_id: idea.creator_id,
          access_granted_at: accessRequest?.created_at || '',
          payment_amount: accessRequest?.payment_amount || 0,
          verification_status: 'verified',
          problem_description: idea.problem_description,
          validation_source: idea.validation_source,
          market_size: idea.market_size,
          validation_methods: idea.validation_methods
        };
      }) || [];

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
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Full Description</h4>
                  <p className="text-sm text-green-800">{idea.description}</p>
                </div>
                
                {idea.problem_description && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Problem Description</h4>
                    <p className="text-sm text-blue-800">{idea.problem_description}</p>
                  </div>
                )}

                {idea.validation_source && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Validation Source</h4>
                    <a 
                      href={idea.validation_source} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 break-all"
                    >
                      {idea.validation_source}
                    </a>
                  </div>
                )}

                {idea.market_size && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Market Size</h4>
                    <p className="text-sm text-blue-800">{idea.market_size}</p>
                  </div>
                )}

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
