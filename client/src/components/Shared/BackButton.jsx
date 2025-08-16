import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  return (
    <div className="absolute top-10 left-10">
      <Button
        className="flex gap-2 items-center"
        onClick={() =>
          navigate(pathname === "/login" || pathname === "/register" ? "/" : -1)
        }
      >
        <ArrowLeft />
        {pathname === "/login" || pathname === "/register"
          ? "Go To Home"
          : "Go Back"}
      </Button>
    </div>
  );
}
