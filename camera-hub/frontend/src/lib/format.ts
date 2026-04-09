export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatPrice(value: string | null): string {
  if (!value) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    parseFloat(value)
  );
}

export function formatRating(value: number): string {
  return `${value}/10`;
}
