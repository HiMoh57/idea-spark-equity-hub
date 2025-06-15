
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const EmailSignup = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase.auth.getUser();
      if (existingUser.user) {
        navigate('/dashboard');
        return;
      }

      // Store email in localStorage for later use
      localStorage.setItem('preSignupEmail', email);
      
      toast({
        title: "Great! Let's get you started",
        description: "Redirecting you to complete your signup...",
      });

      // Redirect to auth page with email pre-filled
      navigate(`/auth?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl p-6 mb-8">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Get Early Access</h3>
        <p className="text-slate-600">Enter your email to unlock premium startup ideas</p>
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="pl-10 h-12 border-slate-200 focus:border-blue-500"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !email}
          className="h-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {loading ? "..." : <ArrowRight className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};

export default EmailSignup;
