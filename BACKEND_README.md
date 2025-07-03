# CircuitDreamsStudios Backend System

A complete MongoDB-powered backend system with JWT authentication and role-based access control.

## 🚀 Setup Instructions

### 1. Environment Configuration

1. Copy `.env.example` to `.env`
2. Configure your MongoDB Atlas connection:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=circuitdreamsstudios
   ```
3. Set a strong JWT secret (minimum 32 characters):
   ```
   JWT_SECRET=your-super-secret-jwt-key-here-min-32-characters
   ```

### 2. MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user with read/write permissions
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get the connection string and update `MONGODB_URI`

### 3. CEO Account Setup (One-time)

Make a POST request to create the CEO account:

```bash
curl -X POST https://your-domain.com/api/auth?action=setup-ceo \
  -H "Content-Type: application/json"
```

This creates the CEO account with:

- Email: `AlexDowling@circuitdreamsstudios.com`
- Password: `Hz3492k5$!`
- Role: `CEO`
- Position: `Chief Executive Officer`

## 📡 API Endpoints

### Authentication

#### Login

```bash
POST /api/auth?action=login
Content-Type: application/json

{
  "email": "user@circuitdreamsstudios.com",
  "password": "password"
}
```

Response:

```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@circuitdreamsstudios.com",
    "role": "Employee",
    "position": "Software Developer",
    "isAdmin": false
  }
}
```

#### Get Current User

```bash
GET /api/auth?action=me
Authorization: Bearer jwt-token-here
```

#### Register New User (CEO/Admin only)

```bash
POST /api/auth?action=register
Authorization: Bearer jwt-token-here
Content-Type: application/json

{
  "name": "Jamie Watts",
  "email": "jamie@circuitdreamsstudios.com",
  "password": "secure-password",
  "role": "Employee",
  "position": "Lead Environment Artist"
}
```

### User Management

#### List All Users

```bash
GET /api/users
Authorization: Bearer jwt-token-here
```

#### Get Specific User

```bash
GET /api/users?id=user-id
Authorization: Bearer jwt-token-here
```

#### Create User (Alternative endpoint)

```bash
POST /api/users
Authorization: Bearer jwt-token-here
Content-Type: application/json

{
  "name": "New Employee",
  "email": "employee@circuitdreamsstudios.com",
  "password": "secure-password",
  "role": "Employee",
  "position": "Junior Developer"
}
```

#### Update User (CEO/Admin only)

```bash
PUT /api/users?id=user-id
Authorization: Bearer jwt-token-here
Content-Type: application/json

{
  "name": "Updated Name",
  "position": "Senior Developer",
  "role": "TeamLead"
}
```

#### Delete User (CEO only)

```bash
DELETE /api/users?id=user-id
Authorization: Bearer jwt-token-here
```

## 🔐 Role Permissions

### CEO

- Can create, update, and delete any user
- Can promote users to Admin level
- Full system access

### Admin

- Can create TeamLead and Employee accounts
- Can view and manage all users except other Admins
- Cannot create other Admin accounts

### TeamLead

- Can create Employee accounts
- Can view users they created and other Employees
- Limited management capabilities

### Employee

- Can only access their own profile
- No user management capabilities

## 🗃️ Data Structure

### User Schema

```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string, // bcrypt hashed
  role: "CEO" | "Admin" | "TeamLead" | "Employee",
  position: string, // e.g., "Head of Development"
  isAdmin: boolean,
  createdAt: Date,
  createdBy: string, // email of creator
  updatedAt?: Date,
  updatedBy?: string
}
```

## 🧪 Testing with Postman/curl

### 1. Setup CEO Account

```bash
curl -X POST https://your-domain.com/api/auth?action=setup-ceo
```

### 2. Login as CEO

```bash
curl -X POST https://your-domain.com/api/auth?action=login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "AlexDowling@circuitdreamsstudios.com",
    "password": "Hz3492k5$!"
  }'
```

### 3. Create a Staff Member

```bash
curl -X POST https://your-domain.com/api/auth?action=register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Jamie Watts",
    "email": "jamie@circuitdreamsstudios.com",
    "password": "StrongPass123!",
    "role": "Admin",
    "position": "Head of Development"
  }'
```

### 4. List All Users

```bash
curl -X GET https://your-domain.com/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🛡️ Security Features

- **Password Hashing**: Uses bcrypt with 12 salt rounds
- **JWT Authentication**: 8-hour token expiration
- **Role-based Access Control**: Strict permission system
- **Environment-based Secrets**: All sensitive data in environment variables
- **Input Validation**: Comprehensive validation on all endpoints
- **CORS Support**: Proper CORS headers for frontend integration

## 🔗 Frontend Integration

The API is designed to work seamlessly with React frontends. Example usage:

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch("/api/auth?action=login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  localStorage.setItem("token", data.token);
  return data.user;
};

// Get current user
const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/auth?action=me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

// Create new employee
const createEmployee = async (userData) => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};
```

## 📋 Available Custom Positions

The system supports any custom position string, including:

- Co-Founder
- Head of Development
- Head of Community
- Lead Writer
- Lead Programmer
- Lead Environment Artist
- Head of Lore
- Senior Developer
- Junior Developer
- Marketing Manager
- Project Manager
- UI/UX Designer
- And any other custom title you need!

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200`: Success
- `201`: Created
- `400`: Bad Request (missing/invalid data)
- `401`: Unauthorized (invalid/missing token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `405`: Method Not Allowed
- `500`: Internal Server Error
