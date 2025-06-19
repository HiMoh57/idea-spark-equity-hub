import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Heart, DollarSign, MessageSquare, Bell, Edit, Trash2, User, Lightbulb, TrendingUp, Clock, Star, CheckCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import PurchasedIdeas from '@/components/PurchasedIdeas';
import SavedIdeas from '@/components/SavedIdeas';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userIdeas, setUserIdeas] = useState([]);
  const [accessRequests, setAccessRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [purchasedIdeasCount, setPurchasedIdeasCount] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    } else if (user) {
      fetchDashboardData();
    }
  }, [user, authLoading, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user profile to determine role
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setUserProfile(profileData);

      // Fetch user's ideas (for creators)
      if (profileData?.user_type === 'creator' || !profileData?.user_type) {
        const { data: ideasData } = await supabase
          .from('ideas')
          .select('*')
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch access requests for user's ideas
        const { data: requestsData } = await supabase
          .from('access_requests')
          .select(`
            *,
            ideas!inner(title, creator_id),
            payment_verifications(*)
          `)
          .eq('ideas.creator_id', user.id);

        // Fetch proposals for user's ideas
        const { data: proposalsData } = await supabase
          .from('proposals')
          .select(`
            *,
            ideas!inner(title, creator_id),
            profiles!proposals_executor_id_fkey(full_name)
          `)
          .eq('ideas.creator_id', user.id)
          .order('created_at', { ascending: false });

        setUserIdeas(ideasData || []);
        setAccessRequests(requestsData || []);
        setProposals(proposalsData || []);
      } else {
        // For executors, get count of purchased ideas (FIX: don't check status = 'approved', just verified payment)
        const { data: purchasedData, error: purchasedError } = await supabase
          .from('access_requests')
          .select(`
            id,
            payment_verifications!inner(verification_status)
          `)
          .eq('requester_id', user.id)
          .eq('payment_verifications.verification_status', 'verified');

        // If query fails, report error
        if (purchasedError) {
          toast({
            title: "Error loading purchased ideas count",
            description: purchasedError.message,
            variant: "destructive"
          });
          setPurchasedIdeasCount(0);
        } else {
          setPurchasedIdeasCount(purchasedData?.length || 0);
        }
      }

      // Fetch notifications
      const { data: notificationsData } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setNotifications(notificationsData || []);
    } catch (error: any) {
      toast({
        title: "Error loading dashboard",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId);
      
      fetchDashboardData();
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteIdea = async (ideaId: string) => {
    if (!confirm('Are you sure you want to delete this idea?')) return;

    try {
      const { error } = await supabase
        .from('ideas')
        .delete()
        .eq('id', ideaId);

      if (error) throw error;

      toast({ title: "Idea deleted successfully" });
      fetchDashboardData();
    } catch (error: any) {
      toast({
        title: "Error deleting idea",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Lightbulb className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isCreator = userProfile?.user_type === 'creator' || !userProfile?.user_type;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-12">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-1 shadow-2xl">
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                        {isCreator ? (
                          <Lightbulb className="h-10 w-10 text-white" />
                        ) : (
                          <User className="h-10 w-10 text-white" />
                        )}
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full shadow-sm" />
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                        Welcome back, {userProfile?.full_name || 'User'}!
                      </h1>
                      <p className="text-lg text-slate-600 mb-3">
                        {isCreator 
                          ? 'Manage your ideas and track their performance' 
                          : 'Discover opportunities and manage your investments'}
                      </p>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                          {isCreator ? 'Creator' : 'Executor'}
                        </Badge>
                        <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                          Online
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <Button 
                      onClick={() => navigate(isCreator ? '/submit-idea' : '/explore')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isCreator ? 'Submit New Idea' : 'Explore Ideas'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          {isCreator ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Ideas</p>
                      <p className="text-white text-3xl font-bold">{userIdeas.length}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Lightbulb className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Access Requests</p>
                      <p className="text-white text-3xl font-bold">{accessRequests.length}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Proposals</p>
                      <p className="text-white text-3xl font-bold">{proposals.length}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Notifications</p>
                      <p className="text-white text-3xl font-bold">{notifications.filter(n => !n.read_at).length}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Bell className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Purchased Ideas</p>
                      <p className="text-white text-3xl font-bold">{purchasedIdeasCount}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Saved Ideas</p>
                      <p className="text-white text-3xl font-bold">0</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Heart className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Notifications</p>
                      <p className="text-white text-3xl font-bold">{notifications.filter(n => !n.read_at).length}</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Bell className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Main Content */}
          {isCreator ? (
            <Tabs defaultValue="ideas" className="space-y-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/20">
                <TabsList className="grid w-full grid-cols-4 bg-transparent gap-2">
                  <TabsTrigger 
                    value="ideas" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-medium"
                  >
                    My Ideas ({userIdeas.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="requests"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-medium"
                  >
                    Requests ({accessRequests.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="proposals"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-medium"
                  >
                    Proposals ({proposals.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-medium"
                  >
                    Notifications ({notifications.filter(n => !n.read_at).length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="ideas" className="space-y-6">
                {userIdeas.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl">
                    <CardContent className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lightbulb className="h-12 w-12 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">No ideas yet</h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">You haven't submitted any ideas yet. Start sharing your innovative concepts with the world!</p>
                      <Button 
                        onClick={() => navigate('/submit-idea')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Submit Your First Idea
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {userIdeas.map((idea: any) => (
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
                            <div className="flex items-center gap-2 ml-6">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => navigate(`/edit-idea/${idea.id}`)}
                                className="hover:bg-blue-100 hover:text-blue-600 rounded-xl transition-colors"
                              >
                                <Edit className="h-5 w-5" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => deleteIdea(idea.id)}
                                className="hover:bg-red-100 hover:text-red-600 rounded-xl transition-colors"
                              >
                                <Trash2 className="h-5 w-5" />
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
              </TabsContent>

              <TabsContent value="requests" className="space-y-6">
                {accessRequests.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl">
                    <CardContent className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="h-12 w-12 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">No access requests yet</h3>
                      <p className="text-slate-600 mb-6 max-w-md mx-auto">You haven't received any access requests for your ideas yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {accessRequests.map((req: any) => (
                      <Card key={req.id} className="bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                        <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                            <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-bold text-slate-900">{req.ideas?.title || 'Idea'}</h4>
                              <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-blue-200">
                                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="text-slate-600 text-sm mb-2">Requested by: <span className="font-medium">{req.requester_id}</span></div>
                            <div className="text-xs text-slate-500">Requested on: {new Date(req.created_at).toLocaleString()}</div>
                          </div>
                          <div className="flex gap-2">
                            {req.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 text-white hover:bg-green-700"
                                  onClick={async () => {
                                    await supabase
                                      .from('access_requests')
                                      .update({ status: 'approved' })
                                      .eq('id', req.id);
                                    toast({ title: 'Request approved!' });
                                    fetchDashboardData();
                                  }}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-red-600 text-white hover:bg-red-700"
                                  onClick={async () => {
                                    await supabase
                                      .from('access_requests')
                                      .update({ status: 'denied' })
                                      .eq('id', req.id);
                                    toast({ title: 'Request denied.' });
                                    fetchDashboardData();
                                  }}
                                >
                                  Deny
                                </Button>
                              </>
                            )}
                            {req.status === 'approved' && (
                              <>
                                <span className="text-green-700 font-semibold">Approved</span>
                            <Button 
                                  size="sm"
                              variant="outline" 
                                  className="ml-2"
                                  onClick={() => navigate(`/chat?ideaId=${req.idea_id}&userId=${req.requester_id}`)}
                            >
                                  Open Chat
                            </Button>
                              </>
                            )}
                            {req.status === 'denied' && (
                              <span className="text-red-700 font-semibold">Denied</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="proposals" className="space-y-6">
                {proposals.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl">
                    <CardContent className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <TrendingUp className="h-12 w-12 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">No proposals yet</h3>
                      <p className="text-slate-600">When executors submit proposals for your ideas, they'll appear here.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {proposals.map((proposal: any) => (
                      <Card key={proposal.id} className="bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-8">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold text-slate-900 mb-2">{proposal.ideas.title}</h3>
                              <p className="text-slate-600">Proposed by: {proposal.profiles.full_name}</p>
                            </div>
                            <Button 
                              variant="outline" 
                              onClick={() => navigate(`/view-proposal/${proposal.id}`)}
                              className="border-green-200 text-green-600 hover:bg-green-50"
                            >
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                {notifications.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl">
                    <CardContent className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bell className="h-12 w-12 text-orange-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">No notifications</h3>
                      <p className="text-slate-600">You're all caught up! Notifications will appear here when you have updates.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {notifications.map((notification: any) => (
                      <Card key={notification.id} className="bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-8">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-semibold text-slate-900">{notification.title}</h3>
                                {!notification.read_at && (
                                  <Badge className="bg-blue-500 text-white">New</Badge>
                                )}
                              </div>
                              <p className="text-slate-600">{notification.message}</p>
                            </div>
                            {!notification.read_at && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => markNotificationAsRead(notification.id)}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <Tabs defaultValue="purchased" className="space-y-8">
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/20">
                <TabsList className="grid w-full grid-cols-3 bg-transparent gap-2">
                  <TabsTrigger 
                    value="purchased" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-medium"
                  >
                    Purchased Ideas ({purchasedIdeasCount})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="saved"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-medium"
                  >
                    Saved Ideas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white rounded-xl font-medium"
                  >
                    Notifications ({notifications.filter(n => !n.read_at).length})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="purchased">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
                  <PurchasedIdeas />
                </div>
              </TabsContent>

              <TabsContent value="saved">
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/20">
                  <SavedIdeas />
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                {notifications.length === 0 ? (
                  <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-xl">
                    <CardContent className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Bell className="h-12 w-12 text-orange-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">No notifications</h3>
                      <p className="text-slate-600">You're all caught up! Notifications will appear here when you have updates.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6">
                    {notifications.map((notification: any) => (
                      <Card key={notification.id} className="bg-white/80 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                        <CardContent className="p-8">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-semibold text-slate-900">{notification.title}</h3>
                                {!notification.read_at && (
                                  <Badge className="bg-blue-500 text-white">New</Badge>
                                )}
                              </div>
                              <p className="text-slate-600">{notification.message}</p>
                            </div>
                            {!notification.read_at && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => markNotificationAsRead(notification.id)}
                                className="border-blue-200 text-blue-600 hover:bg-blue-50"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Mark as Read
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
