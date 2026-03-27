/**
 * Page de support / centre d'aide — /support
 *
 * Propose deux modes de contact :
 * 1. Chat en direct : messagerie instantanée avec un bot puis un agent
 * 2. Email : formulaire avec choix de sujet, description et pièce jointe
 *
 * Note : Le chat simule une réponse automatique (pas de backend réel pour le moment).
 */
"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle, Mail, Paperclip, Send, Check, Upload,
  Clock, CreditCard, AlertTriangle, HelpCircle, User, MoreHorizontal,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

/** Structure d'un message dans le chat */
interface ChatMessage {
  from: "user" | "bot";
  text: string;
  time: string;
}

/** Message d'accueil affiché à l'ouverture du chat */
const initialMessages: ChatMessage[] = [
  {
    from: "bot",
    text: "Bonjour ! Je suis l\u2019assistant Nova. Comment puis-je vous aider aujourd\u2019hui ?",
    time: "14:30",
  },
];

/** Sujets prédéfinis pour le formulaire email */
const subjectChips = [
  { label: "Problème de paiement", icon: <CreditCard className="w-3.5 h-3.5" /> },
  { label: "Litige", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { label: "Question technique", icon: <HelpCircle className="w-3.5 h-3.5" /> },
  { label: "Mon compte", icon: <User className="w-3.5 h-3.5" /> },
  { label: "Autre", icon: <MoreHorizontal className="w-3.5 h-3.5" /> },
];

export default function SupportPage() {
  /* ── Mode actif : chat ou email ── */
  const [mode, setMode] = useState<"chat" | "email">("chat");

  /* ── État du chat ── */
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  /* ── État du formulaire email ── */
  const [emailSubject, setEmailSubject] = useState("");
  const [emailDesc, setEmailDesc] = useState("");
  const [emailAttachment, setEmailAttachment] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  /** Scroll automatique vers le dernier message du chat */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Envoie un message dans le chat et simule une réponse du bot
   * après un délai de 1,5 seconde.
   */
  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

    setMessages((prev) => [...prev, { from: "user", text: chatInput, time }]);
    setChatInput("");

    // Réponse simulée du bot
    setTimeout(() => {
      const botTime = new Date();
      const bt = `${botTime.getHours()}:${String(botTime.getMinutes()).padStart(2, "0")}`;
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Merci pour votre message. Un membre de notre équipe va vous répondre dans les prochaines minutes. En attendant, n\u2019hésitez pas à préciser votre demande.",
          time: bt,
        },
      ]);
    }, 1500);
  };

  /** Simule l'envoi du formulaire email */
  const handleEmailSend = () => {
    if (!emailSubject || !emailDesc.trim()) return;
    setEmailSent(true);
  };

  return (
    <div className="min-h-screen bg-bgPage">
      <div className="max-w-[640px] mx-auto px-5 md:px-8 py-10 md:py-16">

        {/* ── En-tête de la page ── */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-navy mb-2">
            Centre d&apos;aide
          </h1>
          <p className="font-body text-sm text-grayText">
            Une question ? Un problème ? Nous sommes là pour vous.
          </p>
        </div>

        {/* ── Sélecteur de mode (chat / email) ── */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white rounded-full border border-border p-1">
            <button
              onClick={() => { setMode("chat"); setEmailSent(false); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-body transition-all ${
                mode === "chat"
                  ? "bg-deepForest text-white shadow-sm"
                  : "text-grayText hover:text-navy"
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              Chat en direct
            </button>
            <button
              onClick={() => setMode("email")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold font-body transition-all ${
                mode === "email"
                  ? "bg-deepForest text-white shadow-sm"
                  : "text-grayText hover:text-navy"
              }`}
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>
        </div>

        {/* ══════ MODE CHAT ══════ */}
        {mode === "chat" && (
          <div className="bg-white rounded-[5px] border border-border shadow-sm overflow-hidden">

            {/* En-tête du chat (nom + temps de réponse) */}
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest to-sage flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  {/* Indicateur "en ligne" */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-white" />
                </div>
                <div>
                  <div className="font-heading text-sm font-bold text-navy flex items-center gap-2">
                    Support en ligne
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  </div>
                  <div className="font-body text-xs text-grayText flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Temps de réponse ~15 min
                  </div>
                </div>
              </div>
            </div>

            {/* Zone d'affichage des messages */}
            <div className="h-[400px] overflow-y-auto px-5 py-4 space-y-4 bg-bgPage/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${
                    msg.from === "user"
                      ? "bg-deepForest text-white rounded-2xl rounded-br-md"
                      : "bg-surface text-navy rounded-2xl rounded-bl-md"
                  } px-4 py-3`}>
                    <p className="font-body text-sm leading-relaxed">{msg.text}</p>
                    <div className={`font-mono text-[10px] mt-1.5 ${
                      msg.from === "user" ? "text-white/50" : "text-grayText"
                    }`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
              {/* Ancre pour le scroll automatique */}
              <div ref={chatEndRef} />
            </div>

            {/* Barre de saisie du message */}
            <div className="px-4 py-3 border-t border-border bg-white">
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 rounded-xl flex items-center justify-center text-grayText hover:bg-surface hover:text-forest transition-colors shrink-0">
                  <Paperclip className="w-[18px] h-[18px]" />
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Écrivez votre message..."
                  className="flex-1 h-10 px-4 rounded-xl bg-bgPage border border-border font-body text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30"
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim()}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                    chatInput.trim()
                      ? "bg-deepForest text-white hover:bg-deepForest/90"
                      : "bg-border text-grayText"
                  }`}
                >
                  <Send className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════ MODE EMAIL — Formulaire ══════ */}
        {mode === "email" && !emailSent && (
          <div className="bg-white rounded-[5px] border border-border shadow-sm p-6 md:p-8">

            {/* Info délai de réponse */}
            <div className="flex items-center gap-2.5 bg-surface rounded-xl px-4 py-3 mb-6">
              <Clock className="w-4 h-4 text-forest shrink-0" />
              <span className="font-body text-sm text-forest font-medium">Réponse sous 24h ouvrées</span>
            </div>

            {/* Sélection du sujet (chips cliquables) */}
            <div className="mb-6">
              <label className="font-body text-xs font-semibold text-grayText mb-3 block">Sujet de votre demande</label>
              <div className="flex flex-wrap gap-2">
                {subjectChips.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => setEmailSubject(chip.label)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-body transition-all ${
                      emailSubject === chip.label
                        ? "bg-deepForest text-white"
                        : "bg-bgPage border border-border text-navy hover:border-forest/30"
                    }`}
                  >
                    {chip.icon}
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Champ description */}
            <div className="mb-6">
              <label className="font-body text-xs font-semibold text-grayText mb-2 block">Décrivez votre problème</label>
              <textarea
                value={emailDesc}
                onChange={(e) => setEmailDesc(e.target.value)}
                placeholder="Expliquez-nous votre situation en détail..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-border bg-bgPage font-body text-sm text-navy placeholder:text-grayText/60 focus:outline-none focus:ring-2 focus:ring-forest/30 resize-y leading-relaxed"
              />
            </div>

            {/* Bouton d'ajout de capture d'écran (optionnel) */}
            <div className="mb-8">
              <label className="font-body text-xs font-semibold text-grayText mb-2 block">
                Capture d&apos;écran <span className="font-normal text-grayText/60">(optionnel)</span>
              </label>
              <button
                onClick={() => setEmailAttachment(!emailAttachment)}
                className={`w-full py-6 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all ${
                  emailAttachment
                    ? "border-forest bg-surface"
                    : "border-border bg-bgPage hover:border-forest/30"
                }`}
              >
                {emailAttachment ? (
                  <>
                    <Check className="w-5 h-5 text-forest" />
                    <span className="font-body text-xs text-forest font-semibold">capture.png ajoutée</span>
                    <span className="font-body text-[10px] text-grayText">Cliquez pour retirer</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-grayText" />
                    <span className="font-body text-xs text-grayText">Cliquez pour ajouter une capture</span>
                    <span className="font-body text-[10px] text-grayText/60">PNG, JPG, max 5 Mo</span>
                  </>
                )}
              </button>
            </div>

            {/* Bouton d'envoi */}
            <Button
              size="lg"
              className="w-full bg-deepForest hover:bg-deepForest/90"
              disabled={!emailSubject || !emailDesc.trim()}
              onClick={handleEmailSend}
            >
              <Send className="w-4 h-4" />
              Envoyer ma demande
            </Button>
          </div>
        )}

        {/* ══════ MODE EMAIL — Confirmation d'envoi ══════ */}
        {mode === "email" && emailSent && (
          <div className="bg-white rounded-[5px] border border-border shadow-sm p-8 md:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="font-heading text-xl font-extrabold text-navy mb-2">
              Demande envoyée
            </h2>
            <p className="font-body text-sm text-grayText mb-1.5">
              Nous avons bien reçu votre demande concernant &laquo;&nbsp;{emailSubject}&nbsp;&raquo;.
            </p>
            <p className="font-body text-sm text-grayText mb-6">
              Notre équipe vous répondra sous 24h ouvrées par email.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => {
                setEmailSent(false);
                setEmailSubject("");
                setEmailDesc("");
                setEmailAttachment(false);
              }}>
                Envoyer une autre demande
              </Button>
              <Button onClick={() => setMode("chat")}>
                <MessageCircle className="w-4 h-4" />
                Passer au chat
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
