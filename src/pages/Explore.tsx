
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Sparkles, TrendingUp, Clock, Eye } from 'lucide-react';
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
}

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdeaForComments, setSelectedIdeaForComments] = useState<string | null>(null);
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

      setIdeas(ideasData || []);
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

  const getSortIcon = () => {
    switch (sortBy) {
      case 'popular': return <Eye className="h-4 w-4" />;
      case 'interests': return <TrendingUp className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute top-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-40 left-1/2 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />
      
      <div className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 relative">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-6 animate-fade-in border border-blue-200/50 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Discover the Next Unicorn
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight animate-fade-in animation-delay-200">
              Explore
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent"> Revolutionary</span>
              <br />Startup Ideas
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed animate-fade-in animation-delay-400">
              Discover innovative concepts from visionary creators. Find breakthrough opportunities 
              that could reshape entire industries.
            </p>

            {/* Stats */}
            <div className="flex justify-center items-center gap-8 mt-8 animate-fade-in animation-delay-600">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{ideas.length}+</div>
                <div className="text-sm text-slate-600">Active Ideas</div>
              </div>
              <div className="w-px h-8 bg-slate-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {ideas.reduce((sum, idea) => sum + idea.interests, 0)}+
                </div>
                <div className="text-sm text-slate-600">Total Interest</div>
              </div>
              <div className="w-px h-8 bg-slate-300"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {ideas.reduce((sum, idea) => sum + idea.views, 0)}+
                </div>
                <div className="text-sm text-slate-600">Views</div>
              </div>
            </div>
          </div>

          {/* Enhanced Search and Filters */}
          <Card className="mb-12 border-0 shadow-2xl bg-white/90 backdrop-blur-xl animate-fade-in animation-delay-800 hover:shadow-3xl transition-all duration-500">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1 relative group">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <Input
                    placeholder="Search breakthrough ideas, cutting-edge tech, industry disruptors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full sm:w-56 h-14 border-2 border-slate-200 focus:border-purple-500 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300">
                      <div className="flex items-center gap-2">
                        <Filter className="h-5 w-5 text-slate-600" />
                        <SelectValue placeholder="Industry" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-slate-200 shadow-2xl">
                      {categories.map(category => (
                        <SelectItem key={category} value={category} className="hover:bg-blue-50">
                          {category === 'all' ? 'All Industries' : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-56 h-14 border-2 border-slate-200 focus:border-purple-500 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-300">
                      <div className="flex items-center gap-2">
                        {getSortIcon()}
                        <SelectValue placeholder="Sort by" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="bg-white/95 backdrop-blur-xl border-slate-200 shadow-2xl">
                      <SelectItem value="newest" className="hover:bg-blue-50">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Latest Ideas
                        </div>
                      </SelectItem>
                      <SelectItem value="popular" className="hover:bg-blue-50">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          Most Viewed
                        </div>
                      </SelectItem>
                      <SelectItem value="interests" className="hover:bg-blue-50">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Trending
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Header */}
          <div className="mb-8 flex justify-between items-center animate-fade-in animation-delay-1000">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {filteredIdeas.length === 0 ? 'No results found' : 
                 `${filteredIdeas.length} breakthrough idea${filteredIdeas.length !== 1 ? 's' : ''} discovered`}
              </h2>
              {searchQuery && (
                <p className="text-slate-600">
                  Searching for "{searchQuery}" in {selectedCategory === 'all' ? 'all industries' : selectedCategory}
                </p>
              )}
            </div>
          </div>

          {/* Ideas Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-0 shadow-lg animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-slate-200 rounded mb-4"></div>
                    <div className="h-6 bg-slate-200 rounded mb-4"></div>
                    <div className="h-20 bg-slate-200 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 w-16 bg-slate-200 rounded"></div>
                      <div className="h-8 w-16 bg-slate-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredIdeas.map((idea, index) => (
                <div 
                  key={idea.id} 
                  className="space-y-6 animate-fade-in group"
                  style={{ animationDelay: `${1200 + index * 100}ms` }}
                >
                  <div className="transform transition-all duration-500 hover:scale-105">
                    <IdeaCard idea={idea} onAccessGranted={() => fetchIdeas()} />
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <CommentSystem ideaId={idea.id} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredIdeas.length === 0 && !loading && (
            <div className="text-center py-20 animate-fade-in">
              <div className="bg-gradient-to-br from-slate-100 to-blue-100 rounded-full p-8 w-fit mx-auto mb-8 shadow-xl">
                <Search className="h-12 w-12 text-slate-500" />
              </div>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">No breakthrough ideas found</h3>
              <p className="text-xl text-slate-600 mb-8 max-w-md mx-auto">
                Try adjusting your search criteria or explore different industries to discover innovative concepts.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {categories.slice(1, 6).map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setSearchQuery('');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Explore {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
