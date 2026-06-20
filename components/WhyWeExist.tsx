type IconProps = { className?: string };

function PhoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <line x1="11" y1="18" x2="13" y2="18" />
    </svg>
  );
}
function CarIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 11l1.4-4A2 2 0 0 1 8.3 5.7h7.4A2 2 0 0 1 17.6 7L19 11" />
      <rect x="3" y="11" width="18" height="6" rx="1.5" />
      <circle cx="7.5" cy="17.5" r="1.4" />
      <circle cx="16.5" cy="17.5" r="1.4" />
    </svg>
  );
}
function DeviceIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="4" y="5" width="16" height="11" rx="1.5" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  );
}
function BrainIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 5a3 3 0 0 0-6 0 3 3 0 0 0-2.5 4.5A3 3 0 0 0 5 15a3 3 0 0 0 5 2.5V5Z" />
      <path d="M12 5a3 3 0 0 1 6 0 3 3 0 0 1 2.5 4.5A3 3 0 0 1 19 15a3 3 0 0 1-5 2.5V5Z" />
      <path d="M12 5v14" />
    </svg>
  );
}

const HABITS = [
  { label: 'We charge our phones.', Icon: PhoneIcon },
  { label: 'We maintain our cars.', Icon: CarIcon },
  { label: 'We upgrade our devices.', Icon: DeviceIcon },
];

export default function WhyWeExist() {
  return (
    <section
      id="why-we-exist"
      aria-label="Why we exist"
      className="bg-white py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 md:px-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          {/* ---------- Left: everyday habits ---------- */}
          <div className="flex flex-col">
            <p className="font-quantico text-caption font-bold uppercase tracking-[0.24em] text-brand-blue">
              Why We Exist
            </p>
            <h2 className="mt-4 font-condensed text-3xl font-black uppercase italic leading-[0.95] tracking-tight text-ink sm:text-4xl">
              We Take Care
              <br />
              Of It All.
            </h2>

            <ul className="mt-8 flex-1 space-y-4">
              {HABITS.map(({ label, Icon }) => (
                <li
                  key={label}
                  className="flex items-center gap-5 border border-paper-200 bg-paper-50 px-5 py-4"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-paper-200 bg-white text-brand-blue">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="font-condensed text-2xl font-black uppercase italic tracking-tight text-ink">
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- Right: the brain answer (navy) ---------- */}
          <div className="relative overflow-hidden bg-brand-blue p-8 text-white sm:p-10 md:p-12">
            <BrainIcon className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 text-white/10" />
            <div className="relative flex h-full flex-col">
              <span className="flex h-14 w-14 items-center justify-center border-2 border-accent text-accent">
                <BrainIcon className="h-7 w-7" />
              </span>

              <h3 className="mt-7 font-condensed text-4xl font-black uppercase italic leading-[0.95] tracking-tight sm:text-5xl">
                But What About Our Brains?
              </h3>
              <p className="mt-5 max-w-md font-pt text-body-lg text-white/85">
                <span className="font-bold text-white">THE BRAIN BATTERY</span> was
                created to help people fuel better thinking every day.
              </p>

              {/* Mission */}
              <div className="mt-auto border-t border-white/15 pt-8">
                <p className="font-quantico text-caption font-bold uppercase tracking-[0.24em] text-accent">
                  Our Mission
                </p>
                <p className="mt-3 font-condensed text-2xl font-black uppercase italic leading-tight tracking-tight sm:text-3xl">
                  Help people keep a sharp mind and feel great every day.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
