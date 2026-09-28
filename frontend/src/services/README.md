# API Client Service

## Overview

The API client (`api.js`) is a configured Axios instance that handles all HTTP communication with the FastAPI backend.

## Configuration

### Base Settings
- **Base URL**: Loaded from `VITE_API_BASE_URL` environment variable
- **Timeout**: 30 seconds (30000ms)
- **Default Headers**: `Content-Type: application/json`

### Request Interceptor

Automatically adds JWT token to all requests:
- Reads token from `localStorage.getItem('auth_token')`
- Adds `Authorization: Bearer <token>` header when token exists

### Response Interceptor

Handles errors globally with user-friendly messages:

#### 401 Unauthorized
- Clears authentication data (`auth_token`, `auth_user` from localStorage)
- Redirects to `/login` with return URL
- Prevents multiple simultaneous redirects

#### 403 Forbidden
- Shows toast: "You do not have permission to access this resource."

#### 422 Unprocessable Entity (Validation Errors)
- Parses FastAPI validation errors
- Attaches structured `validationErrors` object to error
- Format: `{ field: 'error message' }`

#### 500-504 Server Errors
- 500: "An error occurred on the server. Please try again later."
- 502: "Bad gateway. The server is temporarily unavailable."
- 503: "Service temporarily unavailable. Please try again later."
- 504: "Gateway timeout. The server is taking too long to respond."

#### Network Errors
- Shows toast: "Unable to connect to the server. Please check your connection."

## Usage

```javascript
import apiClient from '@/services/api.js'

// GET request
const response = await apiClient.get('/movies')

// POST request with data
const response = await apiClient.post('/auth/login', {
  correo: 'user@example.com',
  contrasena: 'password'
})

// PUT request
const response = await apiClient.put('/movies/1', movieData)

// DELETE request
const response = await apiClient.delete('/movies/1')
```

## Error Handling

### Validation Errors (422)
```javascript
try {
  await apiClient.post('/movies', movieData)
} catch (error) {
  if (error.validationErrors) {
    // Display field-specific errors
    console.log(error.validationErrors.titulo) // "Title is required"
  }
}
```

### General Errors
Most errors are handled automatically by the interceptor and show toast notifications. However, you can still catch them for custom handling:

```javascript
try {
  await apiClient.get('/movies')
} catch (error) {
  // Custom error handling if needed
  // Toast notification already shown by interceptor
}
```

## Toast Integration

The API client uses a global toast store for notifications. The toast store should register itself as `window.__TOAST_STORE__` with a `show(message, type)` method.

If the toast store is not available, errors are logged to console.

## Requirements Fulfilled

- ✅ 9.1: Base URL from environment variables
- ✅ 9.2: JWT token in Authorization header
- ✅ 9.3: Auto-logout and redirect on 401
- ✅ 9.4: Permission denied message on 403
- ✅ 9.5: Structured validation errors on 422
- ✅ 9.6: Generic error message on 500
- ✅ 9.7: Connection error message on network failure
- ✅ 9.8: Loading state in UI (handled by components)
- ✅ 9.9: Proper headers (Content-Type: application/json)
- ✅ 9.10: Multiple redirect prevention
