"use client";

import { TradeLanding } from "@/components/features/trade-landing";
import { trades } from "@/lib/trades";

export default function Page() {
  return <TradeLanding trade={trades.serrurier} />;
}
