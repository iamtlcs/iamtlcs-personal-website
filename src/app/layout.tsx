import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Simon Cheung Tak Leung - Full Stack & DevOps Engineer",
  description: "Portfolio of Simon Cheung Tak Leung - A passionate Full Stack & DevOps Engineer building scalable and dynamic web experiences.",
  keywords: ["Simon Cheung", "Full Stack Developer", "DevOps Engineer", "React", "Node.js", "AWS", "Hong Kong"],
  authors: [{ name: "Simon Cheung Tak Leung" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
      </head>
      <body className={`${inter.variable} font-inter antialiased`}>
        {children}
      </body>
    </html>
  );
}
