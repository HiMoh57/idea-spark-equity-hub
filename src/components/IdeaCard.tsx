
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Clock, User, Lock } from 'lucide-react';

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    teaser: string;
    category: string;
    tags: string[];
    views: number;
    interests: number;
    createdAt: string;
    creator: string;
  };
}

const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const handleRequestAccess = () => {
    console.log('Requesting access to idea:', idea.id);
    // This will later open the payment modal
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm group">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
            {idea.category}
          </Badge>
          <div className="flex items-center text-xs text-slate-500">
            <Clock className="h-3 w-3 mr-1" />
            {new Date(idea.createdAt).toLocaleDateString()}
          </div>
        </div>

        <h3 className="text-xl font-semibold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
          {idea.title}
        </h3>

        <p className="text-slate-600 mb-4 line-clamp-3">
          {idea.teaser}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {idea.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4 text-sm text-slate-500">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            {idea.creator}
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {idea.views}
            </div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 mr-1" />
              {idea.interests}
            </div>
          </div>
        </div>

        <Button 
          onClick={handleRequestAccess}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Lock className="h-4 w-4 mr-2" />
          Request Full Access - $10
        </Button>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
