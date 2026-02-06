import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] bg-grid-pattern bg-gradient-radial">
      {/* Navigation */}
      <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--bg-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-[var(--text-primary)]">AttendEase</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] font-medium rounded-[var(--radius-md)] transition shadow-sm hover:shadow-lg hover:shadow-[var(--accent-glow)]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center animate-fade-in opacity-0">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] rounded-full mb-8 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Location-verified attendance in seconds
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
            Attendance Made
            <span className="text-[var(--accent-primary)]"> Simple</span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
            The anti-cheat attendance system for course representatives.
            Verify student presence with location-based signing and real-time tracking.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="px-8 py-4 bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-[var(--bg-primary)] font-semibold rounded-[var(--radius-md)] transition text-lg shadow-sm hover:shadow-xl hover:shadow-[var(--accent-glow)]"
            >
              Start Free →
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] font-semibold rounded-[var(--radius-md)] transition text-lg border border-[var(--border-default)]"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up opacity-0 delay-200">
          <div className="card-industrial p-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Location Verified</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Students must be physically present within the class radius to sign attendance. No proxies allowed.
            </p>
          </div>

          <div className="card-industrial p-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Real-Time Tracking</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Watch attendance come in live. Share a QR code or link, and see students sign as they arrive.
            </p>
          </div>

          <div className="card-industrial p-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--accent-primary)]/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Export Reports</h3>
            <p className="text-[var(--text-secondary)] text-sm">
              Download attendance records as CSV files. Perfect for submission to lecturers or department records.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24 text-center animate-fade-in-up opacity-0 delay-300">
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="w-10 h-10 mx-auto rounded-full bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold flex items-center justify-center mb-4">1</div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-1">Create Session</h4>
              <p className="text-[var(--text-muted)] text-sm">Select course and venue</p>
            </div>
            <div>
              <div className="w-10 h-10 mx-auto rounded-full bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold flex items-center justify-center mb-4">2</div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-1">Share Link</h4>
              <p className="text-[var(--text-muted)] text-sm">QR code or copy link</p>
            </div>
            <div>
              <div className="w-10 h-10 mx-auto rounded-full bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold flex items-center justify-center mb-4">3</div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-1">Students Sign</h4>
              <p className="text-[var(--text-muted)] text-sm">Location verified</p>
            </div>
            <div>
              <div className="w-10 h-10 mx-auto rounded-full bg-[var(--accent-primary)] text-[var(--bg-primary)] font-bold flex items-center justify-center mb-4">4</div>
              <h4 className="font-semibold text-[var(--text-primary)] mb-1">Export Data</h4>
              <p className="text-[var(--text-muted)] text-sm">Download CSV reports</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border-subtle)] mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            © {new Date().getFullYear()} AttendEase. Built for course reps.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/login" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              Sign In
            </Link>
            <Link href="/register" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
