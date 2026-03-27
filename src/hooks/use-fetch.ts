/**
 * Hook useFetch — Chargement de données depuis une API
 *
 * Gère automatiquement :
 * - L'état de chargement (loading)
 * - Les erreurs
 * - Le rechargement via refetch()
 *
 * Usage : const { data, loading, error, refetch } = useFetch<MonType>("/api/mon-endpoint");
 */

"use client";

import { useState, useEffect, useCallback } from "react";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/** Hook générique pour fetch avec gestion d'état (passer null pour désactiver) */
export function useFetch<T>(url: string | null): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Si pas d'URL, on ne charge rien
    if (!url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Erreur de chargement");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [url]);

  // Charge les données au montage et quand l'URL change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
