# Schema-Aware Mock API System 

## Overview

This is a **production-ready, industry-standard** mock API system that:
- ✅ **Reads actual schemas from Step 1** - No generic data!
- ✅ **Generates data based on field types** - Realistic and accurate
- ✅ **Works in serverless deployments** - Client-side, no backend needed
- ✅ **Follows industry practices** - Similar to MSW/Mirage JS patterns

## How It Works

### 1. Step 1: User Describes Project
```
User: "Build a social media app with users, posts, and comments"
      ↓
AI generates:
  - schemas (Users table: id, email, username, bio, avatar...)
  - endpoints (GET /users, POST /posts, etc.)
```

### 2. Schemas Saved to localStorage
```javascript
{
  "schemas": [
    {
      "name": "users",
      "fields": [
        { "name": "id", "type": "string", "isPrimary": true },
        { "name": "email", "type": "string" },
        { "name": "username", "type": "string" },
        { "name": "bio", "type": "text" },
        { "name": "avatar", "type": "string" }
      ]
    }
  ]
}
```

### 3. Step 3: Schema-Aware Mock API Initializes
```javascript
// Reads schemas from localStorage
clientMockAPI.initializeWithSchemas(schemas, endpoints)
  ↓
SchemaAwareMockGenerator analyzes fields:
  - "email" field → generates user123@example.com
  - "username" field → generates cool_user4567
  - "bio" field → generates descriptive text
  - "avatar" field → generates https://picsum.photos/...
```

### 4. User Tests API
```
User clicks: "Test POST /users"
      ↓
mockFetch() intercepts request
      ↓
Schema-aware generator creates user with:
  - email: "user789@example.com" (not "test@test.com")
  - username: "epic_user2341" (not "testuser")
  - bio: "Passionate developer..." (not "Sample bio")
  - avatar: "https://picsum.photos/seed/xyz/400/300"
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│  Step 1: AI Generation                          │
│  ┌──────────────────────────────────────┐       │
│  │ Generate schemas based on user input │       │
│  │ Generate endpoints                   │       │
│  └──────────┬───────────────────────────┘       │
│             │                                    │
│             ▼                                    │
│  ┌──────────────────────────────────────┐       │
│  │ Save to localStorage                 │       │
│  └──────────┬───────────────────────────┘       │
└─────────────┼────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────┐
│  Step 3: API Testing                            │
│                                                  │
│  ┌──────────────────────────────────────┐       │
│  │ Read schemas from localStorage       │       │
│  └──────────┬───────────────────────────┘       │
│             │                                    │
│             ▼                                    │
│  ┌──────────────────────────────────────┐       │
│  │ Initialize SchemaAwareMockGenerator  │       │
│  │ - Parse field types                  │       │
│  │ - Create generation rules            │       │
│  └──────────┬───────────────────────────┘       │
│             │                                    │
│             ▼                                    │
│  ┌──────────────────────────────────────┐       │
│  │ User clicks "Test Endpoint"          │       │
│  └──────────┬───────────────────────────┘       │
│             │                                    │
│             ▼                                    │
│  ┌──────────────────────────────────────┐       │
│  │ mockFetch() intercepts request       │       │
│  └──────────┬───────────────────────────┘       │
│             │                                    │
│             ▼                                    │
│  ┌──────────────────────────────────────┐       │
│  │ Generate data based on schema:       │       │
│  │ - email field → realistic email      │       │
│  │ - username → creative username       │       │
│  │ - bio → descriptive paragraph        │       │
│  │ - avatar → image URL                 │       │
│  │ - createdAt → ISO timestamp          │       │
│  └──────────┬───────────────────────────┘       │
│             │                                    │
│             ▼                                    │
│  ┌──────────────────────────────────────┐       │
│  │ Return realistic mock response       │       │
│  └──────────────────────────────────────┘       │
└─────────────────────────────────────────────────┘
```

## Key Files

### 1. `lib/schema-aware-mock.ts`
The core mock data generator:

```typescript
class SchemaAwareMockGenerator {
  // Analyzes field name and type to generate appropriate data
  private generateValueForField(field: FieldSchema): any {
    const fieldName = field.name.toLowerCase()
    const fieldType = field.type.toLowerCase()
    
    // Smart field name detection
    if (fieldName.includes('email')) {
      return `user${random}@example.com`
    }
    if (fieldName.includes('username')) {
      return `${prefix}_user${random}`
    }
    if (fieldName.includes('bio')) {
      return 'Descriptive paragraph...'
    }
    
    // Type-based generation
    switch (fieldType) {
      case 'string': return `Sample ${field.name}`
      case 'integer': return random number
      case 'boolean': return true/false
      // ... 20+ more patterns
    }
  }
}
```

### 2. `lib/mock-api-client.ts`
Client-side API interceptor:

```typescript
class ClientMockAPI {
  // Initialize with schemas from Step 1
  initializeWithSchemas(schemas, endpoints) {
    this.mockGenerator = new SchemaAwareMockGenerator(schemas, endpoints)
  }
  
  // Intercept fetch requests
  async mockFetch(url, options) {
    const method = options.method || 'GET'
    const resource = extractResourceFromURL(url)
    
    if (method === 'GET') {
      // Use schema-aware generator
      return this.mockGenerator.getAll(resource)
    }
    
    if (method === 'POST') {
      // Create with schema-aware defaults
      return this.mockGenerator.create(resource, body)
    }
    
    // ... handle PUT, DELETE
  }
}
```

### 3. `components/onboarding/step-three.tsx`
Initializes mock API with schemas:

```typescript
useEffect(() => {
  if (data?.schemas && data?.endpoints) {
    console.log('🔧 Initializing schema-aware mock API...')
    clientMockAPI.initializeWithSchemas(data.schemas, flatEndpoints)
  }
}, [data])

// All fetch requests now use schema-aware mocking
const response = await mockFetch('/api/users')
```

## Smart Field Detection

The system recognizes **50+ field patterns**:

| Field Name | Generated Data |
|------------|----------------|
| `email` | `user789@example.com` |
| `username` | `cool_user4567` |
| `firstName` | `Alice` |
| `lastName` | `Johnson` |
| `fullName` | `Alice Johnson` |
| `bio` | Realistic paragraph |
| `description` | Descriptive text |
| `title` | `Getting Started` |
| `content` | Long-form content |
| `avatar` | `https://picsum.photos/...` |
| `image` | `https://picsum.photos/...` |
| `url` | `https://example.com/abc123` |
| `phone` | `+1-555-123-4567` |
| `address` | `123 Main St, City, CA` |
| `city` | `New York` |
| `country` | `United States` |
| `zipCode` | `94102` |
| `price` | `499.99` |
| `amount` | `1234.56` |
| `rating` | `4.5` |
| `status` | `active` / `pending` |
| `category` | `Technology` |
| `color` | `blue` |
| `age` | `28` |
| `count` | `42` |
| `createdAt` | `2025-10-27T19:30:00Z` |
| `updatedAt` | `2025-10-27T19:45:00Z` |

## Type-Based Generation

When field name doesn't match patterns, falls back to type:

| Field Type | Generated Data |
|------------|----------------|
| `string` | `"Sample FieldName"` |
| `integer` | `742` |
| `float` | `123.45` |
| `boolean` | `true` / `false` |
| `date` | `2025-10-15` |
| `datetime` | `2025-10-27T19:30:00Z` |
| `json` | `{ data: 'sample' }` |
| `array` | `['item1', 'item2']` |
| `uuid` | `1730059200-abc123def` |

## Example: Social Media App

### Step 1 Generates:
```javascript
{
  "schemas": [
    {
      "name": "users",
      "fields": [
        { "name": "id", "type": "string", "isPrimary": true },
        { "name": "email", "type": "string" },
        { "name": "username", "type": "string" },
        { "name": "bio", "type": "text" },
        { "name": "avatar", "type": "string" },
        { "name": "followerCount", "type": "integer" },
        { "name": "isVerified", "type": "boolean" },
        { "name": "createdAt", "type": "datetime" }
      ]
    }
  ]
}
```

### Step 3 Generates:
```javascript
GET /api/users
{
  "data": [
    {
      "id": "1",
      "email": "user427@example.com",
      "username": "epic_user8234",
      "bio": "Passionate developer who loves to code and create amazing things.",
      "avatar": "https://picsum.photos/seed/abc123/400/300",
      "followerCount": 742,
      "isVerified": true,
      "createdAt": "2025-10-15T08:30:00.000Z"
    }
  ],
  "message": "Schema-aware mock data (based on your Step 1 design)"
}
```

## Benefits

### 1. Realistic Testing Experience
❌ Before: Generic data like `"test@test.com"`, `"testuser"`  
✅ After: Realistic data that looks production-ready

### 2. Accurate Schema Representation
❌ Before: Random fields, doesn't match design  
✅ After: Exact fields from Step 1 with proper types

### 3. Serverless-Ready
✅ Runs entirely in browser  
✅ No backend needed  
✅ Works on Vercel/Netlify/static hosts  

### 4. Developer Experience
✅ Console logs show initialization  
✅ Clear which schemas are loaded  
✅ Easy debugging with `getMockGenerator().getDatabase()`

## Comparison with Industry Tools

| Feature | MSW | Mirage JS | Our System |
|---------|-----|-----------|------------|
| Client-side | ✅ | ✅ | ✅ |
| Schema-aware | ❌ Manual | ❌ Manual | ✅ Automatic |
| Setup complexity | Medium | Medium | Low |
| Serverless | ✅ | ✅ | ✅ |
| Dynamic from AI | ❌ | ❌ | ✅ |
| Type-safe | ✅ | ❌ | ✅ |

## Testing

### Check Current Schemas:
```javascript
// In browser console on Step 3
const generator = getMockGenerator()
console.log(generator.getSchemas())
console.log(generator.getDatabase())
```

### Verify Mock Data:
```javascript
// Test an endpoint
await mockFetch('/api/users')

// Check what was generated
const users = getMockGenerator().getAll('users')
console.log(users)
```

## Deployment

Works perfectly in production:

```bash
npm run build
vercel deploy
```

- Step 1: AI generation → Serverless function ✓
- Step 2: Schema review → Static page ✓
- **Step 3: API testing → Browser-based mocking ✓**
- Step 4-5: Static pages ✓

## Future Enhancements

Potential improvements:
- [ ] Add MSW for service worker interception
- [ ] Support relationships (foreign keys)
- [ ] Add query parameters (filtering, pagination)
- [ ] Export mock data as JSON
- [ ] Import custom mock data sets
- [ ] GraphQL support

## Summary

**Problem:** Generic mock data doesn't reflect user's actual design  
**Solution:** Read schemas from Step 1, generate data based on field types  
**Result:** Realistic, schema-aware mock API that works in serverless! 🎉

The API testing now shows exactly what the user designed in Step 1, making the onboarding experience far more impressive and accurate!
