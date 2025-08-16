import { useParams } from "react-router";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FacebookShareButton } from "react-share";

export default function StoryDetails() {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: story = {}, isLoading } = useQuery({
    queryKey: ["story-details", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/story/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  if (isLoading) return <p className="text-center py-10">Loading story...</p>;

  console.log(story);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold text-primary">{story.title}</h1>
        <p className="text-muted-foreground text-sm">
          by {story?.author?.name} ({story?.author?.email})
        </p>
      </div>

      <Card>
        <CardContent className="space-y-6 p-6">
          <p className="text-base leading-relaxed">{story.description}</p>

          {story.images && story.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {story.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Story Image ${idx + 1}`}
                  className="w-full h-56 object-cover rounded"
                />
              ))}
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <FacebookShareButton url={window.location.href} quote={story.title}>
              <Button size="sm">Share on Facebook</Button>
            </FacebookShareButton>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
