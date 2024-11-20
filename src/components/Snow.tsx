import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Snowflake {
  id: number;
  x: number;
  delay: number;
  size: number;
  duration: number;
  initialX: number;
  finalX: number;
}

export function Snow() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes = Array.from({ length: 100 }, (_, i) => {
      const initialX = Math.random() * 100; // Random starting X position (0-100%)
      return {
        id: i,
        x: initialX,
        initialX,
        finalX: initialX + (Math.random() * 20 - 10), // Random ending X position (±10% from start)
        delay: Math.random() * 5, // Random delay (0-5s)
        size: Math.random() * 4 + 2, // Random size (2-6px)
        duration: Math.random() * 5 + 10, // Random duration (10-15s)
      };
    });
    setSnowflakes(flakes);

    // Recreate snowflakes periodically to maintain even distribution
    const interval = setInterval(() => {
      setSnowflakes(prev => {
        const newFlakes = [...prev];
        for (let i = 0; i < 10; i++) { // Add 10 new flakes
          const initialX = Math.random() * 100;
          newFlakes.push({
            id: Math.random(), // New unique ID
            x: initialX,
            initialX,
            finalX: initialX + (Math.random() * 20 - 10),
            delay: 0,
            size: Math.random() * 4 + 2,
            duration: Math.random() * 5 + 10,
          });
        }
        return newFlakes.slice(-100); // Keep only the last 100 flakes
      });
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {snowflakes.map((flake) => (
          <motion.div
            key={flake.id}
            initial={{ 
              y: -20, 
              x: `${flake.initialX}%`,
              opacity: 0 
            }}
            animate={{
              y: '110vh',
              x: [
                `${flake.initialX}%`,
                `${flake.finalX}%`,
                `${flake.initialX}%`
              ],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: flake.duration,
              delay: flake.delay,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
              x: {
                duration: flake.duration * 2,
                repeat: Infinity,
                ease: "linear"
              }
            }}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%'
            }}
          >
            <div
              className="rounded-full bg-white opacity-80"
              style={{
                width: flake.size,
                height: flake.size,
                position: 'absolute',
                left: `${flake.x}%`,
                transform: 'translateX(-50%)'
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
