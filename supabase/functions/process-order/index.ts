import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Resend } from "npm:resend@2.0.0";

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

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const orderData: OrderData = await req.json();
    console.log('Processing order:', orderData);

    // 1. Save order to Supabase
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

    // 2. Add to Google Sheets
    try {
      const sheetsResponse = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${Deno.env.get('GOOGLE_SHEET_ID')}/values/Sheet1:append?valueInputOption=RAW&key=${Deno.env.get('GOOGLE_SHEETS_API_KEY')}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [[
              new Date().toISOString(),
              order.id,
              orderData.customer_name,
              orderData.customer_email,
              orderData.customer_phone,
              orderData.game_id,
              orderData.server,
              orderData.service_name,
              orderData.amount,
              'pending'
            ]]
          })
        }
      );

      if (!sheetsResponse.ok) {
        console.error('Google Sheets error:', await sheetsResponse.text());
      } else {
        console.log('Order added to Google Sheets successfully');
      }
    } catch (sheetsError) {
      console.error('Google Sheets integration error:', sheetsError);
    }

    // 3. Send email notification
    try {
      const emailResponse = await resend.emails.send({
        from: 'Gaming Service <orders@yourdomain.com>',
        to: ['admin@yourdomain.com'], // Replace with your admin email
        subject: 'New Order Received',
        html: `
          <h2>New Order Received</h2>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${orderData.customer_name}</p>
          <p><strong>Email:</strong> ${orderData.customer_email}</p>
          <p><strong>Phone:</strong> ${orderData.customer_phone}</p>
          <p><strong>Game ID:</strong> ${orderData.game_id}</p>
          <p><strong>Server:</strong> ${orderData.server}</p>
          <p><strong>Service:</strong> ${orderData.service_name}</p>
          <p><strong>Amount:</strong> ₹${orderData.amount}</p>
          <p><strong>Status:</strong> Pending</p>
          <p><strong>Payment ID:</strong> ${orderData.payment_id || 'N/A'}</p>
        `,
      });

      console.log('Email notification sent:', emailResponse);
    } catch (emailError) {
      console.error('Email notification error:', emailError);
    }

    // Generate UPI payment link
    const upiId = 'your-upi-id@paytm'; // Replace with your actual UPI ID
    const amount = orderData.amount;
    const transactionNote = `ML Boost - ${orderData.service_name}`;
    
    // Create UPI payment URL
    const upiUrl = `upi://pay?pa=${upiId}&pn=ML%20Boost&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    
    console.log('Generated UPI URL:', upiUrl);

    return new Response(
      JSON.stringify({ 
        success: true, 
        orderId: order.id,
        message: 'Order processed successfully',
        upiUrl: upiUrl
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