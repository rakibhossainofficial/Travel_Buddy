import GoogleLogin from "@/components/Shared/GoogleLogin";
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
import { useAuth } from "@/hooks/useAuth";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { imageUpload } from "@/utils/imageUpload";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Enter a valid email" }),
  image: z.any().refine((file) => file instanceof File || file?.length > 0, {
    message: "Please upload an image file",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function RegisterForm() {
  const { createUser, updateUserProfile } = useAuth();
  const axiosPublic = useAxiosPublic();
  const [registerLoading, setRegisterLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      image: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setRegisterLoading(true);
    const imageUrl = await imageUpload(data.image);
    const { name, email, password } = data;
    console.log("Registering:", { ...data, imageUrl });

    try {
      await axiosPublic.post("/register", {
        name,
        email,
        password,
        isSocial: false,
        image: imageUrl,
      });
      await createUser(email, password);
      await updateUserProfile({ displayName: name, photoURL: imageUrl });
      toast.success("Registered successfully.");
    } catch (error) {
      toast.error("Something went while register.");
      console.log(error);
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div type="fade" className="max-w-md w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 border p-6 rounded-md"
        >
          <h2 className="text-xl font-bold text-center">Register</h2>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your Email" {...field} />
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
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Your Password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            {registerLoading ? "Registering..." : "Register"}
          </Button>
          <GoogleLogin />
        </form>
      </Form>
    </div>
  );
}
