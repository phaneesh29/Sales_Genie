import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function LandingPage() {
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="bg-white text-black font-sans">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-blue-50 to-red-50">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-red-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to <span className="text-blue-600">Your Brand</span>
        </motion.h1>
        <motion.p
          className="mt-4 max-w-xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Modern, eye-catching, and lightning fast — your one-stop solution for premium experiences.
        </motion.p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="mt-8 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-red-600 transition"
        >
          Get Started
        </motion.button>
      </section>

      {/* Carousel Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">Our Features</h2>
          <Slider {...sliderSettings}>
            <div className="p-4">
              <img
                src="https://picsum.photos/1600/900"
                alt="Tech"
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="p-4">
              <img
                src="https://picsum.photos/1600/900"
                alt="Startup"
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="p-4">
              <img
                src="https://picsum.photos/1600/900"
                alt="Innovation"
                className="rounded-xl shadow-lg"
              />
            </div>
          </Slider>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-blue-500 text-white text-center">
        <h2 className="text-4xl font-bold">Ready to Get Started?</h2>
        <p className="mt-4 max-w-xl mx-auto">
          Join thousands of others who are already loving our service.
        </p>
        <button className="mt-8 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-white hover:text-black transition">
          Sign Up Now
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-black text-white text-center">
        <p>&copy; {new Date().getFullYear()} Your Brand. All rights reserved.</p>
      </footer>
    </div>
  );
}
