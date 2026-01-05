# Guest Event Registration Feature

## Overview
This feature allows clients to register for public events without requiring authentication. Clients only need to provide their basic information: name, lastName, email, and phone.

## API Endpoint

**POST** `/api/registrations/public/events/:eventId`

### Request

No authentication required.

**URL Parameters:**
- `eventId` (string, required): The ID of the event to register for

**Request Body:**
```json
{
  "name": "João",
  "lastName": "Silva",
  "email": "joao.silva@example.com",
  "phone": "+5511987654321"
}
```

**Note:** The phone number can include formatting characters (spaces, dashes, parentheses) which will be automatically removed. The API stores only digits and the optional leading `+`.

### Response

**Success (201 Created):**
```json
{
  "id": "registrationId123",
  "eventId": "eventId123",
  "clientId": "clientId123",
  "status": "confirmed",
  "registeredAt": "2026-01-05T15:00:00.000Z",
  "updatedAt": "2026-01-05T15:00:00.000Z"
}
```

**Error Responses:**

- `400 Bad Request` - Missing required fields
```json
{
  "error": "All fields are required: name, lastName, email, phone"
}
```

- `400 Bad Request` - Invalid email format
```json
{
  "error": "Invalid email format"
}
```

- `400 Bad Request` - Invalid phone format
```json
{
  "error": "Invalid phone format. Phone must contain at least 10 digits"
}
```

- `400 Bad Request` - Already registered
```json
{
  "error": "A client with this email or phone is already registered for this event"
}
```

- `400 Bad Request` - Event not public
```json
{
  "error": "This event is not open for public registration"
}
```

- `400 Bad Request` - No available slots
```json
{
  "error": "No available slots for this event"
}
```

- `400 Bad Request` - Event not found
```json
{
  "error": "Event not found"
}
```

## Validation Rules

1. **Required Fields**: All fields (name, lastName, email, phone) must be provided
2. **Email Format**: Must be a valid email address (contains @ and domain)
3. **Phone Format**: Must contain at least 10 digits (formatting characters are allowed and will be removed)
4. **Duplicate Prevention**: 
   - If a client with the same email or phone already exists, they will be reused
   - A client cannot register twice for the same event (validated by email or phone)
5. **Event Rules**:
   - Event must be public (`isPublic: true`)
   - Event must have available slots
   - Event must exist

## Example Usage

### Using cURL

```bash
curl -X POST http://localhost:3000/api/registrations/public/events/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João",
    "lastName": "Silva",
    "email": "joao.silva@example.com",
    "phone": "+55 11 98765-4321"
  }'
```

### Using JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:3000/api/registrations/public/events/507f1f77bcf86cd799439011', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'João',
    lastName: 'Silva',
    email: 'joao.silva@example.com',
    phone: '+55 11 98765-4321',
  }),
});

const data = await response.json();
console.log(data);
```

### Using Python (requests)

```python
import requests

url = 'http://localhost:3000/api/registrations/public/events/507f1f77bcf86cd799439011'
data = {
    'name': 'João',
    'lastName': 'Silva',
    'email': 'joao.silva@example.com',
    'phone': '+55 11 98765-4321'
}

response = requests.post(url, json=data)
print(response.json())
```

## Database Schema

### Client Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  lastName: String (required),
  email: String (required, unique, lowercase),
  phone: String (required, unique),
  createdAt: Date,
  updatedAt: Date
}
```

### EventRegistration Collection (Updated)
```javascript
{
  _id: ObjectId,
  eventId: ObjectId (required, ref: Event),
  userId: ObjectId (optional, ref: User),
  clientId: ObjectId (optional, ref: Client),
  status: String (enum: ['pending', 'confirmed', 'cancelled']),
  createdAt: Date,
  updatedAt: Date
}
```

**Note:** Either `userId` or `clientId` must be present, but not both.

## Key Features

1. **No Authentication Required**: Clients can register without creating an account
2. **Automatic Client Reuse**: If a client with the same email or phone exists, it will be reused instead of creating a duplicate
3. **Duplicate Prevention**: Prevents the same client from registering multiple times for the same event
4. **Phone Normalization**: Automatically removes formatting characters from phone numbers
5. **Clean Architecture**: Follows SOLID principles with clear separation of concerns
6. **Type Safety**: Full TypeScript implementation with proper types
7. **Comprehensive Testing**: 71 tests covering all scenarios

## Architecture

The implementation follows Clean Architecture principles:

- **Domain Layer**: `Client` entity, `EventRegistration` entity (updated)
- **Use Case Layer**: `RegisterGuestToEventUseCase`
- **Infrastructure Layer**: `MongoClientRepository`, `ClientModel`
- **Presentation Layer**: `EventRegistrationController`, `EventRegistrationRoutes`

## Testing

Run the tests with:
```bash
npm test
```

To run only the guest registration tests:
```bash
npm test -- RegisterGuestToEventUseCase.test.ts
```

## Migration Notes

This feature is backward compatible. Existing authenticated user registrations will continue to work as before. The `EventRegistration` entity now supports both:
- `userId` for authenticated user registrations
- `clientId` for guest client registrations
