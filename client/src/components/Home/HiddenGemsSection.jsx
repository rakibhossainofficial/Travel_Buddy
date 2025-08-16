import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const hiddenSpots = [
  {
    title: "Ratargul Swamp Forest",
    location: "Sylhet Division",
    image: "https://images.pexels.com/photos/927745/pexels-photo-927745.jpeg",
    description:
      "Explore the only swamp forest in Bangladesh, home to serene canals and rare biodiversity.",
  },
  {
    title: "Niladri Lake",
    location: "Sunamganj",
    image:
      "https://images.pexels.com/photos/33220017/pexels-photo-33220017.jpeg",
    description:
      "Crystal-blue waters surrounded by lush hills—one of the most underrated retreats.",
  },
];

export default function HiddenGemsSection() {
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
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
            <Card>
              <CardContent className="p-4 space-y-3">
                <img
                  src={spot.image}
                  alt={spot.title}
                  className="w-full h-56 object-cover rounded"
                />
                <h3 className="text-xl font-semibold">{spot.title}</h3>
                <p className="text-muted-foreground text-sm">{spot.location}</p>
                <p className="text-sm">{spot.description}</p>
                <Button size="sm" variant="outline">
                  Explore More
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
