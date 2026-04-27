import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
<<<<<<< HEAD
import { Web3Provider } from "@/lib/web3-provider";
import { Footer } from "@/components/footer";
=======
import StudentNavbar from "@/components/layout/StudentNavbar";
import Footer from "@/components/layout/Footer";
import InstructorSidebar from "@/components/layout/InstructorSidebar";
import { headers } from "next/headers";
>>>>>>> ff84ecb7f40cd6cf9354e7c60995bdfe8c7f6304

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "DecentraWeb | Decentralized Learning Platform",
  description: "Empowering the next generation of builders through decentralized education.",
=======
  title: "DecentraWeb - Decentralized Learning Platform",
  description: "Learn Web3 on the blockchain",
>>>>>>> ff84ecb7f40cd6cf9354e7c60995bdfe8c7f6304
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
<<<<<<< HEAD
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Web3Provider>
          {children}
          <Footer />
        </Web3Provider>
=======
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
>>>>>>> ff84ecb7f40cd6cf9354e7c60995bdfe8c7f6304
      </body>
    </html>
  );
}