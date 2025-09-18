import React, { useState, useEffect, useRef } from 'react';
import { PROCESS_STEPS } from '../constants';

const CreationProcess: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = parseInt(entry.target.getAttribute('data-id') || '0', 10);
          setVisibleItems(prev => new Set(prev).add(id));
        }
      });
    }, { threshold: 0.2 });

    const currentItems = itemsRef.current;
    currentItems.forEach(item => {
      if (item) observer.observe(item);
    });

    return () => {
      currentItems.forEach(item => {
        if (item) observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-20 md:py-32 bg-[#050505]/95 backdrop-blur-sm">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-reveal">
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-[#F5EBE0]">
            Notre Processus de Création
          </h2>
          <p className="text-[#F5EBE0]/70 mt-4 max-w-2xl mx-auto">
            De la première esquisse à la touche finale, découvrez les étapes de notre savoir-faire artisanal.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-[#C6905D]/20 hidden md:block" />

          {PROCESS_STEPS.map((step, index) => {
            const isEven = index % 2 === 0;
            const isVisible = visibleItems.has(step.id);
            const animationClass = isVisible ? (isEven ? 'animate-slide-in-left' : 'animate-slide-in-right') : 'opacity-0';

            return (
              <div
                key={step.id}
                ref={el => { itemsRef.current[index] = el; }}
                data-id={step.id}
                className={`mb-12 flex md:items-center w-full ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                {/* Content */}
                <div className={`w-full md:w-5/12 p-6 bg-black/20 border border-[#C6905D]/20 rounded-lg ${animationClass}`} style={{ animationDelay: `${150}ms`}}>
                  <h3 className="font-heading text-2xl text-[#C6905D] mb-3">{step.title}</h3>
                  <p className="text-[#F5EBE0]/70">{step.description}</p>
                </div>

                {/* Icon in the middle */}
                <div className="hidden md:flex w-2/12 items-center justify-center">
                   <div className={`z-10 bg-[#050505] p-2 rounded-full border-2 border-[#C6905D]/30 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: `${300}ms`}}>
                    <step.icon className="w-8 h-8 text-[#C6905D]" />
                  </div>
                </div>

                {/* Empty spacer on mobile */}
                <div className="w-full md:w-5/12"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CreationProcess;