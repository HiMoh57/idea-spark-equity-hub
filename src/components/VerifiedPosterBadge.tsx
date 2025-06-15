
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface VerifiedPosterBadgeProps {
  isVerified: boolean;
  className?: string;
}

const VerifiedPosterBadge = ({ isVerified, className = "" }: VerifiedPosterBadgeProps) => {
  if (!isVerified) return null;

  return (
    <Badge 
      variant="secondary" 
      className={`bg-green-100 text-green-800 border-green-200 flex items-center gap-1 ${className}`}
    >
      <CheckCircle className="h-3 w-3" />
      Verified Poster
    </Badge>
  );
};

export default VerifiedPosterBadge;
