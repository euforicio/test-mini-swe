Feature: User Authentication System

This PR implements a full authentication system with:
1) Registration form with email validation and password strength requirements
2) Login/Logout functionality with signed, HttpOnly cookie-based sessions
3) Protected routes (Dashboard, Profile) requiring authentication
4) User profile page with update capability
5) Password reset via email (written to data/outbox in this demo)
6) Comprehensive error handling and user feedback banners
7) Modern styling via Tailwind (CDN)
8) Unit tests for authentication logic using Node's test runner
9) Strong TypeScript types throughout

Documentation: See docs/authentication-flow.md
Testing Instructions: See .github/pull_request_template.md (How to Test)
