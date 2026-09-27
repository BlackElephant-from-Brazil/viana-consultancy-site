/**
 * Local stand-in for the n8n contact webhook.
 *
 * The contact route answers 503 when N8N_WEBHOOK_URL is unset, so a fresh
 * clone cannot exercise the form. Point .env.local at this receiver and it
 * prints whatever the route would have sent to n8n, then answers 200 so the
 * form shows its success state.
 *
 * Nothing here leaves the machine, and nothing reaches Patrícia.
 *
 *   node scripts/dev-webhook-echo.js
 */
const http = require('node:http')

const PORT = 3999

http
  .createServer((req, res) => {
    let body = ''
    req.on('data', chunk => (body += chunk))
    req.on('end', () => {
      const stamp = new Date().toLocaleTimeString()
      console.log(`\n[${stamp}] ${req.method} ${req.url}`)
      try {
        console.log(JSON.stringify(JSON.parse(body), null, 2))
      } catch {
        console.log(body)
      }
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end('{"ok":true}')
    })
  })
  .listen(PORT, () => {
    console.log(`Contact webhook stand-in listening on http://localhost:${PORT}`)
    console.log('Submissions made on localhost print here and go nowhere else.')
  })
