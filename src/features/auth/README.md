# Auth Feature Documentation

## Overview

The auth feature provides a complete authentication system with Firebase integration and role-based access control. The system supports three user roles:

- **Student**: Can take tests but cannot create them
- **Educator**: Can create and take tests
- **Admin**: Full system access

## Architecture

The auth feature follows a modular, feature-based architecture:

```
src/features/auth/
├── components/           # React components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ProtectedRoute.tsx
├── contexts/             # Context definitions
│   └── AuthContext.tsx
├── hooks/                # Custom React hooks
│   └── useAuth.ts
├── providers/            # Context providers
│   └── AuthProvider.tsx
├── services/             # Business logic services
│   └── authService.ts
├── types/                # TypeScript types
│   └── index.ts
└── index.ts              # Public exports
```

## Usage Guide

### 1. Setup (Already Done)

The `AuthProviderComponent` is already wrapped around the app in `src/app/layout.tsx`.

### 2. Using the `useAuth` Hook

Access authentication state and methods anywhere in your component:

```tsx
"use client";

import { useAuth } from "@/features/auth";

export function MyComponent() {
  const { user, loading, login, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <div>Please log in</div>;

  return (
    <div>
      <p>Welcome, {user.displayName}</p>
      <p>Role: {user.role}</p>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}
```

### 3. Protecting Routes

Wrap components with `ProtectedRoute` to ensure authentication:

```tsx
import { ProtectedRoute } from "@/features/auth";

export default function TestCreationPage() {
  return (
    <ProtectedRoute requiredRole="educator">
      <div>Only educators can see this</div>
    </ProtectedRoute>
  );
}
```

### 4. Role-Based Protection

Protect specific roles:

```tsx
// Single role
<ProtectedRoute requiredRole="educator">
  <CreateTestForm />
</ProtectedRoute>

// Multiple roles
<ProtectedRoute requiredRole={["educator", "admin"]}>
  <ManageContent />
</ProtectedRoute>
```

### 5. Authentication Methods

#### Login
```tsx
const { login } = useAuth();

try {
  await login("user@example.com", "password");
  // User is now logged in
} catch (error) {
  console.error(error);
}
```

#### Register
```tsx
const { register } = useAuth();

try {
  await register(
    "user@example.com",
    "password",
    "John Doe",
    "educator"
  );
  // User is now registered and logged in
} catch (error) {
  console.error(error);
}
```

#### Logout
```tsx
const { logout } = useAuth();

try {
  await logout();
  // User is now logged out
} catch (error) {
  console.error(error);
}
```

#### Update User Role
```tsx
const { updateUserRole } = useAuth();

try {
  await updateUserRole("educator");
  // User role is now updated
} catch (error) {
  console.error(error);
}
```

## API Endpoints

### Auth Context Properties

```tsx
interface AuthContextType {
  user: AuthUser | null;              // Current user data
  loading: boolean;                   // Loading state
  error: string | null;               // Error message
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUserRole: (role: UserRole) => Promise<void>;
}
```

### User Object

```tsx
interface AuthUser {
  uid: string;                        // Firebase UID
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;                     // "admin" | "educator" | "student"
  createdAt: Date;
}
```

## Firebase Configuration

The Firebase config is stored in `src/lib/firebase.ts`. It includes:

- Firebase Authentication
- Firestore Database (for user data storage)

User data is stored in the `users` collection in Firestore with the following structure:

```
users/
  {uid}/
    uid: string
    email: string
    displayName: string
    photoURL: string | null
    role: UserRole
    createdAt: Date
```

## Key Features

✅ **Complete Authentication Flow**
- Login, Register, Logout

✅ **Role-Based Access Control**
- Three role types (Student, Educator, Admin)
- Protected routes with role validation

✅ **Persistent User State**
- User data persists across page refreshes via Firebase
- Automatic sync with Firestore

✅ **Error Handling**
- Comprehensive error messages
- Error state management

✅ **Type Safety**
- Full TypeScript support
- Type definitions for all interfaces

✅ **Modular Architecture**
- Clean separation of concerns
- Easy to extend and maintain

## Common Patterns

### Show Different UI Based on Role

```tsx
const { user } = useAuth();

return (
  <div>
    {user?.role === "educator" && (
      <CreateTestButton />
    )}
    {(user?.role === "educator" || user?.role === "student") && (
      <TakeTestButton />
    )}
  </div>
);
```

### Conditional Rendering Based on Auth State

```tsx
const { user, loading } = useAuth();

if (loading) return <LoadingSpinner />;
if (!user) return <LoginPrompt />;

return <Dashboard />;
```

### Protect API Calls

```tsx
const { user } = useAuth();

const handleCreateTest = async (testData: any) => {
  if (user?.role !== "educator") {
    throw new Error("Only educators can create tests");
  }
  // Create test
};
```

## Pages Created

- `/auth/login` - Login page
- `/auth/register` - Registration page  
- `/dashboard` - Protected dashboard showing user info
- `/unauthorized` - 403 page for insufficient permissions

## Next Steps

To integrate this with your test generation feature:

1. **Protect test creation page:**
   ```tsx
   <ProtectedRoute requiredRole="educator">
     <TestGenerationWorkbench />
   </ProtectedRoute>
   ```

2. **Add role check in test taking:**
   ```tsx
   <ProtectedRoute requiredRole={["educator", "student"]}>
     <TakeTestPage />
   </ProtectedRoute>
   ```

3. **Store test metadata with creator info:**
   ```tsx
   const { user } = useAuth();
   const testData = {
     ...test,
     createdBy: user?.uid,
     createdByName: user?.displayName
   };
   ```

## Troubleshooting

### "useAuth must be used within an AuthProviderComponent"

Make sure the component is rendered within the app (after `layout.tsx` wraps it).

### User data not persisting

Check Firestore permissions and ensure the `users` collection exists and is accessible.

### Role not updating

Verify the role is a valid type: `"admin" | "educator" | "student"`

## Support

For issues or questions, refer to the Firebase documentation:
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Cloud Firestore](https://firebase.google.com/docs/firestore)
