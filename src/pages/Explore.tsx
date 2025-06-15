import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import IdeaCard from '@/components/IdeaCard';
import CommentSystem from '@/components/CommentSystem';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Idea {
  id: string;
  title: string;
  teaser: string;
  description?: string;
  category: string;
  tags: string[];
  views: number;
  interests: number;
  created_at: string;
  creator_id: string;
  equity_percentage: number;
  profiles?: {
    full_name?: string;
    is_verified_poster?: boolean;
  };
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
          description,
          category,
          tags,
          views,
          interests,
          created_at,
          creator_id,
          equity_percentage
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

      // Fetch profiles separately for the creators
      if (ideasData && ideasData.length > 0) {
        const creatorIds = [...new Set(ideasData.map(idea => idea.creator_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, is_verified_poster')
          .in('id', creatorIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        // Merge the profile data with ideas
        const ideasWithProfiles = ideasData.map(idea => ({
          ...idea,
          profiles: profilesData?.find(profile => profile.id === idea.creator_id) || null
        }));

        setIdeas(ideasWithProfiles);
      } else {
        setIdeas([]);
      }
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

  const handleViewDetails = (ideaId: string) => {
    console.log('View details for idea:', ideaId);
    // Add navigation logic here if needed
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Navbar />
        <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading ideas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-slate-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Explore Startup Ideas
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover innovative concepts from visionary creators. Connect with groundbreaking ideas 
              and find your next big opportunity in the startup ecosystem.
            </p>
            <div className="mt-8 flex justify-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{ideas.length} Active Ideas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Verified Creators</span>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <Card className="mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-md">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    placeholder="Search by title, description, tags, or creator..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 py-3 text-base border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-56 py-3">
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
                    <SelectTrigger className="w-full sm:w-48 py-3">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="interests">Most Interest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Filter Tags */}
              {searchQuery && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-600">Searching for:</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      "{searchQuery}"
                    </span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-slate-400 hover:text-slate-600 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-lg font-medium text-slate-900">
                {filteredIdeas.length} idea{filteredIdeas.length !== 1 ? 's' : ''} found
              </p>
              <p className="text-sm text-slate-600 mt-1">
                {selectedCategory !== 'all' && `in ${selectedCategory} • `}
                Sorted by {sortBy === 'newest' ? 'newest first' : sortBy === 'popular' ? 'popularity' : 'interest level'}
              </p>
            </div>
            
            {filteredIdeas.length > 0 && (
              <div className="text-sm text-slate-500">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredIdeas.map((idea, index) => (
              <div 
                key={idea.id} 
                className="space-y-4 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <IdeaCard idea={idea} onViewDetails={handleViewDetails} />
                <CommentSystem ideaId={idea.id} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredIdeas.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-slate-100 to-slate-200 rounded-full p-6 w-fit mx-auto mb-6">
                <Search className="h-12 w-12 text-slate-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">No ideas found</h3>
              <p className="text-slate-600 mb-6 max-w-md mx-auto">
                We couldn't find any ideas matching your criteria. Try adjusting your search terms or exploring different categories.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Refresh Ideas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
