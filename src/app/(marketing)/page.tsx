"use client";

import Link from "next/link";
import { Zap, CheckCircle2, Layout, ShieldCheck, ArrowRight, Sparkles, Code2, Rocket } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="bg-white dark:bg-black text-black dark:text-white min-h-screen font-sans antialiased">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black dark:bg-white rounded-md flex items-center justify-center">
            <Zap className="w-5 h-5 text-white dark:text-black fill-current" />
          </div>
          <span className="text-xl font-black tracking-tighter">ENTEAM</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          <a href="#features" className="hover:text-black dark:hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-black dark:hover:text-white transition-colors">Pricing</a>
          <a href="#about" className="hover:text-black dark:hover:text-white transition-colors">Documentation</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-bold text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all">
            Log In
          </Link>
          <Link href="/sign-up" className="group relative bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-md text-sm font-bold hover:opacity-90 transition-all active:scale-95 flex items-center gap-2">
            Start Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-44 pb-32 px-6 flex flex-col items-center text-center">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10" />
        
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 dark:border-white/10 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Project Management
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1]">
            Build faster with <br />
            <span className="italic opacity-50">Smart Context.</span>
          </h1>
          
          <p className="text-zinc-600 dark:text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Organize your software projects, IOT labs, and team tasks in one high-performance workspace. Powered by seamless automation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/sign-up" className="w-full sm:w-auto bg-black dark:bg-white text-white dark:text-black px-10 py-4 rounded-md text-lg font-bold transition-all active:scale-95 flex items-center justify-center gap-3">
              Deploy Your Team <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto bg-transparent border-2 border-black/10 dark:border-white/10 text-black dark:text-white px-10 py-4 rounded-md text-lg font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 px-6 border-y border-black/10 dark:border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Layout className="w-6 h-6" />}
            title="Kanban on Steroids"
            desc="Enterprise-grade boards designed for deep focus. Drag, drop, and deploy tasks in milliseconds."
          />
          <FeatureCard 
            icon={<Code2 className="w-6 h-6" />}
            title="AI-Native Workflow"
            desc="Use natural language to create cards, boards, and manage your entire backlog using Gemini Pro."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Secure & Scalable"
            desc="Built for information technology teams who demand high security and data integrity."
          />
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-32 px-6 bg-zinc-50 dark:bg-zinc-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Ready to Scale?</h2>
            <p className="text-zinc-500 font-medium">Start for free and upgrade as your team grows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-10 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-2xl hover:border-black/30 dark:hover:border-white/30 transition-all">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-500">Standard</span>
              <h3 className="text-2xl font-bold mt-2 mb-6">Free Plan</h3>
              <div className="text-5xl font-black mb-8">$0</div>
              <ul className="space-y-4 mb-10">
                {["Up to 5 Workspaces", "AI Assistant (v1)", "3 Members per Board", "Community Support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 opacity-70" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up" className="block w-full py-4 text-center border-2 border-black/10 dark:border-white/10 rounded-md font-bold hover:bg-black/5 dark:hover:bg-white/5 transition-all">
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-10 bg-black dark:bg-white text-white dark:text-black rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                 <Rocket className="w-12 h-12 opacity-20 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest opacity-70">Pro Power</span>
              <h3 className="text-2xl font-bold mt-2 mb-6">Enterprise</h3>
              <div className="text-5xl font-black mb-8">$12 <span className="text-lg font-medium opacity-70">/mo</span></div>
              <ul className="space-y-4 mb-10">
                {["Unlimited Workspaces", "Advanced AI (1.5 Flash)", "Unlimited Members", "Priority Lab Support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm opacity-90 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 bg-white dark:bg-black text-black dark:text-white rounded-md font-bold shadow-xl active:scale-95 transition-all">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 px-6 border-t border-black/10 dark:border-white/10 text-center bg-white dark:bg-black">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Zap className="w-4 h-4 opacity-50" />
          <span className="text-sm font-black italic tracking-tight">ENTEAM</span>
        </div>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-[0.2em]">
          Designed for Impact • Built with Next.js
        </p>
      </footer>
    </div>
  );
}

// Sub-component for clean code
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 bg-zinc-50 dark:bg-zinc-900 border border-black/5 dark:border-white/5 rounded-2xl hover:border-black/20 dark:hover:border-white/20 transition-all duration-300">
      <div className="w-12 h-12 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl flex items-center justify-center mb-6 shadow-sm">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}