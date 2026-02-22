export const mockCf = {
  httpProtocol: 'HTTP/2',
  tlsCipher: 'AEAD-AES128-GCM-SHA256',
  city: 'Austin',
  continent: 'NA',
  asn: 13335,
  clientAcceptEncoding: 'gzip, deflate, br',
  verifiedBotCategory: '',
  country: 'US',
  isEUCountry: 'false',
  botManagement: {
    jsDetection: { passed: false },
    ja4Signals: {
      h2h3_ratio_1h: 0.85,
      heuristic_ratio_1h: 0.1,
      reqs_quantile_1h: 0.95,
      uas_rank_1h: 500,
      browser_ratio_1h: 0.15,
      paths_rank_1h: 100,
      reqs_rank_1h: 300,
      cache_ratio_1h: 0.25,
      ips_rank_1h: 400,
      ips_quantile_1h: 0.90,
    },
    staticResource: false,
    corporateProxy: false,
    ja4: 't13d1511h2_8daaf6152771_78e6aca7449b', // Keeping format, but this is a common hash
    verifiedBot: false,
    ja3Hash: 'e7d705a3286e19ea42f55023924f0c05',
    score: 99,
  },
  region: 'Texas',
  tlsClientCiphersSha1: 'mocked_sha1_ciphers',
  tlsClientAuth: {
    certIssuerDNLegacy: '',
    certIssuerSKI: '',
    certSubjectDNRFC2253: '',
    certSubjectDNLegacy: '',
    certFingerprintSHA256: '',
    certNotBefore: '',
    certSKI: '',
    certSerial: '',
    certIssuerDN: '',
    certVerified: 'NONE',
    certNotAfter: '',
    certSubjectDN: '',
    certPresented: '0',
    certRevoked: '0',
    certIssuerSerial: '',
    certIssuerDNRFC2253: '',
    certFingerprintSHA1: '',
  },
  tlsClientRandom: 'mocked_client_random_string',
  tlsExportedAuthenticator: {
    clientFinished: 'mocked_client_finished_hash',
    clientHandshake: 'mocked_client_handshake_hash',
    serverHandshake: 'mocked_server_handshake_hash',
    serverFinished: 'mocked_server_finished_hash',
  },
  tlsClientHelloLength: 1500,
  colo: 'DFW',
  timezone: 'America/Chicago',
  longitude: '-97.7431',
  latitude: '30.2672',
  edgeRequestKeepAliveStatus: 1,
  requestPriority: 'weight=16;exclusive=0;group=0;group-weight=0',
  postalCode: '78701',
  clientTrustScore: 99,
  tlsVersion: 'TLSv1.3',
  regionCode: 'TX',
  asOrganization: 'Cloudflare',
  metroCode: '635',
  tlsClientExtensionsSha1Le: 'mocked_sha1_extensions_le',
  tlsClientExtensionsSha1: 'mocked_sha1_extensions',
};

/**
 * Creates a mock Request object with an optional `cf` property attached.
 * This is necessary because the standard Request constructor creates a read-only `cf` property
 * that cannot be easily mocked in tests without using Object.defineProperty.
 */
export function createMockRequest(url: string, options: RequestInit = {}, cf: Record<string, any> = mockCf): Request {
  const req = new Request(url, options);

  // Use Object.defineProperty to override the read-only `cf` property
  Object.defineProperty(req, 'cf', {
    value: cf,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  // Hono uses `req.raw.cf` internally in some places, so we mock `raw` as well if needed,
  // but usually Hono's `c.req.raw` refers to the Request object itself.
  // In the context of the worker fetch handler `worker.fetch(req, env, ctx)`, `req` IS the raw request.

  return req;
}

export function createMockContext(): ExecutionContext {
  return {
    waitUntil: () => {},
    passThroughOnException: () => {},
    abort: () => {}, // Cloudflare Workers types might expect this
  } as unknown as ExecutionContext;
}
