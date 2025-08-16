import Footer from "@/components/Shared/Footer";
import Navbar from "@/components/Shared/Navbar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <>
      <div className="sticky top-0 z-50 bg-accent">
        <Navbar />
      </div>
      <main className="min-h-[calc(100vh-138px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
