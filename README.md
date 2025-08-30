# Auth System (TypeScript, no external deps)

Features:
- User registration with email validation and strong password requirements
- Login/Logout with session management via signed HttpOnly cookies
- Protected routes (Dashboard, Profile)
- User profile page with update functionality
- Password reset via email (written to data/outbox)
- Proper error handling and user feedback messages
- Styled with Tailwind CSS (CDN)
- Unit tests for core authentication logic (Node test runner)
- Full TypeScript types

Getting Started:
1) Ensure Node.js >= 18 is installed.
2) Build: npm run build
3) Start: npm run start
   - Server runs at http://localhost:3000
4) Dev (ts-node): npm run dev (requires ts-node if installed, or build then start)
5) Tests:
   - Build first: npm run build
   - Run tests: npm run test

Environment:
- BASE_URL (default: http://localhost:3000)
- COOKIE_SECRET (set a strong value in production)

Password Reset:
- After requesting a reset, check data/outbox for an .eml file containing the reset link.

Docs:
- See docs/authentication-flow.md for detailed flow.

Notes:
- This implementation uses simple JSON files for persistence (data/*.json). Replace with a proper database in production.
