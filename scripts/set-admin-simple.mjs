import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Read .env file manually
const envContent = readFileSync('.env', 'utf-8')
const lines = envContent.split('\n')

let supabaseUrl = null
let serviceKey = null

for (const line of lines) {
  const trimmedLine = line.trim()
  if (!trimmedLine || trimmedLine.startsWith('#')) continue
  
  // Debug: show key names found
  if (trimmedLine.includes('=')) {
    const keyName = trimmedLine.split('=')[0]
    console.log('Found key:', keyName)
  }
  
  if (trimmedLine.startsWith('VITE_SUPABASE_URL=') || trimmedLine.startsWith('SUPABASE_URL=')) {
    const value = trimmedLine.split('=').slice(1).join('=')
    supabaseUrl = value.replace(/^["']|["']$/g, '').trim()
  }
  if (trimmedLine.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    const value = trimmedLine.split('=').slice(1).join('=')
    serviceKey = value.replace(/^["']|["']$/g, '').trim()
    console.log('Service key length:', serviceKey.length)
  }
}

if (!supabaseUrl || !serviceKey) {
  console.error('❌ Missing required environment variables')
  console.error('URL found:', !!supabaseUrl)
  console.error('Service key found:', !!serviceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

console.log('Setting admin role for user: 2f5d429f-9d4d-46e5-af1d-e7f1afd73d0b')

const { data, error } = await supabase.auth.admin.updateUserById(
  '2f5d429f-9d4d-46e5-af1d-e7f1afd73d0b',
  { user_metadata: { role: 'admin' } }
)

if (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
} else {
  console.log('✅ Successfully set admin role!')
  console.log('User:', data.user.email)
  console.log('Metadata:', data.user.user_metadata)
}
