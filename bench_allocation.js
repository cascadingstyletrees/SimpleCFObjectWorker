const { performance } = require('perf_hooks');

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

// Muuri & Minimize Logic
document.addEventListener('DOMContentLoaded', () => {
  try {
    const gridElement = document.querySelector('.grid-muuri');
    if (!gridElement) return;

    // @ts-ignore
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

        if (isHidden) {
          content.classList.remove('hidden');
          btn.querySelector('.icon-min').classList.remove('hidden');
          btn.querySelector('.icon-max').classList.add('hidden');
        } else {
          content.classList.add('hidden');
          btn.querySelector('.icon-min').classList.add('hidden');
          btn.querySelector('.icon-max').classList.remove('hidden');
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

// Fingerprinting Logic ... (Same as before)
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
`;

function allocateString() {
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

    // Muuri & Minimize Logic
    document.addEventListener('DOMContentLoaded', () => {
      try {
        const gridElement = document.querySelector('.grid-muuri');
        if (!gridElement) return;

        // @ts-ignore
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

            if (isHidden) {
              content.classList.remove('hidden');
              btn.querySelector('.icon-min').classList.remove('hidden');
              btn.querySelector('.icon-max').classList.add('hidden');
            } else {
              content.classList.add('hidden');
              btn.querySelector('.icon-min').classList.add('hidden');
              btn.querySelector('.icon-max').classList.remove('hidden');
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

    // Fingerprinting Logic ... (Same as before)
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
    `;
    return scriptContent.length;
}

function referenceString() {
    return SCRIPT_CONTENT.length;
}

const ITERATIONS = 1000000;

console.log(`Running benchmark with ${ITERATIONS} iterations...`);

const startAlloc = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    allocateString();
}
const endAlloc = performance.now();
const durationAlloc = endAlloc - startAlloc;

const startRef = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    referenceString();
}
const endRef = performance.now();
const durationRef = endRef - startRef;

console.log(`Allocation took: ${durationAlloc.toFixed(2)}ms`);
console.log(`Reference took: ${durationRef.toFixed(2)}ms`);
console.log(`Improvement: ${(durationAlloc / durationRef).toFixed(2)}x faster`);
