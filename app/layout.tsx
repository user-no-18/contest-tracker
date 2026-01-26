// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DSA Quest - Competitive Programming Contest Tracker | LeetCode, Codeforces, CodeChef",
    template: "%s | DSA Quest"
  },
  description: "Track upcoming coding contests from LeetCode, Codeforces, CodeChef, AtCoder, HackerRank & more. Get daily email alerts, practice DSA problems, and prepare for FAANG interviews.",
  keywords: "competitive programming, contest tracker, coding contests, leetcode, codeforces, codechef, dsa practice, FAANG preparation, algorithm practice, coding interview prep",
  authors: [{ name: "DSA Quest Team" }],
  creator: "DSA Quest",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "DSA Quest",
    title: "DSA Quest - Track All Coding Contests in One Place",
    description: "Never miss a coding contest! Track LeetCode, Codeforces, CodeChef, AtCoder & more. Get email alerts and prepare for FAANG interviews.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Quest - Competitive Programming Contest Tracker",
    description: "Track coding contests from 10+ platforms. Get daily alerts & prepare for FAANG interviews.",
  },
  robots: {
    index: true,
    follow: true,
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
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WS99FGKXWT');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}