"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import toast from "react-hot-toast";
import { auth, googleProvider } from "@/firebase/firebase";

const roleDashboard: Record<string, string> = {
    admin: "/dashboard/inventory",
    manager: "/dashboard/inventory",
    staff: "/dashboard/inventory",
};

const BecomeManagerPage = () => {
    const router = useRouter();
    const [googleLoading, setGoogleLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const raw = localStorage.getItem("user");

        if (token && raw) {
            try {
                const user = JSON.parse(raw);
                const path = roleDashboard[user.role] || "/dashboard/inventory";
                router.replace(path);
            } catch (error) {
                // ignore malformed user data
            }
        }
    }, [router]);

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const u = result.user;

            if (!u.email) {
                throw new Error("Google authentication failed: ইমেইল পাওয়া যায়নি।");
            }

            const res = await fetch("/api/auth/become-manager", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: u.displayName || "Google User",
                    email: u.email,
                    photoURL: u.photoURL || "",
                    provider: "google",
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Google login failed");

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            toast.success("Google login সফল হয়েছে। ড্যাশবোর্ডে নিয়ে যাচ্ছি...");

            const destination = roleDashboard[data.user.role] || "/dashboard";
            router.replace(destination);
        } catch (err: any) {
            toast.error(err?.message || "Google login ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-[#0f172a] text-white px-4 py-24 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 sm:p-12 shadow-2xl shadow-black/30">
                <div className="mb-8 text-center">
                    <p className="text-sm uppercase tracking-[0.3em] text-orange-300 mb-4">Become a Manager</p>
                    <h1 className="text-4xl sm:text-5xl font-black tracking-tight">সরাসরি Google দিয়ে লগইন করুন</h1>
                    <p className="mt-4 text-gray-300 text-base sm:text-lg leading-relaxed">
                        এক ক্লিকে Google দিয়ে লগইন করে দ্রুত ড্যাশবোর্ডে চলে যাচ্ছেন। যদি ইতিমধ্যেই লগইন করা থাকে, তাহলে স্বয়ংক্রিয়ভাবে ড্যাশবোর্ডে পাঠানো হবে।
                    </p>
                </div>

                <div className="flex flex-col gap-4 sm:gap-6">
                    <button
                        type="button"
                        disabled={googleLoading}
                        onClick={handleGoogleLogin}
                        className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#E55A2B] px-6 py-4 text-lg font-semibold text-white hover:shadow-[0_20px_80px_rgba(255,107,53,0.35)] transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {googleLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                                প্রক্রিয়া চলছে...
                            </span>
                        ) : (
                            "Google দিয়ে লগইন"
                        )}
                    </button>

                    <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center">
                        <p className="text-sm text-gray-300">Google দিয়ে লগইন করলে আপনার ড্যাশবোর্ড একদম দ্রুত খুলবে।</p>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default BecomeManagerPage;
