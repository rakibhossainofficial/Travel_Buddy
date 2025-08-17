import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const hiddenSpots = [
  {
    id: 1,
    title: "Ratargul Swamp Forest",
    location: "Sylhet Division",
    image: "https://images.pexels.com/photos/927745/pexels-photo-927745.jpeg",
    description:
      "Explore the only swamp forest in Bangladesh, home to serene canals and rare biodiversity.",
    bestTimeToVisit: "June – September",
    entryFee: "50 BDT per person",
    openingHours: "9 AM – 5 PM",
    activities: ["Boat ride", "Photography", "Bird watching"],
    travelTips: "Bring a raincoat during monsoon; best explored by boat.",
    coordinates: { lat: 25.0094, lng: 91.942 },
    nearbyAttractions: ["Jaflong", "Bisnakandi"],
    facilities: ["Parking", "Boat rental", "Local guides"],
    map:"https://maps.app.goo.gl/D4RxmHQDHrwyUTPS8",

  },
  {
    id: 2,
    title: "Niladri Lake",
    location: "Sunamganj",
    image:
      "https://images.pexels.com/photos/33220017/pexels-photo-33220017.jpeg",
    description:
      "Crystal-blue waters surrounded by lush hills—one of the most underrated retreats.",
    bestTimeToVisit: "October – March",
    entryFee: "Free",
    openingHours: "Open 24 hours",
    activities: ["Swimming", "Camping", "Picnic"],
    travelTips: "Avoid weekends if you prefer peace; carry drinking water.",
    coordinates: { lat: 25.0305, lng: 91.3967 },
    nearbyAttractions: ["Tanguar Haor", "Jadukata River"],
    facilities: ["Parking", "Food stalls", "Rest areas"],
    map:"https://maps.app.goo.gl/H3NT7hMwyg3XDoEFA",
  },
  {
    id: 3,
    title: "Cox's Bazar Sea Beach",
    location: "Chattogram Division",
    image: "https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg",
    description:
      "World’s longest natural sandy sea beach, stretching over 120 km along the Bay of Bengal.",
    bestTimeToVisit: "November – March",
    entryFee: "Free",
    openingHours: "Open 24 hours",
    activities: ["Beach walk", "Sea bathing", "Surfing", "Sunset watching"],
    travelTips:
      "Book hotels early during peak season; carry sunscreen and light clothes.",
    coordinates: { lat: 21.4272, lng: 92.0058 },
    nearbyAttractions: [
      "Himchari National Park",
      "Inani Beach",
      "Saint Martin’s Island",
    ],
    facilities: ["Hotels", "Restaurants", "Transportation services"],
    map:"https://maps.app.goo.gl/8Qug49hsUdkifugG7",
  },
];

export default function HiddenGemsSection() {
  const [open, setOpen] = useState(false);
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold text-primary text-center"
      >
        Hidden Gems of Bangladesh
      </motion.h2>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {hiddenSpots.map((spot, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            {/* Card */}
            <div className="space-y-3 border rounded-lg p-5 min-h-[460px] shadow-sm">
              <img
                src={spot.image}
                alt={spot.title}
                className="w-full h-56 object-cover rounded"
              />
              <h3 className="text-xl font-semibold">{spot.title}</h3>
              <p className="text-muted-foreground text-sm">{spot.location}</p>
              <p className="text-sm">{spot.description}</p>
              <Button size="sm" variant="outline" onClick={() => setOpen(true)}>
                Explore More
              </Button>
            </div>

            {/* Modal */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">
                    {spot.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Image */}
                  <img
                    src={spot.image}
                    alt={spot.title}
                    className="w-full h-60 object-cover rounded"
                  />

                  {/* Location */}
                  <p className="text-muted-foreground text-sm text-right">
                    {spot.location}
                  </p>

                  {/* Description */}
                  <p>{spot.description}</p>

                  {/* Details */}
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Best Time To Visit:</strong>{" "}
                      {spot.bestTimeToVisit}
                    </p>
                    <p>
                      <strong>Entry Fee:</strong> {spot.entryFee}
                    </p>
                    <p>
                      <strong>Opening Hours:</strong> {spot.openingHours}
                    </p>
                    <p>
                      <strong>Travel Tips:</strong> {spot.travelTips}
                    </p>
                  </div>

                  {/* Facilities */}
                  <div>
                    <p className="font-semibold">Facilities:</p>
                    <ul className="flex gap-6 mt-1 text-sm">
                      {spot.facilities?.map((f, i) => (
                        <li key={i} className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-black rounded-full"></span>{" "}
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Map link */}
                  <p>
                     <span className="font-bold">Map Location: </span>
                     <a className="hover:underline" target="_blank" href={spot.map}>Click Here</a>
                    </p>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
