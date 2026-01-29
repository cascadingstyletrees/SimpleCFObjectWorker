import { html } from 'hono/html'
import { jsx } from 'hono/jsx'

const Icons = {
  Cloud: (
    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
    </svg>
  ),
  Inbox: (
    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
    </svg>
  ),
  Chip: (
    <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
    </svg>
  ),
  ChevronUp: (
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
    </svg>
  ),
  ChevronDown: (
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
    </svg>
  )
}

const Layout = (props: { children: any, title: string }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/gridstack.js/10.0.1/gridstack.min.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gridstack.js/10.0.1/gridstack-all.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <style dangerouslySetInnerHTML={{ __html: `
          .grid-stack-item .ui-resizable-handle { display: none !important; }
        `}} />
        <script dangerouslySetInnerHTML={{ __html: `
          tailwind.config = {
            darkMode: 'class',
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
      <body class="bg-gray-100 dark:bg-gray-950 text-sm text-gray-900 dark:text-gray-200 font-sans p-4 md:p-8 antialiased transition-colors duration-200">
        <div class="max-w-7xl mx-auto space-y-8">
          {props.children}
        </div>
        <Script />
      </body>
    </html>
  )
}

const Card = ({ title, icon, description, children, className = "", w="6", h="auto", x, y }: { title: string, icon: any, description?: string, children: any, className?: string, w?: string, h?: string, x?: string, y?: string }) => {
  const hProps = h === "auto" ? {} : { "gs-h": h };
  return (
    <div class={`grid-stack-item ${className}`} gs-w={w} {...hProps} gs-x={x} gs-y={y}>
      <div class="grid-stack-item-content bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden shadow-sm transition-colors duration-200" style="position: relative; height: auto; inset: auto;">
        <div class="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-start cursor-move grid-stack-item-header">
           <div class="flex-1 min-w-0">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                {icon} <span class="truncate">{title}</span>
              </h2>
              {description && <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{description}</p>}
           </div>
           <button class="minimize-btn text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 ml-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
             <span class="icon-min">{Icons.ChevronUp}</span>
             <span class="icon-max hidden">{Icons.ChevronDown}</span>
           </button>
        </div>
        <div class="p-0 relative widget-content">
           {children}
        </div>
      </div>
    </div>
  )
}

const RecursiveTable = ({ data }: { data: any }) => {
  if (typeof data !== 'object' || data === null) {
    return <span class="break-all text-gray-600 dark:text-gray-300">{String(data)}</span>
  }

  return (
    <table class="w-full text-sm text-left border-collapse">
      <tbody>
        {Object.entries(data).map(([key, value]) => (
          <tr class="border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <th class="py-2 px-4 font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap pr-4 align-top">{key}</th>
            <td class="py-2 px-4 text-gray-800 dark:text-gray-200 break-all align-top">
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
    // Theme Logic
    (() => {
      const btn = document.getElementById('theme-toggle');
      const icons = {
        light: document.getElementById('icon-sun'),
        dark: document.getElementById('icon-moon'),
        system: document.getElementById('icon-system')
      };

      function updateTheme() {
        const isDark = localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }

        // Update Icons
        Object.values(icons).forEach(el => el && el.classList.add('hidden'));
        if ('theme' in localStorage) {
          if (localStorage.theme === 'dark') icons.dark.classList.remove('hidden');
          else icons.light.classList.remove('hidden');
        } else {
          icons.system.classList.remove('hidden');
        }
      }

      if (btn) {
        btn.addEventListener('click', () => {
          if (!('theme' in localStorage)) {
            localStorage.theme = 'light';
          } else if (localStorage.theme === 'light') {
            localStorage.theme = 'dark';
          } else {
            localStorage.removeItem('theme');
          }
          updateTheme();
        });
      }

      updateTheme();
    })();

    // GridStack & Minimize Logic
    document.addEventListener('DOMContentLoaded', () => {
      try {
        // @ts-ignore
        const grid = GridStack.init({
          float: true,
          cellHeight: 'auto',
          column: 12,
          margin: 14, // Gap
          disableOneColumnMode: false, // Allow mobile resizing/stacking
          draggable: { handle: '.grid-stack-item-header' }
        });

        // Fade in grid after init
        grid.el.classList.remove('opacity-0');

        document.querySelectorAll('.minimize-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent drag start if clicking button
            const widget = btn.closest('.grid-stack-item');
            const content = widget.querySelector('.widget-content');
            const isHidden = content.classList.contains('hidden');

            if (isHidden) {
              content.classList.remove('hidden');
              btn.querySelector('.icon-min').classList.remove('hidden');
              btn.querySelector('.icon-max').classList.add('hidden');
            } else {
              content.classList.add('hidden');
              btn.querySelector('.icon-min').classList.add('hidden');
              btn.querySelector('.icon-max').classList.remove('hidden');
            }

            // Recalculate height
            grid.resizeToContent(widget);
          });
        });

        // Prevent drag on content/header text to allow text selection
        // GridStack usually handles this via handle option, but we want drag on header ONLY.
        // We can set draggable handle in init or on items.
        // Let's rely on default 'draggable: { handle: ... }' if we want.
        // But for now default is whole item.
        // Better UX: Drag by header only.
        grid.opts.draggable = { handle: '.grid-stack-item-header' };
        // We need to re-init draggable or update options?
        // Passing it in init is better.
      } catch (e) {
        console.error('GridStack error:', e);
      }
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
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 dark:border-gray-800 pb-6 gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-orange-500 mb-2">Request Inspector</h1>
          <p class="text-gray-500 dark:text-gray-400">Real-time analysis of your connection and browser environment.</p>
        </div>
        <button id="theme-toggle" class="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm">
          {/* Sun (Light) */}
          <svg id="icon-sun" class="hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          {/* Moon (Dark) */}
          <svg id="icon-moon" class="hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          {/* Computer (System) */}
          <svg id="icon-system" class="hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </button>
      </div>

      <div class="grid-stack opacity-0 transition-opacity duration-300">
        {/* Server Side Info */}
        <Card title="Server-Side" icon={Icons.Cloud} description="Information visible to Cloudflare" w="6" x="0" y="0">
          <div class="overflow-x-auto">
            <RecursiveTable data={props.cf} />
          </div>
        </Card>

        {/* Headers */}
        <Card title="Request Headers" icon={Icons.Inbox} description="HTTP headers sent by your client" w="6" x="6" y="0">
          <div class="max-h-[600px] overflow-y-auto custom-scrollbar">
             <table class="w-full text-sm text-left border-collapse">
              <thead class="bg-gray-50 dark:bg-gray-900/50 sticky top-0 z-10 backdrop-blur-sm">
                <tr>
                  <th class="py-3 px-4 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-800 w-auto whitespace-nowrap">Header</th>
                  <th class="py-3 px-4 text-gray-500 dark:text-gray-400 font-semibold border-b border-gray-200 dark:border-gray-800">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(props.headers).map(([key, value]) => (
                  <tr class="border-b border-gray-200 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td class="py-2 px-4 font-mono text-orange-500 dark:text-orange-400/90 whitespace-nowrap align-top text-xs md:text-sm">{key}</td>
                    <td class="py-2 px-4 text-gray-800 dark:text-gray-300 break-all align-top font-mono text-xs md:text-sm">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Client Side Fingerprint */}
        <Card title="Client Fingerprint" icon={Icons.Chip} description="Browser signals gathered via JS" w="6" x="0">
          <div class="p-0">
             <table class="w-full text-sm text-left border-collapse" id="fingerprint-table">
              <tbody>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Screen Res</th><td id="fp-screen" class="py-2 px-4 text-gray-800 dark:text-gray-200">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Color Depth</th><td id="fp-depth" class="py-2 px-4 text-gray-800 dark:text-gray-200">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Timezone</th><td id="fp-tz" class="py-2 px-4 text-gray-800 dark:text-gray-200">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Language</th><td id="fp-lang" class="py-2 px-4 text-gray-800 dark:text-gray-200">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Platform</th><td id="fp-platform" class="py-2 px-4 text-gray-800 dark:text-gray-200">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Hardware</th><td id="fp-cores" class="py-2 px-4 text-gray-800 dark:text-gray-200">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Memory</th><td id="fp-memory" class="py-2 px-4 text-gray-800 dark:text-gray-200">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Touch</th><td id="fp-touch" class="py-2 px-4 text-gray-800 dark:text-gray-200">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Canvas Hash</th><td id="fp-canvas" class="py-2 px-4 text-gray-800 dark:text-gray-200 font-mono text-xs">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">WebGL</th><td id="fp-webgl" class="py-2 px-4 text-gray-800 dark:text-gray-200 text-xs">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">FingerprintJS</th><td id="fp-fingerprintjs" class="py-2 px-4 text-orange-500 dark:text-orange-400 font-mono text-xs break-all">Loading...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">ThumbmarkJS</th><td id="fp-thumbmarkjs" class="py-2 px-4 text-orange-500 dark:text-orange-400 font-mono text-xs break-all">Loading...</td></tr>
              </tbody>
            </table>

            <div id="fp-raw-fpjs-container" class="hidden border-t border-gray-200 dark:border-gray-800">
                <details class="group">
                    <summary class="p-3 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 select-none font-mono flex items-center gap-2">
                        <span>▶</span> Show Raw FingerprintJS Data
                    </summary>
                    <pre id="fp-raw-fpjs" class="p-3 bg-gray-50 dark:bg-black/30 text-[10px] text-green-600 dark:text-green-400 font-mono overflow-x-auto whitespace-pre-wrap"></pre>
                </details>
            </div>

            <div id="fp-raw-thumbmark-container" class="hidden border-t border-gray-200 dark:border-gray-800">
                <details class="group">
                    <summary class="p-3 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 select-none font-mono flex items-center gap-2">
                        <span>▶</span> Show Raw ThumbmarkJS Data
                    </summary>
                    <pre id="fp-raw-thumbmark" class="p-3 bg-gray-50 dark:bg-black/30 text-[10px] text-green-600 dark:text-green-400 font-mono overflow-x-auto whitespace-pre-wrap"></pre>
                </details>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
