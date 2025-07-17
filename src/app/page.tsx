import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              planMyJKU
            </h1>
            <p className="text-lg text-foreground/80">
              Plan your JKU study journey efficiently
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 border border-border"
            >
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}