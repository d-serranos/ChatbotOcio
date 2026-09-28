# FastAPI Chatbot Backend

Backend API for a chatbot system with multimedia catalog management, JWT authentication, and Colab API integration.

## Features

- **JWT Authentication**: Secure user registration and login with bcrypt password hashing
- **Role-Based Access Control**: Admin and user roles with protected endpoints
- **Movie Catalog**: CRUD operations for movie management (admin only)
- **Videogame Catalog**: CRUD operations for videogame management (admin only)
- **Public Chat Interface**: Integration with external Colab chatbot API
- **Conversation Logging**: Persistent storage of all chat interactions
- **Token Tracking**: Monitor API token consumption for cost analysis
- **Statistics**: Aggregate token usage by date and user

## Tech Stack

- **Framework**: FastAPI 0.104.1
- **Database**: PostgreSQL with SQLAlchemy 2.0.23
- **Authentication**: JWT with python-jose and passlib (bcrypt)
- **Validation**: Pydantic 2.5.0
- **HTTP Client**: httpx 0.25.2 (async)
- **Testing**: pytest 7.4.3, pytest-asyncio 0.21.1

## Project Structure

```
backend/
├── app/
│   ├── config/          # Environment configuration
│   ├── models/          # SQLAlchemy database models
│   ├── schemas/         # Pydantic request/response schemas
│   ├── services/        # Business logic layer
│   ├── routers/         # API endpoint definitions
│   ├── dependencies/    # FastAPI dependencies (auth, db)
│   ├── middleware/      # Error handlers
│   ├── utils/           # Utility functions
│   └── main.py          # Application entry point
├── tests/
│   ├── unit/            # Unit tests
│   └── integration/     # Integration tests
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
└── README.md            # This file
```

## Setup

### 1. Prerequisites

- Python 3.11+
- PostgreSQL 12+
- Git

### 2. Clone Repository

```bash
git clone <repository-url>
cd ChatbotOcio/backend
```

### 3. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure Environment

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatbot
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRATION_MINUTES=1440

# Colab API
COLAB_API_URL=https://your-colab-api-url.com/chat

# Application
DEBUG=false
```

### 6. Initialize Database

Create the PostgreSQL database and run the SQL schema:

```bash
psql -U postgres -c "CREATE DATABASE chatbot;"
psql -U postgres -d chatbot -f ../Modelo\ Base\ de\ datos/Chatbot.sql
```

### 7. Run Application

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

### Interactive Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

#### Movies (Admin Only)
- `POST /movies` - Create movie
- `GET /movies` - List movies (with filters)
- `GET /movies/{id}` - Get movie by ID
- `PUT /movies/{id}` - Update movie
- `DELETE /movies/{id}` - Delete movie

#### Videogames (Admin Only)
- `POST /videogames` - Create videogame
- `GET /videogames` - List videogames (with filters)
- `GET /videogames/{id}` - Get videogame by ID
- `PUT /videogames/{id}` - Update videogame
- `DELETE /videogames/{id}` - Delete videogame

#### Chat (Public)
- `POST /chat` - Send message to chatbot

#### Statistics (Admin Only)
- `GET /statistics` - Get token consumption statistics

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get a token by registering or logging in:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Admin User",
    "correo": "admin@example.com",
    "clave": "password123",
    "rol": "admin"
  }'
```

## Development

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app tests/

# Run specific test file
pytest tests/unit/test_auth_service.py
```

### Code Style

The project follows PEP 8 style guidelines. Format code with:

```bash
black app/
isort app/
```

### Database Migrations

For schema changes, use Alembic:

```bash
# Initialize Alembic (first time only)
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## Deployment

### Docker

```bash
# Build image
docker build -t chatbot-backend .

# Run container
docker run -p 8000:8000 --env-file .env chatbot-backend
```

### Production Considerations

1. **Environment Variables**: Set all required variables in production
2. **Database**: Use connection pooling and read replicas
3. **JWT Secret**: Generate a strong secret key (256-bit minimum)
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure allowed origins in production
6. **Logging**: Set up centralized logging (e.g., CloudWatch, Datadog)
7. **Monitoring**: Monitor API response times and error rates

## Troubleshooting

### Database Connection Issues

```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d chatbot

# Check if database exists
psql -U postgres -l | grep chatbot
```

### Import Errors

Ensure you're in the backend directory and virtual environment is activated:

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python -c "import app; print('OK')"
```

### Colab API Errors

Check that COLAB_API_URL is configured and accessible:

```bash
curl -X POST $COLAB_API_URL \
  -H "Content-Type: application/json" \
  -d '{"message": "test"}'
```

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.
