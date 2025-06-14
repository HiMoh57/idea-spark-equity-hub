
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, PlusCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error fetching announcements",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setAnnouncements(data || []);
      }
      setLoading(false);
    };

    fetchAnnouncements();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />
      <main className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Announcements</h1>
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <Home className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {loading ? (
          <p>Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p>No announcements available yet.</p>
        ) : (
          <div className="grid gap-6">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-semibold text-gray-800">{announcement.title}</CardTitle>
                  <p className="text-sm text-gray-500">Posted on: {new Date(announcement.created_at).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AnnouncementsPage;
