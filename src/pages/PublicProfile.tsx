
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Heart, DollarSign, Clock, User, Lightbulb, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    if (user && user.id === id) {
      // If viewing own profile, redirect to dashboard
      navigate('/dashboard');
      return;
    }
    fetchPublicProfile();
  }, [id, user, navigate]);

  const fetchPublicProfile = async () => {
    try {
      setLoading(true);

      // Fetch public profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, user_type, bio, created_at')
        .eq('id', id)
        .single();

      if (profileError) {
        toast({
          title: "Profile not found",
          description: "This user profile doesn't exist or is private.",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setProfile(profileData);

      // Fetch public ideas (only basic info, no detailed content)
      const { data: ideasData } = await supabase
        .from('ideas')
        .select('id, title, teaser, category, equity_percentage, views, interests, created_at')
        .eq('creator_id', id)
        .order('created_at', { ascending: false });

      setIdeas(ideasData || []);
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isCreator = profile?.user_type === 'creator' || !profile?.user_type;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          {/* Profile Header */}
          <div className="mb-12">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-1 shadow-2xl">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                      {isCreator ? (
                        <Lightbulb className="h-10 w-10 text-white" />
                      ) : (
                        <User className="h-10 w-10 text-white" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                      {profile.full_name || 'Anonymous User'}
                    </h1>
                    <p className="text-lg text-slate-600 mb-3">
                      {isCreator ? 'Idea Creator' : 'Business Executor'}
                    </p>
                    {profile.bio && (
                      <p className="text-slate-600 mb-3">{profile.bio}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                        {isCreator ? 'Creator' : 'Executor'}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
                        Joined {new Date(profile.created_at).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ideas Section */}
          {isCreator && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-4">
                  {profile.full_name?.split(' ')[0] || 'User'}'s Ideas
                </h2>
                <p className="text-slate-600 text-lg">
                  Discover innovative startup concepts and business opportunities
                </p>
              </div>

              {ideas.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl">
                  <CardContent className="text-center py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lightbulb className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">No public ideas yet</h3>
                    <p className="text-slate-600">This creator hasn't shared any ideas publicly yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {ideas.map((idea: any) => (
                    <Card key={idea.id} className="bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardContent className="p-8 relative">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <h3 className="text-2xl font-bold text-slate-900">{idea.title}</h3>
                              <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
                                {idea.category}
                              </Badge>
                            </div>
                            <p className="text-slate-600 text-lg leading-relaxed">{idea.teaser}</p>
                          </div>
                          <div className="ml-6">
                            <Button 
                              onClick={() => navigate('/auth')}
                              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              View Full Details
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Eye className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Views</p>
                              <p className="font-semibold text-slate-900">{idea.views || 0}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                              <Heart className="h-5 w-5 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Interests</p>
                              <p className="font-semibold text-slate-900">{idea.interests || 0}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <DollarSign className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Equity</p>
                              <p className="font-semibold text-slate-900">{idea.equity_percentage}%</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <Clock className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500">Created</p>
                              <p className="font-semibold text-slate-900">{new Date(idea.created_at).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Call to Action */}
              <div className="text-center bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Interested in these ideas?
                </h3>
                <p className="text-slate-600 mb-6">
                  Sign up to view full details, connect with creators, and discover more innovative concepts.
                </p>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started Today
                </Button>
              </div>
            </div>
          )}

          {/* For Executors */}
          {!isCreator && (
            <div className="text-center bg-white/80 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/20">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Business Executor Profile
              </h3>
              <p className="text-slate-600 mb-6">
                This user focuses on discovering and executing promising business ideas.
              </p>
              <Button 
                onClick={() => navigate('/explore')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Explore Ideas
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;
