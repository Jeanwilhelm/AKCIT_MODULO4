# Controle Financeiro

Sistema web de controle pessoal de finanças para registro e acompanhamento de entradas e saídas. Funciona inteiramente no navegador — sem backend, sem banco de dados, sem autenticação.

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Instalação](#instalação)
- [Execução](#execução)
- [Testes](#testes)
- [Arquitetura](#arquitetura)
- [Persistência de dados](#persistência-de-dados)
- [Categorias disponíveis](#categorias-disponíveis)
- [Limitações conhecidas](#limitações-conhecidas)
- [Uso de IA no desenvolvimento](#uso-de-ia-no-desenvolvimento)
- [Próximos passos](#próximos-passos)

---

## Funcionalidades

- **Dashboard** com saldo acumulado global e resumo mensal por ano
- **Registro de entradas** (receitas) com título, descrição, data e valor
- **Registro de saídas** (despesas) com categoria obrigatória
- **Edição e exclusão** de lançamentos com confirmação
- **Filtro por ano** para navegar entre períodos
- **Agrupamento por mês** com detalhamento por categoria
- **Visualização em modal** com dados completos do lançamento
- **Validação inline** em todos os campos de formulário
- **Persistência local** automática via `localStorage`

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16.2.4 (App Router) |
| UI | React 19.2.4 |
| Linguagem | TypeScript 5 (strict mode) |
| Estilização | Tailwind CSS 4 |
| Persistência | `localStorage` (browser) |
| Testes | Jest 30.3 + Testing Library 16.3 |
| Linting | ESLint 9 |

---

## Instalação

**Pré-requisitos:** Node.js 20 ou superior (testado com v24.x). Recomenda-se usar um gerenciador de versões como [nvm](https://github.com/nvm-sh/nvm).

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd controle-financeiro

# Instale as dependências com versões fixadas pelo lockfile
npm ci
```

Não há variáveis de ambiente necessárias. O projeto não consome nenhuma API externa.

---

## Execução

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O servidor recarrega automaticamente a cada alteração.

### Build de produção

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Testes

A suíte cobre utilitários, hook de estado, componentes de UI e telas completas.

### Rodar todos os testes

```bash
npm test
```

### Modo watch (re-executa ao salvar)

```bash
npm run test:watch
```

### Relatório de cobertura

```bash
npm run test:coverage
```

A cobertura é coletada sobre `src/` exceto arquivos de entrada (`layout.tsx`, `page.tsx`, `App.tsx`).

### Rodar um teste específico

```bash
# Por nome (substring do describe ou it)
npx jest -t "deve chamar onSave"

# Por arquivo
npx jest src/__tests__/hooks/useTransactions.test.ts
```

### Estrutura dos testes

Cada camada tem escopo e responsabilidade distintos:

| Camada | O que testa |
|---|---|
| `lib/` | Funções puras: validação de campos, formatação de moeda/data, agrupamento e ordenação por mês |
| `hooks/` | Ciclo de vida do estado: CRUD completo, persistência no `localStorage`, recálculo de saldos |
| `components/ui/` | Comportamento dos inputs atômicos: máscara de data, formatação de moeda, limite de caracteres, opções do select |
| `components/` | Modais: renderização condicional de campos, disparo correto dos callbacks de ação |
| `views/` | Telas completas: fluxo de formulário (criação e edição), filtro de ano no dashboard, navegação entre estados |

```
src/__tests__/
├── lib/
│   ├── validators.test.ts       — validateTitle, validateDate, validateAmount, validateDescription
│   ├── formatters.test.ts       — formatCurrency (BRL), formatDate (ISO → dd/mm/aaaa)
│   └── groupByMonth.test.ts     — agrupamento por mês, ordenação desc, filtragem por ano
├── hooks/
│   └── useTransactions.test.ts  — add/update/remove, persistência, IDs inexistentes
├── components/
│   ├── ui/
│   │   ├── CharCounter.test.tsx       — cor vermelha ao atingir limite
│   │   ├── CurrencyInput.test.tsx     — máscara BRL, bloqueio de valor acima do máximo
│   │   ├── DateInput.test.tsx         — máscara dd/mm/aaaa
│   │   └── CategorySelect.test.tsx    — 10 categorias + placeholder
│   ├── DeleteConfirmModal.test.tsx    — confirmação, cancelamento, clique no backdrop
│   └── TransactionModal.test.tsx      — entrada vs saída, categoria, descrição opcional
└── views/
    ├── Dashboard.test.tsx             — estado vazio, filtro de ano, clique em transação
    └── TransactionForm.test.tsx       — criação, validação inline, modo edição
```

**141 casos de teste** distribuídos em 12 suítes. O `localStorage` é mockado em memória para cada teste via `jest.setup.ts`, garantindo isolamento total.

---

## Arquitetura

O projeto segue a estrutura padrão do Next.js App Router com separação clara entre camadas:

```
src/
├── app/
│   ├── App.tsx          — orquestrador de estado e navegação entre telas
│   ├── layout.tsx       — layout raiz com fonte e metadados
│   └── page.tsx         — ponto de entrada (renderiza App)
├── components/
│   ├── ui/              — componentes atômicos reutilizáveis
│   │   ├── CurrencyInput.tsx    — input formatado em BRL
│   │   ├── DateInput.tsx        — input com máscara dd/mm/aaaa
│   │   ├── CharCounter.tsx      — contador de caracteres com limite visual
│   │   └── CategorySelect.tsx   — select com as 10 categorias
│   ├── DeleteConfirmModal.tsx   — modal de confirmação de exclusão
│   ├── TransactionModal.tsx     — modal de visualização de lançamento
│   ├── GlobalBalance.tsx        — card de saldo acumulado global
│   ├── MonthSummaryRow.tsx      — linha colapsável de resumo mensal
│   ├── YearFilter.tsx           — seletor de ano
│   └── EmptyState.tsx           — tela inicial sem dados
├── views/
│   ├── Dashboard.tsx            — tela principal com lista de meses
│   └── TransactionForm.tsx      — formulário de criação e edição
├── hooks/
│   └── useTransactions.ts       — estado global + operações CRUD + sync com localStorage
├── lib/
│   ├── validators.ts            — funções de validação puras
│   ├── formatters.ts            — formatação de moeda e data
│   ├── groupByMonth.ts          — agrupamento e ordenação de transações
│   └── cn.ts                    — utilitário clsx + tailwind-merge
└── types/
    └── index.ts                 — tipos Transaction, EntryType, Category
```

### Fluxo de dados

```
App.tsx (estado + navegação)
  ├── useTransactions()  ←→  localStorage
  ├── Dashboard          ← recebe transactions[] via props
  └── TransactionForm    ← recebe type + editingTransaction via props
```

`App.tsx` é o único componente com acesso ao hook. As views e componentes filhos são stateless em relação ao domínio — recebem dados e callbacks via props.

---

## Persistência de dados

Todos os lançamentos são armazenados em `localStorage` sob a chave `fin_transactions` como array JSON:

```json
[
  {
    "id": "1746123456789-abc1234",
    "type": "entrada",
    "title": "Salário",
    "description": "Referente ao mês de maio",
    "date": "2025-05-05",
    "amount": 5000,
    "category": null
  },
  {
    "id": "1746123456790-def5678",
    "type": "saida",
    "title": "Aluguel",
    "date": "2025-05-10",
    "amount": 1500,
    "category": "Moradia"
  }
]
```

**Datas** são armazenadas em formato ISO (`yyyy-mm-dd`) e convertidas para `dd/mm/aaaa` apenas na exibição. **Valores** são números decimais (ex: `1500.00`), não strings.

---

## Categorias disponíveis

Aplicáveis exclusivamente a lançamentos do tipo **saída**:

- Alimentação
- Compras Pessoais
- Contas de Consumo
- Educação e Ensino
- Investimentos
- Lazer e Hobbies
- Moradia
- Outros
- Saúde
- Transporte

---

## Limitações conhecidas

| Limitação | Detalhe |
|---|---|
| **Sem sincronização** | Dados ficam apenas no navegador atual. Trocar de dispositivo ou limpar o cache apaga tudo. |
| **Sem autenticação** | Qualquer pessoa com acesso ao navegador vê e edita os dados. |
| **Sem paginação** | Todos os lançamentos são carregados em memória de uma vez. Volumes muito grandes podem degradar a performance. |
| **Sem exportação** | Não há como exportar os dados para CSV, PDF ou outro formato. |
| **Sem multi-moeda** | Apenas Real Brasileiro (BRL). |
| **Sem recorrência** | Lançamentos recorrentes precisam ser adicionados manualmente a cada período. |
| **Sem metas ou orçamento** | A aplicação registra e exibe, mas não compara com valores planejados. |
| **ID inexistente no formulário** | Se `editingTransaction` não for encontrado pelo pai, o formulário abre em modo de criação sem feedback de erro ao usuário. |

---

## Uso de IA no desenvolvimento

Este projeto foi desenvolvido com assistência do **Claude Sonnet 4.5** (Anthropic) via Claude Code. A IA foi utilizada em todas as fases:

- **Scaffolding inicial**: estrutura de pastas, tipos TypeScript, componentes base
- **Lógica de negócio**: implementação das funções de agrupamento mensal, validadores e formatadores
- **Componentes de UI**: `CurrencyInput`, `DateInput`, modais, dashboard
- **Hook de estado**: `useTransactions` com persistência em `localStorage`
- **Suíte de testes**: configuração do Jest + Testing Library, escrita de 141 casos de teste cobrindo utilitários, hook e componentes

Todo o código gerado foi revisado e aprovado pelo desenvolvedor. A responsabilidade pela arquitetura, decisões de produto e qualidade final é do autor do projeto.

---

## Próximos passos

### Funcionalidade
- [ ] Exportação de dados (CSV / JSON)
- [ ] Lançamentos recorrentes (diário, semanal, mensal)
- [ ] Metas e orçamento por categoria
- [ ] Filtro por categoria e tipo na listagem
- [ ] Busca por título ou descrição

### Infraestrutura
- [ ] Migração da persistência para IndexedDB (maior capacidade)
- [ ] PWA com suporte offline e instalação no dispositivo
- [ ] Sincronização opcional via backend (Supabase ou similar)
- [ ] Autenticação para isolamento de dados por usuário

### Qualidade
- [ ] Testes E2E com Playwright cobrindo fluxos completos
- [ ] Snapshots para componentes puramente visuais (`EmptyState`, `GlobalBalance`)
- [ ] Tratamento explícito de ID inexistente no formulário de edição
- [ ] Acessibilidade: auditoria completa com axe-core
