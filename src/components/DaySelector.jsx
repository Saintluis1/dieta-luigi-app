import { useEffect, useRef } from 'react';

const DAYS = [
  { id: 'lunedi',    short: 'Lun' },
  { id: 'martedi',   short: 'Mar' },
  { id: 'mercoledi', short: 'Mer' },
  { id: 'giovedi',   short: 'Gio' },
  { id: 'venerdi',   short: 'Ven' },
  { id: 'sabato',    short: 'Sab' },
  { id: 'domenica',  short: 'Dom' }
];

export function DaySelector({ activeDayId, onChange }) {
  const scrollerRef = useRef(null);

  useEffect(() => {
    const el = scrollerRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeDayId]);

  return (
    <div className="sticky top-0 z-20 bg-bg/85 backdrop-blur border-b border-line">
      <div ref={scrollerRef} className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar" role="tablist">
        {DAYS.map((d) => {
          const isActive = d.id === activeDayId;
          return (
            <button
              key={d.id}
              role="tab"
              aria-selected={isActive}
              data-active={isActive}
              onClick={() => onChange(d.id)}
              className={`shrink-0 min-h-11 px-4 rounded-full text-body-strong transition-colors
                          ${isActive ? 'bg-brand text-bg' : 'bg-surface text-ink2 border border-line'}`}
            >
              {d.short}
            </button>
          );
        })}
      </div>
    </div>
  );
}
