// components/Footer.jsx
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="border-t py-6 bg-background">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground px-2">
        {/* Branding */}
        <div className="mb-4 md:mb-0">
          <span className="font-bold text-primary">TravelBuddy</span> ©{" "}
          {new Date().getFullYear()}
        </div>

        {/* Social Links */}
        <div className="flex gap-4">
          <Link to="https://github.com/yourprofile">GitHub</Link>
          <Link to="https://linkedin.com/in/yourprofile">LinkedIn</Link>
          <Link to="https://yourportfolio.com">Portfolio</Link>
        </div>
      </div>
    </footer>
  );
}
