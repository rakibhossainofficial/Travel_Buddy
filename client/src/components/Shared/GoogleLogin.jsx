// components/AuthExtras.jsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { FcGoogle } from "react-icons/fc";
import { Link, useLocation } from "react-router";
import { toast } from "sonner";

export default function GoogleLogin() {
  const { pathname } = useLocation();
  const { googleLogin, authLoading, setAuthLoading } = useAuth();
  const axiosPublic = useAxiosPublic();

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      const { displayName, email, photoURL } = await googleLogin();
      await axiosPublic.post("/register", {
        name: displayName,
        email,
        image: photoURL,
        isSocial: true,
        password: null,
      });
      toast.success("Google Login Successfully.");
    } catch (error) {
      toast.error("Something went wrong");
      console.log(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Separator with label */}
      <div className="relative flex items-center">
        <Separator />
        <span className="absolute inset-x-0 text-center text-sm text-muted-foreground -top-2 bg-background px-2 w-max mx-auto">
          or continue with
        </span>
      </div>

      {/* Google Login Button */}
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleLogin}
      >
        {authLoading ? (
          "loading"
        ) : (
          <>
            <FcGoogle />
            <span>
              {pathname === "/auth/login" ? "Sign In" : "Sign Up"} with Google
            </span>
          </>
        )}
      </Button>

      {/* Redirect Prompt */}
      <p className="text-sm text-center text-muted-foreground flex justify-center items-center">
        {pathname === "/login"
          ? "Don't have an account?"
          : "Already have an account?"}
        &nbsp;
        <Link
          className="text-primary font-medium hover:underline"
          to={pathname === "/auth/login" ? "/auth/register" : "/auth/login"}
        >
          {pathname === "/auth/login" ? "Register" : "Login"}
        </Link>
      </p>
    </div>
  );
}
