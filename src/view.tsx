import { html } from 'hono/html'
import { jsx } from 'hono/jsx'

const Layout = (props: { children: any, title: string }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <link href="https://cdn.jsdelivr.net/npm/gridstack@7.2.3/dist/gridstack.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/gridstack@7.2.3/dist/gridstack-all.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  gray: {
                    850: '#1f2937',
                    900: '#111827',
                    950: '#0B0F19',
                  }
                }
              }
            }
          }
        `}} />
      </head>
      <body class="bg-gray-950 text-gray-200 font-sans p-4 md:p-8 antialiased">
        <div class="max-w-7xl mx-auto space-y-8">
          {props.children}
        </div>
        <Script />
      </body>
    </html>
  )
}

const Card = ({ title, icon, description, children, className = "" }: { title: string, icon: string, description?: string, children: any, className?: string }) => {
  return (
    <div class={`bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg flex flex-col card-container ${className}`}>
      <div class="p-5 border-b border-gray-800 bg-gray-900/50 card-header flex justify-between items-start cursor-move select-none">
        <div>
          <h2 class="text-xl font-semibold text-orange-500 flex items-center gap-2">
            <span>{icon}</span> {title}
          </h2>
          {description && <p class="text-sm text-gray-400 mt-1">{description}</p>}
        </div>
        <button onclick="toggleCard(this)" class="text-gray-500 hover:text-white transition-colors p-1" title="Toggle Content">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      <div class="card-body p-0 flex-grow relative transition-all duration-300">
        {children}
      </div>
    </div>
  )
}

const RecursiveTable = ({ data }: { data: any }) => {
  if (typeof data !== 'object' || data === null) {
    return <span class="break-all text-base">{String(data)}</span>
  }

  return (
    <table class="w-full text-base text-left border-collapse">
      <tbody>
        {Object.entries(data).map(([key, value]) => (
          <tr class="border-b border-gray-800 last:border-0 hover:bg-white/5 transition-colors">
            <th class="py-3 px-4 font-medium text-gray-400 w-1/3 align-top break-all">{key}</th>
            <td class="py-3 px-4 text-gray-200 break-all align-top">
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
    // Card Toggle Logic
    window.toggleCard = function(btn) {
      const card = btn.closest('.card-container');
      const body = card.querySelector('.card-body');
      const icon = btn.querySelector('svg');

      body.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');

      // Notify Gridstack to resize
      const gridItem = card.closest('.grid-stack-item');
      if (gridItem) {
          const grid = gridItem.gridstackNode ? gridItem.gridstackNode.grid : null;
          // If we can find the grid instance via the global or element
          // Gridstack doesn't attach the instance to the DOM element directly in all versions,
          // but usually we can trigger a resize check.
          // Or just wait for auto-detection if enabled.
          // Force update:
           if (window.grid) {
               // window.grid.resizeToContent(gridItem); // This might be needed if auto doesn't catch it
               // Actually, with cellHeight: 'auto', it should detect DOM changes, but sometimes it needs a nudge.
           }
      }
    }

    // Gridstack Init
    window.addEventListener('DOMContentLoaded', function() {
      window.grid = GridStack.init({
        cellHeight: 'auto',
        animate: true,
        margin: 10,
        float: true,
        handle: '.card-header',
        alwaysShowResizeHandle: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ? false : true,
      });
    });

    // Fingerprinting Logic
    (async () => {
      // Load FingerprintJS
      try {
        const fpPromise = import('https://openfpcdn.io/fingerprintjs/v4')
          .then(FingerprintJS => FingerprintJS.load());
        const fp = await fpPromise;
        const result = await fp.get();
        document.getElementById('fp-fingerprintjs').textContent = result.visitorId;

        // Show raw data if available
        if (result) {
            document.getElementById('fp-raw-fpjs').textContent = JSON.stringify(result, null, 2);
            document.getElementById('fp-raw-fpjs-container').classList.remove('hidden');
        }

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

          // Show raw data
          document.getElementById('fp-raw-thumbmark').textContent = JSON.stringify(result, null, 2);
          document.getElementById('fp-raw-thumbmark-container').classList.remove('hidden');

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
      <div class="mb-8 border-b border-gray-800 pb-6">
        <h1 class="text-3xl md:text-4xl font-bold text-orange-500 mb-2">Request Inspector</h1>
        <p class="text-gray-400">Real-time analysis of your connection and browser environment.</p>
      </div>

      <div class="grid-stack">
        {/* Server Side Info */}
        <div class="grid-stack-item" gs-w="6">
          <div class="grid-stack-item-content">
            <Card title="Server-Side" icon="☁️" description="Information visible to Cloudflare" className="h-full">
              <div class="overflow-x-auto">
                <RecursiveTable data={props.cf} />
              </div>
            </Card>
          </div>
        </div>

        {/* Headers */}
        <div class="grid-stack-item" gs-w="6">
          <div class="grid-stack-item-content">
            <Card title="Request Headers" icon="📨" description="HTTP headers sent by your client" className="h-full">
              <div class="overflow-y-auto custom-scrollbar">
                <table class="w-full text-base text-left border-collapse">
                  <thead class="bg-gray-900/50 sticky top-0 z-10 backdrop-blur-sm">
                    <tr>
                      <th class="py-3 px-4 text-gray-500 font-semibold border-b border-gray-800 w-1/3">Header</th>
                      <th class="py-3 px-4 text-gray-500 font-semibold border-b border-gray-800">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(props.headers).map(([key, value]) => (
                      <tr class="border-b border-gray-800 last:border-0 hover:bg-white/5 transition-colors group">
                        <td class="py-3 px-4 font-mono text-orange-400/90 break-all align-top text-sm md:text-base">{key}</td>
                        <td class="py-3 px-4 text-gray-300 break-all align-top font-mono text-sm md:text-base">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* Client Side Fingerprint */}
        <div class="grid-stack-item" gs-w="6">
          <div class="grid-stack-item-content">
            <Card title="Client Fingerprint" icon="🕵️" description="Browser signals gathered via JS" className="h-full">
              <div class="p-0">
                <table class="w-full text-base text-left border-collapse" id="fingerprint-table">
                  <tbody>
                    <tr class="border-b border-gray-800 hover:bg-white/5"><th class="py-3 px-4 text-gray-400 font-medium">Screen Res</th><td id="fp-screen" class="py-3 px-4 text-gray-200">...</td></tr>
                    <tr class="border-b border-gray-800 hover:bg-white/5"><th class="py-3 px-4 text-gray-400 font-medium">Color Depth</th><td id="fp-depth" class="py-3 px-4 text-gray-200">...</td></tr>
                    <tr class="border-b border-gray-800 hover:bg-white/5"><th class="py-3 px-4 text-gray-400 font-medium">Timezone</th><td id="fp-tz" class="py-3 px-4 text-gray-200">...</td></tr>
                    <tr class="border-b border-gray-800 hover:bg-white/5"><th class="py-3 px-4 text-gray-400 font-medium">Language</th><td id="fp-lang" class="py-3 px-4 text-gray-200">...</td></tr>
                    <tr class="border-b border-gray-800 hover:bg-white/5"><th class="py-3 px-4 text-gray-400 font-medium">Platform</th><td id="fp-platform" class="py-3 px-4 text-gray-200">...</td></tr>
                    <tr class="border-b border-gray-800 hover:bg-white/5"><th class="py-3 px-4 text-gray-400 font-medium">Hardware</th><td id="fp-cores" class="py-3 px-4 text-gray-200">...</td></tr>
                    <tr class="border-b border-gray-800 hover:bg-white/5"><th class="py-3 px-4 text-gray-400 font-medium">Memory</th><td id="fp-memory" class="py-3 px-4 text-gray-200">...</td></tr>
                    <tr class="border-b border-gray-800 hover:bg-white/5"><th class="py-3 px-4 text-gray-400 font-medium">Touch</th><td id="fp-touch" class="py-3 px-4 text-gray-200">...</td></tr>
                    <tr class="border-b border-gray-800 hover:bg-white/5"><th class="py-3 px-4 text-gray-400 font-medium">Canvas Hash</th><td id="fp-canvas" class="py-3 px-4 text-gray-200 font-mono text-sm">...</td></tr>
                    <tr class="border-b border-gray-800 hover:bg-white/5"><th class="py-3 px-4 text-gray-400 font-medium">WebGL</th><td id="fp-webgl" class="py-3 px-4 text-gray-200 text-sm">...</td></tr>
                    <tr class="border-b border-gray-800 hover:bg-white/5"><th class="py-3 px-4 text-gray-400 font-medium">FingerprintJS</th><td id="fp-fingerprintjs" class="py-3 px-4 text-orange-400 font-mono text-sm break-all">Loading...</td></tr>
                    <tr class="border-b border-gray-800 hover:bg-white/5"><th class="py-3 px-4 text-gray-400 font-medium">ThumbmarkJS</th><td id="fp-thumbmarkjs" class="py-3 px-4 text-orange-400 font-mono text-sm break-all">Loading...</td></tr>
                  </tbody>
                </table>

                <div id="fp-raw-fpjs-container" class="hidden border-t border-gray-800">
                    <details class="group">
                        <summary class="p-3 text-xs text-gray-500 cursor-pointer hover:bg-white/5 select-none font-mono flex items-center gap-2">
                            <span>▶</span> Show Raw FingerprintJS Data
                        </summary>
                        <pre id="fp-raw-fpjs" class="p-3 bg-black/30 text-[10px] text-green-400 font-mono overflow-x-auto whitespace-pre-wrap"></pre>
                    </details>
                </div>

                <div id="fp-raw-thumbmark-container" class="hidden border-t border-gray-800">
                    <details class="group">
                        <summary class="p-3 text-xs text-gray-500 cursor-pointer hover:bg-white/5 select-none font-mono flex items-center gap-2">
                            <span>▶</span> Show Raw ThumbmarkJS Data
                        </summary>
                        <pre id="fp-raw-thumbmark" class="p-3 bg-black/30 text-[10px] text-green-400 font-mono overflow-x-auto whitespace-pre-wrap"></pre>
                    </details>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}
