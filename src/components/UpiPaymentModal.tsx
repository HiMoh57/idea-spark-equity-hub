
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Upload, CheckCircle, Loader2 } from 'lucide-react';
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
  const [step, setStep] = useState<'qr' | 'verification'>('qr');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    upiId: '',
    transactionId: '',
    screenshot: null as File | null
  });

  // UPI QR code data for payment - this would typically be your business UPI ID
  const upiQrData = `upi://pay?pa=yourbusiness@paytm&pn=Ideopark&am=${amount}&cu=INR&tn=Access%20to%20${encodeURIComponent(ideaTitle)}`;

  const handlePaymentMade = () => {
    setStep('verification');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        screenshot: file
      }));
    }
  };

  const handleSubmitVerification = async () => {
    if (!formData.upiId || !formData.transactionId) {
      toast({
        title: "Missing Information",
        description: "Please fill in your UPI ID and Transaction ID.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // First create the access request
      const { data: accessRequest, error: accessError } = await supabase
        .from('access_requests')
        .insert({
          idea_id: ideaId,
          requester_id: (await supabase.auth.getUser()).data.user?.id,
          payment_amount: amount,
          status: 'pending'
        })
        .select()
        .single();

      if (accessError) throw accessError;

      // Upload screenshot if provided
      let screenshotUrl = null;
      if (formData.screenshot) {
        const fileExt = formData.screenshot.name.split('.').pop();
        const fileName = `payment-${accessRequest.id}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-screenshots')
          .upload(fileName, formData.screenshot);

        if (uploadError) {
          console.error('Screenshot upload failed:', uploadError);
        } else {
          screenshotUrl = uploadData.path;
        }
      }

      // Create payment verification record
      const { error: verificationError } = await supabase
        .from('payment_verifications')
        .insert({
          access_request_id: accessRequest.id,
          upi_id: formData.upiId,
          transaction_id: formData.transactionId,
          amount: amount,
          verification_status: 'pending',
          screenshot_url: screenshotUrl
        });

      if (verificationError) throw verificationError;

      toast({
        title: "Payment Submitted for Verification",
        description: "Your payment details have been submitted. We'll verify and grant access within 24 hours.",
      });

      onClose();
      onPaymentSuccess();

    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit payment verification. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const resetModal = () => {
    setStep('qr');
    setFormData({ upiId: '', transactionId: '', screenshot: null });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetModal();
        onClose();
      }
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Access Full Idea Details</DialogTitle>
        </DialogHeader>

        {step === 'qr' ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">{ideaTitle}</h3>
              <p className="text-3xl font-bold text-blue-600">₹{amount}</p>
              <p className="text-sm text-gray-600 mt-2">
                One-time payment to access the complete idea description
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 text-center">
              <div className="mb-4">
                <QrCode className="h-32 w-32 mx-auto text-gray-400" />
                <p className="text-sm text-gray-600 mt-2">Scan QR code with any UPI app</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg text-sm">
                <p className="font-medium text-blue-900">Pay using:</p>
                <p className="text-blue-800">PhonePe • Google Pay • Paytm • Amazon Pay</p>
                <p className="text-blue-800">or any UPI-enabled app</p>
              </div>
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
              >
                Cancel
              </Button>
              <Button 
                onClick={handlePaymentMade}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                I have made the payment
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-lg">Payment Verification</h3>
              <p className="text-sm text-gray-600">
                Please provide your payment details for verification
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="upi-id">UPI ID used for payment *</Label>
                <Input
                  id="upi-id"
                  placeholder="e.g., yourname@paytm, 9876543210@ybl"
                  value={formData.upiId}
                  onChange={(e) => handleInputChange('upiId', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="transaction-id">Transaction ID *</Label>
                <Input
                  id="transaction-id"
                  placeholder="e.g., T2024010112345678"
                  value={formData.transactionId}
                  onChange={(e) => handleInputChange('transactionId', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="screenshot">Screenshot (Optional)</Label>
                <div className="mt-1">
                  <Input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="cursor-pointer"
                  />
                  {formData.screenshot && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {formData.screenshot.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
              <p className="font-medium">⏱️ Verification Process</p>
              <p>We'll verify your payment within 24 hours and grant access automatically.</p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep('qr')}
                className="flex-1"
                disabled={loading}
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmitVerification}
                disabled={loading || !formData.upiId || !formData.transactionId}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit for Verification'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpiPaymentModal;
