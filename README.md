# PATENT-IPR

Modern frontend for intellectual property workflow management, built with Next.js App Router. The project includes:

- Marketing website (landing sections, FAQ, contact CTA)
- Client dashboard shell (cases, documents, timeline, payments, profile)
- Auth pages (login, signup)
- New patent filing flow
- Floating IPR chatbot widget integrated via a server-side proxy route

## Tech Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- ESLint 9

## Main Routes

- `/` - marketing website
- `/login` - user login
- `/signup` - user registration
- `/dashboard` - dashboard overview
- `/dashboard/cases` - case list
- `/dashboard/cases/new` - new patent filing form
- `/dashboard/cases/success` - filing success page
- `/dashboard/documents` - documents section
- `/dashboard/messages` - messages section
- `/dashboard/payments` - payments section
- `/dashboard/profile` - profile section
- `/dashboard/timeline` - timeline section
- `/dashboard/cost-estimator` - cost estimator
- `/api/chatbot` - Next.js proxy endpoint for chatbot backend

## Project Structure

```text
src/
	app/
		api/chatbot/route.js        # Chatbot proxy route
		dashboard/                  # Dashboard pages
		login/page.jsx
		signup/page.jsx
		layout.jsx                  # Root layout, mounts chatbot widget
		page.jsx                    # Landing page
	components/
		ChatbotWidget.jsx           # Floating chatbot UI
		dashboard/
			Sidebar.jsx
			Topbar.jsx
	lib/
		api.js                      # API base URL helper
```

## Prerequisites

- Node.js 20+
- npm 10+

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` in project root:

```bash
NEXT_PUBLIC_API_URL=https://your-main-backend-domain.com
CHATBOT_BACKEND_URL=http://127.0.0.1:10000/chat
```

3. Start development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Environment Variables

- `NEXT_PUBLIC_API_URL`
Used by frontend auth and filing requests via `src/lib/api.js`.

- `CHATBOT_BACKEND_URL`
Used by `src/app/api/chatbot/route.js` to forward chatbot requests.
Must point directly to the chatbot POST endpoint, usually ending with `/chat`.

Example for deployed Flask chatbot:

```bash
CHATBOT_BACKEND_URL=https://your-flask-domain.com/chat
```

## Chatbot Integration

The chatbot UI is rendered globally from `src/app/layout.jsx` through `src/components/ChatbotWidget.jsx`.

Flow:

1. User sends message from widget.
2. Widget calls `POST /api/chatbot`.
3. Next.js route forwards request to `CHATBOT_BACKEND_URL`.
4. Response is returned to the widget and displayed.

This keeps your backend URL hidden from browser code and avoids direct cross-origin setup in the widget.

## Scripts

- `npm run dev` - start local development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run ESLint checks

## Deployment Notes

Set the same environment variables in your hosting platform:

- Vercel: Project Settings -> Environment Variables
- Netlify/Render/Azure: site/app environment variable settings

After changing env vars, redeploy or restart the app.

## Current Status

- Core UI and routing are implemented.
- Several dashboard sections currently show placeholder or empty-state data until backend sync is completed.

## Troubleshooting

- Chatbot says backend unavailable:
Check `CHATBOT_BACKEND_URL` and confirm the Flask service is reachable.

- Auth/fetch requests fail:
Check `NEXT_PUBLIC_API_URL` and backend CORS/security config.

- Environment changes not reflected:
Restart local dev server or redeploy production build.
