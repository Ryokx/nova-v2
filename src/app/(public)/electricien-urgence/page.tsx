"use client";

import { TradeUrgency } from "@/components/features/trade-urgency";
import { trades } from "@/lib/trades";

export default function Page() {
  return <TradeUrgency trade={trades.electricien} />;
}
