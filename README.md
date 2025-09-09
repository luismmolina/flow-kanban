# Flow Kanban

Mobile‑first Kanban board optimized for flow. It emphasizes instant visibility of WIP limits, fast capture/edit without context loss, and a thumb‑friendly UI. Data is stored locally in the browser (no backend).

## Features

- WIP limits: Columns can define limits; moves are blocked when limits are exceeded.
- Fast capture: One‑tap add and inline edit via a sheet.
- Focused flow: Quick move to next/previous column; tracks card age since last move.
- Lightweight data: Persists cards to `localStorage`; no login or server.
- Mobile friendly: Tailwind‑based layout tuned for small screens.

## Tech Stack

- React 19 + TypeScript
- Vite 6 for dev/build
- Tailwind (CDN) for styling

## Getting Started

Prerequisites: Node.js 18+ (or any recent LTS)

1) Install dependencies

`npm install`

2) Start the dev server

`npm run dev`

3) Build for production

`npm run build`

4) Preview the production build

`npm run preview`

No environment variables are required. The previous reference to `GEMINI_API_KEY` was removed because this app runs entirely in the browser.

## Usage

- Click the pencil on a card to edit details.
- Move cards by swiping horizontally on touch devices, or use the left/right arrow buttons on each card (desktop).
- WIP limits block moves when a target column is full.

## Project Structure

- `index.html` – App shell and Tailwind CDN config
- `index.tsx` – React entry
- `App.tsx` – App state, routing between board and editor sheet
- `components/` – Board, Card, Sheet, and related UI pieces
- `constants.ts` – Initial columns and sample cards
- `types.ts` – Shared TypeScript types

## Data Persistence

Cards are saved to `localStorage` under the key `flow-kanban-cards`. Clearing browser data will reset the board.

## Deployment

Any static host will work (GitHub Pages, Netlify, Vercel, etc.).

- Build: `npm run build` (outputs `dist/`)
- Serve `dist/` with your host of choice

## Roadmap Ideas

- Toast for WIP limit violations
- Swipe/drag gestures for card movement
- Simple import/export (JSON)
- Basic theming and accessibility passes
