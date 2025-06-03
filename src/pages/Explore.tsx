
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import IdeaCard from '@/components/IdeaCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Idea {
  id: string;
  title: string;
  teaser: string;
  category: string;
  tags: string[];
  views: number;
  interests: number;
  created_at: string;
  creator_name: string;
}

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categories = ['all', 'HealthTech', 'EdTech', 'FinTech', 'Sustainability', 'AgriTech', 'Enterprise', 'Consumer', 'Other'];

  useEffect(() => {
    fetchIdeas();
  }, [sortBy]);

  const fetchIdeas = async () => {
    try {
      let query = supabase
        .from('ideas')
        .select(`
          id,
          title,
          teaser,
          category,
          tags,
          views,
          interests,
          created_at,
          creator_id
        `)
        .eq('status', 'approved');

      // Apply sorting
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'popular') {
        query = query.order('views', { ascending: false });
      } else if (sortBy === 'interests') {
        query = query.order('interests', { ascending: false });
      }

      const { data: ideasData, error: ideasError } = await query;

      if (ideasError) throw ideasError;

      if (!ideasData || ideasData.length === 0) {
        setIdeas([]);
        return;
      }

      // Fetch creator names separately
      const creatorIds = [...new Set(ideasData.map(idea => idea.creator_id))];
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', creatorIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Combine ideas with creator names
      const ideasWithCreators = ideasData.map(idea => ({
        id: idea.id,
        title: idea.title,
        teaser: idea.teaser,
        category: idea.category,
        tags: idea.tags || [],
        views: idea.views || 0,
        interests: idea.interests || 0,
        created_at: idea.created_at,
        creator_name: profiles?.find(p => p.id === idea.creator_id)?.full_name || 'Anonymous'
      }));

      setIdeas(ideasWithCreators);
    } catch (error: any) {
      toast({
        title: "Error loading ideas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.teaser.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="pt-20 flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Explore Startup Ideas
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Discover innovative concepts from visionary creators. Find your next big opportunity.
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search ideas, tags, or creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="interests">Most Interest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-slate-600">
              Showing {filteredIdeas.length} idea{filteredIdeas.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map(idea => {
              const ideaData = {
                id: idea.id,
                title: idea.title,
                teaser: idea.teaser,
                category: idea.category,
                tags: idea.tags,
                views: idea.views,
                interests: idea.interests,
                createdAt: idea.created_at,
                creator: idea.creator_name
              };
              return <IdeaCard key={idea.id} idea={ideaData} />;
            })}
          </div>

          {filteredIdeas.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-slate-100 rounded-full p-4 w-fit mx-auto mb-4">
                <Search className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No ideas found</h3>
              <p className="text-slate-600">Try adjusting your search criteria or explore different categories.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
