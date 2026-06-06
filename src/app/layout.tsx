import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

export const metadata: Metadata = {
  title: "SheVibes — 66 Days of Building",
  description: "A showcase of everything built by the SheVibes Cohort 0 over 66 days with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased">
        <nav
          style={{
            background: "rgba(13,17,23,0.85)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--border)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              padding: "0 24px",
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Link
              href="/"
              style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}
            >
              <Image
                src="/pifo-logo.svg"
                alt="PiFo"
                width={90}
                height={32}
                style={{ display: "block" }}
              />
              <span
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.2px",
                }}
              >
                SheVibes{" "}
                <span style={{ color: "var(--text-secondary)", fontWeight: 400 }}>
                  by PiFo
                </span>
              </span>
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link href="/" className="btn-ghost" style={{ padding: "6px 14px", fontSize: 13 }}>
                Gallery
              </Link>
            </div>
          </div>
        </nav>

        <main style={{ flex: 1 }}>{children}</main>

        <footer
          style={{
            borderTop: "1px solid var(--border)",
            padding: "24px",
            textAlign: "center",
            color: "var(--text-muted)",
            fontSize: 13,
          }}
        >
          Powered by PiFo
        </footer>
      </body>
    </html>
  );
}
