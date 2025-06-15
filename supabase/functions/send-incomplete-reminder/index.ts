
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

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting incomplete submission reminder process...");
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get incomplete submissions older than 30 minutes but less than 24 hours
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    console.log(`Looking for submissions between ${twentyFourHoursAgo} and ${thirtyMinutesAgo}`);
    
    const { data: incompleteSubmissions, error } = await supabase
      .from('incomplete_submissions')
      .select('*')
      .lt('created_at', thirtyMinutesAgo)
      .gt('created_at', twentyFourHoursAgo)
      .eq('reminder_sent', false);

    if (error) {
      console.error('Database query error:', error);
      throw error;
    }

    console.log(`Found ${incompleteSubmissions?.length || 0} incomplete submissions to remind`);

    if (!incompleteSubmissions || incompleteSubmissions.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'No incomplete submissions found to remind',
          processed: 0 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    let successCount = 0;
    let errorCount = 0;

    for (const submission of incompleteSubmissions) {
      try {
        console.log(`Processing submission for email: ${submission.email}`);
        
        const emailResponse = await resend.emails.send({
          from: "IdeaVault <noreply@ideopark.vercel.app>",
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
                ${submission.category ? `<p style="color: #64748b; margin: 5px 0 0 0;"><strong>Category:</strong> ${submission.category}</p>` : ''}
                ${submission.teaser ? `<p style="color: #64748b; margin: 5px 0 0 0;"><strong>Teaser:</strong> ${submission.teaser}</p>` : ''}
              </div>
              
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Complete your submission now and join thousands of entrepreneurs sharing their breakthrough ideas!
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://ideopark.vercel.app/submit-idea" 
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
          console.error('Error sending email to', submission.email, ':', emailResponse.error);
          errorCount++;
        } else {
          console.log(`Email sent successfully to ${submission.email}`);
          
          // Mark reminder as sent
          const { error: updateError } = await supabase
            .from('incomplete_submissions')
            .update({ reminder_sent: true })
            .eq('id', submission.id);
          
          if (updateError) {
            console.error('Error updating reminder_sent flag:', updateError);
          } else {
            successCount++;
          }
        }
      } catch (emailError) {
        console.error('Error processing submission for', submission.email, ':', emailError);
        errorCount++;
      }
    }

    console.log(`Processed ${successCount} successful emails, ${errorCount} errors`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        processed: successCount,
        errors: errorCount,
        message: `Sent ${successCount} reminder emails successfully`
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-incomplete-reminder function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
