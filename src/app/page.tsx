"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, MapPin, QrCode, Smartphone, CheckCircle, Zap, Activity, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-white overflow-x-hidden bg-grain">
      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 kinetic-mesh" />
      <div className="fixed top-[-10%] left-[-10%] glow-orb" />
      <div className="fixed bottom-[-10%] right-[-10%] glow-orb" style={{ "--accent": "#8b5cf6", animationDelay: "-2s" } as any} />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 glass border-b-0 m-4 rounded-2xl max-w-7xl mx-auto backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center shadow-lg shadow-accent/20">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">AttendEase</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
          <Link href="#features" className="hover:text-white transition-colors uppercase tracking-widest">Technology</Link>
          <Link href="#security" className="hover:text-white transition-colors uppercase tracking-widest">Security</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-white/60 hover:text-white">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button variant="primary" className="rounded-full px-6">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      <main>
        {/* Kinetic Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
          <motion.div
            style={{ opacity, scale }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-7xl mx-auto text-center space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] uppercase tracking-[0.3em] font-bold text-accent mb-4 border-accent/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              System Status: Active
            </div>

            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-[0.9] text-white">
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="block"
                >
                  PRESENCE
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="block text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20"
                >
                  VERIFIED
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto font-light leading-relaxed tracking-wide"
            >
              Anti-cheat attendance infrastructure for the modern classroom.
              Powered by hardware-binding and multi-layer verification.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4"
            >
              <Link href="/register">
                <Button size="lg" className="rounded-full min-w-[200px] h-14 text-base font-bold group">
                  Deploy Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="glass" size="lg" className="rounded-full min-w-[200px] h-14 text-base border-white/5">
                  See Technology
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating UI Elements for Depth */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 right-[10%] w-64 h-64 glass rounded-3xl opacity-20 rotate-12"
            />
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-1/4 left-[5%] w-48 h-48 glass rounded-full opacity-10"
            />
          </div>
        </section>

        {/* Features - High Tech Minimalist */}
        <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Geotagged",
                desc: "High-precision GPS locking ensures students are physically present in the hall.",
                color: "text-blue-500"
              },
              {
                icon: QrCode,
                title: "Dynamic QR",
                desc: "Ephemeral QR codes prevent sharing. Real-time regeneration every 5 seconds.",
                color: "text-purple-500"
              },
              {
                icon: Smartphone,
                title: "Biometric",
                desc: "Hardware-level device binding prevents proxy signing and multi-account abuse.",
                color: "text-emerald-500"
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group glass p-10 rounded-[2rem] hover:bg-white/5 transition-all duration-500 border-white/5 hover:border-white/10"
              >
                <div className={`mb-8 w-14 h-14 rounded-2xl glass flex items-center justify-center shadow-lg shadow-black/50`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white tracking-tight">{feature.title}</h3>
                <p className="text-white/40 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tech Stack - Logos / Identity */}
        <section className="py-20 border-y border-white/5 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/30 text-center mb-12">Engineered with Precision</p>
            <div className="flex flex-wrap justify-center gap-x-20 gap-y-10 items-center opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              {['CONVEX.DB', 'NEXT.JS', 'TAILWIND', 'LUCIDE', 'FRAMER.MOTION'].map((tech) => (
                <span key={tech} className="text-sm font-bold tracking-[0.2em]">{tech}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Security / Proof Section */}
        <section id="security" className="py-32 px-6">
          <div className="max-w-7xl mx-auto glass p-12 md:p-24 rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent/10 to-transparent pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="space-y-8">
                <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-none">
                  Security is not an <span className="text-accent underline decoration-accent/30 underline-offset-8">option</span>.
                </h2>
                <p className="text-xl text-white/40 font-light leading-relaxed">
                  Our multi-factor verification pipeline ensures that every record is legitimate.
                  From device fingerprinting to network analysis, we've built a fortress around your attendance data.
                </p>
                <div className="flex flex-col gap-4">
                  {[
                    { icon: Lock, label: "End-to-end encrypted tunnels" },
                    { icon: Shield, label: "AES-256 data rest encryption" },
                    { icon: Globe, label: "Distributed edge verification" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-white/60">
                      <div className="w-8 h-8 glass rounded-full flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-accent" />
                      </div>
                      <span className="text-sm tracking-wide">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square glass rounded-[2.5rem] flex items-center justify-center p-12 relative group">
                  <div className="absolute inset-0 bg-accent/5 rounded-[2.5rem] animate-pulse-slow" />
                  <Shield className="w-32 h-32 text-accent opacity-50 group-hover:scale-110 transition-transform duration-700" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final Call to Action */}
        <section className="py-40 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-white">
              Ready to Upgrade?
            </h2>
            <p className="text-xl text-white/40 font-light">
              Onboard your department in minutes. No complex hardware required.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-20 px-16 text-xl rounded-full bg-white text-black hover:bg-white/90 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                Launch System
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center">
              <Activity className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight opacity-60">AttendEase</span>
          </div>

          <div className="flex gap-12 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            <a href="#" className="hover:text-accent transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent transition-colors">Infrastructure</a>
            <a href="#" className="hover:text-accent transition-colors">Contact</a>
          </div>

          <p className="text-[10px] font-medium text-white/20 uppercase tracking-widest">© 2026 Antigravity Systems</p>
        </div>
      </footer>
    </div>
  );
}
