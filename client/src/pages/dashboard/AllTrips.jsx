import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Link } from "react-router";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AllTrips() {
  const axiosSecure = useAxiosSecure();

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["all-packages"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/packages");
      return data;
    },
  });

  if (isLoading) {
    return <p className="text-center py-10">Loading available trips...</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-3xl font-bold text-primary text-center">
        Explore All Tour Packages
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg._id}>
            <CardHeader>
              <img
                src={pkg.images?.[0]}
                alt={pkg.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <CardTitle>{pkg.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {pkg.tourType} · ৳{pkg.price}
              </p>
              <Link to={`/package/${pkg._id}`}>
                <Button size="sm" className="w-full">
                  View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
