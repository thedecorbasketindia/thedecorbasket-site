import "./globals.css";

export const metadata = {
  title: "The Decor Basket — Curated with Care, Styled with Love",
  description:
    "Home decor, wooden craft, fashion, candles and more — curated by The Decor Basket.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
