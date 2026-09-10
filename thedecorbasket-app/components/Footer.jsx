import Link from "next/link";

export default function Footer({ settings }) {
  const whatsapp = settings?.whatsapp_number;
  const email = settings?.email;
  const instagram = settings?.instagram_url;

  return (
    <footer id="contact" className="bg-ink text-ivory pt-12 pb-6 mt-16">
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">

        {/* Brand */}
        <div>
          <h4 className="text-[#D9A441] font-display text-lg mb-2">
            {settings?.site_title || "The Decor Basket"}
          </h4>

          <p className="text-[#F5E9D5] text-sm max-w-xs">
            {settings?.tagline || "Curated with Care, Styled with Love"}
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4 className="text-[#D9A441] font-display text-lg mb-2">
            Explore
          </h4>

          <ul className="space-y-1 text-sm">
            <li>
              <Link
                href="/shop"
                className="text-[#F5E9D5] hover:text-white"
              >
                Shop All
              </Link>
            </li>

            <li>
              <Link
                href="/#about"
                className="text-[#F5E9D5] hover:text-white"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                href="/#contact"
                className="text-[#F5E9D5] hover:text-white"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Reach Us */}
        <div>
          <h4 className="text-[#D9A441] font-display text-lg mb-2">
            Reach Us
          </h4>

          <ul className="space-y-1 text-sm">
            {email && (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="text-[#F5E9D5] hover:text-white"
                >
                  {email}
                </a>
              </li>
            )}

            {whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener"
                  className="text-[#F5E9D5] hover:text-white"
                >
                  WhatsApp
                </a>
              </li>
            )}

            {instagram && (
              <li>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener"
                  className="text-[#F5E9D5] hover:text-white"
                >
                  Instagram
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto px-5 border-t border-ivory/15 pt-4 flex flex-wrap justify-between gap-2 text-xs">
        <span className="text-[#CDBFAE]">
          © {new Date().getFullYear()}{" "}
          {settings?.site_title || "The Decor Basket"}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
