import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'src/pages/auth/LoginPage.jsx',
    'src/pages/auth/Register.jsx',
    'src/pages/cliente/ClienteDashboard.next.jsx',
    'src/pages/cliente/ClienteNotifications.jsx',
    'src/pages/cliente/ClienteProfile.jsx',
    'src/pages/cliente/ClienteSolicitacoes.jsx',
    'src/pages/cliente/ClientRequests.jsx',
    'src/pages/cliente/NovaSolicitacao.jsx',
    'src/pages/profissional/ProfissionalDashboardPage.jsx',
    'src/pages/profissional/ProfissionalServicos.jsx',
    'src/pages/public/HomePage.jsx',
    'src/routes/protectedRoute.jsx',
    'src/services/Api.js',
  ]),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
