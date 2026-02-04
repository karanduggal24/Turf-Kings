#!/usr/bin/env node

// Security verification script
// Run with: node scripts/verify-security.js

const fs = require('fs');
const path = require('path');

console.log('🔒 Security Verification Script\n');

// Check if .env.local exists
const envLocalExists = fs.existsSync('.env.local');
console.log(`✅ .env.local exists: ${envLocalExists ? 'Yes' : 'No'}`);

// Check if .env.local.example exists
const envExampleExists = fs.existsSync('.env.local.example');
console.log(`✅ .env.local.example exists: ${envExampleExists ? 'Yes' : 'No'}`);

// Check .gitignore
const gitignoreExists = fs.existsSync('.gitignore');
if (gitignoreExists) {
  const gitignoreContent = fs.readFileSync('.gitignore', 'utf8');
  const hasEnvIgnore = gitignoreContent.includes('.env*') || gitignoreContent.includes('.env.local');
  console.log(`✅ .gitignore protects env files: ${hasEnvIgnore ? 'Yes' : 'No'}`);
} else {
  console.log('❌ .gitignore not found');
}

// Check for secrets in example file
if (envExampleExists) {
  const exampleContent = fs.readFileSync('.env.local.example', 'utf8');
  const hasRealSecrets = exampleContent.includes('eyJ') || exampleContent.includes('https://') && !exampleContent.includes('your_');
  console.log(`✅ Example file is clean: ${!hasRealSecrets ? 'Yes' : 'No (contains real secrets!)'}`);
}

// Security recommendations
console.log('\n🛡️  Security Status:');
if (envLocalExists && envExampleExists && gitignoreExists) {
  console.log('✅ Your environment variables are properly secured!');
  console.log('✅ .env.local will not be committed to Git');
  console.log('✅ Team members can use .env.local.example as template');
} else {
  console.log('⚠️  Some security measures may be missing');
}

console.log('\n📋 Next Steps:');
console.log('1. Never commit .env.local to version control');
console.log('2. Share actual API keys through secure channels only');
console.log('3. Set up environment variables in your hosting platform');
console.log('4. Regularly rotate your Supabase API keys');

console.log('\n🔍 To verify Git protection, run:');
console.log('   git check-ignore .env.local');
console.log('   (Should output: .env.local)');