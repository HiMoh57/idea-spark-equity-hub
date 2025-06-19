import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';

const Chat = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const ideaId = searchParams.get('ideaId');
  const otherUserId = searchParams.get('userId');
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [accessAllowed, setAccessAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [idea, setIdea] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user || !ideaId || !otherUserId) return;
    checkAccess();
    fetchIdea();
    // eslint-disable-next-line
  }, [user, ideaId, otherUserId]);

  useEffect(() => {
    if (accessAllowed) {
      fetchMessages();
      const channel = supabase
        .channel('realtime:messages')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, (payload) => {
          if (
            payload.new &&
            ((payload.new.sender_id === user.id && payload.new.receiver_id === otherUserId) ||
              (payload.new.sender_id === otherUserId && payload.new.receiver_id === user.id)) &&
            payload.new.idea_id === ideaId
          ) {
            setMessages((prev) => [...prev, payload.new]);
          }
        })
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
    }
    // eslint-disable-next-line
  }, [accessAllowed, user, ideaId, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkAccess = async () => {
    setLoading(true);
    // Only allow if access_requests.status === 'approved' and user is creator or requester
    const { data, error } = await supabase
      .from('access_requests')
      .select('*')
      .eq('idea_id', ideaId)
      .eq('status', 'approved')
      .or(`requester_id.eq.${user.id},creator_id.eq.${user.id}`)
      .single();
    if (data && (data.requester_id === user.id || data.creator_id === user.id)) {
      setAccessAllowed(true);
    } else {
      setAccessAllowed(false);
    }
    setLoading(false);
  };

  const fetchIdea = async () => {
    const { data } = await supabase
      .from('ideas')
      .select('title')
      .eq('id', ideaId)
      .single();
    setIdea(data);
  };

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('idea_id', ideaId)
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: true });
    setMessages(data || []);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    await supabase.from('messages').insert({
      idea_id: ideaId,
      sender_id: user.id,
      receiver_id: otherUserId,
      content: message,
      created_at: new Date().toISOString(),
    });
    setMessage('');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  if (!accessAllowed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-slate-600 mb-4">You do not have permission to view this chat.</p>
            <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />
      <div className="max-w-2xl mx-auto pt-24 pb-8 px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Chat about: {idea?.title || 'Idea'}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="h-[60vh] flex flex-col">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={msg.id || idx}
                className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-xs break-words shadow text-sm ${
                    msg.sender_id === user.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-900'
                  }`}
                >
                  {msg.content}
                  <div className="text-xs text-right mt-1 opacity-60">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>
          <form onSubmit={sendMessage} className="flex items-center gap-2 p-4 border-t">
            <Input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" disabled={!message.trim()}>Send</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Chat; 