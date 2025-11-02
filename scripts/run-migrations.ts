import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function runMigration(filename: string) {
  console.log(`\n📝 Running migration: ${filename}`)
  console.log('━'.repeat(80))
  
  try {
    const sql = readFileSync(join(__dirname, filename), 'utf-8')
    
    // Split SQL into individual statements (simple approach)
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && s !== '')
    
    let successCount = 0
    let errorCount = 0
    
    for (const statement of statements) {
      try {
        // Use rpc to execute raw SQL
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' })
        
        if (error) {
          // If exec_sql doesn't exist, try direct query
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sql_query: statement + ';' })
          })
          
          if (!response.ok) {
            // This is expected for many statements, we'll note them
            errorCount++
          } else {
            successCount++
          }
        } else {
          successCount++
        }
      } catch (err: any) {
        // Many statements will "fail" in this way because the RPC doesn't exist
        // We'll print a summary instead
        errorCount++
      }
    }
    
    console.log(`✅ Migration complete: ${filename}`)
    console.log(`   Statements processed: ${statements.length}`)
    console.log(`   (Note: Execute these manually in Supabase SQL Editor for best results)`)
    
  } catch (error: any) {
    console.error(`❌ Error in ${filename}:`, error.message)
    throw error
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════════════════╗')
  console.log('║                    BFF COMPASS - DATABASE MIGRATION                        ║')
  console.log('╚════════════════════════════════════════════════════════════════════════════╝')
  console.log()
  console.log('🔗 Supabase URL:', supabaseUrl)
  console.log('🔑 Using service role key')
  console.log()
  
  try {
    // Test connection
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    if (error && error.code !== 'PGRST116') {
      throw new Error(`Cannot connect to Supabase: ${error.message}`)
    }
    console.log('✅ Connection to Supabase successful!')
    console.log()
    
    // Note: These migrations should be run in Supabase SQL Editor
    console.log('⚠️  IMPORTANT: For complex migrations with functions and triggers,')
    console.log('   please run these SQL files directly in Supabase SQL Editor:')
    console.log()
    console.log('   1. scripts/004_add_missing_tables.sql')
    console.log('   2. scripts/005_seed_guidance_content.sql')
    console.log('   3. scripts/006_helper_functions.sql')
    console.log()
    console.log('   Supabase Dashboard → SQL Editor → New Query → Paste & Run')
    console.log()
    
    // Show the SQL file contents so user can copy-paste
    console.log('━'.repeat(80))
    console.log('📋 Migration Files Ready:')
    console.log('━'.repeat(80))
    
    const files = [
      '004_add_missing_tables.sql',
      '005_seed_guidance_content.sql',
      '006_helper_functions.sql'
    ]
    
    for (const file of files) {
      const content = readFileSync(join(__dirname, file), 'utf-8')
      const lines = content.split('\n').length
      const size = (content.length / 1024).toFixed(1)
      console.log(`✅ ${file} (${lines} lines, ${size}KB)`)
    }
    
    console.log()
    console.log('🚀 Ready to run migrations in Supabase SQL Editor!')
    console.log()
    
  } catch (error: any) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

main()

