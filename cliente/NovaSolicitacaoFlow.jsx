import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatusBadge from '../../components/ui/StatusBadge';
import { createClientServiceRequest } from '../../services/clientRequestService';
import {
  getProfessionalCategories,
  getRecommendedProfessionals,
} from '../../services/professionalDirectoryService';
import './NovaSolicitacao.css';

export default function NovaSolicitacaoFlow() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedProfessional = location.state?.professional ?? null;

  const [form, setForm] = useState({
    id_categoria: '',
    descricao_servico: '',
    endereco: '',
    prioridade: 'media',
  });
  const [selectedProfessional, setSelectedProfessional] = useState(preselectedProfessional);
  const [categories, setCategories] = useState([]);
  const [recommendedProfessionals, setRecommendedProfessionals] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const noRecommendedProfessionals =
    !recommendationsLoading && Boolean(form.id_categoria) && recommendedProfessionals.length === 0;
  const selectedCategoryName =
    categories.find((item) => String(item.id) === String(form.id_categoria))?.nome || 'Categoria nao selecionada';

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getProfessionalCategories();
        setCategories(data);

        const categoryFromProfessional = preselectedProfessional?.categorias?.[0] || '';
        const categoryOption = data.find((item) => item.nome === categoryFromProfessional);

        if (categoryOption) {
          setForm((prev) => ({
            ...prev,
            id_categoria: prev.id_categoria || String(categoryOption.id),
          }));
        }
      } catch {
        setCategories([]);
      }
    }

    loadCategories();
  }, [preselectedProfessional]);

  useEffect(() => {
    if (!form.id_categoria) {
      setRecommendedProfessionals([]);
      return;
    }

    async function loadRecommendations() {
      try {
        setRecommendationsLoading(true);
        const data = await getRecommendedProfessionals(form.id_categoria, 4);
        setRecommendedProfessionals(data);

        if (data.length === 0) {
          setSelectedProfessional(null);
          return;
        }

        const stillAvailable = data.find(
          (item) => String(item.id) === String(selectedProfessional?.id)
        );

        setSelectedProfessional(stillAvailable || data[0]);
      } catch {
        setRecommendedProfessionals([]);
        setSelectedProfessional(null);
      } finally {
        setRecommendationsLoading(false);
      }
    }

    loadRecommendations();
  }, [form.id_categoria, selectedProfessional?.id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError('');
    if (success) setSuccess('');

    if (name === 'id_categoria') {
      setSelectedProfessional(null);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const categoria = String(form.id_categoria || '').trim();
    const descricao = String(form.descricao_servico || '').trim();
    const endereco = String(form.endereco || '').trim();
    const prioridade = String(form.prioridade || '').trim();

    if (!categoria || !descricao || !endereco || !prioridade) {
      setError('Preencha categoria, descricao, endereco e prioridade.');
      return;
    }

    const professionalIds = recommendedProfessionals.map((item) => Number(item.id));

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await createClientServiceRequest({
        id_profissional: selectedProfessional?.id ? Number(selectedProfessional.id) : undefined,
        id_profissionais: professionalIds,
        id_categoria: Number(categoria),
        descricao_servico: descricao,
        endereco,
        prioridade,
      });

      if (professionalIds.length > 0) {
        setSuccess(`Pedido enviado para ${professionalIds.length} profissional(is) elegivel(is).`);
      } else {
        setSuccess(
          'Solicitacao registrada com sucesso. A plataforma vai encaminhar seu pedido assim que houver oferta compativel.'
        );
      }

      setTimeout(() => {
        navigate('/cliente/solicitacoes');
      }, 1400);
    } catch (err) {
      setError(err?.message || 'Erro ao criar solicitacao.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout
      title="Nova Solicitacao"
      showBackButton
      onBack={() =>
        navigate(
          preselectedProfessional
            ? `/cliente/profissionais/${preselectedProfessional.id}`
            : '/cliente/dashboard'
        )
      }
    >
      <section className="new-request-page">
        <section className="new-request-overview">
          <div className="new-request-overview-card highlight">
            <strong>{recommendedProfessionals.length}</strong>
            <span>profissionais elegiveis no pool atual</span>
          </div>
          <div className="new-request-overview-card">
            <strong>{selectedCategoryName}</strong>
            <span>categoria ativa para o matching desta solicitacao</span>
          </div>
          <div className="new-request-overview-card">
            <strong>{form.prioridade}</strong>
            <span>prioridade configurada para acelerar o encaminhamento</span>
          </div>
        </section>

        <div className="new-request-header">
          <h2>Criar nova solicitacao</h2>
          <p>
            A plataforma vai distribuir sua necessidade para ate 4 profissionais elegiveis,
            respeitando premium, verificacao e historico de desempenho.
          </p>
        </div>

        {!form.id_categoria && (
          <div className="request-feedback error">
            Escolha uma categoria para ativar a recomendacao automatica.
          </div>
        )}

        {form.id_categoria && selectedProfessional && (
          <div className="request-feedback success">
            Profissional em destaque: <strong>{selectedProfessional.nome}</strong>. O pedido ainda
            sera enviado para todo o pool recomendado.
          </div>
        )}

        {noRecommendedProfessionals && (
          <div className="request-feedback neutral">
            Nao encontramos oferta imediata para esta categoria. Mesmo assim, voce pode registrar a
            solicitacao agora e deixar o pedido aguardando encaminhamento.
          </div>
        )}

        <form className="new-request-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="id_categoria">Categoria</label>
              <select
                id="id_categoria"
                name="id_categoria"
                value={form.id_categoria}
                onChange={handleChange}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={String(category.id)}>
                    {category.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="prioridade">Prioridade</label>
              <select
                id="prioridade"
                name="prioridade"
                value={form.prioridade}
                onChange={handleChange}
              >
                <option value="baixa">Baixa</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descricao_servico">Descricao do servico</label>
            <textarea
              id="descricao_servico"
              name="descricao_servico"
              placeholder="Descreva com detalhes o servico que voce precisa."
              value={form.descricao_servico}
              onChange={handleChange}
              rows={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereco</label>
            <input
              id="endereco"
              name="endereco"
              type="text"
              placeholder="Informe o endereco do atendimento"
              value={form.endereco}
              onChange={handleChange}
            />
          </div>

          <div className="recommended-professionals-block">
            <div className="recommended-professionals-header">
              <div>
                <strong>Pool recomendado para esta solicitacao</strong>
                <p>
                  O cliente abre um unico pedido, e a plataforma distribui para ate 4
                  profissionais ranqueados para acelerar o atendimento.
                </p>
              </div>
            </div>

            <div className="new-request-journey-strip">
              <div className="new-request-journey-step">
                <span>01</span>
                <div>
                  <strong>Voce descreve a necessidade</strong>
                  <p>A categoria e o contexto ajudam a plataforma a interpretar melhor a demanda.</p>
                </div>
              </div>
              <div className="new-request-journey-step">
                <span>02</span>
                <div>
                  <strong>O TECNIFLOW organiza a oferta</strong>
                  <p>O pool considera premium, verificacao, reputacao e desempenho operacional.</p>
                </div>
              </div>
              <div className="new-request-journey-step">
                <span>03</span>
                <div>
                  <strong>O pedido segue como uma jornada unica</strong>
                  <p>Mesmo com distribuicao para varios profissionais, o cliente acompanha tudo em um fluxo so.</p>
                </div>
              </div>
            </div>

            {recommendationsLoading && (
              <div className="request-feedback success">Buscando profissionais recomendados...</div>
            )}

            {noRecommendedProfessionals && (
              <div className="request-contingency-card">
                <div>
                  <strong>Nenhum profissional elegivel foi encontrado agora</strong>
                  <p>
                    O TECNIFLOW pode registrar seu pedido e mantelo em triagem enquanto voce tenta
                    outra categoria ou busca manualmente pela vitrine de profissionais.
                  </p>
                </div>

                <div className="request-contingency-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => navigate('/cliente/profissionais')}
                  >
                    Buscar manualmente
                  </button>
                </div>
              </div>
            )}

            {!recommendationsLoading && recommendedProfessionals.length > 0 && (
              <div className="recommended-professionals-list">
                {recommendedProfessionals.map((professional, index) => {
                  const isSelected = String(selectedProfessional?.id) === String(professional.id);

                  return (
                    <button
                      key={professional.id}
                      type="button"
                      className={`recommended-professional-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedProfessional(professional)}
                    >
                      <div className="recommended-professional-rank">{index + 1}</div>

                      <div className="recommended-professional-main">
                        <div className="recommended-professional-header">
                          <strong>{professional.nome}</strong>
                          <div className="recommended-professional-badges">
                            {professional.verificado && (
                              <StatusBadge status="em_andamento">Verificado</StatusBadge>
                            )}
                            {professional.premium && (
                              <StatusBadge status="aceito">Premium</StatusBadge>
                            )}
                          </div>
                        </div>

                        <p>{professional.descricao}</p>

                        <div className="recommended-professional-meta">
                          <span>Avaliacao: {professional.avaliacaoMedia.toFixed(1)}</span>
                          <span>Avaliacoes: {professional.totalAvaliacoes}</span>
                          <span>Concluidos: {professional.totalConcluidos}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {error && <div className="request-feedback error">{error}</div>}
          {success && <div className="request-feedback success">{success}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                navigate(
                  selectedProfessional
                    ? `/cliente/profissionais/${selectedProfessional.id}`
                    : '/cliente/profissionais'
                )
              }
            >
              Cancelar
            </button>

            <button type="submit" className="primary-button" disabled={loading}>
              {loading
                ? 'Enviando...'
                : noRecommendedProfessionals
                  ? 'Registrar em triagem'
                  : 'Enviar para profissionais'}
            </button>
          </div>
        </form>
      </section>
    </DashboardLayout>
  );
}
