"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { CreditCard, FileText, Gift, Settings, HelpCircle, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
}

const quickLinks = [
  { label: "Moyens de paiement", desc: "Visa •••• 6411", icon: CreditCard, href: "/payment-methods" },
  { label: "Mes missions", desc: "3 missions terminées", icon: FileText, href: "/missions" },
  { label: "Inviter des amis", desc: "Gagnez 20€ par parrainage 🎁", icon: Gift, href: "/referral" },
  { label: "Paramètres", desc: null, icon: Settings, href: "/settings" },
  { label: "Support", desc: null, icon: HelpCircle, href: "/support" },
];

export default function ProfilePage() {
  const { data: session } = useSession();
  const { data: user, loading } = useFetch<UserProfile>("/api/auth/me");

  if (loading) {
    return (
      <div className="max-w-[600px] mx-auto p-5 md:p-8 space-y-4">
        <Skeleton height={28} width={120} />
        <Skeleton variant="rectangular" height={180} />
        <Skeleton variant="rectangular" height={300} />
      </div>
    );
  }

  const name = user?.name ?? session?.user?.name ?? "Utilisateur";

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      <h1 className="font-heading text-[26px] font-extrabold text-navy mb-6">Mon profil</h1>

      {/* Avatar card */}
      <Card className="text-center mb-5">
        <Avatar name={name} src={user?.avatar} size="lg" className="w-[72px] h-[72px] text-xl mx-auto mb-3" />
        <div className="font-heading text-xl font-bold text-navy">{name}</div>
        <div className="text-[13px] text-grayText">Compte particulier</div>
      </Card>

      {/* Personal info */}
      <Card className="mb-5">
        <h2 className="font-heading text-sm font-bold text-navy mb-4">Informations personnelles</h2>
        <div className="space-y-3">
          {[
            { label: "Nom complet", value: name },
            { label: "Email", value: user?.email ?? "" },
            { label: "Téléphone", value: user?.phone ?? "Non renseigné" },
            { label: "Adresse", value: "Non renseignée" },
          ].map((field) => (
            <div key={field.label}>
              <div className="text-[11px] text-grayText">{field.label}</div>
              <div className="text-sm font-semibold text-navy">{field.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick links */}
      <Card className="p-0 overflow-hidden">
        {quickLinks.map((link, i) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center gap-3.5 px-5 py-4 hover:bg-surface transition-colors ${
                i < quickLinks.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-surface flex items-center justify-center text-forest">
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-navy">{link.label}</div>
                {link.desc && <div className="text-[11px] text-grayText">{link.desc}</div>}
              </div>
              <ChevronRight className="w-4 h-4 text-grayText" />
            </Link>
          );
        })}
      </Card>
    </div>
  );
}
