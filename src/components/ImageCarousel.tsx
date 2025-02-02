import { useState, useEffect, TouchEvent, MouseEvent } from 'react';

const ChevronLeftIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="28" 
    height="28" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="28" 
    height="28" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

interface ImageCarouselProps {
  images: string[];
  height?: string;
  mobileHeight?: string;
}

const ImageCarousel = ({ 
  images, 
  height = '600px', 
  mobileHeight = '400px' 
}: ImageCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!dragging) {
        setActiveIndex((current) => (current + 1) % images.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [dragging, images.length]);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!dragging) return;
    
    const x = e.touches[0].clientX - startX;
    const walk = x / 5;
    const newIndex = Math.floor((activeIndex - Math.round(walk)) % images.length);
    const adjustedIndex = newIndex < 0 ? images.length + newIndex : newIndex;
    setActiveIndex(adjustedIndex >= images.length ? 0 : adjustedIndex);
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!dragging) return;
    
    const x = e.clientX - startX;
    const walk = x / 5;
    const newIndex = Math.floor((activeIndex - Math.round(walk)) % images.length);
    const adjustedIndex = newIndex < 0 ? images.length + newIndex : newIndex;
    setActiveIndex(adjustedIndex >= images.length ? 0 : adjustedIndex);
  };

  const handlePrevious = () => {
    setActiveIndex((current) => 
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((current) => 
      (current + 1) % images.length
    );
  };

  const getTransform = (index: number) => {
    const total = images.length;
    const radius = isMobile ? 200 : 400;
    const theta = ((2 * Math.PI) / total);
    const itemAngle = theta * (index - activeIndex);
    
    const x = radius * Math.sin(itemAngle);
    const z = radius * Math.cos(itemAngle) - radius;
    
    const scale = (z + radius) / radius * 0.5 + 0.5;
    const opacity = scale;

    return {
      transform: `translateX(${x}px) translateZ(${z}px) scale(${scale})`,
      opacity,
      zIndex: Math.round(opacity * 10)
    };
  };

  return (
    <div 
      className="animate-on-scroll relative perspective-1000 select-none"
      style={{ height: isMobile ? mobileHeight : height }}
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
      onTouchStart={() => setShowArrows(true)}
      onTouchEnd={() => setTimeout(() => setShowArrows(false), 3000)}
    >
      {/* Стрелка влево */}
      <button
        onClick={handlePrevious}
        className={`absolute left-12 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full 
                   bg-black/80 backdrop-blur-sm text-white/90
                   border border-white/20 transition-all duration-300 
                   hover:bg-black/90 hover:border-white/30 hover:scale-110
                   ${showArrows ? 'opacity-100' : 'opacity-0'}`}
        style={{ transform: 'translate(-50px, -50%)' }}
        aria-label="Предыдущий скриншот"
      >
        <ChevronLeftIcon />
      </button>

      {/* Стрелка вправо */}
      <button
        onClick={handleNext}
        className={`absolute right-12 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full 
                   bg-black/80 backdrop-blur-sm text-white/90
                   border border-white/20 transition-all duration-300 
                   hover:bg-black/90 hover:border-white/30 hover:scale-110
                   ${showArrows ? 'opacity-100' : 'opacity-0'}`}
        style={{ transform: 'translate(50px, -50%)' }}
        aria-label="Следующий скриншот"
      >
        <ChevronRightIcon />
      </button>

      <div 
        className="absolute inset-0 flex items-center justify-center"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {images.map((src, index) => (
          <div
            key={index}
            className="absolute transition-all duration-500 cursor-grab active:cursor-grabbing"
            style={getTransform(index)}
          >
            <div className="relative group">
              <img
                src={src}
                alt={`Screenshot ${index + 1}`}
                className="rounded-2xl shadow-2xl ring-1 ring-white/20"
                style={{
                  height: isMobile ? mobileHeight : height,
                  width: 'auto',
                  pointerEvents: 'none'
                }}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 via-transparent to-transparent 
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
