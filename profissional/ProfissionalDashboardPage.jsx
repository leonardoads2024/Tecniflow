import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import PanelCard from '../../components/ui/PanelCard';
import { getProfessionalDashboard } from '../../services/DashboardService';
import { getProfessionalReviews } from '../../services/professionalDirectoryService';
import './ProfissionalDashboard.css';

function formatRating(value) {
  if (!value) return '—';
  return Number(value).toFixed(1).replace('.', ',');
}

export default function ProfissionalDashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError('');

        const data = await getProfessionalDashboard();
        if (data?.idProfissional) {
          const reviewsData = await getProfessionalReviews(data.idProfissional);
          setReviews(reviewsData.slice(0, 4));
        }

        setDashboard(data);
      } catch (err) {
        const rawMessage = err?.message || 'Erro ao carregar dashboard profissional.';
        const friendlyMessage = rawMessage.includes('Usuario nao possui perfil profissional')
          ? 'Seu usuario ainda nao possui um perfil profissional vinculado. Cadastre ou vincule um perfil profissional para acessar este painel.'
          : rawMessage;

        setError(friendlyMessage);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <DashboardLayout title="Dashboard do Profissional">
      <section className="professional-dashboard">
        {loading && (
          <div className="dashboard-feedback">
            Carregando dados do dashboard...
          </div>
        )}

        {error && <div className="dashboard-error">{error}</div>}

        {!loading && !error && dashboard && (
          <>
            <div className="summary-cards">
              <MetricCard
                label="Solicitações recebidas"
                value={dashboard.totalSolicitacoes}
                info="Total registrado"
              />

              <MetricCard
                label="Em andamento"
                value={dashboard.emAndamento}
                info="Serviços ativos no momento"
              />

              <MetricCard
                label="Avaliação média"
                value={formatRating(dashboard.mediaAvaliacao)}
                info="Baseado nas avaliações recebidas"
              />

              <MetricCard
                label="Plano atual"
                value={dashboard.planoNome}
                info="Status da assinatura"
                highlight
                accent="green"
              />
            </div>

            <div className="dashboard-panels">
              <PanelCard
                title="Resumo operacional"
                subtitle="Visão geral do profissional"
                className="dashboard-panel-large"
              >
                <div className="finance-box">
                  <div className="finance-row">
                    <span>Solicitadas</span>
                    <strong>{dashboard.solicitadas}</strong>
                  </div>

                  <div className="finance-row">
                    <span>Aceitas</span>
                    <strong>{dashboard.aceitas}</strong>
                  </div>

                  <div className="finance-row">
                    <span>Concluídas</span>
                    <strong>{dashboard.concluidas}</strong>
                  </div>

                  <div className="finance-row">
                    <span>Em andamento</span>
                    <strong>{dashboard.emAndamento}</strong>
                  </div>

                  <div className="finance-row">
                    <span>Aguardando confirmação</span>
                    <strong>{dashboard.aguardandoConfirmacao}</strong>
                  </div>

                  <div className="finance-row">
                    <span>Canceladas</span>
                    <strong>{dashboard.canceladas}</strong>
                  </div>

                  <div className="finance-row">
                    <span>Recusadas</span>
                    <strong>{dashboard.recusadas}</strong>
                  </div>
                </div>
              </PanelCard>

              <PanelCard title="Financeiro" subtitle="Resumo rápido">
                <div className="finance-box">
                  <div className="finance-row">
                    <span>Status do plano</span>
                    <strong>{dashboard.planoStatus}</strong>
                  </div>

                  <div className="finance-row">
                    <span>Premium ativo</span>
                    <strong>{dashboard.premiumAtivo ? 'Sim' : 'Nao'}</strong>
                  </div>

                  <div className="finance-row">
                    <span>Descricao do plano</span>
                    <strong>{dashboard.planoDescricao}</strong>
                  </div>
                </div>
              </PanelCard>
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
