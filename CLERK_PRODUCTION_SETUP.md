# Clerk Production Authentication Setup

## What Changed

Your app now seamlessly switches between development and production authentication:

### Development Mode (NODE_ENV=development)
- Uses `devAuth` middleware
- Frontend sends `x-dev-user-id` header
- No DynamoDB users table interaction
- Perfect for local testing

### Production Mode (NODE_ENV=production)
- Uses `authenticateToken` middleware with Clerk
- Frontend sends Clerk JWT token via `Authorization: Bearer <token>`
- **Automatically creates users in DynamoDB** on first login
- Full Clerk authentication with secure JWT verification

---

## How It Works

### Backend Flow (Production)
```
1. User signs in via Clerk UI → Gets JWT token
2. Frontend sends API request with: Authorization: Bearer <clerk-jwt>
3. Backend middleware (authenticateToken):
   ├─ Verifies JWT with Clerk API
   ├─ Gets user details from Clerk
   ├─ Checks if user exists in snapinfra-users table
   ├─ Creates user in DynamoDB if missing
   └─ Attaches user to req.user
4. Route handler processes request with authenticated user
```

### Frontend Flow (Production)
```
1. AppProvider initializes → Calls useApiAuth()
2. useApiAuth() → Connects Clerk's getToken() to API client
3. Every API request:
   ├─ Calls getToken() to get fresh Clerk JWT
   ├─ Adds Authorization header with JWT
   └─ Sends request to backend
```

---

## Files Modified

### Backend
1. **src/routes/projects.ts**
   - Added environment-based auth selector
   - Uses `authenticateToken` in production, `devAuth` in development

2. **src/middleware/authMiddleware.ts** (already existed)
   - `authenticateToken`: Verifies Clerk JWT and syncs user to DynamoDB
   - `devAuth`: Mock auth for development

### Frontend
1. **lib/api-client.ts**
   - Added `setAuthTokenGetter()` function
   - Modified `apiRequest()` to use Clerk JWT in production
   - Falls back to `x-dev-user-id` in development

2. **hooks/useApiAuth.ts** (new file)
   - Connects Clerk's `getToken()` to API client
   - Called once in AppProvider

3. **lib/app-context.tsx**
   - Calls `useApiAuth()` to initialize authentication

---

## Environment Variables

Ensure these are set in your `.env` files:

### Backend (.env)
```bash
NODE_ENV=production  # or development
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
```

### Frontend (.env.local)
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NODE_ENV=production  # or development
```

---

## Testing Production Mode Locally

To test Clerk auth without deploying:

1. **Set environment to production:**
   ```bash
   # Backend
   NODE_ENV=production npm run dev
   
   # Frontend
   NODE_ENV=production npm run dev
   ```

2. **Sign in using Clerk:**
   - Go to `/sign-in` route
   - Sign in with test account
   - Check backend logs for user creation

3. **Verify DynamoDB:**
   ```bash
   aws dynamodb scan --table-name snapinfra-users --region us-east-1
   ```

You should see the user created automatically!

---

## User Table Population

The `snapinfra-users` table will automatically populate when:

1. ✅ User signs in via Clerk (production mode)
2. ✅ `authenticateToken` middleware runs
3. ✅ User doesn't exist in DynamoDB yet
4. ✅ Middleware creates user with Clerk data:
   - `id`: Clerk user ID
   - `email`: From Clerk account
   - `username`: From Clerk or generated
   - `firstName`, `lastName`: From Clerk profile

---

## Deployment Checklist

When deploying to production:

- [ ] Set `NODE_ENV=production` in environment
- [ ] Verify Clerk keys are in environment variables
- [ ] Ensure DynamoDB tables exist and are accessible
- [ ] Test sign-in flow works correctly
- [ ] Verify users table populates on first login
- [ ] Check backend logs for authentication events

---

## Rollback to Development Mode

If you need to go back to development mode:

1. Set `NODE_ENV=development` in both frontend and backend
2. Restart both services
3. App will automatically use `devAuth` and `x-dev-user-id`

---

## Security Notes

- JWT tokens are verified server-side with Clerk
- Tokens expire automatically (Clerk handles this)
- User sessions managed by Clerk
- DynamoDB stores user profiles only (no passwords)
- Development mode should NEVER be used in production

---

## Support

If you encounter issues:
1. Check backend logs for authentication errors
2. Verify Clerk dashboard shows test users
3. Confirm environment variables are set correctly
4. Test with Clerk's debug mode in development first
