import { describe, it, expect } from 'vitest'
import worker from './index'
import { createMockRequest, createMockContext, mockCf } from './test-utils'

describe('Worker', () => {
  it('should return HTML dashboard on root', async () => {
    const req = createMockRequest('http://example.com/')
    const res = await worker.fetch(req, {}, createMockContext())

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')
    const text = await res.text()
    expect(text).toContain('Request Inspector')
    expect(text).toContain('Client Fingerprint')
    // Verify some mock data is rendered
    expect(text).toContain('San Angelo')
    expect(text).toContain('US')
  })

  it('should return JSON details on /json', async () => {
    const req = createMockRequest('http://example.com/json', {
        headers: { 'x-test-header': 'foobar' }
    }, mockCf)

    const env = {}
    const ctx = createMockContext()

    const res = await worker.fetch(req, env, ctx)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('application/json')

    const data = await res.json() as any
    expect(data.requestHeaders['x-test-header']).toBe('foobar')

    // Verify mocked CF data
    expect(data.country).toBe('US')
    expect(data.colo).toBe('DFW')
    expect(data.botManagement.score).toBe(99)
  })

  it('should return client IP on /ip', async () => {
    const req = createMockRequest('http://example.com/ip', {
        headers: { 'CF-Connecting-IP': '1.2.3.4' }
    })
    const res = await worker.fetch(req, {}, createMockContext())
    expect(await res.text()).toBe('1.2.3.4')
  })

  it('should echo custom status code', async () => {
    const req = createMockRequest('http://example.com/status/418')
    const res = await worker.fetch(req, {}, createMockContext())
    expect(res.status).toBe(418)
    expect(await res.text()).toContain('Returned status: 418')
  })

  it('should handle invalid status code gracefully', async () => {
    const req = createMockRequest('http://example.com/status/999')
    const res = await worker.fetch(req, {}, createMockContext())
    // Expect 400 Bad Request
    expect(res.status).toBe(400)
  })

  it('should echo user agent', async () => {
    const req = createMockRequest('http://example.com/user-agent', {
        headers: { 'User-Agent': 'Vitest-Agent' }
    })
    const res = await worker.fetch(req, {}, createMockContext())
    expect(await res.text()).toBe('Vitest-Agent')
  })

  it('should escape HTML in headers to prevent XSS', async () => {
    const malicious = "<script>alert('XSS')</script>"
    const req = createMockRequest('http://example.com/', {
        headers: { 'X-Malicious': malicious }
    })
    const res = await worker.fetch(req, {}, createMockContext())
    const text = await res.text()

    // Should NOT contain the raw script tag
    expect(text).not.toContain(malicious)
    // Should contain the escaped version
    // Hono JSX escapes single quotes as &#39;
    expect(text).toContain("&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;")
  })
})
