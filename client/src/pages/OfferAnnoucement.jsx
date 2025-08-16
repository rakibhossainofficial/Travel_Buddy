import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fakeAnnouncements = [
  {
    _id: "1",
    title: "Explore Cox’s Bazar in Monsoon",
    description:
      "Book now and get 25% off on all packages to Cox’s Bazar until August 31!",
    type: "Discount",
    date: "2025-07-24",
  },
  {
    _id: "2",
    title: "Free Cultural Tour",
    description:
      "Get a free cultural walk tour with any booking to Sylhet this September.",
    type: "Bonus",
    date: "2025-07-23",
  },
  {
    _id: "3",
    title: "Flash Deal: Sundarbans Safari",
    description:
      "Limited time offer! First 50 bookings get a boat upgrade for free.",
    type: "Limited-Time",
    date: "2025-07-22",
  },
];

export default function OfferAnnouncements() {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    // Fake fetch
    setTimeout(() => setOffers(fakeAnnouncements), 1000);
  }, []);

  const handleDelete = (id) => {
    toast({
      title: "Delete Confirmation",
      description: "Click to confirm deleting this offer.",
      action: (
        <Button
          variant="destructive"
          onClick={() => {
            setOffers((prev) => prev.filter((o) => o._id !== id));
            toast({
              title: "Offer Deleted",
              description: "This offer has been successfully removed.",
            });
          }}
        >
          Confirm Delete
        </Button>
      ),
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-primary text-center">
        📢 Offer Announcements
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer, i) => (
          <motion.div
            key={offer._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="shadow-md border">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge>{offer.type}</Badge>
                  <p className="text-xs text-muted-foreground">{offer.date}</p>
                </div>
                <h3 className="font-semibold text-lg">{offer.title}</h3>
                <p className="text-sm">{offer.description}</p>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(offer._id)}
                >
                  Delete Offer
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
