"use client";

import { signInAction } from "../actions";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, ArrowRight } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await signInAction(formData);

    if (result?.error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: result.error,
        background: '#ffffff',
        color: '#000000',
        confirmButtonColor: '#000000',
        customClass: {
          popup: 'border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
        }
      });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: `Welcome back, ${result.name}! You are now logged into EnTeam.`,
        background: '#ffffff',
        color: '#000000',
        confirmButtonColor: '#000000',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
        }
      });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="w-full max-w-sm space-y-8 bg-white dark:bg-black border border-black/10 dark:border-white/10 p-8 rounded-xl shadow-xl relative z-10">
        <div className="text-center">
          <div className="w-12 h-12 bg-black dark:bg-white rounded-lg flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Zap className="w-6 h-6 text-white dark:text-black fill-current" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter">Welcome Back</h2>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Enter your credentials to access EnTeam</p>
        </div>

        <form action={handleSubmit} className="space-y-4 mt-8">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
            <input 
              name="email"
              type="email" 
              required
              placeholder="name@company.com" 
              className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded-md px-4 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-all text-sm font-medium" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">Password</label>
            <input 
              name="password"
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full bg-transparent border border-black/20 dark:border-white/20 rounded-md px-4 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-all text-sm font-medium" 
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-black dark:bg-white text-white dark:text-black font-bold py-3.5 rounded-md transition-all flex items-center justify-center gap-2 group mt-6 active:scale-95"
          >
            Sign In to EnTeam
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm font-medium pt-4">
          {"Don't have an account?"} <Link href="/sign-up" className="text-black dark:text-white font-bold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}