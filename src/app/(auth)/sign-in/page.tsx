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
      // Pop Up Gagal
      Swal.fire({
        icon: 'error',
        title: 'Login Gagal',
        text: result.error,
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#ef4444'
      });
    } else {
      // Pop Up Berhasil
      Swal.fire({
        icon: 'success',
        title: 'Welcome Back!',
        text: `Halo ${result.name || "Ngab"}, selamat bekerja kembali di EnTeam!`,
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#4f46e5',
        timer: 2000,
        showConfirmButton: false
      });

      // Redirect ke Dashboard setelah delay singkat
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-zinc-900/50 border border-zinc-800 p-10 rounded-[32px] backdrop-blur-xl">
        <div className="text-center">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-500/20">
            <Zap className="w-7 h-7 text-white fill-white" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight italic">Welcome Back</h2>
          <p className="text-zinc-500 text-sm mt-2 font-medium italic">Enter your credentials to access EnTeam</p>
        </div>

        {/* Gunakan 'action' bawaan form Next.js */}
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              name="email"
              type="email" 
              required
              placeholder="sawit@enteam.com" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-700" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              name="password"
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-indigo-500 transition-all placeholder:text-zinc-700" 
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 group shadow-xl shadow-indigo-600/10"
          >
            Sign In to EnTeam
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-zinc-500 text-sm font-medium">
          {"Don't have an account?"} <Link href="/sign-up" className="text-indigo-400 hover:text-indigo-300 font-bold">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}