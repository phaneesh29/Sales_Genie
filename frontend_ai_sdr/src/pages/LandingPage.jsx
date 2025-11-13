// LandingPage.jsx
import React from "react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 shadow">
        <h1 className="text-2xl font-bold text-indigo-600">JeetCRM</h1>
        <div className="space-x-4">
          <a
            href="/admin/login"
            className="text-gray-600 hover:text-indigo-600 font-medium"
          >
            Admin Login
          </a>
          <a
            href="/admin/dashboard"
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Go to Dashboard
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center py-20 px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Manage Your Leads Effortlessly 🚀
        </motion.h2>
        <p className="mt-4 text-lg max-w-2xl text-gray-600">
          JeetCRM gives you the power to track, manage, and close leads
          faster — all in one place.
        </p>
        <div className="mt-8 space-x-4">
          <a
            href="/admin/login"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Admin Login
          </a>
          <a
            href="/admin/dashboard"
            className="px-6 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50"
          >
            Go to Dashboard
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Centralized Dashboard",
              desc: "Get all your lead data in one clean and intuitive interface.",
            },
            {
              title: "Smart Insights",
              desc: "Identify high-value leads instantly with AI-powered scoring.",
            },
            {
              title: "Fast Follow-ups",
              desc: "Never miss an opportunity with quick action tools.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                {f.title}
              </h3>
              <p className="text-gray-600">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Start Managing Your Leads Today
        </h2>
        <p className="mt-4 text-gray-600">
          Log in now and take control of your sales pipeline.
        </p>
        <a
          href="/admin/dashboard"
          className="mt-6 inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go to Dashboard
        </a>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-100 text-center text-gray-500">
        © {new Date().getFullYear()} JeetCRM. All rights reserved. |{" "}
        <a href="/admin/login" className="text-indigo-600 hover:underline">
          Admin Login
        </a>
      </footer>
    </div>
  );
}
