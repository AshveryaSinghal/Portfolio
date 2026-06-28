import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ashverya Singhal — Software Engineer",
  description:
    "Software Engineer specializing in AI & Mobile Development. Building intelligent systems and elegant mobile experiences.",
  keywords: ["Software Engineer", "AI Developer", "Mobile Developer", "Flutter", "Machine Learning"],
  authors: [{ name: "Ashverya Singhal" }],
  openGraph: {
    title: "Ashverya Singhal — Software Engineer",
    description: "Software Engineer specializing in AI & Mobile Development.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
