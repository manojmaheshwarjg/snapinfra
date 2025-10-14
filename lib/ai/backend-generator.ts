import { generateText } from 'ai';
import { groq, AI_CONFIG } from './groq-client';

export interface DatabaseField {
  name: string;
  type: string;
  primary?: boolean;
  unique?: boolean;
  foreign?: string;
  nullable?: boolean;
  default?: any;
  length?: number;
  precision?: number;
  scale?: number;
  comment?: string;
}

export interface DatabaseIndex {
  name: string;
  type: 'btree' | 'hash' | 'gin' | 'gist' | 'unique' | 'partial' | 'composite';
  fields: string[];
  condition?: string;
  comment?: string;
}

export interface DatabaseConstraint {
  name: string;
  type: 'check' | 'foreign_key' | 'unique' | 'exclusion';
  definition: string;
  comment?: string;
}

export interface DatabaseTrigger {
  name: string;
  timing: 'BEFORE' | 'AFTER' | 'INSTEAD OF';
  events: ('INSERT' | 'UPDATE' | 'DELETE')[];
  definition: string;
  comment?: string;
}

export interface DatabaseSchema {
  name: string;
  fields: DatabaseField[];
  indexes: DatabaseIndex[];
  constraints: DatabaseConstraint[];
  triggers?: DatabaseTrigger[];
  partitioning?: {
    strategy: 'range' | 'hash' | 'list';
    column: string;
    comment?: string;
  };
  comment?: string;
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  body?: Record<string, string> | string;
  params?: Record<string, string>;
  response?: Record<string, any>;
  auth?: boolean;
}

export interface APIEndpointGroup {
  group: string;
  endpoints: APIEndpoint[];
}

export interface BackendGenerationResult {
  description: string;
  schemas: DatabaseSchema[];
  database: string;
  endpoints: APIEndpointGroup[];
  success: boolean;
  error?: string;
}

// Available Groq models for backend generation
export const AVAILABLE_MODELS = [
  { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant (Recommended)', description: 'Fast and reliable model for quick generation' },
  { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', description: 'Latest model with enhanced capabilities' },
  { id: 'llama3-groq-70b-8192-tool-use-preview', name: 'Llama 3 70B Tool Use', description: 'Optimized for function calling and tool use' },
  { id: 'gemma2-9b-it', name: 'Gemma 2 9B', description: 'Google Gemma model for instruction following' }
] as const;

const DATABASE_GENERATION_PROMPT = `You are a senior database architect with expertise in designing scalable, comprehensive database systems. Generate a complete database schema with REST API endpoints.

CRITICAL REQUIREMENTS:
- Generate EXACTLY 6-20 database tables (minimum 6, maximum 20)
- Base the number of tables on the complexity of the use case
- Simple use cases: 6-10 tables
- Complex use cases: 12-20 tables
- Respond with ONLY valid JSON. No other text.

Required JSON format:
{
  "description": "What this backend does",
  "database": "PostgreSQL",
  "schemas": [
    {
      "name": "users",
      "comment": "User accounts",
      "fields": [
        {
          "name": "id",
          "type": "uuid",
          "primary": true,
          "default": "gen_random_uuid()"
        },
        {
          "name": "email",
          "type": "varchar",
          "length": 320,
          "unique": true,
          "nullable": false
        },
        {
          "name": "created_at",
          "type": "timestamptz",
          "default": "NOW()",
          "nullable": false
        },
        {
          "name": "updated_at",
          "type": "timestamptz",
          "default": "NOW()",
          "nullable": false
        }
      ],
      "indexes": [
        {
          "name": "idx_users_email",
          "type": "unique",
          "fields": ["email"]
        }
      ],
      "constraints": [
        {
          "name": "chk_users_email",
          "type": "check",
          "definition": "CHECK (email LIKE '%@%')"
        }
      ]
    }
  ],
  "endpoints": [
    {
      "group": "Authentication",
      "endpoints": [
        {
          "method": "POST",
          "path": "/api/v1/auth/login",
          "description": "User login",
          "body": {"email": "string", "password": "string"},
          "auth": false
        }
      ]
    }
  ],
  "success": true
}

Requirements:

DATABASE DESIGN:
1. MANDATORY: Generate 6-20 tables based on use case complexity
2. Every table MUST have:
   - id (uuid, primary key, default: gen_random_uuid())
   - created_at (timestamptz, default: NOW())
   - updated_at (timestamptz, default: NOW())
   - deleted_at (timestamptz, nullable, for soft deletes)

3. Include these essential table types:
   - Core entity tables (users, main business objects)
   - Relationship tables (many-to-many joins)
   - Lookup/reference tables (categories, statuses, types)
   - Transaction tables (orders, payments, logs)
   - Configuration tables (settings, permissions)
   - Audit/tracking tables (logs, history)

4. Add comprehensive indexes for:
   - All foreign keys
   - Unique constraints
   - Search/filter fields
   - Sort fields (created_at, updated_at)

5. Add business constraints:
   - Email format validation
   - Status value validation
   - Price/quantity validations
   - Business rule checks

6. Generate complete REST API endpoints for all tables
7. Use proper PostgreSQL field types with precision/length
8. Add detailed comments for all tables, fields, indexes, and constraints

EXAMPLES OF COMPREHENSIVE SCHEMAS:
- E-commerce: users, products, categories, orders, order_items, payments, shipping_addresses, reviews, coupons, inventory, suppliers, product_images, wishlists, cart_items, audit_logs (15+ tables)
- Social Media: users, posts, comments, likes, follows, groups, group_members, messages, notifications, media_uploads, hashtags, post_hashtags, user_profiles, privacy_settings, reports (15+ tables)
- Blog: users, posts, categories, tags, post_tags, comments, media, pages, menus, menu_items, user_roles, permissions, settings, analytics, subscribers (15+ tables)

ALWAYS think about:
- What supporting tables are needed?
- What lookup tables would be useful?
- What many-to-many relationships exist?
- What configuration/settings tables are needed?
- What audit/tracking is required?`

export async function generateBackend(
  userDescription: string,
  options: { temperature?: number; maxTokens?: number; model?: string } = {}
): Promise<BackendGenerationResult> {
  if (!userDescription?.trim()) {
    return {
      description: '',
      schemas: [],
      database: 'PostgreSQL',
      endpoints: [],
      success: false,
      error: 'Description is required',
    };
  }

  // Available models with fallback order
  const availableModels = [
    options.model || AI_CONFIG.model,
    'llama-3.1-8b-instant',
    'llama-3.3-70b-versatile', 
    'gemma2-9b-it'
  ];

  let lastError: Error | null = null;
  
  // Try each model until one works or all fail
  for (let i = 0; i < availableModels.length; i++) {
    const currentModel = availableModels[i];
    
    try {
      console.log(`Generating backend with Groq AI using model: ${currentModel} (attempt ${i + 1}/${availableModels.length})`);
      console.log('Description:', userDescription);
      console.log('Options:', options);
      
      const { text } = await generateText({
        model: groq(currentModel),
        messages: [
          {
            role: 'system',
            content: DATABASE_GENERATION_PROMPT,
          },
          {
            role: 'user',
            content: `Generate a comprehensive, production-ready database schema with 6-20 tables for: ${userDescription}

IMPORTANT: 
- Analyze the use case complexity
- Include ALL necessary supporting tables (lookup tables, junction tables, configuration tables, audit tables)
- Think about the complete ecosystem needed for this application
- Don't just create the obvious tables - think about permissions, settings, logs, categories, tags, relationships, etc.
- Aim for 8-15 tables for most use cases
- Simple use cases should have at least 6 tables
- Complex use cases should have 12-20 tables`,
          },
        ],
        temperature: options.temperature ?? 0.7,
        maxTokens: options.maxTokens || 6000,
        topP: 0.9,
      });

      console.log('AI Response received, length:', text.length);
      console.log('AI Response preview:', text.substring(0, 200) + '...');

      // Parse the JSON response
      let result;
      try {
        // Clean up the response text
        let cleanText = text.trim();
        
        // Remove any markdown code blocks if present
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }
        
        // Remove any leading/trailing text that isn't JSON
        const jsonStart = cleanText.indexOf('{');
        const jsonEnd = cleanText.lastIndexOf('}');
        
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
          cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
        }
        
        result = JSON.parse(cleanText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('AI Response full text:', text);
        console.error('AI Response length:', text.length);
        console.error('Current model:', currentModel);
        throw new Error(`AI returned invalid JSON format. Model: ${currentModel}. Error: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
      
      console.log('Parsed AI result - schemas count:', result.schemas?.length || 0);
      console.log('Parsed AI result - endpoints count:', result.endpoints?.length || 0);
      
      // Validate the AI response
      const validation = validateAIResponse(result, userDescription);
      if (!validation.isValid) {
        throw new Error(validation.error || 'Invalid AI response');
      }

      // Ensure all schemas have required fields
      const enhancedSchemas = validation.schemas!.map((schema: any) => ({
        ...schema,
        indexes: schema.indexes || [],
        constraints: schema.constraints || [],
        triggers: schema.triggers || [],
        comment: schema.comment || `${schema.name} table`
      }));

      console.log(`✅ Successfully generated ${enhancedSchemas.length} tables and ${validation.endpoints!.length} endpoint groups with model: ${currentModel}`);

      return {
        description: result.description || userDescription,
        schemas: enhancedSchemas,
        database: result.database || 'PostgreSQL',
        endpoints: validation.endpoints!,
        success: true,
      };
      
    } catch (modelError) {
      lastError = modelError instanceof Error ? modelError : new Error(String(modelError));
      console.error(`Model ${currentModel} failed:`, lastError.message);
      
      // Check if it's a rate limit error
      const isRateLimit = lastError.message.includes('Rate limit') || lastError.message.includes('rate limit');
      if (isRateLimit) {
        console.log(`Rate limit reached for ${currentModel}, trying next model...`);
        continue; // Try next model
      }
      
      // For other errors, if this is the last model, continue to return the error below
      if (i === availableModels.length - 1) {
        break; // Exit the loop, will return error below
      }
      
      // For non-rate-limit errors, continue to next model after a short delay
      console.log(`Error with ${currentModel}, trying next model in 1 second...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // If we reach here, all models failed
  console.error('All models failed. Last error:', lastError?.message);
  
  return {
    description: '',
    schemas: [],
    database: 'PostgreSQL',
    endpoints: [],
    success: false,
    error: lastError ? `Backend generation failed after trying multiple models. ${lastError.message}` : 'All AI models failed. Please try again later.',
  };
}

// Enhanced validation with proper error messages
function validateAIResponse(result: any, userDescription: string): {
  isValid: boolean;
  error?: string;
  schemas?: DatabaseSchema[];
  endpoints?: APIEndpointGroup[];
} {
  // Check if result has basic structure
  if (!result || typeof result !== 'object') {
    return { isValid: false, error: 'Invalid response format from AI. Please try again.' };
  }

  // Check if schemas exist and meet minimum requirements
  if (!result.schemas || !Array.isArray(result.schemas)) {
    return { isValid: false, error: 'No database schemas generated. Please try again with a more detailed description.' };
  }

  if (result.schemas.length < 6) {
    return { isValid: false, error: `Only ${result.schemas.length} tables generated. Please try again - we need at least 6 tables for a comprehensive backend.` };
  }

  if (result.schemas.length > 20) {
    return { isValid: false, error: `Too many tables generated (${result.schemas.length}). Please simplify your description.` };
  }

  // Validate each schema has required fields
  for (const schema of result.schemas) {
    if (!schema.name) {
      return { isValid: false, error: 'Invalid schema structure - missing table names. Please try again.' };
    }
    
    if (!schema.fields || !Array.isArray(schema.fields) || schema.fields.length === 0) {
      return { isValid: false, error: `Table '${schema.name}' has no fields. Please try again.` };
    }

    // Check for required ID field
    const hasIdField = schema.fields.some((field: any) => field.primary === true);
    if (!hasIdField) {
      return { isValid: false, error: `Table '${schema.name}' missing primary key. Please try again.` };
    }
  }

  // Check endpoints
  if (!result.endpoints || !Array.isArray(result.endpoints)) {
    return { isValid: false, error: 'No API endpoints generated. Please try again.' };
  }

  return {
    isValid: true,
    schemas: result.schemas,
    endpoints: result.endpoints
  };
}


// Helper function to validate generated schemas
export function validateSchemas(schemas: DatabaseSchema[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!schemas || schemas.length === 0) {
    errors.push('At least one schema is required');
    return { isValid: false, errors };
  }

  schemas.forEach((schema, index) => {
    if (!schema.name) {
      errors.push(`Schema ${index + 1}: name is required`);
    }
    
    if (!schema.fields || schema.fields.length === 0) {
      errors.push(`Schema ${schema.name || index + 1}: fields are required`);
    } else {
      // Check for primary key
      const hasPrimaryKey = schema.fields.some(field => field.primary);
      if (!hasPrimaryKey) {
        errors.push(`Schema ${schema.name}: missing primary key field`);
      }
      
      // Validate field names
      schema.fields.forEach((field, fieldIndex) => {
        if (!field.name) {
          errors.push(`Schema ${schema.name}, field ${fieldIndex + 1}: name is required`);
        }
        if (!field.type) {
          errors.push(`Schema ${schema.name}, field ${field.name || fieldIndex + 1}: type is required`);
        }
      });
    }
    
    // Initialize empty arrays if not provided by AI
    if (!schema.indexes) {
      (schema as any).indexes = [];
    }
    if (!schema.constraints) {
      (schema as any).constraints = [];
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Helper function to validate generated endpoints
export function validateEndpoints(endpoints: APIEndpointGroup[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!endpoints || endpoints.length === 0) {
    errors.push('At least one endpoint group is required');
    return { isValid: false, errors };
  }

  endpoints.forEach((group, groupIndex) => {
    if (!group.group) {
      errors.push(`Endpoint group ${groupIndex + 1}: group name is required`);
    }
    
    if (!group.endpoints || group.endpoints.length === 0) {
      errors.push(`Endpoint group ${group.group || groupIndex + 1}: endpoints are required`);
    } else {
      group.endpoints.forEach((endpoint, endpointIndex) => {
        if (!endpoint.method) {
          errors.push(`Group ${group.group}, endpoint ${endpointIndex + 1}: method is required`);
        }
        if (!endpoint.path) {
          errors.push(`Group ${group.group}, endpoint ${endpointIndex + 1}: path is required`);
        }
        if (!endpoint.description) {
          errors.push(`Group ${group.group}, endpoint ${endpointIndex + 1}: description is required`);
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}