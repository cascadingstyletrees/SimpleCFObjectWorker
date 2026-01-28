import { html } from 'hono/html'
import { jsx } from 'hono/jsx'

const Layout = (props: { children: any, title: string }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg: #111;
            --text: #e0e0e0;
            --accent: #f48120;
            --card-bg: #1e1e1e;
            --border: #333;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background: var(--bg);
            color: var(--text);
            margin: 0;
            padding: 20px;
            line-height: 1.6;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
          }
          h1, h2 { color: var(--accent); }
          h1 { border-bottom: 2px solid var(--accent); padding-bottom: 10px; }
          .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 20px;
            margin-top: 20px;
          }
          .card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9em;
          }
          th, td {
            text-align: left;
            padding: 8px;
            border-bottom: 1px solid #333;
            word-break: break-all;
          }
          th { color: #888; width: 40%; vertical-align: top; }
          code {
            font-family: 'Courier New', monospace;
            color: #76c7c0;
          }
          .value-loading { color: #888; font-style: italic; }
          .nested-table {
            margin: 0;
            width: 100%;
          }
          .nested-table th {
            width: auto;
            color: #aaa;
            font-size: 0.85em;
          }
        `}} />
      </head>
      <body>
        <div class="container">
          {props.children}
        </div>
        <Script />
      </body>
    </html>
  )
}

const RecursiveTable = ({ data }: { data: any }) => {
  if (typeof data !== 'object' || data === null) {
    return <span>{String(data)}</span>
  }

  return (
    <table class="nested-table">
      <tbody>
        {Object.entries(data).map(([key, value]) => (
          <tr>
            <th>{key}</th>
            <td>
              {typeof value === 'object' && value !== null ? (
                <RecursiveTable data={value} />
              ) : (
                String(value)
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const Script = () => {
  const scriptContent = `
    // Fingerprinting Logic
    (async () => {
      // Load FingerprintJS
      try {
        const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4')
          .then(FingerprintJS => FingerprintJS.load());
        const fp = await fpPromise;
        const result = await fp.get();
        document.getElementById('fp-fingerprintjs').textContent = result.visitorId;
      } catch (e) {
        console.error('FingerprintJS error:', e);
        document.getElementById('fp-fingerprintjs').textContent = 'Error';
      }

      // Load ThumbmarkJS
      try {
        await import('https://cdn.jsdelivr.net/npm/@thumbmarkjs/thumbmarkjs/dist/thumbmark.umd.js');
        if (window.ThumbmarkJS) {
          const tm = new window.ThumbmarkJS.Thumbmark();
          const result = await tm.get();
          document.getElementById('fp-thumbmarkjs').textContent = result.thumbmark || result;
        } else {
          document.getElementById('fp-thumbmarkjs').textContent = 'Failed to load';
        }
      } catch (e) {
        console.error('ThumbmarkJS error:', e);
        document.getElementById('fp-thumbmarkjs').textContent = 'Error';
      }

      // Basic Info
      document.getElementById('fp-screen').textContent = window.screen.width + 'x' + window.screen.height;
      document.getElementById('fp-depth').textContent = window.screen.colorDepth + '-bit';
      document.getElementById('fp-tz').textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
      document.getElementById('fp-lang').textContent = navigator.language;
      document.getElementById('fp-platform').textContent = navigator.platform;
      document.getElementById('fp-cores').textContent = navigator.hardwareConcurrency || 'Unknown';
      document.getElementById('fp-memory').textContent = (navigator.deviceMemory || 'Unknown') + ' GB';
      document.getElementById('fp-touch').textContent = ('ontouchstart' in window || navigator.maxTouchPoints > 0) ? 'Yes' : 'No';

      // Canvas Fingerprint
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 200;
        canvas.height = 50;
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.textBaseline = "alphabetic";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125,1,62,20);
        ctx.fillStyle = "#069";
        ctx.fillText("Hello World", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("Hello World", 4, 17);

        // Simple hash of the data URL
        const dataUrl = canvas.toDataURL();
        let hash = 0;
        for (let i = 0; i < dataUrl.length; i++) {
          const char = dataUrl.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        document.getElementById('fp-canvas').textContent = hash.toString(16);
      } catch (e) {
        document.getElementById('fp-canvas').textContent = 'Error';
      }

      // WebGL Info
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
          const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          document.getElementById('fp-webgl').textContent = renderer + ' (' + vendor + ')';
        } else {
          document.getElementById('fp-webgl').textContent = 'Not Supported';
        }
      } catch (e) {
        document.getElementById('fp-webgl').textContent = 'Error';
      }
    })();
  `
  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
}

export const View = (props: { headers: Record<string, string>, cf: any }) => {
  return (
    <Layout title="Cloudflare Request Inspector">
      <h1>Request Inspector</h1>

      <div class="grid">
        {/* Server Side Info */}
        <div class="card">
          <h2>☁️ Server-Side (Cloudflare)</h2>
          <p>Information visible to the Cloudflare Worker.</p>
          <RecursiveTable data={props.cf} />
        </div>

        {/* Headers */}
        <div class="card">
          <h2>📨 Request Headers</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <RecursiveTable data={props.headers} />
          </div>
        </div>

        {/* Client Side Fingerprint */}
        <div class="card">
          <h2>🕵️ Client-Side Fingerprint</h2>
          <p>Information gathered via JavaScript in your browser.</p>
          <table id="fingerprint-table">
            <tbody>
              <tr><th>Screen Resolution</th><td id="fp-screen" class="value-loading">Calculating...</td></tr>
              <tr><th>Color Depth</th><td id="fp-depth" class="value-loading">Calculating...</td></tr>
              <tr><th>Timezone (JS)</th><td id="fp-tz" class="value-loading">Calculating...</td></tr>
              <tr><th>Language</th><td id="fp-lang" class="value-loading">Calculating...</td></tr>
              <tr><th>Platform</th><td id="fp-platform" class="value-loading">Calculating...</td></tr>
              <tr><th>Hardware Concurrency</th><td id="fp-cores" class="value-loading">Calculating...</td></tr>
              <tr><th>Device Memory</th><td id="fp-memory" class="value-loading">Calculating...</td></tr>
              <tr><th>Touch Support</th><td id="fp-touch" class="value-loading">Calculating...</td></tr>
              <tr><th>Canvas Hash</th><td id="fp-canvas" class="value-loading">Calculating...</td></tr>
              <tr><th>WebGL Renderer</th><td id="fp-webgl" class="value-loading">Calculating...</td></tr>
              <tr><th>FingerprintJS ID</th><td id="fp-fingerprintjs" class="value-loading">Loading...</td></tr>
              <tr><th>ThumbmarkJS ID</th><td id="fp-thumbmarkjs" class="value-loading">Loading...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
