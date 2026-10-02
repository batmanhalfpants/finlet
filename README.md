# FinLit Co-Pilot — iOS prototype

Clickable prototype for the FinLit Ventures case: an explainable AI Co-Pilot that
intercepts a panic "Pause SIP" tap during a market correction and offers smarter
alternatives, while leaving the final decision with the investor.

## Run

```bash
npm install
npm run dev      # http://localhost:5173 — open in a phone-sized viewport or on your phone
npm run build    # production build in dist/
```

## Flow

1. **Dashboard** — portfolio ₹2,45,000 with a `-12.4% (Market Correction)` badge and the
   Nifty 50 Index Fund SIP (₹5,000/month) with a **Pause SIP** button.
2. **Analyzing** — 1.5s frosted-glass overlay: "AI Co-Pilot analyzing your portfolio health…"
3. **Intervention sheet** — draggable iOS bottom sheet with the hook, a Recharts projection
   (keep buying ₹10L vs pause ₹6L in 5 yrs), an expandable "why" panel, and three choices:
   - **Reduce SIP to ₹1,000 temporarily** (Smart Step-Down, auto-restores in 3 months)
   - **Pause for 60 Days only** (Smart Pause, auto-resumes)
   - **Proceed with full pause** (user always keeps control)

Each choice updates the SIP card and goal tracker and shows an iOS-style banner; the SIP
can be restored from the card to replay the flow. Dismissing the sheet keeps the SIP running.

## Structure

```
src/
  App.jsx                 state machine: dashboard → analyzing → intervention
  components/             StatusBar, Header, PortfolioHeroCard, SipCard, GoalCard, TabBar,
                          AnalyzingOverlay, InterventionSheet, ProjectionChart, Toast
  icons/                  CoPilotOrb, FinLitMark, IndexFundIcon (custom SVG)
  utils/                  cn (clsx + tailwind-merge), format (₹ / lakh), portfolio (mock data),
                          projection (scenario model behind the XAI chart)
```

Stack: React 18, Vite 5, Tailwind CSS 3, framer-motion, recharts, lucide-react.
Projections are illustrative and calibrated to the case dossier figures.
