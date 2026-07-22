import { describe, it, expect } from 'vitest'
import worker from './index'

describe('Performance Optimization', () => {
  it('should defer blocking external scripts to improve rendering', async () => {
    const req = new Request('http://example.com/')
    const res = await worker.fetch(req, {}, {} as any)
    const html = await res.text()

    // Assert that the critical scripts have the 'defer' attribute
    // These checks should FAIL initially
    const blockingScripts = [
      'https://unpkg.com/web-animations-js@2.3.2/web-animations.min.js',
      'https://cdn.jsdelivr.net/npm/muuri@0.9.5/dist/muuri.min.js',
      'https://cdn.tailwindcss.com'
    ]

    blockingScripts.forEach(script => {
      // Check for <script src="..." defer></script> or similar pattern
      // Hono JSX usually renders attributes in order, but we should be flexible
      // We look for the script src and ensure 'defer' is present in the tag
      const scriptTagRegex = new RegExp(`<script[^>]*src="${script.replace(/\./g, '\\.')}"[^>]*defer[^>]*>`, 'i')
      // Also check for defer before src
      const scriptTagRegex2 = new RegExp(`<script[^>]*defer[^>]*src="${script.replace(/\./g, '\\.')}"[^>]*>`, 'i')

      const hasDefer = scriptTagRegex.test(html) || scriptTagRegex2.test(html)

      expect(hasDefer, `Script ${script} should have 'defer' attribute`).toBe(true)
    })
  })
})
