const { DynamoDBClient, ListTablesCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

async function testAWSCredentials() {
  console.log('🔍 Testing AWS Credentials\n');
  
  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log('  AWS_REGION:', process.env.AWS_REGION || 'NOT SET');
  console.log('  AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'SET (hidden)' : 'NOT SET');
  console.log('  AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'SET (hidden)' : 'NOT SET');
  console.log('');
  
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.log('❌ AWS credentials are not configured');
    console.log('   Please check your .env file');
    return;
  }
  
  // Test 1: Create DynamoDB client
  console.log('🔧 Test 1: Creating DynamoDB Client...');
  try {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });
    console.log('✅ DynamoDB client created successfully\n');
    
    // Test 2: List tables
    console.log('🔧 Test 2: Listing DynamoDB Tables...');
    try {
      const command = new ListTablesCommand({});
      const response = await client.send(command);
      console.log('✅ Successfully connected to DynamoDB');
      console.log('   Tables found:', response.TableNames?.length || 0);
      if (response.TableNames && response.TableNames.length > 0) {
        console.log('   Tables:', response.TableNames.join(', '));
      } else {
        console.log('   ⚠️  No tables found - you may need to deploy your CDK stack');
      }
      console.log('');
    } catch (error) {
      console.log('❌ Failed to list tables');
      console.log('   Error:', error.message);
      console.log('');
      
      if (error.name === 'CredentialsProviderError') {
        console.log('💡 Credentials Issue:');
        console.log('   The AWS credentials are not valid or have expired');
        console.log('   Please check:');
        console.log('   1. Your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env');
        console.log('   2. The credentials have not been revoked');
        console.log('   3. The IAM user has the required permissions');
      } else if (error.name === 'UnrecognizedClientException') {
        console.log('💡 Authentication Issue:');
        console.log('   The security token or access key ID is not recognized');
        console.log('   Please verify your credentials are correct');
      } else if (error.name === 'InvalidSignatureException') {
        console.log('💡 Signature Issue:');
        console.log('   The secret access key is incorrect');
      } else if (error.message && error.message.includes('credential')) {
        console.log('💡 Credential Validation Issue:');
        console.log('   The credential object is not properly configured');
        console.log('   This usually means:');
        console.log('   1. Missing or empty AWS_ACCESS_KEY_ID');
        console.log('   2. Missing or empty AWS_SECRET_ACCESS_KEY');
        console.log('   3. Invalid format in the credentials');
      }
    }
    
  } catch (error) {
    console.log('❌ Failed to create DynamoDB client');
    console.log('   Error:', error.message);
    console.log('');
  }
  
  // Summary
  console.log('📝 Summary:');
  console.log('   Check the error messages above to troubleshoot the issue');
  console.log('');
}

testAWSCredentials().catch(console.error);
