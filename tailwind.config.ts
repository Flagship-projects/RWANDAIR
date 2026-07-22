import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    screens: {
      xs: "420px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1800px",
    },
    extend: {
      colors: {
        // Ink = dark navy text on light backgrounds
        ink: {
          DEFAULT: "#0b1f3a",
          soft: "#243a58",
          muted: "#5a6b83",
        },
        // Paper = warm off-white backgrounds
        paper: {
          DEFAULT: "#f6f3ec",
          dim: "#ece7db",
          bright: "#ffffff",
        },
        // RwandAir royal blue (brand primary)
        blue: {
          50: "#eaf2fb",
          100: "#cfe1f4",
          300: "#6fa4d6",
          500: "#0050a0",
          600: "#00417f",
          700: "#00305f",
          900: "#001b39",
        },
        // Sky cyan (secondary brand blue)
        sky: {
          300: "#7fccef",
          500: "#20a0e0",
          600: "#1683bd",
        },
        // Brand leaf green
        green: {
          300: "#c2e08a",
          500: "#8bbf3c",
          600: "#6ea02b",
        },
        // Sun gold accent
        gold: {
          300: "#ffe07a",
          400: "#f7c623",
          500: "#e8a600",
        },
        line: "rgba(11, 31, 58, 0.12)",
        "line-strong": "rgba(11, 31, 58, 0.22)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      fontSize: {
        // Body-level scale — kept deliberately small (~10–14px)
        "fluid-xs": "clamp(0.625rem, 0.6rem + 0.12vw, 0.7rem)",
        "fluid-sm": "clamp(0.7rem, 0.66rem + 0.16vw, 0.8rem)",
        "fluid-body": "clamp(0.78rem, 0.74rem + 0.2vw, 0.9rem)",
        "fluid-lg": "clamp(0.95rem, 0.85rem + 0.35vw, 1.25rem)",
        // Headers — large, editorial (unchanged)
        "fluid-h3": "clamp(1.75rem, 1.4rem + 1.5vw, 2.75rem)",
        "fluid-h2": "clamp(2.5rem, 1.9rem + 2.6vw, 4.5rem)",
        "fluid-h1": "clamp(3rem, 2rem + 4.5vw, 7rem)",
        "fluid-display": "clamp(3.5rem, 1.8rem + 7vw, 10rem)",
      },
      spacing: {
        // The lower bound of each clamp is what a phone actually gets, and it
        // was set from the desktop end — 112px of dead air above and below every
        // section, which on a 390px screen reads as sections that have come
        // apart rather than as breathing room. The minimums are tuned for the
        // small screen now; the vw term still carries the desktop values, which
        // are unchanged from ~1024px up.
        "section-sm": "clamp(2.25rem, 0.75rem + 5vw, 6rem)",
        "section-md": "clamp(3.25rem, 1rem + 9vw, 9rem)",
        "section-lg": "clamp(4.5rem, 1.5rem + 12.8vw, 13rem)",
        gutter: "clamp(1.25rem, 1rem + 2vw, 3.5rem)",
      },
      maxWidth: {
        shell: "1800px",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.16, 1, 0.3, 1)",
        snap: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      letterSpacing: {
        tightest: "-0.045em",
        wideish: "0.14em",
      },
    },
  },
  plugins: [],
};

export default config;
