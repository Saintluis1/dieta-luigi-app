import patient from '../data/patient.json';

const Stat = ({ label, value, hint }) => (
  <div className="bg-surface2 rounded-2xl p-4">
    <p className="text-caption text-ink2 uppercase tracking-wide">{label}</p>
    <p className="text-h1 tabular mt-1">{value}</p>
    {hint && <p className="text-small text-ink2 mt-0.5">{hint}</p>}
  </div>
);

export default function ProfileScreen() {
  const a = patient.anthropometry;
  const c = patient.bia.composition_percent;
  return (
    <div className="px-4 pt-6 space-y-4">
      <header>
        <h1 className="text-display">{patient.personal.name}</h1>
        <p className="text-ink2">{patient.personal.age} anni · {patient.personal.height_cm} cm</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Peso attuale" value={`${a.weight_current_kg} kg`} />
        <Stat label="Peso teorico" value={`${a.weight_target_kg} kg`} />
        <Stat label="BMI" value={a.bmi} hint={a.bmi_range} />
        <Stat label="BMR" value={`${a.bmr_kcal} kcal`} />
        <Stat label="Massa magra" value={`${c.ffm_pct_weight}%`} hint={`${c.ffm_kg} kg`} />
        <Stat label="Massa grassa" value={`${c.fm_pct_weight}%`} hint={`${c.fm_kg} kg`} />
      </div>
    </div>
  );
}
