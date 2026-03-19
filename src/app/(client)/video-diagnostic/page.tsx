"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Lightbulb, Ruler, Mic, Timer, Play, RotateCcw, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const tips = [
  { icon: <Lightbulb className="w-5 h-5 text-gold" />, title: "Bon éclairage", desc: "Placez-vous dans un endroit bien éclairé" },
  { icon: <Ruler className="w-5 h-5 text-forest" />, title: "Zone complète", desc: "Filmez toute la zone concernée" },
  { icon: <Mic className="w-5 h-5 text-forest" />, title: "Décrivez à voix haute", desc: "Expliquez le problème en filmant" },
  { icon: <Timer className="w-5 h-5 text-forest" />, title: "30-60 secondes", desc: "Durée idéale pour un diagnostic" },
];

export default function VideoDiagnosticPage() {
  const router = useRouter();
  const [stage, setStage] = useState(0);
  const [note, setNote] = useState("");

  // Stage 0: Instructions
  if (stage === 0) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">Vidéo diagnostic</h1>
        <p className="text-sm text-grayText mb-6">Filmez le problème pour un diagnostic rapide par l&apos;artisan</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {tips.map((tip) => (
            <Card key={tip.title} className="p-4">
              <div className="mb-2">{tip.icon}</div>
              <div className="text-sm font-semibold text-navy">{tip.title}</div>
              <div className="text-xs text-grayText mt-0.5">{tip.desc}</div>
            </Card>
          ))}
        </div>

        <Button className="w-full bg-red hover:bg-red/90" size="lg" onClick={() => setStage(1)}>
          Commencer l&apos;enregistrement
        </Button>
      </div>
    );
  }

  // Stage 1: Preview
  if (stage === 1) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8">
        <button onClick={() => setStage(0)} className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <h1 className="font-heading text-[22px] font-extrabold text-navy mb-5">Aperçu vidéo</h1>

        {/* Video preview mock */}
        <div className="relative w-full h-[240px] rounded-xl bg-gradient-to-br from-navy to-deepForest mb-4 flex items-center justify-center overflow-hidden">
          <Play className="w-12 h-12 text-white/50" />
          <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/50 text-white font-mono text-xs">
            00:34
          </div>
        </div>

        <textarea
          placeholder="Ajoutez une note pour l'artisan..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full h-[80px] px-4 py-3 rounded-md border border-border bg-white text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none mb-4"
        />

        <div className="flex gap-2">
          <Button className="flex-1" onClick={() => setStage(2)}>
            Envoyer à l&apos;artisan
          </Button>
          <Button variant="outline" onClick={() => setStage(0)} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Refaire
          </Button>
        </div>
      </div>
    );
  }

  // Stage 2: Success
  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8 text-center py-16 animate-pageIn">
      <div className="w-[72px] h-[72px] rounded-full bg-success/15 flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-9 h-9 text-success" />
      </div>
      <h1 className="font-heading text-2xl font-extrabold text-navy mb-2">Vidéo envoyée !</h1>
      <p className="text-sm text-grayText mb-4">L&apos;artisan analysera votre vidéo et vous répondra rapidement.</p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-forest/5 text-forest text-sm font-medium mb-6">
        <Clock className="w-4 h-4" /> Réponse estimée sous 2h
      </div>
      <div>
        <Button onClick={() => router.push("/missions")}>Voir mes missions</Button>
      </div>
    </div>
  );
}
