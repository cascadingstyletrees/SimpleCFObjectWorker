import worker from './index';
import { strict as assert } from 'assert';

async function runTest() {
  console.log('Running test: should escape HTML in headers');

  const maliciousHeaderValue = "<script>alert('XSS')</script>";
  const headers = new Headers({
    'X-Malicious-Header': maliciousHeaderValue,
  });

  const request = new Request('http://localhost/', { headers });
  const response = await worker.fetch(request);
  const text = await response.text();

  console.log('Response body:', text);

  // This assertion should fail before the fix
  assert.ok(
    !text.includes(maliciousHeaderValue),
    'Test failed: Malicious header was not escaped in the HTML response.'
  );

  console.log('Test passed: Malicious header was correctly escaped.');
}

runTest().catch(err => {
  console.error(err);
  process.exit(1);
});
