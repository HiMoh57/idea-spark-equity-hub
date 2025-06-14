
import React, { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const RealtimeNotifications: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription for notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          const notification = payload.new;
          
          // Show toast notification
          toast({
            title: notification.title,
            description: notification.message,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_idea_interests'
        },
        async (payload) => {
          console.log('New interest:', payload);
          // Check if this is for the current user's idea
          const { data: ideaData } = await supabase
            .from('ideas')
            .select('creator_id, title')
            .eq('id', payload.new.idea_id)
            .single();

          if (ideaData?.creator_id === user.id) {
            toast({
              title: "New Interest!",
              description: `Someone showed interest in your idea: ${ideaData.title}`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'access_requests'
        },
        async (payload) => {
          console.log('New access request:', payload);
          // Check if this is for the current user's idea
          const { data: ideaData } = await supabase
            .from('ideas')
            .select('creator_id, title')
            .eq('id', payload.new.idea_id)
            .single();

          if (ideaData?.creator_id === user.id) {
            toast({
              title: "Payment Received!",
              description: `Someone paid to access your idea: ${ideaData.title}`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'access_requests',
          filter: `payment_status=eq.completed`
        },
        async (payload) => {
          console.log('Payment completed:', payload);
          // Notify the executor that their payment was verified and access is granted
          if (payload.new.requester_id === user.id) {
            const { data: ideaData } = await supabase
              .from('ideas')
              .select('title')
              .eq('id', payload.new.idea_id)
              .single();

            toast({
              title: "Access Granted!",
              description: `Your payment was verified for: ${ideaData?.title}`,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'proposals'
        },
        async (payload) => {
          console.log('New proposal:', payload);
          // Check if this is for the current user's idea
          const { data: ideaData } = await supabase
            .from('ideas')
            .select('creator_id, title')
            .eq('id', payload.new.idea_id)
            .single();

          if (ideaData?.creator_id === user.id) {
            toast({
              title: "New Proposal!",
              description: `Someone submitted a proposal for: ${ideaData.title}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  return null; // This component doesn't render anything
};

export default RealtimeNotifications;
