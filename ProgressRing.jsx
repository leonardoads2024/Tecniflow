function clamp(value) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(Math.max(value, 0), 100);
}

export default function ProgressRing({
  value = 0,
  label,
  subtitle,
  tone = 'green',
  size = 122,
  stroke = 10,
}) {
  const normalized = clamp(value);
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className={`progress-ring-card tone-${tone}`}>
      <div className="progress-ring-visual" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} className="progress-ring-svg" aria-hidden="true">
          <circle
            className="progress-ring-track"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
          />
          <circle
            className={`progress-ring-value tone-${tone}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="progress-ring-center">
          <strong>{Math.round(normalized)}%</strong>
        </div>
      </div>

      <div className="progress-ring-copy">
        <span>{label}</span>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
    </div>
  );
}
