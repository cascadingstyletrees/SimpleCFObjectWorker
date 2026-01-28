import { describe, it, expect } from 'vitest'
import worker from './index'

describe('UX Improvements', () => {
  it('should include Inter font and updated CSS', async () => {
    const req = new Request('http://example.com/')
    const res = await worker.fetch(req, {}, {} as any)
    const text = await res.text()

    // Check for Inter font link
    expect(text).toContain('href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap"')

    // Check for CSS font-family update
    expect(text).toContain("font-family: 'Inter'")

    // Check for updated background color
    expect(text).toContain('--bg: #0f172a')
  })

  it('should not limit height of headers section', async () => {
    const req = new Request('http://example.com/')
    const res = await worker.fetch(req, {}, {} as any)
    const text = await res.text()

    // Ensure the inline styles causing the scrollbar are removed
    expect(text).not.toContain('max-height: 400px')
    expect(text).not.toContain('overflow-y: auto')
  })
})
