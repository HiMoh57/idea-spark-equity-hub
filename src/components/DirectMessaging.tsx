
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Mail, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DirectMessagingProps {
  isOpen: boolean;
  onClose: () => void;
  recipientId: string;
  ideaId?: string;
  ideaTitle?: string;
}

interface Message {
  id: string;
  content: string;
  subject: string;
  created_at: string;
  sender_id: string;
  read_at: string | null;
  profiles?: {
    full_name: string;
  } | null;
}

const DirectMessaging: React.FC<DirectMessagingProps> = ({
  isOpen,
  onClose,
  recipientId,
  ideaId,
  ideaTitle
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState({
    subject: ideaTitle ? `Regarding: ${ideaTitle}` : '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [recipientName, setRecipientName] = useState('');

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();
      fetchRecipientName();
    }
  }, [isOpen, user, recipientId]);

  const fetchRecipientName = async () => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', recipientId)
        .single();

      setRecipientName(data?.full_name || 'User');
    } catch (error) {
      console.error('Error fetching recipient name:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          subject,
          created_at,
          sender_id,
          read_at
        `)
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user?.id})`)
        .eq('idea_id', ideaId || null)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Fetch profile names separately
      const messagesWithProfiles = await Promise.all(
        (data || []).map(async (message) => {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', message.sender_id)
            .single();

          return {
            ...message,
            profiles: profileData
          };
        })
      );

      setMessages(messagesWithProfiles);

      // Mark received messages as read
      const unreadMessages = data?.filter(msg => 
        msg.sender_id === recipientId && !msg.read_at
      ).map(msg => msg.id);

      if (unreadMessages && unreadMessages.length > 0) {
        await supabase
          .from('messages')
          .update({ read_at: new Date().toISOString() })
          .in('id', unreadMessages);
      }
    } catch (error: any) {
      toast({
        title: "Error loading messages",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.content.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: recipientId,
          subject: newMessage.subject || 'Message',
          content: newMessage.content.trim(),
          idea_id: ideaId || null
        });

      if (error) throw error;

      // Create notification for recipient
      await supabase.rpc('create_notification', {
        user_uuid: recipientId,
        notification_type: 'message',
        notification_title: 'New Message',
        notification_message: `You have a new message from ${user.user_metadata?.full_name || 'a user'}`,
        related_uuid: ideaId || null
      });

      setNewMessage({ subject: ideaTitle ? `Regarding: ${ideaTitle}` : '', content: '' });
      toast({ title: "Message sent successfully!" });
      fetchMessages();
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Message with {recipientName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-96">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4 border rounded-lg p-4 bg-slate-50">
            {messages.length === 0 ? (
              <p className="text-center text-slate-500">Start a conversation!</p>
            ) : (
              messages.map((message) => (
                <Card key={message.id} className={`${
                  message.sender_id === user?.id ? 'ml-auto bg-blue-50' : 'mr-auto bg-white'
                } max-w-xs`}>
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-3 w-3" />
                      <span className="text-xs font-medium">
                        {message.sender_id === user?.id ? 'You' : message.profiles?.full_name || 'User'}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                    {message.subject !== 'Message' && (
                      <p className="text-xs font-medium text-slate-600 mb-1">{message.subject}</p>
                    )}
                    <p className="text-sm">{message.content}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Send Message Form */}
          <form onSubmit={handleSendMessage} className="space-y-3">
            {!ideaTitle && (
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage({...newMessage, subject: e.target.value})}
                  placeholder="Message subject"
                />
              </div>
            )}
            <div>
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                placeholder="Type your message..."
                className="min-h-20"
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Close
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                {loading ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DirectMessaging;
