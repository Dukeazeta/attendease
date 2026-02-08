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

      {/* Marquee / Social Proof - Brutalist */}
      <div className="border-y-2 border-foreground py-12 bg-background relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
           <div className="text-[20vw] font-black leading-none tracking-tighter mix-blend-difference">TRUST</div>
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <p className="text-xs font-mono font-bold text-foreground uppercase tracking-widest mb-8 text-center border-b border-foreground/20 pb-4 w-fit mx-auto">Trusted by Departments at</p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-80">
            {['ENGINEERING', 'SCIENCES', 'ARTS', 'LAW', 'MEDICINE'].map((dept) => (
              <span key={dept} className="text-2xl md:text-4xl font-black tracking-tighter uppercase relative group cursor-default">
                  {dept}
                  <span className="absolute -bottom-1 left-0 w-0 h-1 bg-foreground transition-all duration-300 group-hover:w-full"></span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid - Brutalist */}
      <section id="features" className="py-32 px-6 container mx-auto relative">
         <div className="absolute left-0 top-0 text-9xl font-black text-foreground/5 -z-10 pointer-events-none rotate-90 origin-top-left translate-x-24 translate-y-24">FEATURES</div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-foreground bg-foreground">
          {[
            {
              icon: MapPin,
              title: "GPS-LOCKED",
              desc: "Precise coordinates required. No spoofing allowed."
            },
            {
              icon: QrCode,
              title: "DYNAMIC QR",
              desc: "Rotates every 5 seconds. Screenshot proof."
            },
            {
              icon: Smartphone,
              title: "DEVICE ID",
              desc: "One student, one phone. Hardware-level binding."
            }
          ].map((feature, i) => (
            <div
              key={i}
              className="group p-12 bg-background border-b-2 md:border-b-0 md:border-r-2 border-foreground last:border-0 hover:bg-foreground hover:text-background transition-colors duration-200 flex flex-col justify-between h-full"
            >
              <div>
                  <div className="mb-6 inline-flex p-4 border-2 border-foreground bg-background text-foreground group-hover:bg-background group-hover:text-foreground brutal-shadow-sm transition-all duration-200">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-black mb-4 tracking-tighter uppercase">{feature.title}</h3>
                  <p className="text-lg font-mono text-muted-foreground group-hover:text-background/80 leading-relaxed border-t-2 border-current pt-4">{feature.desc}</p>
              </div>
              <div className="mt-8 text-right opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-bold text-lg">
                  // 0{i+1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Brutalist */}
      <section className="py-32 bg-foreground text-background relative overflow-hidden border-y-2 border-background">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.05)_75%,rgba(255,255,255,0.05)_100%)] bg-[size:20px_20px] opacity-20"></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 uppercase leading-none">
            SECURE YOUR <br/> CLASS NOW.
          </h2>
          <p className="text-xl md:text-2xl font-mono text-background/80 max-w-2xl mx-auto mb-12 border-2 border-background p-6">
            Join the department revolutionizing academic integrity.
            <br/>
            NO HARDWARE. NO DELAYS. NO EXCUSES.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register">
              <Button size="lg" className="h-20 px-12 text-2xl font-bold rounded-none bg-background text-foreground hover:bg-background hover:scale-105 border-2 border-transparent transition-transform duration-200 brutal-shadow-lg uppercase">
                Initialize System <Zap className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer - Brutalist */}
      <footer className="py-12 bg-background border-t-4 border-foreground relative">
        <div className="absolute top-0 left-10 w-4 h-4 bg-foreground -translate-y-1/2 rotate-45"></div>
        
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="flex flex-col gap-2">
             <div className="flex items-center gap-2 mb-2">
                 <div className="w-8 h-8 bg-foreground"></div>
                 <span className="text-2xl font-black tracking-tighter uppercase">ATTENDEASE.</span>
             </div>
             <p className="text-sm font-mono font-bold max-w-xs uppercase">
                 The standard for verifyable academic presence.
             </p>
          </div>
          
          <div className="flex flex-col items-end gap-4">
              <div className="flex gap-8 text-lg font-bold uppercase tracking-tight">
                <a href="#" className="hover:underline decoration-2 underline-offset-4">Privacy</a>
                <a href="#" className="hover:underline decoration-2 underline-offset-4">Terms</a>
                <a href="#" className="hover:underline decoration-2 underline-offset-4">Contact</a>
              </div>
              <p className="text-xs font-mono text-muted-foreground uppercase">© 2026 Code of Conduct.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
