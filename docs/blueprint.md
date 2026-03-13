# **App Name**: RivalRanks

## Core Features:

- Public Competitor Profiles: Display individual competitor pages with name, profile image, stats (wins, losses, draws), biography, and social links.
- Responsive UI: Works across desktop and mobile devices with a dark theme.
- Secure Admin Access: Password‑protected `/admin` and `/admin-fechas` sections using a simple environment-based password and sessionStorage.
- Competitor Management: Admin panel allows creating, editing, and deleting competitors stored in a local SQLite database.
- AI Bio Assistant (optional): A basic helper that can suggest biography text based on name and stats.
- Image Uploads: Administrators upload images via a local API; files are stored under `/public/uploads`.
- Tournaments, Events, Settings, Gallery: CRUD interfaces for each collection stored locally in SQLite.

## Style Guidelines:

- Primary accent color: Vibrant Purple (#AA30CC) on dark backgrounds.
- Background: Dark Purplish Gray (#1C191D).
- Secondary accent: Cool Blue (#4D99E6).
- Font: 'Inter' sans-serif.
- Clean, card‑based layouts for profiles and forms, with subtle hover effects and smooth transitions.