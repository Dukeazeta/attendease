# AttendEase

**AttendEase** is a production-grade, anti-cheat attendance management system designed for academic and corporate environments. It leverages geolocation, device fingerprinting, and dynamic session management to ensure attendance integrity and streamline the tracking process.

---

## ✨ Key Features

- 🏢 **Pre-Stored Venues**: Define class venues with specific GPS coordinates and geofencing radii.
- 📍 **Geolocation Verification**: Students can only sign attendance if they are within the authorized venue radius.
- 🛡️ **Anti-Cheat Fingerprinting**: Prevents multiple signings from the same device or browser.
- 🏃 **Dynamic Sessions**: Course representatives can start and end attendance sessions with unique share codes.
- 📊 **Real-Time Tracking**: Monitor attendance logs as they happen with manual entry options for edge cases.
- 🔐 **Secure Authentication**: Built-in authentication for Course Reps and Students using NextAuth.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router, Server Components)
- **Database**: [Turso (libSQL)](https://turso.tech/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Fingerprinting**: [@fingerprintjs/fingerprintjs](https://fingerprintjs.com/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (Latest LTS)
- [pnpm](https://pnpm.io/) (Recommended)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dukeazeta/attendease.git
   cd attendease
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables**:
   Create a `.env` file in the root directory and add the following:
   ```env
   # Database
   DATABASE_URL="file:local.db"
   
   # Auth
   AUTH_SECRET="your-next-auth-secret" # Generate with `npx auth secret`
   ```

4. **Initialize the Database**:
   ```bash
   pnpm db:push
   ```

5. **Run the Development Server**:
   ```bash
   pnpm dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

---

## 🔒 Security Setup

If you see an error regarding `JWT_PRIVATE_KEY` during setup:

1. **Generate the key**:
   ```bash
   pnpm auth:generate-jwt-key
   ```
2. **Copy the result** and add it to your environment variables or platform settings.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## ⚖️ License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by [Dukeazeta](https://github.com/Dukeazeta)
