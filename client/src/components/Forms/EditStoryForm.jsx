import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { imageUpload } from "@/utils/imageUpload";

const schema = z.object({
  title: z.string().min(4),
  description: z.string().min(10),
  images: z.any(),
});

export default function EditStoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const {
    data: story,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["story", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/stories/${id}`);
      return data;
    },
  });

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: story?.title || "",
      description: story?.description || "",
      images: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (updatedData) => {
      return await axiosSecure.put(`/stories/${id}`, updatedData);
    },
    onSuccess: () => {
      toast.success("Story updated successfully!");
      navigate("/dashboard/stories");
      refetch();
    },
    onError: () => toast.error("Update failed"),
  });

  const handleRemoveImage = async (url) => {
    try {
      await axiosSecure.patch(`/stories/${id}/remove-image`, { url });
      toast.success("Image removed");
      refetch();
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove image");
    }
  };

  const onSubmit = async (data) => {
    let newImageUrls = [];

    if (data.images && data.images.length > 0) {
      const files = Array.from(data.images);
      for (const file of files) {
        const url = await imageUpload(file);
        if (url) newImageUrls.push(url);
      }
    }

    mutation.mutate({
      title: data.title,
      description: data.description,
      newImages: newImageUrls,
    });
  };

  if (isLoading) return <p className="text-center py-10">Loading story...</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <h2 className="text-3xl font-bold text-primary text-center">
        Edit Your Story
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea rows={6} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Show existing images */}
          <div className="space-y-2">
            <p className="font-medium">Current Images:</p>
            <div className="flex gap-2 flex-wrap">
              {story?.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt={`img-${i}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-0 right-0 text-xs"
                    onClick={() => handleRemoveImage(img)}
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Add new images */}
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Add More Images</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Update Story
          </Button>
        </form>
      </Form>
    </div>
  );
}
