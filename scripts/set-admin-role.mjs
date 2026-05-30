import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  console.error('❌ Error: SUPABASE_URL not found in .env file')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY not found in .env file')
  console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')))
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setAdmin() {
  console.log('Setting admin role for user: 2f5d429f-9d4d-46e5-af1d-e7f1afd73d0b')
  
  const { data, error } = await supabase.auth.admin.updateUserById(
    '2f5d429f-9d4d-46e5-af1d-e7f1afd73d0b',
    { user_metadata: { role: 'admin' } }
  )

  if (error) {
    console.error('❌ Error setting admin role:', error.message)
  } else {
    console.log('✅ Successfully set admin role!')
    console.log('User email:', data.user.email)
    console.log('User metadata:', data.user.user_metadata)
  }
}

setAdmin()
