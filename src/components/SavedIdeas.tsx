
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Trash2, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SavedIdea {
  id: string;
  idea_id: string;
  created_at: string;
  ideas: {
    title: string;
    teaser: string;
    category: string;
    tags: string[];
    views: number;
    interests: number;
  };
}

const SavedIdeas = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedIdeas();
    }
  }, [user]);

  const fetchSavedIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('saved_ideas')
        .select(`
          id,
          idea_id,
          created_at,
          ideas!inner (
            title,
            teaser,
            category,
            tags,
            views,
            interests
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedIdeas(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading saved ideas",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const removeSavedIdea = async (savedIdeaId: string) => {
    try {
      const { error } = await supabase
        .from('saved_ideas')
        .delete()
        .eq('id', savedIdeaId);

      if (error) throw error;

      setSavedIdeas(prev => prev.filter(item => item.id !== savedIdeaId));
      toast({ title: "Removed from favorites" });
    } catch (error: any) {
      toast({
        title: "Error removing favorite",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (savedIdeas.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Ideas</h3>
          <p className="text-gray-600">You haven't saved any ideas to favorites yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {savedIdeas.map((savedIdea) => (
        <Card key={savedIdea.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{savedIdea.ideas.title}</CardTitle>
              <Badge variant="outline">{savedIdea.ideas.category}</Badge>
            </div>
            <p className="text-sm text-gray-600">{savedIdea.ideas.teaser}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1">
                {savedIdea.ideas.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {savedIdea.ideas.views} views
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {savedIdea.ideas.interests} interests
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => window.open(`/explore`, '_blank')}
                >
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeSavedIdea(savedIdea.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SavedIdeas;
