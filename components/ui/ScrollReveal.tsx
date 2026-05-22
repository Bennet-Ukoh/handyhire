"use client";
import { useEffect, useRef, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const show = () => el.classList.add("visible");
          delay ? setTimeout(show, delay) : show();
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -28px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`hh-reveal${className ? ` ${className}` : ""}`}>
      {children}
    </div>
  );
}
