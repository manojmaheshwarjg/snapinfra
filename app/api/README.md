# Dynamic Mock API System

This directory contains the dynamic mock API system that powers the onboarding flow API testing.

## How It Works

### 1. Catch-All Route (`[...path]/route.ts`)

The catch-all route handles ALL API requests during onboarding testing. It:

- **Dynamically generates mock data** based on field names and types
- **Maintains in-memory state** across requests in the same session
- **Simulates realistic network delays** (300-400ms)
- **Supports all HTTP methods**: GET, POST, PUT, PATCH, DELETE

### 2. Smart Data Generation

The system intelligently generates mock data by analyzing field names and types:

#### Field Name-Based Generation
- `email` → `user123@example.com`
- `name`, `title` → Realistic names/titles from predefined lists
- `username` → `user5847`
- `content`, `description` → Sample text content
- `url`, `link`, `website` → `https://example.com/abc123`
- `image`, `photo`, `avatar` → Picsum image URLs
- `phone` → `+1-555-123-4567`
- `address` → `123 Main Street, City, State 12345`
- `price`, `amount`, `cost` → `123.45`
- `status` → `active`, `pending`, `completed`, etc.
- `is*`, `has*`, `enabled` → Boolean values

#### Type-Based Generation
- `string`, `text` → `"Sample FieldName"`
- `number`, `integer` → Random number (0-1000)
- `float`, `decimal` → Random decimal (0.00-1000.00)
- `boolean` → `true` or `false`
- `date`, `datetime`, `timestamp` → ISO 8601 timestamps
- `json`, `object` → `{ data: "sample" }`
- `array` → `["item1", "item2", "item3"]`

### 3. Resource Management

#### List Endpoints
```
GET /api/users
→ Returns array of 5 users with realistic data
```

#### Single Resource
```
GET /api/users/1
→ Returns user with id "1"
```

#### Create Resource
```
POST /api/users
Body: { "name": "John Doe", "email": "john@example.com" }
→ Creates new user, adds to in-memory database
```

#### Update Resource
```
PUT /api/users/1
Body: { "name": "Jane Doe" }
→ Updates user 1, merges with existing data
```

#### Delete Resource
```
DELETE /api/users/1
→ Removes user 1 from in-memory database
```

## Special Endpoints

### Authentication

#### Login
```
POST /api/auth/login
Body: { "email": "user@example.com", "password": "pass123" }

Response:
{
  "token": "mock-jwt-token-1234567890",
  "user": {
    "id": "1",
    "email": "user@example.com",
    "name": "Demo User",
    "username": "demo_user"
  },
  "expiresIn": 3600,
  "message": "Login successful"
}
```

#### Register
```
POST /api/auth/register
Body: { "email": "new@example.com", "name": "New User", "username": "newuser" }

Response:
{
  "id": "1234567890",
  "email": "new@example.com",
  "name": "New User",
  "username": "newuser",
  "createdAt": "2025-10-27T19:24:17.000Z"
}
```

#### Current User
```
GET /api/auth/me

Response:
{
  "id": "1",
  "email": "demo@example.com",
  "name": "Demo User",
  "username": "demo_user",
  "createdAt": "2025-10-27T19:24:17.000Z"
}
```

## Initialization Endpoint

### Check Status
```
GET /api/mock/init

Response:
{
  "message": "Mock API system ready",
  "status": "active",
  "note": "Data is generated dynamically based on endpoint requests"
}
```

### Initialize with Schemas (Optional)
```
POST /api/mock/init
Body: {
  "schemas": [
    {
      "name": "users",
      "fields": [
        { "name": "id", "type": "string", "isPrimary": true },
        { "name": "email", "type": "string", "isRequired": true },
        { "name": "name", "type": "string" }
      ]
    }
  ]
}

Response:
{
  "message": "Mock database initialized with schemas",
  "schemasReceived": 1,
  "tables": ["users"],
  "note": "Mock data will be generated dynamically as endpoints are called"
}
```

## Features

✅ **Realistic Data**: Field names determine data format  
✅ **Persistent State**: In-memory database persists during session  
✅ **Network Simulation**: Realistic delays (300-400ms)  
✅ **Full CRUD**: Create, Read, Update, Delete operations  
✅ **Lazy Loading**: Data generated only when requested  
✅ **No Database Required**: Perfect for onboarding testing  

## Use Cases

1. **Onboarding Flow** - Test APIs without backend infrastructure
2. **Frontend Development** - Work on UI before backend is ready
3. **Demo/Presentation** - Show working APIs with realistic data
4. **Testing** - Unit/integration tests without external dependencies

## Limitations

- **Session-Based**: Data resets when server restarts
- **Single User**: No multi-user isolation
- **Basic Validation**: No complex business logic validation
- **No Persistence**: Data not saved to actual database

## Future Enhancements

- [ ] Schema-aware generation based on uploaded schemas
- [ ] Configurable data generation rules
- [ ] Export/import mock data sets
- [ ] Relationships between resources
- [ ] Query parameters support (pagination, filtering, sorting)
- [ ] WebSocket support for real-time features
