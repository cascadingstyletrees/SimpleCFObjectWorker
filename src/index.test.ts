import { describe, it, expect, vi } from 'vitest'
import worker from './index'

// Helper to create a mock ExecutionContext
const createMockContext = (): ExecutionContext => {
  return {
    waitUntil: vi.fn(),
    passThroughOnException: vi.fn(),
  } as unknown as ExecutionContext
}

// Helper to create a Request with mock cf object
const createMockRequest = (url: string, init?: RequestInit, cf?: any): Request => {
  const req = new Request(url, init)
  if (cf) {
    // Inject cf object
    Object.defineProperty(req, 'cf', {
      value: cf,
      writable: false,
    })
  }
  return req
}

describe('Worker', () => {
  it('should return HTML dashboard on root', async () => {
    const cfMock = { city: 'Test City', country: 'Test Country' }
    const req = createMockRequest('http://example.com/', {}, cfMock)
    const ctx = createMockContext()
    const res = await worker.fetch(req, {}, ctx)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('text/html')
    const text = await res.text()
    expect(text).toContain('Request Inspector')
    expect(text).toContain('Client Fingerprint')
    // Verify CF data is rendered
    expect(text).toContain('Test City')
    expect(text).toContain('Test Country')
  })

  it('should return JSON details on /json', async () => {
    const cfMock = { colo: 'SJC',  asn: 13335 }
    const req = createMockRequest('http://example.com/json', {
        headers: { 'x-test-header': 'foobar' }
    }, cfMock)
    const ctx = createMockContext()

    const res = await worker.fetch(req, {}, ctx)

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toContain('application/json')

    const data = await res.json() as any
    expect(data.requestHeaders['x-test-header']).toBe('foobar')
    // Verify mocked CF object
    expect(data.colo).toBe('SJC')
    expect(data.asn).toBe(13335)
  })

  it('should return client IP on /ip', async () => {
    const req = createMockRequest('http://example.com/ip', {
        headers: { 'CF-Connecting-IP': '1.2.3.4' }
    })
    const ctx = createMockContext()
    const res = await worker.fetch(req, {}, ctx)
    expect(await res.text()).toBe('1.2.3.4')
  })

  it('should echo custom status code', async () => {
    const ctx = createMockContext()
    const res = await worker.fetch(createMockRequest('http://example.com/status/418'), {}, ctx)
    expect(res.status).toBe(418)
    expect(await res.text()).toContain('Returned status: 418')
  })

  it('should handle invalid status code gracefully', async () => {
    const ctx = createMockContext()
    const res = await worker.fetch(createMockRequest('http://example.com/status/999'), {}, ctx)
    // Expect 400 Bad Request
    expect(res.status).toBe(400)
  })

  it('should echo user agent', async () => {
    const req = createMockRequest('http://example.com/user-agent', {
        headers: { 'User-Agent': 'Vitest-Agent' }
    })
    const ctx = createMockContext()
    const res = await worker.fetch(req, {}, ctx)
    expect(await res.text()).toBe('Vitest-Agent')
  })

  it('should escape HTML in headers to prevent XSS', async () => {
    const malicious = "<script>alert('XSS')</script>"
    const req = createMockRequest('http://example.com/', {
        headers: { 'X-Malicious': malicious }
    })
    const ctx = createMockContext()
    const res = await worker.fetch(req, {}, ctx)
    const text = await res.text()

    // Should NOT contain the raw script tag
    expect(text).not.toContain(malicious)
    // Should contain the escaped version
    expect(text).toContain("&lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;")
  })
})
