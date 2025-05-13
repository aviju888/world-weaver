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
        
      </section>

      {/* TODO: tutorial page for new users */}

    </main>
  );
}
