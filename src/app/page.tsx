"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Shield, MapPin, QrCode, Smartphone, CheckCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans overflow-hidden selection:bg-foreground selection:text-background">
      {/* Navbar */}
      {/* Navbar - Brutalist */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 bg-background border-b-2 border-foreground">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-foreground"></div>
          <span className="text-xl font-bold tracking-tighter uppercase">Attendease.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden md:inline-flex hover:bg-foreground hover:text-background rounded-none border border-transparent hover:border-foreground transition-all duration-0">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button className="rounded-none border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground brutal-shadow transition-all duration-0 active:translate-x-1 active:translate-y-1 active:shadow-none">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section - Swiss Brutalist */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-20 overflow-hidden border-b-2 border-foreground">
        {/* Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center z-10 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="flex flex-col items-center"
          >
            <div className="border-2 border-foreground px-4 py-1 mb-8 uppercase font-mono text-sm tracking-widest bg-background brutal-shadow-sm">
              v2.0 System Online
            </div>

            <h1 className="text-7xl md:text-9xl lg:text-[10rem] font-black tracking-tighter leading-[0.85] text-foreground uppercase mix-blend-difference">
              ATTENDANCE
              <br />
              <span className="outline-text text-transparent bg-clip-text stroke-foreground" style={{ WebkitTextStroke: "2px var(--foreground)" }}>
                REDEFINED
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl font-mono text-foreground max-w-3xl mx-auto border-l-4 border-foreground pl-6 text-left"
          >
            The ultimate anti-cheat solution.
            <br />
            <span className="font-bold bg-foreground text-background px-1">GPS-LOCKED.</span> <span className="font-bold bg-foreground text-background px-1">QR-ENABLED.</span> <span className="font-bold bg-foreground text-background px-1">STRICTLY VERIFIED.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Link href="/register">
              <Button size="lg" className="h-16 px-10 text-xl font-bold rounded-none border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground brutal-shadow-lg transition-all duration-0 active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-tight">
                Start Now
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="h-16 px-10 text-xl font-bold rounded-none border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background brutal-shadow-lg transition-all duration-0 active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-tight">
                Explore Features
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Decorative Elements - Hard Geometric */}
        <div className="absolute left-0 bottom-0 w-32 h-32 border-t-2 border-r-2 border-foreground hidden lg:block"></div>
        <div className="absolute right-0 top-32 w-24 h-24 border-b-2 border-l-2 border-foreground hidden lg:block"></div>

        <div className="absolute top-1/2 left-10 -translate-y-1/2 hidden xl:block">
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-4 h-4 bg-foreground"></div>
            ))}
          </div>
        </div>

      </section>

      {/* Marquee / Social Proof - Minimal */}
      <div className="border-y border-border py-8 bg-secondary/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-6">Trusted by Departments at</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-opacity duration-500">
            {/* Placeholders for logos, using text for now */}
            {['ENGINEERING', 'SCIENCES', 'ARTS', 'LAW', 'MEDICINE'].map((dept) => (
              <span key={dept} className="text-xl font-bold tracking-tighter">{dept}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: MapPin,
              title: "Geo-Fencing",
              desc: "Precise GPS verification ensures students are physically present in the lecture hall."
            },
            {
              icon: QrCode,
              title: "Dynamic QR",
              desc: "Rotating QR codes prevent sharing. Expire in seconds, making remote scanning impossible."
            },
            {
              icon: Smartphone,
              title: "Device Lock",
              desc: "One account, one device. Prevents proxy attendance through trusted device fingerprinting."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group p-8 rounded-3xl border border-border bg-card hover:bg-secondary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="mb-6 inline-flex p-3 rounded-2xl bg-foreground/5 text-foreground group-hover:bg-foreground group-hover:text-background transition-colors duration-300">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-foreground text-background relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-soft-light"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold tracking-tighter mb-8"
          >
            Ready to secure your class?
          </motion.h2>
          <p className="text-xl text-background/80 max-w-2xl mx-auto mb-12">
            Join the department revolutionizing academic integrity.
            Fast setup. Zero hardware required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-background text-foreground hover:bg-background/90">
                Get Started Now <Zap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border bg-background">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-foreground rounded-full"></div>
            <span className="text-lg font-bold tracking-tight">ATTENDEASE.</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Code of Conduct.</p>
        </div>
      </footer>
    </div>
  );
}
