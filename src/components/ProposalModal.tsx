
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  ideaId: string;
  ideaTitle: string;
  creatorId: string;
}

const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  ideaId,
  ideaTitle,
  creatorId
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [proposal, setProposal] = useState({
    title: '',
    description: '',
    proposedEquity: 70,
    timeline: '',
    experience: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);

    try {
      // Create the proposal
      const { error: proposalError } = await supabase
        .from('proposals')
        .insert({
          idea_id: ideaId,
          executor_id: user.id,
          title: proposal.title,
          description: proposal.description,
          proposed_equity: proposal.proposedEquity,
          timeline: proposal.timeline,
          experience: proposal.experience,
          status: 'pending'
        });

      if (proposalError) throw proposalError;

      // Create notification for idea creator
      await supabase.rpc('create_notification', {
        user_uuid: creatorId,
        notification_type: 'proposal',
        notification_title: 'New Collaboration Proposal',
        notification_message: `${user.email} submitted a proposal for your idea: ${ideaTitle}`,
        related_uuid: ideaId
      });

      toast({
        title: "Proposal submitted successfully!",
        description: "The idea creator will be notified and can review your proposal."
      });

      // Reset form
      setProposal({
        title: '',
        description: '',
        proposedEquity: 70,
        timeline: '',
        experience: ''
      });

      onClose();
    } catch (error: any) {
      toast({
        title: "Error submitting proposal",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Collaboration Proposal</DialogTitle>
          <p className="text-sm text-slate-600">
            Propose to execute: <strong>{ideaTitle}</strong>
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Proposal Title</Label>
            <Input
              id="title"
              value={proposal.title}
              onChange={(e) => setProposal(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief title for your proposal"
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Detailed Proposal</Label>
            <Textarea
              id="description"
              value={proposal.description}
              onChange={(e) => setProposal(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your approach, strategy, and how you plan to execute this idea..."
              required
              className="mt-1 min-h-[150px]"
            />
          </div>

          <div>
            <Label htmlFor="experience">Your Relevant Experience</Label>
            <Textarea
              id="experience"
              value={proposal.experience}
              onChange={(e) => setProposal(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="Describe your background, skills, and relevant experience..."
              required
              className="mt-1 min-h-[100px]"
            />
          </div>

          <div>
            <Label htmlFor="timeline">Estimated Timeline</Label>
            <Input
              id="timeline"
              value={proposal.timeline}
              onChange={(e) => setProposal(prev => ({ ...prev, timeline: e.target.value }))}
              placeholder="e.g., 6-12 months to MVP, 18 months to market"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Proposed Equity Split</Label>
            <div className="mt-2 p-4 bg-slate-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span>You (Executor):</span>
                <span className="font-semibold">{proposal.proposedEquity}%</span>
              </div>
              <div className="flex justify-between items-center mb-3">
                <span>Idea Creator:</span>
                <span className="font-semibold">{100 - proposal.proposedEquity}%</span>
              </div>
              <Slider
                value={[proposal.proposedEquity]}
                onValueChange={(value) => setProposal(prev => ({ ...prev, proposedEquity: value[0] }))}
                max={95}
                min={50}
                step={5}
                className="mt-2"
              />
              <p className="text-xs text-slate-500 mt-2">
                Adjust the equity split based on your contribution and risk
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• The idea creator will receive your proposal</li>
              <li>• They can accept, reject, or negotiate terms</li>
              <li>• If accepted, you can start collaborating on the idea</li>
              <li>• All agreements should be formalized legally</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting ? "Submitting..." : "Submit Proposal"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalModal;
