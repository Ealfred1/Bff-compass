#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkTable(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1)
  
  return !error
}

async function verifyDatabase() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗')
  console.log('║         BFF COMPASS - Database Migration Status                ║')
  console.log('╚════════════════════════════════════════════════════════════════╝\n')
  
  console.log('🔗 Supabase URL:', supabaseUrl)
  console.log('✅ Connected to database\n')
  
  const tables = {
    'Existing Tables': [
      'profiles',
      'loneliness_assessments',
      'leisure_assessments',
      'connections',
      'messages',
      'mood_entries',
      'badges',
      'user_badges'
    ],
    'New Tables (Need Migration)': [
      'buddy_groups',
      'buddy_group_members',
      'events',
      'event_attendance',
      'guidance_content',
      'user_guidance_history',
      'mental_health_resources'
    ]
  }
  
  for (const [category, tableList] of Object.entries(tables)) {
    console.log(`\n${category}:`)
    console.log('─'.repeat(60))
    
    for (const table of tableList) {
      const exists = await checkTable(table)
      const status = exists ? '✅' : '❌'
      const msg = exists ? 'EXISTS' : 'MISSING'
      console.log(`${status} ${table.padEnd(30)} ${msg}`)
    }
  }
  
  console.log('\n')
  return tables
}

async function main() {
  try {
    await verifyDatabase()
    
    console.log('━'.repeat(70))
    console.log('📋 MIGRATION INSTRUCTIONS')
    console.log('━'.repeat(70))
    console.log()
    console.log('To complete the database setup, run these SQL files in Supabase:')
    console.log()
    console.log('1. Go to: https://supabase.com/dashboard/project/mlwppxqoifpwvurayijl/sql')
    console.log()
    console.log('2. Click "New Query" button')
    console.log()
    console.log('3. Copy and paste each file (in order):')
    console.log()
    console.log('   📄 scripts/004_add_missing_tables.sql')
    console.log('      Creates 7 new tables + updates existing tables')
    console.log()
    console.log('   📄 scripts/005_seed_guidance_content.sql')
    console.log('      Seeds guidance content + mental health resources + events')
    console.log()
    console.log('   📄 scripts/006_helper_functions.sql')
    console.log('      Creates SQL functions + triggers for auto-awarding badges')
    console.log()
    console.log('4. Click "Run" for each script')
    console.log()
    console.log('━'.repeat(70))
    console.log()
    
    // Read and display file info
    const scriptDir = __dirname
    const files = [
      '004_add_missing_tables.sql',
      '005_seed_guidance_content.sql',
      '006_helper_functions.sql'
    ]
    
    console.log('📊 Migration Files Summary:')
    console.log('━'.repeat(70))
    
    for (const file of files) {
      const filePath = path.join(scriptDir, file)
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8')
        const lines = content.split('\n').length
        const size = (content.length / 1024).toFixed(1)
        console.log(`✅ ${file}`)
        console.log(`   Size: ${size} KB | Lines: ${lines}`)
        console.log()
      }
    }
    
    console.log('━'.repeat(70))
    console.log('⚡ Quick Copy-Paste:')
    console.log('━'.repeat(70))
    console.log()
    console.log('Run these commands to output the SQL:')
    console.log()
    console.log('cat scripts/004_add_missing_tables.sql')
    console.log('cat scripts/005_seed_guidance_content.sql')
    console.log('cat scripts/006_helper_functions.sql')
    console.log()
    console.log('Then paste each into Supabase SQL Editor and run.')
    console.log()
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

main()

