# Quick Start Guide - Dynamic Mock API

## 🚀 Get Started in 3 Steps

### Step 1: Start the Server
```bash
npm run dev
```
Server will start at `http://localhost:3001`

### Step 2: Test the Onboarding Flow
1. Open browser: `http://localhost:3001/onboarding`
2. Complete Step 1: Describe your project (e.g., "a social media app")
3. Review Step 2: Check the generated database schema
4. Test Step 3: **This is where the magic happens!**
   - Select any endpoint (e.g., `POST /auth/login`)
   - Click "Send Test Request"
   - Watch realistic mock data appear! ✨

### Step 3: Explore the APIs Directly
Test endpoints manually with curl or fetch:

```bash
# Check system status
curl http://localhost:3001/api/mock/init

# Get list of users (auto-generated)
curl http://localhost:3001/api/users

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Create a new post
curl -X POST http://localhost:3001/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My Post","content":"Hello world","userId":"1"}'
```

## 📊 Run Automated Tests

```bash
node test-mock-api.js
```

This runs 13 tests covering all CRUD operations and auth flows.

## 🎯 What You'll See

**Real Mock Data:**
```json
{
  "id": "1",
  "email": "user427@example.com",
  "name": "Alice Johnson",
  "username": "user8234",
  "createdAt": "2025-10-27T19:24:17.000Z"
}
```

**Not Generic Test Data:**
```json
{
  "id": "1",
  "email": "test@test.com",
  "name": "Test User"
}
```

## 🔧 How It Works

```
User Action in Step 3
       ↓
Click "Send Test Request"
       ↓
POST /api/auth/login
       ↓
Next.js Catch-All Route
       ↓
Check: Does "auth/login" exist?
       ↓
No → Generate mock login response
       ↓
Return realistic data
       ↓
Display in UI ✨
```

## 🎨 Key Features

✅ **Works with ANY endpoint** - No hardcoding  
✅ **Realistic data** - Emails look like emails, names like names  
✅ **Persistent state** - Create/update/delete works across requests  
✅ **Zero setup** - No database, no config files  
✅ **Full CRUD** - All HTTP methods supported  
✅ **Smart generation** - Field names determine data types  

## 📁 Project Structure

```
app/
  api/
    [...path]/
      route.ts          # Main catch-all handler
    mock/
      init/
        route.ts        # System initialization
    README.md           # Full documentation

components/
  onboarding/
    step-three.tsx      # API testing UI

test-mock-api.js        # Automated tests
DYNAMIC_MOCK_API.md     # Complete implementation guide
QUICK_START.md          # This file
```

## 💡 Pro Tips

1. **Test Different Resources**: Try `/api/products`, `/api/orders`, `/api/comments` - all work!
2. **CRUD Operations**: Create items, then list them again to see persistence
3. **Network Delays**: Notice the realistic 300-400ms delays
4. **Error Handling**: Try getting a non-existent ID (e.g., `/api/users/999`)

## 🐛 Troubleshooting

**Port Already in Use?**
- Server automatically finds available port (3001, 3002, etc.)
- Check terminal output for actual port

**404 Errors?**
- Make sure server is running: `npm run dev`
- Check you're using the correct port in URLs

**Data Not Persisting?**
- In-memory data resets when server restarts (this is by design)
- Data persists during the same session

## 🎓 Learn More

- **Full Documentation**: See `app/api/README.md`
- **Implementation Details**: See `DYNAMIC_MOCK_API.md`
- **Test Examples**: Check `test-mock-api.js`

## 📞 Support

Issues? Questions?
1. Check the console for error messages
2. Review the documentation files
3. Test with `node test-mock-api.js`

---

**Ready to test? Start here:** `http://localhost:3001/onboarding` 🚀
