
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AppStats {
  total_users: number;
  ideas_submitted_today: number;
  active_countries: number;
}

const Stats = () => {
  const [stats, setStats] = useState<AppStats>({
    total_users: 165,
    ideas_submitted_today: 5,
    active_countries: 3
  });

  useEffect(() => {
    fetchStats();
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

  const statsDisplay = [
    { number: `${stats.total_users}+`, label: 'Active Users' },
    { number: `${stats.ideas_submitted_today}+`, label: 'Ideas Today' },
    { number: '50+', label: 'Partnerships Forming' },
    { number: '98%', label: 'Creator Satisfaction' },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statsDisplay.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {stat.number}
              </div>
              <div className="text-slate-600 text-sm md:text-base">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
