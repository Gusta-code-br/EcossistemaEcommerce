# 🛒 Ecossistema E-Commerce Distribuído

> Projeto acadêmico de base estrutural para um sistema distribuído de e-commerce com arquitetura de microsserviços.

---

## ⚠️ AVISO IMPORTANTE

**As integrações entre os serviços NÃO foram implementadas nesta etapa.**

Este projeto contém apenas a estrutura base. Os serviços funcionam de forma **completamente isolada**, respondendo com dados mockados. Toda comunicação entre serviços, integração com mensageria (RabbitMQ) e lógica distribuída será implementada manualmente em etapas futuras.

---

## 🎯 Objetivo do Projeto

Montar a base estrutural de um sistema distribuído de e-commerce para fins acadêmicos, deixando o projeto pronto para evolução futura sem realizar nesta etapa nenhuma comunicação entre microsserviços.

---

## 🏗️ Arquitetura Prevista (Futura)

```
┌─────────────────────────────────────────────────┐
│                   Frontend (React)               │
│                     porta 5173                   │
└──────────────────────┬──────────────────────────┘
                       │ HTTP (a implementar)
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│   checkout   │ │   estoque    │ │  pagamento   │
│   :3001      │ │   :3002      │ │   :3003      │
└──────┬───────┘ └──────────────┘ └──────────────┘
       │ publish (a implementar)
       ▼
┌──────────────────────────────────────────────────┐
│              RabbitMQ  :5672 / :15672            │
└──────────────────────┬───────────────────────────┘
                       │ consume (a implementar)
                       ▼
              ┌──────────────────┐
              │  notificacao     │
              │   :3004          │
              └──────────────────┘
```

---

## 📁 Estrutura de Pastas

```
ecossistema-ecommerce-distribuido/
├── README.md                    # Este arquivo
├── .gitignore                   # Arquivos ignorados pelo Git
├── docker-compose.yml           # Orquestração dos containers
├── frontend/                    # Interface React + Vite
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── pages/               # Páginas da aplicação
│       ├── components/          # Componentes reutilizáveis
│       ├── data/                # Dados mockados locais
│       └── styles/              # CSS global
└── services/
    ├── checkout-service/        # Gerencia pedidos (porta 3001)
    ├── estoque-service/         # Gerencia estoque (porta 3002)
    ├── pagamento-service/       # Processa pagamentos (porta 3003)
    └── notificacao-service/     # Envia notificações (porta 3004)
```

---

## 🔧 Função de Cada Microsserviço

| Serviço             | Porta | Responsabilidade                                      |
|---------------------|-------|-------------------------------------------------------|
| `checkout-service`  | 3001  | Recebe e registra pedidos                             |
| `estoque-service`   | 3002  | Controla disponibilidade de produtos                  |
| `pagamento-service` | 3003  | Processa e simula pagamentos                          |
| `notificacao-service`| 3004 | Envia notificações (e-mail, push, etc.)               |
| `frontend`          | 5173  | Interface do usuário em React                         |
| `rabbitmq`          | 5672  | Broker de mensagens (provisionado, sem uso no código) |

---

## 🚀 Como Subir o Ambiente

### Pré-requisitos
- [Docker](https://www.docker.com/) instalado
- [Docker Compose](https://docs.docker.com/compose/) instalado

### Subir tudo de uma vez

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd ecossistema-ecommerce-distribuido

# Subir todos os containers
docker-compose up --build

# Ou em background
docker-compose up --build -d
```

### Parar o ambiente

```bash
docker-compose down
```

---

## 🌐 Portas Disponíveis

| Serviço              | URL                          |
|----------------------|------------------------------|
| Frontend             | http://localhost:5173        |
| Checkout Service     | http://localhost:3001        |
| Estoque Service      | http://localhost:3002        |
| Pagamento Service    | http://localhost:3003        |
| Notificação Service  | http://localhost:3004        |
| RabbitMQ (AMQP)      | amqp://localhost:5672        |
| RabbitMQ (Painel)    | http://localhost:15672       |

> Credenciais padrão RabbitMQ: **guest / guest**

---

## 📋 Rotas Disponíveis por Serviço

### Checkout Service (`:3001`)
```
GET  /health          → Status do serviço
GET  /info            → Informações do serviço
POST /pedidos         → Cria pedido (retorno mockado)
GET  /pedidos         → Lista pedidos mockados
```

### Estoque Service (`:3002`)
```
GET  /health          → Status do serviço
GET  /info            → Informações do serviço
GET  /estoque         → Lista todos os itens em estoque
GET  /estoque/:id     → Consulta item específico por ID
```

### Pagamento Service (`:3003`)
```
GET  /health              → Status do serviço
GET  /info                → Informações do serviço
POST /pagamentos/simular  → Simula processamento de pagamento (mockado)
```

### Notificação Service (`:3004`)
```
GET  /health                  → Status do serviço
GET  /info                    → Informações do serviço
POST /notificacoes/simular    → Simula envio de notificação (mockado)
```

---

## 🔒 O Que Foi Propositalmente NÃO Implementado

- ❌ Comunicação HTTP entre microsserviços
- ❌ Publicação de mensagens no RabbitMQ
- ❌ Consumo de filas do RabbitMQ
- ❌ Circuit breaker, retry, DLQ, idempotência
- ❌ Frontend consumindo APIs reais dos backends
- ❌ Banco de dados
- ❌ Autenticação / autorização
- ❌ Lógica distribuída real (saga, two-phase commit, etc.)
- ❌ Configuração de tracing distribuído (Jaeger, Zipkin)
- ❌ API Gateway

---

## 🗺️ Próximos Passos (Implementação Futura)

1. **Fase 1 - Integração HTTP Síncrona**
   - Frontend consome APIs dos backends via fetch/axios
   - Checkout consulta estoque antes de criar pedido

2. **Fase 2 - Mensageria Assíncrona**
   - Checkout publica evento `pedido.criado` no RabbitMQ
   - Pagamento consome fila `pedidos`
   - Notificação consome fila `pagamentos.confirmados`

3. **Fase 3 - Resiliência**
   - Circuit breaker no checkout ao chamar estoque
   - Retry com backoff exponencial
   - Dead Letter Queue (DLQ) para mensagens com falha
   - Idempotência nos consumidores

4. **Fase 4 - Observabilidade**
   - Health checks avançados
   - Métricas com Prometheus + Grafana
   - Tracing distribuído

5. **Fase 5 - Persistência**
   - Adicionar banco de dados por serviço (PostgreSQL / MongoDB)
   - Migrations e seeds

---

## 📝 Notas para Desenvolvimento

- Cada serviço tem seu próprio `package.json` e `Dockerfile`
- Os dados mockados estão em `src/data/*.mock.js` em cada serviço
- O frontend usa dados de `src/data/products.js` — nenhuma chamada HTTP é feita
- O RabbitMQ sobe como infraestrutura mas **nenhum serviço se conecta a ele** nesta fase
