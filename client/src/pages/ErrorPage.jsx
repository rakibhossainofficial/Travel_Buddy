// pages/ErrorPage.jsx
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center space-y-6 bg-background text-foreground">
      <h1 className="text-5xl font-bold text-destructive">Oops!</h1>
      <p className="text-lg text-muted-foreground max-w-md">
        The page you’re looking for doesn’t exist or something went wrong.
      </p>

      <img
        src="/error-illustration.svg" // Replace with your own image or remove this
        alt="Error Illustration"
        className="w-[220px] md:w-[320px]"
      />

      <Link to="/">
        <Button variant="default">Back to Home</Button>
      </Link>
    </div>
  );
}
