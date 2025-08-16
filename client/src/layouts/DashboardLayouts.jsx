import { ModeToggle } from "@/components/Shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { dashboardLinks } from "@/utils/links";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { userData } = useUser();
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const currentLinks = dashboardLinks[userData?.role] || [];

  if (!user) {
    return <Navigate to={"/auth/login"} state={pathname}></Navigate>;
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header - Fixed */}
      <header className="flex items-center justify-between px-4 py-3 border-b shrink-0">
        <Link to="/" className="text-lg font-bold text-primary">
          TravelBuddy
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
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
                <Link to="/">Home</Link>
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
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-60 pt-6">
              <ScrollArea className="h-full">
                <nav className="space-y-2 p-4">
                  {currentLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block text-sm font-medium px-2 py-1 rounded hover:bg-muted ${
                        location.pathname === link.path
                          ? "bg-muted text-primary font-semibold"
                          : ""
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Section - Stretch */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Fixed width */}
        <aside className="hidden md:block w-64 border-r px-4 py-6 shrink-0 overflow-y-auto">
          <nav className="space-y-2">
            {currentLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block text-sm font-medium px-2 py-1 rounded hover:bg-muted ${
                  location.pathname === link.path
                    ? "bg-muted text-primary font-semibold"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6">
          <Outlet />
        </main>
      </div>

      {/* Footer - Fixed */}
      <footer className="border-t py-4 text-center text-sm text-muted-foreground shrink-0">
        © {new Date().getFullYear()} TravelBuddy. All rights reserved.
      </footer>
    </div>
  );
}
