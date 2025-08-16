import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function MyBookings() {
  const { userData } = useUser();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: bookings = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["my-bookings", userData?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/bookings/my/tourist?email=${userData?.email}`
      );
      return data;
    },
  });

  const handleCancel = async (id) => {
    toast("Cancel booking?", {
      description: "This tour reservation will be removed.",
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            await axiosSecure.delete(`/bookings/${id}`);
            toast.success("Booking cancelled.");
            refetch();
          } catch (error) {
            console.log(error);
            toast.error("Failed to cancel.");
          }
        },
      },
    });
  };

  const handlePay = (booking) => {
    navigate(`/dashboard/payment/${booking._id}`, { state: booking });
  };

  if (isLoading) return <p className="text-center py-8">Loading bookings...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-3xl font-bold text-primary text-center">
        My Tour Bookings
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="px-4 py-2">Package</th>
              <th className="px-4 py-2">Guide</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-t">
                <td className="px-4 py-2">{booking.packageName}</td>
                <td className="px-4 py-2">{booking.guideName}</td>
                <td className="px-4 py-2">
                  {new Date(booking.tourDate).toLocaleString("en-US", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </td>
                <td className="px-4 py-2">৳{booking.price}</td>
                <td className="px-4 py-2 capitalize">{booking.status}</td>
                <td className="px-4 py-2 space-x-2">
                  {booking.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => handlePay(booking)}>
                        Pay
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancel(booking._id)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                  {booking.status === "in-review" && (
                    <span className="text-muted-foreground">
                      Review in progress
                    </span>
                  )}
                  {booking.status === "accepted" && (
                    <span className="text-green-600 font-medium">Accepted</span>
                  )}
                  {booking.status === "rejected" && (
                    <span className="text-red-500 font-medium">Rejected</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
