"use client";
import Header from "../components/layout/header/header";
import Footer from "../components/layout/Footer/footer";
import Category from "../components/ui/Category/Category";
import Banner from "../components/ui/Banner/Banner";

export default function Homepage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900">
      {/* HEADER */}
      <Header />

      {/* CATEGORY SECTION */}
      <Category />
      {/* BANNER */}
      <Banner />
      {/* FOOTER */}
      <Footer />
    </div>
  );
}
