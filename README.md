# Blue Hour - Sistema de Venda de Ingressos K-POP

Sistema completo de venda de ingressos para eventos de K-POP em Manaus, desenvolvido com Next.js, TypeScript, Prisma e shadcn/ui.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Prisma** - ORM para gerenciamento de banco de dados
- **shadcn/ui** - Componentes UI modernos e acessíveis
- **Tailwind CSS** - Estilização utilitária
- **SQLite** - Banco de dados (pode ser facilmente migrado para PostgreSQL/MySQL)

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## 🛠️ Instalação

1. **Clone o repositório e instale as dependências:**

```bash
npm install
```

2. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="file:./dev.db"
```

3. **Configure o banco de dados:**

```bash
# Gerar o cliente Prisma
npm run db:generate

# Criar o banco de dados e aplicar o schema
npm run db:push

# (Opcional) Popular o banco com dados de exemplo
npm run db:seed
```

4. **Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

O projeto estará disponível em [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
blue-hour/
├── app/                    # App Router do Next.js
│   ├── eventos/           # Páginas de eventos
│   ├── admin/             # Área administrativa
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   └── ui/               # Componentes shadcn/ui
├── lib/                  # Utilitários e configurações
│   ├── prisma.ts        # Cliente Prisma
│   └── utils.ts         # Funções utilitárias
├── prisma/              # Configuração Prisma
│   └── schema.prisma    # Schema do banco de dados
└── public/              # Arquivos estáticos
```

## 🗄️ Modelos de Dados

- **Evento**: Informações sobre os eventos (nome, data, local, etc.)
- **Ingresso**: Tipos de ingressos disponíveis para cada evento
- **Cliente**: Dados dos compradores
- **Venda**: Registro de vendas de ingressos

## 🎯 Funcionalidades

### Público

- ✅ Visualizar eventos disponíveis
- ✅ Ver detalhes dos eventos
- ✅ Visualizar ingressos disponíveis
- 🔄 Comprar ingressos (em desenvolvimento)

### Administrativo

- ✅ Área administrativa básica
- 🔄 Gerenciar eventos (em desenvolvimento)
- 🔄 Gerenciar ingressos (em desenvolvimento)
- 🔄 Visualizar vendas (em desenvolvimento)

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm run db:push` - Aplica mudanças do schema ao banco
- `npm run db:studio` - Abre o Prisma Studio (interface visual do banco)
- `npm run db:generate` - Gera o cliente Prisma
- `npm run db:migrate` - Cria uma nova migração
- `npm run db:seed` - Popula o banco com dados de exemplo

## 🔄 Próximos Passos

- [ ] Implementar sistema de compra de ingressos
- [ ] Adicionar autenticação de usuários
- [ ] Criar painel administrativo completo
- [ ] Implementar pagamento (integração com gateway)
- [ ] Adicionar geração de QR codes para ingressos
- [ ] Sistema de notificações por email
- [ ] Dashboard com estatísticas de vendas

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👥 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.
