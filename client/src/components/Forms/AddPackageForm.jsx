import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { toast } from "sonner";
import { imageUpload } from "@/utils/imageUpload";

const schema = z.object({
  title: z.string().min(4, "Package title is required"),
  tourType: z.string().min(3, "Enter a valid tour type"),
  price: z.number().positive("Price must be a positive number"),
  itinerary: z.string().min(10, "Itinerary must be descriptive"),
  images: z.any(),
});

export default function AddPackageForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      tourType: "",
      price: 0,
      itinerary: "",
      images: undefined,
    },
  });

  const axiosSecure = useAxiosSecure();

  const handleSubmit = async (data) => {
    try {
      toast.info("Uploading images...");
      let gallery = [];

      if (data.images && data.images.length > 0) {
        const files = Array.from(data.images);
        for (const file of files) {
          const url = await imageUpload(file);
          if (url) gallery.push(url);
        }
      }

      const payload = {
        title: data.title,
        tourType: data.tourType,
        price: data.price,
        itinerary: data.itinerary,
        images: gallery,
        createdAt: new Date(),
      };

      await axiosSecure.post("/packages", payload);
      toast.success("Package added successfully!");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add package");
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-3xl font-bold text-primary text-center">
        Add New Travel Package
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-xl mx-auto">
        Create a new travel offering with details, itinerary, and gallery to
        showcase the destination.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g. Discover Sylhet" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tourType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tour Type</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="e.g. Nature, Heritage, Cultural"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (BDT)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    placeholder="e.g. 1500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="itinerary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Itinerary</FormLabel>
                <FormControl>
                  <Textarea
                    rows={6}
                    {...field}
                    placeholder="Day 01: Tea garden visit..."
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
                <FormLabel>Gallery Images</FormLabel>
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
            Add Package
          </Button>
        </form>
      </Form>
    </div>
  );
}
