# Implementation Plan: FastAPI Chatbot Backend

## Overview

This implementation plan breaks down the FastAPI Chatbot Backend feature into discrete coding tasks. The system provides JWT-based authentication with role-based access control, CRUD operations for movies and videogames, public chat integration with an external Colab API, and comprehensive token consumption tracking.

The implementation follows a layered architecture: database models, schemas, services, dependencies, routers, middleware, and configuration. Each task builds incrementally on previous work, with checkpoints to validate functionality.

## Tasks

- [ ] 1. Set up project structure and dependencies
  - Create directory structure: app/, tests/, config files
  - Create requirements.txt with FastAPI, SQLAlchemy, Pydantic, JWT libraries
  - Create .env.example template with all required environment variables
  - Create app/__init__.py and basic main.py with FastAPI initialization
  - _Requirements: 12.1, 12.8_

- [ ] 2. Implement database models and configuration
  - [ ] 2.1 Create database configuration module
    - Implement app/config/settings.py with Pydantic Settings class
    - Add environment variable loading from .env file
    - Add database URL construction from DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
    - Add JWT configuration (JWT_SECRET_KEY, JWT_ALGORITHM, JWT_EXPIRATION_MINUTES)
    - Add COLAB_API_URL configuration
    - Add validation for JWT_EXPIRATION_MINUTES (1-10080 range)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8_

  - [ ] 2.2 Create SQLAlchemy database models
    - Implement app/models/database.py with Base class
    - Create Usuario model with all fields per requirement 9.1
    - Create Pelicula model with all fields per requirement 9.2
    - Create Videojuego model with all fields per requirement 9.3
    - Create Conversacion model with all fields per requirement 9.4
    - Create Mensaje model with all fields per requirement 9.5
    - Create ConsumoToken model with all fields per requirement 9.6
    - Define relationships with cascade delete per requirements 9.7, 9.8, 9.9
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10, 9.11_

  - [ ] 2.3 Create database session dependency
    - Implement app/dependencies/database_dependencies.py
    - Create get_db() function that yields database sessions
    - Implement connection pooling and session management
    - _Requirements: 9.1_

- [ ] 3. Checkpoint - Verify database connection
  - Ensure database models are properly defined
  - Verify connection to PostgreSQL database
  - Ask the user if questions arise

- [ ] 4. Implement Pydantic schemas
  - [ ] 4.1 Create authentication schemas
    - Implement app/schemas/auth_schemas.py
    - Create UserRegister schema with validation (email, password min 8 chars, role pattern)
    - Create UserLogin schema
    - Create TokenResponse schema
    - _Requirements: 1.1, 1.4, 1.6, 1.7_

  - [ ] 4.2 Create movie schemas
    - Implement app/schemas/movie_schemas.py
    - Create MovieCreate schema with field validation (year range, duration, title length, genre length)
    - Create MovieUpdate schema with optional fields
    - Create MovieResponse schema with from_attributes config
    - Add actores field validator for max 10 comma-separated names
    - _Requirements: 3.1, 3.7, 3.8, 3.9, 3.10, 3.11_

  - [ ] 4.3 Create videogame schemas
    - Implement app/schemas/videogame_schemas.py
    - Create VideogameCreate schema with field validation (year range, clasificacion enum, jugadores pattern)
    - Create VideogameUpdate schema with optional fields
    - Create VideogameResponse schema
    - Add jugadores field validator for integer or range format
    - _Requirements: 4.1, 4.7, 4.8, 4.9, 4.10, 4.11, 4.12, 4.13_

  - [ ] 4.4 Create chat and statistics schemas
    - Implement app/schemas/chat_schemas.py with ChatRequest (max 10000 chars) and ChatResponse
    - Implement app/schemas/statistics_schemas.py with TokenStats, UserTokenStats, StatisticsResponse
    - _Requirements: 5.3, 8.1, 8.2, 8.3, 8.4_

- [ ] 5. Implement authentication service
  - [ ] 5.1 Create authentication service
    - Implement app/services/auth_service.py
    - Add bcrypt password hashing with hash_password() method
    - Add password verification with verify_password() method
    - Add JWT token generation with create_jwt_token() method (24-hour expiration)
    - Include user role in JWT token payload
    - _Requirements: 1.1, 1.3, 1.4_

  - [ ] 5.2 Add user registration logic
    - Implement register_user() method in AuthService
    - Check for duplicate email and return 409 Conflict
    - Validate password length (min 8 characters) and return 422
    - Hash password before storing
    - Assign "user" role by default
    - Set fecha_registro to current UTC timestamp
    - Set activo to true
    - _Requirements: 1.4, 1.5, 1.6, 1.7_

  - [ ] 5.3 Add user login logic
    - Implement login_user() method in AuthService
    - Validate email and password against database
    - Return 401 Unauthorized for invalid credentials
    - Return JWT token on successful authentication
    - _Requirements: 1.1, 1.2_

- [ ] 6. Implement authorization dependencies
  - [ ] 6.1 Create JWT token validation dependency
    - Implement app/dependencies/auth_dependencies.py
    - Create OAuth2PasswordBearer with tokenUrl="/auth/login"
    - Implement get_current_user() dependency that decodes JWT token
    - Return 401 for expired tokens with message "Token has expired"
    - Return 401 for malformed tokens with message "Malformed token structure"
    - Return 401 for invalid signature with message "Invalid token signature"
    - Return 401 for missing token with message "Missing authentication token"
    - Extract user from database using token's sub claim
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 6.2 Create admin authorization dependency
    - Implement require_admin() dependency that chains get_current_user()
    - Check if user role is "admin"
    - Return 403 Forbidden with message "Admin access required" for non-admin users
    - Return user object for admin users
    - _Requirements: 2.6, 2.7_

  - [ ] 6.3 Create optional authentication dependency
    - Implement get_optional_user() dependency for anonymous access
    - Extract token from Authorization header if present
    - Return None if no token or invalid token
    - Return User object if valid token
    - _Requirements: 5.1, 6.3_

- [ ] 7. Checkpoint - Test authentication flow
  - Ensure user registration works
  - Ensure user login returns valid JWT token
  - Ensure JWT token validation works
  - Ask the user if questions arise

- [ ] 8. Implement media CRUD service
  - [ ] 8.1 Create movie CRUD operations
    - Implement app/services/media_service.py with MediaService class
    - Implement create_movie() that stores record with admin's ID_USUARIO
    - Implement get_movies() with filtering by GENERO, PLATAFORMA, ANIO_LANZAMIENTO
    - Implement get_movie_by_id() that returns 404 for non-existent movies
    - Implement update_movie() that preserves FECHA_REGISTRO
    - Implement delete_movie() that sets ACTIVO to false
    - Add pagination support with page and page_size parameters
    - Return total count metadata with paginated results
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.12_

  - [ ] 8.2 Create videogame CRUD operations
    - Implement create_videogame() in MediaService
    - Implement get_videogames() with filtering (support comma-separated values)
    - Validate CLASIFICACION values against enum (E, E10+, T, M, AO, RP)
    - Return 422 for invalid CLASIFICACION with message listing valid values
    - Implement get_videogame_by_id() with 404 handling
    - Implement update_videogame() preserving FECHA_REGISTRO
    - Implement delete_videogame() with soft delete
    - Add pagination support
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.14, 4.15_

- [ ] 9. Implement movie and videogame routers
  - [ ] 9.1 Create movies router
    - Implement app/routers/movies_router.py
    - Create POST /movies endpoint (admin only) returning 201
    - Create GET /movies endpoint (admin only) with query parameters
    - Create GET /movies/{id} endpoint (admin only)
    - Create PUT /movies/{id} endpoint (admin only)
    - Create DELETE /movies/{id} endpoint (admin only) returning 204
    - Use require_admin dependency for all endpoints
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 9.2 Create videogames router
    - Implement app/routers/videogames_router.py
    - Create POST /videogames endpoint (admin only) returning 201
    - Create GET /videogames endpoint (admin only) with query parameters
    - Create GET /videogames/{id} endpoint (admin only)
    - Create PUT /videogames/{id} endpoint (admin only)
    - Create DELETE /videogames/{id} endpoint (admin only) returning 204
    - Use require_admin dependency for all endpoints
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 10. Implement chat service with Colab integration
  - [ ] 10.1 Create Colab API client
    - Implement app/services/chat_service.py with ChatService class
    - Implement send_to_colab() async method using httpx.AsyncClient
    - Set 30-second timeout for Colab API requests
    - Return 503 Service Unavailable for API errors
    - Return 504 Gateway Timeout for timeout errors
    - Validate COLAB_API_URL is configured on startup
    - _Requirements: 5.2, 5.6, 5.7, 5.8_

  - [ ] 10.2 Create conversation management
    - Implement get_or_create_conversation() method in ChatService
    - Look for conversation created in last 24 hours for the user
    - Create new conversation if none exists or older than 24 hours
    - Use user ID 1 for anonymous users
    - Set FECHA_CREACION to current UTC timestamp
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 10.3 Create message persistence
    - Implement save_message() method in ChatService
    - Validate ROL is either "user" or "assistant"
    - Return 422 for invalid ROL values
    - Store message with FECHA set to current UTC timestamp
    - Link message to ID_CONVERSACION
    - _Requirements: 6.4, 6.5, 6.6, 6.7, 6.8_

  - [ ] 10.4 Implement token tracking
    - Implement track_tokens() method in ChatService
    - Extract prompt_tokens, completion_tokens, total_tokens from Colab response
    - Validate token values are between 0 and 1000000
    - Store three CONSUMO_TOKENS records (one per category)
    - Link records to ID_MENSAJE
    - Set FECHA to current UTC timestamp
    - Handle missing token data by storing categoria="unavailable" with tokens=0
    - Log errors but don't fail chat response
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8_

  - [ ] 10.5 Create complete chat processing flow
    - Implement process_chat() method that orchestrates full flow
    - Get or create conversation
    - Save user message
    - Send message to Colab API
    - Save assistant response
    - Track token consumption
    - Return ChatResponse with conversation_id and message_id
    - _Requirements: 5.1, 5.2, 5.5, 6.1, 6.2, 6.3, 7.1_

- [ ] 11. Create chat router
  - Implement app/routers/chat_router.py
  - Create POST /chat endpoint (public, no authentication required)
  - Use get_optional_user dependency to support both authenticated and anonymous users
  - Validate message field is present and not empty (return 422)
  - Validate message does not exceed 10000 characters (return 422)
  - Call ChatService.process_chat() method
  - Return ChatResponse with response text and IDs
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 12. Checkpoint - Test chat flow end-to-end
  - Ensure anonymous users can send chat messages
  - Ensure authenticated users can send chat messages
  - Ensure messages are stored in database
  - Ensure token consumption is tracked
  - Ask the user if questions arise

- [ ] 13. Implement statistics service
  - [ ] 13.1 Create statistics aggregation service
    - Implement app/services/statistics_service.py with StatisticsService class
    - Implement get_statistics() method with optional date range parameters
    - Default to last 30 days if no date range provided
    - Validate start_date is not after end_date (return 422)
    - Validate date format is ISO 8601 YYYY-MM-DD (return 422)
    - Query daily statistics grouped by date
    - Query user statistics by joining USUARIO, CONVERSACION, MENSAJE, CONSUMO_TOKENS
    - Filter by categoria="total_tokens" to avoid triple-counting
    - Order daily stats by date descending
    - Order user stats by total_tokens descending
    - Return empty arrays if no results (not 404)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9, 8.10_

- [ ] 14. Create statistics router
  - Implement app/routers/statistics_router.py
  - Create GET /statistics endpoint (admin only)
  - Add query parameters: start_date and end_date (optional)
  - Use require_admin dependency
  - Call StatisticsService.get_statistics()
  - Return StatisticsResponse with daily_stats, user_stats, date_range
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 15. Create authentication router
  - Implement app/routers/auth_router.py
  - Create POST /auth/register endpoint returning 201
  - Create POST /auth/login endpoint
  - Both endpoints return TokenResponse with JWT token
  - Use AuthService for registration and login logic
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [ ] 16. Implement error handling middleware
  - [ ] 16.1 Create global exception handlers
    - Implement app/middleware/error_handlers.py
    - Create validation_exception_handler for RequestValidationError (422)
    - Create http_exception_handler for HTTPException
    - Create database_exception_handler for IntegrityError (409)
    - Create generic_exception_handler for unexpected errors (500)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 11.7_

  - [ ] 16.2 Configure error response format
    - All errors return JSON with "error", "message", "details" fields
    - Validation errors (422) include field-level details array
    - Resource not found (404) includes resource type and identifier
    - Internal errors (500) hide stack traces and database details
    - Log full error details including stack trace, request ID, timestamp
    - Database constraint violations return user-friendly messages (409)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.7_

- [ ] 17. Wire all components together in main application
  - [ ] 17.1 Configure FastAPI application
    - Update app/main.py with application metadata (title, description, version)
    - Register all exception handlers (validation, HTTP, database, generic)
    - Include all routers (auth, movies, videogames, chat, statistics)
    - Create startup event handler to validate COLAB_API_URL
    - Create root endpoint GET / for health check
    - _Requirements: 5.8, 10.1, 10.2, 10.3_

  - [ ] 17.2 Configure API documentation
    - Ensure OpenAPI 3.0 specification is generated automatically
    - Verify Swagger UI is available at /docs endpoint
    - Verify ReDoc is available at /redoc endpoint
    - Add authentication button support in Swagger UI for Bearer token
    - Include request/response examples in documentation
    - Include error response schemas (4xx, 5xx)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.9_

- [ ] 18. Checkpoint - Test complete application
  - Ensure all endpoints are accessible
  - Ensure authentication and authorization work correctly
  - Ensure API documentation is complete and functional
  - Ask the user if questions arise

- [ ]* 19. Write unit tests for services
  - [ ]* 19.1 Write unit tests for AuthService
    - Test password hashing produces different hashes for same password
    - Test password verification with correct and incorrect passwords
    - Test JWT token generation includes correct user ID and role
    - Test JWT token expiration matches configuration
    - Test registration rejects duplicate emails (409)
    - Test registration enforces minimum password length (422)
    - Test login rejects invalid credentials (401)
    - Test login rejects inactive users (403)
    - _Requirements: 1.1, 1.2, 1.4, 1.6, 1.7_

  - [ ]* 19.2 Write unit tests for MediaService
    - Test create_movie stores all required fields
    - Test create_videogame validates clasificacion values
    - Test update_movie preserves fecha_registro
    - Test delete_movie sets activo to false
    - Test get_movies filters by genero, plataforma, anio_lanzamiento
    - Test get_videogames supports comma-separated filter values
    - Test get_by_id returns 404 for non-existent items
    - Test pagination calculates correct offsets
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4, 4.15_

  - [ ]* 19.3 Write unit tests for ChatService
    - Test send_to_colab constructs correct request payload
    - Test Colab timeout returns 504 error
    - Test Colab error returns 503 error
    - Test get_or_create_conversation reuses recent conversation
    - Test get_or_create_conversation creates new after 24 hours
    - Test save_message validates rol field (422)
    - Test track_tokens stores three categories
    - Test track_tokens handles missing token data
    - Test anonymous users assigned to user ID 1
    - _Requirements: 5.2, 5.6, 5.7, 6.1, 6.2, 6.3, 6.4, 6.6, 7.6_

  - [ ]* 19.4 Write unit tests for StatisticsService
    - Test default date range is last 30 days
    - Test date validation rejects start_date > end_date (422)
    - Test daily stats group by date correctly
    - Test user stats join across four tables
    - Test empty results return empty arrays
    - Test only total_tokens category counted (no duplicates)
    - _Requirements: 8.6, 8.7, 8.8, 8.9_

  - [ ]* 19.5 Write unit tests for Pydantic schemas
    - Test MovieCreate rejects invalid anio_lanzamiento (422)
    - Test MovieCreate validates actores max 10 names
    - Test VideogameCreate validates jugadores format
    - Test VideogameCreate validates clasificacion enum
    - Test ChatRequest enforces max 10000 characters (422)
    - Test email validation using EmailStr
    - _Requirements: 3.7, 3.8, 3.9, 3.11, 4.8, 4.12, 5.3_

- [ ]* 20. Write integration tests
  - [ ]* 20.1 Write authentication flow integration tests
    - Test register new user creates database record
    - Test login with valid credentials returns JWT token
    - Test using JWT token to access protected endpoint
    - Test admin JWT token accesses admin endpoint
    - Test user JWT token rejected from admin endpoint (403)
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.6, 2.7_

  - [ ]* 20.2 Write movie CRUD integration tests
    - Test admin creates movie with all fields stored
    - Test admin retrieves movies with filters
    - Test admin updates movie and changes persist
    - Test admin deletes movie and activo set to false
    - Test non-admin user cannot access movie endpoints (403)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 20.3 Write videogame CRUD integration tests
    - Test admin creates videogame with validation
    - Test admin retrieves videogames with filters
    - Test admin updates videogame
    - Test admin deletes videogame
    - Test non-admin user cannot access videogame endpoints
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [ ]* 20.4 Write chat flow integration tests
    - Test anonymous user sends message to chat endpoint
    - Test message sent to Colab API (mocked)
    - Test user message stored in database
    - Test assistant response stored in database
    - Test token consumption stored with three categories
    - Test conversation created for anonymous user (ID=1)
    - Test authenticated user chat creates conversation with user ID
    - _Requirements: 5.1, 5.2, 6.1, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4_

  - [ ]* 20.5 Write statistics flow integration tests
    - Test admin requests statistics without date range
    - Test daily stats aggregated by date
    - Test user stats include message counts
    - Test filtering by date range
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.8_

  - [ ]* 20.6 Write error handling integration tests
    - Test invalid JWT token returns 401
    - Test expired JWT token returns 401
    - Test duplicate email registration returns 409
    - Test invalid movie ID returns 404
    - Test Colab API timeout returns 504
    - Test missing required field returns 422
    - _Requirements: 1.2, 2.2, 2.4, 3.5, 4.5, 5.7, 11.1, 11.2, 11.5, 11.6_

- [ ] 21. Final checkpoint and documentation
  - Ensure all tests pass
  - Create README.md with setup instructions and API overview
  - Verify .env.example is complete
  - Test deployment readiness
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements from requirements.md for traceability
- Checkpoints ensure incremental validation throughout development
- Testing tasks are optional but highly recommended for production quality
- The design uses Python with FastAPI, so all implementation uses Python
- Database models match the existing PostgreSQL schema defined in requirements
- Authentication uses JWT tokens with bcrypt password hashing
- All timestamps use UTC to avoid timezone issues
- Soft deletes (activo flag) preserve data integrity for movies and videogames
- Anonymous chat users are assigned to user ID 1 (default system user)
- Token tracking failures are logged but don't break the chat flow
- Error responses follow a consistent JSON structure across all endpoints

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1"]
    },
    {
      "id": 1,
      "tasks": ["2.1", "2.2"]
    },
    {
      "id": 2,
      "tasks": ["2.3", "4.1", "4.2", "4.3", "4.4"]
    },
    {
      "id": 3,
      "tasks": ["5.1"]
    },
    {
      "id": 4,
      "tasks": ["5.2", "5.3", "6.1"]
    },
    {
      "id": 5,
      "tasks": ["6.2", "6.3"]
    },
    {
      "id": 6,
      "tasks": ["8.1", "8.2"]
    },
    {
      "id": 7,
      "tasks": ["9.1", "9.2", "10.1"]
    },
    {
      "id": 8,
      "tasks": ["10.2", "10.3", "10.4"]
    },
    {
      "id": 9,
      "tasks": ["10.5", "13.1", "15"]
    },
    {
      "id": 10,
      "tasks": ["11", "14", "16.1"]
    },
    {
      "id": 11,
      "tasks": ["16.2"]
    },
    {
      "id": 12,
      "tasks": ["17.1"]
    },
    {
      "id": 13,
      "tasks": ["17.2"]
    },
    {
      "id": 14,
      "tasks": ["19.1", "19.2", "19.3", "19.4", "19.5"]
    },
    {
      "id": 15,
      "tasks": ["20.1", "20.2", "20.3"]
    },
    {
      "id": 16,
      "tasks": ["20.4", "20.5", "20.6"]
    },
    {
      "id": 17,
      "tasks": ["21"]
    }
  ]
}
```
