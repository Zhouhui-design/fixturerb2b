// Supabase Edge Function: Send Email Notification
// Deploy with: supabase functions deploy send-email-notification

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || 'your-email@example.com'

serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Parse the request body
    const { record } = await req.json()

    if (!record) {
      return new Response('No record provided', { status: 400 })
    }

    // Prepare email content
    const emailData = {
      from: 'noreply@fixturerb2b.top',
      to: [ADMIN_EMAIL],
      subject: `New Quote Request from ${record.customer_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">📋 New Quote Request</h1>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #667eea; margin-top: 0;">Customer Information</h2>
            <p><strong>Name:</strong> ${record.customer_name}</p>
            <p><strong>Email:</strong> ${record.customer_email}</p>
            <p><strong>Company:</strong> ${record.company_name}</p>
            <p><strong>Country:</strong> ${record.country}</p>
            <p><strong>Phone:</strong> ${record.phone || 'Not provided'}</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #667eea; margin-top: 0;">Product Details</h2>
            <p><strong>Product:</strong> ${record.product_name}</p>
            <p><strong>Quantity:</strong> ${record.quantity}</p>
            <p><strong>Target Price:</strong> ${record.target_price || 'Not specified'}</p>
            <p><strong>Specifications:</strong> ${record.specifications || 'Not provided'}</p>
          </div>

          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #667eea; margin-top: 0;">Trade Terms</h2>
            <p><strong>Delivery Terms:</strong> ${record.delivery_terms}</p>
            <p><strong>Payment Terms:</strong> ${record.payment_terms}</p>
          </div>

          ${record.message ? `
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #667eea; margin-top: 0;">Additional Message</h2>
            <p>${record.message}</p>
          </div>
          ` : ''}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee;">
            <p style="color: #666; font-size: 14px;">
              <strong>Received:</strong> ${new Date(record.created_at).toLocaleString()}
            </p>
            <a href="${SUPABASE_URL}/project/${SUPABASE_URL.split('//')[1].split('.')[0]}/editor?table=quote_requests" 
               style="display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 10px;">
              View in Supabase Dashboard →
            </a>
          </div>
        </div>
      `
    }

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify(emailData)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to send email:', error)
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const result = await response.json()
    console.log('Email sent successfully:', result)

    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in send-email-notification function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})
