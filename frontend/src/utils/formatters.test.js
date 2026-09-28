import { describe, it, expect, beforeEach, vi } from 'vitest'
import { formatTime, linkifyText, formatNumber, formatDate } from './formatters'

describe('formatters', () => {
  describe('formatTime', () => {
    it('returns empty string for null or undefined', () => {
      expect(formatTime(null)).toBe('')
      expect(formatTime(undefined)).toBe('')
    })
    
    it('returns empty string for invalid date', () => {
      expect(formatTime('invalid-date')).toBe('')
    })
    
    it('formats today\'s date with time only', () => {
      const now = new Date()
      const result = formatTime(now)
      
      // Should contain time but not date
      expect(result).toMatch(/\d{1,2}:\d{2}\s[AP]M/)
      expect(result).not.toMatch(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/)
    })
    
    it('formats older date with date and time', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      const result = formatTime(yesterday)
      
      // Should contain both date and time
      expect(result).toMatch(/[A-Z][a-z]{2}\s\d{1,2}/)
      expect(result).toMatch(/\d{1,2}:\d{2}\s[AP]M/)
    })
    
    it('accepts string date format', () => {
      const dateString = '2024-01-15T10:30:00Z'
      const result = formatTime(dateString)
      
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })
  })
  
  describe('linkifyText', () => {
    it('returns empty string for null or undefined', () => {
      expect(linkifyText(null)).toBe('')
      expect(linkifyText(undefined)).toBe('')
    })
    
    it('returns unchanged text when no URLs', () => {
      const text = 'Hello world, this is a test'
      expect(linkifyText(text)).toBe(text)
    })
    
    it('converts HTTP URLs to links', () => {
      const text = 'Check out http://example.com'
      const result = linkifyText(text)
      
      expect(result).toContain('<a href="http://example.com"')
      expect(result).toContain('target="_blank"')
      expect(result).toContain('rel="noopener noreferrer"')
    })
    
    it('converts HTTPS URLs to links', () => {
      const text = 'Visit https://example.com for more'
      const result = linkifyText(text)
      
      expect(result).toContain('<a href="https://example.com"')
    })
    
    it('handles multiple URLs in text', () => {
      const text = 'Visit https://example.com and http://test.com'
      const result = linkifyText(text)
      
      expect(result).toContain('href="https://example.com"')
      expect(result).toContain('href="http://test.com"')
    })
    
    it('handles trailing punctuation correctly', () => {
      const text = 'Check this out: https://example.com.'
      const result = linkifyText(text)
      
      expect(result).toContain('href="https://example.com"')
      expect(result).toContain('</a>.')
      expect(result).not.toContain('example.com."')
    })
    
    it('adds proper CSS classes to links', () => {
      const text = 'Visit https://example.com'
      const result = linkifyText(text)
      
      expect(result).toContain('class="underline hover:text-blue-700"')
    })
  })
  
  describe('formatNumber', () => {
    it('returns "0" for null or undefined', () => {
      expect(formatNumber(null)).toBe('0')
      expect(formatNumber(undefined)).toBe('0')
    })
    
    it('formats number with thousand separators', () => {
      expect(formatNumber(1000)).toBe('1,000')
      expect(formatNumber(1000000)).toBe('1,000,000')
    })
    
    it('handles small numbers', () => {
      expect(formatNumber(42)).toBe('42')
      expect(formatNumber(999)).toBe('999')
    })
    
    it('handles zero', () => {
      expect(formatNumber(0)).toBe('0')
    })
  })
  
  describe('formatDate', () => {
    it('returns empty string for null or undefined', () => {
      expect(formatDate(null)).toBe('')
      expect(formatDate(undefined)).toBe('')
    })
    
    it('returns empty string for invalid date', () => {
      expect(formatDate('invalid')).toBe('')
    })
    
    it('formats date to YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const result = formatDate(date)
      
      expect(result).toBe('2024-01-15')
    })
    
    it('accepts string date format', () => {
      const dateString = '2024-01-15T10:30:00Z'
      const result = formatDate(dateString)
      
      expect(result).toBe('2024-01-15')
    })
  })
})
