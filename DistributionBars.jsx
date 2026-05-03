function getMaxValue(items) {
  return items.reduce((max, item) => Math.max(max, Number(item.value) || 0), 0);
}

export default function DistributionBars({ items = [], compact = false }) {
  const safeItems = items.filter((item) => item && item.label);
  const maxValue = getMaxValue(safeItems);

  return (
    <div className={`distribution-bars ${compact ? 'compact' : ''}`}>
      {safeItems.map((item) => {
        const rawValue = Number(item.value) || 0;
        const width = maxValue > 0 ? Math.max((rawValue / maxValue) * 100, rawValue > 0 ? 10 : 0) : 0;

        return (
          <div className="distribution-row" key={item.label}>
            <div className="distribution-row-head">
              <span>{item.label}</span>
              <strong>{rawValue}</strong>
            </div>
            <div className="distribution-track">
              <div
                className={`distribution-fill tone-${item.tone || 'cyan'}`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
