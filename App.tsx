import React, { useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import CreationProcess from './components/CreationProcess';
import Gallery from './components/Gallery';
import CareGuide from './components/CareGuide';
import RepairWorkshop from './components/RepairWorkshop';
import VirtualTryOn from './components/VirtualTryOn';
import Booking from './components/Booking';
import Footer from './components/Footer';
import InteractiveBackground from './components/InteractiveBackground';
import type { Wig } from './types';

const App: React.FC = () => {
  const servicesRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const careRef = useRef<HTMLDivElement>(null);
  const repairRef = useRef<HTMLDivElement>(null);
  const tryOnRef = useRef<HTMLDivElement>(null);
  const bookingRef = useRef<HTMLDivElement>(null);

  const [wigToTryOn, setWigToTryOn] = useState<Wig | null>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleTryOnRequest = (wig: Wig) => {
    setWigToTryOn(wig);
    // Ensure the state update is processed before scrolling
    setTimeout(() => {
        scrollTo(tryOnRef);
    }, 100);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <InteractiveBackground />
      <div className="relative z-10">
        <Header
          onServicesClick={() => scrollTo(servicesRef)}
          onProcessClick={() => scrollTo(processRef)}
          onGalleryClick={() => scrollTo(galleryRef)}
          onCareClick={() => scrollTo(careRef)}
          onRepairClick={() => scrollTo(repairRef)}
          onTryOnClick={() => scrollTo(tryOnRef)}
          onBookingClick={() => scrollTo(bookingRef)}
        />
        <main>
          <Hero onBookingClick={() => scrollTo(bookingRef)} />
          <div ref={servicesRef}>
            <Services />
          </div>
          <div ref={processRef}>
            <CreationProcess />
          </div>
          <div ref={galleryRef}>
            <Gallery onTryOnRequest={handleTryOnRequest} />
          </div>
          <div ref={careRef}>
            <CareGuide />
          </div>
          <div ref={repairRef}>
            <RepairWorkshop />
          </div>
          <div ref={tryOnRef}>
            <VirtualTryOn wigToTryOn={wigToTryOn} />
          </div>
          <div ref={bookingRef}>
            <Booking />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;