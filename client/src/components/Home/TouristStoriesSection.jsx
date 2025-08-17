import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import { FacebookIcon, FacebookShareButton } from "react-share";

export default function TouristStoriesSection() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();

  const { data: stories, isLoading } = useQuery({
    queryKey: ["stories-random"],
    queryFn: async () => {
      const { data } = await axiosPublic("/stories/random?limit=4");
      return data;
    },
  });

  if (isLoading) return <p className="text-center">Loading stories...</p>;

  return (
    <section className="my-12 space-y-6 max-w-6xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-primary">
         Discover Bangladesh Like Never Before
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
        Your ultimate travel companion — explore top destinations, culture, and
        experiences shared by our community.
      </p>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {stories?.map((story) => (
          <Card key={story._id}>
            <CardHeader>
              <img
                src={story.images?.[0]}
                alt={story.title}
                className="w-full h-56 object-cover rounded-md"
              />
              <CardTitle>{story.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {story.description}
              </p>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              {user ? (
                <FacebookShareButton
                  url={`https://yourdomain.com/stories/${story._id}`}
                  quote={story.title}
                >
                  <FacebookIcon size={32} round />
                </FacebookShareButton>
              ) : (
                <Button onClick={() => navigate("/login")}>
                  Login to Share
                </Button>
              )}
              <Link to="/community">
                <Button variant="outline">View All Stories</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
