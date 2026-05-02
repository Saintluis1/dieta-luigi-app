import { useEffect } from 'react';
import { X } from 'lucide-react';
import alternatives from '../data/alternatives.json';

export function SwapSheet({ open, item, onClose, onPick }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !item) return null;
  const pool = alternatives[item.swap_pool] ?? [];

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="swap-title"
         className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <button aria-label="Chiudi" onClick={onClose}
              className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <div className="relative w-full sm:max-w-md bg-surface
                      rounded-t-3xl sm:rounded-3xl
                      max-h-[85dvh] flex flex-col
                      pb-[env(safe-area-inset-bottom)]">
        <header className="flex items-start justify-between px-5 pt-4 pb-2">
          <div>
            <p className="text-caption text-ink2 uppercase tracking-wide">Sostituisci</p>
            <h2 id="swap-title" className="text-h2">{item.name}</h2>
          </div>
          <button onClick={onClose} aria-label="Chiudi"
                  className="min-h-11 min-w-11 grid place-items-center rounded-xl text-ink2">
            <X size={22} />
          </button>
        </header>
        <p className="px-5 text-small text-ink2 mb-2">
          Le grammature variano: ogni alimento ha la sua quantità approvata dalla nutrizionista.
        </p>
        <ul className="overflow-y-auto px-2 pb-2 flex-1">
          {pool.map((alt) => (
            <li key={alt.id}>
              <button
                onClick={() => onPick({ ...alt, swappable: item.swappable, swap_pool: item.swap_pool })}
                className="w-full flex items-center gap-3 px-3 py-3 min-h-14
                           rounded-xl hover:bg-surface2 active:bg-surface2 text-left"
              >
                <span className="flex-1 min-w-0">
                  <span className="block text-body-strong truncate">{alt.name}</span>
                  {alt.frequency && (
                    <span className="inline-block mt-0.5 text-caption px-2 py-0.5
                                     rounded-full bg-meal-breakfast text-ink">
                      max {alt.frequency.replace('/', ' volte su ')}
                    </span>
                  )}
                </span>
                <span className="tabular text-body-strong text-ink2 shrink-0">{alt.grams} g</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
