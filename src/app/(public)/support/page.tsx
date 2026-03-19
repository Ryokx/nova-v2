"use client";

import { useState, useRef, useEffect } from "react";
import {
  MessageCircle, Mail, Paperclip, Send, Check, Upload,
  Clock, CreditCard, AlertTriangle, HelpCircle, User, MoreHorizontal,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatMessage {
  from: "user" | "bot";
  text: string;
  time: string;
}

const initialMessages: ChatMessage[] = [
  {
    from: "bot",
    text: "Bonjour ! Je suis l\u2019assistant Nova. Comment puis-je vous aider aujourd\u2019hui ?",
    time: "14:30",
  },
];

const subjectChips = [
  { label: "Problème de paiement", icon: <CreditCard className="w-3.5 h-3.5" /> },
  { label: "Litige", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
  { label: "Question technique", icon: <HelpCircle className="w-3.5 h-3.5" /> },
  { label: "Mon compte", icon: <User className="w-3.5 h-3.5" /> },
  { label: "Autre", icon: <MoreHorizontal className="w-3.5 h-3.5" /> },
];

export default function SupportPage() {
  const [mode, setMode] = useState<"chat" | "email">("chat");

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Email state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailDesc, setEmailDesc] = useState("");
  const [emailAttachment, setEmailAttachment] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;

    setMessages((prev) => [...prev, { from: "user", text: chatInput, time }]);
    setChatInput("");

    // Simulate bot reply
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

  const handleEmailSend = () => {
    if (!emailSubject || !emailDesc.trim()) return;
    setEmailSent(true);
  };

  return (
    <div className="min-h-screen bg-bgPage">
      <div className="max-w-[640px] mx-auto px-5 md:px-8 py-10 md:py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-navy mb-2">
            Centre d&apos;aide
          </h1>
          <p className="font-body text-sm text-grayText">
            Une question ? Un problème ? Nous sommes là pour vous.
          </p>
        </div>

        {/* Mode toggle — pill style */}
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

        {/* ══════ CHAT MODE ══════ */}
        {mode === "chat" && (
          <div className="bg-white rounded-[20px] border border-border shadow-sm overflow-hidden">
            {/* Chat header */}
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-forest to-sage flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
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

            {/* Messages area */}
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
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
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

        {/* ══════ EMAIL MODE ══════ */}
        {mode === "email" && !emailSent && (
          <div className="bg-white rounded-[20px] border border-border shadow-sm p-6 md:p-8">
            {/* Info bar */}
            <div className="flex items-center gap-2.5 bg-surface rounded-xl px-4 py-3 mb-6">
              <Clock className="w-4 h-4 text-forest shrink-0" />
              <span className="font-body text-sm text-forest font-medium">Réponse sous 24h ouvrées</span>
            </div>

            {/* Subject chips */}
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

            {/* Description */}
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

            {/* Screenshot attachment */}
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

            {/* Send button */}
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

        {/* ══════ EMAIL SUCCESS STATE ══════ */}
        {mode === "email" && emailSent && (
          <div className="bg-white rounded-[20px] border border-border shadow-sm p-8 md:p-12 text-center">
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
