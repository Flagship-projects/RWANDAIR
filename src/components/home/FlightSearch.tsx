"use client";

import {
  FormEvent,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";
import { destinations } from "@/lib/data";

const cities = destinations.map((d) => `${d.city} (${d.code})`);

/* ---------------------------------- icons --------------------------------- */

type IconProps = { className?: string };
const base = "h-4 w-4";

const IconPlane = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8L9 11l-2 2H4l-1 1 3 2 2 3 1-1v-3l2-2 3.5 4.7a.5.5 0 0 0 .8-.5Z" />
  </svg>
);
const IconHotel = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M2 20h20M4 20V8l7-4 7 4v12M9 20v-5h6v5M9 9h.01M15 9h.01M9 12h.01M15 12h.01" />
  </svg>
);
const IconDoc = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <path d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v5h5M8 13h8M8 17h8M8 9h3" />
  </svg>
);
const IconCheck = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="m8 12 3 3 5-6" />
  </svg>
);
const IconClock = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
const IconCalendar = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={cn(base, className)}>
    <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
    <path d="M3 9h18M8 3v4M16 3v4" />
  </svg>
);
const IconChevron = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={cn("h-4 w-4", className)}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/* ----------------------------------- tabs --------------------------------- */

const tabs = [
  { id: "book", label: "Book a Flight", Icon: IconPlane },
  { id: "hotel", label: "Flight + Hotel", Icon: IconHotel },
  { id: "manage", label: "Manage My Booking", Icon: IconDoc },
  { id: "checkin", label: "Check-In", Icon: IconCheck },
  { id: "status", label: "Flight Status", Icon: IconClock },
  { id: "schedule", label: "Schedule", Icon: IconCalendar },
] as const;

type TabId = (typeof tabs)[number]["id"];

/* ------------------------------ field building ---------------------------- */

const labelCls = "text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45";
const inputCls =
  "w-full bg-transparent text-fluid-body text-ink placeholder:text-ink/35 focus:outline-none";

function Cell({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("flex flex-1 flex-col gap-1 px-5 py-3.5", className)}>
      <span className={labelCls}>{label}</span>
      {children}
    </label>
  );
}

function Group({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        // Stack fields on phones (full-width, comfortable tap targets); only
        // sit them side-by-side from sm up where there's room.
        "flex flex-col divide-y divide-line rounded-2xl border border-line bg-white transition-colors focus-within:border-blue-500/40 sm:flex-row sm:items-stretch sm:divide-x sm:divide-y-0",
        className
      )}
    >
      {children}
    </div>
  );
}

/** The card can be mounted more than once (page section + floating dock), and a
 *  duplicated element id would be invalid — so each instance owns its own. */
const CityListId = createContext("ra-cities");

function CityInput({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <Cell label={label}>
      <input list={useContext(CityListId)} className={inputCls} placeholder={placeholder} />
    </Cell>
  );
}

function DateInput({ label }: { label: string }) {
  return (
    <Cell label={label}>
      <div className="flex items-center justify-between gap-2">
        <input type="date" className={cn(inputCls, "[&::-webkit-calendar-picker-indicator]:opacity-0")} />
        <IconCalendar className="pointer-events-none shrink-0 text-ink/45" />
      </div>
    </Cell>
  );
}

function SelectCell({
  label,
  children,
  defaultValue,
}: {
  label: string;
  children: ReactNode;
  defaultValue?: string;
}) {
  return (
    <Cell label={label}>
      <div className="relative flex items-center">
        <select
          defaultValue={defaultValue}
          className={cn(inputCls, "appearance-none pr-6 font-display")}
        >
          {children}
        </select>
        <IconChevron className="pointer-events-none absolute right-0 text-ink/45" />
      </div>
    </Cell>
  );
}

/* -------------------------- radio + toggle controls ----------------------- */

function Radio({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "relative flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 transition-colors",
        active ? "border-blue-500" : "border-ink/25"
      )}
    >
      {active && <span className="h-2 w-2 rounded-full bg-blue-500" />}
    </span>
  );
}

/* --------------------------------- panels --------------------------------- */

function BookingPanel({ hotel }: { hotel?: boolean }) {
  const [trip, setTrip] = useState<"round" | "oneway" | "multi">("round");
  const [miles, setMiles] = useState(false);

  const tripOptions: { id: typeof trip; label: string }[] = [
    { id: "round", label: "Round-Trip" },
    { id: "oneway", label: "One-Way" },
    { id: "multi", label: "Multi-City" },
  ];

  return (
    <div className="space-y-5">
      {/* trip type + miles toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {tripOptions.map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => setTrip(o.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-full px-4 py-2 text-fluid-sm font-medium transition-colors focus-ring",
                trip === o.id ? "bg-blue-50 text-blue-600" : "text-ink/60 hover:text-ink"
              )}
            >
              <Radio active={trip === o.id} />
              {o.label}
            </button>
          ))}
        </div>

        <label className="flex cursor-pointer select-none items-center gap-3">
          <span className="text-fluid-sm text-ink/70">Book with Miles</span>
          <button
            type="button"
            role="switch"
            aria-checked={miles}
            aria-label="Book with Miles"
            onClick={() => setMiles((v) => !v)}
            className={cn(
              "focus-ring relative h-6 w-11 rounded-full transition-colors",
              miles ? "bg-blue-500" : "bg-ink/15"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                miles ? "translate-x-[22px] left-0.5" : "left-0.5"
              )}
            />
          </button>
        </label>
      </div>

      {/* row 1: from/to + dates */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Group className="lg:col-span-7">
          <CityInput label={hotel ? "Destination" : "From"} placeholder="Type..." />
          {!hotel && <CityInput label="To" placeholder="Type..." />}
        </Group>
        <Group className="lg:col-span-5">
          <DateInput label={hotel ? "Check-In" : "Departure Date"} />
          {trip !== "oneway" && <DateInput label={hotel ? "Check-Out" : "Return Date"} />}
        </Group>
      </div>

      {/* row 2: passengers/class + promo + submit */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Group className="lg:col-span-6">
          <SelectCell label={hotel ? "Guests" : "Passengers"} defaultValue="1 Adult, 0 Children, 0 Infants">
            {["1 Adult, 0 Children, 0 Infants", "2 Adults, 0 Children, 0 Infants", "2 Adults, 1 Child, 0 Infants", "2 Adults, 2 Children, 1 Infant"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </SelectCell>
          <SelectCell label={hotel ? "Room Type" : "Class"} defaultValue={hotel ? "Standard" : "Economy"}>
            {(hotel ? ["Standard", "Deluxe", "Suite"] : ["Economy", "Business"]).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </SelectCell>
        </Group>
        <Group className="lg:col-span-3">
          <Cell label="Promo Code">
            <input className={inputCls} placeholder="Enter code..." />
          </Cell>
        </Group>
        <div className="lg:col-span-3">
          <SubmitButton label={hotel ? "Search Stays" : "Show Flights"} />
        </div>
      </div>
    </div>
  );
}

const simplePanels: Record<
  Exclude<TabId, "book" | "hotel">,
  { fields: { label: string; type?: string; placeholder?: string }[]; cta: string }
> = {
  manage: {
    fields: [
      { label: "Booking Reference", placeholder: "e.g. ABC123" },
      { label: "Last Name", placeholder: "Type..." },
    ],
    cta: "Retrieve Booking",
  },
  checkin: {
    fields: [
      { label: "Booking Ref / E-Ticket", placeholder: "Type..." },
      { label: "Last Name", placeholder: "Type..." },
    ],
    cta: "Check In",
  },
  status: {
    fields: [
      { label: "Flight Number", placeholder: "e.g. WB 101" },
      { label: "Date", type: "date" },
    ],
    cta: "Search Flight",
  },
  schedule: {
    fields: [
      { label: "From", placeholder: "Type..." },
      { label: "To", placeholder: "Type..." },
      { label: "Travel Month", type: "month" },
    ],
    cta: "View Schedule",
  },
};

function SimplePanel({ tab }: { tab: Exclude<TabId, "book" | "hotel"> }) {
  const { fields, cta } = simplePanels[tab];
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Group className="lg:col-span-9">
        {fields.map((f) => (
          <Cell key={f.label} label={f.label}>
            {f.type === "date" || f.type === "month" ? (
              <div className="flex items-center justify-between gap-2">
                <input type={f.type} className={cn(inputCls, "[&::-webkit-calendar-picker-indicator]:opacity-0")} />
                <IconCalendar className="pointer-events-none shrink-0 text-ink/45" />
              </div>
            ) : (
              <input className={inputCls} placeholder={f.placeholder} />
            )}
          </Cell>
        ))}
      </Group>
      <div className="lg:col-span-3">
        <SubmitButton label={cta} />
      </div>
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="focus-ring flex h-full min-h-[58px] w-full items-center justify-center gap-2.5 rounded-2xl bg-blue-500 px-8 font-display text-fluid-body font-semibold text-white transition-colors hover:bg-blue-600 lg:rounded-full"
    >
      {label}
      <IconPlane className="h-4 w-4" />
    </button>
  );
}

/* --------------------------------- tab bar -------------------------------- */

/**
 * Six tabs never fit a phone, and the old strip just clipped at the card edge —
 * "Book a Flight" and "Flight + Hotel" looked like the whole offer. Three things
 * now say otherwise, without adding chrome on a desktop where they all fit:
 *
 *  - the strip is padded so a tab is always cut mid-word at the edge rather than
 *    landing flush against it (a clean edge reads as the end of the list),
 *  - the cut is softened by a fade, so it reads as "continues" not "cropped",
 *  - and the fade carries a tappable chevron, because on touch the cheapest way
 *    to discover a scroller is to be handed a button that scrolls it.
 *
 * All three appear only on the side that actually has more to show.
 */
function TabBar({ active, onSelect }: { active: TabId; onSelect: (id: TabId) => void }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [more, setMore] = useState({ start: false, end: false });

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () =>
      setMore({
        start: el.scrollLeft > 4,
        end: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  function nudge(dir: 1 | -1) {
    scrollerRef.current?.scrollBy({ left: dir * 180, behavior: "smooth" });
  }

  return (
    <div className="relative border-b border-line">
      <div ref={scrollerRef} className="hide-scrollbar overflow-x-auto">
        {/* the trailing pad is what guarantees a partial tab at the edge */}
        <div className="flex min-w-max items-center gap-1 px-3 pr-14 sm:gap-3 sm:px-6 sm:pr-6">
          {tabs.map(({ id, label, Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onSelect(id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-2 whitespace-nowrap px-3 pb-4 pt-5 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors sm:px-4",
                  isActive ? "text-blue-600" : "text-ink/45 hover:text-ink/80"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-blue-500" : "text-ink/40")} />
                {label}
                {isActive && (
                  <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-blue-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {more.start && (
        <button
          type="button"
          aria-label="Previous options"
          onClick={() => nudge(-1)}
          className="absolute inset-y-0 left-0 flex w-12 items-center justify-start bg-gradient-to-r from-white via-white/90 to-transparent pl-1 text-ink/50"
        >
          <IconChevron className="h-4 w-4 rotate-90" />
        </button>
      )}
      {more.end && (
        <button
          type="button"
          aria-label="More booking options"
          onClick={() => nudge(1)}
          className="absolute inset-y-0 right-0 flex w-14 items-center justify-end bg-gradient-to-l from-white via-white/90 to-transparent pr-1 text-ink/50"
        >
          <IconChevron className="h-4 w-4 -rotate-90" />
        </button>
      )}
    </div>
  );
}

/* --------------------------------- widget --------------------------------- */

/**
 * The booking card on its own, with no page placement of its own — the homepage
 * section below and the floating booking dock both mount this, so there is only
 * ever one definition of what booking looks like.
 */
export function FlightSearchCard({ className }: { className?: string }) {
  const [active, setActive] = useState<TabId>("book");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const listId = `ra-cities${useId()}`;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(active);
  }

  return (
    <CityListId.Provider value={listId}>
    <div className={className}>
      <datalist id={listId}>
        {cities.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <div className="overflow-hidden rounded-[28px] border border-line bg-white shadow-2xl shadow-blue-900/15">
        <TabBar active={active} onSelect={(id) => { setActive(id); setSubmitted(null); }} />

        {/* panel */}
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:px-7 sm:py-7">
          {active === "book" && <BookingPanel />}
          {active === "hotel" && <BookingPanel hotel />}
          {active !== "book" && active !== "hotel" && <SimplePanel tab={active} />}
        </form>
      </div>

      {submitted && (
        <div className="mt-4 rounded-2xl border border-line bg-blue-50 px-6 py-4 text-fluid-sm text-ink/70">
          Sample only — this preview isn&rsquo;t connected to a live booking system yet.
        </div>
      )}
    </div>
    </CityListId.Provider>
  );
}

export function FlightSearch() {
  return (
    // Pulled hard up into the hero's floor: booking is the primary action, so
    // the panel should read as the hero's own footer rather than as the next
    // section down. The hero's last frame is empty studio floor, which is
    // exactly what the card wants to sit on.
    // A phone gives up ~40px of card to the page gutter, which is a lot when
    // the fields inside are already stacked — the widget gets a tighter margin
    // of its own and hands the width back to the form.
    <section id="book" className="relative z-20 -mt-[30svh] px-3 sm:-mt-[34svh] sm:px-gutter">
      <FlightSearchCard className="mx-auto max-w-shell" />
    </section>
  );
}
