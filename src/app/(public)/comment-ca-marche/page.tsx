"use client";

import { useState, useEffect } from "react";
import { Shield, Lock, ChevronDown, ChevronUp, Star, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";


const rotatingWords = ["un plombier", "un électricien", "un serrurier", "un chauffagiste", "un peintre"];

const howItWorks = [
  { step: "01", title: "Sélectionnez votre travail", desc: "Choisissez parmi 12 catégories de métiers du bâtiment" },
  { step: "02", title: "Décrivez votre besoin", desc: "Ajoutez des photos ou une vidéo diagnostic pour un devis plus précis" },
  { step: "03", title: "Réservez un artisan", desc: "Comparez les profils certifiés, avis vérifiés et tarifs transparents" },
  { step: "04", title: "Payez 100% sécurisé", desc: "Votre argent est bloqué en séquestre jusqu'à validation de l'intervention" },
];

const guarantees = [
  { icon: <Shield className="w-6 h-6" />, title: "Artisans vérifiés", desc: "SIRET, décennale, identité — chaque artisan est audité avant référencement" },
  { icon: <Lock className="w-6 h-6" />, title: "Séquestre sécurisé", desc: "Votre argent est bloqué. L'artisan n'est payé qu'après votre validation" },
  { icon: <RefreshCw className="w-6 h-6" />, title: "Satisfait ou remboursé", desc: "En cas de litige, Nova examine sous 48h et vous rembourse si nécessaire" },
];

const testimonials = [
  { name: "Caroline L.", city: "Paris 4e", text: "Le séquestre m'a rassurée. Je savais que mon argent était protégé. L'artisan était ponctuel et professionnel.", rating: 5 },
  { name: "Pierre M.", city: "Lyon 6e", text: "Fuite d'eau un dimanche soir, intervention en 1h30. Le suivi en temps réel est top, je voyais l'artisan arriver.", rating: 5 },
  { name: "Amélie R.", city: "Bordeaux", text: "J'ai signé le devis en ligne, payé en 3x via Klarna. Aucune surprise sur la facture. Je recommande à 100%.", rating: 5 },
];

const faqItems = [
  { q: "C'est gratuit pour les particuliers ?", a: "Oui, l'inscription et l'utilisation de Nova sont 100% gratuites pour les particuliers. La commission est uniquement prélevée sur le paiement de l'artisan." },
  { q: "Comment fonctionne le paiement par séquestre ?", a: "Vous payez 100% du montant à la signature du devis. L'argent est bloqué sur un compte sécurisé. L'artisan n'est payé qu'après votre validation de l'intervention." },
  { q: "Que se passe-t-il si je ne suis pas satisfait ?", a: "Vous avez 72h après l'intervention pour signaler un problème. Nova examine le litige sous 48h et peut décider d'un remboursement partiel ou total." },
  { q: "Comment sont vérifiés les artisans ?", a: "Chaque artisan doit fournir son extrait SIRET, son attestation décennale et une pièce d'identité. Nova vérifie l'authenticité de chaque document." },
  { q: "Puis-je payer en plusieurs fois ?", a: "Oui, Nova propose le paiement en 3x ou 4x sans frais via Klarna. Vous payez la première mensualité à la signature, Klarna gère le reste." },
  { q: "Comment contacter un artisan ?", a: "Depuis le profil de l'artisan, vous pouvez envoyer un message via le chat Nova, appeler directement, ou réserver un rendez-vous." },
];

const categories = [
  { id: "01", name: "Plomberie", desc: "Fuites, robinetterie, chauffe-eau" },
  { id: "02", name: "Électricité", desc: "Prises, tableaux, mise aux normes" },
  { id: "03", name: "Serrurerie", desc: "Ouverture, remplacement, blindage" },
  { id: "04", name: "Chauffage", desc: "Chaudière, clim, entretien" },
  { id: "05", name: "Peinture", desc: "Intérieur, extérieur, ravalement" },
  { id: "06", name: "Maçonnerie", desc: "Murs, terrasses, rénovation" },
];

export default function CommentCaMarchePage() {
  const [wordIndex, setWordIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchStep, setSearchStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setWordIndex((i) => (i + 1) % rotatingWords.length), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-bgPage via-surface to-border px-5 md:px-10 py-16 md:py-24">
        <div className="max-w-[1100px] mx-auto relative z-10">
          <div className="flex gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-semibold"><Lock className="w-3 h-3" /> Paiement 100% sécurisé</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border text-navy text-xs font-semibold">0€ Gratuit pour les particuliers</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 text-gold text-xs font-bold mb-5">🎁 1er déplacement offert à l&apos;inscription</div>
          <h1 className="font-heading text-4xl md:text-[52px] font-extrabold text-navy leading-[1.1] tracking-tight mb-4 max-w-[700px]">
            Vous cherchez<br />
            <span className="text-forest transition-all duration-300">{rotatingWords[wordIndex]}</span><br />
            de confiance ?
          </h1>
          <p className="text-lg text-grayText max-w-[560px] leading-relaxed mb-6">
            Nova vérifie chaque artisan (SIRET, décennale, RGE) et bloque votre paiement en séquestre jusqu&apos;à validation de l&apos;intervention.
          </p>
          <div className="flex gap-3 mb-6">
            <Button size="lg" onClick={() => setShowSearch(true)}>Trouver un artisan</Button>
            <Button variant="outline" size="lg" onClick={() => document.getElementById("comment")?.scrollIntoView({ behavior: "smooth" })}>
              Comment ça marche
            </Button>
          </div>
          <div className="hidden md:flex gap-3 text-xs text-grayText">
            {["Artisans vérifiés", "Séquestre sécurisé", "Sans carte bancaire", "Inscription 30 sec"].map((t) => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-white/70 border border-border">{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-grayText">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            14 interventions réalisées aujourd&apos;hui
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="comment" className="px-5 md:px-10 py-16 bg-white">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy text-center mb-10">Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {howItWorks.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-forest/5 flex items-center justify-center mx-auto mb-3">
                  <span className="font-mono text-lg font-bold text-forest">{s.step}</span>
                </div>
                <h3 className="font-heading text-sm font-bold text-navy mb-1">{s.title}</h3>
                <p className="text-xs text-grayText leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUARANTEES */}
      <section className="px-5 md:px-10 py-16 bg-bgPage">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy text-center mb-10">Vos garanties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {guarantees.map((g) => (
              <div key={g.title} className="bg-white rounded-xl border border-border p-7 text-center">
                <div className="w-14 h-14 rounded-2xl bg-forest/5 flex items-center justify-center mx-auto mb-4 text-forest">{g.icon}</div>
                <h3 className="font-heading text-base font-bold text-navy mb-2">{g.title}</h3>
                <p className="text-sm text-grayText leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-5 md:px-10 py-16 bg-white">
        <div className="max-w-[900px] mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy text-center mb-10">Ce qu&apos;ils en disent</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-bgPage rounded-xl border border-border p-5">
                <div className="flex gap-0.5 mb-3">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-gold text-gold" />)}</div>
                <p className="text-sm text-navy leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
                <div className="text-xs font-semibold text-navy">{t.name}</div>
                <div className="text-[10px] text-grayText">{t.city}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-5 md:px-10 py-16 bg-bgPage">
        <div className="max-w-[700px] mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-navy text-center mb-10">Questions fréquentes</h2>
          <div className="space-y-2">
            {faqItems.map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-white overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-sm font-semibold text-navy pr-4">{item.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-grayText shrink-0" /> : <ChevronDown className="w-4 h-4 text-grayText shrink-0" />}
                </button>
                {openFaq === i && <div className="px-5 pb-4 text-sm text-grayText leading-relaxed animate-fadeIn">{item.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 md:px-10 py-16 bg-gradient-to-br from-deepForest to-forest text-white text-center">
        <div className="max-w-[600px] mx-auto">
          <h2 className="font-heading text-2xl md:text-3xl font-extrabold mb-4">
            Trouvez votre artisan certifié en 30 secondes
          </h2>
          <p className="text-sm text-white/60 mb-6">Inscription gratuite • Paiement sécurisé • Artisans vérifiés</p>
          <Button size="lg" className="bg-white text-deepForest hover:bg-white/90" onClick={() => setShowSearch(true)}>
            Trouver mon artisan
          </Button>
        </div>
      </section>

      {/* SEARCH MODAL */}
      {showSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-navy/50 backdrop-blur-sm" onClick={() => { setShowSearch(false); setSearchStep(0); }} />
          <div className="relative w-full max-w-[520px] bg-white rounded-xl shadow-lg animate-slideUp max-h-[90vh] overflow-y-auto p-6">
            {searchStep === 0 && (
              <>
                <h2 className="font-heading text-xl font-extrabold text-navy mb-4">Quel type de travaux ?</h2>
                <div className="grid grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <button key={cat.id} onClick={() => setSearchStep(1)}
                      className="flex flex-col items-start p-4 rounded-xl border border-border hover:border-forest/30 hover:bg-surface transition-all text-left">
                      <span className="font-mono text-xs text-forest mb-1">{cat.id}</span>
                      <span className="text-sm font-bold text-navy">{cat.name}</span>
                      <span className="text-[11px] text-grayText">{cat.desc}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            {searchStep === 1 && (
              <>
                <h2 className="font-heading text-xl font-extrabold text-navy mb-4">Décrivez votre besoin</h2>
                <textarea placeholder="Ex: J'ai une fuite sous l'évier de la cuisine..." className="w-full h-[100px] px-4 py-3 rounded-md border border-border text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none mb-3" />
                <Button className="w-full" onClick={() => setSearchStep(2)}>Trouver des artisans</Button>
              </>
            )}
            {searchStep === 2 && (
              <div className="text-center py-8">
                <div className="w-10 h-10 border-2 border-forest/30 border-t-forest rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-navy font-medium">Recherche d&apos;artisans...</p>
                <p className="text-xs text-grayText mt-1">Matching en cours dans votre zone</p>
                <Button className="mt-6" onClick={() => { setShowSearch(false); setSearchStep(0); window.location.href = "/artisans"; }}>
                  Voir les résultats
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
