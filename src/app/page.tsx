import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-medium tracking-tight">
            AttendEase
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link href="/login" className="text-zinc-500 hover:text-zinc-900 transition-colors">
              Sign in
            </Link>
            <Link
              href="/register"
              className="bg-zinc-900 text-white px-4 py-2 rounded-full hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="pt-40 pb-20 md:pt-48 md:pb-32 px-6 relative">
           {/* Subtle background element */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-zinc-100 to-transparent rounded-full blur-3xl -z-10 opacity-60"></div>

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-zinc-200 text-xs font-semibold text-zinc-600 mb-8 animate-fade-in-up shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-900"></span>
              </span>
              v2.0 is now live
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.95] mb-8 text-zinc-900">
              Attendance tracking <br className="hidden md:block" />
              <span className="text-zinc-400">reimagined.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
              The anti-cheat system for modern education. Verify student presence with precise location gating and real-time insights.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-10 py-4 bg-zinc-900 text-white font-medium rounded-full text-lg hover:bg-black transition-all shadow-xl shadow-zinc-200/50 hover:scale-105 active:scale-95"
              >
                Start for free
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-10 py-4 bg-white text-zinc-900 border border-zinc-200 font-medium rounded-full text-lg hover:bg-zinc-50 transition-all hover:border-zinc-300"
              >
                How it works
              </Link>
            </div>
          </div>
        </section>

        {/* Minimal Stats/Social Proof */}
        <section className="py-12 border-y border-zinc-100 bg-zinc-50/50">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-semibold tracking-tight text-zinc-900">10k+</p>
              <p className="text-sm text-zinc-500 uppercase tracking-wide mt-1">Students</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-tight text-zinc-900">500+</p>
              <p className="text-sm text-zinc-500 uppercase tracking-wide mt-1">Courses</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-tight text-zinc-900">99.9%</p>
              <p className="text-sm text-zinc-500 uppercase tracking-wide mt-1">Uptime</p>
            </div>
            <div>
              <p className="text-3xl font-semibold tracking-tight text-zinc-900">0%</p>
              <p className="text-sm text-zinc-500 uppercase tracking-wide mt-1">Proxies</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20">
              <h2 className="text-3xl md:text-5xl font-medium tracking-tight mb-6">
                Everything you need, <br />
                <span className="text-zinc-400">nothing you don't.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group p-8 rounded-3xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors">
                <div className="w-12 h-12 bg-white rounded-2xl border border-zinc-200 flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-6 h-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">Geo-Fencing</h3>
                <p className="text-zinc-500 leading-relaxed">
                  Set a physical radius for your class. Students must be inside the zone to mark themselves present.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-3xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors">
                <div className="w-12 h-12 bg-white rounded-2xl border border-zinc-200 flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-6 h-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">Unique Link Sign</h3>
                <p className="text-zinc-500 leading-relaxed">
                  Generate a secure, time-bound link for every session. Students click to sign instantly—no scanning required.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-3xl bg-zinc-50 border border-zinc-100 hover:border-zinc-200 transition-colors">
                <div className="w-12 h-12 bg-white rounded-2xl border border-zinc-200 flex items-center justify-center mb-6 shadow-sm">
                  <svg className="w-6 h-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3 tracking-tight">One-Click Export</h3>
                <p className="text-zinc-500 leading-relaxed">
                  Seamlessly export attendance data to CSV or PDF formats compatible with your university's portal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto bg-zinc-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <svg width="100%" height="100%">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-medium text-white mb-8 tracking-tight relative z-10">
              Ready to modernize <br /> your classroom?
            </h2>
            <Link
              href="/register"
              className="inline-block bg-white text-zinc-900 px-10 py-4 rounded-full font-medium text-lg hover:bg-zinc-100 transition-transform hover:scale-105 active:scale-95 relative z-10"
            >
              Get Started Now
            </Link>
          </div>
        </section>
      </main>

      {/* Bold & Unique Footer */}
      <footer className="bg-zinc-900 pt-24 pb-12 px-6 border-t border-zinc-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            <div className="md:col-span-5">
              <Link href="/" className="text-2xl font-medium tracking-tight block mb-6 text-white">
                AttendEase
              </Link>
              <p className="text-zinc-400 max-w-sm leading-relaxed">
                Building the future of academic integrity and classroom management. Simple, fast, and secure.
              </p>
            </div>
            
            <div className="md:col-span-2 md:col-start-7">
              <h4 className="font-semibold mb-6 text-white">Product</h4>
              <ul className="space-y-4 text-zinc-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-semibold mb-6 text-white">Legal</h4>
              <ul className="space-y-4 text-zinc-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-semibold mb-6 text-white">Socials</h4>
              <ul className="space-y-4 text-zinc-400 text-sm">
                <li><Link href="#" className="hover:text-white transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">GitHub</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Discord</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-10 flex flex-col md:flex-row justify-between items-end gap-6">
            <p className="text-zinc-500 text-sm">
              © {new Date().getFullYear()} AttendEase Inc.
            </p>
          </div>
        </div>
        
        {/* Massive Footer Text */}
        <div className="absolute bottom-0 left-0 w-full text-center overflow-hidden pointer-events-none leading-none">
            <span className="block text-[15vw] font-bold tracking-tighter text-zinc-800/50 select-none translate-y-[10%]">
                ATTENDEASE
            </span>
        </div>
      </footer>
    </div>
  );
}
