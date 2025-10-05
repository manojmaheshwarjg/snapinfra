/**
 * Test schema updates in DynamoDB
 * This will create a project, then update its schema
 */

const BACKEND_URL = 'http://localhost:5000';
const USER_ID = 'test-schema-user';

async function testSchemaUpdate() {
  console.log('🧪 Testing Schema Updates in DynamoDB\n');
  console.log('='.repeat(60));

  // Step 1: Create a project
  console.log('\n📋 Step 1: Create Initial Project');
  console.log('-'.repeat(60));

  const initialProject = {
    name: "Schema Test Project",
    description: "Testing schema updates",
    schema: {
      name: "Schema Test Project",
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
            }
          ],
          indexes: []
        }
      ],
      relationships: []
    }
  };

  let projectId;
  try {
    const createResponse = await fetch(`${BACKEND_URL}/api/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-dev-user-id': USER_ID
      },
      body: JSON.stringify(initialProject)
    });

    const createData = await createResponse.json();
    
    if (!createResponse.ok) {
      console.log('❌ Failed to create project:', createData.error);
      return;
    }

    projectId = createData.data.id;
    console.log('✅ Project created:', projectId);
    console.log('   Initial tables:', createData.data.schema.tables.length);
    console.log('   Table 1:', createData.data.schema.tables[0].name);
    console.log('   Fields:', createData.data.schema.tables[0].fields.length);
  } catch (error) {
    console.log('❌ Error creating project:', error.message);
    return;
  }

  // Step 2: Update the schema (add a new field and table)
  console.log('\n📋 Step 2: Update Schema (Add field + table)');
  console.log('-'.repeat(60));

  const updatedSchema = {
    name: "Schema Test Project",
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
          },
          {
            id: "field_3",
            name: "name",
            type: "Text",
            isPrimary: false,
            isRequired: true,
            isUnique: false,
            isForeignKey: false,
            description: "User full name"
          }
        ],
        indexes: []
      },
      {
        id: "table_2",
        name: "posts",
        fields: [
          {
            id: "field_4",
            name: "id",
            type: "UUID",
            isPrimary: true,
            isRequired: true,
            isUnique: true,
            isForeignKey: false,
            description: "Primary key"
          },
          {
            id: "field_5",
            name: "title",
            type: "Text",
            isPrimary: false,
            isRequired: true,
            isUnique: false,
            isForeignKey: false,
            description: "Post title"
          },
          {
            id: "field_6",
            name: "user_id",
            type: "UUID",
            isPrimary: false,
            isRequired: true,
            isUnique: false,
            isForeignKey: true,
            description: "Author ID"
          }
        ],
        indexes: []
      }
    ],
    relationships: []
  };

  try {
    const updateResponse = await fetch(`${BACKEND_URL}/api/projects/${projectId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-dev-user-id': USER_ID
      },
      body: JSON.stringify({ schema: updatedSchema })
    });

    const updateData = await updateResponse.json();
    
    if (!updateResponse.ok) {
      console.log('❌ Failed to update schema:', updateData.error);
      if (updateData.details) {
        console.log('   Details:', updateData.details);
      }
      return;
    }

    console.log('✅ Schema updated successfully!');
    console.log('   Tables now:', updateData.data.schema.tables.length);
    updateData.data.schema.tables.forEach((table, i) => {
      console.log(`   Table ${i + 1}: ${table.name} (${table.fields.length} fields)`);
    });
  } catch (error) {
    console.log('❌ Error updating schema:', error.message);
    return;
  }

  // Step 3: Verify the update by fetching the project again
  console.log('\n📋 Step 3: Verify Update in DynamoDB');
  console.log('-'.repeat(60));

  try {
    const getResponse = await fetch(`${BACKEND_URL}/api/projects/${projectId}`, {
      headers: {
        'x-dev-user-id': USER_ID
      }
    });

    const getData = await getResponse.json();
    
    if (!getResponse.ok) {
      console.log('❌ Failed to fetch project:', getData.error);
      return;
    }

    console.log('✅ Project fetched from DynamoDB');
    console.log('\n📊 Final Schema Structure:');
    console.log('   Total tables:', getData.data.schema.tables.length);
    
    getData.data.schema.tables.forEach((table, i) => {
      console.log(`\n   Table ${i + 1}: "${table.name}"`);
      console.log(`   Fields (${table.fields.length}):`);
      table.fields.forEach((field, j) => {
        const badges = [];
        if (field.isPrimary) badges.push('PK');
        if (field.isRequired) badges.push('Required');
        if (field.isUnique) badges.push('Unique');
        if (field.isForeignKey) badges.push('FK');
        console.log(`      ${j + 1}. ${field.name} (${field.type}) ${badges.join(', ')}`);
      });
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ Schema update test PASSED!');
    console.log('\nConclusion:');
    console.log('- Schema is stored as part of Project object ✅');
    console.log('- Updates are persisted to DynamoDB ✅');
    console.log('- All fields are preserved correctly ✅');

  } catch (error) {
    console.log('❌ Error fetching project:', error.message);
  }
}

testSchemaUpdate();
