import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
  try {
    const { email } = await request.json()

    if (!email) {
      return json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email)
      .single()

    if (existing) {
      return json(
        { error: 'This email is already on the waitlist' },
        { status: 400 }
      )
    }

    // Insert new email
    const { error } = await supabase
      .from('waitlist')
      .insert([{ email }])

    if (error) throw error

    return json({ success: true })
  } catch (error) {
    console.error('Waitlist error:', error)
    return json(
      { error: 'Failed to join waitlist' },
      { status: 500 }
    )
  }
}