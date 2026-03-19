"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Shield, CreditCard, FileText, BarChart3, Users, QrCode, Gift, Settings, HelpCircle, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";

interface ArtisanProfileData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  artisanProfile: {
    companyName: string | null;
    trade: string;
    isVerified: boolean;
    rating: number;
    reviewCount: number;
  } | null;
}

const menuItems = [
  { label: "Mes paiements", icon: CreditCard, href: "/artisan-payments" },
  { label: "Mes documents", icon: FileText, href: "/artisan-documents" },
  { label: "Comptabilité", desc: "Pennylane, Indy, export auto", icon: BarChart3, href: "/artisan-compta" },
  { label: "Mes clients", desc: "Carnet d'adresses et historique", icon: Users, href: "/artisan-clients" },
  { label: "Mon QR code", desc: "Véhicule, cartes, devis", icon: QrCode, href: "/artisan-qr-code" },
  { label: "Inviter un artisan", desc: "Gagnez 20€ par parrainage", icon: Gift, href: "/referral" },
  { label: "Paramètres", icon: Settings, href: "/settings" },
  { label: "Support", icon: HelpCircle, href: "/support" },
];

export default function ArtisanProfilePage() {
  const { data: session } = useSession();
  const { data: user, loading } = useFetch<ArtisanProfileData>("/api/auth/me");

  if (loading) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8 space-y-4">
        <Skeleton height={28} width={120} />
        <Skeleton variant="rectangular" height={180} />
        <Skeleton variant="rectangular" height={400} />
      </div>
    );
  }

  const name = user?.name ?? session?.user?.name ?? "Artisan";
  const profile = user?.artisanProfile;

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-6">Mon profil</h1>

      {/* Avatar card */}
      <Card className="text-center mb-5">
        <Avatar name={name} size="lg" className="w-[72px] h-[72px] text-xl mx-auto mb-3 bg-gradient-to-br from-forest to-deepForest text-white" />
        <div className="font-heading text-xl font-bold text-navy">{name}</div>
        <div className="text-[13px] text-grayText flex items-center justify-center gap-1.5 mt-1">
          {profile?.isVerified && <Shield className="w-3.5 h-3.5 text-forest" />}
          Artisan Certifié Nova • #2847
        </div>
        {profile?.isVerified && (
          <Badge className="bg-amber-800/10 text-amber-800 mt-2">Certifié Nova</Badge>
        )}
      </Card>

      {/* Personal info */}
      <Card className="mb-4">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Informations personnelles</h2>
        <div className="space-y-3">
          {[
            { label: "Nom", value: name },
            { label: "Email", value: user?.email ?? "" },
            { label: "Téléphone", value: user?.phone ?? "Non renseigné" },
          ].map((f) => (
            <div key={f.label}>
              <div className="text-[11px] text-grayText">{f.label}</div>
              <div className="text-sm font-semibold text-navy">{f.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Company info */}
      <Card className="mb-5">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Informations entreprise</h2>
        <div className="space-y-3">
          {[
            { label: "Raison sociale", value: profile?.companyName ?? "—" },
            { label: "SIRET", value: "123 456 789 00012" },
            { label: "TVA", value: "FR 12 123456789" },
            { label: "Adresse", value: "8 rue des Artisans, 75011" },
            { label: "Code APE", value: `4322A — ${profile?.trade ?? "Plomberie"}` },
          ].map((f) => (
            <div key={f.label}>
              <div className="text-[11px] text-grayText">{f.label}</div>
              <div className="text-sm font-semibold text-navy">{f.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Menu links */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3.5 px-5 py-3.5 rounded-[14px] border border-border bg-white hover:bg-surface transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-forest shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-navy">{item.label}</div>
                {"desc" in item && item.desc && (
                  <div className="text-[11px] text-grayText">{item.desc}</div>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-grayText" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
