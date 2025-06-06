
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaId: string;
  onProposalSubmitted?: () => void;
}

const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  ideaId,
  onProposalSubmitted
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    proposedEquity: 5,
    timeline: '',
    experience: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('proposals')
        .insert({
          executor_id: user.id,
          idea_id: ideaId,
          title: formData.title,
          description: formData.description,
          proposed_equity: formData.proposedEquity,
          timeline: formData.timeline,
          experience: formData.experience
        });

      if (error) throw error;

      // Create notification for idea creator
      const { data: ideaData } = await supabase
        .from('ideas')
        .select('creator_id, title')
        .eq('id', ideaId)
        .single();

      if (ideaData) {
        await supabase.rpc('create_notification', {
          user_uuid: ideaData.creator_id,
          notification_type: 'proposal',
          notification_title: 'New Collaboration Proposal',
          notification_message: `Someone submitted a proposal for your idea: ${ideaData.title}`,
          related_uuid: ideaId
        });
      }

      toast({
        title: "Proposal Submitted!",
        description: "Your collaboration proposal has been sent to the idea creator.",
      });

      onProposalSubmitted?.();
      onClose();
      setFormData({
        title: '',
        description: '',
        proposedEquity: 5,
        timeline: '',
        experience: ''
      });
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Submit Collaboration Proposal
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Proposal Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Brief title for your proposal"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Proposal Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your execution plan, approach, and how you plan to bring this idea to life..."
              className="min-h-32"
              required
            />
          </div>

          <div>
            <Label htmlFor="proposedEquity">Proposed Equity Share (%) *</Label>
            <Input
              id="proposedEquity"
              type="number"
              min="1"
              max="100"
              value={formData.proposedEquity}
              onChange={(e) => setFormData({...formData, proposedEquity: parseInt(e.target.value) || 5})}
              placeholder="5"
              required
            />
          </div>

          <div>
            <Label htmlFor="timeline">Execution Timeline</Label>
            <Input
              id="timeline"
              value={formData.timeline}
              onChange={(e) => setFormData({...formData, timeline: e.target.value})}
              placeholder="e.g., 6 months to MVP, 12 months to launch"
            />
          </div>

          <div>
            <Label htmlFor="experience">Relevant Experience</Label>
            <Textarea
              id="experience"
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
              placeholder="Share your relevant skills, experience, and past projects..."
              className="min-h-24"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting..." : "Submit Proposal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalModal;
