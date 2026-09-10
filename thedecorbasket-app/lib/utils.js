export function formatPrice(value) {
  if (value == null || value === "") return "Price on request";
  const num = Number(value);
  if (Number.isNaN(num)) return "Price on request";
  return `₹${num.toLocaleString("en-IN")}`;
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function whatsappLink(number, message) {
  const text = encodeURIComponent(message || "");
  return `https://wa.me/${number}${text ? `?text=${text}` : ""}`;
}
