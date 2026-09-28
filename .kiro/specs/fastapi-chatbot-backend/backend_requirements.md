# Requirements Document

## Introduction

This document specifies the requirements for a FastAPI-based chatbot backend system that manages a catalog of movies and videogames, provides JWT-based authentication with role-based access control, and integrates with an external Colab API for chatbot conversation capabilities. The system tracks token consumption for all chat interactions and provides administrative endpoints for content management and usage analytics.

## Glossary

- **Authentication_System**: The JWT-based authentication subsystem responsible for user login and token generation
- **Authorization_Guard**: The dependency injection component that validates JWT tokens and enforces role-based access
- **Admin_Guard**: The dependency injection component that restricts access exclusively to admin role users
- **Media_CRUD_Service**: The subsystem that manages Create, Read, Update, Delete operations for movies and videogames
- **Chat_Endpoint**: The public endpoint that processes user messages and returns chatbot responses
- **Conversation_Logger**: The subsystem that persists conversation and message records to the database
- **Token_Tracker**: The subsystem that records token consumption metrics for each chat interaction
- **Statistics_Service**: The subsystem that aggregates and returns token consumption analytics
- **Colab_API_Client**: The component that sends requests to the external Colab chatbot API
- **User**: A registered account with either "user" or "admin" role
- **Admin**: A User with "admin" role privilege
- **Media_Item**: A movie or videogame record in the catalog
- **Conversation**: A chat session associated with a User
- **Message**: An individual chat message within a Conversation
- **Token_Consumption**: A record of tokens consumed by a single Message

## Requirements

### Requirement 1: User Authentication

**User Story:** As a user, I want to authenticate with my credentials, so that I can access protected resources based on my role.

#### Acceptance Criteria

1. WHEN valid credentials (email and password) are provided, THE Authentication_System SHALL return a JWT token with expiration of 24 hours containing user role information
2. WHEN invalid credentials are provided, THE Authentication_System SHALL return a 401 Unauthorized response with error message "Invalid email or password"
3. WHEN a user registers, THE Authentication_System SHALL include the user's role (user or admin) in the JWT token payload
4. WHEN a user registers, THE Authentication_System SHALL hash passwords using bcrypt before storing them in the USUARIO table
5. WHEN a user registers, THE Authentication_System SHALL assign the "user" role by default
6. WHEN a user registers with an email that already exists, THE Authentication_System SHALL return a 409 Conflict response with error message "Email already registered"
7. WHEN a user registers with a password shorter than 8 characters, THE Authentication_System SHALL return a 422 Unprocessable Entity response with error message "Password must be at least 8 characters"

### Requirement 2: Token-Based Authorization

**User Story:** As a system administrator, I want role-based access control, so that only authorized users can access protected endpoints.

#### Acceptance Criteria

1. WHEN a request includes a valid JWT token in the Authorization header with Bearer scheme, THE Authorization_Guard SHALL extract the user identity and role
2. WHEN a request includes a token with malformed signature, THE Authorization_Guard SHALL return a 401 Unauthorized response with error message "Invalid token signature"
3. WHEN a request includes a token with malformed structure, THE Authorization_Guard SHALL return a 401 Unauthorized response with error message "Malformed token structure"
4. WHEN a request includes an expired JWT token, THE Authorization_Guard SHALL return a 401 Unauthorized response with error message "Token has expired"
5. WHEN a request lacks a JWT token, THE Authorization_Guard SHALL return a 401 Unauthorized response with error message "Missing authentication token"
6. WHEN an admin-protected endpoint receives a token with "user" role, THE Admin_Guard SHALL return a 403 Forbidden response with error message "Admin access required"
7. WHEN an admin-protected endpoint receives a token with "admin" role, THE Admin_Guard SHALL forward the request to the endpoint handler

### Requirement 3: Movie Catalog Management

**User Story:** As an admin, I want to manage movie records, so that I can maintain an up-to-date catalog.

#### Acceptance Criteria

1. WHEN an admin creates a movie, THE Media_CRUD_Service SHALL store the record in the PELICULA table with required fields (PRODUCTORA, TITULO, GENERO, PLATAFORMA, ANIO_LANZAMIENTO, DIRECTOR, DURACION_MINUTOS, CLASIFICACION) and optional fields (CALIFICACION, ACTORES, FECHA_REGISTRO)
2. WHEN an admin retrieves movies, THE Media_CRUD_Service SHALL return all PELICULA records with ACTIVO set to true with optional filtering by GENERO, PLATAFORMA, or ANIO_LANZAMIENTO
3. WHEN an admin updates a movie, THE Media_CRUD_Service SHALL modify the specified PELICULA record and preserve FECHA_REGISTRO
4. WHEN an admin deletes a movie, THE Media_CRUD_Service SHALL set ACTIVO to false for the specified PELICULA record
5. WHEN an admin retrieves a single movie by ID_PELICULA that does not exist, THE Media_CRUD_Service SHALL return a 404 Not Found response with error message "Movie not found"
6. WHEN an admin creates or updates a movie, THE Media_CRUD_Service SHALL associate the PELICULA record with the admin's ID_USUARIO
7. WHEN an admin creates or updates a movie, THE Media_CRUD_Service SHALL validate that ANIO_LANZAMIENTO is between 1888 and current year plus 5
8. WHEN an admin creates or updates a movie, THE Media_CRUD_Service SHALL validate that DURACION_MINUTOS is between 1 and 1000
9. WHEN an admin creates or updates a movie, THE Media_CRUD_Service SHALL validate that TITULO length does not exceed 200 characters
10. WHEN an admin creates or updates a movie, THE Media_CRUD_Service SHALL validate that GENERO length does not exceed 100 characters
11. WHEN an admin creates or updates a movie, THE Media_CRUD_Service SHALL validate that ACTORES field contains no more than 10 comma-separated names
12. WHEN an admin retrieves movies with pagination parameters (page and page_size), THE Media_CRUD_Service SHALL return the requested page of results with total count metadata

### Requirement 4: Videogame Catalog Management

**User Story:** As an admin, I want to manage videogame records, so that I can maintain an up-to-date catalog.

#### Acceptance Criteria

1. WHEN an admin creates a videogame, THE Media_CRUD_Service SHALL store the record in the VIDEOJUEGO table with required fields (TITULO, GENERO, PLATAFORMA, ANIO_LANZAMIENTO, CLASIFICACION, DESARROLLADOR) and optional fields (JUGADORES, FECHA_REGISTRO)
2. WHEN an admin retrieves videogames, THE Media_CRUD_Service SHALL return all VIDEOJUEGO records with ACTIVO set to true with optional filtering by GENERO, PLATAFORMA, or ANIO_LANZAMIENTO
3. WHEN an admin updates a videogame, THE Media_CRUD_Service SHALL modify the specified VIDEOJUEGO record and preserve FECHA_REGISTRO
4. WHEN an admin deletes a videogame, THE Media_CRUD_Service SHALL set ACTIVO to false for the specified VIDEOJUEGO record
5. WHEN an admin retrieves a single videogame by ID_VIDEOJUEGO that does not exist, THE Media_CRUD_Service SHALL return a 404 Not Found response with error message "Videogame not found"
6. WHEN an admin creates or updates a videogame, THE Media_CRUD_Service SHALL associate the VIDEOJUEGO record with the admin's ID_USUARIO
7. WHEN an admin creates or updates a videogame, THE Media_CRUD_Service SHALL validate that ANIO_LANZAMIENTO is between 1958 and current year plus 5
8. WHEN an admin creates or updates a videogame, THE Media_CRUD_Service SHALL validate that JUGADORES matches either a single positive integer or a range pattern (e.g., "1-4")
9. WHEN an admin creates or updates a videogame, THE Media_CRUD_Service SHALL validate that TITULO length does not exceed 200 characters
10. WHEN an admin creates or updates a videogame, THE Media_CRUD_Service SHALL validate that GENERO length does not exceed 100 characters
11. WHEN an admin creates or updates a videogame, THE Media_CRUD_Service SHALL validate that PLATAFORMA length does not exceed 100 characters
12. WHEN an admin creates or updates a videogame, THE Media_CRUD_Service SHALL validate that CLASIFICACION is one of: E, E10+, T, M, AO, RP (max 10 characters)
13. WHEN an admin creates or updates a videogame, THE Media_CRUD_Service SHALL validate that DESARROLLADOR length does not exceed 200 characters
14. WHEN an admin retrieves videogames with filter containing invalid CLASIFICACION value, THE Media_CRUD_Service SHALL return a 422 Unprocessable Entity response with error message listing valid values
15. WHEN an admin retrieves videogames with multiple filter values, THE Media_CRUD_Service SHALL accept comma-separated list format (e.g., "GENERO=Action,RPG")

### Requirement 5: Public Chat Interface

**User Story:** As any user (authenticated or anonymous), I want to send messages to the chatbot, so that I can get recommendations and assistance.

#### Acceptance Criteria

1. THE Chat_Endpoint SHALL accept POST requests without authentication with JSON body containing "message" field
2. WHEN a chat message is received with valid message field, THE Chat_Endpoint SHALL send the message to the Colab_API_Client
3. WHEN a chat message is received with message field exceeding 10000 characters, THE Chat_Endpoint SHALL return a 422 Unprocessable Entity response with error message "Message exceeds maximum length of 10000 characters"
4. WHEN a chat message is received with missing or empty message field, THE Chat_Endpoint SHALL return a 422 Unprocessable Entity response with error message "Message field is required and cannot be empty"
5. WHEN the Colab API responds with success, THE Chat_Endpoint SHALL return the chatbot's response to the user
6. WHEN the Colab API returns an error status code, THE Chat_Endpoint SHALL return a 503 Service Unavailable response with error message "Chatbot service temporarily unavailable"
7. WHEN the Colab API request times out after 30 seconds, THE Chat_Endpoint SHALL return a 504 Gateway Timeout response with error message "Chatbot service timeout"
8. WHEN COLAB_API_URL environment variable is not configured, THE Chat_Endpoint SHALL refuse to start and log error message "COLAB_API_URL is not configured"

### Requirement 6: Conversation Persistence

**User Story:** As a system, I want to log all chat interactions, so that conversation history is preserved.

#### Acceptance Criteria

1. WHEN a chat message is processed by an authenticated user, THE Conversation_Logger SHALL retrieve the most recent CONVERSACION record for the user's ID_USUARIO with FECHA_CREACION within the last 24 hours, or create a new CONVERSACION if none exists
2. WHEN an authenticated user sends a message, THE Conversation_Logger SHALL associate the CONVERSACION with the user's ID_USUARIO
3. WHEN an anonymous user sends a message, THE Conversation_Logger SHALL create a CONVERSACION with ID_USUARIO set to 1 (default system user)
4. WHEN a chat message is received, THE Conversation_Logger SHALL store the user message in the MENSAJES table with ROL set to "user"
5. WHEN a chatbot response is generated, THE Conversation_Logger SHALL store the response in the MENSAJES table with ROL set to "assistant"
6. WHEN a message is stored with invalid ROL value, THE Conversation_Logger SHALL return a 422 Unprocessable Entity response with error message "ROL must be either 'user' or 'assistant'"
7. WHEN a message is stored, THE Conversation_Logger SHALL set FECHA to the current timestamp in UTC for each MENSAJES record
8. WHEN a message is stored, THE Conversation_Logger SHALL link each MENSAJES record to the appropriate ID_CONVERSACION

### Requirement 7: Token Consumption Tracking

**User Story:** As an administrator, I want to track API token usage, so that I can monitor costs and usage patterns.

#### Acceptance Criteria

1. WHEN the Colab API returns a response with token usage information as JSON containing prompt_tokens, completion_tokens, and total_tokens fields, THE Token_Tracker SHALL store three records in the CONSUMO_TOKENS table (one for each token type)
2. WHEN token information is stored, THE Token_Tracker SHALL associate each CONSUMO_TOKENS record with the corresponding ID_MENSAJE from the chatbot response message
3. WHEN token information is stored, THE Token_Tracker SHALL validate that TOKENS value is between 0 and 1000000
4. WHEN token information is stored, THE Token_Tracker SHALL set CATEGORIA to one of: "prompt_tokens", "completion_tokens", or "total_tokens"
5. WHEN token information is stored, THE Token_Tracker SHALL set FECHA to the current timestamp in UTC
6. WHEN the Colab API does not provide token information in the expected JSON format, THE Token_Tracker SHALL store a single record with TOKENS set to 0 and CATEGORIA set to "unavailable"
7. WHEN storing token information fails due to database error, THE Token_Tracker SHALL log the error with full details but not fail the chat response
8. WHEN the Colab API response contains invalid token values (negative or non-numeric), THE Token_Tracker SHALL log a warning and store TOKENS as 0 with CATEGORIA as "invalid"

### Requirement 8: Usage Statistics

**User Story:** As an admin, I want to view token consumption statistics, so that I can analyze usage patterns and costs.

#### Acceptance Criteria

1. WHEN an admin requests statistics, THE Statistics_Service SHALL aggregate CONSUMO_TOKENS records by FECHA (grouped by day) from the CONSUMO_TOKENS table
2. WHEN aggregating statistics, THE Statistics_Service SHALL calculate total tokens consumed per day summing all TOKENS values
3. WHEN aggregating statistics, THE Statistics_Service SHALL calculate total tokens consumed per USUARIO by joining MENSAJES, CONVERSACION, and USUARIO tables
4. WHEN aggregating statistics, THE Statistics_Service SHALL include the count of messages per user in the response
5. WHEN an admin requests statistics with start_date and end_date parameters in ISO 8601 format (YYYY-MM-DD), THE Statistics_Service SHALL filter records by the specified date range inclusive
6. WHEN an admin requests statistics with invalid date format, THE Statistics_Service SHALL return a 422 Unprocessable Entity response with error message "Invalid date format. Use YYYY-MM-DD"
7. WHEN an admin requests statistics with start_date after end_date, THE Statistics_Service SHALL return a 422 Unprocessable Entity response with error message "start_date cannot be after end_date"
8. WHEN no date range is specified, THE Statistics_Service SHALL return statistics for the last 30 days
9. WHEN the query returns no results, THE Statistics_Service SHALL return an empty array with 200 OK status
10. WHEN returning statistics, THE Statistics_Service SHALL order results by date in descending order

### Requirement 9: Database Schema Compliance

**User Story:** As a developer, I want SQLAlchemy models that match the existing database schema, so that the system integrates with the current database.

#### Acceptance Criteria

1. THE SQLAlchemy models SHALL define USUARIO with fields: ID_USUARIO (Integer, primary key, auto-increment), ROL (String(50), not null), NOMBRE (String(100), not null), CORREO (String(255), unique, not null), CLAVE (String(255), not null), FECHA_REGISTRO (DateTime, not null), ACTIVO (Boolean, not null, default true)
2. THE SQLAlchemy models SHALL define PELICULA with fields: ID_PELICULA (Integer, primary key, auto-increment), ID_USUARIO (Integer, foreign key to USUARIO.ID_USUARIO, not null), PRODUCTORA (String(200), not null), TITULO (String(200), not null), GENERO (String(100), not null), PLATAFORMA (String(100), not null), ANIO_LANZAMIENTO (Integer, not null), CALIFICACION (Numeric(2,1), nullable), DIRECTOR (String(200), not null), ACTORES (Text, nullable), DURACION_MINUTOS (Integer, not null), CLASIFICACION (String(10), not null), FECHA_REGISTRO (DateTime, not null), ACTIVO (Boolean, not null, default true)
3. THE SQLAlchemy models SHALL define VIDEOJUEGO with fields: ID_VIDEOJUEGO (Integer, primary key, auto-increment), ID_USUARIO (Integer, foreign key to USUARIO.ID_USUARIO, not null), TITULO (String(200), not null), GENERO (String(100), not null), PLATAFORMA (String(100), not null), ANIO_LANZAMIENTO (Integer, not null), CLASIFICACION (String(10), not null), DESARROLLADOR (String(200), not null), JUGADORES (String(50), nullable), FECHA_REGISTRO (DateTime, not null), ACTIVO (Boolean, not null, default true)
4. THE SQLAlchemy models SHALL define CONVERSACION with fields: ID_CONVERSACION (Integer, primary key, auto-increment), ID_USUARIO (Integer, foreign key to USUARIO.ID_USUARIO, not null), FECHA_CREACION (DateTime, not null)
5. THE SQLAlchemy models SHALL define MENSAJES with fields: ID_MENSAJE (Integer, primary key, auto-increment), ID_CONVERSACION (Integer, foreign key to CONVERSACION.ID_CONVERSACION, not null), ROL (String(20), not null), CONTENIDO (Text, not null), FECHA (DateTime, not null)
6. THE SQLAlchemy models SHALL define CONSUMO_TOKENS with fields: ID_CONSUMO (Integer, primary key, auto-increment), ID_MENSAJE (Integer, foreign key to MENSAJES.ID_MENSAJE, not null), CATEGORIA (String(50), not null), TOKENS (Integer, not null), FECHA (DateTime, not null)
7. WHEN a USUARIO record is deleted, THE SQLAlchemy models SHALL cascade delete to PELICULA and VIDEOJUEGO records via foreign key relationship
8. WHEN a CONVERSACION record is deleted, THE SQLAlchemy models SHALL cascade delete to MENSAJES records via foreign key relationship
9. WHEN a MENSAJES record is deleted, THE SQLAlchemy models SHALL cascade delete to CONSUMO_TOKENS records via foreign key relationship
10. WHEN a model field is nullable, THE SQLAlchemy models SHALL accept None values for that field
11. WHEN a string field has a character limit, THE SQLAlchemy models SHALL enforce the specified maximum length

### Requirement 10: API Documentation

**User Story:** As a developer, I want interactive API documentation, so that I can understand and test endpoints.

#### Acceptance Criteria

1. THE FastAPI application (located in backend/ directory) SHALL generate OpenAPI 3.0 specification automatically from route definitions and Pydantic models
2. THE FastAPI application (located in backend/ directory) SHALL expose interactive Swagger UI documentation at /docs endpoint with test request execution capability
3. THE FastAPI application (located in backend/ directory) SHALL expose alternative ReDoc documentation at /redoc endpoint
4. THE API documentation SHALL include all endpoint paths, HTTP methods, request schemas, response schemas, and status codes
5. THE API documentation SHALL include authentication requirements for protected endpoints with Bearer token scheme specification
6. THE API documentation SHALL include example request and response payloads for each endpoint
7. WHEN testing authenticated endpoints in /docs, THE Swagger UI SHALL support entering JWT token via "Authorize" button
8. WHEN an endpoint is not available or under maintenance, THE API documentation SHALL include a note in the endpoint description
9. THE API documentation SHALL include error response schemas for 4xx and 5xx status codes with field descriptions

### Requirement 11: Error Handling

**User Story:** As a user, I want clear error messages, so that I can understand what went wrong.

#### Acceptance Criteria

1. WHEN a validation error occurs, THE API SHALL return a 422 Unprocessable Entity response with JSON structure containing error type, message, and field-specific details array
2. WHEN a resource is not found, THE API SHALL return a 404 Not Found response with JSON structure containing error type and message including the resource type and identifier
3. WHEN an internal error occurs, THE API SHALL return a 500 Internal Server Error response within 5 seconds with JSON structure containing generic error message without stack traces, database details, or file paths
4. WHEN an internal error occurs, THE API SHALL log the full error details including stack trace, request ID, timestamp, and user context to the application logs
5. WHEN an authentication failure occurs, THE API SHALL return a 401 Unauthorized response with JSON error structure
6. WHEN an authorization failure occurs, THE API SHALL return a 403 Forbidden response with JSON error structure
7. WHEN a database constraint violation occurs, THE API SHALL return a 409 Conflict response with JSON structure containing user-friendly error message derived from the constraint name

### Requirement 12: Environment Configuration

**User Story:** As a system administrator, I want configurable environment settings, so that I can deploy the application in different environments.

#### Acceptance Criteria

1. WHEN the application starts, THE application SHALL read COLAB_API_URL from environment variables
2. WHEN the application starts, THE application SHALL read database connection parameters from environment variables (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD)
3. WHEN the application starts, THE application SHALL read JWT_SECRET_KEY from environment variables
4. WHEN the application starts, THE application SHALL read JWT_ALGORITHM from environment variables with default value "HS256"
5. WHEN the application starts, THE application SHALL read JWT_EXPIRATION_MINUTES from environment variables with default value 60 and validate it is between 1 and 10080 minutes
6. WHEN required environment variables (COLAB_API_URL, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET_KEY) are missing, THE application SHALL log error message specifying which variables are missing and exit with code 1
7. WHEN JWT_EXPIRATION_MINUTES contains invalid value outside range 1-10080, THE application SHALL log error message "JWT_EXPIRATION_MINUTES must be between 1 and 10080" and exit with code 1
8. WHEN the application starts, THE application SHALL attempt to load environment variables from a .env file in the backend/ directory before reading from system environment

