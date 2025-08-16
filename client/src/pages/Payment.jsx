import { useLocation } from "react-router";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useEffect } from "react";

export default function PaymentPage() {
  const { state } = useLocation();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const handleStripe = async () => {
      try {
        const { data } = await axiosSecure.post("/create-payment", {
          bookingId: state._id,
          packageName: state.packageName,
          price: state.price,
          touristEmail: state.touristEmail,
        });

        window.location.href = data.url; // Redirect to Stripe
      } catch (err) {
        console.error(err);
      }
    };

    if (state) handleStripe();
  }, [state, axiosSecure]);

  return <p className="text-center py-10">Redirecting to payment...</p>;
}
