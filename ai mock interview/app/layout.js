import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";

// Initialize Inter font with Latin subset
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap', // Better font loading performance
  variable: '--font-inter' // Optional: use as CSS variable
});

export const metadata = {
  title: {
    default: "AI Mock Interview",
    template: "%s | AI Mock Interview" // Template for child pages
  },
  description: "Practice your interview skills with AI-powered mock interviews",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/', // Helps with SEO
  },
  openGraph: {
    title: "AI Mock Interview",
    description: "Practice your interview skills with AI-powered mock interviews",
    url: '/',
    siteName: "AI Mock Interview",
    images: [
      {
        url: '/og-image.jpg', // Add your OG image
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#000000",
          colorBackground: "#ffffff",
          colorText: "#000000",
          colorInputBackground: "#ffffff",
          colorInputText: "#000000",
        },
        elements: {
          formButtonPrimary: "bg-black hover:bg-gray-800",
          socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-100",
        }
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html 
        lang="en" 
        suppressHydrationWarning
        className={inter.variable} // Optional: if using CSS variable
      >
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="ai-mock-interview-theme"
          >
            {children}
            <Toaster 
              position="top-center" 
              richColors 
              closeButton
              toastOptions={{
                duration: 5000,
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}