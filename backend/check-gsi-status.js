const { DynamoDBClient, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();

async function checkGSIStatus() {
  console.log('Checking DynamoDB GSI Status...\n');
  
  const client = new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });
  
  const tables = [
    { name: 'snapinfra-projects', expectedGSI: 'UserIdIndex' },
    { name: 'snapinfra-schemas', expectedGSI: 'ProjectIdIndex' },
    { name: 'snapinfra-deployments', expectedGSI: 'ProjectIdIndex' }
  ];
  
  for (const table of tables) {
    console.log(`📋 Table: ${table.name}`);
    console.log('-'.repeat(60));
    
    try {
      const command = new DescribeTableCommand({ TableName: table.name });
      const response = await client.send(command);
      
      const gsi = response.Table.GlobalSecondaryIndexes?.find(
        idx => idx.IndexName === table.expectedGSI
      );
      
      if (gsi) {
        const status = gsi.IndexStatus;
        console.log(`  GSI: ${table.expectedGSI}`);
        console.log(`  Status: ${status}`);
        
        if (status === 'ACTIVE') {
          console.log('  ✅ Index is ready to use!');
        } else if (status === 'CREATING' || status === 'UPDATING') {
          console.log('  ⏳ Index is being built... (this may take a few minutes)');
          if (gsi.Backfilling !== undefined) {
            console.log(`  Backfilling: ${gsi.Backfilling}`);
          }
        } else {
          console.log(`  ⚠️  Unexpected status: ${status}`);
        }
      } else {
        console.log(`  ❌ GSI "${table.expectedGSI}" not found`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  console.log('💡 Tip: GSIs can take 5-10 minutes to complete on existing tables.');
  console.log('    Run this script again in a few minutes to check progress.');
}

checkGSIStatus().catch(console.error);
