# Architecture Documentation

## Clean Architecture Overview

This project implements Clean Architecture principles, ensuring separation of concerns and making the codebase maintainable, testable, and scalable.

## Layer Structure

### 1. Domain Layer (`src/domain/`)
The innermost layer containing business entities and interfaces.

**Entities:**
- `Event.ts` - Core business entity representing an event

**Interfaces (Ports):**
- `IEventRepository.ts` - Abstract interface for event repository operations

**Key Principles:**
- No dependencies on outer layers
- Pure business logic
- Framework-agnostic

### 2. Use Cases Layer (`src/usecases/`)
Contains application-specific business rules.

**Use Cases:**
- `CreateEventUseCase.ts` - Handle event creation with validation
- `ListEventsUseCase.ts` - Retrieve all events
- `GetEventByIdUseCase.ts` - Retrieve specific event
- `UpdateEventUseCase.ts` - Update event with validation
- `DeleteEventUseCase.ts` - Remove event

**Key Principles:**
- Orchestrate data flow between entities and interfaces
- Implement business validation rules
- Independent of UI and database details

### 3. Infrastructure Layer (`src/infrastructure/`)
Implements external concerns like database access.

**Components:**
- `Database.ts` - MongoDB connection manager (Singleton pattern)
- `EventModel.ts` - Mongoose schema definition
- `MongoEventRepository.ts` - Concrete implementation of IEventRepository

**Key Principles:**
- Implements interfaces defined in domain layer (Adapters)
- Handles external dependencies
- Can be easily swapped (e.g., MongoDB → PostgreSQL)

### 4. Presentation Layer (`src/presentation/`)
Handles HTTP requests and UI rendering.

**Controllers:**
- `EventController.ts` - API endpoints handler
- `ViewController.ts` - HTML page rendering

**Routes:**
- `eventRoutes.ts` - API route configuration
- `viewRoutes.ts` - View route configuration

**Views:**
- `index.html` - Event listing page
- `create-event.html` - Event creation form
- `event-detail.html` - Event details and editing

**Key Principles:**
- Thin layer that delegates to use cases
- Handles HTTP concerns (request/response)
- Framework-specific code isolated here

### 5. Configuration Layer (`src/config/`)
Application setup and dependency injection.

**Components:**
- `config.ts` - Environment configuration
- `container.ts` - Dependency Injection container
- `app.ts` - Express application setup

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)
- Each class has one reason to change
- `CreateEventUseCase` only handles event creation
- `MongoEventRepository` only handles data persistence
- `EventController` only handles HTTP requests

### Open/Closed Principle (OCP)
- System is open for extension through interfaces
- Can add new repositories without modifying use cases
- Can add new use cases without modifying controllers

### Liskov Substitution Principle (LSP)
- `MongoEventRepository` can be substituted by any implementation of `IEventRepository`
- Use cases work with interfaces, not concrete implementations

### Interface Segregation Principle (ISP)
- `IEventRepository` contains only methods needed for event operations
- Controllers depend only on specific use cases they need

### Dependency Inversion Principle (DIP)
- High-level modules (use cases) don't depend on low-level modules (repositories)
- Both depend on abstractions (interfaces)
- Container handles dependency injection

## Data Flow

```
Request → Route → Controller → Use Case → Repository → Database
                                   ↓
                              Validation
                                   ↓
Response ← Controller ← Use Case ← Repository ← Database
```

## Key Design Patterns

### 1. Repository Pattern
- Abstracts data access layer
- Interface: `IEventRepository`
- Implementation: `MongoEventRepository`

### 2. Dependency Injection
- Container provides dependencies
- Loose coupling between layers
- Easy to test and mock

### 3. Singleton Pattern
- Database connection (`Database.getInstance()`)
- Ensures single database connection instance

### 4. MVC Pattern (Modified)
- Model: Domain entities
- View: HTML templates
- Controller: EventController and ViewController

## Benefits

1. **Testability**: Each layer can be tested independently
2. **Maintainability**: Changes in one layer don't affect others
3. **Flexibility**: Easy to swap implementations (e.g., change database)
4. **Scalability**: New features can be added without modifying existing code
5. **Readability**: Clear structure makes code easy to understand

## Testing Strategy

### Unit Tests (Recommended)
- Test use cases with mocked repositories
- Test entities in isolation
- Test controllers with mocked use cases

### Integration Tests (Recommended)
- Test repository with test database
- Test API endpoints end-to-end

### Example Test Structure
```typescript
// Example: Testing CreateEventUseCase
describe('CreateEventUseCase', () => {
  it('should create event with valid data', async () => {
    const mockRepository = {
      create: jest.fn().mockResolvedValue(mockEvent)
    };
    const useCase = new CreateEventUseCase(mockRepository);
    const result = await useCase.execute(validEventData);
    expect(result).toEqual(mockEvent);
  });
  
  it('should throw error for invalid data', async () => {
    const useCase = new CreateEventUseCase(mockRepository);
    await expect(useCase.execute(invalidData)).rejects.toThrow();
  });
});
```

## Future Enhancements

1. **Authentication & Authorization**: Add user management
2. **Event Registration**: Allow users to register for events
3. **Email Notifications**: Notify organizers and participants
4. **File Uploads**: Add event images/documents
5. **Search & Filters**: Advanced event search
6. **API Versioning**: Support multiple API versions
7. **Rate Limiting**: Prevent abuse
8. **Logging**: Structured logging with Winston
9. **Validation Library**: Use Joi or Zod for validation
10. **Testing**: Add comprehensive test suite
