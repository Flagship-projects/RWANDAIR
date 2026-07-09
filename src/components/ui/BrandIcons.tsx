/* Inline brand + store icons so the footer stays self-contained (no icon dep). */

type P = { className?: string };

export const socialIcons: Record<string, (p: P) => JSX.Element> = {
  facebook: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  ),
  x: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.24 2h3.3l-7.2 8.23L22.8 22h-6.63l-5.2-6.79L4.99 22H1.68l7.7-8.8L1.2 2h6.8l4.7 6.21L18.24 2Zm-1.16 18h1.83L7.01 3.9H5.05L17.08 20Z" />
    </svg>
  ),
  youtube: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.12C19.55 3.6 12 3.6 12 3.6s-7.55 0-9.4.48A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.12C4.45 20.4 12 20.4 12 20.4s7.55 0 9.4-.48a3 3 0 0 0 2.1-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.4 3.6-6.4 3.6Z" />
    </svg>
  ),
  instagram: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.68A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm6.4-10.4a1.44 1.44 0 1 0 1.44 1.44A1.44 1.44 0 0 0 18.4 5.6Z" />
    </svg>
  ),
  linkedin: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  ),
  tiktok: ({ className }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.6 5.82a4.28 4.28 0 0 1-1.06-2.82h-3.3v13.11a2.44 2.44 0 0 1-2.44 2.36 2.44 2.44 0 1 1 .7-4.78v-3.36a5.8 5.8 0 1 0 5.04 5.74V8.9a7.5 7.5 0 0 0 4.36 1.4V6.97a4.28 4.28 0 0 1-3.3-1.15Z" />
    </svg>
  ),
};

export const GooglePlayIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden>
    <path fill="#00D3FF" d="m3.6 1.9 10.2 10.1L3.6 22.1a1.7 1.7 0 0 1-.6-1.3V3.2c0-.5.2-1 .6-1.3Z" />
    <path fill="#00F076" d="M3.6 1.9c.4-.3 1-.4 1.6 0l12.3 7-3.7 3.1L3.6 1.9Z" />
    <path fill="#FF3A44" d="m13.8 12 3.7 3.1-12.3 7c-.6.4-1.2.3-1.6 0L13.8 12Z" />
    <path fill="#FFC900" d="m17.5 8.9 3 1.7c1 .6 1 1.8 0 2.4l-3 1.7L13.8 12l3.7-3.1Z" />
  </svg>
);

export const AppleIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M17.05 12.54c-.03-2.56 2.1-3.79 2.19-3.85-1.2-1.75-3.06-1.99-3.72-2.02-1.58-.16-3.09.93-3.89.93-.8 0-2.04-.91-3.36-.88-1.73.03-3.32 1-4.21 2.55-1.8 3.12-.46 7.74 1.29 10.27.85 1.24 1.87 2.63 3.2 2.58 1.28-.05 1.77-.83 3.32-.83s1.98.83 3.34.8c1.38-.02 2.25-1.26 3.09-2.51.97-1.44 1.37-2.83 1.4-2.9-.03-.02-2.68-1.03-2.71-4.09-.02-.05-.23-.06-.23-.06ZM14.6 4.6c.71-.86 1.19-2.06 1.06-3.25-1.02.04-2.26.68-2.99 1.54-.66.76-1.23 1.98-1.08 3.14 1.14.09 2.3-.58 3.01-1.43Z" />
  </svg>
);

export const ArrowRightIcon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
