const axios = require('axios');
require('dotenv').config();

const BASE_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('Starting snapinfra Backend Tests\n');
  console.log('='.repeat(60));
  
  try {
    // Test 1: Health Check
    console.log('\nTest 1: Health Check');
    console.log('-'.repeat(60));
    try {
      const healthResponse = await axios.get(`${BASE_URL}/api/health`);
      console.log('PASS: Backend is healthy');
      console.log('  Status:', healthResponse.data.status);
      console.log('  Environment:', healthResponse.data.environment);
    } catch (error) {
      console.log('FAIL: Health check failed');
      console.log('  Error:', error.message);
    }
    
    // Test 2: Get Projects
    console.log('\nTest 2: Get Projects');
    console.log('-'.repeat(60));
    try {
      const projectsResponse = await axios.get(`${BASE_URL}/api/projects`);
      console.log('PASS: Get projects successful');
      console.log('  Projects found:', projectsResponse.data.count);
    } catch (error) {
      console.log('FAIL: Get projects failed');
      console.log('  Error:', error.response?.data?.error || error.message);
      console.log('  Details:', error.response?.data?.details || 'None');
    }
    
    // Test 3: Create Test Project
    console.log('\nTest 3: Create Test Project');
    console.log('-'.repeat(60));
    try {
      const projectData = {
        name: 'Test Project ' + Date.now(),
        description: 'A test project for backend validation',
        schema: {
          name: 'test-schema',
          tables: [{
            id: 'users-table',
            name: 'users',
            fields: [{
              id: 'user-id',
              name: 'id',
              type: 'string',
              primaryKey: true,
              nullable: false,
              unique: true
            }],
            indexes: []
          }],
          relationships: []
        }
      };
      
      const createResponse = await axios.post(`${BASE_URL}/api/projects`, projectData);
      const projectId = createResponse.data.data.id;
      console.log('PASS: Project created successfully');
      console.log('  Project ID:', projectId);
      console.log('  Project Name:', createResponse.data.data.name);
      
      // Clean up - delete the test project
      console.log('\nTest 4: Delete Test Project');
      console.log('-'.repeat(60));
      try {
        await axios.delete(`${BASE_URL}/api/projects/${projectId}`);
        console.log('PASS: Project deleted successfully');
      } catch (error) {
        console.log('FAIL: Failed to delete project');
        console.log('  Error:', error.response?.data?.error || error.message);
      }
      
    } catch (error) {
      console.log('FAIL: Failed to create project');
      console.log('  Error:', error.response?.data?.error || error.message);
      console.log('  Details:', error.response?.data?.details || 'None');
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('Backend tests completed!\n');
    
  } catch (error) {
    console.error('\nFATAL ERROR:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\nThe backend server is not running.');
      console.log('Please start it with: npm run dev');
    }
    
    process.exit(1);
  }
}

// Run the tests
testBackend().catch(console.error);
