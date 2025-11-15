# Aureus Bank

Sistema de financiamento de veículos desenvolvido em Angular com backend FastAPI.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **npm** (geralmente vem com Node.js)
- **Angular CLI** (versão 17.3.17 ou superior)
- **Git** - [Download](https://git-scm.com/)

## Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/TauaniVitoria/Aureus-Bank.git
```

### 2. Navegue para a pasta do frontend

```bash
cd Aureus-Bank
```

### 3. Instale as dependências

```bash
npm install
```

Isso instalará todas as dependências necessárias listadas no `package.json`, incluindo:

- Angular 17.3.0
- PrimeNG 17.0.0
- PrimeIcons 7.0.0
- RxJS 7.8.0

## Configuração

### Configurar URL da API

O projeto utiliza arquivos de ambiente para configurar a URL da API:

**Desenvolvimento** (`src/environments/environment.ts`):

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8000',  // URL do backend local
  viaCepUrl: 'https://viacep.com.br/ws',
  fipeApiUrl: 'https://parallelum.com.br/fipe/api/v1'
};
```

 **Nota:** Certifique-se de que o backend está rodando na URL configurada antes de iniciar o frontend.

## Como Executar

### Modo de Desenvolvimento

```bash
npm run start
```

ou

```bash
ng serve
```

O aplicativo estará disponível em `http://localhost:4200/`

A aplicação recarrega automaticamente quando você altera qualquer arquivo de código.

## Estrutura do Projeto

```text
Aureus-Bank/
├── src/
│   ├── app/
│   │   ├── guards/              # Guards de autenticação e autorização
│   │   ├── interceptors/       # Interceptors HTTP
│   │   ├── lado-admin/         # Componentes do painel administrativo
│   │   ├── lado-cliente/        # Componentes do painel do cliente
│   │   ├── services/            # Services para comunicação com API
│   │   ├── _models/             # Interfaces e modelos TypeScript
│   │   ├── app.component.ts     # Componente raiz
│   │   ├── app.routes.ts        # Configuração de rotas
│   │   └── app.config.ts        # Configuração da aplicação
│   ├── environments/            # Arquivos de ambiente
│   └── assets/                  # Arquivos estáticos
├── package.json
└── README.md
```

## Tecnologias Utilizadas

- **Angular 17.3.0** - Framework frontend
- **PrimeNG 17.0.0** - Biblioteca de componentes UI
- **PrimeIcons 7.0.0** - Ícones
- **RxJS 7.8.0** - Programação reativa
- **TypeScript 5.4.2** - Linguagem de programação

## Funcionalidades de Segurança

- Autenticação JWT
- Guards de rota (auth, admin, cliente)
- Interceptor HTTP para tratamento de erros 401/403
- Validação de expiração de token
- Proteção contra dados corrompidos no localStorage
