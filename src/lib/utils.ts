import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const LOWERCASE_WORDS = [
  "di",
  "ke",
  "dari",
  "dan",
  "atau",
  "yang",
  "untuk",
  "pada",
  "dengan",
  "oleh",
  "sebagai",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toTitleCase(value: string) {
  return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function strictTitleCase(text: string) {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (!word) return word;

      // kata pertama selalu kapital
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }

      // kata penghubung tetap lowercase
      if (LOWERCASE_WORDS.includes(word)) {
        return word;
      }

      // default title case
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export const formatRupiah = (value: number | string) =>
  new Intl.NumberFormat("id-ID").format(Number(value || 0));

export const parseRupiah = (value: string) => value.replace(/[^\d]/g, "");
