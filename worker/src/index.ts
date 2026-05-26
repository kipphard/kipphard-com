interface Env {
  TURNSTILE_SECRET_KEY: string
  RESEND_API_KEY: string
  ALLOWED_ORIGIN: string
  CONTACT_TO: string
  CONTACT_FROM: string
}

interface Body {
  name?: string
  email?: string
  company?: string
  projectType?: string
  budget?: string
  message?: string
  website?: string
  turnstileToken?: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

function json(data: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  })
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function buildEmail(b: Required<Omit<Body, 'website' | 'turnstileToken'>>): { html: string; text: string } {
  const rows = [
    ['Name', b.name],
    ['E-Mail', b.email],
    b.company ? ['Unternehmen', b.company] : null,
    b.projectType ? ['Typ', b.projectType] : null,
    b.budget ? ['Budget', b.budget] : null,
  ]
    .filter(Boolean)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;white-space:nowrap">${esc(k!)}</td><td style="padding:4px 0"><strong>${esc(v!)}</strong></td></tr>`)
    .join('')

  const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:640px;margin:0 auto;padding:24px">
<h2 style="margin-top:0">Neue Anfrage von ${esc(b.name)}</h2>
<table style="border-collapse:collapse;margin-bottom:20px">${rows}</table>
<p style="margin-bottom:4px;color:#666;font-size:13px">Nachricht:</p>
<pre style="background:#f5f5f5;padding:16px;border-radius:6px;white-space:pre-wrap;font-size:14px">${esc(b.message)}</pre>
</body></html>`

  const textRows = [
    `Name: ${b.name}`,
    `E-Mail: ${b.email}`,
    b.company ? `Unternehmen: ${b.company}` : '',
    b.projectType ? `Typ: ${b.projectType}` : '',
    b.budget ? `Budget: ${b.budget}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  const text = `Neue Anfrage von ${b.name}\n\n${textRows}\n\nNachricht:\n${b.message}`

  return { html, text }
}

async function handlePost(request: Request, env: Env): Promise<Response> {
  const origin = env.ALLOWED_ORIGIN

  let body: Body
  try {
    body = await request.json<Body>()
  } catch {
    return json({ ok: false, error: 'invalid' }, 400, origin)
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const company = typeof body.company === 'string' ? body.company.trim() : ''
  const projectType = typeof body.projectType === 'string' ? body.projectType.trim() : ''
  const budget = typeof body.budget === 'string' ? body.budget.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''
  const token = typeof body.turnstileToken === 'string' ? body.turnstileToken : ''

  const valid =
    name.length >= 1 && name.length <= 100 &&
    EMAIL_RE.test(email) && email.length <= 200 &&
    message.length >= 10 && message.length <= 5000 &&
    company.length <= 100 &&
    projectType.length <= 50 &&
    budget.length <= 50 &&
    token.length > 0

  if (!valid) {
    return json({ ok: false, error: 'invalid' }, 400, origin)
  }

  // Honeypot — fake success to confuse bots
  if (typeof body.website === 'string' && body.website.length > 0) {
    return json({ ok: true }, 200, origin)
  }

  const verifyForm = new URLSearchParams({
    secret: env.TURNSTILE_SECRET_KEY,
    response: token,
    remoteip: request.headers.get('CF-Connecting-IP') ?? '',
  })
  const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: verifyForm,
  })
  const verifyData = await verifyRes.json<{ success: boolean }>()
  if (verifyData.success !== true) {
    return json({ ok: false, error: 'captcha' }, 400, origin)
  }

  const subject =
    `Neue Anfrage von ${name}` + (projectType ? ` (${projectType})` : '')
  const { html, text } = buildEmail({ name, email, company, projectType, budget, message })

  const sendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: email,
      subject,
      html,
      text,
    }),
  })

  if (sendRes.status >= 300) {
    const sendBody = await sendRes.text().catch(() => '')
    console.log(`Resend error ${sendRes.status}: ${sendBody}`)
    return json({ ok: false, error: 'send-failed' }, 500, origin)
  }

  return json({ ok: true }, 200, origin)
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN
    const url = new URL(request.url)

    if (url.pathname !== '/api/contact') {
      return new Response('Not found', { status: 404, headers: corsHeaders(origin) })
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) })
    }

    if (request.method === 'POST') {
      return handlePost(request, env)
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders(origin) })
  },
}
