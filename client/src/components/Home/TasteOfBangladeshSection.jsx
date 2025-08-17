import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const foodItems = [
  {
    name: "Shutki Bhuna",
    region: "Chittagong Hill Tracts",
    image:
      "https://thumbs.dreamstime.com/b/loitta-shutki-bhuna-loitka-sutki-korma-karahi-served-dish-isolated-background-top-view-bangladesh-food-288299454.jpg?w=768",
    description:
      "A spicy blend of dried fish, garlic, and native chilies—best served with plain rice.",
  },
  {
    name: "Mezban Beef",
    region: "Chattogram",
    image:
      "https://thumbs.dreamstime.com/b/beef-mezbani-gosht-korma-karahi-served-dish-isolated-wooden-background-top-view-indian-spices-bangladeshi-pakistani-food-310154648.jpg?w=768",
    description:
      "A rich, festive beef dish traditionally served in community feasts and celebrations.",
  },
];

export default function TasteOfBangladeshSection() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      <motion.h2
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold text-primary text-center"
      >
        Taste of Bangladesh
      </motion.h2>

      <motion.div  nitial="hidden" whileInView="show" viewport={{ once: true }}
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
        {foodItems.map((food, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="">
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-56 object-cover bg-center rounded mb-2"
                />
                <h3 className="text-xl font-semibold">{food.name}</h3>
                <p className="text-muted-foreground text-sm">{food.region}</p>
                <p className="text-sm">{food.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
