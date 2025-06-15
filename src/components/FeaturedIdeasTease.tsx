
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Eye, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface FeaturedIdea {
  id: string;
  title: string;
  teaser: string;
  category: string;
  views: number;
  interests: number;
}

const FeaturedIdeasTease = () => {
  const [featuredIdeas, setFeaturedIdeas] = useState<FeaturedIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedIdeas();
  }, []);

  const fetchFeaturedIdeas = async () => {
    try {
      const { data, error } = await supabase
        .from('featured_ideas')
        .select(`
          ideas!inner (
            id,
            title,
            teaser,
            category,
            views,
            interests
          )
        `)
        .eq('is_active', true)
        .order('featured_order')
        .limit(3);

      if (error) throw error;

      const ideas = data?.map(item => item.ideas).filter(Boolean) || [];
      setFeaturedIdeas(ideas as FeaturedIdea[]);
    } catch (error) {
      console.error('Error fetching featured ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = () => {
    navigate('/auth');
  };

  if (loading || user) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            🔥 Premium Startup Ideas
          </h2>
          <p className="text-xl text-slate-600">
            High-value, validated ideas from verified creators
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {featuredIdeas.map((idea, index) => (
            <Card key={idea.id} className="relative overflow-hidden border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
                <div className="text-center p-6">
                  <Lock className="h-12 w-12 text-amber-600 mx-auto mb-4" />
                  <h3 className="font-bold text-slate-900 mb-2">Premium Idea</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Unlock to see this validated startup idea
                  </p>
                  <Button
                    onClick={handleUnlock}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold"
                  >
                    Unlock for ₹150
                  </Button>
                </div>
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    {idea.category}
                  </Badge>
                  <Badge variant="outline" className="border-amber-400 text-amber-700">
                    Premium
                  </Badge>
                </div>
                <CardTitle className="text-lg blur-sm">{idea.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p className="text-slate-600 text-sm mb-4 blur-sm">
                  {idea.teaser}
                </p>
                
                <div className="flex items-center justify-between text-sm text-slate-500 blur-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {idea.views || 0}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {idea.interests || 0}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-600 mb-4">
            🚀 Join 500+ entrepreneurs accessing premium startup ideas
          </p>
          <Button
            onClick={handleUnlock}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-8"
          >
            Get Full Access Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedIdeasTease;
