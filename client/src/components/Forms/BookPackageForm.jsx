import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useUser from "@/hooks/useUser";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  tourDate: z.date(),
  guideEmail: z.string().email("Please select a guide"),
});

export default function BookPackageForm() {
  const { userData } = useUser();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { state: pkg } = useLocation();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      tourDate: new Date(),
      guideEmail: "",
    },
  });

  const { data: guides = [] } = useQuery({
    queryKey: ["guides"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/guides");
      return data;
    },
  });

  const handleSubmit = async (data) => {
    try {
      const selectedGuide = guides.find((g) => g.email === data.guideEmail);
      const payload = {
        packageId: pkg._id,
        packageName: pkg.title,
        price: pkg.price,
        tourDate: data.tourDate,

        guideName: selectedGuide.name,
        guideEmail: selectedGuide.email,
        guideImage: selectedGuide.image || null,

        touristName: userData.name,
        touristEmail: userData.email,
        touristImage: userData.image || null,

        status: "pending",
        bookedAt: new Date(),
      };

      console.log("obec", payload);
      await axiosSecure.post("/bookings", payload);
      toast.success("Booking submitted!");
      form.reset();
      navigate("/dashboard/bookings");
    } catch (err) {
      console.error(err);
      toast.error("Failed to book package");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 space-y-4">
      <h2 className="text-3xl font-bold text-primary text-center">
        Book Package
      </h2>
      <p className="text-sm text-muted-foreground text-center max-w-md mx-auto">
        {pkg?.title}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 grid grid-cols-2 gap-x-4"
        >
          {/* Package Info */}
          <FormItem>
            <FormLabel>Package Name</FormLabel>
            <FormControl>
              <Input value={pkg?.title || ""} readOnly />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Tourist Name</FormLabel>
            <FormControl>
              <Input value={userData?.name} readOnly />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Tourist Email</FormLabel>
            <FormControl>
              <Input value={userData?.email} readOnly />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Tourist Image</FormLabel>
            <FormControl>
              <Input value={userData?.image} readOnly />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Price</FormLabel>
            <FormControl>
              <Input value={pkg?.price || 0} readOnly />
            </FormControl>
          </FormItem>

          {/* 🗓️ Tour Date Picker */}
          <FormField
            control={form.control}
            name="tourDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tour Date</FormLabel>
                <FormControl>
                  <DatePicker
                    selected={field.value}
                    onChange={field.onChange}
                    className="w-full border bg-primary-foreground rounded-md px-3 py-[5px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* 👤 Guide Selector with shadcn Select */}
          <FormField
            control={form.control}
            name="guideEmail"
            render={({ field }) => (
              <FormItem className={"col-span-2"}>
                <FormLabel>Select Guide</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger className="text-primary w-full ">
                      <SelectValue placeholder="Choose a guide" />
                    </SelectTrigger>
                    <SelectContent>
                      {guides.map((guide) => (
                        <SelectItem key={guide.email} value={guide.email}>
                          {guide.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* ✅ Submit Button */}
          <Button type="submit" className="w-full col-span-2">
            Book Now
          </Button>
        </form>
      </Form>
    </div>
  );
}
