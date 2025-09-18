import React from 'react';
import { useMouseInertia } from '../hooks/useMouseInertia';

interface HeroProps {
  onBookingClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBookingClick }) => {
  const { x, y } = useMouseInertia();

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      <div 
          className="absolute inset-0 z-10 text-center flex flex-col items-center justify-center"
          // Add padding to ensure content doesn't hit edges on small screens
          style={{ padding: '1rem' }} 
      >
        <h1 
          className="font-heading text-5xl md:text-8xl font-light text-[#F5EBE0] mb-4 animate-hero-logo"
          style={{ transform: `translate3d(${x * 0.03}px, ${y * 0.03}px, 0)` }}
        >
          L'Art de la Transformation
        </h1>
        <p 
          className="max-w-xl mx-auto text-[#F5EBE0]/70 mb-8 text-lg animate-hero-p"
          style={{ transform: `translate3d(${x * 0.05}px, ${y * 0.05}px, 0)` }}
        >
          Découvrez des créations sur mesure qui révèlent votre beauté unique.
        </p>
        <button
          onClick={onBookingClick}
          className="px-8 py-3 text-base uppercase tracking-wider font-semibold bg-[#C6905D] text-black rounded-full hover:bg-[#F5EBE0] transition-all duration-300 transform hover:scale-105 animate-hero-button"
          style={{ transform: `translate3d(${x * 0.06}px, ${y * 0.06}px, 0)` }}
        >
          Prendre Rendez-vous
        </button>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-neutral-500 animate-bounce z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;