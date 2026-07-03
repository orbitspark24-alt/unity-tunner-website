export function inr(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

export const WHATSAPP_NUMBER = "919876543210";

export function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
