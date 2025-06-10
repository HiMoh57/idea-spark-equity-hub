import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, ArrowRight, Users, TrendingUp, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  status: string;
  applicants: number;
}

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const categories = [
    "All",
    "FinTech",
    "E-commerce",
    "HealthTech",
    "EdTech",
    "AI/ML",
    "SaaS",
    "Other"
  ];

  useEffect(() => {
    fetchIdeas();
  }, [selectedSort]);

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
          equity_percentage,
          status,
          applicants
        `)
        .eq('status', 'approved');

      // Apply sorting
      if (selectedSort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (selectedSort === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (selectedSort === 'popular') {
        query = query.order('views', { ascending: false });
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
      
      <main className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Explore Startup Ideas</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Discover innovative ideas and find the perfect opportunity to build something amazing
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category.toLowerCase()}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ideas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIdeas.map((idea) => (
              <Card key={idea.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="mb-2">
                      {idea.category}
                    </Badge>
                    <Badge variant={idea.status === "Open" ? "default" : "secondary"}>
                      {idea.status}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{idea.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 mb-4">{idea.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {idea.applicants} applicants
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {idea.created_at}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-blue-600">
                    {idea.equity_percentage}% Equity
                  </div>
                  <Button asChild variant="outline">
                    <Link to={`/idea/${idea.id}`}>
                      View Details
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8">
              Load More Ideas
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Explore;
