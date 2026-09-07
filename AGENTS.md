# PRINEOR — Project Documentation & Guidelines

## 1. Project Overview & Identity
- **Brand Name**: PRINEOR
- **Tagline / Purpose**: A premier digital brand built to turn ideas into meaningful digital experiences — modern web development, AI solutions, digital marketing, and social media branding.
- **Brand Contact / Owner**: `prineorofficial@gmail.com`
- **Live Hosting Environment**: Hostinger Web Apps (Node.js) via GitHub continuous deployment.

---

## 2. Technical Stack & Architecture
- **Frontend Framework**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`) with custom luxury themes (Dark Crystal / Light Obsidian)
- **Animations**: `motion/react` (Motion 12) + Lucide Icons (`lucide-react`)
- **Backend**: Express 4 server (`server.ts` bundled with `esbuild` to `dist/server.cjs`)
- **Runtime Version**: Node.js `>= 20.19.0` (specified in `package.json` and `/.nvmrc`)
- **Database**: Supabase integration (`@supabase/supabase-js`, `db.js`) with resilient local fallback for instant availability
- **AI Integration**: Google Gemini API (`@google/genai`) for intelligent consultation and client inquiry processing

---

## 3. Deployment Configuration (Hostinger)
- **Entry File**: `server.js` (and fallback `app.js`), configured with automatic on-the-fly compilation of `server.ts` to prevent 503 errors.
- **Port Handling**: `process.env.PORT || 3000`, binding to `0.0.0.0` for host reverse proxy compatibility.
- **Build Command**: `npm run build`
- **Start Command**: `npm start` (or `node server.js`)
- **Static Output**: `dist/` (contains optimized SPA assets, `.htaccess` for Apache/Hostinger rewrite routing)

---

## 4. Environment Variables
The following environment variables are configured for production:
1. `GEMINI_API_KEY`: API key for Google Gemini server-side AI consultation & features.
2. `ADMIN_JWT_SECRET`: Secret key for secure admin session authentication tokens.
3. `SUPABASE_URL`: Supabase project URL (auto-provided when attached in Hostinger).
4. `SUPABASE_ANON_KEY`: Supabase anon/public API key (auto-provided in Hostinger).
5. `PORT`: Injected by Hostinger container/proxy (defaults to `3000` locally).

---

## 5. Application Modules & Features
- **Public Website**:
  - Hero section with interactive 3D crystal lighting and dynamic CTAs
  - Services (Web Development, AI Integration, Brand & Marketing, Digital Strategy)
  - Portfolio & Interactive Project Modals
  - Story / About PRINEOR
  - Interactive Skills Matrix & Experience Timeline
  - Blog & Article Reader Modal
  - Contact Inquiry Form with direct email and AI analysis
  - Brand Customizer Drawer (real-time theme & accent switching)
- **Admin Portal (`/admin`)**:
  - Secure JWT-based password authentication
  - Management of inquiries, messages, project showcases, and live website status

---

## 6. Admin Portal Credentials (Permanent Record)
- **Login URL**: `/admin` (or `/admin/login`)
- **Admin Email**: `dawoodmuzahir4@gmail.com` (also authorized: `prineorofficial@gmail.com`)
- **Admin Password**: `Prineor@-admin`
- **Security Question**: "What was your first project or brand name?"
- **Security Answer**: `prineor`
- **Recovery Key**: `PRN-PRIN-EOR2-026X`
- **Authentication Store**: `data/admin-auth.json` and fallback defaults in `server.ts`

