"use client";

import { signUpAction } from "../actions";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const result = await signUpAction(formData);

    if (result?.error) {
      Swal.fire({ icon: 'error', title: 'Waduh!', text: result.error, background: '#18181b', color: '#fff' });
    } else {
      Swal.fire({
        icon: 'success',
        title: 'BERHASIL!',
        text: 'Akun kamu sudah aktif, gas ke Dashboard!',
        background: '#18181b',
        color: '#fff',
        confirmButtonColor: '#4f46e5'
      }).then(() => {
        router.push("/dashboard");
      });
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <form action={handleSubmit} className="w-full max-w-md bg-zinc-900 border border-zinc-800 p-10 rounded-[32px] space-y-6">
        <h2 className="text-3xl font-black text-white text-center">Create Account</h2>
        
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Full Name</label>
          <input name="name" type="text" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none" placeholder="Sawit Pro" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Email</label>
          <input name="email" type="email" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none" placeholder="ngab@enteam.com" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Password</label>
          <input name="password" type="password" className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none" placeholder="••••••••" />
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-600/20">
          Sign Up Now
        </button>

        <p className="text-center text-zinc-500 text-sm">
          Sudah punya akun? <Link href="/sign-in" className="text-indigo-400 font-bold">Sign In</Link>
        </p>
      </form>
    </div>
  );
}