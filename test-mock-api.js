// Simple test script for the dynamic mock API
// Run with: node test-mock-api.js

const BASE_URL = 'http://localhost:3000/api'

async function testEndpoint(method, path, body = null) {
  console.log(`\n${method} ${path}`)
  console.log('─'.repeat(50))
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    }
  }
  
  if (body) {
    options.body = JSON.stringify(body)
  }
  
  try {
    const response = await fetch(`${BASE_URL}${path}`, options)
    const data = await response.json()
    
    console.log(`Status: ${response.status} ${response.statusText}`)
    console.log('Response:', JSON.stringify(data, null, 2))
    
    return data
  } catch (error) {
    console.error('Error:', error.message)
    return null
  }
}

async function checkServer() {
  console.log('🔍 Checking if dev server is running...')
  try {
    const response = await fetch(`${BASE_URL}/mock/init`)
    if (response.ok) {
      console.log('✅ Server is running!')
      return true
    }
  } catch (error) {
    console.log('❌ Server is not running!')
    console.log('\n📝 To start the server, run:')
    console.log('   npm run dev')
    console.log('\n⏳ Wait for "Ready" message, then run this test again.\n')
    return false
  }
  return false
}

async function runTests() {
  console.log('🧪 Testing Dynamic Mock API System')
  console.log('═'.repeat(50))
  console.log('')
  
  // Check if server is running first
  const serverRunning = await checkServer()
  if (!serverRunning) {
    process.exit(1)
  }
  
  console.log('')
  
  // Test 1: Check mock system status
  await testEndpoint('GET', '/mock/init')
  
  // Test 2: List users (auto-generated)
  await testEndpoint('GET', '/users')
  
  // Test 3: Get single user
  await testEndpoint('GET', '/users/1')
  
  // Test 4: Create a new user
  await testEndpoint('POST', '/users', {
    name: 'John Doe',
    email: 'john@test.com',
    username: 'johndoe'
  })
  
  // Test 5: List users again (should include new user)
  await testEndpoint('GET', '/users')
  
  // Test 6: Update user
  await testEndpoint('PUT', '/users/1', {
    name: 'Jane Updated'
  })
  
  // Test 7: Auth login
  await testEndpoint('POST', '/auth/login', {
    email: 'test@example.com',
    password: 'password123'
  })
  
  // Test 8: Auth register
  await testEndpoint('POST', '/auth/register', {
    email: 'newuser@example.com',
    name: 'New User',
    username: 'newuser'
  })
  
  // Test 9: Get current user
  await testEndpoint('GET', '/auth/me')
  
  // Test 10: Test with posts (auto-generated)
  await testEndpoint('GET', '/posts')
  
  // Test 11: Create a post
  await testEndpoint('POST', '/posts', {
    title: 'My First Post',
    content: 'This is test content',
    userId: '1'
  })
  
  // Test 12: Delete user
  await testEndpoint('DELETE', '/users/1')
  
  // Test 13: Try to get deleted user (should 404)
  await testEndpoint('GET', '/users/1')
  
  console.log('\n' + '═'.repeat(50))
  console.log('✅ All tests completed!')
  console.log('\nTry the onboarding flow at: http://localhost:3000/onboarding')
}

// Run tests
runTests().catch(console.error)
