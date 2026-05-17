const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = 'https://mtnolymmoonasjbugpra.supabase.co';
const supabaseAnonKey = 'sb_publishable_QpY5rrFALNS0E03JbvYTww_NHv-itI2';

const client = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  try {
    const dbPath = path.join(__dirname, 'database.sql');
    const databaseSQL = fs.readFileSync(dbPath, 'utf-8');
    
    // Split by semicolon to handle multiple statements
    const statements = databaseSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute`);
    console.log('Note: This script attempts to use the rpc method which may not work for DDL');
    console.log('Please manually run the SQL in the Supabase SQL Editor instead.\n');
    
  } catch (error) {
    console.error('Setup failed:', error.message);
  }
}

setupDatabase();
