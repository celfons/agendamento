# API Documentation - Authentication & Event Registration

## Overview

This document describes the authentication, user management, group management, and event registration features of the agendamento API.

## Authentication

### Register a New User

**Endpoint:** `POST /api/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Optional role:** Add `"role": "admin"` or `"role": "organizer"` (defaults to `"user"`)

**Response:**
```json
{
  "id": "userId123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "groups": [],
  "createdAt": "2026-01-05T15:00:00.000Z",
  "updatedAt": "2026-01-05T15:00:00.000Z"
}
```

### Login

**Endpoint:** `POST /api/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "userId123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Usage:** Include the token in the `Authorization` header for protected endpoints:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## User Roles

- **user**: Can register for public events, view events
- **organizer**: Can create, update, delete events, create groups
- **admin**: Full access to all features

## Events API

### List All Events (Public)

**Endpoint:** `GET /api/events`

**Authentication:** Not required

**Response:**
```json
[
  {
    "id": "eventId123",
    "name": "Workshop de Node.js",
    "description": "Workshop prático sobre desenvolvimento backend",
    "date": "2026-12-20T14:00:00.000Z",
    "location": "São Paulo, SP",
    "maxParticipants": 50,
    "availableSlots": 45,
    "organizers": ["John Doe"],
    "isPublic": true,
    "createdAt": "2026-01-05T15:00:00.000Z",
    "updatedAt": "2026-01-05T15:00:00.000Z"
  }
]
```

### Get Event by ID (Public)

**Endpoint:** `GET /api/events/:id`

**Authentication:** Not required

### Create Event (Protected)

**Endpoint:** `POST /api/events`

**Authentication:** Required (admin or organizer role)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Workshop de Node.js",
  "description": "Workshop prático sobre desenvolvimento backend",
  "date": "2026-12-20T14:00:00",
  "location": "São Paulo, SP",
  "maxParticipants": 50,
  "availableSlots": 50,
  "organizers": ["John Doe"],
  "isPublic": true
}
```

### Update Event (Protected)

**Endpoint:** `PUT /api/events/:id`

**Authentication:** Required (admin or organizer role)

### Delete Event (Protected)

**Endpoint:** `DELETE /api/events/:id`

**Authentication:** Required (admin or organizer role)

## Event Registration

### Register for an Event

**Endpoint:** `POST /api/registrations/events/:eventId`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": "registrationId123",
  "eventId": "eventId123",
  "userId": "userId123",
  "status": "confirmed",
  "registeredAt": "2026-01-05T15:00:00.000Z",
  "updatedAt": "2026-01-05T15:00:00.000Z"
}
```

**Notes:**
- Event must be public (`isPublic: true`)
- Event must have available slots
- User can only register once per event

### Unregister from an Event

**Endpoint:** `DELETE /api/registrations/events/:eventId`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `204 No Content`

### List My Registrations

**Endpoint:** `GET /api/registrations/my-registrations`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "registrationId123",
    "eventId": "eventId123",
    "userId": "userId123",
    "status": "confirmed",
    "registeredAt": "2026-01-05T15:00:00.000Z",
    "updatedAt": "2026-01-05T15:00:00.000Z"
  }
]
```

### List Event Registrations

**Endpoint:** `GET /api/registrations/events/:eventId`

**Authentication:** Required

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** Array of registrations for the specified event

## Groups API

### Create a Group

**Endpoint:** `POST /api/groups`

**Authentication:** Required (admin or organizer role)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Node.js Organizers",
  "description": "Group of Node.js event organizers",
  "members": [],
  "admins": []
}
```

**Response:**
```json
{
  "id": "groupId123",
  "name": "Node.js Organizers",
  "description": "Group of Node.js event organizers",
  "members": ["userId123"],
  "admins": ["userId123"],
  "createdBy": "userId123",
  "createdAt": "2026-01-05T15:00:00.000Z",
  "updatedAt": "2026-01-05T15:00:00.000Z"
}
```

**Notes:**
- Creator is automatically added as member and admin

### List All Groups

**Endpoint:** `GET /api/groups`

**Authentication:** Required

**Query Parameters:**
- `userId` (optional): Filter groups by member

### Add Member to Group

**Endpoint:** `POST /api/groups/:groupId/members`

**Authentication:** Required (must be group admin)

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "userIdToAdd"
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Error message describing what went wrong"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```
or
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

## Example Workflows

### 1. External User Registers for an Event

1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login` (get token)
3. View events: `GET /api/events`
4. Register for event: `POST /api/registrations/events/:eventId` (with token)
5. View my registrations: `GET /api/registrations/my-registrations` (with token)

### 2. Admin Creates and Manages Events

1. Register as admin: `POST /api/auth/register` with `"role": "admin"`
2. Login: `POST /api/auth/login` (get token)
3. Create event: `POST /api/events` (with token)
4. View event registrations: `GET /api/registrations/events/:eventId` (with token)
5. Update event: `PUT /api/events/:id` (with token)

### 3. Organizer Creates Group and Event

1. Register as organizer: `POST /api/auth/register` with `"role": "organizer"`
2. Login: `POST /api/auth/login` (get token)
3. Create group: `POST /api/groups` (with token)
4. Create event: `POST /api/events` (with token, optionally link to group)
5. Add members to group: `POST /api/groups/:groupId/members` (with token)

## Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for authentication
- Tokens expire after 24 hours
- Always use HTTPS in production
- Change `JWT_SECRET` environment variable in production
- Implement rate limiting for authentication endpoints in production
