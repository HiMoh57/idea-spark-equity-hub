
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.9';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface IncompleteSubmission {
  email: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get incomplete submissions older than 30 minutes but less than 24 hours
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    const { data: incompleteSubmissions, error } = await supabase
      .from('incomplete_submissions')
      .select('*')
      .lt('created_at', thirtyMinutesAgo)
      .gt('created_at', twentyFourHoursAgo)
      .eq('reminder_sent', false);

    if (error) throw error;

    console.log(`Found ${incompleteSubmissions?.length || 0} incomplete submissions to remind`);

    for (const submission of incompleteSubmissions || []) {
      try {
        const emailResponse = await resend.emails.send({
          from: "IdeaVault <noreply@yourdomain.com>",
          to: [submission.email],
          subject: "You were halfway to sharing your genius with the world 💡",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #1e293b; text-align: center;">Don't let your idea slip away!</h1>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Hey there,
              </p>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                You were halfway to sharing your genius with the world. We noticed you started submitting "${submission.title}" but didn't finish.
              </p>
              
              <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #334155; margin: 0 0 10px 0;">Your draft idea:</h3>
                <p style="color: #64748b; margin: 0;"><strong>Title:</strong> ${submission.title}</p>
                <p style="color: #64748b; margin: 5px 0 0 0;"><strong>Category:</strong> ${submission.category}</p>
              </div>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Complete your submission now and join thousands of entrepreneurs sharing their breakthrough ideas!
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${supabaseUrl.replace('supabase.co', 'lovable.app')}/submit-idea" 
                   style="background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Complete Your Submission
                </a>
              </div>
              
              <p style="color: #94a3b8; font-size: 14px; text-align: center;">
                This is a one-time reminder. We won't email you again about this draft.
              </p>
            </div>
          `,
        });

        if (emailResponse.error) {
          console.error('Error sending email:', emailResponse.error);
        } else {
          // Mark reminder as sent
          await supabase
            .from('incomplete_submissions')
            .update({ reminder_sent: true })
            .eq('id', submission.id);
          
          console.log(`Reminder sent to ${submission.email}`);
        }
      } catch (emailError) {
        console.error('Error processing submission:', emailError);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: incompleteSubmissions?.length || 0 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-incomplete-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
