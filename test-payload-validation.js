/**
 * Test script to validate the payload structure matches backend expectations
 * Run with: node test-payload-validation.js
 */

const BACKEND_URL = 'http://localhost:5000';

// Example payload that should match your frontend structure
const examplePayload = {
  name: "Test Social App",
  description: "Testing payload validation",
  schema: {
    name: "Test Social App",
    tables: [
      {
        id: "table_1",
        name: "users",
        fields: [
          {
            id: "field_1",
            name: "id",
            type: "UUID",
            isPrimary: true,
            isRequired: true,
            isUnique: true,
            isForeignKey: false,
            description: "Primary key"
          },
          {
            id: "field_2",
            name: "email",
            type: "Email",
            isPrimary: false,
            isRequired: true,
            isUnique: true,
            isForeignKey: false,
            description: "User email"
          }
        ],
        indexes: []
        // Note: relationships not allowed at table level
      }
    ],
    relationships: []
  }
};

async function testPayload() {
  console.log('Testing payload validation...\n');
  console.log('Payload being sent:');
  console.log(JSON.stringify(examplePayload, null, 2));
  console.log('\n' + '='.repeat(60) + '\n');

  try {
    const response = await fetch(`${BACKEND_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-dev-user-id': 'test-user-validation'
      },
      body: JSON.stringify(examplePayload)
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Validation PASSED!');
      console.log('Project created:', data.data.id);
      console.log('\nFull response:');
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log('❌ Validation FAILED!');
      console.log('Status:', response.status);
      console.log('Error:', data.error);
      
      if (data.details) {
        console.log('\n📋 Validation details:');
        data.details.forEach((detail, i) => {
          console.log(`  ${i + 1}. ${detail}`);
        });
      }
      
      console.log('\n🔍 What to fix:');
      if (data.details) {
        data.details.forEach(detail => {
          if (detail.includes('required')) {
            console.log('  - Missing required field:', detail);
          } else if (detail.includes('must be')) {
            console.log('  - Wrong type/format:', detail);
          } else {
            console.log('  -', detail);
          }
        });
      }
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
    console.log('\nMake sure:');
    console.log('1. Backend is running: cd backend && npm run dev');
    console.log('2. Backend URL is correct:', BACKEND_URL);
  }
}

testPayload();
