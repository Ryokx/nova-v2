"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Lock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => setIsDrawing(false);

  if (loading) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8">
        <Skeleton variant="rectangular" height={400} />
      </div>
    );
  }

  if (!devis) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8 text-center py-20">
        <p className="text-grayText">Devis introuvable</p>
      </div>
    );
  }

  if (signed) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8 text-center py-16 animate-pageIn">
        <div className="w-[72px] h-[72px] rounded-full bg-success/15 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-9 h-9 text-success" />
        </div>
        <h1 className="font-heading text-2xl font-extrabold text-navy mb-2">Devis signé !</h1>
        <p className="text-sm text-grayText mb-6">Passez au paiement pour bloquer le montant en séquestre</p>
        <Button size="lg" onClick={() => router.push(`/payment/${devis.mission.id}`)}>
          Procéder au paiement — {formatPrice(devis.totalTTC)}
        </Button>
      </div>
    );
  }

  const items = devis.items as DevisItem[];

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-forest font-medium mb-4 hover:underline">
        <ArrowLeft className="w-4 h-4" /> Retour
      </button>

      <h1 className="font-heading text-[22px] font-extrabold text-navy mb-1">Signature du devis</h1>
      <p className="text-sm text-grayText mb-5">{devis.mission.type} — {devis.mission.artisan.user.name}</p>

      {/* Devis summary */}
      <Card className="mb-5">
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs text-forest font-semibold">#{devis.number}</span>
          <span className="font-mono text-lg font-bold text-navy">{formatPrice(devis.totalTTC)}</span>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-grayText">{item.label} {item.qty > 1 && `×${item.qty}`}</span>
              <span className="font-mono font-medium text-navy">{formatPrice(item.total)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm pt-2 border-t border-border">
            <span className="text-grayText">Total HT</span>
            <span className="font-mono font-medium text-navy">{formatPrice(devis.totalHT)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-grayText">TVA (20%)</span>
            <span className="font-mono font-medium text-navy">{formatPrice(devis.tva)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-border">
            <span className="font-bold text-navy">Total TTC</span>
            <span className="font-mono text-lg font-bold text-navy">{formatPrice(devis.totalTTC)}</span>
          </div>
        </div>
      </Card>

      {/* Signature canvas */}
      <Card className="mb-5">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Votre signature</h2>
        <div className="relative border-2 border-dashed border-border rounded-lg overflow-hidden">
          <canvas
            ref={canvasRef}
            width={560}
            height={140}
            className="w-full cursor-crosshair touch-none bg-white"
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
              <span className="text-sm text-grayText/50">Signez ici</span>
            </div>
          )}
        </div>
      </Card>

      <Button className="w-full gap-2" size="lg" disabled={!hasDrawn} onClick={() => setSigned(true)}>
        <Lock className="w-4 h-4" /> Signer le devis
      </Button>
    </div>
  );
}
