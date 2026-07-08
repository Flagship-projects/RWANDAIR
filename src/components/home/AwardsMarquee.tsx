import { awards } from "@/lib/data";

export function AwardsMarquee() {
  const loop = [...awards, ...awards];

  return (
    <section className="border-t border-line py-section-sm">
      <div className="mb-8 px-gutter">
        <p className="text-fluid-xs uppercase tracking-wideish text-blue-500">Recognition</p>
      </div>
      <div className="hide-scrollbar overflow-x-auto">
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-16 px-gutter hover:[animation-play-state:paused]">
          {loop.map((a, i) => (
            <span key={i} className="whitespace-nowrap font-display text-fluid-h3 font-light text-ink/20">
              {a}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
