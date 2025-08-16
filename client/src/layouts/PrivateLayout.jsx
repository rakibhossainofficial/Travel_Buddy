import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function PrivateLayout() {
  const { user, authLoading } = useAuth(); // assumes you're managing `user` and a `loading` state
  const { pathname } = useLocation();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-muted-foreground text-sm">
          Checking access...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={pathname} replace />;
  }

  return <Outlet />;
}
