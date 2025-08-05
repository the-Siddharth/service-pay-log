import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  game_id: string;
  server: string;
  service_name: string;
  service_description?: string;
  amount: number;
  payment_id?: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderData = await req.json();
    console.log('Processing order:', orderData);

    // Save order to Supabase
    const { data: order, error: dbError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderData.customer_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        game_id: orderData.game_id,
        server: orderData.server,
        service_name: orderData.service_name,
        service_description: orderData.service_description,
        amount: orderData.amount,
        payment_id: orderData.payment_id,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save order to database');
    }

    console.log('Order saved to database:', order);

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: order.id,
        message: 'Order processed successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error processing order:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process order',
        success: false
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});