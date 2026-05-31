# Manual do Usuário
## Sistema de E-Commerce Distribuído

---

> **Para quem é este manual?**
> Para qualquer pessoa que queira usar, testar ou apresentar este sistema — mesmo sem experiência com tecnologia. Você não precisa saber programar para seguir este guia.

---

## O que é este sistema?

Este sistema simula uma loja virtual completa.

Quando alguém faz um pedido, quatro "departamentos" digitais trabalham juntos automaticamente:

| Departamento | O que ele faz |
|---|---|
| **Caixa** (Checkout) | Recebe o pedido e verifica se os produtos estão disponíveis |
| **Almoxarifado** (Estoque) | Informa se há produtos em estoque |
| **Financeiro** (Pagamento) | Processa o pagamento |
| **Comunicações** (Notificação) | Envia a confirmação ao cliente |

Cada departamento trabalha de forma independente. Se um deles tiver um problema, os outros continuam funcionando normalmente.

---

## O que você precisa para começar

Antes de ligar o sistema, verifique se você tem tudo abaixo:

- [ ] Um computador com **Windows, Mac ou Linux**
- [ ] O programa **Docker Desktop** instalado e aberto
- [ ] A **pasta do projeto** salva no seu computador
- [ ] Um **navegador de internet** (Chrome, Firefox ou Edge)
- [ ] O **terminal** do computador (explicamos como abrir no Passo 2)

---

> **O que é o Docker Desktop?**
> Pense nele como uma "caixa" que carrega todos os programas necessários para o sistema funcionar. Sem ele aberto, o sistema não liga. Se você ainda não tem o Docker instalado, peça ao desenvolvedor do projeto para ajudar.

---

## PARTE 1 — Ligando o Sistema

### Passo 1 — Abra o Docker Desktop

Procure o ícone do Docker Desktop na sua área de trabalho ou na barra de tarefas.

Clique duas vezes para abrir.

Aguarde até ver a mensagem **"Engine running"** na parte inferior do programa.

`[Insira aqui um print do Docker Desktop com "Engine running" destacado]`

> Se o ícone ficar vermelho ou aparecer uma mensagem de erro, veja a seção **Resolução de Problemas** no final deste manual.

---

### Passo 2 — Abra o Terminal

O terminal é a janela onde você digita comandos para o computador.

**No Windows:**
1. Pressione as teclas `Windows` + `R` ao mesmo tempo
2. Digite `cmd` na caixa que aparece
3. Clique em **OK**

**No Mac:**
1. Pressione `Command` + `Espaço`
2. Digite `Terminal`
3. Pressione **Enter**

`[Insira aqui um print do terminal aberto em cada sistema operacional]`

---

### Passo 3 — Acesse a pasta do projeto

No terminal aberto, navegue até a pasta onde o projeto está salvo.

Digite o comando abaixo. Substitua o caminho pelo local real da pasta no seu computador:

```
cd C:\Users\seu-nome\projeto\EcossistemaEcommerce
```

Pressione **Enter**.

> **Não sabe onde a pasta está?** Clique com o botão direito do mouse sobre a pasta. Procure a opção "Propriedades" (Windows) ou "Obter informações" (Mac). O caminho completo aparece ali.

---

### Passo 4 — Ligue todos os serviços

Com o terminal na pasta certa, digite o comando abaixo:

```
docker-compose up --build
```

Pressione **Enter**.

O terminal vai começar a exibir muitas linhas de texto. Isso é normal — o sistema está sendo preparado.

**Aguarde.** Na primeira vez, esse processo pode levar entre 2 e 10 minutos, dependendo da velocidade da sua internet.

`[Insira aqui um print do terminal durante o processo de inicialização]`

O sistema está pronto quando você ver mensagens como estas:

```
[checkout-service] Rodando na porta 3001
[estoque-service] Rodando na porta 3002
[pagamento-service] Rodando na porta 3003
[notificacao-service] Rodando na porta 3004
[checkout] RabbitMQ conectado — exchange: pedido.criado
```

`[Insira aqui um print do terminal com as mensagens de inicialização concluída]`

---

### Passo 5 — Confirme que tudo está funcionando

Abra o navegador de internet.

Acesse os endereços abaixo, um por um. Em cada um, você deve ver uma resposta confirmando que o serviço está ativo.

| Departamento | Endereço para verificar |
|---|---|
| Caixa | http://localhost:3001/health |
| Almoxarifado | http://localhost:3002/health |
| Financeiro | http://localhost:3003/health |
| Comunicações | http://localhost:3004/health |

Cada endereço deve mostrar uma resposta como esta:

```json
{
  "status": "ok"
}
```

Se todos os quatro mostrarem `"status": "ok"`, o sistema está pronto para uso.

`[Insira aqui um print do navegador mostrando a resposta de confirmação]`

---

## PARTE 2 — Usando o Sistema

### Como abrir o painel de testes

O sistema tem um painel visual onde você pode testar todas as ações sem precisar digitar comandos técnicos. Esse painel se chama **Swagger**.

> **O que é o Swagger?**
> É um formulário online já conectado ao sistema. Você preenche os campos e clica em um botão. O Swagger envia o pedido para o sistema e mostra a resposta na tela — sem precisar digitar nenhum código.

Abra o navegador e acesse:

```
http://localhost:3001/api-docs
```

`[Insira aqui um print da tela do Swagger aberta no navegador]`

---

### Tarefa 1 — Ver o que tem em estoque

**Para ver todos os produtos disponíveis:**

1. Abra o navegador
2. Acesse `http://localhost:3002/estoque`
3. A lista completa de produtos aparece na tela

`[Insira aqui um print da lista de produtos no navegador]`

**Produtos disponíveis no sistema:**

| Código | Produto | Quantidade disponível |
|--------|---------|:-------------------:|
| prod-001 | Teclado Mecânico RGB Pro | 14 |
| prod-002 | Monitor Ultrawide 34" | 5 |
| prod-003 | Mouse Gamer Sem Fio | 20 |
| prod-004 | Headset 7.1 Surround | **0 — esgotado** |
| prod-005 | SSD NVMe 1TB Gen4 | 30 |
| prod-006 | Webcam 4K Streaming | 8 |

**Para verificar um produto específico:**

1. Acesse `http://localhost:3002/estoque/prod-001`
2. Troque `prod-001` pelo código do produto que deseja consultar

---

### Tarefa 2 — Fazer um pedido

Para fazer um pedido, você vai enviar ao sistema as informações do cliente e dos produtos desejados.

**Passo a passo pelo painel Swagger:**

1. Acesse `http://localhost:3001/api-docs` no navegador

2. Localize a seção **Checkout** na página

3. Clique em **POST /pedidos**

`[Insira aqui um print destacando a seção POST /pedidos no Swagger]`

4. Clique no botão **"Try it out"** (Experimente)

5. No campo de texto que aparece, apague o conteúdo existente e cole o exemplo abaixo:

```json
{
  "cliente": "Maria Souza",
  "email": "maria@exemplo.com",
  "itens": [
    {
      "produtoId": "prod-001",
      "nome": "Teclado Mecânico RGB Pro",
      "quantidade": 1,
      "preco": 459.90
    }
  ]
}
```

6. Clique no botão **"Execute"** (Executar)

`[Insira aqui um print do botão Execute no Swagger]`

**O que acontece depois:**

O sistema realiza automaticamente estas ações em sequência:

1. Verifica se o produto `prod-001` tem estoque disponível
2. Registra o pedido com um número único (como `PED-0003`)
3. Envia o pedido ao setor financeiro e ao setor de comunicações para processamento

**Resposta de sucesso esperada:**

```json
{
  "id": "PED-0003",
  "cliente": "Maria Souza",
  "status": "criado",
  "total": 459.90
}
```

`[Insira aqui um print da resposta de sucesso no Swagger]`

> **O número `201` que aparece na tela** é uma confirmação técnica de que o pedido foi criado com sucesso.

---

**Fazendo um pedido com mais de um produto:**

No campo `itens`, adicione os produtos separados por vírgula, como no exemplo abaixo:

```json
{
  "cliente": "Carlos Lima",
  "email": "carlos@exemplo.com",
  "itens": [
    {
      "produtoId": "prod-003",
      "nome": "Mouse Gamer Sem Fio",
      "quantidade": 2,
      "preco": 349.90
    },
    {
      "produtoId": "prod-005",
      "nome": "SSD NVMe 1TB Gen4",
      "quantidade": 1,
      "preco": 549.90
    }
  ]
}
```

---

### Tarefa 3 — Ver os pedidos já feitos

1. Abra o navegador
2. Acesse `http://localhost:3001/pedidos`

Todos os pedidos feitos desde que o sistema foi ligado aparecem nessa lista.

> **Atenção:** Os pedidos ficam guardados somente enquanto o sistema está ligado. Ao desligar, eles são apagados. O sistema não tem banco de dados permanente nesta versão.

---

### Tarefa 4 — Simular um pagamento diretamente

O setor financeiro normalmente processa os pagamentos de forma automática, assim que um pedido é criado. Mas você pode disparar uma simulação manualmente para fins de teste.

**No painel Swagger (`http://localhost:3001/api-docs`):**

1. Localize a seção **Pagamento**
2. Clique em **POST /pagamentos/simular**
3. Clique em **"Try it out"**
4. Cole o conteúdo abaixo no campo de texto:

```json
{
  "pedidoId": "PED-0003",
  "valor": 459.90,
  "metodo": "pix"
}
```

> **Métodos de pagamento disponíveis:** `pix`, `cartao_credito`, `cartao_debito`, `boleto`

5. Clique em **"Execute"**

**O resultado pode ser:**
- **Aprovado** — ocorre em cerca de 80% das tentativas
- **Recusado** — ocorre em cerca de 20% das tentativas

Esse comportamento é proposital. O sistema simula a realidade, onde nem todo pagamento é aprovado de imediato.

`[Insira aqui um print mostrando uma resposta de pagamento aprovado e uma de recusado]`

---

### Tarefa 5 — Simular uma notificação diretamente

O setor de comunicações normalmente envia notificações de forma automática. Mas você pode simular uma notificação manual para fins de teste.

**No painel Swagger (`http://localhost:3001/api-docs`):**

1. Localize a seção **Notificação**
2. Clique em **POST /notificacoes/simular**
3. Clique em **"Try it out"**
4. Cole o conteúdo abaixo:

```json
{
  "canal": "email",
  "tipo": "pedido.criado",
  "destinatario": "cliente@exemplo.com",
  "conteudo": "Seu pedido foi recebido com sucesso!"
}
```

> **Canais disponíveis:** `email`, `sms`, `push`

5. Clique em **"Execute"**

---

### Tarefa 6 — Acompanhar o que está acontecendo nos bastidores

Os **logs** são o "diário" do sistema. Eles mostram em tempo real tudo o que está acontecendo em cada departamento.

Para ver os logs, abra um terminal e use os comandos abaixo:

| Departamento | Comando |
|---|---|
| Caixa | `docker logs checkout-service` |
| Almoxarifado | `docker logs estoque-service` |
| Financeiro | `docker logs pagamento-service` |
| Comunicações | `docker logs notificacao-service` |

`[Insira aqui um print de como os logs aparecem no terminal]`

**O que você vai ver após criar um pedido:**

```
[checkout] Iniciando pedido — cliente: Maria Souza | itens: 1
[checkout] Estoque OK: prod-001 — 14 disponíveis
[checkout] Pedido criado: PED-0003
[checkout] Evento publicado: pedido.criado — PED-0003
[pagamento] Processando pedido via fila — id: PED-0003 | valor: R$ 459.9
[pagamento] Pedido PED-0003 — pagamento aprovado
[notificacao] Processando pedido PED-0003 — tentativa 1/3
[notificacao] E-mail enviado para maria@exemplo.com
```

Esse registro confirma que todos os departamentos receberam e processaram o pedido com sucesso.

---

### Tarefa 7 — Verificar o estado do disjuntor do sistema

O sistema tem um mecanismo de proteção chamado **Circuit Breaker** (disjuntor).

> **O que é o Circuit Breaker?**
> Funciona como o disjuntor elétrico da sua casa. Se o Almoxarifado tiver muitos erros seguidos, o disjuntor "abre" e bloqueia novas tentativas por 10 segundos. Isso protege o sistema de travar completamente.

**Para verificar o estado atual:**

1. Abra o navegador
2. Acesse `http://localhost:3001/circuit-breaker/status`

**Interpretando a resposta:**

| Estado | O que significa na prática |
|--------|--------------------------|
| `CLOSED` | Tudo normal. O sistema está aceitando pedidos. |
| `OPEN` | O disjuntor abriu. Novos pedidos recebem erro temporariamente. Aguarde 10 segundos. |
| `HALF_OPEN` | O sistema está testando se o problema foi resolvido. |

---

## PARTE 3 — Desligando o Sistema

Quando terminar de usar o sistema, desligue-o corretamente.

1. Volte ao terminal onde o sistema foi iniciado
2. Digite o comando abaixo:

```
docker-compose down
```

3. Pressione **Enter**
4. Aguarde a mensagem de confirmação aparecer

`[Insira aqui um print do terminal confirmando que o sistema foi desligado]`

> Todos os pedidos, pagamentos e notificações registrados durante a sessão serão apagados. Isso é esperado nesta versão do sistema.

---

## PARTE 4 — Resolução de Problemas

### O Docker Desktop está mostrando erro ou ícone vermelho

O Docker Desktop precisa estar aberto e saudável antes de tudo.

1. Feche o Docker Desktop completamente
2. Abra novamente
3. Aguarde o ícone ficar verde ou a mensagem **"Engine running"** aparecer
4. Tente iniciar o sistema novamente

Se o problema persistir, reinicie o computador e repita o processo.

---

### O terminal ficou parado por muito tempo

Na primeira vez que o sistema é iniciado, ele precisa baixar vários arquivos da internet. Esse processo pode levar de 2 a 10 minutos, dependendo da sua conexão.

Enquanto linhas de texto continuarem aparecendo no terminal, o processo está em andamento. Não feche o terminal.

---

### Recebi a mensagem "Estoque insuficiente"

Isso significa que o produto escolhido não tem a quantidade solicitada disponível.

O produto `prod-004` (Headset 7.1 Surround) tem **estoque zerado** — pedidos com ele sempre retornarão esse erro. Escolha outro produto da lista.

---

### Recebi o erro 503 — estoque indisponível

O número 503 indica que o disjuntor do sistema (Circuit Breaker) foi ativado temporariamente.

Aguarde 10 segundos e refaça o pedido. O sistema se recupera automaticamente.

---

### O pagamento foi recusado

Esse comportamento é proposital. O sistema recusa cerca de 1 em cada 5 pagamentos para simular a realidade.

Tente enviar o pagamento novamente. Na maioria das vezes, a próxima tentativa será aprovada.

---

### A notificação aparece várias vezes no log com a palavra "Falha"

Esse comportamento também é proposital e esperado.

O sistema de notificação tenta reenviar a mensagem até 3 vezes quando algo dá errado. Na maioria dos casos, uma das tentativas seguintes funciona.

Se você ver a mensagem `MAX_RETRIES atingido` no log, significa que todas as tentativas falharam. A mensagem é guardada em uma fila especial para análise — o sistema segue funcionando normalmente.

---

### Quero apagar tudo e começar do zero

1. No terminal, digite:

```
docker-compose down -v
```

2. Pressione **Enter** e aguarde a confirmação

3. Em seguida, inicie o sistema novamente:

```
docker-compose up --build
```

---

## PARTE 5 — Perguntas Frequentes

**Por que o pagamento às vezes é recusado sem motivo aparente?**

O sistema imita o que acontece no mundo real. Em lojas de verdade, pagamentos são recusados por diversos motivos: limite do cartão, falha de conexão, suspeita de fraude. Aqui, 1 em cada 5 pagamentos é recusado aleatoriamente para demonstrar como o sistema lida com essas situações.

---

**Por que os pedidos somem quando desligo o sistema?**

Nesta versão, o sistema guarda os dados apenas na memória do computador — como um rascunho que é apagado ao fechar. Uma versão futura incluirá um banco de dados para salvar os dados de forma permanente.

---

**Posso usar o sistema em dois computadores ao mesmo tempo?**

Não nesta versão. O sistema funciona em um único computador por vez, de forma local. Ele não está conectado à internet nem a servidores externos.

---

**Por que há quatro programas separados em vez de um só?**

Um único programa seria mais simples, sim. Mas o objetivo deste sistema é demonstrar como grandes empresas organizam seus sistemas em partes independentes. Se o setor de pagamento parar, os pedidos continuam sendo recebidos. Se as notificações falharem, os pagamentos não são afetados. Cada parte tem sua própria responsabilidade — e seu próprio ponto de falha isolado.

---

**Onde posso ver todos os pedidos que já foram feitos?**

Acesse `http://localhost:3001/pedidos` no navegador. Todos os pedidos feitos desde que o sistema foi ligado aparecem nessa lista.

---

*Dúvidas não cobertas neste manual? Consulte o arquivo `README.md` na pasta do projeto para informações técnicas detalhadas, ou entre em contato com o desenvolvedor responsável.*
