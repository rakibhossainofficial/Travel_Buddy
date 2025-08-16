import { Link, useParams } from "react-router";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TourGuideProfile() {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: guide = {}, isLoading: guideLoading } = useQuery({
    queryKey: ["guide-profile", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/guide/${id}`);
      console.log(new Date().toLocaleString());
      return res.data;
    },
    enabled: !!id,
  });

  const { data: stories = [], isLoading: storiesLoading } = useQuery({
    queryKey: ["guide-stories", id],
    queryFn: async () => {
      const email = await guide.email;
      const res = await axiosSecure.get(`/stories?guideEmail=${email}`);
      return res.data;
    },
    staleTime: 0, // Treat data as stale instantly
    cacheTime: 0, // Remove from cache immediately after unused
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!id,
  });

  if (guideLoading || storiesLoading)
    return <p className="text-center py-10">Loading guide profile...</p>;

  console.log(guide);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <div className="flex items-center gap-6">
        <img
          src={guide.image}
          alt={guide.name}
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-primary">{guide.name}</h2>
          <p className="text-muted-foreground">{guide.email}</p>
          {guide.bio && <p className="mt-2 text-sm">{guide.bio}</p>}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Stories by {guide.name}</h3>
        {stories.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No stories shared yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((story) => (
              <Card key={story._id}>
                <CardContent className="space-y-3 p-4">
                  <h4 className="text-lg font-semibold">{story.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {story.description}
                  </p>
                  {story.images?.[0] && (
                    <img
                      src={story.images[0]}
                      alt="Story"
                      className="w-full h-48 object-cover rounded"
                    />
                  )}
                  <Link to={`/story-details/${story._id}`}>
                    <Button size="sm" variant="outline">
                      Read More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
