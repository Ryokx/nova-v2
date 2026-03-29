"use client";

import { useEffect } from "react";

/**
 * Composant invisible qui observe tous les éléments [data-reveal]
 * et ajoute la classe "revealed" quand ils entrent dans le viewport.
 * Les éléments déjà visibles au chargement sont révélés immédiatement.
 */
export function ScrollRevealInit() {
  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return;

    // Respecter prefers-reduced-motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      elements.forEach(el => el.classList.add("revealed"));
      return;
    }

    // Révéler immédiatement les éléments déjà dans le viewport au chargement
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("revealed");
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" },
    );

    elements.forEach(el => {
      if (!el.classList.contains("revealed")) {
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  return null;
}
