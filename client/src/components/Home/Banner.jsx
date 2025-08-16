
// Banner.jsx
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Banner() {
    const slides = [
        {
            title: "Discover the Magic of Bangladesh 🇧🇩",
            subtitle: "Explore iconic landmarks and cultural heritage",
            image: "https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            title: "Adventure Awaits in the Hills ⛰️",
            subtitle: "From Bandarban peaks to Sylhet tea gardens",
            image: "https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        },
        {
            title: "Sunset by the Bay 🌅",
            subtitle: "Relax on the shores of Cox's Bazar",
            image: "https://images.unsplash.com/photo-1516298773066-c48f8e9bd92b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
                <div className="absolute inset-0 bg-black/60 z-0" />

                {slides.map((slide, i) => (
                    <SwiperSlide key={i}>
                        <div
                            className="h-full  bg-cover bg-center flex items-center justify-center text-white"
                            style={{
                                backgroundImage: `url(${slide.image})`,
                            }}
                        >
                            <div className=" p-6 rounded-md text-center max-w-2xl">
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
