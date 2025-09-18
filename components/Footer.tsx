import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#020202]/95 backdrop-blur-sm border-t border-[#C6905D]/10">
      <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row justify-center items-center text-center">
        <p className="text-neutral-500 text-sm">
          &copy; {new Date().getFullYear()} NL.WIGS. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;