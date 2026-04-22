import { supabase } from '../lib/supabase'

export interface ContactSubmission {
  name: string
  email: string
  company?: string
  phone?: string
  store_area?: number
  requirement_type?: string
  need_oem?: boolean
  message: string
}

/**
 * Submit a contact form to Supabase
 */
export async function submitContactForm(data: ContactSubmission): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: data.name,
          email: data.email,
          company: data.company || null,
          phone: data.phone || null,
          store_area: data.store_area || null,
          requirement_type: data.requirement_type || null,
          need_oem: data.need_oem || false,
          message: data.message,
          status: 'new'
        }
      ])

    if (error) {
      console.error('Error submitting contact form:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected error submitting contact form:', err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    }
  }
}

/**
 * Get all contact submissions (for admin use)
 */
export async function getContactSubmissions() {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching contact submissions:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error fetching contact submissions:', err)
    return { 
      data: null, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    }
  }
}

/**
 * Update submission status (for admin use)
 */
export async function updateSubmissionStatus(id: string, status: string) {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Error updating submission status:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    console.error('Unexpected error updating submission status:', err)
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    }
  }
}
