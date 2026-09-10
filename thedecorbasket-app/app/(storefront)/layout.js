import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CartProvider } from "@/components/CartContext";
import { getHomepageSettings } from "@/lib/data";

export default async function StorefrontLayout({ children }) {
  const settings = await getHomepageSettings();

  return (
    <CartProvider>
      <Header settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
      <WhatsAppFloat number={settings?.whatsapp_number} />
    </CartProvider>
  );
}
