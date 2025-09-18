import React, { useState, useEffect, useRef } from 'react';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section ref={ref} className="py-20 md:py-32 bg-[#050505]/95 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className={`text-center mb-12 ${isVisible ? 'animate-reveal' : 'opacity-0'}`}>
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-[#F5EBE0]">
            Nos Services
          </h2>
          <p className="text-[#F5EBE0]/70 mt-4 max-w-2xl mx-auto">
            Une expertise complète pour sublimer votre style, de la création à l'entretien.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <div 
              key={index} 
              className={`bg-black/20 p-8 rounded-lg border border-[#C6905D]/20 hover:border-[#C6905D]/50 transition-all duration-300 transform hover:-translate-y-2 group ${isVisible ? 'animate-reveal-card' : 'opacity-0'}`}
              style={{ animationDelay: `${150 + index * 150}ms` }}
            >
              <h3 className="text-2xl font-heading font-semibold text-[#F5EBE0] mb-3">{service.title}</h3>
              <p className="text-[#F5EBE0]/70 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;