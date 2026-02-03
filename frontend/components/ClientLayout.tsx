'use client';

import { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Check if user has already seen the loading screen in this session
    const hasSeenLoading = sessionStorage.getItem('hasSeenLoading');
    
    if (hasSeenLoading) {
      setIsLoading(false);
      setShowContent(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasSeenLoading', 'true');
    // Start fade out of loading screen
    setTimeout(() => {
      setIsLoading(false);
      // Show content after loading screen fades
      setTimeout(() => {
        setShowContent(true);
      }, 800);
    }, 100);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <LoadingScreen onComplete={handleLoadingComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeInOut", delay: showContent ? 0.2 : 0 }}
      >
        {children}
      </motion.div>
    </>
  );
}
