import { html } from 'hono/html'
import { jsx } from 'hono/jsx'
import { flattenObject } from './utils'

const TAILWIND_CONFIG = `
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
`

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
        <script defer src="https://unpkg.com/web-animations-js@2.3.2/web-animations.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/muuri@0.9.5/dist/muuri.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{ __html: TAILWIND_CONFIG }} />
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

const Card = ({ title, icon, description, children, className = "" }: { title: string, icon: any, description?: string, children: any, className?: string }) => {
  return (
    <div class={`item absolute w-full md:w-1/2 p-4 ${className}`}>
      <div class="item-content bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm transition-colors duration-200">
        <div class="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-start cursor-move drag-handle rounded-t-xl">
           <div class="flex-1 min-w-0">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                {icon} <span class="truncate">{title}</span>
              </h2>
              {description && <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{description}</p>}
           </div>
           <button
             class="minimize-btn text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 ml-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
             aria-label={`Minimize ${title} card`}
             title={`Minimize ${title} card`}
           >
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

const SCRIPT_CONTENT = `
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
          if (localStorage.theme === 'dark') {
            icons.dark.classList.remove('hidden');
            if (btn) {
              btn.setAttribute('aria-label', 'Switch to system theme');
              btn.setAttribute('title', 'Switch to system theme');
            }
          } else {
            icons.light.classList.remove('hidden');
            if (btn) {
              btn.setAttribute('aria-label', 'Switch to dark theme');
              btn.setAttribute('title', 'Switch to dark theme');
            }
          }
        } else {
          icons.system.classList.remove('hidden');
          if (btn) {
            btn.setAttribute('aria-label', 'Switch to light theme');
            btn.setAttribute('title', 'Switch to light theme');
          }
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

    // Muuri & Minimize Logic
    document.addEventListener('DOMContentLoaded', () => {
      try {
        const gridElement = document.querySelector('.grid-muuri');
        if (!gridElement) return;

        const grid = window.grid = new Muuri(gridElement, {
          dragEnabled: true,
          dragHandle: '.drag-handle',
          layout: {
            fillGaps: true
          }
        });

        // Fade in grid after init
        gridElement.classList.remove('opacity-0');

        // Handle window resize
        window.addEventListener('resize', () => {
          grid.refreshItems().layout();
        });

        // Re-layout on load
        window.addEventListener('load', () => grid.refreshItems().layout());

        // Safety layout
        setTimeout(() => grid.refreshItems().layout(), 500);

        // Minimize Logic
        document.querySelectorAll('.minimize-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const widget = btn.closest('.item');
            const content = widget.querySelector('.widget-content');
            const isHidden = content.classList.contains('hidden');

            const titleSpan = widget.querySelector('h2 span.truncate');
            const cardTitle = titleSpan ? titleSpan.textContent : 'card';

            if (isHidden) {
              content.classList.remove('hidden');
              btn.querySelector('.icon-min').classList.remove('hidden');
              btn.querySelector('.icon-max').classList.add('hidden');
              btn.setAttribute('aria-label', 'Minimize ' + cardTitle + ' card');
              btn.setAttribute('title', 'Minimize ' + cardTitle + ' card');
            } else {
              content.classList.add('hidden');
              btn.querySelector('.icon-min').classList.add('hidden');
              btn.querySelector('.icon-max').classList.remove('hidden');
              btn.setAttribute('aria-label', 'Expand ' + cardTitle + ' card');
              btn.setAttribute('title', 'Expand ' + cardTitle + ' card');
            }

            grid.refreshItems().layout();
          });
        });

        // ResizeObserver for dynamic content
        const observer = new ResizeObserver(() => {
           requestAnimationFrame(() => {
              grid.refreshItems().layout();
           });
        });

        document.querySelectorAll('.widget-content').forEach(el => observer.observe(el));

      } catch (e) {
        console.error('Muuri error:', e);
      }
    });

    // Fingerprinting Logic
    (async () => {
      const DEFAULT_TIMEOUT_MS = 6000;
      const encodeToBytes = (value) => {
        if (typeof TextEncoder !== 'undefined') {
          return new TextEncoder().encode(value);
        }

        // Fallback for older Safari/webviews where TextEncoder may be missing.
        const utf8 = unescape(encodeURIComponent(value));
        const bytes = new Uint8Array(utf8.length);
        for (let i = 0; i < utf8.length; i++) {
          bytes[i] = utf8.charCodeAt(i);
        }
        return bytes;
      };

      const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
      };

      const truncateValue = (value, maxLength = 96) => {
        const safe = String(value ?? 'Unavailable');
        if (safe.length <= maxLength) return safe;
        return safe.slice(0, maxLength - 3) + '...';
      };

      const setRaw = (id, payload) => {
        if (!id || payload === undefined) return;
        const rawEl = document.getElementById(id);
        const containerEl = document.getElementById(id + '-container');
        if (!rawEl || !containerEl) return;
        rawEl.textContent = JSON.stringify(payload, null, 2);
        containerEl.classList.remove('hidden');
      };

      const withTimeout = async (promise, timeoutMs = DEFAULT_TIMEOUT_MS) => {
        let timeoutId;
        try {
          return await Promise.race([
            promise,
            new Promise((_, reject) => {
              timeoutId = setTimeout(() => reject(new Error('Timed out')), timeoutMs);
            })
          ]);
        } finally {
          clearTimeout(timeoutId);
        }
      };

      const scriptLoadCache = new Map();

      const loadExternalScript = async (urls) => {
        for (const url of urls) {
          if (!url) continue;
          if (!scriptLoadCache.has(url)) {
            scriptLoadCache.set(url, new Promise((resolve, reject) => {
              const script = document.createElement('script');
              script.src = url;
              script.async = true;
              script.crossOrigin = 'anonymous';
              script.onload = () => resolve();
              script.onerror = () => reject(new Error('Failed to load: ' + url));
              document.head.appendChild(script);
            }));
          }

          try {
            await scriptLoadCache.get(url);
            return true;
          } catch {
            // Try next candidate URL
          }
        }
        return false;
      };

      const hashString = async (input) => {
        if (!window.crypto?.subtle) return null;
        const digest = await crypto.subtle.digest('SHA-256', encodeToBytes(input));
        return Array.from(new Uint8Array(digest))
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('')
          .slice(0, 24);
      };

      // Provider registry shape:
      // { id: string, name: string, rawId?: string, loadAndCollect: () => Promise<{ value: string, raw?: unknown } | null> }
      const providers = [
        {
          id: 'fp-fingerprintjs',
          name: 'FingerprintJS',
          rawId: 'fp-raw-fpjs',
          loadAndCollect: async () => {
            const fp = await import('https://openfpcdn.io/fingerprintjs/v4').then((FingerprintJS) => FingerprintJS.load());
            const result = await fp.get();
            return { value: result.visitorId, raw: result };
          }
        },
        {
          id: 'fp-thumbmarkjs',
          name: 'ThumbmarkJS',
          rawId: 'fp-raw-thumbmark',
          loadAndCollect: async () => {
            await import('https://cdn.jsdelivr.net/npm/@thumbmarkjs/thumbmarkjs/dist/thumbmark.umd.js');
            if (!window.ThumbmarkJS) return null;
            const tm = new window.ThumbmarkJS.Thumbmark();
            const result = await tm.get();
            return { value: String(result.thumbmark || result), raw: result };
          }
        },
        {
          id: 'fp-clientjs',
          name: 'ClientJS',
          rawId: 'fp-raw-clientjs',
          loadAndCollect: async () => {
            const loaded = await loadExternalScript([
              'https://cdn.jsdelivr.net/npm/clientjs@0.2.1/dist/client.min.js',
              'https://unpkg.com/clientjs@0.2.1/dist/client.min.js'
            ]);
            if (!loaded) return null;
            if (!window.ClientJS) return null;
            const client = new window.ClientJS();
            const readClientJs = (methodName) => {
              const fn = client?.[methodName];
              if (typeof fn !== 'function') return null;
              try {
                return fn.call(client);
              } catch {
                return null;
              }
            };
            const raw = {
              browser: readClientJs('getBrowser'),
              browserVersion: readClientJs('getBrowserVersion'),
              browserMajorVersion: readClientJs('getBrowserMajorVersion'),
              engine: readClientJs('getEngine'),
              engineVersion: readClientJs('getEngineVersion'),
              os: readClientJs('getOS'),
              osVersion: readClientJs('getOSVersion'),
              device: readClientJs('getDevice'),
              deviceType: readClientJs('getDeviceType'),
              cpu: readClientJs('getCPU'),
              currentResolution: readClientJs('getCurrentResolution'),
              availableResolution: readClientJs('getAvailableResolution'),
              timezone: readClientJs('getTimeZone'),
              language: readClientJs('getLanguage'),
              platform: readClientJs('getPlatform'),
              vendor: readClientJs('getVendor'),
              fingerprint: readClientJs('getFingerprint')
            };
            const signature = [raw.browser, raw.os, raw.device].join(' | ');
            return { value: signature + ' #' + raw.fingerprint, raw };
          }
        },
        {
          id: 'fp-fingerprintx',
          name: 'FingerprintX',
          rawId: 'fp-raw-fingerprintx',
          loadAndCollect: async () => {
            const raw = {
              userAgent: navigator.userAgent || null,
              language: navigator.language || null,
              languages: Array.isArray(navigator.languages) ? navigator.languages : [],
              platform: navigator.platform || null,
              hardwareConcurrency: navigator.hardwareConcurrency ?? null,
              deviceMemory: navigator.deviceMemory ?? null,
              colorDepth: screen.colorDepth ?? null,
              pixelRatio: window.devicePixelRatio ?? null,
              screenResolution: [screen.width, screen.height],
              availableScreenResolution: [screen.availWidth, screen.availHeight],
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
              touchPoints: navigator.maxTouchPoints ?? 0,
              webdriver: navigator.webdriver === true,
              pluginsCount: navigator.plugins?.length ?? 0
            };

            const fingerprintInput = JSON.stringify(raw);
            let fingerprint = await hashString(fingerprintInput);
            if (!fingerprint) {
              let checksum = 0;
              for (let i = 0; i < fingerprintInput.length; i++) {
                checksum = ((checksum << 5) - checksum + fingerprintInput.charCodeAt(i)) | 0;
              }
              fingerprint = Math.abs(checksum).toString(16);
            }

            return { value: fingerprint, raw };
          }
        },
        {
          id: 'fp-audiohash',
          name: 'Audio Signal Hash',
          loadAndCollect: async () => {
            const AudioContextCtor = window.OfflineAudioContext || window.webkitOfflineAudioContext;
            if (!AudioContextCtor) return null;
            const context = new AudioContextCtor(1, 5000, 44100);
            const oscillator = context.createOscillator();
            const compressor = context.createDynamicsCompressor();
            oscillator.type = 'triangle';
            oscillator.frequency.value = 10000;
            compressor.threshold.value = -50;
            compressor.knee.value = 40;
            compressor.ratio.value = 12;
            compressor.attack.value = 0;
            compressor.release.value = 0.25;
            oscillator.connect(compressor);
            compressor.connect(context.destination);
            oscillator.start(0);
            const buffer = await context.startRendering();
            const data = buffer.getChannelData(0);
            const slice = Array.from(data.slice(4500, 5000)).map((num) => num.toFixed(6)).join(',');
            const hash = await hashString(slice);
            return { value: hash || 'Unavailable' };
          }
        }
      ];

      for (const provider of providers) {
        setText(provider.id, 'Loading...');
        try {
          const result = await withTimeout(provider.loadAndCollect());
          if (!result || !result.value) {
            setText(provider.id, 'Unavailable');
            continue;
          }
          setText(provider.id, String(result.value));
          setRaw(provider.rawId, result.raw);
        } catch (e) {
          if (e instanceof Error && e.message === 'Timed out') {
            setText(provider.id, 'Timed out');
          } else {
            console.error(provider.name + ' error:', e);
            setText(provider.id, 'Error');
          }
        }
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

      // UA Client Hints
      try {
        if (!navigator.userAgentData) {
          setText('fp-uach', 'Unavailable');
        } else {
          const brands = Array.isArray(navigator.userAgentData.brands)
            ? navigator.userAgentData.brands.map((item) => item.brand + '/' + item.version).join(', ')
            : 'Unknown';
          const summary = [
            'P:' + (navigator.userAgentData.platform || 'Unknown'),
            'M:' + (navigator.userAgentData.mobile ? '1' : '0'),
            'B:' + truncateValue(brands, 52)
          ].join(' | ');
          setText('fp-uach', truncateValue(summary, 110));
          setRaw('fp-raw-uach', {
            brands: navigator.userAgentData.brands,
            mobile: navigator.userAgentData.mobile,
            platform: navigator.userAgentData.platform
          });
        }
      } catch (e) {
        console.error('UA-CH error:', e);
        setText('fp-uach', 'Error');
      }

      // AudioContext Fingerprint
      try {
        const AudioContextCtor = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        if (!AudioContextCtor) {
          setText('fp-audio', 'Unavailable');
        } else {
          const context = new AudioContextCtor(1, 4096, 44100);
          const oscillator = context.createOscillator();
          const analyser = context.createAnalyser();
          oscillator.type = 'sine';
          oscillator.frequency.value = 997;
          analyser.fftSize = 2048;
          oscillator.connect(analyser);
          analyser.connect(context.destination);
          oscillator.start(0);
          const buffer = await context.startRendering();
          const data = buffer.getChannelData(0);
          let numericHash = 0;
          const signature = [];
          for (let i = 1000; i < 1128; i++) {
            const sample = Math.round(data[i] * 1e6);
            signature.push(sample);
            numericHash = (numericHash * 33 + (sample & 0xffff)) >>> 0;
          }
          setText('fp-audio', numericHash.toString(16).padStart(8, '0'));
          setRaw('fp-raw-audio', {
            hash: numericHash,
            sampleRate: buffer.sampleRate,
            signature
          });
        }
      } catch (e) {
        console.error('AudioContext collector error:', e);
        setText('fp-audio', 'Error');
      }

      // Fonts Fingerprint
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setText('fp-fonts', 'Unavailable');
        } else {
          const text = 'mmmmmmmmmmlli';
          const size = '72px';
          const baseFamilies = ['monospace', 'sans-serif', 'serif'];
          const testFonts = ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Trebuchet MS', 'Comic Sans MS', 'Impact', 'Monaco'];
          const baseWidths = {};

          for (const baseFamily of baseFamilies) {
            ctx.font = size + ' ' + baseFamily;
            baseWidths[baseFamily] = ctx.measureText(text).width;
          }

          const detected = [];
          const widthSignature = [];
          for (const font of testFonts) {
            let matched = false;
            for (const baseFamily of baseFamilies) {
              ctx.font = size + " '" + font + "'," + baseFamily;
              const width = ctx.measureText(text).width;
              widthSignature.push(font + ':' + baseFamily + ':' + width.toFixed(2));
              if (Math.abs(width - baseWidths[baseFamily]) > 0.1) matched = true;
            }
            if (matched) detected.push(font);
          }

          const signaturePayload = widthSignature.join('|');
          const fontHash = await hashString(signaturePayload);
          const concise = detected.join(',') || 'none';
          setText('fp-fonts', truncateValue(concise + ' #' + (fontHash || 'na'), 110));
          setRaw('fp-raw-fonts', {
            detected,
            hash: fontHash,
            signature: widthSignature
          });
        }
      } catch (e) {
        console.error('Fonts collector error:', e);
        setText('fp-fonts', 'Error');
      }

      // Media Capability Fingerprint
      try {
        const mediaDevices = navigator.mediaDevices;
        if (!mediaDevices?.enumerateDevices) {
          setText('fp-media-cap', 'Unavailable');
        } else {
          const payload = {
            enumerateDevices: true,
            permission: 'unknown',
            devices: [],
            constraints: mediaDevices.getSupportedConstraints ? mediaDevices.getSupportedConstraints() : {}
          };

          if (navigator.permissions?.query) {
            const cameraPermission = await navigator.permissions.query({ name: 'camera' });
            payload.permission = cameraPermission.state;
          }

          if (payload.permission === 'granted') {
            try {
              const devices = await withTimeout(mediaDevices.enumerateDevices(), 2500);
              payload.devices = devices.map((device) => ({ kind: device.kind, label: device.label || '(hidden)' }));
            } catch (_e) {
              payload.devices = [{ kind: 'unknown', label: 'enumerateDevices timeout/error' }];
            }
          }

          const constraintKeys = Object.keys(payload.constraints).filter((key) => payload.constraints[key]);
          const summary = payload.permission === 'granted'
            ? 'enum:on | perm:granted | devices:' + payload.devices.length
            : 'enum:on | perm:' + payload.permission + ' | constraints:' + constraintKeys.slice(0, 6).join(',');

          setText('fp-media-cap', truncateValue(summary, 110));
          setRaw('fp-raw-media-cap', payload);
        }
      } catch (e) {
        console.error('Media capability collector error:', e);
        setText('fp-media-cap', 'Error');
      }

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

const Script = () => {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT_CONTENT }} />
}

export const View = (props: { headers: Record<string, string>, cf: any }) => {
  const flattenedCf = flattenObject(props.cf);
  return (
    <Layout title="Cloudflare Request Inspector">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-gray-200 dark:border-gray-800 pb-6 gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-orange-500 mb-2">Request Inspector</h1>
          <p class="text-gray-500 dark:text-gray-400">Real-time analysis of your connection and browser environment.</p>
        </div>
        <button
          id="theme-toggle"
          class="p-2.5 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {/* Sun (Light) */}
          <svg id="icon-sun" class="hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          {/* Moon (Dark) */}
          <svg id="icon-moon" class="hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          {/* Computer (System) */}
          <svg id="icon-system" class="hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
        </button>
      </div>

      <div class="grid-muuri relative opacity-0 transition-opacity duration-300 -ml-4">
        {/* Server Side Info */}
        <Card title="Server-Side" icon={Icons.Cloud} description="Information visible to Cloudflare">
          <div class="overflow-x-auto">
            <RecursiveTable data={flattenedCf} />
          </div>
        </Card>

        {/* Headers */}
        <Card title="Request Headers" icon={Icons.Inbox} description="HTTP headers sent by your client">
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
        <Card title="Client Fingerprint" icon={Icons.Chip} description="Browser signals gathered via JS">
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
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">UA-CH</th><td id="fp-uach" class="py-2 px-4 text-gray-800 dark:text-gray-200 font-mono text-xs break-all">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">AudioContext</th><td id="fp-audio" class="py-2 px-4 text-gray-800 dark:text-gray-200 font-mono text-xs break-all">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Fonts</th><td id="fp-fonts" class="py-2 px-4 text-gray-800 dark:text-gray-200 font-mono text-xs break-all">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Media Capability</th><td id="fp-media-cap" class="py-2 px-4 text-gray-800 dark:text-gray-200 font-mono text-xs break-all">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Canvas Hash</th><td id="fp-canvas" class="py-2 px-4 text-gray-800 dark:text-gray-200 font-mono text-xs">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">WebGL</th><td id="fp-webgl" class="py-2 px-4 text-gray-800 dark:text-gray-200 text-xs">...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">FingerprintJS</th><td id="fp-fingerprintjs" class="py-2 px-4 text-orange-500 dark:text-orange-400 font-mono text-xs break-all">Loading...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">ThumbmarkJS</th><td id="fp-thumbmarkjs" class="py-2 px-4 text-orange-500 dark:text-orange-400 font-mono text-xs break-all">Loading...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">ClientJS</th><td id="fp-clientjs" class="py-2 px-4 text-orange-500 dark:text-orange-400 font-mono text-xs break-all">Loading...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">FingerprintX</th><td id="fp-fingerprintx" class="py-2 px-4 text-orange-500 dark:text-orange-400 font-mono text-xs break-all">Loading...</td></tr>
                <tr class="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5"><th class="py-2 px-4 text-gray-500 dark:text-gray-400 font-medium">Audio Signal Hash</th><td id="fp-audiohash" class="py-2 px-4 text-orange-500 dark:text-orange-400 font-mono text-xs break-all">Loading...</td></tr>
              </tbody>
            </table>

            <div id="fp-raw-fpjs-container" class="hidden border-t border-gray-200 dark:border-gray-800">
                <details class="group">
                    <summary class="p-3 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 select-none font-mono flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                        <span class="inline-block transition-transform group-open:rotate-90">▶</span> Show Raw FingerprintJS Data
                    </summary>
                    <pre id="fp-raw-fpjs" class="p-3 bg-gray-50 dark:bg-black/30 text-[10px] text-green-600 dark:text-green-400 font-mono overflow-x-auto whitespace-pre-wrap"></pre>
                </details>
            </div>

            <div id="fp-raw-thumbmark-container" class="hidden border-t border-gray-200 dark:border-gray-800">
                <details class="group">
                    <summary class="p-3 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 select-none font-mono flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                        <span class="inline-block transition-transform group-open:rotate-90">▶</span> Show Raw ThumbmarkJS Data
                    </summary>
                    <pre id="fp-raw-thumbmark" class="p-3 bg-gray-50 dark:bg-black/30 text-[10px] text-green-600 dark:text-green-400 font-mono overflow-x-auto whitespace-pre-wrap"></pre>
                </details>
            </div>

            <div id="fp-raw-clientjs-container" class="hidden border-t border-gray-200 dark:border-gray-800">
                <details class="group">
                    <summary class="p-3 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 select-none font-mono flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                        <span class="inline-block transition-transform group-open:rotate-90">▶</span> Show Raw ClientJS Data
                    </summary>
                    <pre id="fp-raw-clientjs" class="p-3 bg-gray-50 dark:bg-black/30 text-[10px] text-green-600 dark:text-green-400 font-mono overflow-x-auto whitespace-pre-wrap"></pre>
                </details>
            </div>

            <div id="fp-raw-fingerprintx-container" class="hidden border-t border-gray-200 dark:border-gray-800">
                <details class="group">
                    <summary class="p-3 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 select-none font-mono flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                        <span class="inline-block transition-transform group-open:rotate-90">▶</span> Show Raw FingerprintX Data
                    </summary>
                    <pre id="fp-raw-fingerprintx" class="p-3 bg-gray-50 dark:bg-black/30 text-[10px] text-green-600 dark:text-green-400 font-mono overflow-x-auto whitespace-pre-wrap"></pre>
                </details>
            </div>

            <div id="fp-raw-uach-container" class="hidden border-t border-gray-200 dark:border-gray-800">
                <details class="group">
                    <summary class="p-3 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 select-none font-mono flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                        <span class="inline-block transition-transform group-open:rotate-90">▶</span> Show Raw UA-CH Data
                    </summary>
                    <pre id="fp-raw-uach" class="p-3 bg-gray-50 dark:bg-black/30 text-[10px] text-green-600 dark:text-green-400 font-mono overflow-x-auto whitespace-pre-wrap"></pre>
                </details>
            </div>

            <div id="fp-raw-audio-container" class="hidden border-t border-gray-200 dark:border-gray-800">
                <details class="group">
                    <summary class="p-3 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 select-none font-mono flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                        <span class="inline-block transition-transform group-open:rotate-90">▶</span> Show Raw AudioContext Data
                    </summary>
                    <pre id="fp-raw-audio" class="p-3 bg-gray-50 dark:bg-black/30 text-[10px] text-green-600 dark:text-green-400 font-mono overflow-x-auto whitespace-pre-wrap"></pre>
                </details>
            </div>

            <div id="fp-raw-fonts-container" class="hidden border-t border-gray-200 dark:border-gray-800">
                <details class="group">
                    <summary class="p-3 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 select-none font-mono flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                        <span class="inline-block transition-transform group-open:rotate-90">▶</span> Show Raw Fonts Data
                    </summary>
                    <pre id="fp-raw-fonts" class="p-3 bg-gray-50 dark:bg-black/30 text-[10px] text-green-600 dark:text-green-400 font-mono overflow-x-auto whitespace-pre-wrap"></pre>
                </details>
            </div>

            <div id="fp-raw-media-cap-container" class="hidden border-t border-gray-200 dark:border-gray-800">
                <details class="group">
                    <summary class="p-3 text-xs text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 select-none font-mono flex items-center gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500">
                        <span class="inline-block transition-transform group-open:rotate-90">▶</span> Show Raw Media Capability Data
                    </summary>
                    <pre id="fp-raw-media-cap" class="p-3 bg-gray-50 dark:bg-black/30 text-[10px] text-green-600 dark:text-green-400 font-mono overflow-x-auto whitespace-pre-wrap"></pre>
                </details>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  )
}
