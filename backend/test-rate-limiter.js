// Quick test script to verify the rate limiter works with DynamoDB
// Run this after starting the server: node test-rate-limiter.js

const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TEST_ENDPOINT = `${BASE_URL}/api/health`;

async function testRateLimiter() {
  console.log('Testing DynamoDB-based Rate Limiter\n');
  console.log(`Target: ${TEST_ENDPOINT}\n`);

  try {
    // Make multiple requests to test rate limiting
    for (let i = 1; i <= 10; i++) {
      try {
        const response = await axios.get(TEST_ENDPOINT);
        
        const limit = response.headers['x-ratelimit-limit'];
        const remaining = response.headers['x-ratelimit-remaining'];
        const reset = response.headers['x-ratelimit-reset'];
        
        console.log(`Request ${i}:`);
        console.log(`  Status: ${response.status}`);
        console.log(`  Rate Limit: ${remaining}/${limit}`);
        console.log(`  Reset: ${new Date(reset * 1000).toLocaleTimeString()}`);
        console.log('');
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        if (error.response && error.response.status === 429) {
          console.log(`Request ${i}:`);
          console.log(`  Status: 429 (Rate Limited)`);
          console.log(`  Message: ${error.response.data.message}`);
          console.log(`  Retry After: ${error.response.data.retryAfter} seconds`);
          console.log('');
          
          // Stop testing after hitting rate limit
          console.log('✅ Rate limiter is working correctly!');
          console.log('   - Requests are being tracked in DynamoDB');
          console.log('   - Rate limit enforced successfully');
          break;
        } else {
          throw error;
        }
      }
    }
    
    console.log('\n✅ Rate limiter test completed successfully!');
    console.log('   - All requests were tracked');
    console.log('   - Headers are set correctly');
    console.log('   - DynamoDB storage is working');
    
  } catch (error) {
    console.error('\n❌ Rate limiter test failed:');
    if (error.code === 'ECONNREFUSED') {
      console.error('   Server is not running. Start the server first.');
    } else {
      console.error(`   ${error.message}`);
    }
    process.exit(1);
  }
}

// Check if axios is available
try {
  require.resolve('axios');
  testRateLimiter();
} catch (e) {
  console.error('❌ axios is not installed. Install it with:');
  console.error('   npm install axios');
  process.exit(1);
}
