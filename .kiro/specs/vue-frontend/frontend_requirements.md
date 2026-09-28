# Requirements Document

## Introduction

This document specifies the requirements for a Vue.js 3 frontend application that provides an interactive user interface for the ChatbotOcio system. The frontend integrates with the FastAPI backend to deliver chat capabilities, media catalog browsing, user authentication, and administrative dashboards. The application is built using Vue 3 Composition API, Vite, Pinia for state management, Vue Router for navigation, and Tailwind CSS for styling.

## Glossary

- **Auth_Module**: The authentication module responsible for login, registration, and token management
- **Chat_View**: The main interactive chat interface inspired by ChatGPT design patterns
- **Catalog_Browser**: The public-facing component for browsing movies and videogames
- **Admin_Dashboard**: The protected administrative interface for content and statistics management
- **Route_Guard**: The navigation guard that enforces authentication and authorization requirements
- **API_Client**: The HTTP client module (Axios) configured for backend API communication
- **State_Store**: The Pinia store managing global application state
- **JWT_Token**: The authentication token stored in localStorage/sessionStorage
- **User_Role**: The role identifier (user or admin) extracted from the JWT token
- **Authenticated_User**: A user who has successfully logged in with valid credentials
- **Anonymous_User**: A user browsing the application without authentication
- **Protected_Route**: A route that requires authentication to access
- **Admin_Route**: A route that requires admin role to access

## Requirements

### Requirement 1: Application Structure

**User Story:** As a developer, I want a well-organized frontend structure, so that the codebase is maintainable and scalable.

#### Acceptance Criteria

1. WHEN the project is initialized, THE application SHALL be located in the frontend/ root directory
2. WHEN the project structure is created, THE application SHALL use Vite as the build tool with Vue 3 template
3. WHEN the application starts, THE application SHALL load configuration from environment variables (.env files)
4. WHEN the application is structured, THE source code SHALL be organized in src/ with subdirectories: views/, components/, stores/, router/, services/, utils/, and assets/
5. WHEN components are created, THE application SHALL use Vue 3 Composition API with <script setup> syntax
6. WHEN styles are applied, THE application SHALL use Tailwind CSS utility classes
7. WHEN the application initializes, THE application SHALL configure Pinia as the state management solution
8. WHEN routing is configured, THE application SHALL use Vue Router with history mode

### Requirement 2: User Authentication

**User Story:** As a user, I want to log in and register, so that I can access personalized features.

#### Acceptance Criteria

1. WHEN a user navigates to /login, THE Auth_Module SHALL display a login form with email and password fields
2. WHEN a user submits valid credentials, THE Auth_Module SHALL send a POST request to /auth/login and store the JWT token in localStorage
3. WHEN login is successful, THE Auth_Module SHALL redirect the user to the home page or their previous location
4. WHEN login fails, THE Auth_Module SHALL display the error message returned by the backend
5. WHEN a user navigates to /register, THE Auth_Module SHALL display a registration form with name, email, password, and password confirmation fields
6. WHEN a user submits registration, THE Auth_Module SHALL send a POST request to /auth/register with the form data
7. WHEN registration is successful, THE Auth_Module SHALL automatically log in the user and redirect to the home page
8. WHEN registration fails, THE Auth_Module SHALL display the error message returned by the backend (e.g., "Email already registered")
9. WHEN a user is authenticated, THE Auth_Module SHALL decode the JWT token to extract user role and display it in the UI
10. WHEN a user clicks logout, THE Auth_Module SHALL remove the JWT token from storage and redirect to the login page
11. WHEN the application loads, THE Auth_Module SHALL check for an existing valid token in localStorage and restore the authenticated state

### Requirement 3: Route Protection

**User Story:** As a system, I want to protect sensitive routes, so that only authorized users can access them.

#### Acceptance Criteria

1. WHEN a Route_Guard is configured, THE router SHALL check authentication status before navigating to Protected_Route
2. WHEN an Anonymous_User attempts to access a Protected_Route, THE Route_Guard SHALL redirect to /login with a return URL parameter
3. WHEN an Authenticated_User accesses a Protected_Route, THE Route_Guard SHALL allow navigation
4. WHEN a non-admin user attempts to access an Admin_Route, THE Route_Guard SHALL redirect to the home page with an error message "Admin access required"
5. WHEN an admin user accesses an Admin_Route, THE Route_Guard SHALL allow navigation
6. WHEN a user logs out from a Protected_Route, THE application SHALL redirect to the login page
7. WHEN a JWT token expires, THE application SHALL detect the expiration and redirect to login with message "Session expired. Please log in again"

### Requirement 4: Chat Interface

**User Story:** As a user, I want to interact with the chatbot, so that I can get movie and videogame recommendations.

#### Acceptance Criteria

1. WHEN a user navigates to / or /chat, THE Chat_View SHALL display a modern chat interface with message history and input field
2. WHEN the chat interface loads, THE Chat_View SHALL display a welcome message explaining the chatbot capabilities
3. WHEN a user types a message, THE Chat_View SHALL enable the send button only if the message is not empty and under 10000 characters
4. WHEN a user sends a message, THE Chat_View SHALL display the user message immediately in the chat history with timestamp
5. WHEN a message is sent, THE Chat_View SHALL send a POST request to /chat with the message content and JWT token if user is authenticated
6. WHEN the backend responds, THE Chat_View SHALL display the assistant response in the chat history with timestamp
7. WHEN the API request is pending, THE Chat_View SHALL display a loading indicator (e.g., typing animation)
8. WHEN an API error occurs, THE Chat_View SHALL display an error message in the chat (e.g., "Service temporarily unavailable. Please try again.")
9. WHEN the chat history grows, THE Chat_View SHALL auto-scroll to the latest message
10. WHEN a user refreshes the page, THE Chat_View SHALL clear the chat history (conversations are server-side only)
11. WHEN the chat interface renders messages, THE Chat_View SHALL differentiate user messages and assistant messages with distinct styling
12. WHEN messages contain URLs, THE Chat_View SHALL render them as clickable links
13. WHEN the chat input is focused, THE Chat_View SHALL support Enter key to send message and Shift+Enter for new line

### Requirement 5: Public Catalog Browsing

**User Story:** As any user, I want to browse movies and videogames, so that I can explore the catalog.

#### Acceptance Criteria

1. WHEN a user navigates to /catalog/movies, THE Catalog_Browser SHALL display a grid of movie cards with title, genre, year, platform, director, and rating
2. WHEN a user navigates to /catalog/videogames, THE Catalog_Browser SHALL display a grid of videogame cards with title, genre, platform, year, classification, and developer
3. WHEN the catalog loads, THE Catalog_Browser SHALL send a GET request to /movies or /videogames without authentication
4. WHEN the catalog data is loading, THE Catalog_Browser SHALL display skeleton loaders for cards
5. WHEN the API returns an error, THE Catalog_Browser SHALL display an error message with retry button
6. WHEN a user clicks on a movie or videogame card, THE Catalog_Browser SHALL display a modal or detail page with full information
7. WHEN the catalog has many items, THE Catalog_Browser SHALL implement pagination with previous/next buttons and page numbers
8. WHEN a user interacts with filters, THE Catalog_Browser SHALL provide dropdown filters for genre, platform, and year
9. WHEN filters are applied, THE Catalog_Browser SHALL send a new request with query parameters and update the displayed items
10. WHEN no items match the filters, THE Catalog_Browser SHALL display a "No results found" message
11. WHEN the user clears filters, THE Catalog_Browser SHALL reset to the initial state showing all items

### Requirement 6: Admin Dashboard - Statistics

**User Story:** As an admin, I want to view usage statistics, so that I can monitor token consumption and system usage.

#### Acceptance Criteria

1. WHEN an admin navigates to /admin/statistics, THE Admin_Dashboard SHALL display token consumption statistics
2. WHEN the statistics page loads, THE Admin_Dashboard SHALL send a GET request to /statistics with the JWT token
3. WHEN statistics data loads, THE Admin_Dashboard SHALL display a line chart showing daily token consumption over time
4. WHEN statistics data loads, THE Admin_Dashboard SHALL display a table of top users by token consumption with user name, message count, and total tokens
5. WHEN an admin selects a date range, THE Admin_Dashboard SHALL send a new request with start_date and end_date parameters
6. WHEN no statistics data exists, THE Admin_Dashboard SHALL display a message "No data available for the selected period"
7. WHEN the API request fails, THE Admin_Dashboard SHALL display an error message with retry button
8. WHEN statistics are displayed, THE Admin_Dashboard SHALL show summary cards with total tokens, total messages, and total users
9. WHEN the admin views the chart, THE Admin_Dashboard SHALL allow toggling between daily, weekly, and monthly aggregation views
10. WHEN the statistics page loads, THE Admin_Dashboard SHALL default to the last 30 days of data

### Requirement 7: Admin Dashboard - Movie Management

**User Story:** As an admin, I want to manage movies, so that I can maintain an up-to-date catalog.

#### Acceptance Criteria

1. WHEN an admin navigates to /admin/movies, THE Admin_Dashboard SHALL display a table of all movies with columns: title, genre, platform, year, actions
2. WHEN the movies page loads, THE Admin_Dashboard SHALL send a GET request to /movies with the JWT token
3. WHEN an admin clicks "Add Movie", THE Admin_Dashboard SHALL display a form modal with fields matching the MovieCreate schema
4. WHEN an admin submits the create form, THE Admin_Dashboard SHALL send a POST request to /movies with the form data
5. WHEN movie creation succeeds, THE Admin_Dashboard SHALL close the modal, refresh the movie list, and display success message
6. WHEN movie creation fails, THE Admin_Dashboard SHALL display validation errors next to the respective form fields
7. WHEN an admin clicks "Edit" on a movie, THE Admin_Dashboard SHALL display a form modal pre-filled with the movie data
8. WHEN an admin submits the edit form, THE Admin_Dashboard SHALL send a PUT request to /movies/{id} with the updated data
9. WHEN movie update succeeds, THE Admin_Dashboard SHALL close the modal, refresh the movie list, and display success message
10. WHEN an admin clicks "Delete" on a movie, THE Admin_Dashboard SHALL display a confirmation dialog
11. WHEN deletion is confirmed, THE Admin_Dashboard SHALL send a DELETE request to /movies/{id}
12. WHEN movie deletion succeeds, THE Admin_Dashboard SHALL refresh the movie list and display success message
13. WHEN the movie table has many items, THE Admin_Dashboard SHALL implement pagination
14. WHEN an admin uses the search box, THE Admin_Dashboard SHALL filter movies by title in real-time
15. WHEN form validation fails, THE Admin_Dashboard SHALL display error messages for invalid fields (e.g., "Year must be between 1888 and 2030")

### Requirement 8: Admin Dashboard - Videogame Management

**User Story:** As an admin, I want to manage videogames, so that I can maintain an up-to-date catalog.

#### Acceptance Criteria

1. WHEN an admin navigates to /admin/videogames, THE Admin_Dashboard SHALL display a table of all videogames with columns: title, genre, platform, year, classification, actions
2. WHEN the videogames page loads, THE Admin_Dashboard SHALL send a GET request to /videogames with the JWT token
3. WHEN an admin clicks "Add Videogame", THE Admin_Dashboard SHALL display a form modal with fields matching the VideogameCreate schema
4. WHEN an admin submits the create form, THE Admin_Dashboard SHALL send a POST request to /videogames with the form data
5. WHEN videogame creation succeeds, THE Admin_Dashboard SHALL close the modal, refresh the videogame list, and display success message
6. WHEN videogame creation fails, THE Admin_Dashboard SHALL display validation errors next to the respective form fields
7. WHEN an admin clicks "Edit" on a videogame, THE Admin_Dashboard SHALL display a form modal pre-filled with the videogame data
8. WHEN an admin submits the edit form, THE Admin_Dashboard SHALL send a PUT request to /videogames/{id} with the updated data
9. WHEN videogame update succeeds, THE Admin_Dashboard SHALL close the modal, refresh the videogame list, and display success message
10. WHEN an admin clicks "Delete" on a videogame, THE Admin_Dashboard SHALL display a confirmation dialog
11. WHEN deletion is confirmed, THE Admin_Dashboard SHALL send a DELETE request to /videogames/{id}
12. WHEN videogame deletion succeeds, THE Admin_Dashboard SHALL refresh the videogame list and display success message
13. WHEN the videogame table has many items, THE Admin_Dashboard SHALL implement pagination
14. WHEN an admin uses the search box, THE Admin_Dashboard SHALL filter videogames by title in real-time
15. WHEN the classification field is displayed, THE Admin_Dashboard SHALL show a dropdown with valid values: E, E10+, T, M, AO, RP

### Requirement 9: API Integration

**User Story:** As the application, I want to communicate with the backend API, so that I can provide data to the user.

#### Acceptance Criteria

1. WHEN the API_Client is initialized, THE application SHALL configure Axios with the base URL from environment variables (VITE_API_BASE_URL)
2. WHEN an API request is made, THE API_Client SHALL include the JWT token in the Authorization header if the user is authenticated
3. WHEN the backend returns a 401 error, THE API_Client SHALL automatically redirect to the login page and clear stored tokens
4. WHEN the backend returns a 403 error, THE API_Client SHALL display an error message "You do not have permission to access this resource"
5. WHEN the backend returns a 422 error, THE API_Client SHALL parse and return validation errors in a structured format
6. WHEN the backend returns a 500 error, THE API_Client SHALL display a generic error message "An error occurred. Please try again later."
7. WHEN a network error occurs, THE API_Client SHALL display a message "Unable to connect to the server. Please check your connection."
8. WHEN an API request is pending, THE application SHALL show a loading state in the UI
9. WHEN the API_Client makes a request, THE application SHALL include proper headers: Content-Type: application/json
10. WHEN multiple API requests fail with 401, THE API_Client SHALL prevent multiple redirects to login


### Requirement 10: State Management

**User Story:** As the application, I want centralized state management, so that components can share data efficiently.

#### Acceptance Criteria

1. WHEN the application initializes, THE State_Store SHALL create a Pinia store for authentication state (authStore)
2. WHEN a user logs in, THE authStore SHALL store user data (id, name, email, role) and token
3. WHEN a user logs out, THE authStore SHALL clear all user data and token
4. WHEN components need user info, THE authStore SHALL provide computed properties: isAuthenticated, isAdmin, currentUser
5. WHEN the application initializes, THE State_Store SHALL create a Pinia store for catalog data (catalogStore)
6. WHEN catalog data is fetched, THE catalogStore SHALL cache movies and videogames to avoid redundant API calls
7. WHEN an admin modifies catalog data, THE catalogStore SHALL update the cached data
8. WHEN the application initializes, THE State_Store SHALL persist authentication state to localStorage using a Pinia plugin
9. WHEN the browser is refreshed, THE State_Store SHALL restore authentication state from localStorage
10. WHEN token expires, THE State_Store SHALL clear authentication state and trigger logout

### Requirement 11: Responsive Design

**User Story:** As a user on any device, I want the application to work well, so that I can use it on desktop, tablet, or mobile.

#### Acceptance Criteria

1. WHEN the application renders, THE UI SHALL be fully responsive using Tailwind CSS breakpoints (sm, md, lg, xl)
2. WHEN viewed on mobile (< 768px), THE navigation SHALL collapse into a hamburger menu
3. WHEN viewed on mobile, THE chat interface SHALL stack vertically with full-width input
4. WHEN viewed on mobile, THE catalog grid SHALL display 1 column
5. WHEN viewed on tablet (768px - 1024px), THE catalog grid SHALL display 2-3 columns
6. WHEN viewed on desktop (> 1024px), THE catalog grid SHALL display 4+ columns
7. WHEN viewed on mobile, THE admin tables SHALL be horizontally scrollable
8. WHEN forms are displayed on mobile, THE input fields SHALL be sized appropriately for touch interaction
9. WHEN modals are displayed on mobile, THE modal SHALL take full screen
10. WHEN the application renders, THE touch interactions SHALL work properly on mobile devices

### Requirement 12: User Experience Enhancements

**User Story:** As a user, I want a polished experience, so that the application feels professional and easy to use.

#### Acceptance Criteria

1. WHEN any action is performed, THE application SHALL provide visual feedback (loading spinners, success/error toasts)
2. WHEN data is loading, THE application SHALL display skeleton loaders instead of blank spaces
3. WHEN an error occurs, THE application SHALL display user-friendly error messages with actionable suggestions
4. WHEN a form is submitted, THE submit button SHALL be disabled during API request to prevent double submission
5. WHEN navigation occurs, THE application SHALL include smooth page transitions
6. WHEN the user hovers over interactive elements, THE application SHALL change cursor to pointer and provide hover effects
7. WHEN forms have validation errors, THE error messages SHALL be displayed immediately below the input field
8. WHEN the user performs an action successfully, THE application SHALL display a success toast notification
9. WHEN the application uses icons, THE icons SHALL be from a consistent icon library (e.g., Heroicons, Lucide)
10. WHEN the application uses colors, THE color scheme SHALL be consistent using Tailwind CSS theme colors
11. WHEN the user navigates, THE current active route SHALL be highlighted in the navigation menu

### Requirement 13: Accessibility

**User Story:** As a user with disabilities, I want the application to be accessible, so that I can use it with assistive technologies.

#### Acceptance Criteria

1. WHEN interactive elements are rendered, THE application SHALL include proper ARIA labels
2. WHEN forms are displayed, THE labels SHALL be associated with their input fields using for/id attributes
3. WHEN keyboard navigation is used, THE focus indicators SHALL be clearly visible
4. WHEN modals are opened, THE focus SHALL trap inside the modal until closed
5. WHEN images are displayed, THE application SHALL include alt text descriptions
6. WHEN color is used to convey information, THE application SHALL also provide text or icon indicators
7. WHEN the application is navigated with keyboard, THE tab order SHALL be logical and intuitive
8. WHEN errors are displayed, THE application SHALL use semantic HTML and ARIA live regions

### Requirement 14: Environment Configuration

**User Story:** As a developer, I want environment-based configuration, so that I can deploy to different environments.

#### Acceptance Criteria

1. WHEN the application builds, THE application SHALL read VITE_API_BASE_URL from .env file
2. WHEN .env file is missing, THE application SHALL fail to start and display configuration error
3. WHEN the application is in development, THE application SHALL use .env.development values
4. WHEN the application is in production, THE application SHALL use .env.production values
5. WHEN environment variables are accessed, THE application SHALL use import.meta.env.VITE_* pattern
6. WHEN the repository is cloned, THE .env.example file SHALL provide template for all required variables
7. WHEN the application starts, THE application SHALL validate that required environment variables are set
### Requirement 15: Build and Deployment

**User Story:** As a developer, I want streamlined build and deployment, so that I can ship updates efficiently.

#### Acceptance Criteria

1. WHEN npm commands are executed, THE application SHALL start the Vite development server with hot module replacement
2. WHEN build command is executed, THE application SHALL create an optimized production build in the dist/ folder
3. WHEN the build completes, THE dist/ folder SHALL contain minified HTML, CSS, and JavaScript
4. WHEN preview command is executed, THE application SHALL serve the production build locally for testing
5. WHEN the application is built, THE build SHALL include source maps for debugging
6. WHEN static assets are referenced, THE application SHALL use Vite's asset handling for proper hashing
7. WHEN the application is deployed, THE deployment SHALL serve the dist/ folder as a static site
8. WHEN the application is deployed, THE server SHALL be configured for SPA routing (redirect all routes to index.html)
## Technical Constraints

1. **Framework**: Vue.js 3.4+ with Composition API
2. **Build Tool**: Vite 5+
3. **State Management**: Pinia 2+
4. **Router**: Vue Router 4+
5. **HTTP Client**: Axios 1.6+
6. **Styling**: Tailwind CSS 3.4+
7. **Node Version**: Node.js 18+ with npm 9+
8. **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
9. **TypeScript**: Optional but recommended for type safety
10. **Package Manager**: npm or pnpm

## Non-Functional Requirements

1. **Performance**: Initial page load under 2 seconds on 3G connection
2. **Bundle Size**: JavaScript bundle under 500KB gzipped
3. **Lighthouse Score**: Target 90+ for Performance, Accessibility, Best Practices, SEO
4. **Code Quality**: ESLint and Prettier configured with consistent rules
5. **Testing**: Vitest configured for unit testing (implementation optional)
6. **Security**: No sensitive data in client-side code, JWT tokens stored securely
7. **SEO**: Proper meta tags, Open Graph tags, and semantic HTML
8. **Documentation**: README with setup instructions, component documentation with JSDoc comments

## API Endpoints Reference

The frontend will integrate with these backend endpoints:

**Authentication:**
- POST /auth/register
- POST /auth/login

**Movies (Admin):**
- GET /movies
- POST /movies
- GET /movies/{id}
- PUT /movies/{id}
- DELETE /movies/{id}

**Videogames (Admin):**
- GET /videogames
- POST /videogames
- GET /videogames/{id}
- PUT /videogames/{id}
- DELETE /videogames/{id}

**Chat (Public):**
- POST /chat

**Statistics (Admin):**
- GET /statistics

All authenticated requests must include: `Authorization: Bearer <JWT_TOKEN>`