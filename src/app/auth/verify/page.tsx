"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function VerifyEmailContent() {
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (response.ok) {
                router.push("/auth/login?message=Email verified successfully! Please sign in.");
            } else {
                setError(data.error || "Verification failed");
            }
        } catch {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
                <div className="max-w-md w-full text-center">
                    <p className="text-destructive">Invalid verification link</p>
                    <Link href="/auth/register" className="text-primary hover:text-primary/80">
                        Go to registration
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold">Verify Your Email</h1>
                    <p className="mt-2 text-sm text-foreground/60">
                        We&apos;ve sent a 6-digit code to <strong>{email}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label htmlFor="code" className="block text-sm font-medium mb-2">
                            Verification Code
                        </label>
                        <input
                            id="code"
                            name="code"
                            type="text"
                            required
                            disabled={isLoading}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md bg-input text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 text-center text-2xl tracking-widest"
                            placeholder="000000"
                            maxLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || code.length !== 6}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-md py-2 px-4 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                    >
                        {isLoading ? "Verifying..." : "Verify Email"}
                    </button>

                    <div className="text-center">
                        <p className="text-sm text-foreground/60">
                            Didn&apos;t receive the code?{" "}
                            <button
                                type="button"
                                className="font-medium text-primary hover:text-primary/80"
                                onClick={() => {
                                    // TODO: Implement resend functionality
                                    console.log("Resend code");
                                }}
                            >
                                Resend
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyEmailContent />
        </Suspense>
    );
}