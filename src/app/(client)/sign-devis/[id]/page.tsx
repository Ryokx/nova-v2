"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";
import { formatPrice } from "@/lib/utils";

interface DevisItem {
  label: string;
  qty: number;
  unitPrice: number;
  total: number;
}

interface DevisData {
  id: string;
  number: string;
  items: DevisItem[];
  totalHT: number;
  totalTTC: number;
  tva: number;
  status: string;
  mission: { id: string; type: string; artisan: { user: { name: string } } };
}

// Mock line items matching prototype exactly
const mockLineItems = [
  { label: "Remplacement siphon", price: "45\u202F\u20AC" },
  { label: "Joint flexible inox", price: "25\u202F\u20AC" },
  { label: "Main d\u2019\u0153uvre (2h)", price: "180\u202F\u20AC" },
  { label: "D\u00E9placement", price: "40\u202F\u20AC" },
  { label: "TVA (10%)", price: "30\u202F\u20AC" },
];

export default function SignDevisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: devis, loading } = useFetch<DevisData>(`/api/devis/${id}`);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signed, setSigned] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0]!.clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0]!.clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0]!.clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0]!.clientY - rect.top : e.clientY - rect.top;
    ctx.strokeStyle = "#0A1628";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  if (loading) {
    return (
      <div className="max-w-[600px] mx-auto px-6 py-8">
        <Skeleton variant="rectangular" height={400} />
      </div>
    );
  }

  // Use devis data if available, otherwise show prototype defaults
  const devisNumber = devis?.number ?? "D-2026-089";
  const devisTitle = devis?.mission?.type ?? "Réparation fuite sous évier";
  const totalTTC = devis?.totalTTC ?? 320;
  const missionId = devis?.mission?.id ?? id;

  // Success state
  if (signed) {
    return (
      <div className="max-w-[500px] mx-auto px-6 pt-36 pb-16 text-center animate-pageIn">
        <div className="w-[72px] h-[72px] rounded-[22px] bg-success flex items-center justify-center mx-auto mb-5">
          <Check className="w-9 h-9 text-white" />
        </div>
        <h2 className="font-heading text-2xl font-extrabold text-navy mb-2">
          Devis signé !
        </h2>
        <p className="text-sm text-grayText mb-6">
          Il ne reste plus qu&apos;à bloquer le paiement en séquestre.
        </p>
        <button
          onClick={() => router.push(`/payment/${missionId}`)}
          className="w-full py-3.5 rounded-[14px] bg-deepForest text-white border-none text-[15px] font-semibold cursor-pointer hover:-translate-y-0.5 transition-transform"
        >
          Procéder au paiement — {formatPrice(totalTTC)}
        </button>
      </div>
    );
  }

  // Build line items from API data or use mock
  const lineItems = devis?.items
    ? (devis.items as DevisItem[]).map((item) => ({
        label: `${item.label}${item.qty > 1 ? ` (x${item.qty})` : ""}`,
        price: formatPrice(item.total),
      }))
    : mockLineItems;

  return (
    <div className="max-w-[600px] mx-auto px-6 py-8">
      {/* Title */}
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-5">
        Signer le devis
      </h1>

      {/* Devis detail card */}
      <Card className="mb-4">
        {/* Header: number + title + amount */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <div className="text-xs text-grayText mb-1">Devis #{devisNumber}</div>
            <div className="text-base font-bold text-navy">{devisTitle}</div>
          </div>
          <div className="font-mono text-[22px] font-bold text-forest">
            {formatPrice(totalTTC)}
          </div>
        </div>

        {/* Line items */}
        {lineItems.map((item, i) => (
          <div
            key={i}
            className="flex justify-between py-1.5 border-t border-border text-xs text-grayText"
          >
            <span>{item.label}</span>
            <span className="font-mono text-navy">{item.price}</span>
          </div>
        ))}
      </Card>

      {/* Signature section */}
      <div className="text-sm font-bold text-navy mb-2.5">Votre signature</div>
      <div className="relative mb-4">
        <canvas
          ref={canvasRef}
          width={560}
          height={140}
          className="w-full h-[140px] rounded-2xl border-2 border-dashed border-border bg-white cursor-crosshair touch-none"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
        />
        {!hasDrawn && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[13px] text-grayText">Signez ici</span>
          </div>
        )}
      </div>

      {/* Sign button */}
      <button
        disabled={!hasDrawn}
        onClick={() => setSigned(true)}
        className={`w-full py-3.5 rounded-[14px] border-none text-[15px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 ${
          hasDrawn
            ? "bg-deepForest text-white"
            : "bg-deepForest/50 text-white/70 opacity-50 cursor-default hover:translate-y-0"
        }`}
      >
        <Lock className="w-4 h-4" /> Signer et bloquer le paiement
      </button>
    </div>
  );
}
