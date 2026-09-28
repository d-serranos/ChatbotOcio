# Manual Testing Checklist

**Purpose:** Execute comprehensive manual tests for all user flows  
**Date:** _______________  
**Tester:** _______________  
**Environment:** Development / Production (circle one)  

---

## Prerequisites

### Backend Setup
- [ ] Backend server is running (`docker-compose up -d` in backend directory)
- [ ] Backend is accessible at `http://localhost:8000`
- [ ] Swagger UI loads at `http://localhost:8000/docs`
- [ ] Database is initialized with test data

### Frontend Setup
- [ ] Frontend dev server is running (`npm run dev` in frontend directory)
- [ ] Frontend loads at `http://localhost:5173`
- [ ] No console errors on initial load
- [ ] Environment variables configured in `.env`

### Test Accounts
Create these test accounts before testing:

**Regular User:**
- Email: `user@test.com`
- Password: `user123456`
- Role: user

**Admin User:**
- Email: `admin@test.com`
- Password: `admin123456`
- Role: admin

---

## Test Suite 1: Guest User Flow

**Objective:** Verify guest users can browse public content and use chat

### 1.1 Homepage Access
- [ ] Navigate to `http://localhost:5173`
- [ ] Page loads within 2 seconds
- [ ] Navigation bar displays "Login" and "Register" buttons
- [ ] Chat interface is visible
- [ ] No console errors

**Expected:** Home page loads successfully for unauthenticated users

### 1.2 Chat Functionality (Guest)
- [ ] Type a message in chat input: "Recomiéndame películas de acción"
- [ ] Click send or press Enter
- [ ] User message appears immediately in chat history
- [ ] Loading indicator (typing animation) appears
- [ ] Assistant response appears within 5 seconds
- [ ] Message formatting is correct (user vs assistant styling)
- [ ] Timestamp displays correctly
- [ ] Chat auto-scrolls to latest message

**Expected:** Guest users can send messages and receive responses

### 1.3 Movies Catalog (Guest)
- [ ] Click "Movies" in navigation or navigate to `/catalog/movies`
- [ ] Page loads within 2 seconds
- [ ] Grid of movie cards displays
- [ ] Each card shows: title, genre, platform, year, director, rating
- [ ] Skeleton loaders appear before data loads
- [ ] Click on a movie card
- [ ] Detail modal/page opens with full information
- [ ] Close detail view
- [ ] Returns to catalog

**Expected:** Guests can browse movie catalog

### 1.4 Videogames Catalog (Guest)
- [ ] Navigate to `/catalog/videogames`
- [ ] Grid of videogame cards displays
- [ ] Each card shows: title, genre, platform, year, classification, developer
- [ ] Click on a videogame card
- [ ] Detail modal opens
- [ ] Classification badge has correct color (E=green, T=yellow, M=orange)

**Expected:** Guests can browse videogame catalog

### 1.5 Catalog Filters
- [ ] On movies or videogames page, use genre filter dropdown
- [ ] Select a genre
- [ ] Catalog updates to show only matching items
- [ ] Use platform filter
- [ ] Catalog updates again
- [ ] Use year filter
- [ ] Catalog updates
- [ ] Clear all filters
- [ ] Catalog shows all items again

**Expected:** Filters work correctly and update catalog

### 1.6 Pagination
- [ ] If catalog has multiple pages, pagination controls appear
- [ ] Click "Next" button
- [ ] Page 2 loads with different items
- [ ] Page number updates (e.g., "Page 2 of 5")
- [ ] Click page number directly (e.g., "3")
- [ ] That page loads
- [ ] Click "Previous"
- [ ] Previous page loads
- [ ] On first page, "Previous" is disabled
- [ ] On last page, "Next" is disabled

**Expected:** Pagination works correctly

### 1.7 Admin Route Protection (Guest)
- [ ] Navigate to `/admin/movies`
- [ ] Page redirects to `/login`
- [ ] Toast/message displays: "Please log in to access this page"
- [ ] Return URL parameter is set: `/login?redirect=/admin/movies`

**Expected:** Admin routes redirect guests to login

---

## Test Suite 2: User Registration & Authentication

**Objective:** Verify user registration and login workflows

### 2.1 Registration
- [ ] Navigate to `/register`
- [ ] Registration form displays with fields: name, email, password, confirm password
- [ ] Fill in all fields:
  - Name: "Test User"
  - Email: `testuser_${timestamp}@example.com`
  - Password: "Test123456!"
  - Confirm Password: "Test123456!"
- [ ] Click "Register" button
- [ ] Button shows loading state during request
- [ ] Success toast appears: "Registration successful!"
- [ ] User is automatically logged in
- [ ] Redirects to homepage `/`
- [ ] Navigation shows user name and "Logout" button
- [ ] Token is stored in localStorage

**Expected:** New users can register successfully

### 2.2 Registration Validation
- [ ] Navigate to `/register`
- [ ] Try to submit with empty fields
- [ ] Validation errors appear for each empty field
- [ ] Try email without @ symbol: "invalidemail"
- [ ] Email validation error displays
- [ ] Try password less than 6 characters: "123"
- [ ] Password validation error displays
- [ ] Try non-matching confirm password
- [ ] Confirmation error displays
- [ ] Fix all errors and submit successfully

**Expected:** Form validation prevents invalid submissions

### 2.3 Registration - Duplicate Email
- [ ] Try to register with existing email
- [ ] Error message displays: "Email already registered"
- [ ] User remains on registration page
- [ ] Can edit email and retry

**Expected:** Duplicate email registrations are prevented

### 2.4 Login
- [ ] Navigate to `/login`
- [ ] Login form displays with email and password fields
- [ ] Enter credentials:
  - Email: `user@test.com`
  - Password: `user123456`
- [ ] Click "Login" button
- [ ] Button shows loading state
- [ ] Success toast appears: "Login successful!"
- [ ] Redirects to homepage
- [ ] Navigation shows user name and "Logout" button
- [ ] Token is stored in localStorage

**Expected:** Users can log in with valid credentials

### 2.5 Login - Invalid Credentials
- [ ] Navigate to `/login`
- [ ] Enter wrong password
- [ ] Click "Login"
- [ ] Error message displays: "Invalid credentials" or similar
- [ ] User remains on login page
- [ ] Password field is cleared for security

**Expected:** Invalid login attempts show error

### 2.6 Login with Return URL
- [ ] While logged out, navigate to `/admin/movies`
- [ ] Redirects to `/login?redirect=/admin/movies`
- [ ] Log in with admin credentials
- [ ] After successful login, redirects to `/admin/movies` (the return URL)

**Expected:** After login, user returns to intended page

### 2.7 Logout
- [ ] While logged in, click "Logout" button
- [ ] Token is removed from localStorage
- [ ] Redirects to `/login` page
- [ ] Navigation shows "Login" and "Register" buttons
- [ ] Try to navigate to `/admin/movies`
- [ ] Redirects back to login

**Expected:** Logout clears session and requires re-authentication

---

## Test Suite 3: Authenticated User Flow

**Objective:** Verify authenticated users can use all features

### 3.1 Authenticated Chat
- [ ] Log in as regular user
- [ ] Navigate to home `/`
- [ ] Send a chat message
- [ ] Verify message sends with authentication token (check Network tab)
- [ ] Response is received
- [ ] Chat history displays correctly

**Expected:** Authenticated chat includes JWT token

### 3.2 Persistent Login
- [ ] Log in as user
- [ ] Refresh the page (F5 or Ctrl+R)
- [ ] User remains logged in
- [ ] Name still displays in navigation
- [ ] Can still access protected features

**Expected:** Authentication persists across page refreshes

### 3.3 Token in localStorage
- [ ] Open browser DevTools > Application > Local Storage
- [ ] Find `token` key
- [ ] Value is a JWT token (long string)
- [ ] Decode token at jwt.io
- [ ] Token contains user email and role

**Expected:** JWT token is stored correctly

---

## Test Suite 4: Admin User Flow

**Objective:** Verify admin users can manage content

### 4.1 Admin Login
- [ ] Log out if logged in
- [ ] Navigate to `/login`
- [ ] Log in with admin credentials:
  - Email: `admin@test.com`
  - Password: `admin123456`
- [ ] Login successful
- [ ] Redirects to homepage
- [ ] Navigation shows admin name

**Expected:** Admin can log in

### 4.2 Admin Dashboard Access
- [ ] Navigate to `/admin`
- [ ] Admin dashboard loads
- [ ] Summary cards display (Total Movies, Total Videogames, Total Users)
- [ ] Quick action links visible
- [ ] Click "Manage Movies" link
- [ ] Navigates to `/admin/movies`

**Expected:** Admin dashboard displays overview

### 4.3 Movies Management - View
- [ ] On `/admin/movies` page
- [ ] Table displays list of movies
- [ ] Columns: Title, Genre, Platform, Year, Actions
- [ ] "Add Movie" button visible
- [ ] Search box visible
- [ ] Pagination visible if >10 movies

**Expected:** Movies table displays correctly

### 4.4 Movies Management - Search
- [ ] Type in search box: "Matrix"
- [ ] Table filters in real-time
- [ ] Only movies with "Matrix" in title show
- [ ] Clear search box
- [ ] All movies display again

**Expected:** Search functionality works

### 4.5 Movies Management - Create
- [ ] Click "Add Movie" button
- [ ] Modal opens with form
- [ ] Fill in all fields:
  - Title: "Test Movie Created"
  - Genre: "Action"
  - Platform: "Netflix"
  - Year: 2024
  - Director: "Test Director"
  - Duration: 120
  - Rating: 8.5
  - Synopsis: "This is a test movie"
- [ ] Click "Save" or "Create"
- [ ] Button shows loading state
- [ ] Success toast appears: "Movie created successfully"
- [ ] Modal closes
- [ ] Table refreshes automatically
- [ ] New movie appears in table

**Expected:** Admin can create movies

### 4.6 Movies Management - Create Validation
- [ ] Click "Add Movie"
- [ ] Try to submit with empty title
- [ ] Validation error appears
- [ ] Try invalid year: "1500"
- [ ] Error: "Year must be between 1888 and 2030"
- [ ] Try invalid rating: "15"
- [ ] Error: "Rating must be between 0 and 10"
- [ ] Fix errors and submit successfully

**Expected:** Form validation prevents invalid data

### 4.7 Movies Management - Edit
- [ ] Find the movie created in 4.5
- [ ] Click "Edit" button/icon
- [ ] Modal opens with form pre-filled with movie data
- [ ] Change title to "Test Movie Updated"
- [ ] Change rating to 9.0
- [ ] Click "Save"
- [ ] Success toast: "Movie updated successfully"
- [ ] Modal closes
- [ ] Table shows updated data

**Expected:** Admin can edit movies

### 4.8 Movies Management - Delete
- [ ] Find the test movie
- [ ] Click "Delete" button/icon
- [ ] Confirmation dialog appears: "Are you sure you want to delete this movie?"
- [ ] Click "Cancel"
- [ ] Dialog closes, movie still in table
- [ ] Click "Delete" again
- [ ] Click "Confirm" in dialog
- [ ] Success toast: "Movie deleted successfully"
- [ ] Table refreshes
- [ ] Movie is removed from table

**Expected:** Admin can delete movies with confirmation

### 4.9 Videogames Management
Repeat tests 4.3 to 4.8 for videogames at `/admin/videogames`

**Additional validation for videogames:**
- [ ] Classification dropdown shows: E, E10+, T, M, AO, RP
- [ ] Can only select valid classification
- [ ] Classification badge displays correct color

**Expected:** Admin can manage videogames similarly to movies

### 4.10 Statistics - View
- [ ] Navigate to `/admin/statistics`
- [ ] Page loads successfully
- [ ] Three summary cards display:
  - Total Tokens
  - Total Messages
  - Active Users
- [ ] Line chart displays "Token Consumption Over Time"
- [ ] Chart has data points (if any conversations exist)
- [ ] Table displays "Top Users by Token Consumption"
- [ ] Table columns: User Name, Message Count, Total Tokens

**Expected:** Statistics page displays analytics

### 4.11 Statistics - Date Range
- [ ] Find date range picker on statistics page
- [ ] Default range is last 30 days
- [ ] Click on start date picker
- [ ] Select a date 60 days ago
- [ ] Click on end date picker
- [ ] Select today
- [ ] Click "Apply" or date range updates automatically
- [ ] Chart updates with new date range
- [ ] Table updates with new date range
- [ ] Loading indicator shows during update

**Expected:** Date range filtering works

---

## Test Suite 5: Responsive Design

**Objective:** Verify application works on different screen sizes

### 5.1 Desktop (>1024px)
- [ ] Resize browser to full screen (>1024px width)
- [ ] Navigation is full horizontal bar
- [ ] Catalog grid shows 4 columns
- [ ] Chat interface is wide
- [ ] Admin tables display all columns
- [ ] No horizontal scroll

**Expected:** Optimal desktop layout

### 5.2 Tablet (768px - 1024px)
- [ ] Resize browser to ~900px width
- [ ] Navigation still horizontal or adjusted
- [ ] Catalog grid shows 2-3 columns
- [ ] Chat interface adapts
- [ ] Admin tables might scroll horizontally
- [ ] Forms are still usable

**Expected:** Tablet layout works

### 5.3 Mobile (<768px)
- [ ] Resize browser to ~375px width (or use DevTools mobile emulation)
- [ ] Navigation collapses to hamburger menu
- [ ] Click hamburger, menu opens
- [ ] Catalog grid shows 1 column
- [ ] Movie/videogame cards are full width
- [ ] Chat input is full width
- [ ] Modals take full screen
- [ ] Forms stack vertically
- [ ] Buttons are touch-friendly (minimum 44x44px)
- [ ] Text is readable (no tiny fonts)
- [ ] No horizontal scroll

**Expected:** Mobile layout is fully functional

---

## Test Suite 6: Accessibility

**Objective:** Verify application is accessible

### 6.1 Keyboard Navigation
- [ ] Navigate entire app using only Tab key
- [ ] Focus indicator is visible on all interactive elements
- [ ] Tab order is logical (top to bottom, left to right)
- [ ] Can activate buttons with Enter or Space
- [ ] Can close modals with Escape key
- [ ] Focus traps inside modal (Tab doesn't leave modal)
- [ ] After closing modal, focus returns to trigger button

**Expected:** Full keyboard accessibility

### 6.2 Form Labels
- [ ] Inspect login form
- [ ] Each input has associated `<label>` element
- [ ] Labels have `for` attribute matching input `id`
- [ ] Clicking label focuses input
- [ ] Repeat for registration form
- [ ] Repeat for movie/videogame forms

**Expected:** All form inputs are properly labeled

### 6.3 ARIA Labels
- [ ] Inspect navigation in DevTools
- [ ] Check for `aria-label` or `aria-labelledby` on navigation
- [ ] Check buttons have accessible names
- [ ] Icons have `aria-hidden="true"` or descriptive labels
- [ ] Modal has `role="dialog"` and `aria-modal="true"`

**Expected:** ARIA attributes are present

### 6.4 Color Contrast
- [ ] Use browser extension (e.g., axe DevTools)
- [ ] Run accessibility audit
- [ ] Check for contrast issues
- [ ] All text has minimum 4.5:1 contrast ratio
- [ ] Error messages use color + icon/text (not color alone)

**Expected:** Sufficient color contrast

### 6.5 Screen Reader (Optional)
If you have a screen reader (NVDA, JAWS, VoiceOver):
- [ ] Enable screen reader
- [ ] Navigate through app
- [ ] All content is announced
- [ ] Form labels are read
- [ ] Button purposes are clear
- [ ] Error messages are announced

**Expected:** Screen reader compatible

---

## Test Suite 7: Performance

**Objective:** Verify application meets performance targets

### 7.1 Initial Load Time
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Open DevTools > Network tab
- [ ] Reload page (Ctrl+R)
- [ ] Check "DOMContentLoaded" time
- [ ] Check "Load" time
- [ ] Total load time should be < 2 seconds on normal connection

**Expected:** Fast initial load

### 7.2 3G Simulation
- [ ] Open DevTools > Network tab
- [ ] Change throttling dropdown to "Slow 3G"
- [ ] Hard reload (Ctrl+Shift+R)
- [ ] Time until page is interactive
- [ ] Should be < 5 seconds (target was 2s, but 3G is very slow)
- [ ] Loading states should be visible
- [ ] Skeleton loaders appear

**Expected:** Acceptable performance on slow connection

### 7.3 Bundle Size
- [ ] Navigate to `frontend/dist/assets` folder
- [ ] Find main JavaScript file (largest .js file)
- [ ] Check file size
- [ ] Should be < 500KB (uncompressed)
- [ ] Gzipped size should be significantly smaller
- [ ] Check that route-based code splitting is working (multiple .js files for different routes)

**Expected:** Bundle size within target

### 7.4 Lighthouse Audit
- [ ] Build production version: `npm run build && npm run preview`
- [ ] Open Chrome DevTools > Lighthouse tab
- [ ] Select all categories: Performance, Accessibility, Best Practices, SEO
- [ ] Select "Desktop"
- [ ] Click "Analyze page load"
- [ ] Wait for audit to complete
- [ ] Record scores:
  - Performance: _____ (target: 90+)
  - Accessibility: _____ (target: 90+)
  - Best Practices: _____ (target: 90+)
  - SEO: _____ (target: 90+)
- [ ] Repeat for "Mobile"
  - Performance: _____ (target: 90+)
  - Accessibility: _____ (target: 90+)
  - Best Practices: _____ (target: 90+)
  - SEO: _____ (target: 90+)

**Expected:** All scores 90+

### 7.5 Route Navigation Speed
- [ ] Clear throttling (set to "No throttling")
- [ ] Navigate between routes:
  - Home → Movies → Videogames → Admin → Statistics
- [ ] Each route change should be < 500ms
- [ ] No visible delays
- [ ] Smooth transitions

**Expected:** Fast route navigation

---

## Test Suite 8: Error Handling

**Objective:** Verify graceful error handling

### 8.1 Network Error
- [ ] Open DevTools > Network tab
- [ ] Enable "Offline" mode
- [ ] Try to send a chat message
- [ ] Error message displays: "Unable to connect to the server"
- [ ] Disable offline mode
- [ ] Try again, message sends successfully

**Expected:** Network errors show user-friendly message

### 8.2 Backend Down
- [ ] Stop backend server
- [ ] Try to fetch movies catalog
- [ ] Error message displays
- [ ] Try to login
- [ ] Error message displays
- [ ] Restart backend
- [ ] Retry operation, works successfully

**Expected:** Backend unavailability handled gracefully

### 8.3 Invalid Token
- [ ] Open DevTools > Application > Local Storage
- [ ] Find `token` key
- [ ] Change value to "invalid-token-string"
- [ ] Try to access admin page
- [ ] Should redirect to login with message "Session expired"
- [ ] Or shows "Invalid token" error
- [ ] Token is cleared from localStorage
- [ ] Log in again successfully

**Expected:** Invalid tokens are detected and cleared

### 8.4 API Error Messages
- [ ] Try to create a movie with year 1500
- [ ] Error displays: "Year must be between 1888 and 2030"
- [ ] Error appears near the year field (not generic alert)
- [ ] Try to create movie with missing title
- [ ] Error displays: "Title is required" or similar
- [ ] Multiple errors can display simultaneously

**Expected:** Validation errors are specific and helpful

---

## Test Suite 9: Security

**Objective:** Verify security best practices

### 9.1 Protected Routes
- [ ] Ensure logged out
- [ ] Try to navigate to `/admin/movies` directly in address bar
- [ ] Redirects to `/login`
- [ ] Try to navigate to `/admin/videogames`
- [ ] Redirects to `/login`
- [ ] Try to navigate to `/admin/statistics`
- [ ] Redirects to `/login`

**Expected:** Protected routes require authentication

### 9.2 Role-Based Access
- [ ] Log in as regular user (not admin)
- [ ] Try to navigate to `/admin/movies`
- [ ] Should redirect to home with error: "Admin access required"
- [ ] Log out
- [ ] Log in as admin
- [ ] Navigate to `/admin/movies`
- [ ] Access granted

**Expected:** Admin routes require admin role

### 9.3 Token Security
- [ ] Open DevTools > Application > Local Storage
- [ ] Verify token is stored (necessary for auth)
- [ ] Open Network tab
- [ ] Make an authenticated request (e.g., create movie)
- [ ] Check request headers
- [ ] `Authorization: Bearer <token>` header is present
- [ ] Token is NOT sent in URL query parameters
- [ ] Token is NOT sent in request body (only in headers)

**Expected:** Token transmitted securely

### 9.4 Password Visibility
- [ ] Navigate to login page
- [ ] Password field type is "password" (dots, not plain text)
- [ ] If there's a "show password" toggle, test it
- [ ] Click toggle, password becomes visible
- [ ] Click again, password hidden again

**Expected:** Passwords are masked by default

---

## Test Suite 10: Edge Cases

**Objective:** Test unusual scenarios

### 10.1 Empty States
- [ ] Access catalog when no movies exist (delete all via admin if needed)
- [ ] Message displays: "No movies found"
- [ ] Not a broken/blank page
- [ ] Repeat for videogames

**Expected:** Empty states handled

### 10.2 Long Text
- [ ] Create a movie with very long title (200+ characters)
- [ ] Card should truncate or wrap text gracefully
- [ ] No layout breaking
- [ ] Create movie with very long synopsis (1000+ characters)
- [ ] Detail view displays full text
- [ ] Scrollable if needed

**Expected:** Long text doesn't break layout

### 10.3 Special Characters
- [ ] Create movie with special characters in title: "Test & Movie <2024>"
- [ ] Title displays correctly (not encoded as `&amp;`)
- [ ] No XSS vulnerabilities (script tags don't execute)

**Expected:** Special characters handled safely

### 10.4 Rapid Clicking
- [ ] Click "Add Movie" button rapidly 5 times
- [ ] Only one modal opens
- [ ] Button is disabled during request
- [ ] Submit form, click submit rapidly
- [ ] Only one request is sent (check Network tab)

**Expected:** Prevents duplicate submissions

### 10.5 Large Datasets
- [ ] If possible, create 100+ movies
- [ ] Pagination should handle large dataset
- [ ] No performance issues scrolling
- [ ] Search still works efficiently

**Expected:** Handles large datasets

---

## Results Summary

### Test Statistics
- Total tests: _____
- Passed: _____
- Failed: _____
- Skipped: _____

### Critical Issues Found
1. _____________________________________
2. _____________________________________
3. _____________________________________

### Non-Critical Issues Found
1. _____________________________________
2. _____________________________________
3. _____________________________________

### Performance Scores
- Desktop Lighthouse Performance: _____
- Desktop Lighthouse Accessibility: _____
- Mobile Lighthouse Performance: _____
- Mobile Lighthouse Accessibility: _____
- Bundle Size: _____ KB
- Initial Load Time: _____ seconds
- 3G Load Time: _____ seconds

### Browser Compatibility Tested
- [ ] Chrome (version: _____)
- [ ] Firefox (version: _____)
- [ ] Safari (version: _____)
- [ ] Edge (version: _____)

### Recommendations
1. _____________________________________
2. _____________________________________
3. _____________________________________

---

## Sign-Off

**Tester Name:** _____________________  
**Date:** _____________________  
**Status:** Pass / Fail / Pass with Issues (circle one)  

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
_____________________________________________
