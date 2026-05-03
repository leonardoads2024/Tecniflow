import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PanelCard from '../../components/ui/PanelCard';
import { getAdminAuditLogs } from '../../services/adminService';
import '../profissional/ProfissionalDashboard.css';
import './AdminPages.css';

function formatDate(value) {
  if (!value) return 'Nao informado';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export default function AdminAuditoria() {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAuditLogs() {
      try {
        setLoading(true);
        setError('');
        const data = await getAdminAuditLogs();
        setLogs(data);
      } catch (err) {
        setError(err?.message || 'Erro ao carregar auditoria.');
      } finally {
        setLoading(false);
      }
    }

    loadAuditLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return logs.filter((log) => {
      if (!normalizedSearch) return true;

      return [
        log.acao,
        log.entidade,
        log.nomeAdmin,
        log.idEntidade,
        log.detalhes,
      ]
        .filter((value) => value !== null && value !== undefined)
        .some((value) => String(value).toLowerCase().includes(normalizedSearch));
    });
  }, [logs, searchTerm]);

  const actionsCount = new Set(logs.map((log) => log.acao).filter(Boolean)).size;
  const entitiesCount = new Set(logs.map((log) => log.entidade).filter(Boolean)).size;

  return (
    <DashboardLayout
      title="Admin Auditoria"
      showSearch
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar por acao, entidade, admin ou ID"
    >
      <section className="admin-page">
        {loading && <div className="dashboard-feedback">Carregando trilha administrativa...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        <section className="admin-management-overview">
          <div className="admin-management-card highlight">
            <strong>{filteredLogs.length}</strong>
            <span>eventos no recorte atual</span>
          </div>
          <div className="admin-management-card">
            <strong>{actionsCount}</strong>
            <span>tipos de acao auditados</span>
          </div>
          <div className="admin-management-card">
            <strong>{entitiesCount}</strong>
            <span>entidades rastreadas na trilha</span>
          </div>
        </section>

        <PanelCard
          title="Auditoria administrativa"
          subtitle="Rastreabilidade basica das acoes sensiveis realizadas na plataforma"
        >
          {!searchTerm.trim() ? (
            <div className="admin-search-empty">
              <strong>Busque eventos da trilha administrativa</strong>
              <p>Use acao, entidade, responsavel ou ID do alvo para investigar somente o que importa.</p>
            </div>
          ) : (
            <div className="admin-list">
              {filteredLogs.length === 0 ? (
              <div className="admin-list-item">
                <div>
                  <strong>Nenhum log registrado</strong>
                  <p>Nao encontramos eventos para essa busca.</p>
                </div>
              </div>
            ) : (
              filteredLogs.map((log) => (
                <div className="admin-list-item" key={log.id}>
                  <div>
                    <strong>{log.acao}</strong>
                    <p>
                      Admin: {log.nomeAdmin} | Entidade: {log.entidade} | ID alvo: {log.idEntidade || 'n/a'}
                    </p>
                    <p>{log.detalhes || 'Sem detalhes adicionais.'}</p>
                  </div>

                  <div className="admin-item-actions">
                    <span className="admin-tag">{formatDate(log.dataCriacao)}</span>
                  </div>
                </div>
              ))
              )}
            </div>
          )}
        </PanelCard>
      </section>
    </DashboardLayout>
  );
}
