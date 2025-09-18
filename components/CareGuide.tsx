import React, { useState, useEffect, useRef } from 'react';
import { CARE_TIPS } from '../constants';
import type { CareTip } from '../types';

const CareTipItem: React.FC<{ tip: CareTip, isOpen: boolean, onToggle: () => void }> = ({ tip, isOpen, onToggle }) => {
    return (
         <div className="border-b border-[#C6905D]/20 last:border-b-0">
            <button
                onClick={onToggle}
                className="w-full flex justify-between items-center py-6 text-left"
                aria-expanded={isOpen}
                aria-controls={`care-panel-${tip.id}`}
            >
                <h3 className="text-2xl font-heading font-medium text-[#F5EBE0]">{tip.title}</h3>
                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                    <svg className="w-6 h-6 text-[#C6905D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                </span>
            </button>
            <div
                id={`care-panel-${tip.id}`}
                className="grid overflow-hidden transition-all duration-500 ease-in-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
                <div className="min-h-0">
                    <div className={`pb-6 flex flex-col md:flex-row gap-8 items-center transition-colors duration-300 ${isOpen ? 'bg-white/5 p-4 rounded-md' : 'p-4'}`}>
                        <div className="md:w-2/3">
                            <p className="text-[#F5EBE0]/80 leading-relaxed">{tip.content}</p>
                        </div>
                        <div className="md:w-1/3 w-full aspect-square">
                            <img 
                                src={tip.imageUrl} 
                                alt={tip.title} 
                                className="rounded-lg object-cover w-full h-full" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CareGuide: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [openItemId, setOpenItemId] = useState<number | null>(CARE_TIPS[0]?.id || null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const toggleItem = (id: number) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  return (
    <section ref={sectionRef} className={`py-20 md:py-32 bg-black/95 backdrop-blur-sm transition-opacity duration-1000 ${isVisible ? 'animate-reveal' : 'opacity-0'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-[#F5EBE0]">
            Guide d'Entretien
          </h2>
          <p className="text-[#F5EBE0]/70 mt-4 max-w-2xl mx-auto">
            Nos conseils d'experts pour préserver la beauté et la longévité de votre création.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          {CARE_TIPS.map((tip) => (
            <CareTipItem 
                key={tip.id}
                tip={tip}
                isOpen={openItemId === tip.id}
                onToggle={() => toggleItem(tip.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CareGuide;