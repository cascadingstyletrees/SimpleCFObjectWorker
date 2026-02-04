import { html } from 'hono/html'
import { jsx } from 'hono/jsx'

const Layout = (props: { children: any, title: string }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            darkMode: 'class',
            theme: {
              extend: {
                colors: {
                  primary: '#F48120',
                  'on-primary': '#FFFFFF',
                  'primary-container': '#5c3008',
                  'on-primary-container': '#ffdbc8',

                  surface: '#121212',
                  'surface-container-low': '#1E1E1E',
                  'surface-container': '#252525',
                  'surface-container-high': '#2B2B2B',
                  'surface-container-highest': '#333333',

                  'on-surface': '#E2E2E2',
                  'on-surface-variant': '#C4C7C5',
                  outline: '#8E918F',
                },
                fontFamily: {
                  sans: ['Roboto', 'sans-serif'],
                }
              }
            }
          }
        `}} />
        <style dangerouslySetInnerHTML={{ __html: `
          .material-symbols-rounded {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: #1E1E1E;
          }
          ::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: #F48120;
          }

          /* Collapsible details animation helper */
          details > summary {
            list-style: none;
          }
          details > summary::-webkit-details-marker {
            display: none;
          }

          /* Line clamp for long text */
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}} />
      </head>
      <body class="bg-surface text-on-surface font-sans p-4 md:p-8 antialiased min-h-screen">
        <div class="max-w-[1600px] mx-auto space-y-8">
          {props.children}
        </div>
        <Script />
      </body>
    </html>
  )
}

const Card = ({ title, icon, description, children, className = "" }: { title: string, icon: string, description?: string, children: any, className?: string }) => {
  return (
    <div class={`bg-surface-container-high rounded-2xl overflow-hidden shadow-lg flex flex-col transition-shadow hover:shadow-xl ${className}`}>
      <div class="p-6 pb-4">
        <h2 class="text-xl font-medium text-primary flex items-center gap-3">
          <span class="material-symbols-rounded text-2xl">{icon}</span> {title}
        </h2>
        {description && <p class="text-sm text-on-surface-variant mt-1 ml-9">{description}</p>}
      </div>
      <div class="p-0 flex-grow relative">
        {children}
      </div>
    </div>
  )
}

// Sleek Data Viewer Component
const SleekDataViewer = ({ data, depth = 0 }: { data: any, depth?: number }) => {
  if (data === null || data === undefined) {
    return <span class="text-on-surface-variant italic">null</span>
  }

  // Primitive rendering
  if (typeof data !== 'object') {
    const str = String(data)
    const isBool = typeof data === 'boolean'
    const isNumber = typeof data === 'number'

    if (isBool) {
      return (
        <span class={`px-2 py-0.5 rounded-full text-xs font-medium ${data ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
          {str}
        </span>
      )
    }

    if (isNumber) {
        return <span class="text-blue-300 font-mono">{str}</span>
    }

    // Long string handling
    if (str.length > 75) {
      return (
         <details class="group inline-block w-full align-top">
            <summary class="cursor-pointer text-on-surface hover:text-primary transition-colors flex items-start gap-2">
               <span class="line-clamp-2 break-all opacity-80 group-open:opacity-100">{str}</span>
               <span class="material-symbols-rounded text-xs mt-1 text-on-surface-variant group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <div class="mt-2 p-3 bg-black/20 rounded-lg text-xs font-mono text-on-surface-variant break-all">
                {str}
            </div>
         </details>
      )
    }

    return <span class="whitespace-nowrap">{str}</span>
  }

  // Object/Array rendering
  const entries = Object.entries(data)
  if (entries.length === 0) return <span class="text-on-surface-variant text-xs">Empty</span>

  // Determine container styling based on depth
  const isTopLevel = depth === 0
  const containerClass = isTopLevel
    ? "space-y-1"
    : "ml-4 pl-4 border-l border-surface-container-highest space-y-2 mt-2"

  return (
    <div class={containerClass}>
      {entries.map(([key, value]) => {
        const isPrimitive = typeof value !== 'object' || value === null

        return (
          <div class={`group ${isPrimitive ? 'flex items-baseline justify-between gap-4 py-1.5 hover:bg-white/5 px-2 -mx-2 rounded' : 'py-2'}`}>
            {/* Key */}
            <span class={`text-sm font-medium text-on-surface-variant shrink-0 ${!isPrimitive ? 'block mb-1 text-primary/80' : ''}`}>
              {key}
            </span>

            {/* Value */}
            <div class={`${isPrimitive ? 'text-right' : 'w-full'}`}>
              <SleekDataViewer data={value} depth={depth + 1} />
            </div>
          </div>
        )
      })}
    </div>
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
      <div class="mb-10 pb-6 border-b border-surface-container">
        <h1 class="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight">Request Inspector</h1>
        <p class="text-on-surface-variant text-lg">Real-time analysis of your connection and browser environment.</p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        {/* Server Side Info - Spans 1 column on XL, but we make it full width if needed by adjusting grid col span logic below if requested.
            For now, user said "Server side table is too big", so we might want to let it span 2 columns or full width?
            Let's try making it span 2 columns on large screens to give it breathing room.
        */}
        <div class="xl:col-span-2">
            <Card title="Server-Side" icon="cloud" description="Information visible to Cloudflare">
            <div class="p-6">
                <SleekDataViewer data={props.cf} />
            </div>
            </Card>
        </div>

        {/* Right Column Stack */}
        <div class="space-y-8">
            {/* Headers */}
            <Card title="Request Headers" icon="mail" description="HTTP headers sent by your client">
            <div class="max-h-[600px] overflow-y-auto custom-scrollbar p-6 pt-0">
                <SleekDataViewer data={props.headers} />
            </div>
            </Card>

            {/* Client Side Fingerprint */}
            <Card title="Client Fingerprint" icon="fingerprint" description="Browser signals gathered via JS">
            <div class="p-0">
                <table class="w-full text-sm text-left border-collapse" id="fingerprint-table">
                <tbody>
                    <tr class="border-b border-surface-container hover:bg-white/5"><th class="py-3 px-6 text-on-surface-variant font-medium whitespace-nowrap">Screen Res</th><td id="fp-screen" class="py-3 px-6 text-on-surface whitespace-nowrap">...</td></tr>
                    <tr class="border-b border-surface-container hover:bg-white/5"><th class="py-3 px-6 text-on-surface-variant font-medium whitespace-nowrap">Color Depth</th><td id="fp-depth" class="py-3 px-6 text-on-surface whitespace-nowrap">...</td></tr>
                    <tr class="border-b border-surface-container hover:bg-white/5"><th class="py-3 px-6 text-on-surface-variant font-medium whitespace-nowrap">Timezone</th><td id="fp-tz" class="py-3 px-6 text-on-surface whitespace-nowrap">...</td></tr>
                    <tr class="border-b border-surface-container hover:bg-white/5"><th class="py-3 px-6 text-on-surface-variant font-medium whitespace-nowrap">Language</th><td id="fp-lang" class="py-3 px-6 text-on-surface whitespace-nowrap">...</td></tr>
                    <tr class="border-b border-surface-container hover:bg-white/5"><th class="py-3 px-6 text-on-surface-variant font-medium whitespace-nowrap">Platform</th><td id="fp-platform" class="py-3 px-6 text-on-surface whitespace-nowrap">...</td></tr>
                    <tr class="border-b border-surface-container hover:bg-white/5"><th class="py-3 px-6 text-on-surface-variant font-medium whitespace-nowrap">Hardware</th><td id="fp-cores" class="py-3 px-6 text-on-surface whitespace-nowrap">...</td></tr>
                    <tr class="border-b border-surface-container hover:bg-white/5"><th class="py-3 px-6 text-on-surface-variant font-medium whitespace-nowrap">Memory</th><td id="fp-memory" class="py-3 px-6 text-on-surface whitespace-nowrap">...</td></tr>
                    <tr class="border-b border-surface-container hover:bg-white/5"><th class="py-3 px-6 text-on-surface-variant font-medium whitespace-nowrap">Touch</th><td id="fp-touch" class="py-3 px-6 text-on-surface whitespace-nowrap">...</td></tr>
                    <tr class="border-b border-surface-container hover:bg-white/5"><th class="py-3 px-6 text-on-surface-variant font-medium whitespace-nowrap">Canvas Hash</th><td id="fp-canvas" class="py-3 px-6 text-on-surface font-mono text-xs whitespace-nowrap">...</td></tr>
                    <tr class="border-b border-surface-container hover:bg-white/5"><th class="py-3 px-6 text-on-surface-variant font-medium whitespace-nowrap">WebGL</th><td id="fp-webgl" class="py-3 px-6 text-on-surface text-xs break-words min-w-[150px]">...</td></tr>
                    <tr class="border-b border-surface-container hover:bg-white/5"><th class="py-3 px-6 text-on-surface-variant font-medium whitespace-nowrap">FingerprintJS</th><td id="fp-fingerprintjs" class="py-3 px-6 text-primary font-mono text-xs break-all">Loading...</td></tr>
                    <tr class="border-b border-surface-container hover:bg-white/5"><th class="py-3 px-6 text-on-surface-variant font-medium whitespace-nowrap">ThumbmarkJS</th><td id="fp-thumbmarkjs" class="py-3 px-6 text-primary font-mono text-xs break-all">Loading...</td></tr>
                </tbody>
                </table>

                <div id="fp-raw-fpjs-container" class="hidden border-t border-surface-container">
                    <details class="group">
                        <summary class="p-4 text-xs text-on-surface-variant cursor-pointer hover:bg-white/5 select-none font-mono flex items-center gap-2">
                            <span class="material-symbols-rounded text-base">data_object</span> Show Raw FingerprintJS Data
                        </summary>
                        <pre id="fp-raw-fpjs" class="p-4 bg-surface-container text-[10px] text-green-400 font-mono overflow-x-auto whitespace-pre-wrap rounded-b-2xl"></pre>
                    </details>
                </div>

                <div id="fp-raw-thumbmark-container" class="hidden border-t border-surface-container">
                    <details class="group">
                        <summary class="p-4 text-xs text-on-surface-variant cursor-pointer hover:bg-white/5 select-none font-mono flex items-center gap-2">
                            <span class="material-symbols-rounded text-base">data_object</span> Show Raw ThumbmarkJS Data
                        </summary>
                        <pre id="fp-raw-thumbmark" class="p-4 bg-surface-container text-[10px] text-green-400 font-mono overflow-x-auto whitespace-pre-wrap rounded-b-2xl"></pre>
                    </details>
                </div>
            </div>
            </Card>
        </div>
      </div>
    </Layout>
  )
}
