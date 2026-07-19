"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { socialLinks } from "@/lib/data";
import { socialIcons } from "@/components/ui/BrandIcons";
import { ensureGsapRegistered } from "@/lib/motion";

/**
 * Route arcs laid out in the 1600x900 stage viewBox. They deliberately steer
 * clear of the centre block (roughly x 450–1150, y 330–560) so the lockup never
 * has a line running through it.
 */
const ROUTES = [
  "M -100 300 C 300 60, 900 20, 1700 220",
  "M -100 760 C 250 560, 800 640, 1700 420",
  "M 420 1000 C 620 720, 900 560, 1740 460",
  "M -120 120 C 200 420, 500 760, 900 980",
  "M 1740 640 C 1200 740, 700 860, 60 800",
];

/** Top-down airliner silhouette, nose pointing along +X so autoRotate reads right. */
const PLANE =
  "M 11 0 L 4 -1.6 L 1.5 -1.9 L -1 -9 L -3.6 -9 L -2.6 -1.7 L -7 -1.5 L -8.6 -4.8 L -10.2 -4.8 L -9.6 -1.3 L -11.4 0 L -9.6 1.3 L -10.2 4.8 L -8.6 4.8 L -7 1.5 L -2.6 1.7 L -3.6 9 L -1 9 L 1.5 1.9 L 4 1.6 Z";

/**
 * Ghost aircraft scattered in the field, echoing the reference artwork. Placed in
 * viewport percentages rather than SVG user units — the arcs are drawn with
 * `slice`, which crops hard on anything narrower than 16:9 and would throw most
 * of these off-frame. They steer clear of the centre block the lockup occupies.
 */
const GHOSTS = [
  { left: "86%", top: "18%", r: -18, s: 1.5 },
  { left: "7%", top: "40%", r: 22, s: 1.15 },
  { left: "26%", top: "68%", r: -8, s: 0.95 },
  { left: "78%", top: "66%", r: 14, s: 1.3 },
  { left: "44%", top: "20%", r: -30, s: 0.9 },
  { left: "62%", top: "78%", r: -26, s: 1.05 },
  { left: "16%", top: "86%", r: 10, s: 0.85 },
];

/** Where along each arc its waypoint dot sits — resolved from the real path. */
const NODE_AT = [0.42, 0.5, 0.38, 0.52, 0.46];

export function ClosingSignature() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsapRegistered();
    gsap.registerPlugin(MotionPathPlugin);

    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const routes = q<SVGPathElement>(".cs-route");
      const planes = q<SVGGElement>(".cs-plane");
      const ghosts = q<HTMLElement>(".cs-ghost");
      const nodes = q<SVGCircleElement>(".cs-node");

      // Seed each arc as a fully hidden dashed stroke so it can draw itself.
      const lengths = routes.map((p) => p.getTotalLength());
      routes.forEach((p, i) => {
        gsap.set(p, { strokeDasharray: lengths[i], strokeDashoffset: lengths[i] });
      });

      // Park each waypoint on its own arc rather than trusting hand-typed coords.
      nodes.forEach((n, i) => {
        const pt = routes[i].getPointAtLength(lengths[i] * NODE_AT[i]);
        gsap.set(n, { attr: { cx: pt.x, cy: pt.y } });
      });

      if (reduced) {
        // Present the finished composition; skip the scrubbed build entirely.
        gsap.set(routes, { strokeDashoffset: 0 });
        gsap.set(
          [".cs-field", ".cs-glow", ".cs-lockup", ".cs-tagline", ".cs-outro", ghosts, nodes],
          { opacity: 1 }
        );
        gsap.set(".cs-lockup", { scale: 1, y: 0, filter: "blur(0px)" });
        // Both of these otherwise sit at their pre-animation value: the planes
        // parked on the arc starts, and the footer feather covering the top.
        gsap.set(planes, { opacity: 0 });
        gsap.set(".cs-topfade", { opacity: 0 });
        return;
      }

      // Ambient life — runs independently of scroll so the frame never feels frozen.
      const ambient = [
        gsap.to([".cs-field", ".cs-fleet"], { xPercent: -1.6, yPercent: 1.2, duration: 18, ease: "sine.inOut", yoyo: true, repeat: -1 }),
        gsap.to(".cs-glow", { scale: 1.08, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1 }),
      ];

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 1 },
      });

      // 1 — the world arrives: feather off the footer, lift the glow in.
      tl.fromTo(".cs-topfade", { opacity: 1 }, { opacity: 0, duration: 0.14 }, 0);
      tl.fromTo(".cs-glow", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, 0.02);
      tl.fromTo(".cs-field", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.32, ease: "power2.out" }, 0.02);

      // 2 — arcs draw themselves across the frame, one leading the next.
      routes.forEach((p, i) => {
        tl.to(p, { strokeDashoffset: 0, duration: 0.34, ease: "power1.inOut" }, 0.06 + i * 0.055);
      });

      // 3 — the lockup settles into place out of a soft focus.
      tl.fromTo(
        ".cs-lockup",
        { opacity: 0, scale: 1.12, y: 34, filter: "blur(14px)" },
        { opacity: 1, scale: 1, y: 0, filter: "blur(0px)", duration: 0.26, ease: "power3.out" },
        0.16
      );
      tl.fromTo(".cs-tagline", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, 0.3);

      // 4 — aircraft fly their routes; each fades in on departure, out on arrival.
      planes.forEach((plane, i) => {
        const path = routes[i % routes.length];
        const at = 0.2 + i * 0.07;
        const dur = 0.5;
        tl.fromTo(
          plane,
          { opacity: 0 },
          {
            opacity: 1,
            duration: dur,
            motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true },
          },
          at
        );
        tl.to(plane, { opacity: 0, duration: 0.1 }, at + dur - 0.1);
      });

      // 5 — ghost fleet and waypoints resolve out of the haze.
      tl.fromTo(ghosts, { opacity: 0, scale: 0.86 }, { opacity: 1, scale: 1, duration: 0.24, stagger: 0.03, ease: "power2.out" }, 0.34);
      tl.fromTo(nodes, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.14, stagger: 0.035, ease: "back.out(2.2)" }, 0.46);

      // 6 — the sign-off lands last, then the whole frame simply holds.
      tl.fromTo(".cs-outro", { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, 0.58);

      return () => ambient.forEach((t) => t.kill());
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      aria-label="RwandAir — Fly the dream of Africa"
      className="relative h-[280vh] bg-blue-500"
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Deep-blue field with a warm centre glow behind the lockup */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_45%,#0a63bd_0%,#0050a0_38%,#00305f_100%)]" />
        <div
          className="cs-glow pointer-events-none absolute left-1/2 top-[46%] h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 will-change-transform"
          style={{
            background:
              "radial-gradient(circle, rgba(127,204,239,0.22) 0%, rgba(32,160,224,0.10) 38%, rgba(0,48,95,0) 68%)",
          }}
          aria-hidden
        />

        {/* Route field — arcs, waypoints, ghost fleet and the live aircraft */}
        <svg
          className="cs-field absolute inset-0 h-full w-full opacity-0 will-change-transform"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
          aria-hidden
        >
          {ROUTES.map((d, i) => (
            <path
              key={i}
              d={d}
              className="cs-route"
              stroke="rgba(255,255,255,0.32)"
              strokeWidth={1.1}
              strokeLinecap="round"
            />
          ))}

          {NODE_AT.map((_, i) => (
            <circle key={i} r={4.5} className="cs-node opacity-0" fill="rgba(255,255,255,0.85)" />
          ))}

          {ROUTES.map((_, i) => (
            <g key={i} className="cs-plane opacity-0">
              <path d={PLANE} fill="rgba(255,255,255,0.9)" />
            </g>
          ))}
        </svg>

        {/* Ghost fleet — viewport-anchored so it survives every aspect ratio */}
        <div className="cs-fleet pointer-events-none absolute inset-0 will-change-transform" aria-hidden>
          {GHOSTS.map((g, i) => (
            <span
              key={i}
              className="absolute block"
              style={{ left: g.left, top: g.top, transform: `translate(-50%, -50%) rotate(${g.r}deg)` }}
            >
              <span className="cs-ghost block opacity-0">
                <svg viewBox="-13 -10 26 20" width={26 * g.s} height={20 * g.s} fill="rgba(255,255,255,0.16)">
                  <path d={PLANE} />
                </svg>
              </span>
            </span>
          ))}
        </div>

        {/* Centrepiece lockup */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-gutter text-center">
          <div className="cs-lockup opacity-0 will-change-transform">
            <Image
              src="/assets/brand/mark.png"
              alt="RwandAir"
              width={252}
              height={55}
              priority={false}
              className="h-auto w-[min(72vw,540px)]"
            />
          </div>
          <p className="cs-tagline mt-6 font-display text-fluid-lg italic text-gold-400 opacity-0">
            Fly the dream of Africa
          </p>
        </div>

        {/* Sign-off rail */}
        <div className="cs-outro absolute inset-x-0 bottom-0 z-10 px-gutter pb-[max(2.5rem,6vh)] opacity-0">
          <div className="mx-auto flex max-w-shell flex-col items-center gap-6">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {socialLinks.map((s) => {
                const Icon = socialIcons[s.icon];
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors duration-300 hover:border-gold-400 hover:bg-gold-400 hover:text-blue-700"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                );
              })}
            </div>
            <p className="text-fluid-xs uppercase tracking-wideish text-white/45">Kigali — the heart of Africa</p>
          </div>
        </div>

        {/* Feather out of the footer above */}
        <div
          className="cs-topfade pointer-events-none absolute inset-x-0 top-0 z-20 h-[45vh] bg-gradient-to-b from-paper-dim to-transparent"
          aria-hidden
        />
      </div>
    </section>
  );
}
