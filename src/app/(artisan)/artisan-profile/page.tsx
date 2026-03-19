"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { CreditCard, FileText, BarChart3, Users, QrCode, Gift, Settings, HelpCircle, ChevronRight } from "lucide-react";
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
  { label: "Paiements", icon: CreditCard, href: "/artisan-payments" },
  { label: "Documents", icon: FileText, href: "/artisan-documents" },
  { label: "Comptabilité", icon: BarChart3, href: "/artisan-compta" },
  { label: "Clients", icon: Users, href: "/artisan-clients" },
  { label: "QR code", icon: QrCode, href: "/artisan-qr-code" },
  { label: "Inviter un artisan", icon: Gift, href: "/referral", highlight: true },
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
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-6">Mon profil</h1>

      {/* Avatar + identity */}
      <div className="bg-white rounded-[20px] p-5 border border-border text-center mb-5">
        <div className="w-[72px] h-[72px] rounded-[22px] bg-gradient-to-br from-forest to-sage flex items-center justify-center text-white font-heading text-xl font-extrabold mx-auto mb-3">
          {initials}
        </div>
        <div className="font-heading text-xl font-extrabold text-navy">{name}</div>
        <div className="text-[13px] text-grayText mt-1">
          Artisan Certifié Nova #2847
        </div>
        {profile?.isVerified && (
          <span className="inline-block bg-forest/10 text-forest text-xs font-semibold rounded-full px-2 py-0.5 mt-2">
            Certifié Nova
          </span>
        )}
      </div>

      {/* Personal info */}
      <div className="bg-white rounded-[20px] p-5 border border-border mb-4">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Informations personnelles</h2>
        <div className="space-y-3">
          {[
            { label: "Nom", value: name },
            { label: "Email", value: user?.email ?? "jm.petit@plomberie-pro.fr" },
            { label: "Téléphone", value: user?.phone ?? "Non renseigné" },
          ].map((f) => (
            <div key={f.label}>
              <div className="text-[11px] text-grayText">{f.label}</div>
              <div className="text-sm font-semibold text-navy">{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Company info */}
      <div className="bg-white rounded-[20px] p-5 border border-border mb-5">
        <h2 className="font-heading text-sm font-bold text-navy mb-3">Informations entreprise</h2>
        <div className="space-y-3">
          {[
            { label: "Raison sociale", value: profile?.companyName ?? "JM Plomberie Pro" },
            { label: "SIRET", value: "123 456 789 00012" },
            { label: "TVA", value: "FR 12 123456789" },
            { label: "Adresse", value: "8 rue des Artisans, 75011" },
            { label: "Code APE", value: `4322A` },
          ].map((f) => (
            <div key={f.label}>
              <div className="text-[11px] text-grayText">{f.label}</div>
              <div className="text-sm font-semibold text-navy">{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation menu */}
      <div className="bg-white rounded-[20px] border border-border divide-y divide-border overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-surface transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center shrink-0">
                <Icon className={`w-4 h-4 ${item.highlight ? "text-gold" : "text-forest"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-navy flex items-center gap-1.5">
                  {item.label}
                  {item.highlight && (
                    <span className="text-[10px] font-bold text-gold">20€</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-grayText shrink-0" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
