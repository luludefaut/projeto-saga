# PROJETO SAGA

## Componentes da equipe
- Daniel Richard
- Eloah Veiga
- João Pedro Fagundes 
- Luca Mendes
- Mateus Chaves

***
# 📘 SAGA - Site de Análise e Gestão de Atividades

> Plataforma web desenvolvida para registro, análise e gestão de relatórios da equipe pedagógica do SENAI.

---

# 🚀 Sobre o Projeto

O **SAGA (Site de Análise e Gestão de Atividades)** foi desenvolvido com o objetivo de centralizar, organizar e monitorar relatórios acadêmicos e pedagógicos, proporcionando maior controle das informações, rastreabilidade dos registros e otimização dos processos internos.

Além do gerenciamento de ocorrências, o sistema oferece dashboards analíticos, histórico de registros, recursos de acessibilidade e integração futura com Inteligência Artificial.

---

# ❗ Problemática

Atualmente, o Núcleo de Educação Profissional do SENAI Camaçari enfrenta dificuldades relacionadas ao:

* Armazenamento descentralizado de informações;
* Perda de registros importantes;
* Falta de padronização nos relatórios;
* Dificuldade de acompanhamento institucional;
* Risco de alterações indevidas nos documentos.

Esse cenário não é exclusivo do SENAI Camaçari. A necessidade de um sistema estruturado de registro e monitoramento também foi identificada em outras unidades da rede SENAI.

---

# 💡 Solução Proposta

Para solucionar essas dificuldades, desenvolvemos uma plataforma web capaz de:

✅ Registrar ocorrências acadêmicas;

✅ Organizar relatórios em fluxo de trabalho;

✅ Monitorar status das atividades;

✅ Gerar indicadores através de dashboards;

✅ Armazenar histórico de registros;

✅ Disponibilizar recursos de acessibilidade;

✅ Integrar futuramente uma IA para auxílio pedagógico.

---

# 🏗️ Estrutura do Site

## Fluxo Geral

Relatório → Histórico → Dashboard → Indicadores

Todos os módulos da plataforma estão conectados para garantir consistência dos dados e atualização das informações.

---

# 🔐 Módulo de Autenticação

## Login

Funcionalidades:

* Campo de e-mail;
* Campo de senha;
* Opção "Lembrar senha";
* Avatar de usuário;
* Alternância de tema.

## Cadastro

Campos disponíveis:

* Nome completo;
* E-mail;
* Senha.

---

# 📋 Página de Relatórios

Responsável pela criação e gerenciamento das ocorrências.

## Funcionalidades

* Criar novo relatório;
* Editar relatórios;
* Alterar status;
* Organizar por prioridade.

## Status Disponíveis

| Status          | Descrição                        |
| --------------- | -------------------------------- |
| 📝 A Fazer      | Relatório criado                 |
| 🔄 Em Andamento | Relatório parcialmente concluído |
| ✅ Realizado     | Relatório finalizado e enviado ao histórico            |

### Regra de Negócio

Relatórios concluídos podem ser editados por até **24 horas** no histórico.

Após esse período:

* Apenas visualização;
* Exclusão permitida;
* Edição bloqueada.

---

# 📊 Dashboard

Área responsável pela visualização dos indicadores do sistema.

## Recursos

### 📈 Gráfico de Barras

Exibe:

* Quantidade de ocorrências;
* Distribuição por categoria;
* Evolução dos registros.

### 🥧 Gráfico de Pizza

Exibe:

* Pendentes;
* Em andamento;
* Concluídas.

### 🔎 Filtros

* Data inicial;
* Data final;
* Curso;
* Tipo de relatório.

### 📌 Cards Informativos

* Total de relatórios;
* Pendentes;
* Em andamento;
* Concluídos.

---

# 🗂️ Histórico

Armazena os relatórios finalizados.

## Funcionalidades

* Consulta de ocorrências;
* Visualização detalhada;
* Edição dentro do prazo de 24 horas.

---

# 🤖 ChatBot Inteligente

## Objetivos

* Auxiliar na elaboração de relatórios;
* Sugerir tratativas;
* Analisar ocorrências registradas.

## Tecnologia Prevista

Integração com API Gemini para implementação de IA baseada em NLP (Processamento de Linguagem Natural).

---

# ⚙️ Configurações

Área destinada às configurações do usuário e do sistema.

## 👤 Perfil

Exibe:

* Nome;
* E-mail.

## 🚪 Encerrar Sessão

Remove os tokens e exige o login novamente.

## ♿ Acessibilidade

Recursos disponíveis:

* 🌙 Dark Mode;
* ⚫ Alto Contraste;

## 📩 Fale Conosco

* Botão de cópia automática do e-mail;
* Feedback visual após a cópia.

## 👥 Cadastro de Usuários

Disponível apenas para usuários autenticados.

---

# 🎨 Interface e Design

## Conceito Visual

O sistema utiliza:

* Glassmorphism;
* Layout Responsivo;
* Componentização visual;
* Padronização global de estilos.

---

# 🧱 Estrutura Global

Utilizamos CSS Global compartilhado entre as páginas.

## Layout Principal

grid-template-columns:

210px | 1fr

grid-template-rows:

100px | 1fr

Estrutura:

| Header |
|------------------|
| Sidebar \| Main |

### Componentes

* Header;
* Sidebar;
* Main Content.

---

# 💻 Estrutura JavaScript

## Funcionalidades

### 📋 Relatórios

* Criação;
* Armazenamento;
* Edição;
* Transporte de dados.

### 🔐 Autenticação

* Login;
* Cadastro;
* Validação de formulários.

### 🧭 Navegação

* Controle de rotas;
* Controle de permissões.

### 📊 Dashboard

* Atualização dinâmica;
* Integração com gráficos;
* Filtros inteligentes.

---

# 🛠️ Tecnologias Utilizadas

## Front-end

* HTML5
* CSS3
* JavaScript

## Back-end

* Node.js
* MySQL
* Prisma ORM

## Bibliotecas

* Chart.js

## Futuras Integrações

* Gemini API
* IA NLP

---

# 🧪 Testes Automatizados (E2E com Cypress)

O front-end é testado ponta a ponta com **Cypress**, que abre o site num navegador de verdade e simula o uso: digitar, clicar, navegar entre as telas.

> ✅ **Não é preciso subir o back-end nem o banco de dados.** Nos testes, as chamadas à API (`http://localhost:3000`) são interceptadas com `cy.intercept` e respondidas com dados falsos.

## Pré-requisitos

- Node.js (versão LTS)
- Dependências instaladas:

```bash
npm install
```

## Como rodar os testes

O Cypress precisa que o site esteja no ar em `http://localhost:5500`. Por isso são necessários **dois terminais**:

**Terminal 1 — subir o site**

```bash
npm start
```

Deixe esse terminal aberto. Ele inicia o `http-server` na porta **5500**.

**Terminal 2 — rodar o Cypress**

```bash
# Modo interativo (abre a janela do Cypress, ideal para acompanhar os testes)
npm run cy:open

# Modo headless (roda tudo no terminal, sem abrir janela)
npm run cy:run
```

No modo interativo, escolha **E2E Testing**, selecione um navegador e clique no arquivo de teste que deseja executar.

### Outras formas de rodar

```bash
# Rodar apenas um fluxo
npx cypress run --spec "cypress/e2e/fluxo1-autenticacao-cadastro.cy.js"
npx cypress run --spec "cypress/e2e/fluxo2-relatorio-historico.cy.js"

# Rodar em um navegador específico
npx cypress run --browser chrome
```

## Scripts Disponíveis (`package.json`)

| Comando | Descrição |
| ------- | --------- |
| `npm start` | Sobe o site em `http://localhost:5500` |
| `npm run cy:open` | Abre o Cypress no modo interativo |
| `npm run cy:run` | Roda todos os testes no modo headless |

## O que é testado

### Fluxo 1 — Autenticação e cadastro (`fluxo1-autenticacao-cadastro.cy.js`)

| Caso | O que valida |
| ---- | ------------ |
| F1-01 | Login com sucesso, envio dos campos corretos à API, token salvo e redirecionamento para Relatório |
| F1-02 | Avisos de campos obrigatórios quando o login é enviado vazio (sem chamar a API) |
| F1-05 | Mensagem de erro e permanência no login com credenciais erradas (`401`) |
| F1-06 | Bloqueio de acesso às páginas internas sem login |
| F1-07 | Link "Cadastrar Novo Usuário" nas Configurações |
| F1-08 | Cadastro de novo usuário com sucesso e limpeza do formulário |

### Fluxo 2 — Relatório e Histórico (`fluxo2-relatorio-historico.cy.js`)

| Caso | O que valida |
| ---- | ------------ |
| F2-01/02 | Tela vazia e abertura da escolha do tipo de relatório |
| F2-03 | Bloqueio ao salvar com campos obrigatórios vazios |
| F2-04 | Criação de relatório em andamento e exibição na lista |
| F2-05/06 | Finalização do relatório (`POST` + `PATCH`) e envio ao Histórico |
| F2-07 | Edição de relatório no Histórico |
| F2-08 | Exclusão com **desfazer** (nada é apagado na API) |
| F2-09 | Exclusão confirmada (o `DELETE` é enviado após 6 segundos) |
| F2-10 | Erro `500` da API exibido dentro do modal |

> ⏱️ O teste **F2-09** espera 6 segundos de propósito (tempo do "desfazer"), então ele é um pouco mais lento que os demais.

## Como os testes funcionam

- Os testes ficam em `cypress/e2e/` e terminam com `.cy.js`.
- A configuração está em `cypress.config.js` (`baseUrl: http://localhost:5500`).
- O arquivo `cypress/support/helpers.js` tem funções reaproveitadas pelos testes:
  - `visitarLogado(caminho)`: abre uma página interna já "logada", com um token falso salvo no `localStorage`;
  - `criarTokenFalso()` e `usuarioFalso`: dados de sessão usados no login simulado.

## Problemas comuns

| Problema | Solução |
| -------- | ------- |
| O Cypress não consegue abrir `localhost:5500` | Confirme se o `npm start` está rodando no Terminal 1 |
| Porta `5500` já está em uso | Feche o processo que está usando a porta ou o outro servidor que esteja aberto |
| Cypress pede para instalar o binário | Rode `npx cypress install` |

---

# 🌿 Estrutura de Branches

## Main

Versão principal do projeto.


# 📈 Diferenciais do Projeto

✅ Interface Responsiva

✅ Sistema Full Stack

✅ Dashboard Analítico

✅ Recursos de Acessibilidade

✅ Controle de Histórico

✅ Chatbot Inteligente

---

# 🎯 Conclusão

O SAGA foi desenvolvido para transformar o processo de registro e monitoramento de relatórios, proporcionando maior organização, rastreabilidade e eficiência para a equipe pedagógica.

Mais do que armazenar informações, nossa plataforma busca oferecer uma solução moderna, acessível e escalável para a gestão institucional.

---

# 📚 Referências

1. **SENAI.** Projeto Integrador 2025/02 4.02 – Sistema de Registro e Monitoramento de Ocorrências Acadêmicas. Plataforma SAGA SENAI de Inovação, Demanda da Indústria n. 11642, 2025.  
   Disponível em: <https://plataforma.gpinovacao.senai.br/plataforma/demandas-da-industria/interna/11642>
