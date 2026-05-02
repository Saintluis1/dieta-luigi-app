import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const STATUSES = [
  { id: 'planned',  label: 'Come da piano', bg: 'bg-meal-snack' },
  { id: 'swapped',  label: 'Ho sostituito', bg: 'bg-meal-lunch' },
  { id: 'skipped',  label: 'Saltato',       bg: 'bg-meal-pizza' },
  { id: 'off-plan', label: 'Fuori piano',   bg: 'bg-meal-breakfast' },
];

export function TrackSheet({ open, mealLabel, currentEntry, onClose, onSave }) {
  const [status, setStatus] = useState('planned');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setStatus(currentEntry?.status ?? 'planned');
      setNote(currentEntry?.note ?? '');
    }
  }, [open, currentEntry]);

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

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="track-title"
      className="fixed inset-0 z-50 flex items-end justify-center"
    >
      <button
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />

      <div className="relative w-full sm:max-w-md bg-surface rounded-t-3xl
                      pb-[env(safe-area-inset-bottom)]">
        <header className="flex items-center justify-between px-5 pt-4 pb-3">
          <div>
            <p className="text-caption text-ink2 uppercase tracking-wide">{mealLabel}</p>
            <h2 id="track-title" className="text-h2">Com'è andato?</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi"
            className="min-h-11 min-w-11 grid place-items-center rounded-xl text-ink2"
          >
            <X size={22} />
          </button>
        </header>

        <div className="px-5 grid grid-cols-2 gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStatus(s.id)}
              aria-pressed={status === s.id}
              className={`min-h-12 rounded-xl border text-body-strong transition-colors
                          ${status === s.id
                            ? s.bg + ' border-transparent'
                            : 'border-line bg-surface'}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {status === 'off-plan' && (
          <div className="px-5 mt-3">
            <label htmlFor="track-note" className="text-small text-ink2">
              Cosa hai mangiato?
            </label>
            <textarea
              id="track-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full mt-1 p-3 rounded-xl border border-line bg-bg
                         text-body resize-none"
              rows={3}
              placeholder="Es. cena fuori al ristorante"
            />
          </div>
        )}

        <div className="p-5 pt-4 grid grid-cols-2 gap-2">
          <button
            onClick={onClose}
            className="h-12 rounded-xl border border-line text-body-strong"
          >
            Annulla
          </button>
          <button
            onClick={() => onSave({ status, note: status === 'off-plan' ? note : undefined })}
            className="h-12 rounded-xl bg-brand text-bg text-body-strong"
          >
            Salva
          </button>
        </div>
      </div>
    </div>
  );
}
