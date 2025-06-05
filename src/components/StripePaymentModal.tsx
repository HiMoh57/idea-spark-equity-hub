
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaId: string;
  ideaTitle: string;
  amount: number;
  onPaymentSuccess: () => void;
}

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  isOpen,
  onClose,
  ideaId,
  ideaTitle,
  amount,
  onPaymentSuccess
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      // Create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {
          ideaId,
          ideaTitle,
          amount: amount * 100, // Convert to cents
        }
      });

      if (error) throw error;

      // Redirect to Stripe Checkout
      if (data.url) {
        window.open(data.url, '_blank');
        onClose();
        
        // Show success message
        toast({
          title: "Redirected to payment",
          description: "Complete your payment to access the full idea description."
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Access Full Idea Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">{ideaTitle}</h3>
            <p className="text-3xl font-bold text-blue-600">${amount}</p>
            <p className="text-sm text-gray-600 mt-2">
              One-time payment to access the complete idea description and business plan
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-3 text-blue-900">What you'll get:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Complete business idea description</li>
              <li>• Market analysis and opportunity</li>
              <li>• Implementation roadmap</li>
              <li>• Equity percentage details</li>
              <li>• Contact information for collaboration</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Pay with Stripe
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Secure payment powered by Stripe. Your payment information is encrypted and secure.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StripePaymentModal;
