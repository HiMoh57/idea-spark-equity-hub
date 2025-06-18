import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  problem_statement: z.string().min(10, 'Problem statement must be at least 10 characters'),
  solution: z.string().min(10, 'Solution must be at least 10 characters'),
  business_model: z.string().min(10, 'Business model must be at least 10 characters'),
  target_market: z.string().min(10, 'Target market must be at least 10 characters'),
  competitor_summary: z.string().min(10, 'Competitor summary must be at least 10 characters'),
  traction: z.string().min(10, 'Traction must be at least 10 characters'),
  team: z.string().min(10, 'Team must be at least 10 characters'),
  ask_and_use_of_funds: z.string().min(10, 'Investment ask must be at least 10 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface Idea {
  id: string;
  title: string;
  teaser: string;
  description?: string;
  problem_description?: string;
  category: string;
  tags: string[];
}

interface FundeerFormProps {
  idea: Idea | null;
  onSubmit: (data: FormData) => void;
  usageLimit: { current: number; limit: number };
  userType?: string | null;
}

const FundeerForm: React.FC<FundeerFormProps> = ({ 
  idea, 
  onSubmit, 
  usageLimit, 
  userType 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    watch
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onChange'
  });

  const watchedValues = watch();

  useEffect(() => {
    if (idea) {
      setValue('title', idea.title);
      if (idea.problem_description) {
        setValue('problem_statement', idea.problem_description);
      }
    }
  }, [idea, setValue]);

  const handleFormSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = user && (userType === 'premium' || usageLimit.current < usageLimit.limit);

  return (
    <div className="space-y-6">
      {/* Usage Warning */}
      {user && !canSubmit && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <h3 className="font-semibold text-orange-800">Usage Limit Reached</h3>
                <p className="text-sm text-orange-700">
                  You've used {usageLimit.current}/{usageLimit.limit} pitch decks this month. 
                  Upgrade to premium for unlimited access.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Idea Info */}
      {idea && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-2">Based on Idea: {idea.title}</h3>
                <p className="text-sm text-blue-700 mb-3">{idea.teaser}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {idea.category}
                  </Badge>
                  {idea.tags?.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Pitch Deck Information
          </CardTitle>
          <p className="text-sm text-slate-600">
            Fill in the details below to generate your investor-ready pitch deck
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Idea Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter your idea title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Problem Statement */}
            <div className="space-y-2">
              <Label htmlFor="problem_statement">Problem Statement *</Label>
              <Textarea
                id="problem_statement"
                {...register('problem_statement')}
                placeholder="Describe the problem your idea solves..."
                rows={4}
                className={errors.problem_statement ? 'border-red-500' : ''}
              />
              {errors.problem_statement && (
                <p className="text-sm text-red-600">{errors.problem_statement.message}</p>
              )}
            </div>

            {/* Solution */}
            <div className="space-y-2">
              <Label htmlFor="solution">Solution *</Label>
              <Textarea
                id="solution"
                {...register('solution')}
                placeholder="Explain how your idea solves the problem..."
                rows={4}
                className={errors.solution ? 'border-red-500' : ''}
              />
              {errors.solution && (
                <p className="text-sm text-red-600">{errors.solution.message}</p>
              )}
            </div>

            {/* Business Model */}
            <div className="space-y-2">
              <Label htmlFor="business_model">Business Model *</Label>
              <Textarea
                id="business_model"
                {...register('business_model')}
                placeholder="Describe your revenue model and how you'll make money..."
                rows={4}
                className={errors.business_model ? 'border-red-500' : ''}
              />
              {errors.business_model && (
                <p className="text-sm text-red-600">{errors.business_model.message}</p>
              )}
            </div>

            {/* Target Market */}
            <div className="space-y-2">
              <Label htmlFor="target_market">Target Market *</Label>
              <Textarea
                id="target_market"
                {...register('target_market')}
                placeholder="Define your target customers and market size..."
                rows={4}
                className={errors.target_market ? 'border-red-500' : ''}
              />
              {errors.target_market && (
                <p className="text-sm text-red-600">{errors.target_market.message}</p>
              )}
            </div>

            {/* Competitor Summary */}
            <div className="space-y-2">
              <Label htmlFor="competitor_summary">Competitive Landscape *</Label>
              <Textarea
                id="competitor_summary"
                {...register('competitor_summary')}
                placeholder="Describe your competitors and your competitive advantages..."
                rows={4}
                className={errors.competitor_summary ? 'border-red-500' : ''}
              />
              {errors.competitor_summary && (
                <p className="text-sm text-red-600">{errors.competitor_summary.message}</p>
              )}
            </div>

            {/* Traction */}
            <div className="space-y-2">
              <Label htmlFor="traction">Traction & Milestones *</Label>
              <Textarea
                id="traction"
                {...register('traction')}
                placeholder="Share your progress, achievements, and key milestones..."
                rows={4}
                className={errors.traction ? 'border-red-500' : ''}
              />
              {errors.traction && (
                <p className="text-sm text-red-600">{errors.traction.message}</p>
              )}
            </div>

            {/* Team */}
            <div className="space-y-2">
              <Label htmlFor="team">Team *</Label>
              <Textarea
                id="team"
                {...register('team')}
                placeholder="Introduce your team members and their relevant experience..."
                rows={4}
                className={errors.team ? 'border-red-500' : ''}
              />
              {errors.team && (
                <p className="text-sm text-red-600">{errors.team.message}</p>
              )}
            </div>

            {/* Investment Ask */}
            <div className="space-y-2">
              <Label htmlFor="ask_and_use_of_funds">Investment Ask & Use of Funds *</Label>
              <Textarea
                id="ask_and_use_of_funds"
                {...register('ask_and_use_of_funds')}
                placeholder="Specify how much funding you're seeking and how you'll use it..."
                rows={4}
                className={errors.ask_and_use_of_funds ? 'border-red-500' : ''}
              />
              {errors.ask_and_use_of_funds && (
                <p className="text-sm text-red-600">{errors.ask_and_use_of_funds.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                {isValid ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>All fields completed</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <span>Please complete all required fields</span>
                  </>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={!isValid || isSubmitting || !canSubmit}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {isSubmitting ? 'Generating...' : 'Generate Pitch Deck'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default FundeerForm; 