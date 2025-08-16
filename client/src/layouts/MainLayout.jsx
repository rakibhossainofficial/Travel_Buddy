import Footer from "@/components/Shared/Footer";
import Navbar from "@/components/Shared/Navbar";
import { Outlet } from "react-router";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-138px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
