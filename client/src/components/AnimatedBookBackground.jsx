import React from 'react';

// Cafe reading theme: animated cozy icons and bookish elements
const cafeElements = [
  { type: 'emoji', value: '☕', label: 'Coffee' },
  { type: 'emoji', value: '📚', label: 'Books' },
  { type: 'emoji', value: '🪑', label: 'Chair' },
  { type: 'emoji', value: '🍰', label: 'Cake' },
  { type: 'emoji', value: '🕯️', label: 'Candle' },
  { type: 'emoji', value: '🧣', label: 'Scarf' },
  { type: 'emoji', value: '📝', label: 'Notebook' },
  { type: 'emoji', value: '🧁', label: 'Cupcake' },
  { type: 'emoji', value: '🎧', label: 'Headphones' },
  { type: 'emoji', value: '📖', label: 'Open Book' },
  { type: 'emoji', value: '🛋️', label: 'Sofa' },
  { type: 'emoji', value: '🌿', label: 'Plant' },
  { type: 'emoji', value: '🕰️', label: 'Clock' },
  { type: 'emoji', value: '🧋', label: 'Boba' },
  { type: 'emoji', value: '🥐', label: 'Croissant' },
];

function getRandomStyle(idx) {
  const top = Math.random() * 90;
  const left = Math.random() * 90;
  const delay = Math.random() * 10;
  const duration = 18 + Math.random() * 8;
  const fontSize = 1.8 + Math.random() * 2.2;
  const opacity = 0.13 + Math.random() * 0.10;
  const rotations = ['-10deg', '0deg', '10deg', '5deg', '-5deg'];
  const rotation = rotations[idx % rotations.length];
  return {
    position: 'absolute',
    top: `${top}%`,
    left: `${left}%`,
    fontSize: `${fontSize}rem`,
    opacity,
    pointerEvents: 'none',
    userSelect: 'none',
    filter: 'blur(0.2px)',
    transform: `rotate(${rotation})`,
    animation: `cafeFloat ${duration}s linear infinite`,
    animationDelay: `${delay}s`,
    zIndex: 0,
    transition: 'opacity 0.5s',
  };
}

const AnimatedBookBackground = () => (
  <div style={{
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    zIndex: 0,
    pointerEvents: 'none',
    background: 'radial-gradient(circle at 60% 40%, #f3e7d4 60%, #e5c9a5 100%)',
  }}>
    <style>{`
      @keyframes cafeFloat {
        0% { opacity: 0; transform: translateY(20px) scale(1) rotate(0deg); }
        10% { opacity: 1; }
        50% { opacity: 1; transform: translateY(-12px) scale(1.08) rotate(2deg); }
        80% { opacity: 1; }
        100% { opacity: 0; transform: translateY(-40px) scale(1.12) rotate(-2deg); }
      }
    `}</style>
    {Array.from({ length: 22 }).map((_, idx) => {
      const el = cafeElements[idx % cafeElements.length];
      return (
        <span key={el.value + idx} style={getRandomStyle(idx)} aria-label={el.label} title={el.label}>
          {el.value}
        </span>
      );
    })}
  </div>
);

export default AnimatedBookBackground;
