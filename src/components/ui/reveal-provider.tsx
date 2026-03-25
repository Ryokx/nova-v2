"use client";

import { useEffect } from "react";

export function RevealProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      const selectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
      const elements = document.querySelectorAll<HTMLElement>(selectors);
      if (elements.length === 0) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
      );

      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return <>{children}</>;
}
