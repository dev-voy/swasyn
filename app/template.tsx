import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import React from "react";

export default function template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
