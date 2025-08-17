// OverviewSection.tsx
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";
import video from "@/assets/overview-video.mp4";

export function OverviewSection() {
  return (
    <section className="max-w-7xl mx-auto my-12 px-4 md:px-8 lg:px-20 bg-background text-foreground">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight">
          Discover Bangladesh Like Never Before (Overview Section)
        </h2>
        <p className="text-muted-foreground mt-2">
          Your ultimate travel companion—explore top destinations, culture, and
          experiences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-xl transition-shadow">
          <CardContent>
            <CardTitle className="mb-2">Top Destinations</CardTitle>
            <p>
              In-depth guides to stunning landmarks, vibrant cities, and hidden
              gems.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardContent>
            <CardTitle className="mb-2"> Local Culture & Cuisine</CardTitle>
            <p>
              Explore Bangladesh's rich traditions, delicious food, and
              community insights.
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow">
          <CardContent>
            <CardTitle className="mb-2"> Smart Trip Planning</CardTitle>
            <p>
              Get travel packages, user stories, and real-time updates to
              streamline your journey.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="my-6 flex justify-center">
        <video autoPlay controls src={video} className="rounded-lg"></video>
      </div>

      <div className="text-center my-8">
        <Link to="/about">
          <Button variant="default" size="lg">
            Learn More About Us <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      <Separator className="my-8" />
    </section>
  );
}
