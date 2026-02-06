import Link from "next/link";

const stats = [
  { value: "10k+", label: "students" },
  { value: "500+", label: "courses" },
  { value: "99.9%", label: "uptime" },
  { value: "< 3s", label: "avg sign-in" },
];

const features = [
  {
    title: "Geo-aware check-ins",
    description:
      "Approve attendance only when students are physically inside your configured location radius.",
  },
  {
    title: "Device fingerprint guard",
    description:
      "Reduce proxy sign-ins by limiting one attendance record per device fingerprint per session.",
  },
  {
    title: "Session ownership controls",
    description:
      "Only course reps who created a session can manage its records, links, and attendance edits.",
  },
];

const steps = [
  {
    step: "01",
    title: "Create your class structure",
    description: "Set up courses and locations once, then reuse them across every attendance session.",
  },
  {
    step: "02",
    title: "Launch a session in seconds",
    description:
      "Generate a secure share code and link that students can open instantly on any modern device.",
  },
  {
    step: "03",
    title: "Review and export records",
    description: "Monitor live attendance and export clean reports for downstream academic workflows.",
  },
];

const faqs = [
  {
    question: "Do students need to install an app?",
    answer:
      "No. Students open a secure link and submit attendance from their browser—no downloads required.",
  },
  {
    question: "Can I enforce location checks?",
    answer:
      "Yes. Sessions can enforce location radius checks to ensure sign-ins happen in approved spaces.",
  },
  {
    question: "Can we still do manual corrections?",
    answer:
      "Absolutely. Course reps can add or adjust attendance entries when exceptional cases occur.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white">
      <nav className="sticky top-0 z-50 border-b border-zinc-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            AttendEase
          </Link>
          <div className="flex items-center gap-5 text-sm font-medium">
            <Link href="/login" className="text-zinc-500 transition-colors hover:text-zinc-900">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-zinc-900 px-4 py-2 text-white transition-colors hover:bg-zinc-700"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="px-6 pb-20 pt-24 md:pb-24 md:pt-32">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-600">
                Built for modern classrooms
              </p>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
                Minimal attendance tooling,
                <span className="block text-zinc-400">maximum trust in every record.</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
                AttendEase helps course reps run fast sign-ins with location validation, anti-proxy checks, and
                clean exports.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-full bg-zinc-900 px-7 py-3 text-center font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-black"
                >
                  Start for free
                </Link>
                <Link
                  href="#how-it-works"
                  className="rounded-full border border-zinc-200 px-7 py-3 text-center font-medium text-zinc-700 transition-colors hover:bg-zinc-50"
                >
                  Explore workflow
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-8">
              <p className="text-sm font-medium text-zinc-500">Session snapshot</p>
              <div className="mt-6 space-y-4">
                {[
                  ["Course", "CSC 401 - Software Engineering"],
                  ["Location", "Main Hall B"],
                  ["Share Code", "A7K9P2"],
                  ["Status", "Active · 52 signed in"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-4">
                    <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
                    <p className="mt-1 text-sm font-medium text-zinc-900">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-zinc-100 bg-zinc-50/70 px-6 py-10">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 text-center md:grid-cols-4">
            {stats.map((item) => (
              <div key={item.label}>
                <p className="text-3xl font-semibold tracking-tight">{item.value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-zinc-500">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="px-6 py-20 md:py-24">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Core protections, elegantly delivered.</h2>
              <p className="mt-3 max-w-2xl text-zinc-600">
                Keep the interface simple while preserving the safeguards that matter for attendance integrity.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-3xl border border-zinc-200 p-6">
                  <h3 className="text-lg font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-600">{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-zinc-900 px-6 py-20 text-zinc-100 md:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">How it works</h2>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map((item) => (
                <article key={item.step} className="rounded-3xl border border-zinc-700 bg-zinc-800/60 p-6">
                  <p className="text-xs font-semibold tracking-[0.16em] text-zinc-400">STEP {item.step}</p>
                  <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-300">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-20 md:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Frequently asked questions</h2>
              <p className="mt-3 text-zinc-600">Quick answers to help teams adopt AttendEase faster.</p>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <article key={faq.question} className="rounded-3xl border border-zinc-200 p-6">
                  <h3 className="text-base font-semibold tracking-tight">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto max-w-5xl rounded-[2rem] bg-zinc-900 px-8 py-14 text-center text-white md:px-14">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Ready to modernize attendance?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-300">
              Launch a new session in minutes and keep your records clean, verifiable, and export-ready.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-block rounded-full bg-white px-7 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Create your account
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
