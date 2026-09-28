# Chat Components

This directory contains all chat-related UI components for the ChatbotOcio application.

## Components

### ChatMessage.vue

Displays a single chat message bubble with proper styling and formatting.

**Props:**
- `message` (Object, required): Message object with the following structure:
  - `rol` (String): Either 'user' or 'assistant'
  - `contenido` (String): The message content
  - `fecha` (String|Date): Timestamp of the message

**Features:**
- Automatic alignment (user messages on right, assistant on left)
- Color-coded backgrounds (blue for user, gray for assistant)
- Clickable URL links
- Formatted timestamps
- Smooth fade-in animation

**Example:**
```vue
<ChatMessage 
  :message="{
    rol: 'user',
    contenido: 'Hello, can you recommend a movie?',
    fecha: '2024-01-15T10:30:00Z'
  }"
/>
```

---

### ChatInput.vue

Message input field with send button and character counter.

**Props:**
- `disabled` (Boolean, default: false): Disables input and shows loading spinner

**Emits:**
- `send(message)`: Emitted when user sends a message

**Features:**
- 10,000 character limit with counter
- Auto-resizing textarea based on content
- Enter to send (Shift+Enter for new line)
- Disabled state with loading spinner
- Auto-focus on mount
- Input cleared after sending

**Example:**
```vue
<ChatInput 
  :disabled="loading"
  @send="handleSendMessage"
/>
```

---

### ChatHistory.vue

Container for displaying chat message history with auto-scroll.

**Props:**
- `messages` (Array, default: []): Array of message objects

**Features:**
- Auto-scroll to bottom on new messages
- Custom scrollbar styling
- Smooth scrolling behavior
- Responsive container

**Exposed Methods:**
- `scrollToBottom()`: Manually scroll to bottom
- `isAtBottom()`: Check if user is at bottom of scroll

**Example:**
```vue
<ChatHistory :messages="chatMessages" ref="historyRef" />

<script setup>
const historyRef = ref(null)

// Manually scroll to bottom
historyRef.value?.scrollToBottom()
</script>
```

---

### TypingIndicator.vue

Animated "..." indicator shown while assistant is typing.

**Props:** None

**Features:**
- Animated three-dot bounce effect
- Matches assistant message styling
- Pure CSS animation

**Example:**
```vue
<TypingIndicator v-if="isAssistantTyping" />
```

---

### WelcomeMessage.vue

Welcome screen displayed when chat is empty.

**Props:** None

**Features:**
- Explains chatbot capabilities
- Lists features with icons
- Provides example prompts
- Responsive layout

**Example:**
```vue
<WelcomeMessage v-if="messages.length === 0" />
```

---

## Utility Functions

The chat components use utility functions from `@/utils/formatters.js`:

### formatTime(date)

Formats a date/time for display in chat messages.
- Returns time only for today's messages (e.g., "2:30 PM")
- Returns date and time for older messages (e.g., "Jan 15, 2:30 PM")

### linkifyText(text)

Converts URLs in text to clickable HTML anchor tags.
- Detects http:// and https:// URLs
- Opens links in new tab with security attributes
- Handles trailing punctuation correctly

---

## Usage Example

Complete chat interface setup:

```vue
<template>
  <div class="flex flex-col h-screen">
    <WelcomeMessage v-if="messages.length === 0" />
    
    <ChatHistory 
      v-else
      :messages="messages" 
      class="flex-1"
    />
    
    <TypingIndicator v-if="loading" />
    
    <ChatInput 
      :disabled="loading"
      @send="handleSendMessage"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ChatMessage,
  ChatInput,
  ChatHistory,
  TypingIndicator,
  WelcomeMessage
} from '@/components/chat'

const messages = ref([])
const loading = ref(false)

const handleSendMessage = async (message) => {
  // Add user message
  messages.value.push({
    rol: 'user',
    contenido: message,
    fecha: new Date().toISOString()
  })
  
  loading.value = true
  
  try {
    // Call API
    const response = await chatService.sendMessage(message)
    
    // Add assistant response
    messages.value.push({
      rol: 'assistant',
      contenido: response.contenido,
      fecha: new Date().toISOString()
    })
  } catch (error) {
    console.error('Failed to send message:', error)
  } finally {
    loading.value = false
  }
}
</script>
```

---

## Testing

All components have unit tests using Vitest and Vue Test Utils:

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui
```

Test files:
- `ChatMessage.test.js`
- `ChatInput.test.js`
- `ChatHistory.test.js`

---

## Requirements Validation

These components satisfy the following requirements from `frontend_requirements.md`:

- **Requirement 4.1**: Display modern chat interface
- **Requirement 4.3**: Enable send button only when message is valid
- **Requirement 4.9**: Auto-scroll to latest message
- **Requirement 4.10**: Clear chat history on refresh (handled by parent view)
- **Requirement 4.11**: Differentiate user/assistant messages with styling
- **Requirement 4.12**: Render URLs as clickable links
- **Requirement 4.13**: Support Enter to send, Shift+Enter for new line
