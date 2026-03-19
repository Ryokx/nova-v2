"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Clock, Play, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const tips = [
  { emoji: "💡", title: "Bon éclairage", desc: "Allumez les lumières" },
  { emoji: "📐", title: "Zone complète", desc: "Filmez large puis zoomez" },
  { emoji: "🎙️", title: "Décrivez à voix haute", desc: "Expliquez ce que vous voyez" },
  { emoji: "⏱️", title: "30 à 60 secondes", desc: "Court et précis" },
];

export default function VideoDiagnosticPage() {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [note, setNote] = useState("");

  // Stage 2: Success
  if (stage === 2) {
    return (
      <div className="max-w-[500px] mx-auto px-6 py-36 text-center animate-pageIn">
        <div className="w-[72px] h-[72px] rounded-[22px] bg-success flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-9 h-9 text-white" />
        </div>
        <h2 className="font-heading text-2xl font-extrabold text-navy mb-2">
          Vidéo envoyée !
        </h2>
        <p className="text-sm text-grayText mb-2">
          L&apos;artisan va analyser votre vidéo et préparer son intervention.
        </p>
        <div className="inline-flex items-center gap-1.5 bg-surface px-3.5 py-2 rounded-[10px] mb-6">
          <Clock className="w-3.5 h-3.5 text-forest" />
          <span className="text-xs font-semibold text-forest">Réponse estimée sous 2h</span>
        </div>
        <div>
          <Button onClick={() => router.push("/missions")} className="w-full">
            Retour à la réservation
          </Button>
        </div>
      </div>
    );
  }

  // Stage 1: Preview
  if (stage === 1) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-8">
        <h1 className="font-heading text-[26px] font-extrabold text-navy mb-5">
          Aperçu de la vidéo
        </h1>

        {/* Video preview mock */}
        <div className="relative w-full aspect-video rounded-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] mb-4 flex items-center justify-center overflow-hidden">
          <Play className="w-10 h-10 text-white/80" />
          <div className="absolute bottom-3 right-3.5 px-2 py-1 rounded-md bg-black/50 text-white font-mono text-xs">
            00:34
          </div>
        </div>

        <textarea
          placeholder="Note pour l'artisan (optionnel)..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full h-[80px] px-3 py-3 rounded-[14px] border border-border bg-white text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none mb-4"
        />

        <Button className="w-full gap-2 mb-2" size="lg" onClick={() => setStage(2)}>
          <Send className="w-4 h-4" /> Envoyer à l&apos;artisan
        </Button>
        <button
          onClick={() => setStage(0)}
          className="w-full py-3 rounded-xl bg-white border border-border text-sm text-grayText hover:bg-surface transition-colors cursor-pointer"
        >
          Refaire la vidéo
        </button>
      </div>
    );
  }

  // Stage 0: Tips
  return (
    <div className="max-w-[600px] mx-auto px-6 py-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-2">
        Vidéo diagnostic
      </h1>
      <p className="text-sm text-grayText mb-6">
        Filmez votre problème. L&apos;artisan pourra évaluer la situation avant de se déplacer.
      </p>

      {/* Tips card */}
      <div className="bg-white border border-border shadow-sm rounded-[20px] p-5 mb-6">
        {tips.map((tip, i) => (
          <div
            key={tip.title}
            className={`flex items-center gap-3 ${i < tips.length - 1 ? "mb-3" : ""}`}
          >
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-lg shrink-0">
              {tip.emoji}
            </div>
            <div>
              <div className="text-[13px] font-semibold text-navy">{tip.title}</div>
              <div className="text-[11px] text-grayText">{tip.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <Button
        className="w-full bg-red hover:bg-red/90"
        size="lg"
        onClick={() => setStage(1)}
      >
        Commencer l&apos;enregistrement
      </Button>
    </div>
  );
}
