// src/app/components/layout/LayoutContainer.jsx
"use client";
import Header from "./header/header";
import Footer from "./Footer/Footer";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/app/context/AuthContext";

const LayoutContainer = ({ children }) => {
  const pathname = usePathname();

  // Don't show header/footer for admin pages
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <AuthProvider>
        {!isAdmin && <Header />}
        <main className="min-h-screen">{children}</main>
        {!isAdmin && <Footer />}
      </AuthProvider>
    </>
  );
};

export default LayoutContainer;
