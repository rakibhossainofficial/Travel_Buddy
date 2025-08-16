import { useSearchParams, useNavigate } from "react-router";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { toast } from "sonner";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { userData } = useUser();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        // Fetch booking
        const { data: booking } = await axiosSecure.get(
          `/bookings/${bookingId}`
        );

        const transactionId = `TXN-${Date.now()}`;
        const amount = booking.price; // ✅ Actual price from DB

        // Save payment record
        await axiosSecure.post("/payments", {
          bookingId,
          transactionId,
          amount,
        });

        toast.success("Payment confirmed!");
        setShowConfetti(true);

        setTimeout(() => {
          navigate("/dashboard/bookings");
        }, 5000);
      } catch (err) {
        console.error("Payment save error:", err.message);
        toast.error("Failed to record payment");
      }
    };

    if (bookingId) confirmPayment();
  }, [bookingId, axiosSecure, navigate]);

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      {showConfetti && <Confetti />}
      <h2 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h2>
      <p className="text-muted-foreground text-center max-w-md">
        Thank you, {userData?.name}! Your booking is now under review. We’ll
        notify you once your tour guide accepts the trip.
      </p>
      <Button onClick={() => navigate("/dashboard/bookings")}>
        Go to My Bookings
      </Button>
    </div>
  );
}
