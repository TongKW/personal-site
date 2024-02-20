import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { NavigationMenu } from "@/components/ui/navigation";
import { LineSeperator } from "@/components/ui/seperator";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Peter's Home",
  description: "Peter's Home",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { text: "Goals", href: "/goals" },
    { text: "Projects", href: "/projects" },
    { text: "Wall", href: "/wall" },
    { text: "Work", href: "/work/system" },
  ];

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="w-full h-full flex flex-col">
          <NavigationMenu items={navItems} />
          <LineSeperator />
          {children}
        </div>
      </body>
    </html>
  );
}
