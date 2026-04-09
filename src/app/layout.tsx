import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StudentNavbar from "@/components/layout/StudentNavbar";
import Footer from "@/components/layout/Footer";
import InstructorSidebar from "@/components/layout/InstructorSidebar";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DecentraWeb - Decentralized Learning Platform",
  description: "Learn Web3 on the blockchain",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isInstructorRoute = pathname.startsWith("/instructor");

  return (
    <html lang="en">
      <body className={inter.className}>
        {isInstructorRoute ? (
          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <InstructorSidebar />
            <main className="lg:ml-64 min-h-screen">
              <div className="p-6">
                {children}
              </div>
            </main>
            <Footer/>
          </div>
        ) : (
          <>
            <StudentNavbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer/>
          </>
        )}
      </body>
    </html>
  );
}