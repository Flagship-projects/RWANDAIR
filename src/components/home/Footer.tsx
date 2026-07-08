import Image from "next/image";
import { footerColumns, socialLinks } from "@/lib/data";

export function Footer() {
  return (
    <footer id="holidays" className="border-t border-line bg-paper-dim">
      <div className="mx-auto max-w-shell px-gutter py-section-md">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <Image
              src="/assets/brand/logotype.png"
              alt="RwandAir"
              width={160}
              height={38}
              className="h-7 w-auto"
            />
            <p className="mt-6 max-w-xs text-fluid-sm text-ink/55">
              Rwanda&rsquo;s national carrier, connecting Kigali to Africa, Europe and the
              Middle East.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              {socialLinks.map((s) => (
                <a
                  key={s}
                  href="#"
                  className="focus-ring text-fluid-xs uppercase tracking-wideish text-ink/45 hover:text-blue-500"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="text-fluid-xs uppercase tracking-wideish text-blue-500">{col.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="focus-ring text-fluid-sm text-ink/60 hover:text-blue-500">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-fluid-xs text-ink/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} RwandAir. Concept redesign — not an official site.</p>
          <p>Fly the Dream of Africa</p>
        </div>
      </div>
    </footer>
  );
}
