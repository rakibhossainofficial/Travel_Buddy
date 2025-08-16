import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router";

export default function ManageStories() {
  const { userData } = useUser();
  const axiosSecure = useAxiosSecure();

  const {
    data: stories = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-stories", userData?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/stories/my?email=${userData?.email}`
      );
      return data;
    },
    enabled: !!userData?.email,
  });

  const handleDelete = async (id) => {
    toast("Are you sure you want to delete?", {
      description: "Once deleted, your story will be permanently removed.",
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await axiosSecure.delete(`/stories/${id}`);
            toast.success("Story deleted successfully!");
            refetch();
          } catch (error) {
            console.error(error);
            toast.error("Failed to delete story");
          }
        },
      },
    });
  };

  if (isLoading)
    return <p className="text-center py-10">Loading your stories...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-primary">
          Manage Your Travel Stories
        </h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Take control of your shared adventures — edit, update, or remove
          stories you've posted. Whether it's refining your words or refreshing
          your gallery, this is where your travel tales stay fresh and
          inspiring.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {stories.map((story) => (
          <Card key={story._id}>
            <CardHeader>
              <img
                src={story.images?.[0]}
                alt={story.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <CardTitle className="text-lg font-semibold">
                {story.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Link to={`/dashboard/edit-story/${story._id}`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button
                variant="destructive"
                onClick={() => handleDelete(story._id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
