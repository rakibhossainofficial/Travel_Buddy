// pages/dashboard/AddStory.jsx
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useUser from "@/hooks/useUser";
import { imageUpload } from "@/utils/imageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(4, "Title must be at least 4 characters"),
  description: z.string().min(10, "Description must be detailed"),
  images: z.any(), // will hold FileList
});

export default function AddStoryForm() {
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { userData: user } = useUser();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      images: undefined,
    },
  });

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      const files = Array.from(data.images || []);
      const totalSizeBytes = files.reduce((acc, file) => acc + file.size, 0);
      const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(2);
      const infoMessage =
        totalSizeMB >= 5
          ? `Total image size: ${totalSizeMB} MB. This may take a moment to upload and publish.`
          : `Total image size: ${totalSizeMB} MB`;
      toast.info(infoMessage);

      const uploadedImages = [];
      for (const file of files) {
        const url = await imageUpload(file);
        if (url) uploadedImages.push(url);
      }

      const payload = {
        title: data.title,
        description: data.description,
        images: uploadedImages,
        author: {
          name: user?.name,
          email: user?.email,
          image: user?.image,
          role: user?.role,
        },
        createdAt: new Date(),
      };

      await axiosSecure.post("/stories", payload);
      toast.success("Story added successfully!");
      form.reset();
    } catch (err) {
      toast.error("Failed to submit story");
      console.error(err);
    } finally {
      setLoading(false);
      form.reset({
        title: "",
        description: "",
        images: undefined,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-4">
      <h2 className="text-3xl font-bold text-primary text-center">
        Add Your Story
      </h2>
      <p className="text-sm text-muted-foreground text-center">
        Share your travel experiences with the community
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Story Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Example: My Weekend in Cox’s Bazar"
                  />
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
                <FormLabel>Story Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={6}
                    placeholder="Write your travel experience..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload Images</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => field.onChange(e.target.files)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {loading ? "Publishing..." : "Publish Story"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
