// Supabase Edge Function: Reply to Customer Email
// Deploy with: supabase functions deploy reply-to-customer
// Usage: Called from admin dashboard when replying to inquiries

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'sardenesy@gmail.com'
const FROM_NAME = Deno.env.get('FROM_NAME') || 'Fixturerb2b Support'

interface EmailRequest {
  to: string
  subject: string
  body: string
  customerName: string
}

serve(async (req) => {
  try {
    // CORS headers for browser requests
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    // Parse the request body
    const emailData: EmailRequest = await req.json()

    if (!emailData.to || !emailData.subject || !emailData.body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, subject, body' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Prepare email content
    const emailPayload = {
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [emailData.to],
      subject: emailData.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f5e6d3 0%, #d4b896 100%); padding: 20px; border-radius: 12px 12px 0 0;">
            <h1 style="color: #8b6914; margin: 0; font-size: 24px;"> Fixturerb2b</h1>
            <p style="color: #8b6914; margin: 5px 0 0 0; font-size: 14px;">Professional Display Fixtures & Store Equipment Manufacturer</p>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e5e5; border-top: none;">
            <p style="color: #666; margin-bottom: 20px;">Dear ${emailData.customerName || 'Valued Customer'},</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #8b6914; margin: 20px 0;">
              <p style="color: #333; margin: 0; line-height: 1.6; white-space: pre-wrap;">${emailData.body}</p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee;">
              <p style="color: #666; margin: 0 0 10px 0;">Best regards,</p>
              <p style="color: #8b6914; font-weight: bold; margin: 0;">Fixturerb2b Team</p>
              <p style="color: #666; font-size: 12px; margin: 5px 0 0 0;">
                📧 support@fixr2026.com | 🌐 <a href="https://fixr2026.com" style="color: #8b6914;">fixr2026.com</a>
              </p>
            </div>
          </div>

          <div style="background: #f5e6d3; padding: 15px; border-radius: 0 0 12px 12px; text-align: center;">
            <p style="color: #8b6914; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Fixturerb2b. All rights reserved.
            </p>
          </div>
        </div>
      `,
      text: emailData.body,
    }

    console.log('Sending email to:', emailData.to)
    console.log('Subject:', emailData.subject)

    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailPayload),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to send email:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email',
          details: error 
        }),
        {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    const result = await response.json()
    console.log('Email sent successfully:', result.id)

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: result.id,
        message: 'Email sent successfully'
      }),
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )

  } catch (error) {
    console.error('Error in reply-to-customer function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})
