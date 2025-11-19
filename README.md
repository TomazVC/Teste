# S² - Stonks ao Quadrado

Aplicação web para administração de carteira de investimentos pessoais.

## Tecnologias

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Recharts

## Instalação

```bash
npm install
```

## Execução

### Opção 1: Script de Gerenciamento (Recomendado)

Use o script interativo de gerenciamento para controlar a aplicação:

**Windows:**
```bash
# Duplo clique no arquivo ou execute:
start-manager.bat

# Ou diretamente no PowerShell:
.\manage-app.ps1
```

O script oferece um menu interativo com as seguintes opções:
- **1** - Iniciar aplicação (dev)
- **2** - Parar aplicação
- **3** - Reiniciar aplicação
- **4** - Fazer build
- **5** - Ver logs
- **6** - Limpar logs
- **7** - Preview build
- **8** - Lint (verificar código)
- **9** - Status da aplicação
- **0** - Sair

### Opção 2: Comandos Manuais

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Build

### Usando o Script de Gerenciamento

Execute o script e escolha a opção **4** (Fazer build).

### Manualmente

```bash
npm run build
```

## Funcionalidades

- Cadastro de ativos (Ação, FIIs, ETF-BR, ETF-GB, Cripto)
- Fluxo de aporte em 3 passos
- Cálculo automático de preço médio
- Histórico de transações
- Evolução mensal do patrimônio
- Gráficos de crescimento

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza o build de produção
- `npm run lint` - Verifica o código com ESLint

## Persistência

Os dados são armazenados localmente no navegador usando LocalStorage.

