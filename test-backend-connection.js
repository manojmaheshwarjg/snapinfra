/**
 * Test script to verify backend API connection and DynamoDB integration
 * Run with: node test-backend-connection.js
 */

const BACKEND_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('🧪 Testing RhinoBack Backend Integration\n');
  console.log('=' .repeat(60));

  // Test 1: Health Check
  console.log('\n📋 Test 1: Health Check');
  console.log('-'.repeat(60));
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Backend is healthy');
      console.log('   Status:', data.status);
      console.log('   Environment:', data.environment);
      if (data.services) {
        console.log('   DynamoDB:', data.services.dynamodb?.status || 'unknown');
        console.log('   S3:', data.services.s3?.status || 'unknown');
      }
    } else {
      console.log('❌ Health check failed:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend');
    console.log('   Make sure backend is running: cd backend && npm run dev');
    console.log('   Error:', error.message);
    return false;
  }

  // Test 2: Get Projects
  console.log('\n📋 Test 2: Get Projects');
  console.log('-'.repeat(60));
  try {
    const response = await fetch(`${BACKEND_URL}/api/projects`, {
      headers: {
        'x-dev-user-id': 'test-user-123'
      }
    });
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Projects endpoint working');
      console.log('   Projects found:', data.count || data.data?.length || 0);
      if (data.data && data.data.length > 0) {
        console.log('\n   Recent projects:');
        data.data.slice(0, 3).forEach((proj, i) => {
          console.log(`   ${i + 1}. ${proj.name} (${proj.id})`);
        });
      } else {
        console.log('   No projects found yet (this is normal for first run)');
      }
    } else {
      console.log('❌ Get projects failed:', data.error);
    }
  } catch (error) {
    console.log('❌ Failed to get projects:', error.message);
  }

  // Test 3: Create a Test Project
  console.log('\n📋 Test 3: Create Test Project');
  console.log('-'.repeat(60));
  try {
    const testProject = {
      name: `Test Project ${Date.now()}`,
      description: 'This is a test project created by the test script',
      schema: {
        name: 'TestSchema',
        tables: [
          {
            id: 'test-table-1',
            name: 'users',
            fields: [
              { name: 'id', type: 'uuid', isPrimary: true },
              { name: 'email', type: 'string', isRequired: true },
              { name: 'name', type: 'string' }
            ],
            indexes: []
          }
        ],
        relationships: []
      }
    };

    const response = await fetch(`${BACKEND_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-dev-user-id': 'test-user-123'
      },
      body: JSON.stringify(testProject)
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      console.log('✅ Project created successfully!');
      console.log('   Project ID:', data.data.id);
      console.log('   Project Name:', data.data.name);
      console.log('   Status:', data.data.status);
      console.log('   Created At:', data.data.createdAt);
      
      // Test 4: Verify in DynamoDB by fetching it back
      console.log('\n📋 Test 4: Verify Project in DynamoDB');
      console.log('-'.repeat(60));
      
      const verifyResponse = await fetch(`${BACKEND_URL}/api/projects/${data.data.id}`, {
        headers: {
          'x-dev-user-id': 'test-user-123'
        }
      });
      
      const verifyData = await verifyResponse.json();
      
      if (verifyResponse.ok && verifyData.success) {
        console.log('✅ Project verified in DynamoDB!');
        console.log('   Retrieved Name:', verifyData.data.name);
        console.log('   Retrieved Description:', verifyData.data.description);
      } else {
        console.log('⚠️ Project created but not found in DynamoDB');
        console.log('   This might indicate a table configuration issue');
      }
      
    } else {
      console.log('❌ Failed to create project');
      console.log('   Error:', data.error || data.message);
      console.log('   Details:', data.details);
      
      if (data.error && data.error.includes('table')) {
        console.log('\n💡 Possible fix:');
        console.log('   1. Check if DynamoDB tables exist: aws dynamodb list-tables --region us-east-1');
        console.log('   2. Verify table names in backend/.env match your CDK deployment');
        console.log('   3. Run CDK deploy if tables don\'t exist: cd backend && npm run cdk:deploy');
      }
    }
  } catch (error) {
    console.log('❌ Failed to create project:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎉 Test complete!\n');
  
  // Show next steps
  console.log('📝 Next Steps:');
  console.log('   1. If all tests passed, try creating a project in the UI');
  console.log('   2. Check browser console for logs (🚀, 📡, ✅)');
  console.log('   3. Verify in AWS Console: DynamoDB > Tables > rhinoback-projects');
  console.log('   4. Or use CLI: aws dynamodb scan --table-name rhinoback-projects --region us-east-1');
  console.log('');
}

// Run tests
testBackend().catch(console.error);
