# 💸 Calculadora de Despesas - Sistema Completo

Uma aplicação web moderna e completa para gerenciamento de despesas pessoais, desenvolvida com Next.js, React, TypeScript e Supabase.

## ✨ Funcionalidades

### 🔐 Autenticação
- Cadastro e login de usuários
- Perfis automáticos
- Sessões seguras com Supabase Auth

### 💰 Gerenciamento de Despesas
- Adicionar despesas com descrição, valor, categoria e data
- Listar e filtrar despesas
- Editar e excluir despesas
- Categorias coloridas e personalizáveis

### 📊 Análises e Relatórios
- Gráficos interativos (pizza, linha, barras)
- Análise por categoria
- Tendências mensais
- Estatísticas detalhadas
- Comparação mensal

### 🎨 Interface Moderna
- Design responsivo e elegante
- Gradientes e animações suaves
- Tema claro otimizado
- Componentes shadcn/ui
- Ícones Lucide React

## 🚀 Tecnologias

- **Frontend**: Next.js 13, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL)
- **Autenticação**: Supabase Auth
- **Gráficos**: Recharts
- **Formulários**: React Hook Form
- **Notificações**: Sonner
- **Datas**: date-fns

## 📦 Instalação e Configuração

### 1. Clone o repositório
```bash
git clone <repository-url>
cd calculadora-despesas
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

#### 3.1 Criar projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta ou faça login
3. Clique em "New Project"
4. Escolha uma organização
5. Preencha os dados do projeto:
   - Nome do projeto
   - Senha do banco de dados (anote esta senha!)
   - Região (escolha a mais próxima)
6. Clique em "Create new project"

#### 3.2 Obter as credenciais
1. Após criar o projeto, vá em **Settings** > **API**
2. Copie os seguintes valores:
   - **Project URL** (algo como: `https://abc123.supabase.co`)
   - **anon public** key (chave longa que começa com `eyJ...`)

#### 3.3 Configurar variáveis de ambiente
1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores pelas suas credenciais reais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui
```

### 4. Executar as migrações do banco de dados

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo do arquivo `supabase/migrations/20250615230756_precious_sea.sql`
4. Cole no editor SQL
5. Clique em "Run" para executar

### 5. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

### 6. Acessar a aplicação
Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais

- **profiles**: Perfis dos usuários (criados automaticamente)
- **categories**: Categorias de despesas (10 categorias pré-definidas)
- **expenses**: Despesas dos usuários
- **budgets**: Orçamentos mensais (funcionalidade futura)

### Categorias Pré-definidas

1. 🍽️ **Alimentação** - #F59E0B (Amarelo)
2. 🚗 **Transporte** - #3B82F6 (Azul)
3. 🏠 **Moradia** - #10B981 (Verde)
4. ❤️ **Saúde** - #EF4444 (Vermelho)
5. 🎓 **Educação** - #8B5CF6 (Roxo)
6. 🎮 **Entretenimento** - #EC4899 (Rosa)
7. 👕 **Roupas** - #06B6D4 (Ciano)
8. 📱 **Tecnologia** - #6B7280 (Cinza)
9. ✈️ **Viagem** - #F97316 (Laranja)
10. ➕ **Outros** - #64748B (Cinza escuro)

### Segurança

- Row Level Security (RLS) habilitado em todas as tabelas
- Políticas de acesso por usuário autenticado
- Triggers automáticos para timestamps
- Validações de dados

## 🎯 Como Usar

### 1. Criar Conta
- Acesse a aplicação
- Clique na aba "Cadastrar"
- Preencha: Nome completo, Email e Senha
- Clique em "Criar Conta"

### 2. Fazer Login
- Use o email e senha cadastrados
- Clique em "Entrar"

### 3. Adicionar Despesas
- Vá na aba "Adicionar"
- Preencha:
  - Descrição (ex: "Almoço no restaurante")
  - Valor (ex: 25.50)
  - Categoria (escolha uma das 10 disponíveis)
  - Data (padrão: hoje)
- Clique em "Adicionar Despesa"

### 4. Visualizar Despesas
- Vá na aba "Minhas Despesas"
- Use os filtros para buscar por descrição ou categoria
- Veja o total de gastos
- Edite ou exclua despesas conforme necessário

### 5. Analisar Gastos
- Vá na aba "Visão Geral"
- Veja gráficos interativos:
  - Distribuição por categoria (pizza)
  - Tendência mensal (linha)
  - Ranking de categorias (barras)
- Analise estatísticas como:
  - Total gasto
  - Gastos do mês atual
  - Gasto médio
  - Comparação mensal

## 🛠️ Desenvolvimento

### Estrutura de Pastas

```
├── app/                    # App Router (Next.js 13)
├── components/            # Componentes React
│   ├── analytics/        # Gráficos e análises
│   ├── auth/            # Autenticação
│   ├── dashboard/       # Dashboard principal
│   ├── expenses/        # Gerenciamento de despesas
│   ├── layout/          # Layout e navegação
│   └── ui/              # Componentes base (shadcn/ui)
├── contexts/             # Context API
├── hooks/               # Custom hooks
├── lib/                 # Utilitários e configurações
├── supabase/           # Migrações SQL
└── types/              # Tipos TypeScript
```

### Scripts Disponíveis

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run start    # Servidor de produção
npm run lint     # Linting
```

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🔒 Segurança

- Autenticação segura com Supabase
- Validação de dados no frontend e backend
- Políticas RLS no banco de dados
- Sanitização de inputs
- HTTPS obrigatório em produção

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push do código para GitHub
2. Conecte o repositório no Vercel
3. Configure as variáveis de ambiente:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy automático!

### Netlify

1. Build: `npm run build`
2. Publish directory: `out`
3. Configure as variáveis de ambiente

## 🎯 Funcionalidades Futuras

- [ ] Orçamentos mensais
- [ ] Metas de economia
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Notificações push
- [ ] Modo escuro
- [ ] Categorias personalizadas
- [ ] Receitas e renda
- [ ] Planejamento financeiro
- [ ] Compartilhamento de despesas
- [ ] Backup automático

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ por **Jonathan S. (xJhowx)**

- GitHub: [@xjhowx-upgrates](https://github.com/xjhowx-upgrates)
- LinkedIn: [Jonathan S.](https://linkedin.com/in/jonathan-s)

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se as variáveis de ambiente estão configuradas corretamente
2. Confirme se executou as migrações SQL no Supabase
3. Abra uma [issue](https://github.com/xjhowx-upgrates/Calculadora-Despesas/issues) no GitHub

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

## 📸 Screenshots

### Tela de Login
![Login](https://via.placeholder.com/800x600/10B981/FFFFFF?text=Tela+de+Login)

### Dashboard
![Dashboard](https://via.placeholder.com/800x600/3B82F6/FFFFFF?text=Dashboard+Analytics)

### Lista de Despesas
![Despesas](https://via.placeholder.com/800x600/EC4899/FFFFFF?text=Lista+de+Despesas)

### Adicionar Despesa
![Adicionar](https://via.placeholder.com/800x600/F59E0B/FFFFFF?text=Adicionar+Despesa)