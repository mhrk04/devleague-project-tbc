import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProbeLoop",
  description:
    "A synthetic cafe retention experiment that learns before it discounts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
