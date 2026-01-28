import { Hono } from 'hono'
import { html } from './html'

const app = new Hono()

// --- Utility Routes ---

// JSON Inspector: Returns full request details
app.get('/json', (c) => {
  const cf = c.req.raw.cf || {}
  const headers = c.req.header()

  return c.json({
    ...cf,
    requestHeaders: headers,
    url: c.req.url,
    method: c.req.method,
  }, 200, {
    // Ensure pretty print
    'Content-Type': 'application/json; charset=UTF-8'
  })
})

// IP Address: Returns just the IP
app.get('/ip', (c) => {
  const ip = c.req.header('CF-Connecting-IP') || c.req.header('x-forwarded-for') || 'unknown'
  return c.text(ip)
})

// User Agent: Returns just the UA string
app.get('/user-agent', (c) => {
  const ua = c.req.header('User-Agent') || 'unknown'
  return c.text(ua)
})

// Headers: Returns just the headers as JSON
app.get('/headers', (c) => {
  return c.json(c.req.header())
})

// Status: Returns a response with a specific status code
app.all('/status/:code', (c) => {
  const code = parseInt(c.req.param('code'), 10)
  if (isNaN(code) || code < 100 || code > 599) {
    return c.text('Invalid status code', 400)
  }
  // Hono types might require casting for dynamic status codes
  return c.text(`Returned status: ${code}`, code as any)
})

// Delay: Waits for X ms then returns
app.all('/delay/:ms', async (c) => {
  const ms = parseInt(c.req.param('ms'), 10)
  if (isNaN(ms)) {
    return c.text('Invalid delay', 400)
  }
  await new Promise(resolve => setTimeout(resolve, ms))
  return c.text(`Delayed by ${ms}ms`)
})

// Root Route - Advanced Dashboard
app.get('/', (c) => {
  const cf = (c.req.raw.cf || {}) as Record<string, any>
  const headers = c.req.header()

  // Prepare data for the view
  const viewData = {
    ...cf,
    requestMethod: c.req.method,
    // httpProtocol is often in cf, but if not we can't easily get it from standard Request
  }

  return c.html(html(headers, viewData))
})

export default app
