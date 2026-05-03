// Legacy screen kept only as reference. Active route uses NovaSolicitacaoFlow.jsx.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import './NovaSolicitacao.css';

export default function NovaSolicitacao() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    id_categoria: '1',
    descricao_servico: '',
    endereco: '',
    prioridade: 'media',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError('');
    if (success) setSuccess('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const categoria = String(form.id_categoria || '').trim();
    const descricao = String(form.descricao_servico || '').trim();
    const endereco = String(form.endereco || '').trim();
    const prioridade = String(form.prioridade || '').trim();

    if (!categoria) {
      setError('Selecione uma categoria.');
      return;
    }

    if (!descricao) {
      setError('Preencha a descrição do serviço.');
      return;
    }

    if (!endereco) {
      setError('Preencha o endereço do atendimento.');
      return;
    }

    if (!prioridade) {
      setError('Selecione a prioridade.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      setError(
        'Nesta fase, a solicitacao precisa ser aberta a partir da escolha de um profissional. Vamos conectar essa tela ao fluxo de busca de profissionais na proxima etapa.'
      );

      return;

      await createClientServiceRequest({
        id_categoria: Number(categoria),
        descricao_servico: descricao,
        endereco,
        prioridade,
      });

      setSuccess('Solicitação criada com sucesso.');

      setTimeout(() => {
        navigate('/cliente/solicitacoes', { replace: true });
      }, 1200);
    } catch (err) {
      setError(err?.message || 'Erro ao criar solicitação.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout title="Nova Solicitação">
      <section className="new-request-page">
        <div className="new-request-header">
          <h2>Criar nova solicitação</h2>
          <p>
            Informe os dados do serviço para iniciar o fluxo da plataforma.
          </p>
        </div>

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
                <option value="1">Instalação</option>
                <option value="2">Manutenção</option>
                <option value="3">Suporte técnico</option>
                <option value="4">Configuração</option>
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
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descricao_servico">Descrição do serviço</label>
            <textarea
              id="descricao_servico"
              name="descricao_servico"
              placeholder="Descreva com detalhes o serviço que você precisa."
              value={form.descricao_servico}
              onChange={handleChange}
              rows={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="endereco">Endereço</label>
            <input
              id="endereco"
              name="endereco"
              type="text"
              placeholder="Informe o endereço do atendimento"
              value={form.endereco}
              onChange={handleChange}
            />
          </div>

          {error && <div className="request-feedback error">{error}</div>}
          {success && <div className="request-feedback success">{success}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate('/cliente/solicitacoes')}
            >
              Cancelar
            </button>

            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? 'Enviando...' : 'Criar solicitação'}
            </button>
          </div>
        </form>
      </section>
    </DashboardLayout>
  );
}
