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

    // Verify fingerprint cells are rendered in SSR HTML
    const fingerprintCellIds = [
      'fp-uach',
      'fp-audio',
      'fp-fonts',
      'fp-media-cap',
      'fp-canvas',
      'fp-webgl',
      'fp-fingerprintjs',
      'fp-thumbmarkjs',
      'fp-clientjs',
      'fp-fingerprintx',
      'fp-audiohash'
    ]
    for (const id of fingerprintCellIds) {
      expect(text).toContain(`id="${id}"`)
    }

    // Verify provider labels remain visible in fingerprint table header cells
    const providerRows = [
      { label: 'UA-CH', id: 'fp-uach' },
      { label: 'AudioContext', id: 'fp-audio' },
      { label: 'Fonts', id: 'fp-fonts' },
      { label: 'Media Capability', id: 'fp-media-cap' },
      { label: 'Canvas Hash', id: 'fp-canvas' },
      { label: 'WebGL', id: 'fp-webgl' },
      { label: 'FingerprintJS', id: 'fp-fingerprintjs' },
      { label: 'ThumbmarkJS', id: 'fp-thumbmarkjs' },
      { label: 'ClientJS', id: 'fp-clientjs' },
      { label: 'FingerprintX', id: 'fp-fingerprintx' },
      { label: 'Audio Signal Hash', id: 'fp-audiohash' }
    ]
    const escapeRegExp = (value: string) => value.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
    for (const { label, id } of providerRows) {
      const escaped = escapeRegExp(label)
      expect(text).toMatch(new RegExp(`<th[^>]*>${escaped}</th><td id=\"${id}\"`, 's'))
    }

    // Verify raw JSON containers exist for providers that expose details
    const rawContainerIds = [
      'fp-raw-fpjs-container',
      'fp-raw-thumbmark-container',
      'fp-raw-clientjs-container',
      'fp-raw-fingerprintx-container',
      'fp-raw-uach-container',
      'fp-raw-audio-container',
      'fp-raw-fonts-container',
      'fp-raw-media-cap-container'
    ]
    for (const id of rawContainerIds) {
      expect(text).toContain(`id="${id}"`)
    }

    // Verify some mock data is rendered
    expect(text).toContain('Austin')
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
