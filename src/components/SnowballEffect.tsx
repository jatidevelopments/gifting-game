import { motion, AnimatePresence, usePresence } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';

interface Snowball {
  id: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  controlPoint: {
    x: number;
    y: number;
  };
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

function generateControlPoint(startX: number, startY: number, endX: number, endY: number) {
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Calculate midpoint
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Calculate perpendicular vector
  const perpX = -dy / distance;
  const perpY = dx / distance;
  
  // Adjust curve height based on distance
  const curveHeight = distance * 0.2;
  
  // Move control point slightly towards the start for more natural throw
  return {
    x: midX + perpX * curveHeight - dx * 0.1,
    y: midY + perpY * curveHeight - dy * 0.1
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
  
  useEffect(() => {
    if (!isPresent) {
      safeToRemove();
    }
  }, [isPresent, safeToRemove]);

  return (
    <motion.div
      key={snowball.id}
      initial={{ 
        x: snowball.startX,
        y: snowball.startY,
        scale: 0.2,
        opacity: 0
      }}
      animate={
        hasReachedEnd 
          ? {
              scale: 0,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeOut" }
            }
          : {
              x: [
                snowball.startX,
                snowball.controlPoint.x,
                snowball.endX
              ],
              y: [
                snowball.startY,
                snowball.controlPoint.y,
                snowball.endY
              ],
              scale: [0.2, 1, 1],
              opacity: [0, 1, 1],
              rotate: [0, 180, 360]
            }
      }
      transition={{
        duration: 0.8,
        times: [0, 0.4, 1],
        ease: "easeOut"
      }}
      onAnimationComplete={() => {
        if (!hasReachedEnd) {
          setHasReachedEnd(true);
          // Create particles exactly when snowball reaches end
          createParticles(snowball.endX, snowball.endY);
        } else {
          onComplete();
        }
      }}
      className="absolute"
      style={{ 
        width: 20,
        height: 20,
        marginLeft: -10,
        marginTop: -10,
        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
      }}
    >
      <div className="w-full h-full rounded-full bg-white" />
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
      const speed = 1 + Math.random() * 2; // Faster particles
      return {
        id: nextId + i,
        x,
        y,
        size: 3 + Math.random() * 4,
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
    }, 500); // Shorter duration for snappier effect

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
      
      const newSnowball = {
        id: nextId,
        startX: startPos.x,
        startY: startPos.y,
        endX,
        endY,
        controlPoint: generateControlPoint(startPos.x, startPos.y, endX, endY)
      };

      setNextId(prev => prev + 1);
      setSnowballs(prev => [...prev, newSnowball]);
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      cleanupTimeoutRef.current.forEach(timeout => clearTimeout(timeout));
      cleanupTimeoutRef.current = [];
    };
  }, [nextId, createParticles]);

  return (
    <div className="fixed inset-0 pointer-events-none">
      <AnimatePresence>
        {snowballs.map((snowball) => (
          <SnowballComponent 
            key={snowball.id}
            snowball={snowball}
            onComplete={() => handleSnowballComplete(snowball.id)}
            createParticles={createParticles}
          />
        ))}

        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 1,
              scale: 1
            }}
            animate={{
              x: particle.x + particle.velocity.x * 60,
              y: particle.y + particle.velocity.y * 60,
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut"
            }}
            className="absolute"
            style={{ 
              width: particle.size,
              height: particle.size,
              marginLeft: -particle.size / 2,
              marginTop: -particle.size / 2,
              background: 'white',
              borderRadius: '50%',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
