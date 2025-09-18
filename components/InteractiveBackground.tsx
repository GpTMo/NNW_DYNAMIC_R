import React, { useEffect, memo } from 'react';

// Declaration for the tsParticles library loaded from the script tag in index.html
declare const tsParticles: any;

const InteractiveBackground: React.FC = () => {
  useEffect(() => {
    // Ensure the library is loaded before trying to use it
    if (typeof tsParticles === 'undefined') {
      console.error("tsParticles library not loaded.");
      return;
    }

    const loadParticles = async () => {
      try {
        await tsParticles.load({
          id: "tsparticles-background",
          options: {
            fullScreen: {
                enable: true,
                zIndex: 0,
            },
            particles: {
              number: {
                value: 80,
                density: {
                  enable: true,
                  value_area: 800,
                },
              },
              color: {
                value: "#C6905D",
              },
              shape: {
                type: "circle",
              },
              opacity: {
                value: { min: 0.1, max: 0.5 },
                animation: {
                  enable: true,
                  speed: 0.5,
                  sync: false,
                },
              },
              size: {
                value: { min: 1, max: 2 },
              },
              links: {
                enable: false,
              },
              move: {
                enable: true,
                speed: 0.3,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
              },
            },
            interactivity: {
              events: {
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
              },
              modes: {
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            detectRetina: true,
            background: {
                color: '#000000',
            }
          },
        });
      } catch (error) {
        console.error("Failed to load tsParticles:", error);
      }
    };

    loadParticles();

    // The tsParticles instance handles its own lifecycle on the canvas it creates,
    // so complex cleanup is not necessary for this full-screen, persistent background.
  }, []);

  return <div id="tsparticles-background" className="fixed top-0 left-0 w-full h-full z-0" />;
};

export default memo(InteractiveBackground);