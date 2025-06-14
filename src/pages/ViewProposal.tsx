
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, TrendingUp, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ViewProposal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [proposal, setProposal] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (user && id) {
      fetchProposal();
    }
  }, [user, authLoading, id, navigate]);

  const fetchProposal = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          ideas!inner(title, creator_id, teaser),
          profiles!proposals_executor_id_fkey(full_name, bio)
        `)
        .eq('id', id)
        .eq('ideas.creator_id', user.id)
        .single();

      if (error) throw error;
      setProposal(data);
    } catch (error: any) {
      toast({
        title: "Error loading proposal",
        description: error.message,
        variant: "destructive"
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!proposal) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-6 hover:bg-blue-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-slate-900">
                  Proposal Details
                </CardTitle>
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                  {proposal.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Idea Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Idea Details</h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-medium text-slate-900 mb-2">{proposal.ideas.title}</h4>
                  <p className="text-slate-600">{proposal.ideas.teaser}</p>
                </div>
              </div>

              {/* Proposal Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Proposal</h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-medium text-slate-900 mb-2">{proposal.title}</h4>
                  <p className="text-slate-600 whitespace-pre-wrap">{proposal.description}</p>
                </div>
              </div>

              {/* Executor Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Executor Information</h3>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{proposal.profiles?.full_name || 'Anonymous User'}</p>
                    <p className="text-sm text-slate-600 mb-2">Executor</p>
                    {proposal.profiles?.bio && (
                      <p className="text-sm text-slate-600">{proposal.profiles.bio}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Proposal Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Proposal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Submitted</p>
                      <p className="font-medium text-slate-900">
                        {new Date(proposal.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-slate-500">Proposed Equity</p>
                      <p className="font-medium text-slate-900">{proposal.proposed_equity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-slate-500">Timeline</p>
                      <p className="font-medium text-slate-900">{proposal.timeline || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience */}
              {proposal.experience && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Relevant Experience</h3>
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-slate-600 whitespace-pre-wrap">{proposal.experience}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewProposal;
