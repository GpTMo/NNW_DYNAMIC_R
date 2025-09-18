import React, { useState, useEffect, useRef, useCallback } from 'react';
import { REPAIR_EXAMPLES } from '../constants';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  title: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after, title }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPos(percent);
  }, []);
  
  const handleInteraction = useCallback((clientX: number) => {
    if (isDragging.current) {
        handleMove(clientX);
    }
  }, [handleMove]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    handleInteraction(e.clientX);
  }, [handleInteraction]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    handleInteraction(e.touches[0].clientX);
  }, [handleInteraction]);

  const stopDragging = useCallback(() => {
    isDragging.current = false;
    setIsInteracting(false);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', stopDragging);
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', stopDragging);
  }, [handleMouseMove, handleTouchMove]);

  const startDragging = useCallback(() => {
    isDragging.current = true;
    setIsInteracting(true);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', stopDragging);
  }, [handleMouseMove, stopDragging, handleTouchMove]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
          setSliderPos(pos => Math.max(0, pos - 5));
      } else if (e.key === 'ArrowRight') {
          setSliderPos(pos => Math.min(100, pos + 5));
      }
  };


  return (
    <div 
        ref={containerRef} 
        className="relative w-full aspect-video rounded-lg overflow-hidden select-none cursor-ew-resize group bg-black/20"
        role="slider"
        aria-valuenow={Math.round(sliderPos)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Comparaison avant et après pour ${title}`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={(e) => {e.preventDefault(); startDragging();}}
        onTouchStart={startDragging}
    >
      <img 
          src={after} 
          alt={`Après réparation pour ${title}`} 
          className="absolute inset-0 w-full h-full object-cover" 
          draggable="false" 
      />
      <div className="absolute inset-0 w-full h-full object-cover" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
        <img 
            src={before} 
            alt={`Avant réparation pour ${title}`} 
            className="w-full h-full object-cover" 
            draggable="false"
        />
      </div>
       <div className="absolute top-2 left-2 px-2 py-1 text-xs uppercase tracking-widest bg-black/50 text-white/80 rounded-full backdrop-blur-sm z-10 pointer-events-none">Avant</div>
       <div className="absolute top-2 right-2 px-2 py-1 text-xs uppercase tracking-widest bg-black/50 text-white/80 rounded-full backdrop-blur-sm z-10 pointer-events-none">Après</div>
      <div
        className="absolute top-0 bottom-0 w-1 bg-white/50 cursor-ew-resize pointer-events-none"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        <div 
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center shadow-lg transition-transform duration-200 group-hover:scale-110 ${isInteracting ? 'scale-110 bg-white' : ''}`}
        >
          <svg className="w-6 h-6 text-black/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
          </svg>
        </div>
      </div>
    </div>
  );
};

const RepairWorkshop: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    
    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <section ref={sectionRef} className={`py-20 md:py-32 bg-[#050505]/95 backdrop-blur-sm transition-opacity duration-1000 ${isVisible ? 'animate-reveal' : 'opacity-0'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-[#F5EBE0]">
            Atelier de Réparation
          </h2>
          <p className="text-[#F5EBE0]/70 mt-4 max-w-2xl mx-auto">
            Nous redonnons vie à vos perruques. Faites glisser pour voir la transformation.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {REPAIR_EXAMPLES.map((example) => (
            <div key={example.id}>
              <h3 className="font-heading text-2xl text-center mb-4 text-[#C6905D]">{example.title}</h3>
              <BeforeAfterSlider before={example.beforeUrl} after={example.afterUrl} title={example.title} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RepairWorkshop;