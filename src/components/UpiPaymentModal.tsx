
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, QrCode, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaId: string;
  ideaTitle: string;
  amount: number;
  onPaymentSuccess: () => void;
}

const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  ideaId,
  ideaTitle,
  amount,
  onPaymentSuccess
}) => {
  const { toast } = useToast();
  const [paymentStep, setPaymentStep] = useState<'payment' | 'verification'>('payment');
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: '',
    upiRef: '',
    screenshot: null as File | null
  });
  const [uploading, setUploading] = useState(false);

  const upiId = "startup@upi"; // Replace with actual UPI ID
  const upiLink = `upi://pay?pa=${upiId}&pn=StartupIdeas&am=${amount}&cu=INR&tn=Payment for ${ideaTitle}`;

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    toast({ title: "UPI ID copied to clipboard" });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPaymentDetails(prev => ({ ...prev, screenshot: file }));
    }
  };

  const handleSubmitVerification = async () => {
    if (!paymentDetails.transactionId && !paymentDetails.upiRef) {
      toast({
        title: "Error",
        description: "Please provide either Transaction ID or UPI Reference Number",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // First create access request
      const { data: accessRequest, error: accessError } = await supabase
        .from('access_requests')
        .insert({
          idea_id: ideaId,
          requester_id: (await supabase.auth.getUser()).data.user?.id,
          payment_amount: amount * 100, // Convert to paise
          status: 'payment_pending'
        })
        .select()
        .single();

      if (accessError) throw accessError;

      // Upload screenshot if provided
      let screenshotUrl = null;
      if (paymentDetails.screenshot) {
        const fileName = `payment_${accessRequest.id}_${Date.now()}.jpg`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-screenshots')
          .upload(fileName, paymentDetails.screenshot);

        if (uploadError) {
          console.error('Screenshot upload error:', uploadError);
        } else {
          screenshotUrl = uploadData.path;
        }
      }

      // Create payment verification
      const { error: verificationError } = await supabase
        .from('payment_verifications')
        .insert({
          access_request_id: accessRequest.id,
          transaction_id: paymentDetails.transactionId || null,
          upi_ref: paymentDetails.upiRef || null,
          amount: amount * 100,
          screenshot_url: screenshotUrl,
          verification_status: 'pending'
        });

      if (verificationError) throw verificationError;

      toast({
        title: "Payment verification submitted!",
        description: "We'll verify your payment and grant access within 24 hours."
      });

      onPaymentSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pay to Access Full Idea</DialogTitle>
        </DialogHeader>

        {paymentStep === 'payment' ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">{ideaTitle}</h3>
              <p className="text-2xl font-bold text-blue-600">₹{amount}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Pay using UPI</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <span className="font-mono text-sm">{upiId}</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyUpiId}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-center">
                  <a 
                    href={upiLink}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Pay with UPI App
                  </a>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => setPaymentStep('verification')}
              className="w-full"
            >
              I've Made the Payment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="font-medium">Verify Your Payment</h4>
            
            <div>
              <Label htmlFor="transactionId">Transaction ID (Optional)</Label>
              <Input
                id="transactionId"
                value={paymentDetails.transactionId}
                onChange={(e) => setPaymentDetails(prev => ({ 
                  ...prev, 
                  transactionId: e.target.value 
                }))}
                placeholder="Enter transaction ID"
              />
            </div>

            <div>
              <Label htmlFor="upiRef">UPI Reference Number (Optional)</Label>
              <Input
                id="upiRef"
                value={paymentDetails.upiRef}
                onChange={(e) => setPaymentDetails(prev => ({ 
                  ...prev, 
                  upiRef: e.target.value 
                }))}
                placeholder="Enter UPI reference number"
              />
            </div>

            <div>
              <Label htmlFor="screenshot">Payment Screenshot (Optional)</Label>
              <div className="mt-1">
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setPaymentStep('payment')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmitVerification}
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? "Submitting..." : "Submit for Verification"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpiPaymentModal;
