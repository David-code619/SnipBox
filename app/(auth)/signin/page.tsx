"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import * as z from "zod";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import {
  Terminal,
  Eye,
  EyeOff,
  Loader2,
  Sparkles,
  Check,
  AlertCircle,
  Mail,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Zod validation schema for signing in
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email address is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

// SVG Logos
const AppleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 315" fill="currentColor" {...props}>
    <path d="M213.8 141.2c-.3-35.3 28.7-52.2 30-53-16.4-24-42-27.3-51-27.7-21.5-2.2-42 12.7-53 12.7-11 0-27.7-12.4-45.5-12c-23.3.3-44.8 13.6-56.8 34.4-24.3 42-6.2 104 17.3 138 11.5 16.5 25 35 43 34.3 17.3-.6 24-11 44.8-11 20.7 0 27 11 45 10.6 18.6-.3 30.5-16.8 41.8-33.3 13-19 18.4-37.5 18.7-38.5-.4-.2-36-13.8-36.3-55.8zM176.4 54.4c9.6-11.6 16-27.7 14.3-44-14 .6-31 9.3-41 21-8.6 10-16 26.3-14 42.4 15.6 1.2 31.4-8 40.7-19.4z" />
  </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export default function SignIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onLoginSubmit = (data: LoginSchema) => {
    setLoading(true);
    setMessage(null);
    setTimeout(() => {
      try {
        // login(data.email);
        setLoading(false);
        router.push("/dashboard");
      } catch {
        setLoading(false);
        setMessage({
          type: "error",
          text: "Authentication failed. Please check your credentials.",
        });
      }
    }, 1000);
  };

  const handleSocialLogIn = (provider: "Apple" | "Google") => {
    setSocialLoading(provider);
    setMessage(null);
    setTimeout(() => {
      // login(`${provider.toLowerCase()}-user@vault.internal`);
      setSocialLoading(null);
      router.push("/dashboard");
    }, 1200);
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setMessage({
      type: "success",
      text: "Password recovery dispatch initiated. Please check your developer inbox.",
    });
  };

  return (
    <div className="min-h-screen bg-workspace-bg text-on-background font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden select-none">
      {/* Adaptive Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-outline-variant)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-outline-variant)_1px,transparent_1px)] bg-size-[32px_32px] pointer-events-none opacity-[0.08] dark:opacity-[0.14]" />

      {/* Highly fluid interactive ambient glowing orbs */}
      <div className="absolute top-[-10%] left-[20%] w-125 h125 bg-primary/8 dark:bg-primary/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-150 h-150 bg-secondary/12 dark:bg-secondary/4 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-87.5 h-87.5 bg-indigo-500/8 dark:bg-indigo-500/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Brand Logo */}
      <div
        className="flex items-center gap-3.5 mb-8 select-none animate-in fade-in slide-in-from-top-4 duration-500"
        id="brand_header"
      >
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(173,198,255,0.08)] hover:rotate-12 transition-transform duration-300">
          <Terminal size={18} className="stroke-[2.5]" />
        </div>
        <div className="flex flex-col text-left">
          <span className="text-base font-extrabold tracking-tight text-on-surface leading-none font-display">
            SnippetVault
          </span>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-on-surface-variant/60 font-black mt-1">
            Workspace Security
          </span>
        </div>
      </div>

      {/* Primary Authentication Card */}
      <div className="w-full max-w-105 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div
          id="auth_card"
          className="relative w-full bg-surface-container-low border border-border-subtle/80 dark:border-border-subtle/50 rounded-2xl p-8 md:p-9 shadow-[0_12px_45px_-12px_rgba(0,0,0,0.12)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)] select-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Header Title & Subtext */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-black tracking-tight text-on-surface font-display">
                Welcome Back
              </h1>
              <p className="text-xs text-on-surface-variant/75 leading-relaxed font-sans max-w-70 mx-auto">
                Sign in to your SnippetVault cloud instance.
              </p>
            </div>

            {/* Identity Providers Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                id="apple_login_btn"
                type="button"
                onClick={() => handleSocialLogIn("Apple")}
                disabled={socialLoading !== null}
                className="h-11 border border-border-subtle/80 dark:border-border-subtle/30 bg-surface-container dark:bg-surface-container-lowest/85 hover:bg-surface-container-high dark:hover:bg-surface-container-low text-on-surface transition-all duration-150 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold active:scale-[0.97] cursor-pointer"
              >
                {socialLoading === "Apple" ? (
                  <Loader2
                    size={14}
                    className="animate-spin text-on-surface-variant/60"
                  />
                ) : (
                  <AppleIcon className="w-4 h-4 text-on-surface transition-transform duration-200" />
                )}
                <span>Apple</span>
              </button>

              <button
                id="google_login_btn"
                type="button"
                onClick={() => handleSocialLogIn("Google")}
                disabled={socialLoading !== null}
                className="h-11 border border-border-subtle/80 dark:border-border-subtle/30 bg-surface-container dark:bg-surface-container-lowest/85 hover:bg-surface-container-high dark:hover:bg-surface-container-low text-on-surface transition-all duration-150 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold active:scale-[0.97] cursor-pointer"
              >
                {socialLoading === "Google" ? (
                  <Loader2
                    size={14}
                    className="animate-spin text-on-surface-variant/60"
                  />
                ) : (
                  <GoogleIcon className="w-4 h-4 transition-transform duration-200" />
                )}
                <span>Google</span>
              </button>
            </div>

            {/* Or separator section */}
            <div className="flex items-center gap-3 select-none">
              <div className="flex-1 h-px bg-border-subtle/80" />
              <span className="text-[9px] text-on-surface-variant/40 font-mono tracking-[0.2em] uppercase whitespace-nowrap font-bold">
                or credentials
              </span>
              <div className="flex-1 h-px bg-border-subtle/80" />
            </div>

            {/* Dynamic Notification Message */}
            {message && (
              <div
                className={cn(
                  "p-3 rounded-xl flex gap-2.5 w-full text-xs items-start leading-relaxed border animate-in fade-in duration-200",
                  message.type === "success"
                    ? "bg-secondary-container/10 border-secondary/20 text-on-secondary-container"
                    : "bg-error-container/10 border-error/20 text-on-error-container",
                )}
              >
                {message.type === "success" ? (
                  <Check size={14} className="shrink-0 mt-0.5 text-secondary" />
                ) : (
                  <AlertCircle
                    size={14}
                    className="shrink-0 mt-0.5 text-error"
                  />
                )}
                <span className="font-sans text-xs font-medium">
                  {message.text}
                </span>
              </div>
            )}

            {/* Credential Login Form */}
            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
              {/* Email input field */}
              <div className="space-y-1.5 text-left group">
                <label
                  htmlFor="auth_email"
                  className="text-xs font-semibold text-on-surface-variant/85 block mb-1"
                >
                  Developer Email Address
                </label>
                <div className="relative flex items-center">
                  <Mail
                    size={15}
                    className="absolute left-3.5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors pointer-events-none"
                  />
                  <input
                    id="auth_email"
                    type="text"
                    placeholder="developer@vault.com"
                    autoComplete="email"
                    {...register("email")}
                    className={cn(
                      "w-full h-11 bg-surface-container dark:bg-surface-container-lowest/85 border border-border-subtle/80 dark:border-border-subtle/30 rounded-xl pl-11 pr-3.5 text-xs text-on-surface placeholder-on-surface-variant/45 dark:placeholder-on-surface-variant/35 outline-none transition-all duration-200 focus:border-primary focus:bg-surface-container-low dark:focus:bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 hover:border-border-subtle/90 font-sans",
                      errors.email &&
                        "border-error focus:border-error focus:ring-1 focus:ring-error/20",
                    )}
                  />
                </div>
                {errors.email && (
                  <span className="text-[11px] text-error mt-1.5 flex items-center gap-1.5 font-sans font-semibold">
                    <AlertCircle size={12} className="stroke-[2.5]" />
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password input field */}
              <div className="space-y-1.5 text-left group">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="auth_password"
                    className="text-xs font-semibold text-on-surface-variant/85 block mb-1"
                  >
                    Security Password
                  </label>
                  <a
                    id="forgot_password_link"
                    href="#recover"
                    onClick={handleForgotPassword}
                    className="text-xs text-primary hover:text-primary/95 hover:underline underline-offset-4 transition-all duration-150 cursor-pointer font-bold"
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Lock
                    size={15}
                    className="absolute left-3.5 text-on-surface-variant/40 group-focus-within:text-primary transition-colors pointer-events-none"
                  />
                  <input
                    id="auth_password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...register("password")}
                    className={cn(
                      "w-full h-11 bg-surface-container dark:bg-surface-container-lowest/85 border border-border-subtle/80 dark:border-border-subtle/30 rounded-xl pl-11 pr-10 text-xs text-on-surface placeholder-on-surface-variant/45 dark:placeholder-on-surface-variant/35 outline-none transition-all duration-200 focus:border-primary focus:bg-surface-container-low dark:focus:bg-surface-container-lowest focus:ring-4 focus:ring-primary/10 hover:border-border-subtle/90 font-sans",
                      errors.password &&
                        "border-error focus:border-error focus:ring-1 focus:ring-error/20",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-on-surface-variant/60 hover:text-on-surface transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-[11px] text-error mt-1.5 flex items-center gap-1.5 font-sans font-semibold">
                    <AlertCircle size={12} className="stroke-[2.5]" />
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Submit Action Button */}
              <button
                id="auth_submit_btn"
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary text-on-primary hover:brightness-105 disabled:opacity-50 font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer mt-5 shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.005]"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin text-on-primary" />
                ) : (
                  <Sparkles size={14} className="text-on-primary/95" />
                )}
                <span>
                  {loading ? "Decrypting Vault..." : "Authenticate Workspace"}
                </span>
              </button>
            </form>

            {/* Bottom Nav Switching */}
            <div className="text-center pt-2">
              <span className="text-xs text-on-surface-variant/80 tracking-wide font-normal">
                Don&apos;t have a secure workspace keyspace?{" "}
                <Link
                  id="signup_redirect_link"
                  href="/signup"
                  className="text-primary hover:text-primary/90 font-bold underline underline-offset-4 transition-colors cursor-pointer"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
