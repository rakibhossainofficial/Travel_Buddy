import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Outlet, useLocation, useNavigate } from "react-router";

export default function ProtectedAuthLayout() {
  const { user, authLoading } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(state || "/", { replace: true });
    }
  }, [user, state, navigate]);

  if (authLoading) {
    return <p>loading...</p>;
  }

  // if (user) {
  //   // already handled via useEffect
  //   return null;
  // }

  return <Outlet />;
}
