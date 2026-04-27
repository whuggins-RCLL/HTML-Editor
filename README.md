# AI HTML Editor

An AI-powered HTML editing tool that lets you paste or write HTML, describe changes in plain English, and get updated HTML back instantly. It includes a live preview and an API route that calls Gemini to transform your markup based on your prompt.

## What this tool does

- Edit HTML with natural-language instructions (for example: “make this a dark pricing section with 3 cards”).
- Generate complete HTML from scratch when your editor is empty.
- Stream AI output back into the editor and preview updates live.
- Run locally with Vite + Express, or deploy to Vercel.

---

## 1) Fork this repository

1. Open this repo on GitHub.
2. Click **Fork** (top-right).
3. Choose your account/organization and create the fork.
4. Clone your fork locally:

```bash
git clone https://github.com/<your-username>/HTML-Editor.git
cd HTML-Editor
```

5. (Optional but recommended) Add the original repo as `upstream` so you can sync future updates:

```bash
git remote add upstream https://github.com/<original-owner>/HTML-Editor.git
git fetch upstream
```

---

## 2) Local setup

### Prerequisites

- Node.js 18+ (Node.js 20 LTS recommended)
- npm

### Install and run

1. Install dependencies:

```bash
npm install
```

2. Create a local env file from the example:

```bash
cp .env.example .env.local
```

3. Add your AI key(s) in `.env.local` (details below).
4. Start the development server:

```bash
npm run dev
```

5. Open the app (usually):

```text
http://localhost:3000
```

---

## 3) AI key setup (Gemini + Groq)

### Gemini (required for current implementation)

This project currently uses **Gemini** in the API handler, so `GEMINI_API_KEY` is required.

1. Get a Gemini key from Google AI Studio.
2. Add to `.env.local`:

```env
GEMINI_API_KEY=your_real_gemini_key
```

### Groq (optional for future/extended model routing)

Groq is not wired into the current API code yet, but you can still set the key now for future model/provider switching.

Add this to `.env.local`:

```env
GROQ_API_KEY=your_real_groq_key
```

> Important: Never commit real API keys. Keep `.env.local` out of version control.

---

## 4) Deploy to Vercel

### A. Import your fork

1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Import your forked GitHub repository.
3. Vercel should auto-detect the project settings.

### B. Confirm build settings

Use these values if Vercel does not auto-fill correctly:

- **Framework Preset:** Vite
- **Install Command:** `npm install`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### C. Add environment variables in Vercel

In **Project Settings → Environment Variables**, add:

- `GEMINI_API_KEY` = your Gemini key (**required**)
- `GROQ_API_KEY` = your Groq key (**optional, for future use**)

Set them for the environments you need (Production / Preview / Development).

### D. Deploy

1. Click **Deploy**.
2. After deployment, open your Vercel URL.
3. Test an AI update prompt in the editor to confirm API connectivity.

If you rotate keys later, update them in Vercel and redeploy.

---

## Scripts

```bash
npm run dev     # Run local dev server (Express + Vite)
npm run build   # Build front-end assets
npm run start   # Start server
npm run lint    # Type-check (no emit)
```
