# n8n workflow: "Viana Consultancy Site - Send Contact Form"

> **Applied on 2026-09-07** through the n8n public API. This file now describes
> what the workflow does; the HTML at the bottom is the live welcome email.

Workflow: `black-elephant.app.n8n.cloud/workflow/MqTP6ars8DeyfyBp`
Reached by `POST /api/contact` on vianaconsultancy.com, via `N8N_WEBHOOK_URL`.

The site sends exactly these four fields:

```json
{ "name": "...", "mobile": "...", "email": "...", "message": "..." }
```

`subject` is gone from both sides: the form stopped asking for it, the workflow
stopped reading it, and the route no longer synthesises one. The internal mail
builds its own subject from `name`.

---

## Change 1 (applied): internal email goes to enquiries@ only

Open **Send Email via Gmail**.

| Field | Value |
|---|---|
| To | `enquiries@vianaconsultancy.com` |
| Subject | `={{ 'New Contact Form: ' + $json.body.name }}` |
| CC | empty |

The defect was worse than "it arrives as a copy": **To** held
`={{ $json.body.email }}`, so the internal notification was addressed to the
visitor and the firm was only a CC recipient.

---

## Change 2 (applied): welcome email to the sender

Add a second **Gmail → Send message** node between **Send Email via Gmail** and
**Respond to Webhook**, so the order becomes:

```
Contact Form Webhook → Send Email via Gmail → Send Welcome Email → Respond to Webhook
```

### Field values

| Field | Value |
|---|---|
| To | `={{ $('Contact Form Webhook').item.json.body.email }}` |
| Subject | `=Thank you for getting in touch, {{ $('Contact Form Webhook').item.json.body.name }}` |
| Email Type | **HTML** |
| Message | the HTML below |

**Two things that will bite you if skipped:**

1. **Reference the webhook node by name, not `$json`.** By the time this node
   runs, `$json` holds the *previous Gmail node's* output, so `$json.body.email`
   is empty and the mail goes nowhere. `$('Contact Form Webhook')` reaches back
   to the original payload.

2. **Check the path prefix.** This assumes the payload sits at `$json.body`,
   which is the n8n default for a Webhook node. Open the existing
   **Send Email via Gmail** node and copy whatever prefix it already uses. If it
   reads `{{ $json.name }}` rather than `{{ $json.body.name }}`, drop the
   `.body` from both expressions above and from the HTML.

### Recommended: do not let a bad address break the site response

On the new node, set **Settings → On Error → Continue (using error output)**.

Without it, a bounced or malformed recipient address makes the whole workflow
fail, **Respond to Webhook** never runs, and the site shows the visitor
"Something went wrong" even though the enquiry reached the firm.

---

## The welcome email

Design follows the site: navy `#011342`, gold `#C9973A`, gold pale `#FDF6E9`,
body text `#5C5C5C`. Table based with inline CSS, which is what mail clients
need; the button is a bulletproof table button so it survives Outlook. Fonts
fall back to Georgia (for Marcellus) and Arial (for Poppins), because mail
clients do not load web fonts reliably.

The CTA points at the Calendly used on visas.vianaconsultancy.com:
`https://calendly.com/enquiries-vianaconsultancy/relocation-strategy-session`

```html
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
  We have received your message and will be in touch shortly.
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F3F3F3;">
  <tr>
    <td align="center" style="padding:32px 16px;">

      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:#FFFFFF;border-radius:8px;overflow:hidden;">

        <tr><td style="height:4px;background-color:#C9973A;font-size:0;line-height:0;">&nbsp;</td></tr>

        <tr>
          <td align="center" style="background-color:#011342;padding:32px 24px;">
            <img src="https://vianaconsultancy.com/images/logo.png"
                 width="150" alt="Patrícia Viana Law Firm"
                 style="display:block;width:150px;max-width:150px;height:auto;border:0;">
          </td>
        </tr>

        <tr>
          <td style="padding:40px 40px 8px 40px;">

            <p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;color:#C9973A;">
              Welcome
            </p>

            <h1 style="margin:0 0 20px 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;font-weight:normal;color:#011342;">
              Thank you for getting in touch, {{ $('Contact Form Webhook').item.json.body.name }}.
            </h1>

            <p style="margin:0 0 16px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#5C5C5C;">
              We have received your message. A member of our team is reviewing it and
              <strong style="color:#011342;">we will be in touch shortly</strong>.
            </p>

            <p style="margin:0 0 28px 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:#5C5C5C;">
              Patrícia Viana Law Firm is a team of qualified Portuguese attorneys. We handle
              residency, visas and nationality matters in house, so the person who takes your
              case is the person who answers for it.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:0 40px 8px 40px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                   style="background-color:#FDF6E9;border-radius:8px;">
              <tr>
                <td align="center" style="padding:28px 24px;">

                  <p style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:1.35;color:#011342;">
                    Would you rather speak with us sooner?
                  </p>
                  <p style="margin:0 0 20px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#5C5C5C;">
                    Book a Relocation Strategy Session and pick a time that suits you.
                  </p>

                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                    <tr>
                      <td align="center" bgcolor="#C9973A" style="border-radius:30px;">
                        <a href="https://calendly.com/enquiries-vianaconsultancy/relocation-strategy-session"
                           target="_blank"
                           style="display:inline-block;padding:14px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;letter-spacing:0.5px;color:#FFFFFF;text-decoration:none;border-radius:30px;">
                          Book a Relocation Strategy Session
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 40px 36px 40px;">
            <p style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#5C5C5C;">
              You can also reach us directly:
            </p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.9;color:#5C5C5C;">
              <a href="mailto:enquiries@vianaconsultancy.com" style="color:#011342;text-decoration:none;font-weight:bold;">enquiries@vianaconsultancy.com</a><br>
              <a href="tel:+351960174940" style="color:#011342;text-decoration:none;font-weight:bold;">+351 960 174 940</a>
              <span style="color:#8A8A8A;font-size:12px;">(call to national mobile network)</span>
            </p>
          </td>
        </tr>

        <tr>
          <td style="background-color:#011342;padding:26px 40px;">
            <p style="margin:0 0 6px 0;font-family:Georgia,'Times New Roman',serif;font-size:15px;color:#FFFFFF;">
              Patrícia Viana Law Firm
            </p>
            <p style="margin:0 0 14px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.7;color:rgba(255,255,255,0.62);">
              Av. António Augusto Aguiar, 24, 1st floor right, 1050-016, Lisbon, Portugal
            </p>
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:rgba(255,255,255,0.45);">
              This message confirms we received your enquiry. It is not legal advice, and it does
              not create an attorney client relationship.
            </p>
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>
```

---

## After applying

Send one submission through the live form and confirm:

- the internal mail lands in `enquiries@vianaconsultancy.com` as a direct
  recipient, with nothing in CC;
- the sender receives the welcome mail, and the button opens Calendly;
- the site still shows its success state, meaning **Respond to Webhook** ran.
