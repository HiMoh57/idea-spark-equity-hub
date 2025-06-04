
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilters {
  query: string;
  category: string;
  tags: string[];
  minViews: number;
  minInterests: number;
  equityRange: [number, number];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onReset: () => void;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onFiltersChange, onReset }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    tags: [],
    minViews: 0,
    minInterests: 0,
    equityRange: [1, 20],
    sortBy: 'created_at',
    sortOrder: 'desc'
  });

  const [newTag, setNewTag] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const categories = [
    'HealthTech', 'EdTech', 'FinTech', 'Sustainability', 
    'AgriTech', 'Enterprise', 'Consumer', 'AI', 'Other'
  ];

  const sortOptions = [
    { value: 'created_at', label: 'Date Created' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'interests', label: 'Most Interested' },
    { value: 'title', label: 'Title' }
  ];

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const addTag = () => {
    if (newTag.trim() && !filters.tags.includes(newTag.trim())) {
      updateFilters({ tags: [...filters.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFilters({ tags: filters.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleReset = () => {
    const resetFilters: SearchFilters = {
      query: '',
      category: '',
      tags: [],
      minViews: 0,
      minInterests: 0,
      equityRange: [1, 20],
      sortBy: 'created_at',
      sortOrder: 'desc'
    };
    setFilters(resetFilters);
    setNewTag('');
    onReset();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Ideas
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4 mr-1" />
              {showAdvanced ? 'Simple' : 'Advanced'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div>
          <Label htmlFor="search">Search Ideas</Label>
          <Input
            id="search"
            placeholder="Search by title, description, or tags..."
            value={filters.query}
            onChange={(e) => updateFilters({ query: e.target.value })}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Category Filter */}
          <div>
            <Label>Category</Label>
            <Select value={filters.category} onValueChange={(value) => updateFilters({ category: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Options */}
          <div>
            <Label>Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilters({ sortBy: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Order */}
          <div>
            <Label>Order</Label>
            <Select value={filters.sortOrder} onValueChange={(value: 'asc' | 'desc') => updateFilters({ sortOrder: value })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            {/* Tags Filter */}
            <div>
              <Label>Filter by Tags</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  placeholder="Add a tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-600" 
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Minimum Views */}
              <div>
                <Label>Minimum Views: {filters.minViews}</Label>
                <Slider
                  value={[filters.minViews]}
                  onValueChange={(value) => updateFilters({ minViews: value[0] })}
                  max={1000}
                  step={10}
                  className="mt-2"
                />
              </div>

              {/* Minimum Interests */}
              <div>
                <Label>Minimum Interests: {filters.minInterests}</Label>
                <Slider
                  value={[filters.minInterests]}
                  onValueChange={(value) => updateFilters({ minInterests: value[0] })}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>

            {/* Equity Range */}
            <div>
              <Label>Equity Range: {filters.equityRange[0]}% - {filters.equityRange[1]}%</Label>
              <Slider
                value={filters.equityRange}
                onValueChange={(value) => updateFilters({ equityRange: value as [number, number] })}
                max={50}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedSearch;
