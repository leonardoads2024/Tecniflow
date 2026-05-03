import './UiComponents.css';

export default function PanelCard({ title, subtitle, children, className = '' }) {
  return (
    <div className={`panel-card ${className}`}>
      <div className="panel-card-glow" aria-hidden="true" />
      <div className="panel-card-header">
        <div className="panel-card-heading">
          <h3>{title}</h3>
          {subtitle && <span>{subtitle}</span>}
        </div>
      </div>

      <div className="panel-card-body">{children}</div>
    </div>
  );
}
