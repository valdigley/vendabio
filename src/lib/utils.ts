import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const BASE_PATH = "/vendabio";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number | null | undefined): string {
  if (value == null) return "";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "Z").toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr + "Z");
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export function detectPlatform(url: string): string {
  if (url.includes("mercadolivre.com") || url.includes("mercadolibre.com")) return "mercadolivre";
  if (url.includes("amazon.com")) return "amazon";
  if (url.includes("shopee.com")) return "shopee";
  if (url.includes("aliexpress.com") || url.includes("ali.ski")) return "aliexpress";
  if (url.includes("magazineluiza.com") || url.includes("magalu.com") || url.includes("magazinevoce.com")) return "magalu";
  return "manual";
}
