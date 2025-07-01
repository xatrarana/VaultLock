## 📌 VaultLock Roadmap

A secure, modern password manager built with Next.js App Router, Clerk, Prisma, and Bun.

---

### ✅ MVP (Minimum Viable Product)

- [x] **Initialize Project Repository**
  - Bun + Next.js App Router + Tailwind CSS + GitHub repo

- [x] **Setup Authentication with Clerk**
  - OAuth (Google, GitHub)
  - Email/password login with OTP verification

- [ ] **Configure Database**
  - Neon PostgreSQL instance
  - Prisma schema (`User`, `Account` models)

- [v] **Sync Clerk Users to Database**
  - Webhook (`user.created`) to sync user + linked OAuth accounts

- [ ] **Implement Encrypted Password Storage**
  - Web Crypto API to encrypt passwords client-side
  - Store encrypted data in DB

---

### 🚀 Version 1

- [ ] **Build Password Vault UI**
  - Create / Read / Update / Delete (CRUD) password entries
  - Use Clerk session to show user-specific data

- [ ] **Decrypt Passwords Securely**
  - Only decrypt on client after authentication
  - Never send plain text to server

- [ ] **Password Generator Tool**
  - Generate strong random passwords
  - “Copy to Clipboard” button

- [ ] **Deploy to Vercel**
  - Set environment variables securely
  - Optimize build and runtime settings

---

### 🌐 Version 2

- [ ] **Sync Vault Across Devices**
  - Real-time sync or on-login fetch from DB
  - Background sync on updates

- [ ] **Add 2FA Setup**
  - Optional two-factor authentication using TOTP

- [ ] **Password Strength Meter**
  - Evaluate and display password strength during creation

- [ ] **Vault Search & Filtering**
  - Search by site name, username, tags

- [ ] **(Optional) Vault Sharing**
  - Share individual password entries with other users (role-based)

---

### 📁 Tech Stack

- Framework: [Next.js App Router](https://nextjs.org/docs/app)
- Auth: [Clerk.dev](https://clerk.dev/)
- Database: [Neon PostgreSQL](https://neon.tech/)
- ORM: [Prisma](https://prisma.io/)
- Runtime: [Bun](https://bun.sh/)
- Hosting: [Vercel](https://vercel.com/)
