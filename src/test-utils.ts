export const mockCf = {
  httpProtocol: 'HTTP/2',
  tlsCipher: 'AEAD-AES128-GCM-SHA256',
  city: 'San Angelo',
  continent: 'NA',
  asn: 13335,
  clientAcceptEncoding: 'gzip, deflate, br',
  verifiedBotCategory: '',
  country: 'US',
  isEUCountry: 'false',
  botManagement: {
    jsDetection: { passed: false },
    ja4Signals: {
      h2h3_ratio_1h: 0.99826270341873,
      heuristic_ratio_1h: 0,
      reqs_quantile_1h: 0.99951106309891,
      uas_rank_1h: 777,
      browser_ratio_1h: 0.049353156238794,
      paths_rank_1h: 811,
      reqs_rank_1h: 260,
      cache_ratio_1h: 0.11496262997389,
      ips_rank_1h: 621,
      ips_quantile_1h: 0.99883222579956,
    },
    staticResource: false,
    corporateProxy: false,
    ja4: 't13d1511h2_8daaf6152771_78e6aca7449b',
    verifiedBot: false,
    ja3Hash: '6c86e352b6818bacf1b5f5b06aa262d8',
    score: 99,
  },
  region: 'Texas',
  tlsClientCiphersSha1: 't62J38GPEn0CUIMdygJMuIMfHlg=',
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
  tlsClientRandom: '2nKp/GMekb6cK5Lz+oYGc/aCe6wUgelQV0owN1Y98J0=',
  tlsExportedAuthenticator: {
    clientFinished: '61c3b5cfbe027a9b6ccd3c4f2c952cc0e6aa1cb5216f9a73945c4942d091dfb2',
    clientHandshake: 'ce76fdb39a1de83c8edfc6fa65e6b5a83181e0285a83d4b1018abf243806e13d',
    serverHandshake: '9960e8e418df4393ae90a3736a59492676f740b18a3119ae6e8608af0d2d10cd',
    serverFinished: '142ea52e3c2aab7355b3300d3aa379e86babe0ff465fc553f11019aa6f3f1a52',
  },
  tlsClientHelloLength: 1483,
  colo: 'DFW',
  timezone: 'America/Chicago',
  longitude: '-100.43704',
  latitude: '31.46377',
  edgeRequestKeepAliveStatus: 1,
  requestPriority: 'weight=16;exclusive=0;group=0;group-weight=0',
  postalCode: '76902',
  clientTrustScore: 99,
  tlsVersion: 'TLSv1.3',
  regionCode: 'TX',
  asOrganization: 'Cloudflare London, LLC',
  metroCode: '661',
  tlsClientExtensionsSha1Le: 'ZxoH7HN+CTc5NGm9OvZxaZEDxfo=',
  tlsClientExtensionsSha1: '1+H5dwtXCJYUavRE3xpeguLwCoM=',
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
