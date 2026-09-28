# Layout Components

This directory contains the main layout components for the ChatbotOcio frontend application.

## Components

### NavigationBar.vue

The main navigation bar component that appears at the top of all pages.

**Features:**
- Displays logo/brand on the left
- Shows navigation links: Home, Movies, Videogames
- Displays UserMenu component on the right when authenticated
- Shows Login/Register buttons when not authenticated
- Implements responsive hamburger menu for mobile (< 768px)
- Highlights active route using router.currentRoute
- Uses Tailwind responsive classes (hidden md:flex)

**Usage:**
```vue
<template>
  <div>
    <NavigationBar />
    <main>
      <!-- Page content -->
    </main>
  </div>
</template>

<script setup>
import { NavigationBar } from '@/components/layout'
</script>
```

**Props:** None

**Events:** None

**Dependencies:**
- `@/stores/auth` - Authentication store for user state
- `@/components/auth/UserMenu.vue` - User dropdown menu
- `vue-router` - For navigation and route detection

### Sidebar.vue

The sidebar navigation component for admin pages.

**Features:**
- Shows admin navigation links: Dashboard, Movies, Videogames, Statistics
- Highlights active route
- Uses vertical layout
- Includes admin badge/indicator
- Provides "Back to Main Site" link

**Usage:**
```vue
<template>
  <div class="flex">
    <Sidebar />
    <main class="flex-1">
      <!-- Admin page content -->
    </main>
  </div>
</template>

<script setup>
import { Sidebar } from '@/components/layout'
</script>
```

**Props:** None

**Events:** None

**Dependencies:**
- `vue-router` - For navigation and route detection

### Footer.vue

The footer component that appears at the bottom of pages.

**Features:**
- Shows copyright and current year
- Displays quick links to main pages
- Includes social media links (GitHub, Twitter, Email)
- Shows legal links (Privacy Policy, Terms of Service, Cookie Policy)
- Responsive layout (stacks on mobile)

**Usage:**
```vue
<template>
  <div class="flex flex-col min-h-screen">
    <NavigationBar />
    <main class="flex-1">
      <!-- Page content -->
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { NavigationBar, Footer } from '@/components/layout'
</script>
```

**Props:** None

**Events:** None

**Dependencies:** None

## Responsive Behavior

### NavigationBar
- **Desktop (≥ 768px):** Full navigation bar with horizontal links
- **Mobile (< 768px):** Hamburger menu with slide-down navigation

### Sidebar
- **All sizes:** Fixed 256px width (w-64)
- Consider making it collapsible in future iterations for mobile admin views

### Footer
- **Desktop (≥ 768px):** 3-column grid layout
- **Tablet (≥ 768px):** 2-column layout for bottom section
- **Mobile (< 768px):** Single column stacked layout

## Styling

All components use Tailwind CSS utility classes for styling. Key design tokens:

- **Primary color:** Blue-600 (`bg-blue-600`, `text-blue-600`)
- **Text colors:** Gray-900 (headings), Gray-700 (body), Gray-500 (muted)
- **Background:** White for components, Gray-50 for page backgrounds
- **Spacing:** Consistent padding and margins using Tailwind scale
- **Transitions:** 200ms duration for hover effects

## Accessibility

All components follow accessibility best practices:

- Semantic HTML elements (`<nav>`, `<aside>`, `<footer>`)
- ARIA labels for icon-only buttons
- Keyboard navigation support
- Focus indicators for interactive elements
- Screen reader friendly navigation
- Proper heading hierarchy

## Testing

To test these components:

1. **NavigationBar:**
   - Visit any page and verify navigation appears correctly
   - Test mobile responsiveness by resizing browser
   - Login and verify UserMenu appears
   - Logout and verify Login/Register buttons appear
   - Click navigation links and verify active state highlighting

2. **Sidebar:**
   - Navigate to any `/admin/*` route
   - Verify sidebar appears on the left
   - Click each admin link and verify active state
   - Test "Back to Main Site" link

3. **Footer:**
   - Scroll to bottom of any page with footer
   - Verify all links are clickable
   - Test responsive layout by resizing browser
   - Verify copyright year is current

## Future Enhancements

- Add breadcrumb navigation component
- Add collapsible sidebar for mobile admin views
- Add search functionality to navigation bar
- Add notifications bell icon for admin users
- Add theme toggle (light/dark mode)
- Add language selector for i18n support
