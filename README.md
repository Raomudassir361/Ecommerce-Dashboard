# Berry Admin

Berry Admin is a standalone React/Vite admin panel. It uses the backend API for all store data and relies on the backend's httpOnly session cookie; it does not persist authentication tokens or business data in the browser.

## Local development

1. Install dependencies with `npm install`.
2. Start the backend at `http://localhost:5000`, or set `BACKEND_URL` to its origin.
3. Run `npm run dev` and open [http://localhost:3000/admin/](http://localhost:3000/admin/). Vite's `/admin/` base path requires the trailing slash during local development.

Vite proxies `/api/*` to `BACKEND_URL` (default `http://localhost:5000`). The app sends requests with `credentials: "include"`.

## API configuration

By default, the browser calls the same origin at `/api`. This is the recommended production setup because the admin session cookie remains first-party. If the API must be called directly, set `VITE_API_BASE_URL` to the backend API base URL (for example `https://api.example.com/api`) and configure the backend's cookie and CORS settings to allow the admin site's origin.

The app expects the admin API routes documented in [the admin panel PRD](./docs/PRD%20Admin%20Panel.md). Protected `/api/admin/*` requests must be authorized by the backend.

## Vercel deployment

Deploy this repository independently from the backend. The Vercel build writes the site to `dist/admin`, while the output directory remains `dist`; Vercel serves `/admin` and rewrites `/admin/*` to the app entry point.

Before deploying, update the API rewrite in `vercel.json` to the backend's publicly reachable HTTPS origin. The current `http://localhost:5000` rewrite is for local backend development and cannot reach a developer machine from Vercel. `/` redirects to `/admin`; paths outside `/admin/*` are not app routes.
