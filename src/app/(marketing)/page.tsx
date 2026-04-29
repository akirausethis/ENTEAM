"use client";

import Link from "next/link";
import { Zap, CheckCircle2, Layout, ShieldCheck, ArrowRight, Sparkles, Code2, Rocket } from "lucide-react";

export default function MarketingPage() {
  return (
    <div className="bg-zinc-950 text-zinc-200 min-h-screen selection:bg-indigo-500/30 font-sans">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-xl font-black text-white tracking-tighter italic">ENTEAM</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-bold text-zinc-500">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#about" className="hover:text-white transition-colors">Documentation</a>
        </div>

<div className="flex items-center gap-4">
  {/* Tombol Login (Link biasa) */}
  <Link href="/sign-in" className="text-sm font-bold text-zinc-400 hover:text-white transition-all">
    Sign In
  </Link>
  
  {/* Tombol "Try EnTeam" yang mencolok */}
  <Link href="/sign-up" className="group relative bg-white text-black px-6 py-2.5 rounded-xl text-sm font-black hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl flex items-center gap-2">
    Try EnTeam
    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </Link>
</div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-44 pb-32 px-6 overflow-hidden">
        {/* Abstract Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-indigo-600/10 blur-[140px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-indigo-400 text-[10px] font-black tracking-[0.2em] uppercase">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Project Management
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[0.85]">
            Build faster with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 italic">Smart Context.</span>
          </h1>
          
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
            Organize your software projects, IOT labs, and team tasks in one high-performance workspace. Powered by Gemini AI for seamless automation.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/dashboard" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-2xl text-lg font-black transition-all shadow-2xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3">
              Deploy Your Team <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="w-full sm:w-auto bg-zinc-900 border border-zinc-800 text-zinc-300 px-10 py-5 rounded-2xl text-lg font-black hover:bg-zinc-800 hover:text-white transition-all">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Layout className="w-6 h-6 text-indigo-500" />}
            title="Kanban on Steroids"
            desc="Enterprise-grade boards designed for deep focus. Drag, drop, and deploy tasks in milliseconds."
          />
          <FeatureCard 
            icon={<Code2 className="w-6 h-6 text-indigo-500" />}
            title="AI-Native Workflow"
            desc="Use natural language to create cards, boards, and manage your entire backlog using Gemini Pro."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-indigo-500" />}
            title="Secure & Scalable"
            desc="Built for information technology teams who demand high security and data integrity."
          />
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-32 px-6 bg-zinc-900/20 border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Ready to Scale?</h2>
            <p className="text-zinc-500 font-medium">Start for free and upgrade as your team grows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <div className="p-10 bg-zinc-950 border border-zinc-800 rounded-[32px] hover:border-zinc-700 transition-all">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-600">Standard</span>
              <h3 className="text-2xl font-bold text-white mt-2 mb-6">Free Plan</h3>
              <div className="text-5xl font-black text-white mb-8">$0</div>
              <ul className="space-y-4 mb-10">
                {["Up to 5 Workspaces", "AI Assistant (v1)", "3 Members per Board", "Community Support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-zinc-400 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="block w-full py-4 text-center bg-zinc-900 rounded-2xl font-black text-white hover:bg-zinc-800 transition-all">
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-10 bg-indigo-600 rounded-[32px] shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4">
                 <Rocket className="w-12 h-12 text-white/10 -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-indigo-200">Pro Power</span>
              <h3 className="text-2xl font-bold text-white mt-2 mb-6">Enterprise</h3>
              <div className="text-5xl font-black text-white mb-8">$12 <span className="text-lg font-medium text-indigo-200">/mo</span></div>
              <ul className="space-y-4 mb-10">
                {["Unlimited Workspaces", "Advanced AI (1.5 Flash)", "Unlimited Members", "Priority Lab Support"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-indigo-100 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-white" /> {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 bg-white rounded-2xl font-black text-indigo-600 shadow-xl active:scale-95 transition-all">
                Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-16 px-6 border-t border-white/5 text-center">
        <div className="flex items-center justify-center gap-3 mb-6 opacity-50 grayscale">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-black italic">ENTEAM</span>
        </div>
        <p className="text-zinc-600 text-xs font-medium uppercase tracking-[0.3em]">
          Designed for Impact • Built with Next.js 14
        </p>
      </footer>
    </div>
  );
}

// Sub-component for clean code
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-[32px] hover:border-indigo-500/40 hover:bg-zinc-900/50 transition-all duration-300 group">
      <div className="w-12 h-12 bg-zinc-950 rounded-2xl border border-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}