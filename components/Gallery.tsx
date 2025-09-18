import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WIGS } from '../constants';
import type { Wig } from '../types';

interface GalleryProps {
  onTryOnRequest: (wig: Wig) => void;
}

const WigDetailModal: React.FC<{ wig: Wig; onClose: () => void; onTryOnClick: () => void; }> = ({ wig, onClose, onTryOnClick }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-[#050505] rounded-lg max-w-4xl w-11/12 max-h-[90vh] flex flex-col md:flex-row overflow-hidden border border-[#C6905D]/20"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="md:w-1/2 w-full h-64 md:h-auto bg-black/20">
                    <img 
                        src={wig.imageUrl} 
                        alt={wig.name} 
                        className="w-full h-full object-cover" 
                    />
                </div>
                <div className="md:w-1/2 w-full p-8 md:p-12 flex flex-col overflow-y-auto">
                    <h2 className="font-heading text-4xl text-[#C6905D] mb-4">{wig.name}</h2>
                    <p className="text-[#F5EBE0]/80 flex-grow leading-relaxed mb-8">{wig.description}</p>
                    <div className="mt-auto pt-4 border-t border-[#C6905D]/20">
                         <button
                            onClick={onTryOnClick}
                            className="w-full px-8 py-3 text-base uppercase tracking-wider font-semibold bg-[#C6905D] text-black rounded-full hover:bg-[#F5EBE0] transition-all duration-300 transform hover:scale-105"
                         >
                           Essayer ce modèle
                         </button>
                    </div>
                </div>
            </div>
             <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-[#C6905D]" aria-label="Close dialog">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
        </div>
    );
};

const FloatingPreview: React.FC<{ wig: Wig; onClick: () => void; }> = ({ wig, onClick }) => {
  const elRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, rot: 0 });

  useEffect(() => {
    setPosition({
      x: Math.random() * (window.innerWidth * 0.7 - 224),
      y: Math.random() * (window.innerHeight * 0.7 - 298),
      rot: Math.random() * 20 - 10,
    });
    if (elRef.current) {
        elRef.current.style.animationDelay = `${Math.random() * 10}s`;
        elRef.current.style.animationDuration = `${15 + Math.random() * 10}s`;
    }
  }, []);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onClick();
    }
  };
  
  return (
    <div
      ref={elRef}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${wig.name}`}
      className={`absolute group overflow-hidden rounded-lg aspect-[3/4] w-48 md:w-56 animate-[float_20s_ease-in-out_infinite] cursor-pointer bg-black/30`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `rotate(${position.rot}deg)`,
        transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
        boxShadow: '0 10px 20px -5px rgba(0,0,0,0.5)',
      }}
    >
      <img
        src={wig.imageUrl}
        alt={wig.name}
        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:-rotate-2"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-6">
        <h3 className="text-2xl font-heading font-semibold text-white transition-transform duration-300 group-hover:-translate-y-1">{wig.name}</h3>
      </div>
    </div>
  );
};

const Gallery: React.FC<GalleryProps> = ({ onTryOnRequest }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedWig, setSelectedWig] = useState<Wig | null>(null);

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
  
  const handleTryOnClick = () => {
    if (selectedWig) {
        onTryOnRequest(selectedWig);
        setSelectedWig(null);
    }
  };

  return (
    <>
    <section ref={sectionRef} className={`py-20 md:py-32 transition-opacity duration-1000 ${isVisible ? 'animate-reveal' : 'opacity-0'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-[#F5EBE0]">
            Notre Galerie de Créations
          </h2>
          <p className="text-[#F5EBE0]/70 mt-4 max-w-2xl mx-auto">
            Chaque modèle est une promesse de qualité, de style et d'élégance. Cliquez pour découvrir.
          </p>
        </div>
        <div className="relative h-[80vh] w-full max-w-7xl mx-auto mt-12">
          {WIGS.length > 0 ? (
            WIGS.map((wig) => (
              <FloatingPreview 
                key={wig.id} 
                wig={wig} 
                onClick={() => setSelectedWig(wig)}
              />
            ))
          ) : (
             <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[#F5EBE0]/50 italic text-lg">La galerie de créations arrive bientôt.</p>
            </div>
          )}
        </div>
      </div>
    </section>
    {selectedWig && (
        <WigDetailModal 
            wig={selectedWig} 
            onClose={() => setSelectedWig(null)} 
            onTryOnClick={handleTryOnClick}
        />
    )}
    </>
  );
};

export default Gallery;