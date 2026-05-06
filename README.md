# Go Viral — AI Creator Assistant

> Upload your content. Get an AI virality score with hook analysis, caption rewrites, hashtag strategy, and competitor benchmarking — powered by Claude.

[![Live Demo](https://img.shields.io/badge/Live-Demo-E24B4A?style=flat-square)](https://your-vercel-url.vercel.app)
[![Claude API](https://img.shields.io/badge/Claude-claude--sonnet--4--20250514-blue?style=flat-square)](https://anthropic.com)

---

## Features

- 🎯 **AI Virality Score (0–100)** — Animated circular ring with count-up
- 🎣 **Hook Analysis** — First 3-second scoring + 3 AI rewrite suggestions  
- ✍️ **Caption Optimizer** — Side-by-side original vs AI-rewritten
- **#️⃣ Hashtag Strategy** — 12–15 tags: Trending / Niche / Evergreen
- 🎵 **Audio Suggestions** — 3 trending sounds matched to content vibe
- 📊 **Competitor Benchmark** — Animated bars vs Top 1% creators
- 🎊 **Confetti** at 85+ virality score
- 📄 **PDF Export** — Shareable virality report
- 🕒 **History** — Last 5 analyzed posts in localStorage
- 🔁 **Re-analyze with diff** — Score change view

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | TailwindCSS v4 |
| Animations | Framer Motion |
| AI | Anthropic Claude API |
| State | Zustand |
| PDF | jsPDF + html2canvas |
| Icons | Lucide React |
| Confetti | canvas-confetti |

## Getting Started

```bash
# Install dependencies
npm install

# Add your Claude API key
echo "VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env

# Start dev server
npm run dev

# Build for production
npm run build
```

## Environment Variables

```env
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

## Project Structure

```
src/
  components/       # UI components
  pages/            # Home + Results routes
  hooks/            # Zustand store
  lib/              # Claude API + image utils
ai-logs/            # AI conversation documentation
```

## AI Logs

See [`/ai-logs/`](./ai-logs/) for full AI conversation documentation including prompts, features built, and tool usage disclosure.

## Deployment (Vercel)

```bash
npm run build
# Deploy the dist/ folder to Vercel
```

Set `VITE_ANTHROPIC_API_KEY` in Vercel environment variables.

---

Built with [Antigravity](https://antigravity.dev) — AI coding assistant by Google DeepMind.
