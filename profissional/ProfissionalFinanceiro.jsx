import { Gem, ShieldCheck, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import MetricCard from '../../components/ui/MetricCard';
import PanelCard from '../../components/ui/PanelCard';
import {
  addCredits,
  getCreditDashboard,
  getTransactions,
  getWallet,
} from '../../services/creditWalletService';
import './ProfissionalDashboard.css';
import '../shared/ProfilePages.css';

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

export default function ProfissionalFinanceiro() {
  const [wallet, setWallet] = useState({ saldo: 0 });
  const [dashboard, setDashboard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const financialHighlights = [
    {
      title: 'Credito vira oportunidade',
      description: 'Sua carteira abastece o desbloqueio de leads e sustenta resposta mais rápida.',
      icon: <Wallet size={16} />,
    },
    {
      title: 'Leitura de retorno',
      description: 'Compras, uso e leads liberados ajudam a medir tracao comercial do perfil.',
      icon: <Gem size={16} />,
    },
    {
      title: 'Operacao mais segura',
      description: 'Historico claro de movimentacoes facilita governanca e decisao no dia a dia.',
      icon: <ShieldCheck size={16} />,
    },
  ];
  const transactionCount = transactions.length;
  const lastLeadCost = dashboard?.ultimoLeadLiberado?.quantidade || 0;

  async function loadFinancialData(showLoading = true) {
    try {
      if (showLoading) setLoading(true);
      setError('');

      const [walletData, dashboardData, transactionsData] = await Promise.all([
        getWallet(),
        getCreditDashboard(),
        getTransactions(),
      ]);

      setWallet(walletData);
      setDashboard(dashboardData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err?.message || 'Erro ao carregar dados financeiros.');
    } finally {
      if (showLoading) setLoading(false);
    }
  }

  useEffect(() => {
    loadFinancialData();
  }, []);

  async function handleAddCredits() {
    try {
      setError('');
      setFeedback('');
      await addCredits(10);
      setFeedback('10 creditos adicionados com sucesso.');
      await loadFinancialData(false);
    } catch (err) {
      setError(err?.message || 'Erro ao adicionar creditos.');
    }
  }

  return (
    <DashboardLayout title="Financeiro">
      <section className="professional-dashboard">
        {feedback && <div className="dashboard-feedback">{feedback}</div>}
        {loading && <div className="dashboard-feedback">Carregando financeiro...</div>}
        {error && <div className="dashboard-error">{error}</div>}

        {!loading && !error && dashboard && (
          <>
            <section className="profile-highlight-strip">
              {financialHighlights.map((item) => (
                <div className="profile-highlight-card" key={item.title}>
                  <div className="profile-highlight-icon">{item.icon}</div>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className="professional-command-strip">
              <div className="professional-command-card">
                <div className="professional-command-icon">
                  <Wallet size={18} />
                </div>
                <div>
                  <strong>{wallet.saldo} creditos</strong>
                  <span>saldo disponivel para destravar novas oportunidades sem interromper a operacao.</span>
                </div>
              </div>
              <div className="professional-command-card">
                <div className="professional-command-icon">
                  <Gem size={18} />
                </div>
                <div>
                  <strong>{transactionCount}</strong>
                  <span>movimentacoes registradas para leitura de consumo, recarga e maturidade da carteira.</span>
                </div>
              </div>
              <div className="professional-command-card">
                <div className="professional-command-icon">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <strong>{lastLeadCost}</strong>
                  <span>creditos usados no ultimo lead liberado, ajudando a medir custo recente de aquisicao.</span>
                </div>
              </div>
            </section>

            <div className="summary-cards">
              <MetricCard
                label="Saldo atual"
                value={`${wallet.saldo} creditos`}
                info="Disponivel para liberar leads"
                highlight
                accent="green"
              />
              <MetricCard
                label="Leads liberados"
                value={dashboard.leadsLiberados}
                info="Total desbloqueado"
              />
              <MetricCard
                label="Creditos comprados"
                value={dashboard.creditosComprados}
                info="Historico de recarga"
              />
              <MetricCard
                label="Creditos utilizados"
                value={dashboard.creditosUtilizados}
                info="Consumo em leads"
                highlight
                accent="blue"
              />
            </div>

            <div className="dashboard-panels">
              <PanelCard
                title="Movimentacoes recentes"
                subtitle="Historico da carteira e liberacao de leads"
                className="dashboard-panel-large"
              >
                <div className="service-list">
                  {transactions.length === 0 ? (
                    <div className="service-item">
                      <div>
                        <strong>Nenhuma movimentacao registrada</strong>
                        <p>Sua carteira ainda nao possui transacoes.</p>
                      </div>
                    </div>
                  ) : (
                    transactions.map((transaction) => (
                      <div className="service-item" key={transaction.id}>
                        <div>
                          <strong>{transaction.descricao || 'Movimentacao'}</strong>
                          <p>
                            Tipo: {transaction.tipo} | Quantidade: {transaction.quantidade}
                          </p>
                          <p>
                            Solicitacao vinculada:{' '}
                            {transaction.idSolicitacao || 'Nao aplicavel'}
                          </p>
                        </div>
                        <div>
                          <strong>{formatDate(transaction.data)}</strong>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </PanelCard>

              <PanelCard title="Acao rapida" subtitle="Reforce o saldo para captar mais leads">
                <div className="finance-box">
                  <div className="finance-row">
                    <span>Ultimo lead liberado</span>
                    <strong>
                      {dashboard.ultimoLeadLiberado?.id_solicitacao || 'Nao informado'}
                    </strong>
                  </div>
                  <div className="finance-row">
                    <span>Quantidade usada no ultimo lead</span>
                    <strong>
                      {dashboard.ultimoLeadLiberado?.quantidade || 0}
                    </strong>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <button
                    type="button"
                    className="topbar-logout-button"
                    onClick={handleAddCredits}
                  >
                    Adicionar 10 creditos
                  </button>
                </div>
              </PanelCard>
            </div>
          </>
        )}
      </section>
    </DashboardLayout>
  );
}
