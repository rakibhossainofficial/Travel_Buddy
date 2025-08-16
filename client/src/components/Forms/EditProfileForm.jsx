import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { imageUpload } from "@/utils/imageUpload";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  image: z.any().optional(), // FileList support
});

export default function EditProfileForm({ user, refetch, modalClose }) {
  const axiosSecure = useAxiosSecure();
  const { updateUserProfile } = useAuth();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user.name,
      image: undefined,
    },
  });

  const handleSubmit = async (data) => {
    try {
      let hostedImageUrl = user.image;

      const file = data.image?.[0];
      if (file instanceof File) {
        hostedImageUrl = await imageUpload(file);
        if (!hostedImageUrl) {
          toast.error("Image upload failed");
          return;
        }
      }

      const payload = {
        name: data.name,
        image: hostedImageUrl,
      };

      await updateUserProfile({
        displayName: payload.name,
        photoURL: payload.image,
      });
      await axiosSecure.patch(`/user/${user._id}`, payload);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Profile Update Error:", error);
      toast.error("Update failed");
    } finally {
      refetch();
      modalClose(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Your Name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
