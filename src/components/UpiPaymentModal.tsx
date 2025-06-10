import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Upload, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface UpiPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaId: string;
  ideaTitle: string;
  onPaymentSubmitted: () => void;
}

const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
  isOpen,
  onClose,
  ideaId,
  ideaTitle,
  onPaymentSubmitted
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<'qr' | 'verification'>('qr');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    upiId: '',
    transactionId: '',
    screenshot: null as File | null
  });

  const amount = 150; // ₹150
  const upiId = 'startupideas@upi'; // Your UPI ID
  const upiUrl = `upi://pay?pa=${upiId}&am=${amount}&cu=INR&tn=Access to ${ideaTitle}`;

  const handlePaymentMade = () => {
    setStep('verification');
  };

  const handleSubmitVerification = async () => {
    if (!user || !formData.upiId || !formData.transactionId) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Create access request
      const { data: accessRequest, error: requestError } = await supabase
        .from('access_requests')
        .insert({
          idea_id: ideaId,
          requester_id: user.id,
          payment_amount: amount * 100, // Store in paise
          status: 'pending'
        })
        .select()
        .single();

      if (requestError) throw requestError;

      // Create payment verification record
      const { error: verificationError } = await supabase
        .from('payment_verifications')
        .insert({
          access_request_id: accessRequest.id,
          amount: amount * 100,
          upi_id: formData.upiId,
          transaction_id: formData.transactionId,
          verification_status: 'pending'
        });

      if (verificationError) throw verificationError;

      toast({
        title: "Verification Submitted!",
        description: "Your payment verification has been submitted. We'll review it and grant access within 24 hours.",
      });

      onPaymentSubmitted();
      onClose();
      setStep('qr');
      setFormData({ upiId: '', transactionId: '', screenshot: null });
    } catch (error: any) {
      toast({
        title: "Submission Error",
        description: error.message,
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
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            {step === 'qr' ? 'Pay via UPI' : 'Verify Payment'}
          </DialogTitle>
        </DialogHeader>

        {step === 'qr' ? (
          <div className="space-y-6">
            <div className="text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">Unlock Full Idea Description</h3>
                <p className="text-blue-800 text-sm mb-2">"{ideaTitle}"</p>
                <p className="text-2xl font-bold text-blue-900">₹{amount}</p>
              </div>

              <Card className="bg-white">
                <CardContent className="p-6">
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <div className="w-48 h-48 mx-auto bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-gray-600" />
                    </div>
                    <p className="text-xs text-gray-600 mt-2 text-center">
                      Scan QR code with any UPI app
                    </p>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>UPI ID:</strong> {upiId}</p>
                    <p><strong>Amount:</strong> ₹{amount}</p>
                    <p><strong>Note:</strong> Access to {ideaTitle}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-800 text-sm">
                  💳 Pay using PhonePe, Google Pay, Paytm, or any UPI app
                </p>
              </div>
            </div>

            <Button 
              onClick={handlePaymentMade}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              I have made the payment
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-amber-800 text-sm">
                Please provide the following details to verify your payment:
              </p>
            </div>

            <div>
              <Label htmlFor="upiId">Your UPI ID *</Label>
              <Input
                id="upiId"
                value={formData.upiId}
                onChange={(e) => setFormData({...formData, upiId: e.target.value})}
                placeholder="yourname@paytm / yourname@phonepe"
                required
              />
            </div>

            <div>
              <Label htmlFor="transactionId">Transaction ID *</Label>
              <Input
                id="transactionId"
                value={formData.transactionId}
                onChange={(e) => setFormData({...formData, transactionId: e.target.value})}
                placeholder="Enter 12-digit transaction ID"
                required
              />
            </div>

            <div>
              <Label htmlFor="screenshot">Payment Screenshot (Optional)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="screenshot"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({...formData, screenshot: e.target.files?.[0] || null})}
                />
                <Upload className="h-4 w-4 text-gray-400" />
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStep('qr')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleSubmitVerification}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Submitting..." : "Submit for Verification"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpiPaymentModal;
