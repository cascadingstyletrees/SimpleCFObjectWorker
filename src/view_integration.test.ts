import { describe, it, expect } from 'vitest'
import worker from './index'
import { createMockRequest, createMockContext } from './test-utils'

describe('View Integration', () => {
  it('should render audio fingerprint elements', async () => {
    const req = createMockRequest('http://example.com/')
    const res = await worker.fetch(req, {}, createMockContext())
    const text = await res.text()

    expect(text).toContain('id="fp-audio"')
    expect(text).toContain('Audio Hash')
  })

  it('should render ClientJS fingerprint elements', async () => {
    const req = createMockRequest('http://example.com/')
    const res = await worker.fetch(req, {}, createMockContext())
    const text = await res.text()

    expect(text).toContain('id="fp-clientjs"')
    expect(text).toContain('ClientJS')
    expect(text).toContain('id="fp-raw-clientjs"')
    expect(text).toContain('Show Raw ClientJS Data')
  })

  it('should render FingerprintX fingerprint elements', async () => {
    const req = createMockRequest('http://example.com/')
    const res = await worker.fetch(req, {}, createMockContext())
    const text = await res.text()

    expect(text).toContain('id="fp-fingerprintx"')
    expect(text).toContain('FingerprintX')
    expect(text).toContain('id="fp-raw-fingerprintx"')
    expect(text).toContain('Show Raw FingerprintX Data')
  })

  it('should inject fingerprinting logic script', async () => {
    const req = createMockRequest('http://example.com/')
    const res = await worker.fetch(req, {}, createMockContext())
    const text = await res.text()

    // Check for Audio Fingerprint logic
    expect(text).toContain('OfflineAudioContext')
    expect(text).toContain('createOscillator')

    // Check for ClientJS logic
    expect(text).toContain('https://cdnjs.cloudflare.com/ajax/libs/ClientJS/0.2.1/client.min.js')
    expect(text).toContain('window.ClientJS')

    // Check for FingerprintX logic
    expect(text).toContain('https://cdn.jsdelivr.net/npm/@ipriskify/fingerprintx/dist/ipriskify.umd.js')
    expect(text).toContain('window.IPRiskify')
  })
})
