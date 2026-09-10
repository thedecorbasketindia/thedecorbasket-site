"use client";

export default function WhatsAppFloat({ number }) {
  if (!number) return null;
  const url = `https://wa.me/${number}?text=${encodeURIComponent(
    "Hi! I'd like to know more about your products."
  )}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 bg-olive text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg"
    >
      💬
    </a>
  );
}
