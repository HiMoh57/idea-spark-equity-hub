
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Send, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  user_id: string;
  profiles?: {
    full_name: string;
  };
}

interface CommentSystemProps {
  ideaId: string;
}

const CommentSystem: React.FC<CommentSystemProps> = ({ ideaId }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [ideaId, showComments]);

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('idea_comments')
        .select(`
          id,
          comment,
          created_at,
          user_id,
          profiles(full_name)
        `)
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading comments",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('idea_comments')
        .insert({
          idea_id: ideaId,
          user_id: user.id,
          comment: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      toast({ title: "Comment posted successfully!" });
      fetchComments();
    } catch (error: any) {
      toast({
        title: "Error posting comment",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="outline"
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        {showComments ? 'Hide Comments' : `View Comments (${comments.length})`}
      </Button>

      {showComments && (
        <div className="space-y-4">
          {user && (
            <Card>
              <CardContent className="p-4">
                <form onSubmit={handleSubmitComment} className="space-y-3">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts on this idea..."
                    className="min-h-20"
                  />
                  <Button type="submit" disabled={loading || !newComment.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    {loading ? "Posting..." : "Post Comment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-center text-slate-500 py-4">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-slate-100 p-2 rounded-full">
                        <User className="h-4 w-4 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">
                            {comment.profiles?.full_name || 'Anonymous'}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm">{comment.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSystem;
