import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  title: z.string().min(4),
  reason: z.string().min(10),
  cvLink: z.string().url({ message: "Must be a valid CV URL" }),
});

export default function ApplyGuideForm() {
  const { userData } = useUser();
  const axiosSecure = useAxiosSecure();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      reason: "",
      cvLink: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        title: data.title,
        reason: data.reason,
        cvLink: data.cvLink,
        applicantName: userData.name,
        applicantEmail: userData.email,
        applicantImage: userData.image,
        requestedRole: "guide",
        status: "pending",
      };
      await axiosSecure.post("/candidates", payload);
      toast.success("Application submitted successfully");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit application");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary text-center">
        Join as Tour Guide
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Application Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reason"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Why You Want to Be a Guide</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={4} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cvLink"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CV Link</FormLabel>
                <FormControl>
                  <Input type="url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit Application
          </Button>
        </form>
      </Form>
    </div>
  );
}
