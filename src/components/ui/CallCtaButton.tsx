"use client";

import { Phone } from "lucide-react";
import { trackCallClick } from "@/lib/analytics";

interface CallCtaButtonProps {
  colonyName: string;
}

export function CallCtaButton({ colonyName }: CallCtaButtonProps) {
  const handleClick = () => {
    trackCallClick("colony_detail", colonyName);

    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919999999999";
    const message = `Hi, I am interested in ${colonyName}. Please share more details about site visits and pricing.`;
    const url = `https://wa.me/${number.replace(/[^0-9+]/g, "")}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="btn-primary w-full py-3 justify-center"
      aria-label={`Contact expert for ${colonyName}`}
    >
      <Phone size={15} /> Request a Site Visit
    </button>
  );
}
