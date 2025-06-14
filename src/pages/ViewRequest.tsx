import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ViewRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (user && id) {
      fetchRequest();
    }
  }, [user, authLoading, id, navigate]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('access_requests')
        .select(`
          *,
          ideas!inner(title, creator_id, teaser),
          payment_verifications(*),
          profiles!access_requests_requester_id_fkey(full_name)
        `)
        .eq('id', id)
        .eq('ideas.creator_id', user.id)
        .single();

      if (error) throw error;
      setRequest(data);
    } catch (error: any) {
      toast({
        title: "Error loading request",
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

  if (!request) return null;

  const hasVerifiedPayment = request.payment_verifications?.some(
    (pv: any) => pv.verification_status === 'verified'
  );

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
                  Access Request Details
                </CardTitle>
                <Badge 
                  variant={hasVerifiedPayment ? "default" : "secondary"}
                  className={hasVerifiedPayment ? "bg-green-500" : ""}
                >
                  {hasVerifiedPayment ? "Payment Verified" : "Pending Payment"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Idea Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Idea Details</h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <h4 className="font-medium text-slate-900 mb-2">{request.ideas?.title}</h4>
                  <p className="text-slate-600">{request.ideas?.teaser}</p>
                </div>
              </div>

              {/* Requester Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Requester Information</h3>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{request.profiles?.full_name || 'Anonymous User'}</p>
                    <p className="text-sm text-slate-600">Executor</p>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-slate-500">Requested</p>
                      <p className="font-medium text-slate-900">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-slate-500">Amount</p>
                      <p className="font-medium text-slate-900">₹{request.payment_amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                    {hasVerifiedPayment ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <p className="font-medium text-slate-900">
                        {hasVerifiedPayment ? 'Verified' : 'Pending'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Verification Details */}
              {request.payment_verifications && request.payment_verifications.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Payment Verification</h3>
                  <div className="space-y-3">
                    {request.payment_verifications.map((pv: any) => (
                      <div key={pv.id} className="p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <Badge 
                            variant={pv.verification_status === 'verified' ? "default" : "secondary"}
                            className={pv.verification_status === 'verified' ? "bg-green-500" : ""}
                          >
                            {pv.verification_status}
                          </Badge>
                          <span className="text-sm text-slate-500">
                            {new Date(pv.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {pv.transaction_id && (
                          <p className="text-sm text-slate-600">
                            Transaction ID: {pv.transaction_id}
                          </p>
                        )}
                      </div>
                    ))}
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

export default ViewRequest;
