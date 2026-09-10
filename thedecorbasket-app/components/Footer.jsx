import Link from "next/link";

export default function Footer({ settings }) {
  const whatsapp = settings?.whatsapp_number;
  const email = settings?.email;
  const instagram = settings?.instagram_url;

  return (
    <footer
      id="contact"
      className="bg-ink pt-12 pb-6 mt-16"
    >
      <div className="max-w-6xl mx-auto px-5 grid grid-cols-1 md:grid-cols-3 gap-8 pb-8">

        {/* Brand */}
        <div>
          <h4
            className="font-display font-bold text-lg mb-2"
            style={{ color: "#E3B15C" }}
          >
            {settings?.site_title || "The Decor Basket"}
          </h4>

          <p className="text-white text-sm font-normal max-w-xs">
            {settings?.tagline || "Curated with Care, Styled with Love"}
          </p>
        </div>

        {/* Explore */}
        <div>
          <h4
            className="font-display font-bold text-lg mb-2"
            style={{ color: "#E3B15C" }}
          >
            Explore
          </h4>

          <ul className="space-y-1 text-sm font-normal">
            <li>
              <Link
                href="/shop"
                className="text-white font-normal hover:text-[#E3B15C] transition-colors"
              >
                Shop All
              </Link>
            </li>

            <li>
              <Link
                href="/#about"
                className="text-white font-normal hover:text-[#E3B15C] transition-colors"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                href="/#contact"
                className="text-white font-normal hover:text-[#E3B15C] transition-colors"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Reach Us */}
        <div>
          <h4
            className="font-display font-bold text-lg mb-2"
            style={{ color: "#E3B15C" }}
          >
            Reach Us
          </h4>

          <ul className="space-y-2 text-sm font-normal">

            {/* Email */}
            {email && (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-white font-normal hover:text-[#E3B15C] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m3 7 9 6 9-6" />
                  </svg>

                  <span>{email}</span>
                </a>
              </li>
            )}

            {/* WhatsApp */}
            {whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white font-normal hover:text-[#E3B15C] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2a9.9 9.9 0 0 0-8.56 14.9L2 22l5.27-1.38A9.9 9.9 0 1 0 12 2Zm0 18a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.13.82.84-3.05-.2-.31A8.1 8.1 0 1 1 12 20Zm4.44-6.08c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.18-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.01-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.31.98 2.47c.12.16 1.68 2.57 4.08 3.61.57.25 1.01.4 1.35.51.57.18 1.09.15 1.5.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                  </svg>

                  <span>WhatsApp</span>
                </a>
              </li>
            )}

            {/* Instagram */}
            {instagram && (
              <li>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white font-normal hover:text-[#E3B15C] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle
                      cx="17.5"
                      cy="6.5"
                      r="1"
                      fill="currentColor"
                      stroke="none"
                    />
                  </svg>

                  <span>Instagram</span>
                </a>
              </li>
            )}

          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto px-5 border-t border-ivory/15 pt-4 flex flex-wrap justify-between gap-2 text-xs">
        <span
          className="font-bold"
          style={{ color: "#E3B15C" }}
        >
          © {new Date().getFullYear()}{" "}
          {settings?.site_title || "The Decor Basket"}. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
