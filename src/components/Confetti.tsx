/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from "react";

interface ConfettiProps {
  isActive: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  shape: "circle" | "square" | "star";
  angle: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
}

const COLORS = [
  "#FFD700",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FF00FF",
  "#FFA500",
];
const SHAPES = ["circle", "square", "star"] as const;
const DISSOLVE_START_TIME = 5000; // Start dissolving after 5 seconds
const DISSOLVE_DURATION = 3000; // Take 3 seconds to dissolve

export function Confetti({ isActive }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>();
  const startTimeRef = useRef<number>(0);

  const createParticle = (x: number, y: number): Particle => {
    const spreadX = Math.random() * window.innerWidth;
    const spreadY = Math.random() * (window.innerHeight / 3);

    return {
      x: spreadX,
      y: spreadY,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 2 + 1,
      //@ts-expect-error
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      //@ts-expect-error
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      angle: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 3,
      size: Math.random() * 6 + 4,
      opacity: 1,
    };
  };

  const drawStar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    angle: number,
  ) => {
    const spikes = 5;
    const outerRadius = size;
    const innerRadius = size / 2;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.beginPath();

    for (let i = 0; i < spikes * 2; i++) {
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const currAngle = (i * Math.PI) / spikes;
      const xPos = Math.cos(currAngle) * radius;
      const yPos = Math.sin(currAngle) * radius;

      if (i === 0) {
        ctx.moveTo(xPos, yPos);
      } else {
        ctx.lineTo(xPos, yPos);
      }
    }

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.fillStyle = particle.color;
    ctx.globalAlpha = particle.opacity;
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate((particle.angle * Math.PI) / 180);

    switch (particle.shape) {
      case "circle":
        ctx.beginPath();
        ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "square":
        ctx.fillRect(
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size,
        );
        break;
      case "star":
        drawStar(ctx, 0, 0, particle.size / 2, 0);
        break;
    }

    ctx.restore();
    ctx.globalAlpha = 1;
  };

  const updateParticle = (particle: Particle, currentTime: number) => {
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vy *= 0.99;
    particle.vx *= 0.99;
    particle.angle += particle.rotationSpeed;

    // Wrap around screen edges
    if (particle.x < -50) particle.x = window.innerWidth + 50;
    if (particle.x > window.innerWidth + 50) particle.x = -50;
    if (particle.y < -50) particle.y = window.innerHeight + 50;
    if (particle.y > window.innerHeight + 50) particle.y = -50;

    // Calculate opacity based on time
    const timeSinceStart = currentTime - startTimeRef.current;
    if (timeSinceStart > DISSOLVE_START_TIME) {
      const dissolveProgress =
        (timeSinceStart - DISSOLVE_START_TIME) / DISSOLVE_DURATION;
      particle.opacity = Math.max(0, 1 - dissolveProgress);
    }

    return particle;
  };

  const animate = (timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate time-based values
    const timeSinceStart = timestamp - startTimeRef.current;
    const isDissolving = timeSinceStart > DISSOLVE_START_TIME;
    const dissolveProgress =
      (timeSinceStart - DISSOLVE_START_TIME) / DISSOLVE_DURATION;

    // Only add new particles if not dissolving and not at max capacity
    if (
      !isDissolving &&
      Math.random() < 0.1 &&
      particles.current.length < 200
    ) {
      particles.current.push(createParticle(0, 0));
    }

    // Update and draw particles
    particles.current = particles.current
      .filter((p) => p.opacity > 0)
      .map((p) => updateParticle(p, timestamp));

    particles.current.forEach((particle) => drawParticle(ctx, particle));

    // Continue animation if there are visible particles or if not fully dissolved
    if (particles.current.length > 0 && dissolveProgress < 1) {
      animationFrameId.current = requestAnimationFrame(animate);
    }
  };

  const burstConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reset start time
    startTimeRef.current = performance.now();
    particles.current = [];

    // Create initial burst of particles
    for (let i = 0; i < 150; i++) {
      particles.current.push(createParticle(0, 0));
    }

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (isActive) {
      burstConfetti();
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ position: "fixed" }}
    />
  );
}
