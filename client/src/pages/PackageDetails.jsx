import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Button } from "@/components/ui/button";

export default function PackageDetails() {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const { data: pkg, isLoading } = useQuery({
    queryKey: ["package", id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/packages/${id}`);
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <p className="text-center py-10">Loading package...</p>;

  if (!pkg) return <p className="text-center py-10">Package not found</p>;

  const handleBookNow = () => {
    navigate(`/dashboard/book/${pkg._id}`, { state: pkg });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-3xl font-bold text-primary text-center">
        {pkg.title}
      </h2>

      {/* Gallery */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {pkg.images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`img-${i}`}
            className="rounded-md h-48 object-cover w-full"
          />
        ))}
      </div>

      {/* Tour Details */}
      <div className="space-y-2">
        <p>
          <strong>Tour Type:</strong> {pkg.tourType}
        </p>
        <p>
          <strong>Price:</strong> ৳{pkg.price}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(pkg.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Itinerary */}
      <div>
        <h4 className="text-xl font-semibold text-primary mt-6 mb-2">
          Tour Plan
        </h4>
        <div className="bg-muted rounded p-4 whitespace-pre-wrap">
          {pkg.itinerary}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Button size="lg" onClick={handleBookNow}>
          Book Now
        </Button>
      </div>
    </div>
  );
}
