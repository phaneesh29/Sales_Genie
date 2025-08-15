import React from "react";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
    <div className="bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
        <h1 className="text-2xl font-bold text-red-600">Saarathi<span className="text-blue-600">Lead</span></h1>
        <div className="space-x-6">
          <Link to="/admin/login" className="text-gray-700 hover:text-blue-600 font-medium">
            Admin Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-blue-50 to-red-50 pt-20">
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-red-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to <span className="text-blue-600">SaarathiLead</span>
        </motion.h1>
        <motion.p
          className="mt-4 max-w-xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          The ultimate lead management console — track, analyze, and scale your business effortlessly.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="mt-8"
        >
          <Link
            to="/admin/dashboard"
            className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-red-600 transition"
          >
            Go to Dashboard
          </Link>
        </motion.div>
      </section>

      {/* Carousel Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-8 text-black">Admin Console Highlights</h2>
          <Slider {...sliderSettings}>
            <div className="p-4">
              <img
                src="https://picsum.photos/1600/900"
                alt="Analytics"
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="p-4">
              <img
                src="https://picsum.photos/1600/900"
                alt="Lead Tracking"
                className="rounded-xl shadow-lg"
              />
            </div>
            <div className="p-4">
              <img
                src="https://picsum.photos/1600/900"
                alt="Performance Insights"
                className="rounded-xl shadow-lg"
              />
            </div>
          </Slider>
        </div>
      </section>

      {/* Call to Action - Documentation */}
      <section className="py-20 bg-gradient-to-r from-blue-500 to-red-500 text-white text-center">
        <h2 className="text-4xl font-bold">Need Help Using SaarathiLead?</h2>
        <p className="mt-4 max-w-xl mx-auto">
          Access our admin documentation to get started quickly and efficiently.
        </p>
        <a
          href="/docs"
          className="mt-8 inline-block px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-white hover:text-black transition"
        >
          View Documentation
        </a>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-black text-white text-center">
        <p>&copy; {new Date().getFullYear()} SaarathiLead. All rights reserved.</p>
      </footer>
    </div>
  );
}
