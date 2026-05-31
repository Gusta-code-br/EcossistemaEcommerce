# Ecossistema E-Commerce Distribuído

Projeto acadêmico que implementa um sistema de e-commerce com quatro microsserviços, demonstrando padrões de comunicação síncrona (REST), assíncrona (RabbitMQ) e resiliência (Circuit Breaker, Dead Letter Queue).

---

## Sumário

- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Execução com Docker](#execução-com-docker)
- [Execução Local](#execução-local)
- [Referência de Serviços](#referência-de-serviços)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Topologia RabbitMQ](#topologia-rabbitmq)
- [Decisões de Design](#decisões-de-design)

---

## Arquitetura

### Topologia do Sistema

```mermaid
flowchart TD
    CLIENT(["Cliente HTTP"])

    subgraph checkout["checkout-service :3001"]
        CTRL["Controller"]
        CB["Circuit Breaker"]
        PUB["Publisher AMQP"]
    end

    subgraph estoque_svc["estoque-service :3002"]
        ES["Verificação de Estoque"]
    end

    subgraph broker["RabbitMQ :5672"]
        EX{{"pedido.criado · fanout · durable"}}
        QP[("pagamento.pedido_criado")]
        QN[("notificacao.pedido_criado")]
    end

    subgraph pagamento_svc["pagamento-service :3003"]
        PG["Consumer"]
    end

    subgraph notificacao_svc["notificacao-service :3004"]
        NT["Consumer · prefetch=1"]
        DLX{{"notificacao.dlx"}}
        DLQ[("notificacao.dlq")]
    end

    CLIENT -->|"POST /pedidos"| CTRL
    CTRL --> CB
    CB -->|"GET /disponibilidade"| ES
    ES -->|"200 OK"| CB
    CB -.->|"OPEN: 503"| CTRL
    CTRL -->|"pedido criado"| PUB
    PUB -->|"publish persistent"| EX
    EX --> QP
    EX --> QN
    QP --> PG
    QN --> NT
    NT -.->|"nack · MAX_RETRIES"| DLX
    DLX --> DLQ
```

> Setas sólidas (`-->`) representam o fluxo normal. Setas tracejadas (`-.->`) representam caminhos de erro ou fallback. O frontend usa dados mockados locais e não realiza chamadas HTTP aos backends.

---

### Fluxo de Criação de Pedido

```mermaid
sequenceDiagram
    autonumber
    participant C as Cliente
    participant CO as checkout
    participant CB as Circuit Breaker
    participant ES as estoque-service
    participant MQ as RabbitMQ
    participant PG as pagamento-service
    participant NT as notificacao-service
    participant DQ as DLQ

    C->>CO: POST /pedidos

    loop para cada item do pedido
        CO->>CB: verificar item
        alt CB CLOSED ou HALF_OPEN
            CB->>ES: GET /disponibilidade
            ES-->>CB: 200 disponivel
            CB-->>CO: confirmado
        else CB OPEN
            CB-->>CO: falha rápida
            CO-->>C: 503 estoque indisponível
        end
    end

    CO->>CO: cria PED-XXXX
    CO-->>C: 201 pedido criado

    CO-)MQ: publish pedido.criado
    Note over MQ: fanout roteia para 2 filas

    MQ-)PG: pagamento.pedido_criado
    activate PG
    PG->>PG: processa 80pct aprovado
    PG->>MQ: ack
    deactivate PG

    MQ-)NT: notificacao.pedido_criado
    activate NT
    alt envio com sucesso
        NT->>MQ: ack
    else falha com retries disponíveis
        NT->>MQ: nack requeue=true
        MQ-)NT: reentrega
    else MAX_RETRIES atingido
        NT->>MQ: nack requeue=false
        MQ-)DQ: move para DLQ
    end
    deactivate NT
```

> A resposta `201` ao cliente é emitida **antes** da publicação no broker — o processamento de pagamento e notificação é inteiramente assíncrono e não bloqueia o fluxo principal. `->>` indica chamada síncrona; `-)` indica mensagem assíncrona (fire-and-forget).

---

### Resiliência

#### Circuit Breaker — Ciclo de Estados

```mermaid
stateDiagram-v2
    [*] --> CLOSED

    CLOSED --> OPEN : falhas consecutivas >= threshold
    OPEN --> HALF_OPEN : timeout expirado
    HALF_OPEN --> CLOSED : chamada bem-sucedida
    HALF_OPEN --> OPEN : chamada falhou

    note right of CLOSED
        Fluxo normal.
        Contador de falhas incrementado a cada erro.
    end note

    note right of OPEN
        Requisições rejeitadas com 503.
        Aguarda timeout de 10 s antes de testar recuperação.
    end note

    note right of HALF_OPEN
        Uma chamada de teste é enviada ao estoque-service.
        Sucesso retorna a CLOSED. Falha retorna a OPEN.
    end note
```

> Parâmetros ativos: `threshold = 3`, `timeout = 10 000 ms`. Valores definidos em `services/checkout-service/src/controllers/pedido.controller.js`.

---

#### Ciclo de Vida de Mensagem — notificacao-service

```mermaid
stateDiagram-v2
    [*] --> Recebida

    Recebida --> Processando
    Processando --> Confirmada : sucesso - ack
    Processando --> Requeue : falha - nack requeue=true
    Requeue --> Processando : reentregue pela fila
    Processando --> DLQ : MAX_RETRIES atingido - nack requeue=false
    Confirmada --> [*]
    DLQ --> [*]
```

> O contador de tentativas é mantido em memória (`Map` keyed no conteúdo serializado da mensagem). Uma reinicialização do serviço zera o contador — mensagens com histórico de falhas retornam ao início do ciclo. Para persistência entre reinicializações, seria necessário usar os headers nativos do RabbitMQ (`x-death`) ou um store externo.

---

## Pré-requisitos

| Ferramenta | Versão mínima | Observação |
|------------|--------------|------------|
| Docker | 24.x | Necessário para execução via Compose |
| Docker Compose | 2.x | Incluído no Docker Desktop |
| Node.js | 20.x | Apenas para execução local sem Docker |
| npm | 10.x | Incluído no Node.js 20 |

---

## Execução com Docker

### Subir todo o ambiente

```bash
docker-compose up --build
```

### Subir em background

```bash
docker-compose up --build -d
```

### Parar e remover containers

```bash
docker-compose down
```

### Parar e remover containers + volumes

```bash
docker-compose down -v
```

> **Atenção:** O `checkout-service`, `pagamento-service` e `notificacao-service` dependem do RabbitMQ. O `docker-compose.yml` usa `depends_on` com `condition: service_healthy` para garantir a ordem de inicialização. O healthcheck do RabbitMQ executa `rabbitmq-diagnostics ping` a cada 10 segundos, com 5 tentativas antes de declarar falha.

---

## Execução Local

Para executar cada serviço fora do Docker, o RabbitMQ deve estar disponível localmente. A forma mais direta é subir apenas o broker via Compose:

```bash
docker-compose up rabbitmq -d
```

Em seguida, em terminais separados:

### checkout-service

```bash
cd services/checkout-service
npm install
npm run dev        # nodemon (hot-reload)
# ou
npm start          # node src/app.js
```

### estoque-service

```bash
cd services/estoque-service
npm install
npm run dev
```

### pagamento-service

```bash
cd services/pagamento-service
npm install
npm run dev
```

### notificacao-service

```bash
cd services/notificacao-service
npm install
npm run dev
```

### frontend

```bash
cd frontend
npm install
npm run dev
```

> **Ponto de verificação:** Ao executar localmente, a variável `ESTOQUE_HOST` do `checkout-service` deve ser redefinida para `localhost`, pois o padrão `estoque-service` é o hostname DNS interno do Docker. Ver [Variáveis de Ambiente](#variáveis-de-ambiente).

---

## Referência de Serviços

### Endpoints por serviço

| Serviço | Porta | Rota | Método | Descrição |
|---------|-------|------|--------|-----------|
| checkout | 3001 | `/health` | GET | Status do serviço |
| checkout | 3001 | `/info` | GET | Metadados e rotas ativas |
| checkout | 3001 | `/pedidos` | POST | Cria pedido (consulta estoque + publica evento) |
| checkout | 3001 | `/pedidos` | GET | Lista pedidos em memória |
| checkout | 3001 | `/circuit-breaker/status` | GET | Estado atual do Circuit Breaker |
| checkout | 3001 | `/api-docs` | GET | Swagger UI |
| estoque | 3002 | `/health` | GET | Status do serviço |
| estoque | 3002 | `/info` | GET | Metadados e rotas ativas |
| estoque | 3002 | `/estoque` | GET | Lista todos os itens em estoque |
| estoque | 3002 | `/estoque/:id` | GET | Consulta item por `produtoId` |
| estoque | 3002 | `/produtos/:id/disponibilidade` | GET | Verifica disponibilidade (`?quantidade=N`) |
| estoque | 3002 | `/api-docs` | GET | Swagger UI |
| pagamento | 3003 | `/health` | GET | Status do serviço |
| pagamento | 3003 | `/info` | GET | Metadados e rotas ativas |
| pagamento | 3003 | `/pagamentos/simular` | POST | Simula pagamento via HTTP |
| pagamento | 3003 | `/pagamentos` | GET | Lista pagamentos registrados |
| notificacao | 3004 | `/health` | GET | Status do serviço |
| notificacao | 3004 | `/info` | GET | Metadados e rotas ativas |
| notificacao | 3004 | `/notificacoes/simular` | POST | Simula notificação via HTTP |
| notificacao | 3004 | `/notificacoes` | GET | Lista notificações registradas |

### Produtos disponíveis no estoque (dados iniciais)

| produtoId | Nome | Disponível |
|-----------|------|-----------|
| prod-001 | Teclado Mecânico RGB Pro | 14 |
| prod-002 | Monitor Ultrawide 34" | 5 |
| prod-003 | Mouse Gamer Sem Fio | 20 |
| prod-004 | Headset 7.1 Surround | 0 |
| prod-005 | SSD NVMe 1TB Gen4 | 30 |
| prod-006 | Webcam 4K Streaming | 8 |

### Exemplo: criar pedido

```bash
curl -X POST http://localhost:3001/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": "Ana Costa",
    "email": "ana@exemplo.com",
    "itens": [
      { "produtoId": "prod-001", "nome": "Teclado Mecânico RGB Pro", "quantidade": 1, "preco": 459.90 }
    ]
  }'
```

### Exemplo: verificar disponibilidade

```bash
curl "http://localhost:3002/produtos/prod-001/disponibilidade?quantidade=2"
```

### Exemplo: consultar status do Circuit Breaker

```bash
curl http://localhost:3001/circuit-breaker/status
```

---

## Variáveis de Ambiente

### checkout-service

| Variável | Finalidade | Padrão | Obrigatória |
|----------|-----------|--------|-------------|
| `RABBITMQ_URL` | URL de conexão AMQP com o broker | `amqp://guest:guest@localhost:5672` | Sim, em produção |
| `ESTOQUE_HOST` | Hostname do estoque-service | `estoque-service` | Sim, ao executar fora do Docker |

> O padrão `estoque-service` é o hostname DNS resolvido automaticamente pela rede interna do Docker Compose. Para execução local, defina `ESTOQUE_HOST=localhost`.

### estoque-service

Nenhuma variável de ambiente. O serviço não depende de serviços externos.

### pagamento-service

| Variável | Finalidade | Padrão | Obrigatória |
|----------|-----------|--------|-------------|
| `RABBITMQ_URL` | URL de conexão AMQP com o broker | `amqp://guest:guest@localhost:5672` | Sim, em produção |

### notificacao-service

| Variável | Finalidade | Padrão | Obrigatória |
|----------|-----------|--------|-------------|
| `RABBITMQ_URL` | URL de conexão AMQP com o broker | `amqp://guest:guest@localhost:5672` | Sim, em produção |
| `NOTIFICACAO_MAX_RETRIES` | Tentativas antes de mover mensagem para a DLQ | `3` | Não |

### RabbitMQ (broker)

| Variável | Finalidade | Padrão |
|----------|-----------|--------|
| `RABBITMQ_DEFAULT_USER` | Usuário administrador | `guest` |
| `RABBITMQ_DEFAULT_PASS` | Senha do usuário administrador | `guest` |

---

## Topologia RabbitMQ

| Recurso | Tipo | Configuração | Criado por |
|---------|------|-------------|------------|
| `pedido.criado` | Exchange fanout | durable | checkout-service |
| `pagamento.pedido_criado` | Queue | durable | pagamento-service |
| `notificacao.pedido_criado` | Queue | durable, x-dead-letter-exchange: notificacao.dlx | notificacao-service |
| `notificacao.dlx` | Exchange fanout | durable | notificacao-service |
| `notificacao.dlq` | Queue | durable | notificacao-service |

---

## Decisões de Design

### 1. Comunicação síncrona HTTP: Checkout → Estoque

O checkout verifica disponibilidade de estoque de forma síncrona via HTTP antes de confirmar o pedido. A escolha é justificada pela natureza da operação: o cliente precisa de uma resposta imediata (disponível ou não). Operações de leitura com dependência de resultado direto no fluxo de resposta são o caso de uso clássico para comunicação request/response.

A implementação usa o módulo nativo `http` do Node.js sem dependências externas, mantendo o serviço com footprint mínimo. O timeout de 3 segundos na requisição protege o checkout contra lentidão do estoque.

### 2. Circuit Breaker: Checkout → Estoque

Em sistemas distribuídos, falhas em um serviço podem propagar-se em cascata. Sem proteção, se o estoque-service ficar lento, o checkout acumularia conexões abertas até esgotar recursos (thread starvation, memory pressure).

O Circuit Breaker implementa uma máquina de estados com três estados:

| Estado | Comportamento |
|--------|--------------|
| CLOSED | Requisições fluem normalmente. Falhas são contadas. |
| OPEN | Requisições falham imediatamente sem tocar o estoque-service. Aguarda `timeout` ms. |
| HALF_OPEN | Uma requisição de teste é enviada. Se bem-sucedida, retorna a CLOSED. Se falhar, volta a OPEN. |

Parâmetros atuais (definidos em `pedido.controller.js`):

| Parâmetro | Valor |
|-----------|-------|
| `threshold` | 3 falhas consecutivas para abrir |
| `timeout` | 10.000 ms de espera no estado OPEN |

> **Ponto de verificação:** Esses parâmetros estão hardcoded na instanciação do CircuitBreaker em `pedido.controller.js`. Para torná-los configuráveis via variável de ambiente, é necessário alterar esse arquivo.

### 3. Exchange fanout: Checkout → Pagamento e Notificação

Após criar o pedido, o checkout não tem responsabilidade sobre o processamento de pagamento ou o envio de notificação. Esses processos são independentes, assíncronos e podem falhar sem impactar o fluxo de criação do pedido.

O exchange do tipo fanout propaga a mesma mensagem para todas as filas vinculadas simultaneamente, sem que o produtor precise conhecer os consumidores. Esse desacoplamento permite adicionar novos consumidores (analytics, auditoria, faturamento) sem modificar o checkout.

Mensagens são publicadas com `persistent: true` e as filas são declaradas com `durable: true`, garantindo que eventos não sejam perdidos em caso de reinicialização do broker.

### 4. Filas dedicadas por consumidor

`pagamento.pedido_criado` e `notificacao.pedido_criado` são filas separadas vinculadas ao mesmo exchange. Cada serviço tem seu próprio cursor de consumo: se o pagamento-service ficar offline, sua fila acumula mensagens sem afetar a fila de notificação, e vice-versa.

### 5. Dead Letter Queue com retries manuais (Notificação)

Provedores externos de notificação (e-mail, SMS) são sujeitos a falhas transitórias. Um retry imediato pode agravar a situação (thundering herd). A DLQ separa mensagens que falharam sistematicamente para análise e reprocessamento controlado.

Mecanismo implementado:

- `prefetch(1)` garante que apenas uma mensagem seja processada por vez, evitando consumo simultâneo que dificultaria o controle de tentativas.
- O contador de tentativas é mantido em memória (`Map` com a mensagem serializada como chave).
- Após `MAX_RETRIES` tentativas, `nack(requeue=false)` encaminha a mensagem ao DLX, que a roteia para a DLQ.

> **Limitação conhecida:** O contador de tentativas é in-memory. Uma reinicialização do serviço zera o contador, e a mensagem volta ao início do ciclo de retries. Para persistência do contador entre reinicializações, seria necessário armazenar o estado externamente (Redis, banco de dados) ou usar os headers nativos do RabbitMQ (`x-death`).

### 6. Frontend desacoplado dos backends

O frontend (React + Vite) usa dados mockados locais (`src/data/`) e não realiza chamadas HTTP aos serviços de backend. Essa separação permite desenvolver e validar as integrações entre microsserviços de forma independente da interface.

---

## Estrutura do Repositório

```
.
├── docker-compose.yml
├── docs/
│   └── openapi.yaml               # Contrato OpenAPI 3.0 (Checkout + Estoque)
├── frontend/                      # React + Vite (porta 5173)
│   ├── Dockerfile
│   └── src/
│       └── data/                  # Dados mockados locais
└── services/
    ├── checkout-service/          # Porta 3001
    │   └── src/
    │       ├── app.js
    │       ├── circuit-breaker.js
    │       ├── controllers/pedido.controller.js
    │       ├── rabbitmq/publisher.js
    │       └── routes/
    ├── estoque-service/           # Porta 3002
    │   └── src/
    │       ├── app.js
    │       ├── controllers/estoque.controller.js
    │       └── routes/
    ├── pagamento-service/         # Porta 3003
    │   └── src/
    │       ├── app.js
    │       ├── controllers/pagamento.controller.js
    │       └── rabbitmq/consumer.js
    └── notificacao-service/       # Porta 3004
        └── src/
            ├── app.js
            ├── controllers/notificacao.controller.js
            └── rabbitmq/consumer.js
```

---

## Padrões de Integração Implementados

| Padrão | Onde | Marco |
|--------|------|-------|
| REST síncrono (request/response) | Checkout → Estoque | Marco 1 |
| Contrato de API via OpenAPI 3.0 | docs/openapi.yaml | Marco 1 |
| Publish/Subscribe via fanout exchange | Checkout → RabbitMQ | Marco 2 |
| Consumer assíncrono de eventos | Pagamento, Notificação | Marco 2 |
| Circuit Breaker (CLOSED/OPEN/HALF_OPEN) | Checkout → Estoque | Marco 2 |
| Dead Letter Queue com retries configuráveis | Notificação | Marco 2 |
| Mensagens persistentes (durable queues) | RabbitMQ | Marco 2 |
| Logs estruturados por transação | Todos os serviços | Marco 3 |
| Validação de entrada nas fronteiras HTTP | Todos os controllers | Marco 3 |
