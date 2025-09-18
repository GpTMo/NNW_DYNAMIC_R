import React, { useState, useRef, useEffect } from 'react';
import { WIGS } from '../constants';
import type { Wig } from '../types';
import { useFaceTracking } from '../hooks/useFaceTracking';

const WigThumbnail: React.FC<{ wig: Wig; isSelected: boolean; onClick: () => void; }> = ({ wig, isSelected, onClick }) => {
    return (
        <button onClick={onClick} className={`relative aspect-square rounded-md overflow-hidden transition-all duration-200 ${isSelected ? 'ring-2 ring-[#C6905D]' : 'opacity-70 hover:opacity-100'}`} aria-pressed={isSelected}>
            <img src={wig.imageUrl} alt={wig.name} className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-black/30"></div>
            <p className="absolute bottom-1 left-2 text-white text-xs font-semibold">{wig.name}</p>
        </button>
    );
};

const SnapshotImage: React.FC<{ snapshot: string; index: number; onShare: () => void; }> = ({ snapshot, index, onShare }) => {
    return (
        <div className="relative group aspect-video rounded-lg overflow-hidden border border-white/10">
            <img src={snapshot} alt={`Essai ${index + 1}`} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                <button onClick={onShare} className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 transform opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:!scale-110" style={{ transitionDelay: '200ms' }} aria-label="Partager la photo">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6.002l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                </button>
                <a href={snapshot} download={`Essai-NLWIGS-${index + 1}.jpg`} className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-300 transform opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:!scale-110" style={{ transitionDelay: '100ms' }} aria-label="Télécharger la photo">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                </a>
            </div>
        </div>
    );
};


interface VirtualTryOnProps {
  wigToTryOn: Wig | null;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ wigToTryOn }) => {
  const [selectedWig, setSelectedWig] = useState<Wig | null>(WIGS[0] || null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const { trackingData, modelStatus } = useFaceTracking(videoRef.current, isCameraOn);
  
  useEffect(() => {
    if (wigToTryOn) {
        setSelectedWig(wigToTryOn);
    }
  }, [wigToTryOn]);

  useEffect(() => {
    try {
      const savedSnapshots = localStorage.getItem('nlwigs-snapshots');
      if (savedSnapshots) {
        setSnapshots(JSON.parse(savedSnapshots));
      }
    } catch (e) {
      console.error("Failed to parse snapshots from localStorage", e);
      localStorage.removeItem('nlwigs-snapshots');
    }
  }, []);

  const startCamera = async () => {
    setError(null);
    setIsCameraLoading(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720, facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } else {
        setError("La fonctionnalité de caméra n'est pas supportée par votre navigateur.");
      }
    } catch (err) {
      setError("Impossible d'accéder à la caméra. Veuillez autoriser l'accès dans les paramètres de votre navigateur.");
    } finally {
      setIsCameraLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsCameraOn(false);
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !selectedWig?.overlayUrl) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const wigImage = new Image();
    wigImage.crossOrigin = 'anonymous';
    wigImage.src = selectedWig.overlayUrl;

    wigImage.onload = () => {
        if (trackingData) {
             const { x, y, scale, angle } = trackingData;
             const wigWidth = canvas.width * scale;
             const wigAspectRatio = wigImage.width / wigImage.height;
             const wigHeight = wigWidth / wigAspectRatio;
             const wigX = (x / 100) * canvas.width;
             const wigY = (y / 100) * canvas.height;

             ctx.save();
             ctx.translate(wigX, wigY);
             ctx.rotate(angle * (Math.PI / 180));
             ctx.drawImage(wigImage, -wigWidth / 2, -wigHeight / 2, wigWidth, wigHeight);
             ctx.restore();
        }
        const dataUrl = canvas.toDataURL('image/jpeg');
        const newSnapshots = [...snapshots, dataUrl];
        setSnapshots(newSnapshots);
        localStorage.setItem('nlwigs-snapshots', JSON.stringify(newSnapshots));
    };
  };

  const clearSnapshots = () => {
    setSnapshots([]);
    localStorage.removeItem('nlwigs-snapshots');
  };
  
  const shareSnapshot = async (snapshot: string, index: number) => {
    try {
        const response = await fetch(snapshot);
        const blob = await response.blob();
        const file = new File([blob], `Essai-NLWIGS-${index + 1}.jpg`, { type: 'image/jpeg' });

        if (navigator.share) {
            await navigator.share({
                title: 'Mon essai NL.WIGS',
                text: "J'essaie un nouveau style chez NL.WIGS ! Qu'en pensez-vous ? #NLWIGS",
                files: [file],
            });
        } else {
            alert("Le partage n'est pas supporté par votre navigateur. Vous pouvez télécharger l'image.");
        }
    } catch (error) {
        console.error('Error sharing snapshot:', error);
        alert("Une erreur s'est produite lors du partage.");
    }
  };


  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
      else stopCamera();
    }, { threshold: 0.1 });
    
    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
      stopCamera();
    };
  }, []);

  return (
    <section ref={sectionRef} className={`py-20 md:py-32 bg-[#050505] transition-opacity duration-1000 ${isVisible ? 'animate-reveal' : 'opacity-0'}`}>
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-[#F5EBE0]">
            Essai Virtuel
          </h2>
          <p className="text-[#F5EBE0]/70 mt-4 max-w-2xl mx-auto">
            Testez nos modèles en temps réel. La perruque s'ajuste dynamiquement à votre visage.
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="w-full lg:w-2/3 aspect-video bg-black rounded-lg overflow-hidden relative border border-[#C6905D]/20 flex items-center justify-center">
            {isCameraOn ? (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100"></video>
                {selectedWig && trackingData && (
                  <img
                    src={selectedWig.overlayUrl}
                    alt={`${selectedWig.name} overlay`}
                    className="absolute h-auto pointer-events-none transition-transform duration-100 ease-linear"
                    style={{
                        left: `${trackingData.x}%`,
                        top: `${trackingData.y}%`,
                        width: `${trackingData.scale * 100}%`,
                        transform: `translate(-50%, -50%) rotate(${trackingData.angle}deg)`,
                    }}
                  />
                )}
                <button onClick={stopCamera} className="absolute top-4 right-4 z-20 px-4 py-2 text-xs bg-red-600/80 text-white rounded-full hover:bg-red-500 transition-colors">Arrêter</button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
                    <button onClick={takeSnapshot} className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors" aria-label="Prendre une photo">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                </div>
                 {modelStatus === 'loading' && <div className="absolute top-4 left-4 z-20 px-4 py-2 text-xs bg-black/50 text-white rounded-full">Initialisation du modèle IA...</div>}
              </>
            ) : (
              <div className="text-center p-8">
                {isCameraLoading ? (
                  <div className="flex flex-col items-center justify-center text-[#F5EBE0]/70">
                    <div className="w-8 h-8 border-4 border-t-transparent border-[#C6905D] rounded-full animate-spin" role="status"></div>
                    <p className="mt-4">Activation de la caméra...</p>
                  </div>
                ) : (
                  <>
                    <p className="mb-4 text-[#F5EBE0]/70">Cliquez pour démarrer l'expérience d'essai virtuel.</p>
                    <button onClick={startCamera} className="px-6 py-2 text-base uppercase tracking-wider font-semibold bg-[#C6905D] text-black rounded-full hover:bg-[#F5EBE0] transition-colors duration-300">Activer la caméra</button>
                    {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/3">
            <h3 className="font-heading text-2xl mb-4 text-[#F5EBE0]">Choisissez un modèle</h3>
            <div className="grid grid-cols-3 gap-3 max-h-[calc((100vw-48px)*9/16)] lg:max-h-[calc(66.66vw*9/16)] overflow-y-auto pr-2">
                {WIGS.map((wig) => (
                    <WigThumbnail key={wig.id} wig={wig} isSelected={selectedWig?.id === wig.id} onClick={() => setSelectedWig(wig)} />
                ))}
            </div>
          </div>
        </div>

        {snapshots.length > 0 && (
          <div className="mt-16 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading text-3xl text-[#F5EBE0]">Mes essais</h3>
              <button onClick={clearSnapshots} className="px-4 py-2 text-sm text-red-400 border border-red-400/50 rounded-full hover:bg-red-400/10 transition-colors">Effacer les photos</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {snapshots.map((snapshot, index) => (
                <SnapshotImage
                  key={index}
                  snapshot={snapshot}
                  index={index}
                  onShare={() => shareSnapshot(snapshot, index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default VirtualTryOn;