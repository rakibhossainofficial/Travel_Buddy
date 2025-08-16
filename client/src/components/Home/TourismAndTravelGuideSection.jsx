import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router";

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [0, -8, 0],
    transition: {
      repeat: Infinity,
      duration: 3,
      ease: "easeInOut",
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function TourismAndTravelGuideSection() {
  const axiosSecure = useAxiosSecure();

  const { data: packages = [] } = useQuery({
    queryKey: ["random-packages"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/package/random");
      return data;
    },
  });

  const { data: guides = [] } = useQuery({
    queryKey: ["random-guides"],
    queryFn: async () => {
      const { data } = await axiosSecure.get("/guides/random");
      return data;
    },
  });

  return (
    <section className="max-w-6xl mx-auto px-4 py-14 overflow-hidden">
      <h2 className="text-3xl font-bold text-center text-primary mb-8">
        Tourism and Travel Guide
      </h2>

      <Tabs defaultValue="packages" className="space-y-10 w-full max-w-7xl">
        <TabsList className="flex justify-center gap-6">
          <TabsTrigger value="packages">Our Packages</TabsTrigger>
          <TabsTrigger value="guides">Meet Our Tour Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="packages">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6"
          >
            {packages.map((pkg) => (
              <motion.div key={pkg._id} variants={cardVariants}>
                <motion.div
                  variants={floatVariants}
                  initial="initial"
                  animate="animate"
                >
                  <Card>
                    <CardContent className="space-y-3 p-4">
                      <img
                        src={pkg.images?.[0]}
                        alt={pkg.title}
                        className="w-full h-40 object-cover rounded"
                      />
                      <h3 className="font-semibold text-lg">{pkg.title}</h3>
                      <p className="text-muted-foreground">{pkg.category}</p>
                      <p className="text-primary font-medium">৳ {pkg.price}</p>
                      <Link to={`/package/${pkg?._id}`}>
                        <Button size="sm">View Package</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>

        <TabsContent value="guides">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6"
          >
            {guides.map((g) => (
              <motion.div key={g._id} variants={cardVariants}>
                <motion.div
                  variants={floatVariants}
                  initial="initial"
                  animate="animate"
                >
                  <Card>
                    <CardContent className="space-y-3 p-4 text-center">
                      <img
                        src={g.image}
                        alt={g.name}
                        className="w-20 h-20 mx-auto rounded-full object-cover"
                      />
                      <h4 className="font-semibold">{g.name}</h4>
                      <p className="text-muted-foreground text-sm">
                        {g.specialty}
                      </p>
                      <Link to={`/guides-profile/${g._id}`}>
                        <Button size="sm">Details</Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </section>
  );
}
