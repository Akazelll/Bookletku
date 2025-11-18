import type { Metadata } from "next";
import { Geist } from "next/font/google"; // Font Anda sudah pas
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-sans", // Ganti nama variabel agar sesuai shadcn
  subsets: ["latin"],
});

// (File Anda menggunakan Geist_Mono, tapi --font-mono biasanya tidak diperlukan shadcn)
// const geistMono = Geist_Mono...

export const metadata: Metadata = {
  title: "Bookletku - Admin", // Ganti judul
  description: "Self-service digital menu builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geistSans.variable
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
