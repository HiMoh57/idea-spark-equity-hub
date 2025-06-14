
import React from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SocialAuthButtonsProps {
  context: "login" | "signup";
  onLoadingChange?: (loading: boolean) => void;
}

const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({ context, onLoadingChange }) => {
  const { toast } = useToast();

  const handleOAuth = async (provider: "google" | "linkedin_oidc") => {
    try {
      onLoadingChange?.(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin + "/",
        },
      });
      if (error) {
        toast({
          title: "Authentication error",
          description: error.message,
          variant: "destructive",
        });
        onLoadingChange?.(false);
      }
      // On success, Supabase redirects, so no further action needed here
    } catch (e: any) {
      toast({
        title: "Authentication error",
        description: e.message ?? String(e),
        variant: "destructive",
      });
      onLoadingChange?.(false);
    }
  };

  return (
    <div className="flex flex-col space-y-3 w-full">
      <Button 
        type="button"
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={() => handleOAuth("google")}
      >
        <FcGoogle className="text-xl" />
        {context === "signup" ? "Sign up with Google" : "Sign in with Google"}
      </Button>
      <Button 
        type="button"
        variant="outline"
        className="w-full flex items-center gap-2"
        onClick={() => handleOAuth("linkedin_oidc")}
      >
        <Linkedin className="w-5 h-5 text-blue-700" />
        {context === "signup" ? "Sign up with LinkedIn" : "Sign in with LinkedIn"}
      </Button>
    </div>
  );
};

export default SocialAuthButtons;
