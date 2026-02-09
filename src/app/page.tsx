import Link from "next/link";

const features = [
  {
    title: "One-click session launches",
    description: "Start attendance sessions in seconds with a shareable code for students.",
  },
  {
    title: "Location-aware check-ins",
    description: "Reduce proxy attendance with location validation and time-bound sessions.",
  },
  {
    title: "Real-time dashboard",
    description: "Track signatures, active sessions, and participation from a clean control panel.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            AttendEase
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="space-y-6">
            <p className="inline-flex rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
              Built for course reps
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Attendance management that feels simple and stays reliable.
            </h1>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              AttendEase helps you create sessions, verify student presence, and monitor participation in real time—without clutter.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-3 text-sm font-medium text-background hover:opacity-90"
              >
                Start free
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
              >
                View dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-6 sm:p-8">
            <dl className="space-y-6">
              <div>
                <dt className="text-sm font-medium">Active sessions</dt>
                <dd className="mt-1 text-3xl font-semibold">Live overview</dd>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs text-muted-foreground">Sign-ins</p>
                  <p className="mt-1 text-xl font-semibold">Real-time</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs text-muted-foreground">Locations</p>
                  <p className="mt-1 text-xl font-semibold">Validated</p>
                </div>
              </div>
            </dl>
          </div>
        </section>

        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Everything you need, nothing you don’t.</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-lg border border-border bg-background p-5">
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <p className="text-base font-semibold">AttendEase</p>
            <p className="mt-2 text-sm text-muted-foreground">Minimal attendance management for modern course reps.</p>
          </div>

          <div>
            <p className="text-sm font-medium">Product</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link href="/register" className="hover:text-foreground">Get started</Link></li>
              <li><Link href="/login" className="hover:text-foreground">Sign in</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium">Company</p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Privacy</a></li>
              <li><a href="#" className="hover:text-foreground">Terms</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
            <p>© {new Date().getFullYear()} AttendEase</p>
            <p>All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
