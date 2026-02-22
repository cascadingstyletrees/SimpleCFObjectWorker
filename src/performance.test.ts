import { describe, it, expect } from 'vitest'
import worker from './index'
import { createMockRequest, createMockContext } from './test-utils'

describe('Performance Improvement', () => {
  it('should use local CSS instead of CDN', async () => {
    const req = createMockRequest('http://example.com/')
    const res = await worker.fetch(req, {}, createMockContext())
    const text = await res.text()

    // Expect Tailwind CDN to be GONE
    expect(text).not.toContain('https://cdn.tailwindcss.com')

    // Expect inline configuration to be GONE
    expect(text).not.toContain('tailwind.config = {')

    // Expect local CSS link to be PRESENT
    // Hono might render without self-closing slash
    expect(text).toContain('href="/assets/style.css"')
    expect(text).toContain('<link')
  })

  it('should serve the generated CSS file', async () => {
    const req = createMockRequest('http://example.com/assets/style.css')
    const res = await worker.fetch(req, {}, createMockContext())

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/css')

    const cssText = await res.text()
    // Verify it looks like CSS
    expect(cssText).toContain('.text-orange-500')
    expect(cssText).toContain('.bg-gray-100')
  })
})
