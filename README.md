
# SG-Smile Saver – Project Overview

## Purpose

SG-Smile Saver is a web application designed to help users compare dental clinics, book appointments, and access practitioner details in Singapore. The platform aims to provide transparent pricing, verified clinic information, and a seamless booking experience.

## Tech Stack & Key Dependencies

- **Frontend:** React, TypeScript, Vite
- **UI Frameworks:** shadcn-ui, Tailwind CSS
- **Authentication & Data:** Supabase (for user auth and clinic data)
- **Other:** ESLint, PostCSS, Vercel (deployment)

## What to Expect from the Candidate

As part of your interview exercise, please:

1. **Develop an Overview:**  
	Provide your own high-level overview of the system architecture and design.  
	(How do the main components interact? What is the user flow?)

2. **Critique the Design:**  
	Identify strengths and weaknesses in the current system design and architecture.  
	(Consider UX, scalability, maintainability, and code structure.)

3. **Debug the Login Issue:**  
	Investigate and propose a solution for the current inability to log in.  
	(Focus on the `LoginForm` and `AuthContext.tsx`.)

**Note:**  
- No real API keys or secrets are included.  
- If you wish to run the project locally, use your own Supabase credentials or mock the API calls.
- The live site will be available at: [https://orachope.org](https://orachope.org) once the custom domain is attached.

## Instructions

- Please document your findings and solutions clearly.
- You may submit diagrams, written analysis, and/or code changes as appropriate.

## Production Deployment (OraChope.org)

### Required Environment Variables (Vercel Project Settings > Environment Variables)
Set for both Preview and Production unless noted:
- SUPABASE_URL – Supabase project API URL
- SUPABASE_SERVICE_ROLE_KEY – Service Role key (Production only; keep secret)
- SMTP2GO_API_KEY – SMTP2GO API key (for HTTP API sending)
- SMTP_USER – contact@orachope.org (or verified sender)
- BREVO_API_KEY / RESEND_API_KEY / SENDGRID_API_KEY (optional fallbacks)
- MAILGUN_API_KEY / MAILGUN_DOMAIN (optional fallback)

### Domain Configuration
1. Add custom domain in Vercel: `orachope.org` and `www.orachope.org`.
2. DNS (Namecheap):
	- Apex A record @ -> 76.76.21.21
	- www CNAME -> cname.vercel-dns.com
3. Force redirect: Ensure Vercel redirects www -> apex (Automatic in dashboard or via `vercel.json`).

### CORS / Auth Callback Updates
Add to any allowlists (Supabase Auth -> URL Configuration):
- https://orachope.org
- https://www.orachope.org

If using emailRedirect links, already updated to `https://orachope.org/create-password`.

### Email Authentication Checklist
1. In SMTP2GO / chosen provider: add domain orachope.org.
2. Publish SPF (include provider) & DKIM records. Example:
	- SPF: `v=spf1 include:spf.smtp2go.com ~all`
	- DKIM: provided selector CNAMEs from provider.
3. (Optional) DMARC: `_dmarc.orachope.org TXT v=DMARC1; p=none; rua=mailto:dmarc@orachope.org`
4. Send a test booking -> check headers for `SPF=pass` `DKIM=pass` `DMARC=pass`.

### Favicons & PWA
`index.html` references new `favicon.svg` and `site.webmanifest`. Replace `/orachope.png` with optimized PNG set later.

### Monitoring & Logs
- Vercel: Functions tab -> filter `send-appointment-confirmation` for latency & error rate.
- Add lightweight alert: Vercel project settings -> Alerts (500 errors threshold).
- SMTP2GO dashboard: monitor bounces & suppression list after first production sends.
- Supabase: Logs -> auth events for signUp recovery link usage.

### Post-Deployment QA
1. Navigate to https://orachope.org (no www redirect loops).
2. Register user → confirm password setup email uses new domain.
3. Book appointment with create account checked → verify two emails (patient + admin) deliver.
4. Mobile viewport (iPhone SE & Pixel) header alignment & tap targets.
5. Lighthouse quick pass (Performance, Accessibility > 90).

### Future Improvements
- Replace generic © text to consistent brand year roll-over.
- Add proper structured data (JSON-LD) for clinic listings.
- Implement server-side rate limiting for booking function.
- Add error tracking (Sentry) environment variable + init.
