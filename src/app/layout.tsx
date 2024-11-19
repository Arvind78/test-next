import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "../utils/providers";
import "react-responsive-pagination/themes/classic.css";
import { ThirdwebProvider } from "thirdweb/react";

export const metadata: Metadata = {
  title: "DeFa Admin Panel",
  description: "Admin panel for managing the DeFa platform efficiently",
  icons: {
    icon: "/favicon.ico", 
  },
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
       <ThirdwebProvider  >
        <Providers>{children}</Providers>
        </ThirdwebProvider>
      </body>
    </html>
  );
}

