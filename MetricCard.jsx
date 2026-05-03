import './UiComponents.css';

export default function MetricCard({
  label,
  value,
  info,
  highlight = false,
  accent = 'green',
}) {
  return (
    <div className={`metric-card ${highlight ? 'highlight' : ''} ${accent}`}>
      <span className="metric-card-label">{label}</span>
      <strong className="metric-card-value">{value}</strong>
      {info && <small className="metric-card-info">{info}</small>}
    </div>
  );
}