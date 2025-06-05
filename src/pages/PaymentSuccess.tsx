
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [ideaTitle, setIdeaTitle] = useState('');
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      // Get access request details
      const { data: accessRequest, error } = await supabase
        .from('access_requests')
        .select(`
          idea_id,
          ideas (
            title
          )
        `)
        .eq('stripe_session_id', sessionId)
        .single();

      if (error) throw error;

      if (accessRequest) {
        setIdeaTitle(accessRequest.ideas.title);
        toast({
          title: "Payment Successful!",
          description: `You now have access to "${accessRequest.ideas.title}"`
        });
      }
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      toast({
        title: "Verification Error",
        description: "There was an issue verifying your payment. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  Payment Successful!
                </h1>
                <p className="text-slate-600 text-lg">
                  Your payment has been processed successfully.
                </p>
              </div>

              {ideaTitle && (
                <div className="mb-8 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-900 font-medium">
                    You now have full access to:
                  </p>
                  <p className="text-blue-800 text-lg font-semibold mt-1">
                    "{ideaTitle}"
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">What's Next?</h3>
                  <ul className="text-sm text-green-800 space-y-1 text-left">
                    <li>• View the complete idea description and business plan</li>
                    <li>• Access implementation roadmap and market analysis</li>
                    <li>• See equity percentage and collaboration details</li>
                    <li>• Connect with the idea creator for potential partnership</li>
                  </ul>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/explore')}
                    variant="outline"
                    className="flex items-center"
                  >
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Back to Explore
                  </Button>
                  <Button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center bg-blue-600 hover:bg-blue-700"
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Go to Dashboard
                  </Button>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  Receipt and confirmation details have been sent to your email.
                  If you have any questions, please contact our support team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
