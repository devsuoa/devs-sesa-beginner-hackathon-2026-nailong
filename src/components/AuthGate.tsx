"use client";

type Props = {
  loading: boolean;
  children: React.ReactNode;
};

export function AuthGate({ loading, children }: Props) {
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p
          className="text-[10px] tracking-[0.3em] text-white/35 animate-pulse"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          VERIFYING IDENTITY...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}