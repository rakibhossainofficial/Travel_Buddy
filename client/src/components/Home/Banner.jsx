// Banner.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Banner() {
  const slides = [
    {
      title: "Discover the Magic of Bangladesh",
      subtitle: "Explore iconic landmarks and cultural heritage",
      image: "https://i.ibb.co/cKYkLvnq/landmark-bangladesh.jpg",
    },
    {
      title: "Adventure Awaits in the Hills",
      subtitle: "From Bandarban peaks to Sylhet tea gardens",
      image: "https://i.ibb.co/yn8ft3CZ/Shylet-tea-garden.jpg",
    },
    {
      title: "Sunset by the Bay",
      subtitle: "Relax on the shores of Cox's Bazar",
      image: "https://i.ibb.co/yF27p36d/Coxs-Bazar-sunset1.jpg",
    },
  ];

  return (
    <section className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop={true}
        className="w-full h-[500px]"
      >
        {/* Black overlay */}
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="h-full bg-cover bg-center flex items-center justify-center text-white relative"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* Dark overlay behind text */}
              <div className="absolute inset-0 bg-black/50 z-0"></div>

              {/* Content (z-10 ensures text is above the overlay) */}
              <div className="relative z-10 p-6 rounded-md text-center max-w-3xl">
                <h2 className="text-4xl font-bold mb-2">{slide.title}</h2>
                <p className="text-lg text-gray-200">{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
