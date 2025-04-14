'use client'; // Required for Framer Motion

import Link from "next/link";
import { ArrowRightIcon, ArrowUpTrayIcon, MapIcon, GlobeAltIcon, PuzzlePieceIcon, UserGroupIcon, BookOpenIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8 }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

export default function Home() {
  // Reference for the hero section
  const heroRef = useRef(null);
  
  // State to track if this is the first load animation
  const [hasAnimated, setHasAnimated] = useState(true); // Default to true to prevent flash
  
  // Check if this is the first visit when component mounts
  useEffect(() => {
    // Check localStorage on client side only
    const hasVisitedBefore = localStorage.getItem('ww_visited');
    setHasAnimated(!!hasVisitedBefore);
    
    // Set the flag that user has visited
    localStorage.setItem('ww_visited', 'true');
  }, []);
  
  // Track scroll position for parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  // Subtle parallax scroll effect - background moves slower than foreground
  const translateY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  
  // Animation sequence variants
  const initialAnimationSequence = {
    // Logo appears first
    logoInitial: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { 
        opacity: 1, 
        scale: 1,
        transition: { 
          duration: 1.2,
          ease: "easeOut" 
        }
      }
    },
    // Then subtitle fades in
    subtitleInitial: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          duration: 0.8,
          delay: 1.2 
        }
      }
    },
    // Finally button appears
    buttonInitial: {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { 
          duration: 0.5,
          delay: 1.8 
        }
      }
    }
  };
  
  return (
    <main className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section with parallax scroll */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background image with parallax effect */}
        <motion.div 
          className="absolute inset-0 w-full h-full"
          style={{ 
            y: translateY,
            backgroundImage: "url('/map-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-emerald-900/60 z-10"></div>
        
        <motion.div 
          className="relative z-20 max-w-4xl px-6 text-center text-white"
          initial="hidden"
          animate="visible"
          variants={hasAnimated ? staggerContainer : undefined}
        >
          <motion.h1 
            className="text-7xl md:text-8xl font-bold logo-text tracking-wide"
            variants={hasAnimated ? fadeIn : initialAnimationSequence.logoInitial}
            initial="hidden"
            animate="visible"
          >
            WORLD
            <br />
            WEAVER
          </motion.h1>
          
          <motion.p 
            className="mt-6 text-xl md:text-2xl font-medium text-gray-100 max-w-2xl mx-auto"
            variants={hasAnimated ? fadeInUp : initialAnimationSequence.subtitleInitial}
            initial="hidden"
            animate="visible"
          >
            craft your world. weave your quests.
          </motion.p>
          
          <motion.div 
            className="mt-12"
            variants={hasAnimated ? fadeInUp : initialAnimationSequence.buttonInitial}
            initial="hidden"
            animate="visible"
          >
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-lg py-4 px-10 rounded-lg shadow-lg transition-all duration-300 hover:shadow-emerald-500/20 hover:shadow-xl"
            >
              Start
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: hasAnimated ? 1 : 0, y: [0, 10, 0] }}
          transition={{ 
            opacity: { delay: hasAnimated ? 0 : 2.3, duration: 0.5 },
            y: { duration: 2, repeat: Infinity, delay: hasAnimated ? 1 : 2.5 } 
          }}
        >
          <svg className="w-6 h-12" viewBox="0 0 24 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="0" width="8" height="24" rx="4" stroke="white" strokeWidth="2" />
            <circle className="animate-bounce" cx="12" cy="8" r="3" fill="white" />
            <path d="M12 32L5 25H19L12 32Z" fill="white" />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              From Map to Adventure
            </h2>
          </motion.div>
          
          {/* Feature Cards - 3 across */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {/* Feature 1 */}
            <motion.div
              className="p-8 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600">
                <ArrowUpTrayIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Maps</h3>
              <p className="text-gray-600">
                Upload your world map.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="p-8 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600">
                <GlobeAltIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Assets</h3>
              <p className="text-gray-600">
                Add characters, items, locations.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="p-8 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600">
                <PuzzlePieceIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Quests</h3>
              <p className="text-gray-600">
                Design adventures and stories.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div 
            className="max-w-3xl mx-auto text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Perfect For
            </h2>
          </motion.div>
          
          {/* Use Cases */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            {/* Use Case 1 */}
            <motion.div
              className="p-8 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600">
                <UserGroupIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Game Masters</h3>
              <p className="text-gray-600">
                Track campaign events and NPCs.
              </p>
            </motion.div>
            
            {/* Use Case 2 */}
            <motion.div
              className="p-8 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600">
                <BookOpenIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Worldbuilders</h3>
              <p className="text-gray-600">
                Organize your fantasy universe.
              </p>
            </motion.div>
            
            {/* Use Case 3 */}
            <motion.div
              className="p-8 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              variants={fadeInUp}
              whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
            >
              <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 text-emerald-600">
                <SparklesIcon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Storytellers</h3>
              <p className="text-gray-600">
                Plan narrative arcs and hooks.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section with background */}
      <section className="py-16 bg-emerald-600 text-white">
         <div className="container mx-auto px-6 lg:px-8">
           <motion.div 
             className="max-w-3xl mx-auto text-center"
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.3 }}
             variants={staggerContainer}
           >
             <motion.h2 
               className="text-3xl md:text-4xl font-bold mb-6"
               variants={fadeInUp}
             >
               Begin Your Adventure
             </motion.h2>
             <motion.div variants={fadeInUp}>
               <Link
                 href="/upload"
                 className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-emerald-700 font-semibold text-lg py-4 px-10 rounded-lg shadow-lg transition-all duration-300 hover:shadow-emerald-900/20 hover:shadow-xl"
               >
                 Start
                 <ArrowRightIcon className="h-5 w-5" />
               </Link>
             </motion.div>
           </motion.div>
         </div>
      </section>
    </main>
  );
}
