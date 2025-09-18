import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  onServicesClick: () => void;
  onProcessClick: () => void;
  onGalleryClick: () => void;
  onCareClick: () => void;
  onRepairClick: () => void;
  onTryOnClick: () => void;
  onBookingClick: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMenuOpen]);

  const handleDropdownEnter = () => {
    if (dropdownTimer.current) {
      clearTimeout(dropdownTimer.current);
    }
    setIsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimer.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 200);
  };

  const navItemClasses = "cursor-pointer uppercase tracking-wider text-sm font-medium text-[#F5EBE0]/80 hover:text-[#C6905D] transition-colors duration-300";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(isMenuOpen) setIsMenuOpen(false);
  };
  
  const handleNavClick = (callback: () => void) => {
    setIsMenuOpen(false);
    // Timeout to allow menu to close before scrolling on mobile
    setTimeout(() => callback(), 300);
  };
  
  const navLinks = [
    { label: 'Services', action: () => handleNavClick(props.onServicesClick) },
    { label: 'Processus', action: () => handleNavClick(props.onProcessClick) },
    { label: 'Galerie', action: () => handleNavClick(props.onGalleryClick) },
    { label: 'Guides', action: () => handleNavClick(props.onCareClick) },
    { label: 'Réparation', action: () => handleNavClick(props.onRepairClick) },
    { label: 'Essai Virtuel', action: () => handleNavClick(props.onTryOnClick) },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-black/80 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center h-20">
          <button onClick={scrollToTop} className="flex items-center justify-center z-50" aria-label="Go to top of page">
            <span className="font-heading text-2xl font-bold text-[#C6905D] uppercase tracking-widest">
              NL.WIGS
            </span>
          </button>
          
          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={props.onServicesClick} className={navItemClasses}>Services</button>
            <div 
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <span className={navItemClasses + " flex items-center"} aria-haspopup="true" aria-expanded={isDropdownOpen}>
                Nos Ateliers
                <svg className={`w-4 h-4 ml-1 transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </span>
              <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-black/80 backdrop-blur-sm rounded-md shadow-lg transition-all duration-300 transform ${isDropdownOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-2'}`}>
                <button onClick={props.onProcessClick} className="block w-full text-left px-4 py-2 text-sm text-[#F5EBE0]/80 hover:bg-[#C6905D]/20 hover:text-[#C6905D] transition-colors">Processus</button>
                <button onClick={props.onGalleryClick} className="block w-full text-left px-4 py-2 text-sm text-[#F5EBE0]/80 hover:bg-[#C6905D]/20 hover:text-[#C6905D] transition-colors">Galerie</button>
                <button onClick={props.onCareClick} className="block w-full text-left px-4 py-2 text-sm text-[#F5EBE0]/80 hover:bg-[#C6905D]/20 hover:text-[#C6905D] transition-colors">Guides d'Entretien</button>
                <button onClick={props.onRepairClick} className="block w-full text-left px-4 py-2 text-sm text-[#F5EBE0]/80 hover:bg-[#C6905D]/20 hover:text-[#C6905D] transition-colors">Atelier Réparation</button>
              </div>
            </div>
            <button onClick={props.onTryOnClick} className={navItemClasses}>Essai Virtuel</button>
            <button onClick={props.onBookingClick} className="px-4 py-2 text-sm uppercase tracking-wider font-semibold bg-[#C6905D] text-black rounded-full hover:bg-[#F5EBE0] transition-colors duration-300">
              Rendez-vous
            </button>
          </nav>

          <button
            className="md:hidden z-50 flex flex-col justify-center items-center w-8 h-8"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`block w-6 h-0.5 bg-[#F5EBE0] rounded-full transition-transform duration-300 ease-in-out ${isMenuOpen ? 'transform rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-[#F5EBE0] rounded-full my-1 transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-6 h-0.5 bg-[#F5EBE0] rounded-full transition-transform duration-300 ease-in-out ${isMenuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </header>

      <div 
        id="mobile-menu"
        className={`fixed inset-0 z-40 bg-black/90 backdrop-blur-lg transition-opacity duration-300 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <nav className="flex flex-col items-center justify-center h-full pt-20 pb-8 space-y-6 overflow-y-auto">
          {navLinks.map((link, index) => (
             <button
              key={link.label}
              onClick={link.action}
              className="text-2xl font-heading text-[#F5EBE0]/80 hover:text-[#C6905D] transition-colors duration-300"
              style={{
                animation: isMenuOpen ? `fadeInUp 0.5s ease forwards ${0.2 + index * 0.1}s` : 'none',
                opacity: 0,
              }}
            >
              {link.label}
            </button>
          ))}
          <button 
            onClick={() => handleNavClick(props.onBookingClick)} 
            className="mt-6 px-8 py-3 text-lg uppercase tracking-wider font-semibold bg-[#C6905D] text-black rounded-full hover:bg-[#F5EBE0] transition-colors duration-300"
            style={{
              animation: isMenuOpen ? `fadeInUp 0.5s ease forwards ${0.2 + navLinks.length * 0.1}s` : 'none',
              opacity: 0,
            }}
          >
            Rendez-vous
          </button>
        </nav>
      </div>
    </>
  );
};

export default Header;