/**
 * Centralized avatar URIs for mock data.
 * Mix of human faces and company logos for realism.
 */

const AVATAR_MAP: Record<string, string> = {
  /* ── Artisans — Humans ── */
  "Jean-Michel Petit": "https://randomuser.me/api/portraits/men/32.jpg",
  "Jean-Michel P.":    "https://randomuser.me/api/portraits/men/32.jpg",
  "Jean-Michel":       "https://randomuser.me/api/portraits/men/32.jpg",

  "Sophie Martin":     "https://randomuser.me/api/portraits/women/44.jpg",
  "Sophie M.":         "https://randomuser.me/api/portraits/women/44.jpg",

  "Karim Benali":      "https://randomuser.me/api/portraits/men/75.jpg",
  "Karim B.":          "https://randomuser.me/api/portraits/men/75.jpg",

  "Marie Dupont":      "https://randomuser.me/api/portraits/women/68.jpg",
  "Marie D.":          "https://randomuser.me/api/portraits/women/68.jpg",

  "Thomas Richard":    "https://randomuser.me/api/portraits/men/22.jpg",
  "Thomas R.":         "https://randomuser.me/api/portraits/men/22.jpg",

  "Fatima Hadj":       "https://randomuser.me/api/portraits/women/90.jpg",
  "Fatima H.":         "https://randomuser.me/api/portraits/women/90.jpg",

  "Christophe Durand": "https://randomuser.me/api/portraits/men/45.jpg",
  "Christophe D.":     "https://randomuser.me/api/portraits/men/45.jpg",

  "Amina Kaddouri":    "https://randomuser.me/api/portraits/women/33.jpg",
  "Amina K.":          "https://randomuser.me/api/portraits/women/33.jpg",

  "Julie V.":          "https://randomuser.me/api/portraits/women/17.jpg",
  "Youssef M.":        "https://randomuser.me/api/portraits/men/28.jpg",
  "Nicolas B.":        "https://randomuser.me/api/portraits/men/36.jpg",

  /* ── Artisans — Company logos ── */
  "Garcia & Fils":     "https://i.pravatar.cc/150?img=60",
  "Leroy Élec":        "https://i.pravatar.cc/150?img=69",
  "Fabre Rénovation":  "https://i.pravatar.cc/150?img=56",
  "ProBat Services":   "https://i.pravatar.cc/150?img=52",
  "Clément Couverture":"https://i.pravatar.cc/150?img=59",
  "Amrani Maçonnerie": "https://i.pravatar.cc/150?img=51",

  /* ── Clients ── */
  "Pierre Martin":     "https://randomuser.me/api/portraits/men/52.jpg",
  "Pierre M.":         "https://randomuser.me/api/portraits/men/52.jpg",
  "Sophie Lefèvre":    "https://randomuser.me/api/portraits/women/55.jpg",
  "Caroline Durand":   "https://randomuser.me/api/portraits/women/62.jpg",
  "Caroline L.":       "https://randomuser.me/api/portraits/women/62.jpg",
  "Antoine Moreau":    "https://randomuser.me/api/portraits/men/71.jpg",
  "Amélie R.":         "https://randomuser.me/api/portraits/women/29.jpg",
  "Luc D.":            "https://randomuser.me/api/portraits/men/18.jpg",
  "Éric Fabre":        "https://randomuser.me/api/portraits/men/41.jpg",
  "Éric F.":           "https://randomuser.me/api/portraits/men/41.jpg",
};

/** Lookup avatar URI by name. Returns undefined if no match (falls back to initials). */
export function getAvatarUri(name: string): string | undefined {
  return AVATAR_MAP[name];
}
