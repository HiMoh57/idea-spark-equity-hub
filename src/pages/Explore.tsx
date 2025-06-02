
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Eye, Heart, Clock, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import IdeaCard from '@/components/IdeaCard';

const Explore = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data for demonstration
  const ideas = [
    {
      id: '1',
      title: 'EcoDelivery',
      teaser: 'Carbon-neutral delivery service using electric bikes and optimized routing',
      category: 'Sustainability',
      tags: ['GreenTech', 'Logistics', 'B2B'],
      views: 234,
      interests: 12,
      createdAt: '2024-01-15',
      creator: 'Sarah Chen'
    },
    {
      id: '2', 
      title: 'MindfulAI',
      teaser: 'AI-powered mental health companion for personalized therapy sessions',
      category: 'HealthTech',
      tags: ['AI', 'Mental Health', 'B2C'],
      views: 567,
      interests: 28,
      createdAt: '2024-01-20',
      creator: 'Dr. Michael Torres'
    },
    {
      id: '3',
      title: 'CodeMentor',
      teaser: 'Real-time code review platform connecting junior developers with seniors',
      category: 'EdTech',
      tags: ['Developer Tools', 'Education', 'SaaS'],
      views: 189,
      interests: 8,
      createdAt: '2024-01-18',
      creator: 'Alex Kim'
    },
    {
      id: '4',
      title: 'FarmConnect',
      teaser: 'Direct farm-to-consumer marketplace with blockchain supply tracking',
      category: 'AgriTech',
      tags: ['Blockchain', 'Marketplace', 'Food'],
      views: 345,
      interests: 19,
      createdAt: '2024-01-22',
      creator: 'Maria Rodriguez'
    },
    {
      id: '5',
      title: 'VirtualOffice',
      teaser: 'Immersive VR workspace for remote teams with spatial audio',
      category: 'Enterprise',
      tags: ['VR', 'Remote Work', 'B2B'],
      views: 423,
      interests: 31,
      createdAt: '2024-01-25',
      creator: 'James Wilson'
    },
    {
      id: '6',
      title: 'PetCare+',
      teaser: 'Smart pet monitoring system with health tracking and vet consultations',
      category: 'PetTech',
      tags: ['IoT', 'Healthcare', 'Consumer'],
      views: 156,
      interests: 6,
      createdAt: '2024-01-12',
      creator: 'Emily Zhang'
    }
  ];

  const categories = ['all', 'HealthTech', 'EdTech', 'Sustainability', 'AgriTech', 'Enterprise', 'PetTech'];

  const filteredIdeas = ideas.filter(idea => {
    const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.teaser.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         idea.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || idea.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            {filteredIdeas.map(idea => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
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
