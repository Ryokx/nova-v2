/**
 * Hook useReveal — Animations d'apparition au scroll
 *
 * Observe les éléments avec les classes CSS :
 * .reveal, .reveal-left, .reveal-right, .reveal-scale
 *
 * Quand un élément entre dans le viewport, la classe "visible" est ajoutée.
 * L'observation est automatiquement nettoyée au démontage.
 *
 * Usage : appeler une seule fois dans un layout ou une page.
 */

"use client";

import { useEffect } from "react";

export function useReveal() {
  useEffect(() => {
    // Petit délai pour attendre que le DOM soit peint après l'hydratation
    const timeout = setTimeout(() => {
      const selectors = ".reveal, .reveal-left, .reveal-right, .reveal-scale";
      const elements = document.querySelectorAll<HTMLElement>(selectors);

      if (elements.length === 0) return;

      // Observateur qui ajoute "visible" quand l'élément entre dans le viewport
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target); // Une seule animation par élément
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
      );

      elements.forEach((el) => observer.observe(el));

      // Nettoyage de l'observateur
      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);
}
