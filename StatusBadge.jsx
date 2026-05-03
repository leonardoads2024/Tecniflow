import './UiComponents.css';

export default function StatusBadge({ status, children }) {
  const statusClassMap = {
    solicitado: 'gray',
    aceito: 'green',
    em_andamento: 'blue',
    andamento: 'blue',
    aguardando_confirmacao: 'yellow',
    aguardando: 'yellow',
    concluido: 'green',
    cancelado: 'red',
    recusado: 'red',
  };

  const badgeClass = statusClassMap[status] || 'gray';

  return (
    <span className={`status-badge-ui ${badgeClass}`}>
      {children || status}
    </span>
  );
}