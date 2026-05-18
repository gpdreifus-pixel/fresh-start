import { useRef, CSSProperties } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export default function AnimatedText({ text, className, style }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const chars = text.split('');

  return (
    <p ref={ref} className={className} style={{ position: 'relative', ...style }}>
      {chars.map((char, i) => {
        const start = i / chars.length;
        const end = Math.min(start + 1 / chars.length + 0.05, 1);

        return (
          <CharSpan
            key={i}
            char={char}
            scrollYProgress={scrollYProgress}
            start={start}
            end={end}
          />
        );
      })}
    </p>
  );
}

function CharSpan({
  char,
  scrollYProgress,
  start,
  end,
}: {
  char: string;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ opacity: 0 }}>{char === ' ' ? '\u00A0' : char}</span>
      <motion.span
        style={{ opacity, position: 'absolute', left: 0, top: 0 }}
      >
        {char === ' ' ? '\u00A0' : char}
      </motion.span>
    </span>
  );
}
