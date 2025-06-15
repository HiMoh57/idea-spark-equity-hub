
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PostSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfileLink: string;
}

const PostSubmitModal: React.FC<PostSubmitModalProps> = ({
  isOpen,
  onClose,
  userProfileLink
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(userProfileLink);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share it to get 3 more views on your idea."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive"
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out my startup idea!',
        text: 'I just shared my startup idea. Take a look!',
        url: userProfileLink,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-slate-900">
            🎉 Thanks for sharing!
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-slate-600">
            Get <span className="font-bold text-blue-600">3 more views</span> by sharing your profile link.
          </p>
          
          <div className="p-3 bg-slate-50 rounded-lg border">
            <p className="text-xs text-slate-500 mb-1">Your profile link:</p>
            <p className="text-sm font-mono text-slate-700 break-all">
              {userProfileLink}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleShare}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share Link
            </Button>
            
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="flex-1"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-2 text-green-600" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          <Button
            onClick={onClose}
            variant="ghost"
            className="w-full text-slate-500"
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PostSubmitModal;
