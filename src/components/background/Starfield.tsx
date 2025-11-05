import { useEffect, useRef } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const Starfield = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, reduceMotion } = useTheme();

  useEffect(() => {
    if (theme !== 'galaxy') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create three layers of stars with different speeds for parallax
    const createStars = (count: number, speed: number, size: number) => {
      return Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * size + 0.5,
        speed,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleDirection: Math.random() > 0.5 ? 1 : -1,
      }));
    };

    const layers = [
      createStars(100, 0.05, 1.5), // Far stars (slow)
      createStars(70, 0.15, 2), // Mid stars
      createStars(50, 0.3, 2.5), // Near stars (fast)
    ];

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (reduceMotion) return;
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.fillStyle = 'rgba(16, 18, 36, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      layers.forEach((layer, layerIndex) => {
        layer.forEach((star) => {
          // Parallax movement based on mouse position
          const parallaxX = reduceMotion ? 0 : mouseX * (layerIndex + 1) * 20;
          const parallaxY = reduceMotion ? 0 : mouseY * (layerIndex + 1) * 20;

          // Move stars
          if (!reduceMotion) {
            star.y += star.speed;
            if (star.y > canvas.height) {
              star.y = 0;
              star.x = Math.random() * canvas.width;
            }
          }

          // Twinkle effect
          if (!reduceMotion) {
            star.opacity += star.twinkleSpeed * star.twinkleDirection;
            if (star.opacity > 1 || star.opacity < 0.3) {
              star.twinkleDirection *= -1;
            }
          }

          // Draw star
          ctx.beginPath();
          ctx.arc(
            star.x + parallaxX,
            star.y + parallaxY,
            star.radius,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.fill();
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, reduceMotion]);

  if (theme !== 'galaxy') return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
