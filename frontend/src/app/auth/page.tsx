"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { mockLogin, mockSignup } from "@/lib/authService";
import type { Role } from "@/config/rbac";
import {
    ArrowRight,
    Mail,
    Lock,
    User,
    Shield,
    Eye,
    EyeOff,
    Truck
} from "lucide-react";

const ROLE_OPTIONS: { label: string; value: Role }[] = [
    { label: "Fleet Manager", value: "Manager" },
    { label: "Dispatcher", value: "Dispatcher" },
    { label: "Safety Officer", value: "Safety" },
    { label: "Financial Analyst", value: "Financial" },
];

export default function AuthPage() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Visibility toggles
    const [showLoginPassword, setShowLoginPassword] = useState(false);
    const [showSignupPassword, setShowSignupPassword] = useState(false);
    const [showSignupConfirm, setShowSignupConfirm] = useState(false);

    // Login fields
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Signup fields
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupConfirm, setSignupConfirm] = useState("");
    const [signupRole, setSignupRole] = useState<Role>("Manager");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!loginEmail || !loginPassword) {
            setError("Please fill in all fields.");
            return;
        }
        setLoading(true);
        try {
            await mockLogin(loginEmail, loginPassword);
            router.push("/dashboard");
        } catch {
            setError("Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        if (!signupName || !signupEmail || !signupPassword || !signupConfirm) {
            setError("Please fill in all fields.");
            return;
        }
        if (signupPassword !== signupConfirm) {
            setError("Passwords do not match.");
            return;
        }
        if (signupPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        try {
            await mockSignup(signupName, signupEmail, signupPassword, signupRole);
            router.push("/dashboard");
        } catch {
            setError("Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-white border border-slate-200 rounded-xl py-3 pl-11 pr-10 text-[14px] text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none transition-all placeholder:text-slate-400 font-medium shadow-sm hover:border-slate-300";

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-8 font-sans antialiased overflow-hidden selection:bg-slate-900 selection:text-white">

            {/* Background ambient light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-900/[0.03] rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative w-full max-w-[1000px] h-[680px] bg-white rounded-[24px] overflow-hidden shadow-[0px_8px_40px_rgba(0,0,0,0.06)] border border-slate-100 flex">

                {/* ── LEFT panel (Sign In Form) ────────────────────────── */}
                <div
                    className={`absolute top-0 left-0 w-1/2 h-full p-12 sm:p-16 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white
            ${isLogin ? 'opacity-100 z-10 pointer-events-auto transform-none' : 'opacity-0 z-0 pointer-events-none -translate-x-8'}`}
                >
                    <div className="mb-10 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 mb-6 shadow-sm">
                            <Truck className="w-6 h-6 text-slate-900" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Welcome back</h2>
                        <p className="text-[15px] text-slate-500 font-medium">Please enter your details to sign in.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-5 px-2 w-full max-w-[360px] mx-auto">
                        <div className="space-y-2">
                            <label className="block text-[13px] font-semibold text-slate-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                    placeholder="name@company.com"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-[13px] font-semibold text-slate-700">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type={showLoginPassword ? "text" : "password"}
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className={inputClass}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                                >
                                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error && isLogin && (
                            <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                <p className="text-[13px] text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white rounded-xl py-3 text-[14px] font-semibold hover:bg-slate-800 hover:shadow-md transition-all mt-4 disabled:opacity-50 disabled:hover:shadow-none"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>
                </div>

                {/* ── RIGHT panel (Sign Up Form) ───────────────────────── */}
                <div
                    className={`absolute top-0 right-0 w-1/2 h-full p-10 flex flex-col justify-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] bg-white
            ${!isLogin ? 'opacity-100 z-10 pointer-events-auto transform-none' : 'opacity-0 z-0 pointer-events-none translate-x-8'}`}
                >
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Create an account</h2>
                        <p className="text-[15px] text-slate-500 font-medium">Start organizing your fleet operations.</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4 w-full max-w-[360px] mx-auto">
                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-semibold text-slate-700">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    value={signupName}
                                    onChange={(e) => setSignupName(e.target.value)}
                                    placeholder="Amit Kumar"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-semibold text-slate-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="email"
                                    value={signupEmail}
                                    onChange={(e) => setSignupEmail(e.target.value)}
                                    placeholder="name@email.com"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-semibold text-slate-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type={showSignupPassword ? "text" : "password"}
                                        value={signupPassword}
                                        onChange={(e) => setSignupPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className={`${inputClass} !pl-9 !pr-8`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                                    >
                                        {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="block text-[13px] font-semibold text-slate-700">
                                    Confirm
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type={showSignupConfirm ? "text" : "password"}
                                        value={signupConfirm}
                                        onChange={(e) => setSignupConfirm(e.target.value)}
                                        placeholder="••••••••"
                                        className={`${inputClass} !pl-9 !pr-8`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSignupConfirm(!showSignupConfirm)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                                    >
                                        {showSignupConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[13px] font-semibold text-slate-700">
                                Role
                            </label>
                            <div className="relative">
                                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 z-10" />
                                <select
                                    value={signupRole}
                                    onChange={(e) => setSignupRole(e.target.value as Role)}
                                    className={`${inputClass} appearance-none bg-white relative z-0`}
                                >
                                    {ROLE_OPTIONS.map((r) => (
                                        <option key={r.value} value={r.value}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {error && !isLogin && (
                            <div className="p-3 bg-red-50/50 border border-red-100 rounded-xl flex items-center gap-2 mt-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                <p className="text-[13px] text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white rounded-xl py-3 text-[14px] font-semibold hover:bg-slate-800 hover:shadow-md transition-all mt-6 disabled:opacity-50 disabled:hover:shadow-none"
                        >
                            {loading ? "Creating..." : "Create Account"}
                        </button>
                    </form>
                </div>

                {/* ── OVERLAY panel (Dark Enterprise Section) ──────────────── */}
                <div
                    className="absolute top-0 left-0 w-1/2 h-full bg-[#0F172A] text-white transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] z-20 flex flex-col justify-center items-center text-center shadow-2xl overflow-hidden"
                    style={{ transform: isLogin ? 'translateX(100%)' : 'translateX(0%)' }}
                >
                    {/* Stunning Abstract Glass Background */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-blue-500/20 blur-[80px]"></div>
                        <div className="absolute bottom-[0%] -left-[10%] w-[60%] h-[60%] rounded-full bg-emerald-500/10 blur-[80px]"></div>
                        <div className="absolute top-[40%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 blur-[100px]"></div>
                        <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-[1px]"></div>
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                    </div>

                    <div className="relative z-10 px-12 w-full flex flex-col items-center">
                        {isLogin ? (
                            <div key="signup-prompt" className="flex flex-col items-center animate-in fade-in slide-in-from-left-8 duration-700">
                                <div className="w-16 h-16 rounded-[20px] bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl flex items-center justify-center mb-8 relative
                   before:absolute before:inset-0 before:rounded-[20px] before:bg-gradient-to-b before:from-white/20 before:to-transparent before:opacity-50">
                                    <Truck className="w-7 h-7 text-white/90" />
                                </div>
                                <h2 className="text-[32px] font-bold mb-4 tracking-tight drop-shadow-sm">
                                    New to FleetFlow?
                                </h2>
                                <p className="text-slate-300 mb-10 text-[15px] font-medium px-4 leading-relaxed max-w-[320px]">
                                    Join our enterprise platform to streamline your logistics, track assets, and manage operations in one centralized hub.
                                </p>
                                <button
                                    onClick={() => { setIsLogin(false); setError(""); }}
                                    className="group relative rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 text-[14px] font-semibold transition-all overflow-hidden flex items-center gap-2 backdrop-blur-sm"
                                >
                                    <span className="relative z-10 flex items-center gap-2 text-white">
                                        Create Account <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </button>
                            </div>
                        ) : (
                            <div key="login-prompt" className="flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-700">
                                <div className="w-16 h-16 rounded-[20px] bg-white/5 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl flex items-center justify-center mb-8 relative
                   before:absolute before:inset-0 before:rounded-[20px] before:bg-gradient-to-b before:from-white/20 before:to-transparent before:opacity-50">
                                    <Truck className="w-7 h-7 text-white/90" />
                                </div>
                                <h2 className="text-[32px] font-bold mb-4 tracking-tight drop-shadow-sm">
                                    Have an Account?
                                </h2>
                                <p className="text-slate-300 mb-10 text-[15px] font-medium px-4 leading-relaxed max-w-[320px]">
                                    Welcome back. Sign in to access your dashboard, dispatch trips, and monitor your fleet in real-time.
                                </p>
                                <button
                                    onClick={() => { setIsLogin(true); setError(""); }}
                                    className="group relative rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-3 text-[14px] font-semibold transition-all overflow-hidden flex items-center gap-2 backdrop-blur-sm"
                                >
                                    <span className="relative z-10 flex items-center gap-2 text-white">
                                        Sign In <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
