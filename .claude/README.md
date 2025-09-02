# Spend Navigator - React Calculator App

## What This Is
Create React App calculator currently showing "cost of inaction" with real-time counters.
Goal: Transform into tail spend scenario modeler for CFOs.

## Quick Commands
```bash
npm start          # Run locally (finds open port)
npm run build      # Build for production
npm test           # Run tests

Current Structure

SpendNavigator.js - Main calculator with counters and sliders
ContactForm.js - Lead capture form
industryCategories.json - Industry-specific spend categories
Using Tailwind via CDN in index.html

Deployment
bashnpm run build
vercel              # Deploy build folder