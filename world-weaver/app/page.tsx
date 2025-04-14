'use client'; // Required for Framer Motion

import Link from "next/link";
import { ArrowRightIcon, ArrowUpTrayIcon, MapIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

// Animation variants for feature cards
const featureVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center h-[70vh] bg-[url('/map-bg.jpg')] bg-cover bg-center bg-gray-800 bg-blend-multiply text-white text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-7xl md:text-8xl font-bold logo-text tracking-wide">
            WORLD
            <br />
            WEAVER
          </h1>
          <p className="mt-4 text-xl md:text-2xl font-medium" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
            Craft immersive worlds from your map data. Effortlessly.
          </p>
          <div className="mt-12">
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-lg py-3 px-10 shadow-lg square-button transition-colors duration-300"
            >
              Get Started
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-12">
            Bring Your Maps to Life
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Feature 1: Upload */}
            <motion.div
              className="p-8 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={featureVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="mb-4 inline-block p-3 bg-emerald-100 rounded-full">
                 <ArrowUpTrayIcon className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Upload Your Map Data</h3>
              <p className="text-gray-600">
                Easily upload your map images or data files. We support various formats to get you started quickly.
              </p>
            </motion.div>

            {/* Feature 2: Create/Visualize */}
            <motion.div
              className="p-8 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={featureVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="mb-4 inline-block p-3 bg-blue-100 rounded-full">
                 <MapIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-3">Generate & Explore Your World</h3>
              <p className="text-gray-600">
                Transform your data into interactive maps. Explore regions, add details, and visualize your creation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gray-50">
         <div className="container mx-auto px-6 lg:px-8 text-center">
           <h2 className="text-3xl font-semibold text-gray-800 mb-6">Ready to Weave Your World?</h2>
           <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
             Start by uploading your map data and let World Weaver guide you through the creation process.
           </p>
           <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-lg py-3 px-10 shadow-lg square-button transition-colors duration-300"
            >
              Upload Map Now
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
         </div>
      </section>

    </main>
  );
}
