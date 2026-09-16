import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nuradesk",
  description: "Everything you need to run your business.",
  icons: {
    icon: "/logo/logo.png.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white text-gray-950 font-sans selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
