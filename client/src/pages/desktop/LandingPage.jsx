import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Smartphone,
  ShoppingBag,
  Tag,
  Calendar,
  Truck,
  ChevronRight,
  Star,
  TrendingUp,
  QrCode,
  Layers,
  DollarSign,
  Activity,
  ArrowRight
} from 'lucide-react';

// Premium inline SVG components for the 3D Laundry Ecosystem
const WashingMachine3D = () => (
  <svg className="w-full h-full filter drop-shadow-[0_25px_50px_rgba(231,180,183,0.4)]" viewBox="0 0 280 340" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="casingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFDFC" />
        <stop offset="50%" stopColor="#FDE8E9" />
        <stop offset="100%" stopColor="#F8D3D6" />
      </linearGradient>
      <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="25%" stopColor="#F8D3D6" />
        <stop offset="50%" stopColor="#FF6B81" />
        <stop offset="75%" stopColor="#FAD4D6" />
        <stop offset="100%" stopColor="#D5808C" />
      </linearGradient>
      <radialGradient id="glassGrad" cx="50%" cy="50%" r="50%" fx="30%" fy="30%">
        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.45)" />
        <stop offset="70%" stopColor="rgba(255, 143, 163, 0.15)" />
        <stop offset="100%" stopColor="rgba(23, 23, 45, 0.45)" />
      </radialGradient>
      <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(255, 143, 163, 0.4)" />
        <stop offset="100%" stopColor="rgba(255, 107, 129, 0.75)" />
      </linearGradient>
      <radialGradient id="drumInnerShadow" cx="50%" cy="50%" r="50%">
        <stop offset="70%" stopColor="rgba(23, 23, 45, 0)" />
        <stop offset="100%" stopColor="rgba(23, 23, 45, 0.35)" />
      </radialGradient>
    </defs>
    <rect x="10" y="10" width="260" height="320" rx="28" fill="url(#casingGrad)" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
    <rect x="18" y="18" width="244" height="304" rx="20" fill="none" stroke="rgba(23,23,45,0.03)" strokeWidth="2" />
    <rect x="25" y="30" width="230" height="55" rx="14" fill="rgba(255,255,255,0.4)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" className="backdrop-blur-sm" />
    <circle cx="70" cy="57" r="16" fill="url(#metalGrad)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
    <circle cx="70" cy="57" r="11" fill="#FFF" />
    <line x1="70" y1="57" x2="70" y2="48" stroke="#FF6B81" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="125" y="45" width="60" height="24" rx="6" fill="#17172D" />
    <text x="155" y="61" fill="#FF6B81" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle" className="animate-pulse">38:00</text>
    <circle cx="205" cy="57" r="3.5" fill="#10B981" />
    <circle cx="218" cy="57" r="3.5" fill="rgba(255, 107, 129, 0.3)" />
    <circle cx="231" cy="57" r="3.5" fill="rgba(255, 107, 129, 0.3)" />
    <circle cx="140" cy="205" r="88" fill="url(#metalGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    <circle cx="140" cy="205" r="70" fill="#251D2A" />
    <path d="M 72,215 C 90,195 110,235 140,215 C 170,195 190,235 208,215 L 208,265 C 190,275 90,275 72,265 Z" fill="url(#waterGrad)" />
    <circle cx="100" cy="235" r="4" fill="#FFF" opacity="0.6" />
    <circle cx="125" cy="245" r="6" fill="#FFF" opacity="0.4" />
    <circle cx="155" cy="230" r="3.5" fill="#FFF" opacity="0.7" />
    <circle cx="178" cy="240" r="5" fill="#FFF" opacity="0.5" />
    <circle cx="140" cy="205" r="70" fill="url(#drumInnerShadow)" pointerEvents="none" />
    <circle cx="140" cy="205" r="70" fill="url(#glassGrad)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
    <path d="M 85,160 A 70,70 0 0,1 195,160" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
    <path d="M 100,150 A 70,70 0 0,1 180,150" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
    <rect x="215" y="190" width="10" height="30" rx="5" fill="url(#metalGrad)" />
  </svg>
);

const TowelsBasket3D = () => (
  <svg className="w-full h-full filter drop-shadow-[0_20px_40px_rgba(231,180,183,0.35)]" viewBox="0 0 240 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="towelPink" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFA6B6" />
        <stop offset="100%" stopColor="#FF8FA3" />
      </linearGradient>
      <linearGradient id="towelCoral" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF8597" />
        <stop offset="100%" stopColor="#FF6B81" />
      </linearGradient>
      <linearGradient id="towelCream" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFFDFB" />
        <stop offset="100%" stopColor="#F7E6E3" />
      </linearGradient>
      <linearGradient id="basketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F5E8DF" />
        <stop offset="100%" stopColor="#D4BCB0" />
      </linearGradient>
    </defs>
    <rect x="25" y="100" width="190" height="35" rx="10" fill="url(#towelCream)" />
    <path d="M25,110 C45,110 45,100 65,100 C85,100 85,110 105,110 C125,110 125,100 145,100 C165,100 165,110 185,110" stroke="rgba(23,23,45,0.04)" strokeWidth="2" fill="none" />
    <rect x="35" y="70" width="170" height="35" rx="10" fill="url(#towelPink)" />
    <rect x="35" y="98" width="170" height="8" fill="rgba(23,23,45,0.06)" rx="4" />
    <path d="M35,80 C50,80 50,70 70,70 C90,70 90,80 110,80 C130,80 130,70 150,70 C170,70 170,80 185,80" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" fill="none" />
    <rect x="45" y="40" width="150" height="35" rx="10" fill="url(#towelCoral)" />
    <rect x="45" y="68" width="150" height="8" fill="rgba(23,23,45,0.08)" rx="4" />
    <path d="M45,50 C55,50 55,40 75,40 C95,40 95,50 115,50 C135,50 135,40 155,40 C175,40 175,50 185,50" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none" />
    <path d="M10,110 L25,175 C27,185 37,192 48,192 L192,192 C203,192 213,185 215,175 L230,110 Z" fill="url(#basketGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" />
    <path d="M14,125 H226" stroke="rgba(23,23,45,0.06)" strokeWidth="3.5" />
    <path d="M18,145 H222" stroke="rgba(23,23,45,0.06)" strokeWidth="3.5" />
    <path d="M22,165 H218" stroke="rgba(23,23,45,0.06)" strokeWidth="3.5" />
    <path d="M35,110 L45,192 M65,110 L75,192 M95,110 L100,192 M125,110 L125,192 M155,110 L150,192 M185,110 L175,192 M215,110 L200,192" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
    <ellipse cx="120" cy="110" rx="112" ry="12" fill="url(#basketGrad)" stroke="rgba(255,255,255,0.8)" strokeWidth="3" />
  </svg>
);

const DeliveryVan3D = () => (
  <svg className="w-full h-full filter drop-shadow-[0_8px_20px_rgba(255,107,129,0.25)]" viewBox="0 0 120 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="vanBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="60%" stopColor="#FFF0F2" />
        <stop offset="100%" stopColor="#FAD4D6" />
      </linearGradient>
      <linearGradient id="vanAccent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FF6B81" />
        <stop offset="100%" stopColor="#FF8FA3" />
      </linearGradient>
    </defs>
    <ellipse cx="32" cy="62" rx="14" ry="5" fill="rgba(23,23,45,0.15)" />
    <ellipse cx="88" cy="62" rx="14" ry="5" fill="rgba(23,23,45,0.15)" />
    <path d="M15,18 C15,14 19,10 24,10 L96,10 C101,10 105,14 105,18 L105,54 C105,58 101,62 96,62 L24,62 C19,62 15,58 15,54 Z" fill="url(#vanBody)" stroke="rgba(255,255,255,0.8)" strokeWidth="2" />
    <path d="M15,25 L5,38 C4,39 3.5,41 3.5,43 L3.5,52 C3.5,56 7,59 11,59 L15,59 Z" fill="url(#vanBody)" />
    <path d="M14,26 L6,37 L14,37 Z" fill="#17172D" opacity="0.8" />
    <rect x="25" y="30" width="70" height="15" rx="5" fill="url(#vanAccent)" />
    <text x="60" y="40" fill="#FFF" fontSize="8" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">LaundryKu</text>
    <rect x="30" y="16" width="22" height="10" rx="3" fill="#17172D" opacity="0.6" />
    <rect x="58" y="16" width="22" height="10" rx="3" fill="#17172D" opacity="0.6" />
    <circle cx="32" cy="58" r="10" fill="#17172D" stroke="#FFF" strokeWidth="2" />
    <circle cx="32" cy="58" r="4" fill="#FF8FA3" />
    <circle cx="88" cy="58" r="10" fill="#17172D" stroke="#FFF" strokeWidth="2" />
    <circle cx="88" cy="58" r="4" fill="#FF8FA3" />
    <path d="M3.5,46 L1.5,46 C1,46 0.5,47 0.5,48 C0.5,49 1,50 1.5,50 L3.5,50 Z" fill="#FFD23F" className="animate-pulse" />
  </svg>
);

const QRCodeCube3D = () => (
  <svg className="w-full h-full filter drop-shadow-[0_10px_25px_rgba(23,23,45,0.15)]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="faceTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF" />
        <stop offset="100%" stopColor="#FCDAD7" />
      </linearGradient>
      <linearGradient id="faceLeft" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FCDAD7" />
        <stop offset="100%" stopColor="#FF8FA3" />
      </linearGradient>
      <linearGradient id="faceRight" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF8FA3" />
        <stop offset="100%" stopColor="#FF6B81" />
      </linearGradient>
    </defs>
    <path d="M 50,15 L 85,32.5 L 50,50 L 15,32.5 Z" fill="url(#faceTop)" stroke="#FFF" strokeWidth="1.5" />
    <path d="M 15,32.5 L 50,50 L 50,85 L 15,67.5 Z" fill="url(#faceLeft)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
    <path d="M 50,50 L 85,32.5 L 85,67.5 L 50,85 Z" fill="url(#faceRight)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
    <path d="M30,25 L37,28.5 L30,32 L23,28.5 Z" fill="#17172D" opacity="0.8" />
    <path d="M63,25 L70,28.5 L63,32 L56,28.5 Z" fill="#17172D" opacity="0.8" />
    <path d="M43,36 L50,39.5 L43,43 L36,39.5 Z" fill="#17172D" opacity="0.8" />
    <circle cx="35" cy="58" r="2" fill="#FFF" opacity="0.5" />
    <circle cx="28" cy="62" r="1.5" fill="#FFF" opacity="0.5" />
    <circle cx="65" cy="58" r="2" fill="#FFF" opacity="0.6" />
    <circle cx="72" cy="62" r="1.5" fill="#FFF" opacity="0.6" />
  </svg>
);

const LocationPin3D = () => (
  <svg className="w-full h-full filter drop-shadow-[0_12px_28px_rgba(255,107,129,0.35)]" viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FF8FA3" />
        <stop offset="100%" stopColor="#FF6B81" />
      </linearGradient>
    </defs>
    <ellipse cx="30" cy="74" rx="14" ry="4" fill="rgba(255, 107, 129, 0.15)" />
    <path d="M30,5 C16,5 5,16 5,30 C5,45 20,68 28,76 C29,77 31,77 32,76 C40,68 55,45 55,30 C55,16 44,5 30,5 Z" fill="url(#pinGrad)" stroke="#FFF" strokeWidth="2.5" />
    <circle cx="30" cy="30" r="10" fill="#FFF" />
    <circle cx="23" cy="23" r="2.5" fill="#FFF" opacity="0.8" />
  </svg>
);

const FloatingClothes3D = ({ color = "#FF8FA3", blur = false }) => (
  <svg className={`w-full h-full ${blur ? 'filter blur-[4px]' : ''}`} viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50,20 C50,15 54,12 50,8 C46,4 42,12 42,16 C42,20 48,22 50,24" stroke="#D4BCB0" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M30,35 L50,24 L70,35" stroke="#D4BCB0" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M32,36 L15,48 L25,60 L35,53 L38,105 L62,105 L65,53 L75,60 L85,48 L68,36 Z" fill={color} fillOpacity="0.35" stroke={color} strokeWidth="2" />
    <path d="M42,50 L42,90 M58,50 L58,90" stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
  </svg>
);

// Reusable Scroll Reveal Component utilizing IntersectionObserver
function ScrollReveal({ children, delay = 0, className = '' }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.05 });

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`${className} transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
        }`}
    >
      {children}
    </div>
  );
}

// Reusable Count-Up Animation Component
function CountUp({ end, duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStarted(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = end / (duration / 16); // 60fps ~ 16ms
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count.toLocaleString('id-ID')}</span>;
}

// Reusable 3D Parallax Gallery Card
function GalleryCard({
  photo,
  stageNum,
  zIndexClass,
  translateZ,
  mouseOffsetMultiplier,
  styleOffsetDesktop,
  isGalleryHovered,
  galleryMousePos,
  revealType
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });

    if (cardRef.current) observer.observe(cardRef.current);

    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  // Parallax calculations based on stage depths
  const tiltX = isGalleryHovered ? galleryMousePos.y * -mouseOffsetMultiplier.y : 0;
  const tiltY = isGalleryHovered ? galleryMousePos.x * mouseOffsetMultiplier.x : 0;
  const transX = isGalleryHovered ? galleryMousePos.x * (mouseOffsetMultiplier.x * 2.2) : 0;
  const transY = isGalleryHovered ? galleryMousePos.y * (mouseOffsetMultiplier.y * 2.2) : 0;

  const transformStyle = {
    transform: `translate3d(${transX}px, ${transY}px, ${translateZ}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) ${isHovered ? 'scale(1.045)' : 'scale(1)'}`,
    transition: isHovered
      ? 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
      : 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
    transformStyle: 'preserve-3d',
  };

  // Define scroll reveal classes
  let revealClass = '';
  if (revealType === 'left') {
    revealClass = isVisible
      ? 'opacity-100 translate-x-0 rotate-0'
      : 'opacity-0 -translate-x-20 -rotate-3 pointer-events-none';
  } else if (revealType === 'center') {
    revealClass = isVisible
      ? 'opacity-100 scale-100 translate-y-0'
      : 'opacity-0 scale-90 translate-y-12 pointer-events-none';
  } else if (revealType === 'right') {
    revealClass = isVisible
      ? 'opacity-100 translate-x-0 rotate-0'
      : 'opacity-0 translate-x-20 rotate-3 pointer-events-none';
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={transformStyle}
      className={`group relative overflow-hidden rounded-3xl bg-white/55 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-2xl hover:shadow-soft-coral/15 hover:border-soft-coral/30 ${zIndexClass} ${styleOffsetDesktop} ${revealClass} transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)`}
    >
      {/* Soft hover glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-soft-coral/0 via-soft-coral/0 to-soft-coral/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Breathing image wrapper */}
      <div className="aspect-[4/3] overflow-hidden bg-zinc-200 relative w-full">
        <div className="absolute inset-0 bg-deep-navy/15 group-hover:bg-transparent transition-all duration-500 z-10" />
        <img
          src={photo.url}
          alt={photo.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 animate-breath"
          loading="lazy"
        />
        {stageNum && (
          <span className="absolute top-4 left-4 z-20 bg-deep-navy/85 backdrop-blur-md text-white text-[9px] uppercase font-bold tracking-[0.2em] px-3.5 py-1.5 rounded-full border border-white/10 shadow-md">
            Tahap {stageNum}
          </span>
        )}
      </div>

      {/* Frosted Glassmorphism Details Pane */}
      <div className="p-6 bg-white/60 backdrop-blur-sm border-t border-white/30 relative z-20 flex flex-col justify-between">
        <div className="space-y-1 transition-transform duration-500 group-hover:-translate-y-1">
          <h4 className="font-display font-black text-lg text-deep-navy group-hover:text-soft-coral transition-colors leading-tight">
            {photo.title}
          </h4>
          <p className="text-deep-navy/60 text-xs leading-relaxed font-body mt-1 opacity-90 group-hover:opacity-100 transition-opacity">
            {photo.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

// Reusable 3D Parallax Workflow Card
function WorkflowCard({
  step,
  title,
  desc,
  icon: IconComponent,
  isWorkflowHovered,
  workflowMousePos,
  mouseOffsetMultiplier,
  delay,
  iconChildren,
  iconBg = "bg-soft-coral/10 text-soft-coral",
  stepColor = "text-soft-coral",
  styleOffsetDesktop = ""
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => { if (ref.current) observer.unobserve(ref.current); };
  }, []);

  // 3D Parallax calculations
  const tiltX = isWorkflowHovered ? workflowMousePos.y * -mouseOffsetMultiplier.y : 0;
  const tiltY = isWorkflowHovered ? workflowMousePos.x * mouseOffsetMultiplier.x : 0;
  const transX = isWorkflowHovered ? workflowMousePos.x * (mouseOffsetMultiplier.x * 2.2) : 0;
  const transY = isWorkflowHovered ? workflowMousePos.y * (mouseOffsetMultiplier.y * 2.2) : 0;

  const transformStyle = {
    transform: `translate3d(${transX}px, ${transY}px, 0) rotateX(${tiltX}deg) rotateY(${tiltY}deg) ${isHovered ? 'scale(1.05)' : 'scale(1)'}`,
    transition: isHovered
      ? 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
      : 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.65s cubic-bezier(0.25, 1, 0.5, 1)',
    transformStyle: 'preserve-3d',
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        ...transformStyle,
        animationDelay: `${delay}ms`
      }}
      className={`group flex-1 min-w-[210px] p-6 bg-white/55 backdrop-blur-md border border-deep-navy/5 rounded-[28px] shadow-md hover:shadow-xl hover:border-soft-coral/30 hover:shadow-soft-coral/5 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${styleOffsetDesktop} ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95 pointer-events-none'
        }`}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Step indicator */}
        <span className={`text-[9px] font-mono tracking-widest ${stepColor} font-black uppercase`}>
          Langkah {step}
        </span>

        {/* Icon frame with custom animation children */}
        <div className={`relative w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
          <IconComponent className="w-6 h-6 relative z-10" />
          {iconChildren}
        </div>

        <div className="space-y-1">
          <h4 className="font-display font-black text-deep-navy group-hover:text-soft-coral transition-colors text-sm leading-tight">
            {title}
          </h4>
          <p className="text-deep-navy/60 text-[11px] leading-relaxed font-body">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DesktopLandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const [galleryMousePos, setGalleryMousePos] = useState({ x: 0, y: 0 });
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);

  const mouseFrameId = useRef(null);

  // Track mouse coordinates over the hero wrapper with requestAnimationFrame throttling
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    if (mouseFrameId.current) {
      cancelAnimationFrame(mouseFrameId.current);
    }
    mouseFrameId.current = requestAnimationFrame(() => {
      setMousePos({ x, y });
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (mouseFrameId.current) {
      cancelAnimationFrame(mouseFrameId.current);
    }
    setMousePos({ x: 0, y: 0 });
  };

  // Clean up animation frames on unmount
  useEffect(() => {
    return () => {
      if (mouseFrameId.current) {
        cancelAnimationFrame(mouseFrameId.current);
      }
    };
  }, []);

  // Track mouse coordinates over the gallery wrapper
  const handleGalleryMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setGalleryMousePos({ x, y });
  };

  const handleGalleryMouseEnter = () => setIsGalleryHovered(true);
  const handleGalleryMouseLeave = () => {
    setIsGalleryHovered(false);
    setGalleryMousePos({ x: 0, y: 0 });
  };

  const [workflowMousePos, setWorkflowMousePos] = useState({ x: 0, y: 0 });
  const [isWorkflowHovered, setIsWorkflowHovered] = useState(false);

  // Track mouse coordinates over the workflow wrapper
  const handleWorkflowMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setWorkflowMousePos({ x, y });
  };

  const handleWorkflowMouseEnter = () => setIsWorkflowHovered(true);
  const handleWorkflowMouseLeave = () => {
    setIsWorkflowHovered(false);
    setWorkflowMousePos({ x: 0, y: 0 });
  };

  // Track scroll position for secondary subtle parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const galleryPhotos = [
    {
      id: 1,
      title: 'Mesin Cuci Industrial',
      desc: 'Siklus higienis tinggi dengan teknologi terbaru.',
      url: 'https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      title: 'Proses Setrika Uap',
      desc: 'Pakaian rapi sempurna dan bebas kuman.',
      url: 'https://images.unsplash.com/photo-1489274495757-95c7c837b101?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      title: 'Quality Control & Packing',
      desc: 'Double-checking noda dan wewangian segar tahan lama.',
      url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const features = [
    {
      title: 'Pesan Laundry',
      desc: 'Pesan cucian dalam 1-klik. Input nomor HP otomatis dan tentukan layanan pilihan Anda secara instan.',
      icon: ShoppingBag,
      color: 'bg-soft-coral/10 text-soft-coral',
    },
    {
      title: 'Tracking Real-time',
      desc: 'Pantau status pengerjaan cucian Anda secara live melalui progress stepper interaktif langsung di HP.',
      icon: Activity,
      color: 'bg-rose-pink/10 text-rose-pink',
    },
    {
      title: 'Antar Jemput Presisi',
      desc: 'Penjemputan dan pengantaran laundry secara presisi menggunakan peta terintegrasi Leaflet.js.',
      icon: Truck,
      color: 'bg-deep-navy/10 text-deep-navy',
    },
    {
      title: 'Dashboard Admin',
      desc: 'Kelola pesanan masuk, alokasikan tugas kurir, dan perbarui status pengerjaan secara real-time.',
      icon: Layers,
      color: 'bg-soft-coral/10 text-soft-coral',
    },
    {
      title: 'Laporan Keuangan',
      desc: 'Dapatkan rekap pemasukan dan pengeluaran operasional serta unduh laporan Excel & PDF instan.',
      icon: DollarSign,
      color: 'bg-rose-pink/10 text-rose-pink',
    },
    {
      title: 'Pelacakan QR',
      desc: 'Integrasi tag QR pakaian untuk memastikan akurasi data penjemputan dan pengantaran oleh kurir.',
      icon: QrCode,
      color: 'bg-deep-navy/10 text-deep-navy',
    },
  ];

  const sheenX = mousePos.x * 120;
  const sheenY = mousePos.y * 120;
  const sheenStyle = {
    background: `radial-gradient(circle at ${sheenX + 50}% ${sheenY + 50}%, rgba(255, 255, 255, 0.4) 0%, transparent 65%)`,
  };

  return (
    <div className="min-h-screen animated-mesh-bg text-deep-navy flex flex-col font-body selection:bg-soft-coral selection:text-white relative">
      
      {/* Global Noise film grain overlay */}
      <div className="noise-overlay" />

      {/* Decorative Fixed Header background blurring */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/30 border-b border-deep-navy/5 px-8 py-5 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-deep-navy flex items-center justify-center font-display font-black text-warm-ivory shadow-lg">
            LK
          </div>
          <span className="text-xl font-display font-black tracking-tight text-deep-navy">
            Lundry<span className="text-soft-coral">Ku</span>
          </span>
        </div>
        <nav className="flex items-center gap-8">
          <a href="#fitur" className="text-xs uppercase tracking-widest font-bold text-deep-navy/70 hover:text-soft-coral transition-colors">Fitur Utama</a>
          <a href="#galeri" className="text-xs uppercase tracking-widest font-bold text-deep-navy/70 hover:text-soft-coral transition-colors">Galeri Operasional</a>
          <a href="#panduan" className="text-xs uppercase tracking-widest font-bold text-deep-navy/70 hover:text-soft-coral transition-colors">Panduan Alur</a>
        </nav>
      </header>

      {/* Hero Section Container */}
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="premium-hero-bg relative overflow-hidden pt-28 pb-32 px-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center"
      >
        {/* Layer 1: Volumetric Glowing Orbs & Pink/Navy Ambient Glows (Speed 0.02) */}
        <div
          style={{
            transform: `translate3d(${mousePos.x * 2.4}px, ${mousePos.y * 2.4 + scrollY * 0.02}px, 0)`,
            transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out',
            willChange: 'transform'
          }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          {/* Soft Pink Ambient Glow */}
          <div className="absolute top-[10%] left-[10%] w-[600px] h-[600px] rounded-full bg-soft-coral/12 blur-[150px] animate-blob-1" />
          {/* Navy Ambient Glow */}
          <div className="absolute bottom-[5%] right-[10%] w-[550px] h-[550px] rounded-full bg-deep-navy/8 blur-[130px] animate-blob-2" />
          {/* Volumetric Light Rays (Bloom) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-60 blur-xl mix-blend-screen" />
        </div>

        {/* Layer 2: Floating Fabric Ecosystem (Depth Blur 8px) */}
        <div
          style={{
            transform: `translate3d(${mousePos.x * -10}px, ${mousePos.y * -10 + scrollY * -0.08}px, 0)`,
            transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out',
            willChange: 'transform'
          }}
          className="absolute inset-0 pointer-events-none z-0 opacity-12 hidden lg:block filter blur-[8px]"
        >
          {/* Satin cloth ribbon */}
          <div className="absolute left-[12%] top-[12%] w-24 h-24 animate-fabric-float">
            <svg className="w-full h-full text-soft-coral" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M10,40 Q30,10 50,60 T90,30" />
            </svg>
          </div>
          
          {/* Folded shirt silhouette */}
          <div className="absolute left-[3%] top-[45%] w-28 h-28 animate-fabric-float animate-delay-100">
            <svg className="w-full h-full text-deep-navy" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M25,20 L35,10 L65,10 L75,20 L75,90 L25,90 Z" />
              <path d="M35,10 L50,25 L65,10" />
              <circle cx="50" cy="45" r="2.5" fill="currentColor" />
              <circle cx="50" cy="65" r="2.5" fill="currentColor" />
            </svg>
          </div>

          {/* Floating hanger */}
          <div className="absolute right-[8%] top-[10%] w-20 h-20 animate-fabric-float animate-delay-300">
            <svg className="w-full h-full text-deep-navy" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M50,30 C50,20 56,15 50,10 C44,5 38,15 38,22" />
              <path d="M15,50 L50,30 L85,50 Z" />
            </svg>
          </div>

          {/* Laundry Tag */}
          <div className="absolute right-[22%] bottom-[12%] w-16 h-16 animate-fabric-float animate-delay-200">
            <svg className="w-full h-full text-rose-pink" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="25" y="15" width="50" height="70" rx="6" />
              <circle cx="50" cy="28" r="4.5" />
              <line x1="35" y1="45" x2="65" y2="45" strokeWidth="2.5" />
              <line x1="35" y1="58" x2="65" y2="58" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Fabric wave */}
          <div className="absolute left-[45%] top-[15%] w-44 h-16 animate-fabric-float">
            <svg className="w-full h-full text-rose-pink opacity-80" viewBox="0 0 200 60" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M 0,30 Q 50,5 100,55 T 200,30" />
            </svg>
          </div>
        </div>

        {/* Layer 3: Premium Washing Machine - Largest Object (Left Side, Sharp Depth Blur 0) */}
        <div 
          style={{
            transform: `translate3d(${-50 + mousePos.x * -25}px, ${70 + mousePos.y * -25 + scrollY * -0.05}px, 50px) rotateX(${mousePos.y * -3}deg) rotateY(${mousePos.x * 5}deg) rotate(-2deg)`,
            transformStyle: 'preserve-3d',
            transition: isHovered ? 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'transform'
          }}
          className="absolute left-[1%] top-[15%] w-[290px] h-[350px] pointer-events-none z-0 hidden lg:block"
        >
          <WashingMachine3D />
          
          {/* Nested floating laundry basket beneath machine */}
          <div className="absolute -left-8 -bottom-12 w-32 h-24 animate-float-medium">
            <svg viewBox="0 0 64 64" fill="none" stroke="#D4BCB0" strokeWidth="2" className="opacity-90">
              <path d="M12 16 H52 L46 52 H18 Z" fill="#F5E8DF" />
              <ellipse cx="32" cy="16" rx="20" ry="4" fill="#E6DFD5" />
            </svg>
          </div>
        </div>

        {/* Layer 3: Folded Towels Basket (Right Side, Sharp Depth Blur 0) */}
        <div 
          style={{
            transform: `translate3d(${20 + mousePos.x * 25}px, ${160 + mousePos.y * 25 + scrollY * -0.05}px, 60px) rotateX(${mousePos.y * 3}deg) rotateY(${mousePos.x * -5}deg) rotate(4deg)`,
            transformStyle: 'preserve-3d',
            transition: isHovered ? 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
            willChange: 'transform'
          }}
          className="absolute right-[-2%] bottom-[6%] w-[240px] h-[200px] pointer-events-none z-0 hidden lg:block"
        >
          <TowelsBasket3D />
        </div>

        {/* Layer 3: Hanging Clothes (Background) */}
        <div 
          style={{
            transform: `translate3d(${mousePos.x * -15}px, ${mousePos.y * -15 + scrollY * -0.07}px, 20px) rotate(${Math.sin(scrollY * 0.008) * 3 + mousePos.x * 4}deg)`,
            transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out',
            willChange: 'transform'
          }}
          className="absolute right-[18%] top-[12%] w-24 h-28 pointer-events-none z-0 hidden lg:block"
        >
          <FloatingClothes3D color="#FCDAD7" blur={false} />
        </div>
        <div 
          style={{
            transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18 + scrollY * -0.09}px, 25px) rotate(${Math.cos(scrollY * 0.008) * 3 + mousePos.x * -4}deg)`,
            transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out',
            willChange: 'transform'
          }}
          className="absolute left-[26%] top-[14%] w-20 h-24 pointer-events-none z-0 hidden lg:block"
        >
          <FloatingClothes3D color="#FFF" blur={false} />
        </div>

        {/* Layer 4: Soap Bubble System (Sharp, Backdrop blur 6px) */}
        <div 
          style={{
            transform: `translate3d(${mousePos.x * 35}px, ${mousePos.y * 35 + scrollY * -0.3}px, 80px)`,
            transition: isHovered ? 'transform 0.12s ease-out' : 'transform 0.8s ease-out',
            willChange: 'transform'
          }}
          className="absolute inset-0 pointer-events-none z-10 hidden lg:block"
        >
          {[
            { id: 1, left: '5%', top: '65%', r: 18, delay: '0s', duration: '6s' },
            { id: 2, left: '12%', top: '15%', r: 10, delay: '1.5s', duration: '8s' },
            { id: 3, left: '25%', top: '80%', r: 14, delay: '0.8s', duration: '7s' },
            { id: 4, left: '38%', top: '22%', r: 12, delay: '2s', duration: '9s' },
            { id: 5, left: '55%', top: '78%', r: 22, delay: '0.3s', duration: '5.5s' },
            { id: 6, left: '72%', top: '16%', r: 16, delay: '1.2s', duration: '7.5s' },
            { id: 7, left: '88%', top: '50%', r: 20, delay: '2.5s', duration: '6.5s' },
            { id: 8, left: '15%', top: '40%', r: 9, delay: '1s', duration: '7s' },
            { id: 9, left: '30%', top: '60%', r: 15, delay: '0.5s', duration: '8.5s' },
            { id: 10, left: '45%', top: '85%', r: 8, delay: '2.2s', duration: '6s' },
            { id: 11, left: '60%', top: '30%', r: 11, delay: '1.8s', duration: '9.5s' },
            { id: 12, left: '78%', top: '70%', r: 17, delay: '0.7s', duration: '8s' },
            { id: 13, left: '92%', top: '25%', r: 13, delay: '2.1s', duration: '7s' },
            { id: 14, left: '8%', top: '35%', r: 12, delay: '1.4s', duration: '6.5s' },
            { id: 15, left: '22%', top: '50%', r: 16, delay: '0.9s', duration: '8s' },
            { id: 16, left: '65%', top: '62%', r: 10, delay: '1.6s', duration: '7s' },
            { id: 17, left: '84%', top: '42%', r: 15, delay: '0.4s', duration: '8.5s' },
            { id: 18, left: '35%', top: '10%', r: 14, delay: '2.3s', duration: '7.5s' },
            { id: 19, left: '50%', top: '55%', r: 19, delay: '1.1s', duration: '9s' },
            { id: 20, left: '70%', top: '90%', r: 12, delay: '0.2s', duration: '6s' }
          ].map(b => (
            <div
              key={b.id}
              style={{
                left: b.left,
                top: b.top,
                width: b.r * 2,
                height: b.r * 2,
                animationDelay: b.delay,
                animationDuration: b.duration,
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                willChange: 'transform'
              }}
              className="absolute rounded-full border border-white/45 bg-gradient-to-tr from-white/25 via-rose-pink/10 to-white/45 shadow-[inset_0_4px_12px_rgba(255,255,255,0.75),_0_8px_20px_rgba(231,180,183,0.2)] animate-float-slow pointer-events-none"
            >
              <div className="absolute top-1.5 left-1.5 w-2.5 h-1.5 bg-white/80 rounded-full rotate-[-30deg]" />
            </div>
          ))}
        </div>

        {/* Layer 5: Smart Laundry Technology (Depth Blur 2px, transformStyle preserve-3d) */}
        <div 
          style={{
            transform: `translate3d(${mousePos.x * 20}px, ${mousePos.y * 20 + scrollY * -0.12}px, 30px)`,
            transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out',
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
          className="absolute inset-0 pointer-events-none z-0 hidden lg:block filter blur-[2px]"
        >
          {/* Laundry Workflow Journey Path Line (Drawn dynamically on scroll) */}
          <svg className="absolute left-[8%] bottom-[12%] w-[84%] h-48 overflow-visible opacity-60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M 50,140 C 180,220 300,40 440,110 C 580,180 720,40 900,120" 
              stroke="url(#journeyPathGrad)" 
              strokeWidth="4" 
              strokeLinecap="round"
              strokeDasharray="900"
              strokeDashoffset={Math.max(900 - (scrollY / 450) * 900, 0)}
              className="transition-all duration-300 ease-out"
              style={{ willChange: 'stroke-dashoffset' }}
            />
            <path 
              d="M 50,140 C 180,220 300,40 440,110 C 580,180 720,40 900,120" 
              stroke="#FF6B81" 
              strokeWidth="6" 
              strokeLinecap="round"
              opacity="0.08"
            />
            <defs>
              <linearGradient id="journeyPathGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#FF6B81" />
                <stop offset="50%" stopColor="#FF8FA3" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Workflow Journey Nodes */}
          <div className="absolute left-[8%] bottom-[15%] flex flex-col items-center">
            <span className="w-3 h-3 rounded-full bg-soft-coral border-2 border-white animate-pulse" />
            <span className="text-[8px] font-mono tracking-wider text-deep-navy/60 font-black uppercase mt-1">Customer</span>
          </div>
          <div className="absolute left-[28%] bottom-[23%] flex flex-col items-center">
            <span className="w-3 h-3 rounded-full bg-soft-coral border-2 border-white animate-pulse" />
            <span className="text-[8px] font-mono tracking-wider text-deep-navy/60 font-black uppercase mt-1">Admin</span>
          </div>
          <div className="absolute left-[48%] bottom-[13%] flex flex-col items-center">
            <span className="w-3 h-3 rounded-full bg-soft-coral border-2 border-white animate-pulse" />
            <span className="text-[8px] font-mono tracking-wider text-deep-navy/60 font-black uppercase mt-1">Courier</span>
          </div>
          <div className="absolute left-[70%] bottom-[21%] flex flex-col items-center">
            <span className="w-3 h-3 rounded-full bg-soft-coral border-2 border-white animate-pulse" />
            <span className="text-[8px] font-mono tracking-wider text-deep-navy/60 font-black uppercase mt-1">Laundry</span>
          </div>
          <div className="absolute left-[90%] bottom-[11%] flex flex-col items-center">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
            <span className="text-[8px] font-mono tracking-wider text-emerald-500/80 font-black uppercase mt-1">Finished</span>
          </div>

          <div className="absolute left-[38%] bottom-[22%] w-10 h-14">
            <LocationPin3D />
          </div>

          {/* Delivery Van miniature driving */}
          <div 
            style={{
              transform: `translate3d(${50 + scrollY * 0.12}px, ${0}px, 0) rotate(${-2 + Math.sin(scrollY * 0.015) * 2.5}deg) scale(0.9)`,
              transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
            className="absolute left-[42%] bottom-[18%] w-24 h-16"
          >
            <DeliveryVan3D />
          </div>
          
          {/* Interactive QR Code Cube preset angle & dynamic rotate on scroll */}
          <div 
            style={{
              transform: `translate3d(${mousePos.x * 25}px, ${mousePos.y * 25}px, 0) rotateY(${25 + scrollY * 0.2}deg) rotateX(${10 + scrollY * 0.15}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
            className="absolute right-[22%] bottom-[24%] w-16 h-16"
          >
            <QRCodeCube3D />
          </div>
        </div>

        {/* Layer 6: Cinematic Light FX & Particles (Opacity 0.2 - 0.4) */}
        <div 
          style={{
            transform: `translate3d(${mousePos.x * 30}px, ${mousePos.y * 30}px, 0)`,
            transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out',
            willChange: 'transform'
          }}
          className="absolute inset-0 pointer-events-none z-10 opacity-30"
        >
          {/* Volumetric light streaks */}
          <div className="absolute top-0 right-[25%] w-[4px] h-[350px] bg-gradient-to-b from-white/25 to-transparent rotate-45 transform origin-top blur-[2px]" />
          <div className="absolute top-[8%] right-[20%] w-[3px] h-[300px] bg-gradient-to-b from-white/20 to-transparent rotate-45 transform origin-top blur-[2px]" />
          
          {/* Soft lens flare orb */}
          <div className="absolute left-[18%] top-[40%] w-20 h-20 rounded-full bg-white/30 blur-md mix-blend-screen animate-pulse" />
          
          {/* Floating Sparkles & Particles */}
          <div className="absolute left-[28%] top-[25%] opacity-35 text-soft-coral animate-bounce">
            <Sparkles className="w-5 h-5 animate-spin-slow" />
          </div>
          <div className="absolute right-[35%] bottom-[30%] opacity-40 text-rose-pink">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        {/* Left Column (Layer 3: Content / Typography) */}
        <div className="lg:col-span-7 z-10 space-y-8 select-none text-left">

          {/* Sparkles pill tag */}
          {/* <ScrollReveal delay={100}>
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-soft-coral/10 border border-soft-coral/20 text-soft-coral text-xs uppercase tracking-[0.25em] font-extrabold shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-soft-coral animate-pulse" /> Ekosistem Laundry Pintar
            </div>
          </ScrollReveal> */}

          {/* Headline Typography Composition */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-display font-black leading-[1.08] text-deep-navy tracking-tight">
              <span className="block animate-reveal opacity-0" style={{ animationDelay: '200ms' }}>
                Layanan Laundry
              </span>
              <span className="block italic font-normal text-soft-coral animate-reveal opacity-0" style={{ animationDelay: '400ms' }}>
                Modern
              </span>
              <span className="block animate-reveal opacity-0" style={{ animationDelay: '600ms' }}>
                dalam
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-soft-coral to-rose-pink animate-reveal opacity-0 font-display" style={{ animationDelay: '800ms' }}>
                Satu Genggaman
              </span>
            </h1>

            <ScrollReveal delay={1000}>
              <p className="text-base md:text-lg text-deep-navy/70 max-w-xl leading-relaxed font-body pt-2">
                LundryKu mendefinisikan ulang cara Anda mengurus pakaian. Dari pemesanan antar-jemput presisi hingga sistem manajemen finansial otomatis dalam satu platform terpadu.
              </p>
            </ScrollReveal>
          </div>

          {/* CRITICAL MESSAGE CALLOUT BOX */}
          <ScrollReveal delay={1200}>
            <div className="glass-card p-6 rounded-2xl border border-white/60 shadow-xl relative overflow-hidden group max-w-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-soft-coral/5 rounded-full blur-2xl group-hover:bg-soft-coral/10 transition-colors duration-500"></div>
              <div className="flex gap-5">
                <div className="w-12 h-12 rounded-xl bg-soft-coral/10 flex items-center justify-center text-soft-coral shrink-0 animate-pulse">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-display font-extrabold text-soft-coral text-lg leading-none">Akses Khusus Smartphone</h4>
                  <p className="text-xs md:text-sm text-deep-navy/85 leading-relaxed font-medium mt-1">
                    "Untuk memesan, tracking, dan mengelola laundry, silakan akses website ini melalui Smartphone Anda."
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Quick Stats Grid */}
          <ScrollReveal delay={1400}>
            <div className="grid grid-cols-3 gap-8 pt-8 max-w-lg border-t border-deep-navy/10">
              <div>
                <p className="text-3xl md:text-4xl font-display font-black text-deep-navy">
                  <CountUp end={1250} />+
                </p>
                <p className="text-[10px] text-deep-navy/50 font-bold tracking-wider uppercase mt-1.5">Cucian Selesai</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display font-black text-deep-navy">
                  <CountUp end={99} />.8%
                </p>
                <p className="text-[10px] text-deep-navy/50 font-bold tracking-wider uppercase mt-1.5">Kepuasan User</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-display font-black text-deep-navy">
                  <CountUp end={24} />/7
                </p>
                <p className="text-[10px] text-deep-navy/50 font-bold tracking-wider uppercase mt-1.5">Layanan Aktif</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column (Layer 5 & 6: 3D interactive phone scene) */}
        <div
          className="lg:col-span-5 flex justify-center items-center relative min-h-[640px] z-10"
          style={{ perspective: '1200px' }}
        >
          {/* Main 3D tilt frame */}
          <div
            style={{
              transform: `rotateX(${mousePos.y * -25}deg) rotateY(${mousePos.x * 25}deg) translateZ(0px) rotateZ(${scrollY * 0.02}deg)`,
              transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              transformStyle: 'preserve-3d'
            }}
            className="relative w-80 h-[600px] z-20 flex justify-center items-center"
          >
            {/* Soft Shadow behind phone */}
            <div
              style={{
                transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, -50px) scale(0.95)`,
                filter: 'blur(35px)',
                transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="absolute inset-0 bg-deep-navy/30 rounded-[56px] pointer-events-none"
            />

            {/* Smartphone casing */}
            <div
              style={{ transform: 'translateZ(30px)' }}
              className="relative w-76 h-[580px] bg-deep-navy rounded-[44px] p-2.5 border-[5px] border-deep-navy shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-deep-navy rounded-b-2xl z-40 flex items-center justify-center">
                <div className="w-12 h-1.5 bg-slate-900 rounded-full"></div>
              </div>

              {/* Dynamic glossy reflection */}
              <div
                style={sheenStyle}
                className="absolute inset-0 pointer-events-none z-30 mix-blend-overlay opacity-60"
              />

              {/* Mockup Screen Content */}
              <div className="flex-1 rounded-[34px] bg-warm-ivory p-4 pt-10 flex flex-col justify-between relative overflow-hidden select-none text-deep-navy text-[11px] font-medium">

                {/* Header Mockup */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-soft-coral"></span>
                      <span className="text-[10px] font-extrabold text-deep-navy/60 tracking-wider">LundryKu Mobile</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  </div>

                  {/* Discount / Promo card mockup */}
                  <div className="p-3.5 bg-deep-navy rounded-2xl text-white shadow-lg relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 w-16 h-16 bg-soft-coral/30 rounded-full blur-xl"></div>
                    <p className="text-[8px] text-soft-coral font-bold tracking-widest uppercase">Promo Spesial</p>
                    <p className="text-[11px] font-display font-extrabold leading-snug mt-0.5">Diskon 20% + Free Ongkir Pertama</p>
                  </div>

                  {/* 1-Tap select services cards mockup */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 bg-white rounded-xl border border-deep-navy/5 shadow-sm flex flex-col items-center justify-center gap-1.5">
                      <div className="w-7 h-7 rounded-full bg-soft-coral/10 flex items-center justify-center text-soft-coral">
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-bold text-deep-navy/80">Pesan Cucian</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-deep-navy/5 shadow-sm flex flex-col items-center justify-center gap-1.5">
                      <div className="w-7 h-7 rounded-full bg-rose-pink/10 flex items-center justify-center text-rose-pink">
                        <Tag className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[9px] font-bold text-deep-navy/80">Cek Tarif</span>
                    </div>
                  </div>

                  {/* Stepper mockup */}
                  <div className="p-3 bg-white rounded-xl border border-deep-navy/5 shadow-sm space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] font-mono text-deep-navy/40">ORDER: LK-2026</span>
                      <span className="text-[8px] font-bold bg-soft-coral/15 text-soft-coral px-1.5 py-0.5 rounded">Diproses</span>
                    </div>
                    <div className="w-full bg-deep-navy/5 h-1.5 rounded-full overflow-hidden">
                      <div className="w-[60%] bg-soft-coral h-full rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* QR Code and link mockup */}
                <div className="text-center space-y-2.5 pt-3 border-t border-deep-navy/5">
                  <span className="text-[9px] text-deep-navy/50 font-bold">Pindai QR untuk Memulai</span>
                  <div className="w-16 h-16 bg-white p-1.5 rounded-xl mx-auto flex items-center justify-center shadow-md border border-deep-navy/5">
                    <div className="w-full h-full bg-warm-ivory rounded border border-dashed border-deep-navy/20 flex items-center justify-center">
                      <QrCode className="w-8 h-8 text-deep-navy/80" />
                    </div>
                  </div>
                  <p className="text-[8px] text-deep-navy/40 font-bold tracking-widest uppercase">laundryku-web.id</p>
                </div>
              </div>
            </div>

            {/* Layer 4: FLOATING PARALLAX GLASS CARDS */}
            {/* Card 1: Pickup Order Card (Left Top) */}
            <div
              style={{
                transform: `translate3d(${-145 + mousePos.x * -45}px, ${-150 + mousePos.y * -45}px, 50px)`,
                transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="absolute glass-card px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 w-56 animate-float-slow text-left pointer-events-none select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-soft-coral/15 flex items-center justify-center text-soft-coral shrink-0">
                <Truck className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-mono tracking-widest text-soft-coral font-bold leading-none">Penjemputan Aktif</p>
                <p className="text-xs font-bold text-deep-navy mt-1.5 leading-snug">Kurir sedang menuju lokasi</p>
              </div>
            </div>

            {/* Card 2: Laundry Status Card (Right Middle) */}
            <div
              style={{
                transform: `translate3d(${140 + mousePos.x * 25}px, ${-40 + mousePos.y * 25}px, 75px)`,
                transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="absolute glass-card px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 w-56 animate-float-medium text-left pointer-events-none select-none"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                <Activity className="w-4.5 h-4.5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center leading-none">
                  <p className="text-[9px] uppercase font-mono tracking-widest text-emerald-500 font-bold">Status Cucian</p>
                  <span className="text-[9px] font-bold text-deep-navy/40">75%</span>
                </div>
                <p className="text-xs font-bold text-deep-navy mt-1.5 leading-snug">Setrika Uap Selesai</p>
              </div>
            </div>

            {/* Card 3: Customer Rating Card (Left Bottom) */}
            <div
              style={{
                transform: `translate3d(${-135 + mousePos.x * -25}px, ${140 + mousePos.y * 25}px, 65px)`,
                transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="absolute glass-card px-4 py-3.5 rounded-2xl shadow-xl w-52 animate-float-fast text-left pointer-events-none select-none space-y-1.5"
            >
              <div className="flex text-amber-400 gap-0.5 leading-none">
                <Star className="w-3 h-3 fill-amber-400" />
                <Star className="w-3 h-3 fill-amber-400" />
                <Star className="w-3 h-3 fill-amber-400" />
                <Star className="w-3 h-3 fill-amber-400" />
                <Star className="w-3 h-3 fill-amber-400" />
              </div>
              <p className="text-[10px] font-medium text-deep-navy/80 italic leading-relaxed">
                "Hasil setrika rapi sekali dan wangi segar tahan lama."
              </p>
              <p className="text-[8px] font-bold text-deep-navy/40 tracking-wider uppercase">- Ranti, Customer</p>
            </div>

            {/* Card 4: Revenue Dashboard Card (Right Top) */}
            <div
              style={{
                transform: `translate3d(${135 + mousePos.x * 35}px, ${-180 + mousePos.y * -20}px, 45px)`,
                transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="absolute glass-card px-4 py-3.5 rounded-2xl shadow-xl w-56 animate-float-slow text-left pointer-events-none select-none space-y-2"
            >
              <div className="flex justify-between items-center leading-none">
                <span className="text-[9px] uppercase font-mono tracking-widest text-deep-navy/55 font-bold">Finansial Admin</span>
                <span className="text-[8px] bg-emerald-500/10 text-emerald-500 px-1 py-0.5 rounded font-extrabold flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> +12%
                </span>
              </div>
              <div>
                <p className="text-[9px] text-deep-navy/50">Pendapatan Hari Ini</p>
                <p className="text-base font-display font-black text-deep-navy">Rp 1.250.000</p>
              </div>
            </div>

            {/* Card 5: Discount Card / QR Scan (Right Bottom) */}
            <div
              style={{
                transform: `translate3d(${110 + mousePos.x * -15}px, ${200 + mousePos.y * -15}px, 55px)`,
                transition: isHovered ? 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)' : 'transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
              }}
              className="absolute glass-card px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 w-52 animate-float-medium text-left pointer-events-none select-none border-soft-coral/30"
            >
              <div className="w-9 h-9 rounded-xl bg-soft-coral/15 flex items-center justify-center text-soft-coral shrink-0">
                <Tag className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-[9px] uppercase font-mono tracking-widest text-soft-coral font-bold leading-none">Promosi Aktif</p>
                <p className="text-xs font-bold text-deep-navy mt-1.5 leading-snug">Gratis Ongkir Jemput</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section with Hover Glow & Animation */}
      <section id="fitur" className="py-32 px-8 max-w-6xl mx-auto w-full border-t border-deep-navy/10 relative bg-transparent">
        <div className="absolute top-0 right-1/4 w-72 h-72 rounded-full bg-rose-pink/5 blur-[100px] pointer-events-none" />
        <div className="absolute -left-16 top-1/3 w-80 h-80 rounded-full bg-soft-coral/5 blur-[120px] pointer-events-none" />
        <div className="absolute right-0 bottom-1/4 w-96 h-96 rounded-full bg-deep-navy/[0.03] blur-[150px] pointer-events-none" />

        <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
          <p className="text-soft-coral font-extrabold text-xs tracking-[0.3em] uppercase">Fitur Aplikasi</p>
          <h2 className="font-display font-black text-3xl md:text-5xl text-deep-navy leading-tight">Solusi Digital Lengkap</h2>
          <p className="text-deep-navy/60 text-sm md:text-base leading-relaxed">
            Didesain khusus untuk menyederhanakan ekosistem laundry, menghubungkan pelanggan, kurir, dan admin secara instan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="group relative rounded-3xl p-8 bg-white/55 backdrop-blur-md border border-white/50 shadow-md transition-all duration-350 hover:-translate-y-2 hover:rotate-[0.5deg] hover:border-soft-coral/45 hover:shadow-xl hover:shadow-soft-coral/10 overflow-hidden flex flex-col justify-between h-full min-h-[260px]">

                  {/* Subtle hover background accent glow */}
                  <div className="absolute -right-12 -bottom-12 w-28 h-28 bg-soft-coral/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />

                  <div className="space-y-5">
                    {/* Icon frame */}
                    <div className={`w-12 h-12 rounded-2xl ${feat.color} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12`}>
                      <IconComponent className="w-5.5 h-5.5" />
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-deep-navy group-hover:text-soft-coral transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-deep-navy/65 text-xs md:text-sm leading-relaxed font-body">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Gallery Section with 3D Parallax */}
      <section
        id="galeri"
        onMouseMove={handleGalleryMouseMove}
        onMouseEnter={handleGalleryMouseEnter}
        onMouseLeave={handleGalleryMouseLeave}
        className="py-32 px-8 border-t border-deep-navy/10 relative overflow-hidden"
      >
        {/* Ambient Backgrounds */}
        <div
          style={{
            transform: `translate3d(${galleryMousePos.x * 25}px, ${galleryMousePos.y * 25}px, 0)`,
            transition: isGalleryHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out'
          }}
          className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-soft-coral/5 blur-[120px] pointer-events-none z-0"
        />
        <div
          style={{
            transform: `translate3d(${galleryMousePos.x * -25}px, ${galleryMousePos.y * -25}px, 0)`,
            transition: isGalleryHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out'
          }}
          className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-rose-pink/8 blur-[100px] pointer-events-none z-0"
        />

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-24 space-y-4">
            <p className="text-soft-coral font-extrabold text-xs tracking-[0.3em] uppercase">Proses Alur Kerja</p>
            <h2 className="font-display font-black text-3xl md:text-5xl text-deep-navy leading-tight">Galeri Operasional</h2>
            <p className="text-deep-navy/60 text-xs md:text-sm leading-relaxed font-body">
              Saksikan perjalanan kebersihan pakaian Anda melalui alur kerja terstruktur berstandar mutu tinggi.
            </p>
          </div>

          {/* Overlapping, Uneven Parallax Grid */}
          <div
            className="relative flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-0 min-h-[580px] w-full"
            style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
          >
            {/* Stage 1: Left Card */}
            <GalleryCard
              photo={galleryPhotos[0]}
              stageNum="01"
              zIndexClass="z-20"
              translateZ="30"
              mouseOffsetMultiplier={{ x: -14, y: -14 }}
              styleOffsetDesktop="w-full max-w-[320px] lg:-mr-4 lg:-mt-12"
              isGalleryHovered={isGalleryHovered}
              galleryMousePos={galleryMousePos}
              revealType="left"
            />

            {/* Stage 2: Center Card - Larger and closer */}
            <GalleryCard
              photo={galleryPhotos[1]}
              stageNum="02"
              zIndexClass="z-30"
              translateZ="70"
              mouseOffsetMultiplier={{ x: 22, y: 22 }}
              styleOffsetDesktop="w-full max-w-[380px] lg:scale-105"
              isGalleryHovered={isGalleryHovered}
              galleryMousePos={galleryMousePos}
              revealType="center"
            />

            {/* Stage 3: Right Card */}
            <GalleryCard
              photo={galleryPhotos[2]}
              stageNum="03"
              zIndexClass="z-10"
              translateZ="10"
              mouseOffsetMultiplier={{ x: -10, y: 12 }}
              styleOffsetDesktop="w-full max-w-[320px] lg:-ml-4 lg:mt-12"
              isGalleryHovered={isGalleryHovered}
              galleryMousePos={galleryMousePos}
              revealType="right"
            />
          </div>
        </div>
      </section>

      {/* Guide / How to Use Horizontal Timeline Section */}
      <section
        id="panduan"
        onMouseMove={handleWorkflowMouseMove}
        onMouseEnter={handleWorkflowMouseEnter}
        onMouseLeave={handleWorkflowMouseLeave}
        className="py-32 border-t border-deep-navy/10 relative overflow-hidden w-full select-none bg-transparent"
      >
        {/* Layer 1: Blurred gradient mesh background (Moves 2px) */}
        <div
          style={{
            transform: `translate3d(${workflowMousePos.x * 2}px, ${workflowMousePos.y * 2 + scrollY * 0.05}px, 0)`,
            transition: isWorkflowHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out'
          }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          {/* Floating light source 1: Soft Pink */}
          <div className="absolute top-[10%] left-[15%] w-96 h-96 rounded-full bg-soft-coral/[0.22] blur-[150px] animate-orb-pink" />
          {/* Floating light source 2: Navy Glow */}
          <div className="absolute bottom-[20%] right-[10%] w-[420px] h-[420px] rounded-full bg-deep-navy/[0.14] blur-[180px] animate-orb-navy" />
          {/* Floating light source 3: Warm White */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-white/[0.16] blur-[140px] animate-orb-white" />
        </div>

        {/* Layer 2: Translucent shapes (Moves 5px) */}
        <div
          style={{
            transform: `translate3d(${workflowMousePos.x * 5}px, ${workflowMousePos.y * 5 + scrollY * -0.06}px, 0)`,
            transition: isWorkflowHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out'
          }}
          className="absolute inset-0 pointer-events-none z-0 opacity-15"
        >
          <div className="absolute top-[20%] left-[40%] w-32 h-32 rounded-full border border-deep-navy/5" />
          <div className="absolute bottom-[30%] left-[10%] w-48 h-48 rounded-full border-2 border-dashed border-soft-coral/5" />
          <div className="absolute top-[50%] right-[25%] w-24 h-24 rounded-lg border border-rose-pink/5 rotate-45" />
        </div>

        {/* Layer 3: Floating 3D Vector Objects (Moves 10px) */}
        <div
          style={{
            transform: `translate3d(${workflowMousePos.x * 10}px, ${workflowMousePos.y * 10 + scrollY * -0.08}px, 0)`,
            transition: isWorkflowHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out'
          }}
          className="absolute inset-0 pointer-events-none z-0 hidden lg:block"
        >
          {/* Smartphone wireframe */}
          <div className="absolute left-[7%] top-[10%] animate-float-3d">
            <svg className="w-16 h-28 opacity-[0.22] text-deep-navy stroke-current stroke-[1.5]" viewBox="0 0 100 160" fill="none">
              <rect x="10" y="10" width="80" height="140" rx="12" />
              <line x1="30" y1="20" x2="70" y2="20" />
              <circle cx="50" cy="140" r="6" />
            </svg>
          </div>

          {/* Location Pin */}
          <div className="absolute left-[38%] top-[12%] animate-float-3d animate-delay-200">
            <svg className="w-10 h-10 opacity-[0.25] text-soft-coral stroke-current stroke-[1.5]" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </div>

          {/* QR Code Cube */}
          <div className="absolute right-[33%] bottom-[15%] animate-float-3d animate-delay-500">
            <svg className="w-14 h-14 opacity-[0.20] text-deep-navy stroke-current stroke-[1.5]" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="2" width="8" height="8" rx="1" />
              <rect x="14" y="2" width="8" height="8" rx="1" />
              <rect x="2" y="14" width="8" height="8" rx="1" />
              <rect x="14" y="14" width="8" height="8" rx="1" />
              <path d="M 6 6 H 6.01 M 18 6 H 18.01 M 6 18 H 6.01 M 18 18 H 18.01" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>

          {/* Notification bubble */}
          <div className="absolute left-[24%] bottom-[12%] animate-float-3d animate-delay-300">
            <svg className="w-12 h-12 opacity-[0.22] text-rose-pink stroke-current stroke-[1.5]" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          {/* Folded Clothes */}
          <div className="absolute right-[8%] top-[15%] animate-float-3d animate-delay-400">
            <svg className="w-16 h-16 opacity-[0.22] text-deep-navy stroke-current stroke-[1.5]" viewBox="0 0 64 64" fill="none">
              <path d="M8 24 L32 12 L56 24 L32 36 Z" />
              <path d="M8 34 L32 46 L56 34" />
              <path d="M8 44 L32 56 L56 44" />
            </svg>
          </div>

          {/* Laundry Basket */}
          <div className="absolute left-[62%] top-[8%] animate-float-3d animate-delay-100">
            <svg className="w-14 h-14 opacity-[0.18] text-deep-navy stroke-current stroke-[1.5]" viewBox="0 0 64 64" fill="none">
              <path d="M12 16 H52 L46 52 H18 Z" />
              <path d="M8 16 H56" strokeWidth="2.5" />
            </svg>
          </div>

          {/* Fabric ribbons */}
          <div className="absolute left-[45%] bottom-[8%] opacity-[0.22] text-rose-pink">
            <svg className="w-40 h-16" viewBox="0 0 200 60" fill="none">
              <path d="M 0,30 C 50,0 100,60 200,30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-ribbon" />
            </svg>
          </div>
        </div>

        {/* Layer 5: Glass Particles drifting (Moves 20px) */}
        <div
          style={{
            transform: `translate3d(${workflowMousePos.x * 20}px, ${workflowMousePos.y * 20 + scrollY * -0.1}px, 0)`,
            transition: isWorkflowHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out'
          }}
          className="absolute inset-0 pointer-events-none z-0 opacity-40 hidden lg:block"
        >
          {/* Glass particles */}
          {[
            { id: 1, left: '8%', top: '25%', size: 'w-2 h-2', delay: '0s', duration: '18s' },
            { id: 2, left: '16%', top: '70%', size: 'w-3 h-3', delay: '3s', duration: '22s' },
            { id: 3, left: '26%', top: '15%', size: 'w-1.5 h-1.5', delay: '1s', duration: '15s' },
            { id: 4, left: '38%', top: '60%', size: 'w-2 h-2', delay: '5s', duration: '20s' },
            { id: 5, left: '46%', top: '80%', size: 'w-2.5 h-2.5', delay: '2s', duration: '17s' },
            { id: 6, left: '58%', top: '20%', size: 'w-2 h-2', delay: '7s', duration: '24s' },
            { id: 7, left: '66%', top: '65%', size: 'w-1.5 h-1.5', delay: '4s', duration: '16s' },
            { id: 8, left: '76%', top: '10%', size: 'w-3 h-3', delay: '6s', duration: '21s' },
            { id: 9, left: '86%', top: '75%', size: 'w-2 h-2', delay: '8s', duration: '19s' },
            { id: 10, left: '94%', top: '30%', size: 'w-2.5 h-2.5', delay: '1.5s', duration: '23s' }
          ].map(p => (
            <div
              key={p.id}
              style={{
                left: p.left,
                top: p.top,
                animationDelay: p.delay,
                animationDuration: p.duration
              }}
              className={`absolute ${p.size} rounded-full bg-white/45 backdrop-blur-[2px] border border-white/50 animate-particle-drift shadow-[0_4px_16px_rgba(255,255,255,0.4),_0_2px_4px_rgba(23,23,45,0.05)] pointer-events-none`}
            />
          ))}
        </div>

        {/* Layer 6: Front Large Blurs follow mouse directly (Moves 25px) */}
        <div
          style={{
            transform: `translate3d(${workflowMousePos.x * 25}px, ${workflowMousePos.y * 25}px, 0)`,
            transition: isWorkflowHovered ? 'transform 0.12s ease-out' : 'transform 0.8s ease-out'
          }}
          className="absolute inset-0 pointer-events-none z-0"
        >
          <div className="absolute top-[40%] left-[20%] w-[350px] h-[350px] rounded-full bg-soft-coral/[0.08] blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[30%] right-[20%] w-[350px] h-[350px] rounded-full bg-rose-pink/[0.1] blur-[120px] mix-blend-screen" />
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
          <div className="text-center max-w-xl mx-auto mb-28 space-y-4">
            <p className="text-soft-coral font-extrabold text-xs tracking-[0.3em] uppercase">Alur Kerja Ekosistem</p>
            <h2 className="font-display font-black text-3xl md:text-5xl text-deep-navy leading-tight">Perjalanan Cucian Anda</h2>
            <p className="text-deep-navy/60 text-xs md:text-sm leading-relaxed font-body">
              Bagaimana LaundryKu secara harmonis menghubungkan pesanan Anda dari jemputan hingga selesai dikerjakan secara profesional.
            </p>
          </div>

          {/* Layer 4: SVG Connector Path for Desktop Layout (Moves 15px) */}
          <div
            style={{
              transform: `translate3d(${workflowMousePos.x * 15}px, ${workflowMousePos.y * 15 + scrollY * 0.02}px, 0)`,
              transition: isWorkflowHovered ? 'transform 0.15s ease-out' : 'transform 0.8s ease-out'
            }}
            className="absolute inset-0 pointer-events-none z-0 hidden lg:block overflow-visible mt-[290px] left-10 right-10"
          >
            <svg className="w-full h-24 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M 120,48 C 220,48 240,96 360,96 C 480,96 520,0 640,0 C 760,0 800,96 920,96 C 1040,96 1080,48 1160,48"
                stroke="url(#gradient-path)"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-route-dash"
              />
              <path
                d="M 120,48 C 220,48 240,96 360,96 C 480,96 520,0 640,0 C 760,0 800,96 920,96 C 1040,96 1080,48 1160,48"
                stroke="#FF6B81"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.15"
              />
              <defs>
                <linearGradient id="gradient-path" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF6B81" />
                  <stop offset="50%" stopColor="#FF8FA3" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Desktop Horizontal Workflow Tour */}
          <div className="hidden lg:flex relative flex-row items-center justify-between gap-6 min-h-[380px] w-full z-10" style={{ transformStyle: 'preserve-3d' }}>
            {/* Step 1 */}
            <WorkflowCard
              step="01"
              title="Customer Pesan"
              desc="Order 1-tap via smartphone. WA otomatis terhubung."
              icon={Smartphone}
              isWorkflowHovered={isWorkflowHovered}
              workflowMousePos={workflowMousePos}
              mouseOffsetMultiplier={{ x: -14, y: -14 }}
              delay={100}
              iconChildren={<span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-soft-coral border border-white animate-pulse-ring" />}
            />

            {/* Step 2 */}
            <WorkflowCard
              step="02"
              title="Admin Alokasi"
              desc="Validasi orderan, input berat, dan tugaskan kurir."
              icon={Layers}
              isWorkflowHovered={isWorkflowHovered}
              workflowMousePos={workflowMousePos}
              mouseOffsetMultiplier={{ x: 20, y: -10 }}
              delay={250}
              iconChildren={
                <div className="absolute bottom-2.5 right-3.5 flex gap-0.5 items-end h-3 z-20">
                  <span className="w-1 bg-soft-coral rounded-sm animate-grow-bar-1" style={{ height: '8px' }} />
                  <span className="w-1 bg-soft-coral rounded-sm animate-grow-bar-2" style={{ height: '12px' }} />
                  <span className="w-1 bg-soft-coral rounded-sm animate-grow-bar-3" style={{ height: '6px' }} />
                </div>
              }
            />

            {/* Step 3 */}
            <WorkflowCard
              step="03"
              title="Kurir Penjemputan"
              desc="Kurir berangkat menjemput pakaian dipandu arah peta live."
              icon={Truck}
              isWorkflowHovered={isWorkflowHovered}
              workflowMousePos={workflowMousePos}
              mouseOffsetMultiplier={{ x: -10, y: 15 }}
              delay={400}
              iconChildren={
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 64 64">
                  <path d="M 12 45 Q 32 30 52 45" stroke="#FF6B81" strokeWidth="2" fill="none" className="animate-route-dash" />
                </svg>
              }
            />

            {/* Step 4 */}
            <WorkflowCard
              step="04"
              title="Proses Cuci"
              desc="Pakaian dicuci higienis, setrika uap, dan dilipat rapi."
              icon={Activity}
              isWorkflowHovered={isWorkflowHovered}
              workflowMousePos={workflowMousePos}
              mouseOffsetMultiplier={{ x: 12, y: -12 }}
              delay={550}
              iconChildren={
                <>
                  <span className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full bg-soft-coral/40 animate-steam-1" />
                  <span className="absolute top-1 right-4 w-2 h-2 rounded-full bg-soft-coral/40 animate-steam-2" />
                  <span className="absolute top-3 right-2 w-1.5 h-1.5 rounded-full bg-soft-coral/40 animate-steam-3" />
                  <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                    <div className="w-10 h-10 rounded-full border border-dashed border-soft-coral/30" />
                  </div>
                </>
              }
            />

            {/* Step 5 */}
            <WorkflowCard
              step="05"
              title="Pesanan Tiba"
              desc="Kurir mengantar pakaian bersih & wangi ke alamat Anda."
              icon={Truck}
              isWorkflowHovered={isWorkflowHovered}
              workflowMousePos={workflowMousePos}
              mouseOffsetMultiplier={{ x: -14, y: -18 }}
              delay={700}
              iconChildren={
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <span className="absolute w-12 h-12 rounded-full bg-emerald-500/10 animate-ping opacity-75" />
                </div>
              }
              iconBg="bg-emerald-500/10 text-emerald-500"
              stepColor="text-emerald-500"
            />
          </div>

          {/* Mobile Vertical Timeline */}
          <div className="lg:hidden relative pl-8 space-y-12 w-full text-left">
            {/* Vertical dashed connector line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-deep-navy/15 z-0"></div>

            {/* Mobile Step 1 */}
            <div className="relative">
              <span className="absolute left-[-23px] top-5 w-3.5 h-3.5 rounded-full bg-soft-coral border-[3px] border-warm-ivory z-10"></span>
              <WorkflowCard
                step="01"
                title="Customer Pesan"
                desc="Order 1-tap via smartphone. WA otomatis terhubung."
                icon={Smartphone}
                isWorkflowHovered={false}
                workflowMousePos={workflowMousePos}
                mouseOffsetMultiplier={{ x: 0, y: 0 }}
                delay={0}
                iconChildren={<span className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-soft-coral border border-white animate-pulse-ring" />}
                styleOffsetDesktop="max-w-full"
              />
            </div>

            {/* Mobile Step 2 */}
            <div className="relative">
              <span className="absolute left-[-23px] top-5 w-3.5 h-3.5 rounded-full bg-soft-coral border-[3px] border-warm-ivory z-10"></span>
              <WorkflowCard
                step="02"
                title="Admin Alokasi"
                desc="Validasi orderan, input berat, dan tugaskan kurir."
                icon={Layers}
                isWorkflowHovered={false}
                workflowMousePos={workflowMousePos}
                mouseOffsetMultiplier={{ x: 0, y: 0 }}
                delay={0}
                iconChildren={
                  <div className="absolute bottom-2.5 right-3.5 flex gap-0.5 items-end h-3 z-20">
                    <span className="w-1 bg-soft-coral rounded-sm animate-grow-bar-1" style={{ height: '8px' }} />
                    <span className="w-1 bg-soft-coral rounded-sm animate-grow-bar-2" style={{ height: '12px' }} />
                    <span className="w-1 bg-soft-coral rounded-sm animate-grow-bar-3" style={{ height: '6px' }} />
                  </div>
                }
                styleOffsetDesktop="max-w-full"
              />
            </div>

            {/* Mobile Step 3 */}
            <div className="relative">
              <span className="absolute left-[-23px] top-5 w-3.5 h-3.5 rounded-full bg-soft-coral border-[3px] border-warm-ivory z-10"></span>
              <WorkflowCard
                step="03"
                title="Kurir Penjemputan"
                desc="Kurir berangkat menjemput pakaian dipandu arah peta live."
                icon={Truck}
                isWorkflowHovered={false}
                workflowMousePos={workflowMousePos}
                mouseOffsetMultiplier={{ x: 0, y: 0 }}
                delay={0}
                iconChildren={
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 64 64">
                    <path d="M 12 45 Q 32 30 52 45" stroke="#FF6B81" strokeWidth="2" fill="none" className="animate-route-dash" />
                  </svg>
                }
                styleOffsetDesktop="max-w-full"
              />
            </div>

            {/* Mobile Step 4 */}
            <div className="relative">
              <span className="absolute left-[-23px] top-5 w-3.5 h-3.5 rounded-full bg-soft-coral border-[3px] border-warm-ivory z-10"></span>
              <WorkflowCard
                step="04"
                title="Proses Cuci"
                desc="Pakaian dicuci higienis, setrika uap, dan dilipat rapi."
                icon={Activity}
                isWorkflowHovered={false}
                workflowMousePos={workflowMousePos}
                mouseOffsetMultiplier={{ x: 0, y: 0 }}
                delay={0}
                iconChildren={
                  <>
                    <span className="absolute top-2 left-3 w-1.5 h-1.5 rounded-full bg-soft-coral/40 animate-steam-1" />
                    <span className="absolute top-1 right-4 w-2 h-2 rounded-full bg-soft-coral/40 animate-steam-2" />
                    <span className="absolute top-3 right-2 w-1.5 h-1.5 rounded-full bg-soft-coral/40 animate-steam-3" />
                    <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                      <div className="w-10 h-10 rounded-full border border-dashed border-soft-coral/30" />
                    </div>
                  </>
                }
                styleOffsetDesktop="max-w-full"
              />
            </div>

            {/* Mobile Step 5 */}
            <div className="relative">
              <span className="absolute left-[-23px] top-5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-[3px] border-warm-ivory z-10"></span>
              <WorkflowCard
                step="05"
                title="Pesanan Tiba"
                desc="Kurir mengantar pakaian bersih & wangi ke alamat Anda."
                icon={Truck}
                isWorkflowHovered={false}
                workflowMousePos={workflowMousePos}
                mouseOffsetMultiplier={{ x: 0, y: 0 }}
                delay={0}
                iconChildren={
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <span className="absolute w-12 h-12 rounded-full bg-emerald-500/10 animate-ping opacity-75" />
                  </div>
                }
                iconBg="bg-emerald-500/10 text-emerald-500"
                stepColor="text-emerald-500"
                styleOffsetDesktop="max-w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-deep-navy text-warm-ivory/50 py-16 text-center text-xs mt-auto">
        <div className="max-w-6xl mx-auto px-8 space-y-5">
          <div className="flex justify-center items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-warm-ivory flex items-center justify-center font-display font-black text-deep-navy shadow-sm">
              LK
            </div>
            <p className="font-display font-black text-white text-sm">LundryKu Laundry Ecosystem</p>
          </div>
          <p className="max-w-md mx-auto text-white/40 leading-relaxed">
            Sistem manajemen cucian modern terintegrasi secara dinamis untuk performa mobile smartphone.
          </p>
          <div className="pt-6 border-t border-white/5">
            <p>© 2026 LundryKu. Hak Cipta Dilindungi.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
