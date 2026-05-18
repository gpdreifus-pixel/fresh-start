import { useRef, useState, ReactNode, MouseEvent } from 'react';

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

export default function Magnet({
  children,
  padding = 150,
  strength = 3,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.6s ease-in-out',
  className,
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;

    const withinX = Math.abs(e.clientX - rect.left) < rect.width / 2 + padding;
    const withinY = Math.abs(e.clientY - rect.top) < rect.height / 2 + padding;

    if (withinX && withinY) {
      setIsActive(true);
      setTranslate({ x: dx / strength, y: dy / strength });
    } else {
      setIsActive(false);
      setTranslate({ x: 0, y: 0 });
    }
  }

  function handleMouseLeave() {
    setIsActive(false);
    setTranslate({ x: 0, y: 0 });
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${translate.x}px, ${translate.y}px, 0)`,
        transition: isActive ? activeTransition : inactiveTransition,
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
