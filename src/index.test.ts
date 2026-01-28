import worker from './index';
import { strict as assert } from 'assert';

async function testHtmlEscaping() {
  console.log('Running test: should escape HTML in headers');

  const maliciousHeaderValue = "<script>alert('XSS')</script>";
  const headers = new Headers({
    'X-Malicious-Header': maliciousHeaderValue,
  });

  const request = new Request('http://localhost/', { headers });
  const response = await worker.fetch(request);
  const text = await response.text();

  // console.log('Response body:', text);

  assert.ok(
    !text.includes(maliciousHeaderValue),
    'Test failed: Malicious header was not escaped in the HTML response.'
  );

  console.log('Test passed: Malicious header was correctly escaped.');
}

async function testJsonEndpoint() {
  console.log('Running test: JSON endpoint should return correct structure');

  const headers = new Headers({
    'x-test-header': 'test-value'
  });

  const request = new Request('http://localhost/json', { headers });
  const response = await worker.fetch(request);

  assert.equal(response.headers.get('content-type'), 'application/json');

  const text = await response.text();
  const json = JSON.parse(text);

  // Verify structure
  assert.ok(json.requestHeaders, 'Response should have requestHeaders');
  assert.equal(json.requestHeaders['x-test-header'], 'test-value', 'Header value should match');

  // Verify formatting (pretty print)
  // The user explicitly wants pretty print, so we can check if it contains newlines/indentation
  // or simply check that it is valid JSON (already checked by JSON.parse).
  // Checking for indentation:
  assert.ok(text.includes('\n'), 'Response should be pretty printed');
  assert.ok(text.includes('  '), 'Response should be indented');

  console.log('Test passed: JSON endpoint is correct.');
}

async function runTests() {
  await testHtmlEscaping();
  await testJsonEndpoint();
}

runTests().catch(err => {
  console.error(err);
  process.exit(1);
});
