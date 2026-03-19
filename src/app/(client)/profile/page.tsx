"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { CreditCard, FileText, Gift, Settings, HelpCircle, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetch } from "@/hooks/use-fetch";

interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  avatar: string | null;
}

const navLinks = [
  { label: "Moyens de paiement", icon: CreditCard, href: "/payment-methods", accent: false },
  { label: "Mes missions", icon: FileText, href: "/missions", accent: false },
  { label: "Inviter des proches (20€)", icon: Gift, href: "/referral", accent: true },
  { label: "Paramètres", icon: Settings, href: "/settings", accent: false },
  { label: "Support", icon: HelpCircle, href: "/support", accent: false },
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

  const name = user?.name ?? session?.user?.name ?? "Sophie Lefevre";
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-[600px] mx-auto p-5 md:p-8">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-[72px] h-[72px] rounded-[22px] bg-gradient-to-br from-forest to-sage flex items-center justify-center mb-3">
          <span className="font-heading font-bold text-2xl text-white">{initials}</span>
        </div>
        <h1 className="font-heading text-xl font-extrabold text-navy">{name}</h1>
        <p className="text-sm text-grayText">Compte particulier</p>
      </div>

      {/* Personal info card */}
      <div className="bg-white rounded-[20px] p-5 border border-border mb-5">
        <div className="space-y-4">
          {[
            { label: "NOM", value: name },
            { label: "EMAIL", value: user?.email ?? "sophie.lefevre@email.com" },
            { label: "TÉLÉPHONE", value: user?.phone ?? "06 12 34 56 78" },
            { label: "ADRESSE", value: "12 rue de Rivoli, 75004" },
          ].map((field) => (
            <div key={field.label}>
              <div className="text-xs text-grayText uppercase font-mono">{field.label}</div>
              <div className="text-sm text-navy">{field.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation rows */}
      <div className="bg-white rounded-[20px] border border-border divide-y divide-border overflow-hidden">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center justify-between px-5 py-4 hover:bg-surface transition-colors"
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${link.accent ? "text-gold" : "text-forest"}`} />
                <span className={`text-sm font-semibold ${link.accent ? "text-navy" : "text-navy"}`}>
                  {link.label}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-grayText" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}
