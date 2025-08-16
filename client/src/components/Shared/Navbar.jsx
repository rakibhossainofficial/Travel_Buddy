// components/Navbar.jsx
import { Link } from "react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/Shared/ThemeToggle";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-primary">
          TravelBuddy
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/">Home</Link>
          <Link to="/community">Community</Link>
          <Link to="/about">About Us</Link>
          <Link to="/all-trips">Trips</Link>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-4">
          <ModeToggle />

          {!user ? (
            <div className="hidden md:flex space-x-2">
              <Link to="/auth/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/auth/register">
                <Button>Register</Button>
              </Link>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.photoURL} />
                  <AvatarFallback>{user?.displayName}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="text-sm font-medium">{user?.displayName}</div>
                  <div className="text-xs text-muted-foreground">
                    {user?.email}
                  </div>
                </DropdownMenuLabel>
                <Separator className={"my-1"} />
                <DropdownMenuItem
                  className={"cursor-pointer font-medium"}
                  asChild
                >
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={"cursor-pointer font-medium"}
                  asChild
                >
                  <Link to="/offers">Offer Announcements</Link>
                </DropdownMenuItem>
                <Separator className={"my-1"} />
                <DropdownMenuItem
                  className={"cursor-pointer font-medium"}
                  onClick={logout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-6">
              <nav className="space-y-4 font-medium flex flex-col">
                <Link to="/" onClick={() => setOpen(false)}>
                  Home
                </Link>
                <Link to="/community" onClick={() => setOpen(false)}>
                  Community
                </Link>
                <Link to="/about" onClick={() => setOpen(false)}>
                  About Us
                </Link>
                <Link to="/all-trips" onClick={() => setOpen(false)}>
                  Trips
                </Link>
                {!user && (
                  <>
                    <Link to="/auth/login" onClick={() => setOpen(false)}>
                      Login
                    </Link>
                    <Link to="/auth/register" onClick={() => setOpen(false)}>
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
