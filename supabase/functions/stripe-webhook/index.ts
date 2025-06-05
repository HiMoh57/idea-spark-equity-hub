
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
});

const cryptoProvider = Stripe.createSubtleCryptoProvider();

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();
  
  if (!signature) {
    return new Response("No signature", { status: 400 });
  }

  try {
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || "",
      undefined,
      cryptoProvider
    );

    console.log(`🔔 Webhook received: ${event.type}`);

    // Create Supabase client with service role
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`💰 Payment succeeded for session: ${session.id}`);

        // Update access request status
        const { error: accessError } = await supabaseClient
          .from('access_requests')
          .update({
            status: 'approved',
            payment_status: 'completed'
          })
          .eq('stripe_session_id', session.id);

        if (accessError) {
          console.error('Error updating access request:', accessError);
        }

        // Update stripe payment record
        const { error: paymentError } = await supabaseClient
          .from('stripe_payments')
          .update({
            stripe_payment_intent_id: session.payment_intent,
            status: 'completed'
          })
          .eq('stripe_session_id', session.id);

        if (paymentError) {
          console.error('Error updating payment record:', paymentError);
        }

        // Get access request details for notification
        const { data: accessRequest } = await supabaseClient
          .from('access_requests')
          .select(`
            requester_id,
            idea_id,
            ideas (
              title,
              creator_id
            )
          `)
          .eq('stripe_session_id', session.id)
          .single();

        if (accessRequest) {
          // Create notification for user
          await supabaseClient.rpc('create_notification', {
            user_uuid: accessRequest.requester_id,
            notification_type: 'payment_success',
            notification_title: 'Payment Successful',
            notification_message: `You now have access to the full description of "${accessRequest.ideas.title}"`,
            related_uuid: accessRequest.idea_id
          });

          // Create notification for idea creator
          await supabaseClient.rpc('create_notification', {
            user_uuid: accessRequest.ideas.creator_id,
            notification_type: 'idea_purchased',
            notification_title: 'Idea Access Purchased',
            notification_message: `Someone purchased access to your idea "${accessRequest.ideas.title}"`,
            related_uuid: accessRequest.idea_id
          });
        }

        break;
      }

      case 'checkout.session.expired':
      case 'payment_intent.payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log(`❌ Payment failed for session: ${session.id}`);

        // Update payment status
        await supabaseClient
          .from('access_requests')
          .update({
            payment_status: 'failed'
          })
          .eq('stripe_session_id', session.id);

        await supabaseClient
          .from('stripe_payments')
          .update({
            status: 'failed'
          })
          .eq('stripe_session_id', session.id);

        break;
      }

      default:
        console.log(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }
});
