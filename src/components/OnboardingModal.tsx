import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const SECTORS = [
  { id: 'ai', label: 'AI / Machine Learning', emoji: '🤖' },
  { id: 'healthtech', label: 'HealthTech', emoji: '🏥' },
  { id: 'fintech', label: 'FinTech', emoji: '💸' },
  { id: 'edtech', label: 'EdTech', emoji: '📚' },
  { id: 'ecommerce', label: 'Ecommerce', emoji: '🛒' },
  { id: 'web3', label: 'Web3 / Blockchain', emoji: '⛓️' },
  { id: 'cleantech', label: 'Climate / CleanTech', emoji: '🌱' },
  { id: 'creator', label: 'Creator Economy', emoji: '🎨' },
  { id: 'other', label: 'Others', emoji: '...' },
];

const GOALS = [
  { id: 'explore', label: 'I want to explore cool startup ideas' },
  { id: 'founder', label: "I'm a founder looking to validate my idea" },
  { id: 'investor', label: "I'm an investor / scout" },
  { id: 'join', label: 'I want to join or help build a startup' },
];

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleSectorToggle = (sectorId: string) => {
    setSelectedSectors(prev =>
      prev.includes(sectorId)
        ? prev.filter(id => id !== sectorId)
        : [...prev, sectorId]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          interested_tags: selectedSectors,
          user_goal: selectedGoal,
          newsletter_email: newsletterEmail || null,
          profile_complete: true,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Thank you for sharing your interests.",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Tell us what you love! 🚀
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sectors Selection */}
          <div className="space-y-3">
            <Label>Choose your favorite startup sectors</Label>
            <div className="flex flex-wrap gap-2">
              {SECTORS.map(sector => (
                <Badge
                  key={sector.id}
                  variant={selectedSectors.includes(sector.id) ? "default" : "outline"}
                  className="cursor-pointer px-3 py-1"
                  onClick={() => handleSectorToggle(sector.id)}
                >
                  {sector.emoji} {sector.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Goals Selection */}
          <div className="space-y-3">
            <Label>Your current goal</Label>
            <RadioGroup value={selectedGoal} onValueChange={setSelectedGoal}>
              {GOALS.map(goal => (
                <div key={goal.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={goal.id} id={goal.id} />
                  <Label htmlFor={goal.id}>{goal.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Newsletter Email */}
          <div className="space-y-3">
            <Label htmlFor="newsletter">(Optional) Enter email to get weekly idea drops</Label>
            <Input
              id="newsletter"
              type="email"
              placeholder="your@email.com"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={loading || selectedSectors.length === 0 || !selectedGoal}
          >
            {loading ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal; 
