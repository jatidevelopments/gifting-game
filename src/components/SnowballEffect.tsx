import { motion, AnimatePresence, usePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';

interface Snowball {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  velocity: {
    x: number;
    y: number;
  };
  rotation: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  velocity: {
    x: number;
    y: number;
  };
}

function getRandomEdgePosition() {
  const edge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
  const width = window.innerWidth;
  const height = window.innerHeight;

  switch (edge) {
    case 0: // top
      return { x: Math.random() * width, y: -50 };
    case 1: // right
      return { x: width + 50, y: Math.random() * height };
    case 2: // bottom
      return { x: Math.random() * width, y: height + 50 };
    case 3: // left
      return { x: -50, y: Math.random() * height };
    default:
      return { x: 0, y: 0 };
  }
}

function calculateVelocity(startX: number, startY: number, endX: number, endY: number) {
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  return {
    x: (dx / distance) * 30, // Increased speed multiplier
    y: (dy / distance) * 30
  };
}

interface SnowballComponentProps {
  snowball: Snowball;
  onComplete: () => void;
  createParticles: (x: number, y: number) => void;
}

const SnowballComponent = ({ snowball, onComplete, createParticles }: SnowballComponentProps) => {
  const [isPresent, safeToRemove] = usePresence();
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [isSticking, setIsSticking] = useState(false);
  
  useEffect(() => {
    if (!isPresent) {
      safeToRemove();
    }
  }, [isPresent, safeToRemove]);

  useEffect(() => {
    if (hasReachedEnd) {
      const stickDuration = 800 + Math.random() * 400; // Random duration between 0.8-1.2 seconds
      const timeout = setTimeout(() => {
        setIsSticking(false);
      }, stickDuration);
      return () => clearTimeout(timeout);
    }
  }, [hasReachedEnd]);

  return (
    <motion.div
      key={snowball.id}
      initial={{ 
        x: snowball.startX,
        y: snowball.startY,
        scale: 0.2,
        opacity: 0,
        rotate: 0
      }}
      animate={
        !hasReachedEnd 
          ? {
              x: snowball.endX,
              y: snowball.endY,
              scale: [0.2, 1],
              opacity: [0, 1],
              rotate: snowball.rotation
            }
          : isSticking
          ? {
              x: snowball.endX,
              y: snowball.endY,
              scale: 1,
              opacity: 1,
              rotate: snowball.rotation
            }
          : {
              x: snowball.endX,
              y: snowball.endY,
              scale: 1,
              opacity: 0,
              rotate: snowball.rotation,
              transition: { 
                opacity: { duration: 0.2, ease: "easeOut" },
                scale: { duration: 0.2, ease: "easeOut" }
              }
            }
      }
      transition={!hasReachedEnd ? {
        duration: 0.4,
        ease: "linear"
      } : {
        duration: 0.15,
        ease: "easeOut"
      }}
      onAnimationComplete={() => {
        if (!hasReachedEnd) {
          setHasReachedEnd(true);
          setIsSticking(true);
          createParticles(snowball.endX, snowball.endY);
        } else if (!isSticking) {
          onComplete();
        }
      }}
      className="absolute select-none"
      style={{ 
        width: 24,
        height: 24,
        marginLeft: -12,
        marginTop: -12,
        willChange: 'transform',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
      }}
    >
      <div 
        className="w-full h-full rounded-full relative"
        style={{
          background: 'radial-gradient(circle at 35% 35%, #ffffff 0%, #f0f0f0 60%, rgba(240, 240, 240, 0.5) 100%)',
          boxShadow: 'inset -2px -2px 4px rgba(0, 0, 0, 0.1)',
          filter: 'blur(0.5px)',
        }}
      >
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 60%)',
            mixBlendMode: 'overlay'
          }}
        />
      </div>
    </motion.div>
  );
};

export function SnowballEffect() {
  const [snowballs, setSnowballs] = useState<Snowball[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [nextId, setNextId] = useState(0);
  const cleanupTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const createParticles = useCallback((x: number, y: number) => {
    const newParticles: Particle[] = Array.from({ length: 12 }).map((_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      return {
        id: nextId + i,
        x,
        y,
        size: 2 + Math.random() * 3,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        },
      };
    });

    setNextId(prev => prev + newParticles.length);
    setParticles(prev => [...prev, ...newParticles]);

    const timeout = setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.includes(p)));
    }, 400);

    cleanupTimeoutRef.current.push(timeout);
  }, [nextId]);

  const handleSnowballComplete = useCallback((id: number) => {
    setSnowballs(prev => prev.filter(s => s.id !== id));
  }, []);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const endX = e.clientX;
      const endY = e.clientY;
      const startPos = getRandomEdgePosition();
      const velocity = calculateVelocity(startPos.x, startPos.y, endX, endY);
      const rotation = Math.random() * 720 - 360; // Random rotation between -360 and 360 degrees
      
      const newSnowball = {
        id: nextId,
        startX: startPos.x,
        startY: startPos.y,
        endX,
        endY,
        velocity,
        rotation
      };

      setNextId(prev => prev + 1);
      setSnowballs(prev => [...prev, newSnowball]);
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      cleanupTimeoutRef.current.forEach(clearTimeout);
    };
  }, [nextId]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <AnimatePresence>
        {snowballs.map(snowball => (
          <SnowballComponent
            key={snowball.id}
            snowball={snowball}
            onComplete={() => handleSnowballComplete(snowball.id)}
            createParticles={createParticles}
          />
        ))}
      </AnimatePresence>
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute bg-white rounded-full"
          initial={{
            x: particle.x,
            y: particle.y,
            scale: 1,
            opacity: 1
          }}
          animate={{
            x: particle.x + particle.velocity.x * 20,
            y: particle.y + particle.velocity.y * 20,
            scale: 0,
            opacity: 0
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut"
          }}
          style={{
            width: particle.size,
            height: particle.size,
            marginLeft: -particle.size / 2,
            marginTop: -particle.size / 2
          }}
        />
      ))}
    </div>
  );
}
