function escapeHtml(unsafe: any): string {
  if (unsafe === null || unsafe === undefined) return '';
  const str = String(unsafe);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const html = (headers: Record<string, string>, cf: any) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cloudflare Request Inspector</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #0f172a;
      --text: #e2e8f0;
      --accent: #f59e0b;
      --card-bg: #1e293b;
      --border: #334155;
      --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background: var(--bg);
      color: var(--text);
      margin: 0;
      padding: 40px 20px;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1, h2 { color: var(--text); margin-top: 0; }
    h1 {
      border-bottom: 2px solid var(--accent);
      padding-bottom: 15px;
      margin-bottom: 30px;
      font-weight: 300;
      letter-spacing: -0.5px;
    }
    h2 {
      font-size: 1.25rem;
      margin-bottom: 15px;
      color: var(--accent);
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 25px;
    }
    .card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 25px;
      box-shadow: var(--shadow);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9em;
    }
    th, td {
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid var(--border);
      word-break: break-all;
    }
    th {
      color: var(--text);
      opacity: 0.6;
      width: 35%;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.05em;
      font-weight: 600;
    }
    tr:last-child th, tr:last-child td { border-bottom: none; }
    tr:nth-child(even) { background-color: rgba(255,255,255,0.02); }
    tr:hover { background-color: rgba(255,255,255,0.04); }

    code {
      font-family: 'Courier New', monospace;
      color: #76c7c0;
    }
    .value-loading { color: #888; font-style: italic; }

    /* Scrollbar for the page */
    ::-webkit-scrollbar { width: 10px; }
    ::-webkit-scrollbar-track { background: var(--bg); }
    ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 5px; }
    ::-webkit-scrollbar-thumb:hover { background: #475569; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Request Inspector</h1>

    <div class="grid">
      <!-- Server Side Info -->
      <div class="card">
        <h2><span>☁️</span> Server-Side (Cloudflare)</h2>
        <p style="margin-bottom: 20px; opacity: 0.8; font-size: 0.9rem;">Information visible to the Cloudflare Worker.</p>
        <table>
          <tbody>
            <tr><th>Method</th><td>${escapeHtml(cf?.requestMethod || 'GET')}</td></tr>
            <tr><th>Protocol</th><td>${escapeHtml(cf?.httpProtocol || 'HTTP/1.1')}</td></tr>
            <tr><th>ASN</th><td>${escapeHtml(cf?.asn || 'N/A')}</td></tr>
            <tr><th>Colo</th><td>${escapeHtml(cf?.colo || 'N/A')}</td></tr>
            <tr><th>Country</th><td>${escapeHtml(cf?.country || 'N/A')}</td></tr>
            <tr><th>City</th><td>${escapeHtml(cf?.city || 'N/A')}</td></tr>
            <tr><th>Timezone (CF)</th><td>${escapeHtml(cf?.timezone || 'N/A')}</td></tr>
            <tr><th>IP Score</th><td>${escapeHtml(cf?.botManagement?.score || 'N/A')}</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Headers -->
      <div class="card">
        <h2><span>📨</span> Request Headers</h2>
        <!-- Removed max-height/overflow-y to allow full expansion -->
        <div>
          <table>
            <tbody>
              ${Object.entries(headers).map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Client Side Fingerprint -->
      <div class="card">
        <h2><span>🕵️</span> Client-Side Fingerprint</h2>
        <p style="margin-bottom: 20px; opacity: 0.8; font-size: 0.9rem;">Information gathered via JavaScript in your browser.</p>
        <table id="fingerprint-table">
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
        </table>
      </div>
    </div>
  </div>

  <script>
    // Fingerprinting Logic
    (async () => {
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
  </script>
</body>
</html>
`;
