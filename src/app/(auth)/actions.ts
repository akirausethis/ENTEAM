"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

/**
 * ACTION: SIGN UP
 */
export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Semua field wajib diisi, Ngab!" };
  }

  try {
    // 1. Cek apakah user sudah ada
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar, silakan Sign In!" };
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create User
    // Pastikan field di bawah ini sesuai dengan prisma/schema.prisma kamu
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        displayName: name,
        bio: "Baru gabung di EnTeam! 🚀",
        twoFactorEnabled: false,
        // Jangan masukkan field yang tidak ada di schema atau belum di-db push
      },
    });

    // 4. Set Cookie Session
    // Di Next.js 15, cookies() harus di-await
    const cookieStore = await cookies();
    cookieStore.set("user_name", user.name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 minggu
      path: "/",
      sameSite: "lax",
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("SIGNUP_DATABASE_ERROR:", error);
    
    const prismaError = error as { code?: string; message?: string };
    
    // Jika error karena constraint unik (P2002)
    if (prismaError.code === 'P2002') {
      return { error: "Email ini sudah dipakai, coba yang lain!" };
    }

    // Cek apakah ada field yang kurang di database
    return { error: "Gagal membuat akun. Pastikan database sudah di-push (npx prisma db push)!" };
  }
}

/**
 * ACTION: SIGN IN
 */
export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email dan password wajib diisi!" };
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "User tidak ditemukan!" };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Password kamu salah!" };
    }

    const cookieStore = await cookies();
    cookieStore.set("user_name", user.name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "lax",
    });

    return { success: true };
  } catch (error) {
    console.error("SIGNIN_ERROR:", error);
    return { error: "Terjadi kesalahan sistem saat login." };
  }
}