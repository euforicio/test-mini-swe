Authentication Flow Documentation

Overview
- Custom session-based authentication built with Node.js HTTP and TypeScript.
- Passwords hashed using scrypt and salted.
- Sessions are tracked server-side via a signed cookie with an ID referencing a JSON-backed session store.
- Password reset implemented via token links; emails written to data/outbox for demo.

Key Endpoints
- GET / — Home
- GET/POST /register — Registration with email validation and strong password requirements
- GET/POST /login — Login and session creation
- POST /logout — Logout and session invalidation
- GET/POST /profile — Authenticated profile updates
- GET/POST /forgot-password — Request password reset link
- GET/POST /reset-password?token=... — Complete password reset
- GET /dashboard — Protected route

Security
- Passwords hashed with Node crypto.scrypt.
- Sessions expire after 7 days; reset tokens expire after 1 hour.
- Session cookie is HttpOnly and SameSite=Lax and signed with HMAC-SHA256 to prevent tampering.

User Feedback
- Feedback messages are passed via query parameters (?success=..., ?error=...) and rendered in styled banners.

Styling
- Tailwind CSS via CDN for modern styling in all pages.

Testing
- Unit tests (Node’s built-in test runner) cover email validation, password strength, password hashing/verification, and signed-cookie integrity.

TypeScript Types
- See src/types.ts for User, Session, and PasswordResetToken types.

Configuration
- BASE_URL: Public base URL used in password reset links. Defaults to http://localhost:3000
- COOKIE_SECRET: Secret used to sign session cookies. Set a strong value in production.

Email Delivery
- In this demo, emails are written to data/outbox/*.eml. In production, replace sendEmail with an SMTP or API-based transport.
