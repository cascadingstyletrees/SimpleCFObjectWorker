import { describe, it, expect } from 'vitest'
import worker from './index'

describe('Worker', () => {
  it('should return HTML dashboard on root', async () => {
    const req = new Request('http://example.com/')
    const res = await worker.fetch(req, {}, {} as any)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')
    const text = await res.text()
    expect(text).toContain('Request Inspector')
    expect(text).toContain('Client-Side Fingerprint')
  })

  it('should return JSON details on /json', async () => {
    const req = new Request('http://example.com/json', {
        headers: { 'x-test-header': 'foobar' }
    })
    // Mock cf object
    const env = {}
    const ctx = { waitUntil: () => {}, passThroughOnException: () => {} }
    // Hono handles the fetch, but for testing the worker export we can call it directly
    // Ideally we pass a mocked cf object if we want to test it, but Request init doesn't easily support it in standard Request constructor without the Cloudflare types augmentation working perfectly in tests.
    // However, Hono reads from req.raw.cf.

    // We can use the app.request method for unit testing Hono, but here we are testing the worker export.
    const res = await worker.fetch(req, env, ctx)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('application/json')

    const data = await res.json() as any
    expect(data.requestHeaders['x-test-header']).toBe('foobar')
  })

  it('should return client IP on /ip', async () => {
    // We can't easily mock the CF-Connecting-IP header in the incoming request object effectively unless we use a specific helper or just trust the header passing.
    const req = new Request('http://example.com/ip', {
        headers: { 'CF-Connecting-IP': '1.2.3.4' }
    })
    const res = await worker.fetch(req, {}, {} as any)
    expect(await res.text()).toBe('1.2.3.4')
  })

  it('should echo custom status code', async () => {
    const res = await worker.fetch(new Request('http://example.com/status/418'), {}, {} as any)
    expect(res.status).toBe(418)
    expect(await res.text()).toContain('Returned status: 418')
  })

  it('should handle invalid status code gracefully', async () => {
    const res = await worker.fetch(new Request('http://example.com/status/999'), {}, {} as any)
    // Expect 400 Bad Request
    expect(res.status).toBe(400)
  })

  it('should echo user agent', async () => {
    const req = new Request('http://example.com/user-agent', {
        headers: { 'User-Agent': 'Vitest-Agent' }
    })
    const res = await worker.fetch(req, {}, {} as any)
    expect(await res.text()).toBe('Vitest-Agent')
  })

  it('should escape HTML in headers to prevent XSS', async () => {
    const malicious = "<script>alert('XSS')</script>"
    const req = new Request('http://example.com/', {
        headers: { 'X-Malicious': malicious }
    })
    const res = await worker.fetch(req, {}, {} as any)
    const text = await res.text()

    // Should NOT contain the raw script tag
    expect(text).not.toContain(malicious)
    // Should contain the escaped version
    // Hono JSX escapes single quotes as &#39;
    expect(text).toContain("&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;")
  })
})
