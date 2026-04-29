"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

/**
 * ACTION: SIGN UP
 * Menghash password dan menyimpan user baru ke database + Cookies
 */
export async function signUpAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Validasi Input
  if (!name || !email || !password) {
    return { error: "Semua field wajib diisi, Ngab!" };
  }

  try {
    // 2. Cek apakah email sudah ada
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar, pakai email lain!" };
    }

    // 3. Enkripsi Password (Salt rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Simpan ke Database
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 5. Simpan Session ke Cookie (Biar Dashboard bisa baca nama user)
    const cookieStore = await cookies();
    cookieStore.set("user_name", user.name || "User", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // Berlaku 7 hari
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("SIGNUP_ERROR:", error);
    return { error: "Gagal membuat akun, coba lagi nanti." };
  }
}

/**
 * ACTION: SIGN IN
 * Memvalidasi kredensial dan mencocokkan hash password
 */
export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // 1. Validasi Input
  if (!email || !password) {
    return { error: "Email dan password jangan dikosongin!" };
  }

  try {
    // 2. Cari user di DB
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { error: "User tidak ditemukan!" };
    }

    // 3. Bandingkan Password (Bcrypt compare)
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { error: "Password kamu salah, Ngab!" };
    }

    // 4. Update/Set Session Cookie
    const cookieStore = await cookies();
    cookieStore.set("user_name", user.name || "User", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return { success: true, name: user.name };
  } catch (error) {
    console.error("SIGNIN_ERROR:", error);
    return { error: "Terjadi kesalahan sistem saat login." };
  }
}

/**
 * ACTION: LOGOUT
 * Menghapus cookie session
 */
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("user_name");
}