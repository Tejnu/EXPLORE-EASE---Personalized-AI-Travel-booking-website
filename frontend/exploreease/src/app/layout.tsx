import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingChatbot from "@/components/FloatingChatbot";

const lato = Lato({
  weight: ['300', '400', '700', '900'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: "ExploreEase - Your AI-Powered Travel Companion",
  description: "Book trains, flights, hotels and more with AI-powered travel planning. ExploreEase helps you plan your perfect journey with personalized recommendations.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className={lato.className}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
          <FloatingChatbot />
        </div>
      </body>
    </html>
  );
}
