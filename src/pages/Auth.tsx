
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, Mail, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SocialAuthButtons from "@/components/SocialAuthButtons";

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate('/');
      }
    };
    checkUser();

    // Pre-fill email from URL params or localStorage
    const emailParam = searchParams.get('email');
    const storedEmail = localStorage.getItem('preSignupEmail');
    
    if (emailParam) {
      setEmail(emailParam);
    } else if (storedEmail) {
      setEmail(storedEmail);
      localStorage.removeItem('preSignupEmail'); // Clean up
    }
  }, [navigate, searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-full p-3 w-fit mx-auto mb-4">
            <Lightbulb className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Ideopark</h1>
          <p className="text-slate-600">Sign in or create an account to get started</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center">Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              {/* ---- LOGIN TAB ---- */}
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="signin-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="signin-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="signin-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
                <div className="my-5 text-center relative">
                  <div className="absolute inset-x-0 top-2 border-t h-0.5 border-slate-200" />
                  <span className="relative z-10 bg-white/90 text-slate-400 px-2 text-xs">or</span>
                </div>
                <SocialAuthButtons context="login" onLoadingChange={setAuthLoading} />
              </TabsContent>
              
              {/* ---- SIGNUP TAB ---- */}
              <TabsContent value="signup">
                <div className="space-y-4">
                  <SocialAuthButtons context="signup" onLoadingChange={setAuthLoading} />
                  <div className="text-slate-400 text-center text-xs mt-4">
                    Sign up is available only via Google or LinkedIn.
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
