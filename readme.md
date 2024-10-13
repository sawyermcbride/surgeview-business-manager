# SurgeView Marketing Application 

This repository contains the technology infrastructure for SurgeView Marketing, providing both a user-facing website and internal business tools. It handles key operations such as signup, payments, and service administration.

### Overview

This application is divided into two primary parts:

1. User-Facing Website:

- Purpose: Allows users to sign up and purchase our YouTube marketing services.
- Features:
  - Signup and Payment Pages
  - Marketing Product Management

2. Business Tools Portal:
- Purpose: A portal for managers to administer services, handle customers, and manage orders.
- Features:
  - Internal Dashboard
  - Role-based Access Control (Admin, Manager, etc.)


#### Technologies Used: 
- Node.js and Express.js
- TypeScript
- EJS for server-side templating
- React
- Database:
  - PostgreSQL for managing data such as users, orders, and product plans

- Authentication:
  - **Passport.js** for session-based login with role-based access control
 
- Logging:
  - Morgan for request logging

