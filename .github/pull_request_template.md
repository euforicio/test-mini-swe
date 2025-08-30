Title: Feature: User Authentication System

Summary
- Adds a complete user authentication system with registration, login/logout, sessions, protected routes, profile, password reset via email, Tailwind styling, robust error handling, unit tests, and TypeScript types.

Key Changes
- src/server.ts: HTTP server with all auth routes and session handling
- src/lib/security.ts: Validation, hashing, cookie signing
- src/lib/store.ts: JSON persistence helpers
- src/views/*: Tailwind-styled pages
- tests/security.test.ts: Unit tests
- docs/authentication-flow.md: Architecture and flow
- README.md: Setup and usage

How to Test
- Build: npm run build
- Start: npm run start
- Register, login, visit /dashboard and /profile
- Use /forgot-password to generate a link; open data/outbox to find the reset email
- Run tests: npm run test

Security Notes
- Passwords hashed with scrypt + salt
- Cookies are HttpOnly and signed
- Tokens expire (sessions: 7 days, reset: 1 hour)

Screenshots
- N/A (server-rendered HTML with Tailwind)

Checklist
- [x] Registration with email validation and password strength
- [x] Login/Logout + sessions
- [x] Protected routes
- [x] Profile updates
- [x] Password reset via email
- [x] Error handling and feedback
- [x] Tailwind styling
- [x] Unit tests
- [x] TypeScript types
