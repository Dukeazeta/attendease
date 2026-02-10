"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, MapPin, QrCode, Smartphone, Zap, Activity, Globe, Lock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.15], [0, -40]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6 md:px-9 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-primary flex items-center justify-center">
              <Activity className="w-[18px] h-[18px] text-primary-foreground" />
            </div>
            <span className="text-[17px] font-[450] tracking-[-0.3px] text-foreground">AttendEase</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[14.5px] font-[450] text-muted-foreground">
            <Link href="#features" className="hover:text-foreground transition-colors">Features</Link>
            <Link href="#security" className="hover:text-foreground transition-colors">Security</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-16">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#F0F4FF] via-background to-background pointer-events-none" />

          <motion.div
            style={{ opacity, y }}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 max-w-[900px] mx-auto text-center space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-full)] bg-surface-container text-[12.5px] font-[450] text-muted-foreground tracking-[0.1px]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              Now available for departments
            </motion.div>

            <h1 className="text-display text-foreground">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="block"
              >
                Attendance,
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="block text-muted-foreground"
              >
                verified.
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-body text-muted-foreground max-w-xl mx-auto"
            >
              Anti-cheat attendance infrastructure for the modern classroom.
              Powered by hardware-binding, geofencing, and multi-layer verification.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link href="/register">
                <Button size="lg" className="min-w-[180px] gap-2">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outlined" size="lg" className="min-w-[180px]">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features — Clean Cards */}
        <section id="features" className="py-24 md:py-32 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <p className="text-small text-accent font-[450] tracking-[0.5px] uppercase mb-4">Core Technology</p>
              <h2 className="text-headline-2 text-foreground">Built for trust</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: MapPin,
                  title: "Geotagged",
                  desc: "High-precision GPS locking ensures students are physically present in the hall.",
                  accent: "bg-blue-50 text-blue-600",
                },
                {
                  icon: QrCode,
                  title: "Shareable Links",
                  desc: "Generate unique attendance links tied to each session. QR codes and direct links for instant student access.",
                  accent: "bg-violet-50 text-violet-600",
                },
                {
                  icon: Smartphone,
                  title: "Device Binding",
                  desc: "Hardware-level device fingerprinting prevents proxy signing and multi-account abuse.",
                  accent: "bg-emerald-50 text-emerald-600",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  className="surface-card p-8 md:p-10 transition-all duration-300 group"
                >
                  <div className={`mb-6 w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center ${feature.accent}`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-[22px] font-[450] mb-3 text-foreground tracking-[-0.08px]">{feature.title}</h3>
                  <p className="text-caption text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="py-16 border-y border-border">
          <div className="max-w-[1200px] mx-auto px-6">
            <p className="text-small text-muted-foreground/50 text-center mb-10 uppercase tracking-[0.3em]">Engineered With</p>
            <div className="flex flex-wrap justify-center gap-x-16 gap-y-8 items-center">
              {['CONVEX', 'NEXT.JS', 'TAILWIND', 'LUCIDE', 'FRAMER'].map((tech) => (
                <span key={tech} className="text-[13px] font-[450] tracking-[0.15em] text-muted-foreground/40 hover:text-muted-foreground transition-colors">{tech}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section id="security" className="py-24 md:py-32 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="surface-card p-10 md:p-16 lg:p-20 overflow-hidden relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-8">
                  <div>
                    <p className="text-small text-accent font-[450] tracking-[0.5px] uppercase mb-4">Security</p>
                    <h2 className="text-headline-2 text-foreground mb-6">
                      Security is not an <span className="text-accent">option</span>.
                    </h2>
                    <p className="text-body text-muted-foreground">
                      Our multi-factor verification pipeline ensures that every record is legitimate.
                      From device fingerprinting to network analysis, we&apos;ve built a fortress around your attendance data.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    {[
                      { icon: Lock, label: "End-to-end encrypted tunnels" },
                      { icon: Shield, label: "AES-256 data rest encryption" },
                      { icon: Globe, label: "Distributed edge verification" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 text-foreground">
                        <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-surface-container flex items-center justify-center">
                          <item.icon className="w-[18px] h-[18px] text-accent" />
                        </div>
                        <span className="text-caption">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="relative flex items-center justify-center">
                  <div className="w-full aspect-square bg-surface-container rounded-[var(--radius-xl)] flex items-center justify-center">
                    <Shield className="w-24 h-24 text-accent/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 md:py-40 px-6 text-center">
          <div className="max-w-[600px] mx-auto space-y-8">
            <h2 className="text-headline-1 text-foreground">
              Ready to upgrade?
            </h2>
            <p className="text-body text-muted-foreground">
              Onboard your department in minutes. No complex hardware required.
            </p>
            <Link href="/register">
              <Button size="lg" className="h-16 px-12 text-[17px] mt-4">
                Launch System
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-border">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[var(--radius-xs)] bg-surface-container flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <span className="text-[14.5px] font-[450] text-muted-foreground">AttendEase</span>
          </div>

          <div className="flex gap-8 text-[12.5px] font-[450] text-muted-foreground/60">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Infrastructure</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>

          <p className="text-[12.5px] font-[450] text-muted-foreground/40">© 2026 AttendEase</p>
        </div>
      </footer>
    </div>
  );
}
