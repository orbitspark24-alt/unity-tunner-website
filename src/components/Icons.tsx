import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...props,
});

export const IconEcu = (p: P) => (
  <svg {...base(p)}>
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <path d="M9 9h6v6H9z" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </svg>
);

export const IconDyno = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 17a9 9 0 0 1 18 0" />
    <path d="M12 17l4.5-5.5" />
    <circle cx="12" cy="17" r="1.6" fill="currentColor" stroke="none" />
    <path d="M3 21h18" />
  </svg>
);

export const IconTurbo = (p: P) => (
  <svg {...base(p)}>
    <circle cx="11" cy="12" r="7" />
    <circle cx="11" cy="12" r="2.4" />
    <path d="M11 5v4.6M17.3 8.5l-4 2.3M17.3 15.5l-4-2.3M11 19v-4.6M4.7 15.5l4-2.3M4.7 8.5l4 2.3" />
    <path d="M18 12h4M20 9.5l2 2.5-2 2.5" />
  </svg>
);

export const IconExhaust = (p: P) => (
  <svg {...base(p)}>
    <path d="M2 12h9a4 4 0 0 1 4 4v0a4 4 0 0 0 4 4h3" />
    <path d="M2 8h7M2 16h5" />
    <circle cx="20" cy="8" r="1.2" />
    <circle cx="17" cy="5" r="1" />
    <circle cx="21" cy="4" r="0.8" />
  </svg>
);

export const IconIntake = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 6l8-3 8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6z" />
    <path d="M8 8.5h8M8 11.5h8M8 14.5h6" />
  </svg>
);

export const IconFab = (p: P) => (
  <svg {...base(p)}>
    <path d="M14.5 6.5a4.5 4.5 0 0 0-6 6L3 18l3 3 5.5-5.5a4.5 4.5 0 0 0 6-6L14 13l-3-3 3.5-3.5z" />
  </svg>
);

export const IconHealth = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 12h4l2-6 4 12 2-6h6" />
  </svg>
);

export const IconCart = (p: P) => (
  <svg {...base(p)}>
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="17" cy="20" r="1.5" />
    <path d="M3 3h2.5l2.2 12.5h10.8L21 7H6" />
  </svg>
);

export const IconHeart = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 20.5s-8-4.9-8-11a4.5 4.5 0 0 1 8-2.8 4.5 4.5 0 0 1 8 2.8c0 6.1-8 11-8 11z" />
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5L21 21" />
  </svg>
);

export const IconStar = ({ filled = true, ...p }: P & { filled?: boolean }) => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill={filled ? "#e10600" : "none"} stroke="#e10600" strokeWidth={1.6} {...p}>
    <path d="M12 2.5l2.9 6.2 6.6.8-4.9 4.6 1.3 6.6L12 17.4l-5.9 3.3 1.3-6.6L2.5 9.5l6.6-.8L12 2.5z" strokeLinejoin="round" />
  </svg>
);

export const IconWhatsApp = (p: P) => (
  <svg width={26} height={26} viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.6-6.1c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1-.3-.1-1.1-.4-2-1.2-.8-.7-1.3-1.5-1.4-1.8-.2-.3 0-.4.1-.5l.4-.5c.1-.1.2-.3.3-.5 0-.2 0-.3 0-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 1.9 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 12.5l5 5L20 6.5" />
  </svg>
);

export const IconX = (p: P) => (
  <svg {...base(p)}>
    <path d="M5 5l14 14M19 5L5 19" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 4l8 8-8 8" />
  </svg>
);

export const IconGauge = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 12l4-4.5" />
    <path d="M7 16.5h10" />
  </svg>
);

export const SERVICE_ICONS = {
  ecu: IconEcu,
  dyno: IconDyno,
  turbo: IconTurbo,
  exhaust: IconExhaust,
  intake: IconIntake,
  fab: IconFab,
  health: IconHealth,
};
