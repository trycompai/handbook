import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarWrapper } from "@/components/sidebar-wrapper"
import { generateNavigation } from "@/lib/markdown"
import { BreadcrumbProvider } from "@/components/breadcrumb-provider"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Comp AI Handbook",
  description: "The Comp AI Employee Handbook",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navigation = generateNavigation()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BreadcrumbProvider>
          <SidebarProvider>
            <SidebarWrapper navigation={navigation} />
            <SidebarInset>
              {children}
            </SidebarInset>
          </SidebarProvider>
        </BreadcrumbProvider>
      </body>
    </html>
  );
}
