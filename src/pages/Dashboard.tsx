import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Heart, DollarSign, MessageSquare, Bell, Edit, Trash2, User, Lightbulb } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const isCreator = userProfile?.user_type === 'creator' || !userProfile?.user_type;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {isCreator ? 'Creator Dashboard' : 'Executor Dashboard'}
              </h1>
              <p className="text-slate-600">
                {isCreator 
                  ? 'Manage your ideas and track their performance' 
                  : 'Discover opportunities and manage your investments'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                {isCreator ? <Lightbulb className="h-5 w-5 text-blue-600" /> : <User className="h-5 w-5 text-purple-600" />}
                <span className="font-medium">{isCreator ? 'Creator' : 'Executor'}</span>
              </div>
            </div>
          </div>

          {isCreator ? (
            // Creator Dashboard
            <Tabs defaultValue="ideas" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="ideas">My Ideas ({userIdeas.length})</TabsTrigger>
                <TabsTrigger value="requests">Access Requests ({accessRequests.length})</TabsTrigger>
                <TabsTrigger value="proposals">Proposals ({proposals.length})</TabsTrigger>
                <TabsTrigger value="notifications">
                  Notifications ({notifications.filter(n => !n.read_at).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ideas" className="space-y-4">
                {userIdeas.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-slate-500 mb-4">You haven't submitted any ideas yet.</p>
                      <Button onClick={() => navigate('/submit-idea')}>
                        Submit Your First Idea
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  userIdeas.map((idea: any) => (
                    <Card key={idea.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-slate-900">{idea.title}</h3>
                            <p className="text-slate-600 mt-1">{idea.teaser}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{idea.category}</Badge>
                            <Button variant="ghost" size="icon" onClick={() => navigate(`/edit-idea/${idea.id}`)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => deleteIdea(idea.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{idea.views} views</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{idea.interests} interests</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{idea.equity_percentage}% equity</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="requests" className="space-y-4">
                {accessRequests.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-slate-500">No access requests yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  accessRequests.map((request: any) => (
                    <Card key={request.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-slate-900">{request.ideas.title}</h3>
                            <p className="text-slate-600 mt-1">Requested by: {request.executor_id}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/view-request/${request.id}`)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="proposals" className="space-y-4">
                {proposals.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-slate-500">No proposals yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  proposals.map((proposal: any) => (
                    <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-slate-900">{proposal.ideas.title}</h3>
                            <p className="text-slate-600 mt-1">Proposed by: {proposal.profiles.full_name}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/view-proposal/${proposal.id}`)}>
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                {notifications.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-slate-500">No notifications yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  notifications.map((notification: any) => (
                    <Card key={notification.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-slate-900">{notification.title}</h3>
                            <p className="text-slate-600 mt-1">{notification.message}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => markNotificationAsRead(notification.id)}>
                              Mark as Read
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          ) : (
            // Executor Dashboard
            <Tabs defaultValue="purchased" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="purchased">Purchased Ideas</TabsTrigger>
                <TabsTrigger value="saved">Saved Ideas</TabsTrigger>
                <TabsTrigger value="notifications">
                  Notifications ({notifications.filter(n => !n.read_at).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="purchased">
                <PurchasedIdeas />
              </TabsContent>

              <TabsContent value="saved">
                <SavedIdeas />
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                {notifications.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <p className="text-slate-500">No notifications yet.</p>
                    </CardContent>
                  </Card>
                ) : (
                  notifications.map((notification: any) => (
                    <Card key={notification.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-slate-900">{notification.title}</h3>
                            <p className="text-slate-600 mt-1">{notification.message}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => markNotificationAsRead(notification.id)}>
                              Mark as Read
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
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
