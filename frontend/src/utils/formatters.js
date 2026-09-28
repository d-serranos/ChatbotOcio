/**
 * Utility functions for formatting data
 */

/**
 * Format a date string or Date object to a human-readable time
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted time string (e.g., "2:30 PM" or "Jan 15, 2:30 PM")
 */
export function formatTime(date) {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  const now = new Date()
  const isToday = dateObj.toDateString() === now.toDateString()
  
  const timeOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  }
  
  if (isToday) {
    // Just show time for today's messages
    return dateObj.toLocaleTimeString('en-US', timeOptions)
  } else {
    // Show date and time for older messages
    return dateObj.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      ...timeOptions
    })
  }
}

/**
 * Convert URLs in text to clickable HTML links
 * @param {string} text - The text containing URLs
 * @returns {string} HTML string with URLs converted to anchor tags
 */
export function linkifyText(text) {
  if (!text) return ''
  
  // Regular expression to match URLs
  const urlPattern = /(https?:\/\/[^\s]+)/g
  
  // Replace URLs with anchor tags
  return text.replace(urlPattern, (url) => {
    // Remove trailing punctuation that shouldn't be part of the link
    let cleanUrl = url
    let trailingPunctuation = ''
    
    const punctuationMatch = url.match(/([.,;:!?]+)$/)
    if (punctuationMatch) {
      trailingPunctuation = punctuationMatch[1]
      cleanUrl = url.slice(0, -trailingPunctuation.length)
    }
    
    return `<a href="${cleanUrl}" target="_blank" rel="noopener noreferrer" class="underline hover:text-blue-700">${cleanUrl}</a>${trailingPunctuation}`
  })
}

/**
 * Format a number with thousand separators
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  return num.toLocaleString('en-US')
}

/**
 * Format a date to YYYY-MM-DD format
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  if (isNaN(dateObj.getTime())) {
    return ''
  }
  
  return dateObj.toISOString().split('T')[0]
}
