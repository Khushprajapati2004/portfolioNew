'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [displayedText, setDisplayedText] = useState('');
  const [showAuthor, setShowAuthor] = useState(false);
  const fullText = 'Welcome to the workspace of Khush Prajapati.';
  const author = 'Where creativity, code, and precision come together.';

  useEffect(() => {
    let currentIndex = 0;
    const typingSpeed = 50;
    const pauseBeforeAuthor = 500;
    const pauseBeforeFade = 1500;

    const typeText = () => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeText, typingSpeed);
      } else {
        setTimeout(() => {
          setShowAuthor(true);
          setTimeout(() => {
            onComplete();
          }, pauseBeforeFade);
        }, pauseBeforeAuthor);
      }
    };

    typeText();
  }, [onComplete]);

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-dark">
      {/* Animated background blobs - same as Hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Left gradient with </> icon */}
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 md:w-[600px] md:h-[600px] bg-neon-blue opacity-20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-32 left-10 md:top-40 md:left-20"
          initial={{ x: -200, opacity: 0 }}
          animate={{ 
            x: 0, 
            opacity: 1,
            y: [0, -20, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            x: { duration: 1, ease: "easeOut" },
            opacity: { duration: 1, ease: "easeOut" },
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            },
            rotate: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }
          }}
        >
          <svg className="w-24 h-24 md:w-32 md:h-32 text-neon-blue opacity-30" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 8.5L4 12l4.5 3.5M15.5 8.5L20 12l-4.5 3.5M13 4l-2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </motion.div>
        

        {/* Right gradient with terminal icon */}
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 md:w-[600px] md:h-[600px] bg-neon-purple opacity-20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-32 right-10 md:bottom-40 md:right-20"
          initial={{ x: 200, opacity: 0 }}
          animate={{
            x: 0,
            opacity: 1,
            y: [0, 20, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            x: { duration: 1, ease: "easeOut" },
            opacity: { duration: 1, ease: "easeOut" },
            y: {
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            },
            rotate: {
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }
          }}
        >
          <svg className="w-24 h-24 md:w-32 md:h-32 text-neon-purple opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </motion.div>

        {/* Center gradient */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[500px] md:h-[500px] bg-neon-cyan opacity-10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Text content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="space-y-8">
          {/* Logo with KP */}
          <motion.div
            className="flex items-center justify-center gap-4 md:gap-6 mb-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.img
              src="/icon.svg"
              alt="Logo"
              className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.h1
              className="text-6xl md:text-8xl lg:text-7xl font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-transparent animate-gradient">
                KP
              </span>
            </motion.h1>
          </motion.div>

          <p className="text-3xl md:text-5xl lg:text-6xl font-light leading-relaxed">
            <span className="bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-transparent animate-gradient">
              {displayedText}
            </span>
            <span className="inline-block w-1 h-8 md:h-12 bg-gradient-to-b from-neon-blue to-neon-cyan ml-1 animate-pulse"></span>
          </p>
          
          {showAuthor && (
            <motion.p 
              className="text-xl md:text-3xl font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue bg-clip-text text-transparent animate-gradient">
                {author}
              </span>
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
