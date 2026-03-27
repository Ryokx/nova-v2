"use client";

/**
 * Composant RevealProvider — Anime les éléments au scroll (apparition progressive).
 *
 * Fonctionne avec les classes CSS : .reveal, .reveal-left, .reveal-right, .reveal-scale.
 * Quand un élément entre dans le viewport, la classe "visible" est ajoutée
 * pour déclencher l'animation CSS associée.
 *
 * Utilise IntersectionObserver pour la performance (pas de calcul au scroll).
 */

import { useEffect } from "react";

export function RevealProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Petit délai pour s'assurer que le DOM est prêt après le rendu
    const timeout = setTimeout(() => {
      const selectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
      const elements = document.querySelectorAll<HTMLElement>(selectors);
      if (elements.length === 0) return;

      // Observe chaque élément et ajoute "visible" quand il entre dans le viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target); // On n'observe plus après la première apparition
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
