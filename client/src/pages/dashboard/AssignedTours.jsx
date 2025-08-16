import useAxiosSecure from "@/hooks/useAxiosSecure";
import useUser from "@/hooks/useUser";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogFooter } from "@/components/ui/dialog";

export default function AssignedTours() {
  const axiosSecure = useAxiosSecure();
  const { userData } = useUser();
  const queryClient = useQueryClient();
  const [rejectingTour, setRejectingTour] = useState(null); // tour being rejected

  const { data: tours = [], isLoading } = useQuery({
    queryKey: ["assigned-tours", userData?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(
        `/bookings/my/guide?email=${userData?.email}`
      );
      return data;
    },
    staleTime: 0,
    cacheTime: 0,
    enabled: !!userData?.email,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      return await axiosSecure.patch(`/bookings/${id}/status`, { status });
    },
    onSuccess: () => {
      toast.success("Booking status updated");
      queryClient.invalidateQueries(["assigned-tours"]);
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const handleAccept = (tourId) => {
    updateStatus.mutate({ id: tourId, status: "accepted" });
  };

  const handleReject = () => {
    updateStatus.mutate({ id: rejectingTour._id, status: "rejected" });
    setRejectingTour(null);
  };

  if (isLoading)
    return <p className="text-center py-10">Loading assigned tours...</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-primary text-center mb-6">
        My Assigned Tours
      </h2>

      {tours.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No tours assigned yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-muted text-left">
              <tr>
                <th className="px-4 py-2">Package</th>
                <th className="px-4 py-2">Tourist</th>
                <th className="px-4 py-2">Tour Date</th>
                <th className="px-4 py-2">Price (৳)</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour._id} className="border-t">
                  <td className="px-4 py-2">{tour.packageName}</td>
                  <td className="px-4 py-2">{tour.touristName}</td>
                  <td className="px-4 py-2">
                    {new Date(tour.tourDate).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-2">{tour.price}</td>
                  <td className="px-4 py-2 capitalize">{tour.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={tour.status !== "in-review"}
                      onClick={() => handleAccept(tour._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={tour.status !== "pending"}
                      onClick={() => setRejectingTour(tour)}
                    >
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      <Dialog
        open={!!rejectingTour}
        onOpenChange={() => setRejectingTour(null)}
      >
        <DialogContent>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to reject the tour:{" "}
            <strong>{rejectingTour?.packageName}</strong>?
          </p>
          <DialogFooter className="pt-6">
            <Button variant="outline" onClick={() => setRejectingTour(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Confirm Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
