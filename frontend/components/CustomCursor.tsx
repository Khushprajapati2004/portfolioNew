'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const ringPositionRef = useRef({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorRing = cursorRingRef.current;
    
    if (!cursorDot || !cursorRing) return;

    let mouseX = 0;
    let mouseY = 0;

    // Update mouse position
    const updateMousePosition = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update dot immediately for instant response
      cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    // Smooth ring animation using RAF
    const animateRing = () => {
      // Lerp (linear interpolation) for smooth following
      const speed = 0.15;
      ringPositionRef.current.x += (mouseX - ringPositionRef.current.x) * speed;
      ringPositionRef.current.y += (mouseY - ringPositionRef.current.y) * speed;
      
      cursorRing.style.transform = `translate(${ringPositionRef.current.x}px, ${ringPositionRef.current.y}px)`;
      requestAnimationFrame(animateRing);
    };

    // Check if element is clickable
    const updateCursorType = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.onclick !== null ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';
      
      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', updateCursorType);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Start animation loop
    const rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', updateCursorType);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Main cursor dot - instant follow */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-transform duration-150"
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      >
        <div 
          className={`rounded-full bg-white transition-all duration-200 ${
            isPointer ? 'w-2 h-2' : 'w-3 h-3'
          }`}
        />
      </div>

      {/* Outer cursor ring - smooth follow */}
      <div
        ref={cursorRingRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: 'translate(-50%, -50%)',
          willChange: 'transform',
        }}
      >
        <div 
          className={`rounded-full border-2 border-neon-blue transition-all duration-300 ${
            isPointer 
              ? 'w-14 h-14 opacity-60 bg-neon-blue/10' 
              : 'w-10 h-10 opacity-40'
          }`}
        />
      </div>

      {/* Glow effect on hover */}
      {isPointer && (
        <div
          className="fixed top-0 left-0 pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
          style={{
            transform: `translate(${ringPositionRef.current.x}px, ${ringPositionRef.current.y}px) translate(-50%, -50%)`,
            willChange: 'transform',
          }}
        >
          <div className="w-16 h-16 bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple rounded-full blur-xl opacity-30" />
        </div>
      )}
    </>
  );
}
