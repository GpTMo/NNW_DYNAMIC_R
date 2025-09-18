
import { useState, useEffect } from 'react';

const LERP_FACTOR = 0.08; // Lower is smoother/more lag

export const useMouseInertia = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const handleMouseMove = (event: MouseEvent) => {
      target.x = event.clientX - window.innerWidth / 2;
      target.y = event.clientY - window.innerHeight / 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;

    const animate = () => {
      current.x += (target.x - current.x) * LERP_FACTOR;
      current.y += (target.y - current.y) * LERP_FACTOR;
      
      setCoords({ x: current.x, y: current.y });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return coords;
};
