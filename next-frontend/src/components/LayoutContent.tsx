"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname?.startsWith('/auth');
  const isLoginPage = pathname?.includes('/login');

  useEffect(() => {
    if (isAuthPage && isLoginPage) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAuthPage, isLoginPage]);

  return (
    <AuthProvider>
      <Navbar />
      {children}
      {!isAuthPage && <Footer />}
    </AuthProvider>
  );
}
