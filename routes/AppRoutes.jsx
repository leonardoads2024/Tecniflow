import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import AdminAuditoria from '../pages/admin/AdminAuditoria';
import AdminAvaliacoes from '../pages/admin/AdminAvaliacoes';
import AdminCategorias from '../pages/admin/AdminCategorias';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminIncidentes from '../pages/admin/AdminIncidentes';
import AdminPlanos from '../pages/admin/AdminPlanos';
import AdminProfissionais from '../pages/admin/AdminProfissionais';
import AdminSolicitacoes from '../pages/admin/AdminSolicitacoes';
import AdminUsuarios from '../pages/admin/AdminUsuarios';
import ClienteDashboard from '../pages/cliente/ClienteDashboard';
import ClientePerfil from '../pages/cliente/ClientePerfil';
import ClienteProfissionais from '../pages/cliente/ClienteProfissionais';
import ClienteProfissionalDetalhe from '../pages/cliente/ClienteProfissionalDetalhe';
import ClienteSolicitacaoDetalhe from '../pages/cliente/ClienteSolicitacaoDetalhe';
import ClienteSolicitacoesFlow from '../pages/cliente/ClienteSolicitacoesFlow';
import NovaSolicitacaoFlow from '../pages/cliente/NovaSolicitacaoFlow';
import ProfissionalDashboard from '../pages/profissional/ProfissionalDashboardHub';
import ProfissionalAssinatura from '../pages/profissional/ProfissionalAssinatura';
import ProfissionalAvaliacoes from '../pages/profissional/ProfissionalAvaliacoes';
import ProfissionalFinanceiro from '../pages/profissional/ProfissionalFinanceiro';
import ProfissionalPerfil from '../pages/profissional/ProfissionalPerfil';
import ProfissionalServicosFlow from '../pages/profissional/ProfissionalServicosFlow';
import LandingPage from '../pages/public/LandingPage';
import AjudaPage from '../pages/shared/AjudaPage';
import NotificacoesPage from '../pages/shared/NotificacoesPage';
import NotFound from '../pages/shared/NotFound';
import PrivateRoute from './PrivateRoutes';
import RoleRoute from './RoleRoutes';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/esqueci-minha-senha" element={<ForgotPasswordPage />} />
        <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />

        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <AdminDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/usuarios"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <AdminUsuarios />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/profissionais"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <AdminProfissionais />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/solicitacoes"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <AdminSolicitacoes />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/avaliacoes"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <AdminAvaliacoes />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/categorias"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <AdminCategorias />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/auditoria"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <AdminAuditoria />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/incidentes"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <AdminIncidentes />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/planos"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="admin">
                <AdminPlanos />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/cliente/dashboard"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="cliente">
                <ClienteDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/profissional/dashboard"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="profissional">
                <ProfissionalDashboard />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/profissional/servicos"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="profissional">
                <ProfissionalServicosFlow />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/cliente/solicitacoes"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="cliente">
                <ClienteSolicitacoesFlow />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/cliente/perfil"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="cliente">
                <ClientePerfil />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/profissional/avaliacoes"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="profissional">
                <ProfissionalAvaliacoes />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/profissional/financeiro"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="profissional">
                <ProfissionalFinanceiro />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/profissional/assinatura"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="profissional">
                <ProfissionalAssinatura />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/profissional/perfil"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="profissional">
                <ProfissionalPerfil />
              </RoleRoute>
            </PrivateRoute>
          }
        />
        <Route
          path="/cliente/nova-solicitacao"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="cliente">
                <NovaSolicitacaoFlow />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/cliente/solicitacoes/:id"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="cliente">
                <ClienteSolicitacaoDetalhe />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/cliente/profissionais"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="cliente">
                <ClienteProfissionais />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/cliente/profissionais/:id"
          element={
            <PrivateRoute>
              <RoleRoute allowedRole="cliente">
                <ClienteProfissionalDetalhe />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route
          path="/ajuda"
          element={
            <PrivateRoute>
              <AjudaPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/notificacoes"
          element={
            <PrivateRoute>
              <NotificacoesPage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
