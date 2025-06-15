
import React, { useEffect, useState } from 'react';
import { Users, Lightbulb, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AppStats {
  total_users: number;
  ideas_submitted_today: number;
  active_countries: number;
}

const LiveStatsBanner = () => {
  const [stats, setStats] = useState<AppStats>({
    total_users: 165,
    ideas_submitted_today: 5,
    active_countries: 3
  });

  useEffect(() => {
    fetchStats();
    // Update stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      // Update stats first
      await supabase.rpc('update_app_stats');
      
      // Then fetch the latest stats
      const { data, error } = await supabase
        .from('app_stats')
        .select('*')
        .single();

      if (error) throw error;
      if (data) setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-8 text-sm font-medium">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{stats.total_users}+ users joined</span>
          </div>
          
          <div className="hidden sm:block w-px h-4 bg-white/30"></div>
          
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span>{stats.ideas_submitted_today} ideas submitted today</span>
          </div>
          
          <div className="hidden sm:block w-px h-4 bg-white/30"></div>
          
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4" />
            <span>{stats.active_countries} countries live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStatsBanner;
