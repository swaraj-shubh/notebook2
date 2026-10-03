# Notebook · Frontend

A responsive React single-page app with a custom **clay design system**, light/dark themes and instant-feeling navigation.

[**Live demo →** https://notebook2.shubhh.xyz/](https://notebook2.shubhh.xyz/)

## Why this frontend is better

| Choice | What you get |
|---|---|
| **Vite 7** instead of a heavier bundler | Near-instant dev server and fast production builds. The whole app ships as **~100 kB gzipped JS**. |
| **Tailwind CSS v4 + design tokens** | The entire look (palette, shadows, animations) lives in ~70 lines of `index.css`. Pages only use names like `bg-card` or `shadow-clay`, so re-theming is a one-file change and dark mode needs no per-element code. |
| **No UI-kit lock-in** | Hand-built components, so the clay style stays consistent and there's no unused component library in the bundle. |
| **Stale-while-revalidate cache** | Returning to a page shows data **immediately** and refreshes in the background, with no loading spinner on every visit. |
| **Route guards** | `PrivateRoute` / `PublicRoute` keep logged-out users out, and send logged-in users away from login. |
| **Accessibility and comfort** | Honours `prefers-reduced-motion`, follows the system theme on first visit, remembers the choice, and works from phone to desktop. |

## Tech stack

| Area | Tools |
|---|---|
| Framework | **React 19**, **React Router 7** |
| Build | **Vite 7** |
| Styling | **Tailwind CSS v4** (`@theme` tokens, `@custom-variant` dark mode) |
| HTTP | **Axios** with a request interceptor (JWT) and a response interceptor (session expiry) |
| Feedback | `react-hot-toast`, `react-icons` |
| Security | **DOMPurify** for rendered user content |
| Quality | **ESLint 9** (+ react-hooks, react-refresh), GitHub Actions build check |
| Hosting | **Vercel** (SPA rewrite in `vercel.json`) |

## Features

- **Notes**: create, edit, delete; image/video upload with preview
- **Full-screen viewer** for images and videos
- **Responsive shell**: floating navbar, sidebar on desktop, bottom tab bar on mobile
- **Light/dark mode** toggle in the navbar, saved in `localStorage`
- **Guest login** ("Global Notebook") plus a 404 page
- **Admin area**: dashboard stats, user and note management
- **Motion**: page fade-ins, hover lift/scale on cards, click ripple on every button

## Design system

Everything visual is defined once in [`src/index.css`](src/index.css):

| Token | Example use |
|---|---|
| Surfaces: `bg-page`, `bg-card`, `bg-soft`, `bg-field` | page, cards, hover tints, inputs |
| Text: `text-ink`, `text-ink-2`, `text-muted`, `text-link` | headings, body, hints, links |
| Accent: `bg-accent`, `bg-danger`, `bg-success` | primary, destructive and success buttons |
| Shadows: `shadow-clay`, `shadow-clay-btn`, `shadow-clay-in`, `shadow-clay-press` | raised cards, buttons, pressed-in inputs |
| Motion: `animate-fade-up`, `animate-pop-in`, `animate-ripple` | entrances, modals, button feedback |

The surface and text tokens point at CSS variables that flip under `[data-theme="dark"]`, so a component written once works in both themes. To re-colour the app, edit the variables at the top of `index.css`.

## Project structure

```
src/
├── components/     Navbar, Sidebar, NoteCard, NotePreviewModal, FileUpload, GuestButton
├── context/        AuthContext (login state, logout, cache reset)
├── hooks/          useAuth
├── lib/            cache.js (in-memory stale-while-revalidate store)
├── pages/          Auth/, Dashboard/, Admin/, Loading/, NotFound
├── routes/         AppRoutes (private/public/admin guards)
├── services/       api.js (Axios), authService, noteService, uploadService
├── index.css       design tokens, theme variables, animations
└── main.jsx        theme bootstrap + global click ripple
```

## How data flows

1. A page reads the cache for instant content, then calls the API through a service.
2. The Axios request interceptor attaches the JWT; the response interceptor logs the user out on an expired session.
3. Fresh data updates both the screen and the cache. The cache is cleared on login and logout, so users never see each other's data.

## Getting started

```bash
npm install
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env
npm run dev        # http://localhost:3000
```

| Script | Purpose |
|---|---|
| `npm run dev` | dev server with HMR |
| `npm run build` | production build to `dist/` |
| `npm run preview` | serve the built app |
| `npm run lint` | ESLint |

## Deployment

Deployed on **Vercel**. Set `VITE_API_URL` to the production API URL; `vercel.json` rewrites every path to `index.html` so client-side routes work on refresh.

## Known limitations and next steps

- The JWT is stored in `localStorage` (simple, but exposed to XSS). A hardened version would use an httpOnly cookie.
- The cache is in memory, so a full page reload fetches again. Persisting it to `localStorage` would remove that.
- Some dependencies from the starter template (form/validation/Radix packages) are installed but unused and can be pruned.
- No frontend tests yet; React Testing Library is already installed.
