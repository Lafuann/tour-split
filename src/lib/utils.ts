import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(value: string) {
  return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export const formatRupiah = (value: number | string) =>
  new Intl.NumberFormat("id-ID").format(Number(value || 0));

export const parseRupiah = (value: string) => value.replace(/[^\d]/g, "");
