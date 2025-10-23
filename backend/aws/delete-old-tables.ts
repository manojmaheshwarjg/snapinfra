import { DynamoDBClient, ListTablesCommand, DeleteTableCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });

const OLD_TABLES = [
  'rhinoback-deployments',
  'rhinoback-projects',
  'rhinoback-schemas',
  'rhinoback-users'
];

async function deleteOldTables() {
  console.log('Starting deletion of old tables...\n');

  for (const tableName of OLD_TABLES) {
    try {
      console.log(`Deleting table: ${tableName}`);
      await client.send(new DeleteTableCommand({ TableName: tableName }));
      console.log(`✓ Successfully deleted: ${tableName}\n`);
      
      // Wait a bit between deletions to avoid throttling
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error: any) {
      if (error.name === 'ResourceNotFoundException') {
        console.log(`⚠ Table not found: ${tableName} (already deleted or doesn't exist)\n`);
      } else {
        console.error(`✗ Error deleting ${tableName}:`, error.message, '\n');
      }
    }
  }

  console.log('Deletion process completed!');
  console.log('\nNext steps:');
  console.log('1. cd backend/aws/cdk');
  console.log('2. npm install');
  console.log('3. npm run build');
  console.log('4. npm run deploy');
}

deleteOldTables().catch(console.error);
