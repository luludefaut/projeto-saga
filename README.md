# PROJETO SAGA

## Componentes da equipe
- Daniel Richard
- Eloah Veiga
- João Pedro Fagundes Ernesto
- Luca Mendes
- Mateus Chaves

***
# 📘 SAGA - Sistema de Análise e Gestão de Atividades

> Plataforma desenvolvida para registro, análise e gestão de relatórios da equipe pedagógica do SENAI.

---

# 🚀 Sobre o Projeto

O **SAGA (Sistema de Análise e Gestão de Atividades)** foi desenvolvido com o objetivo de centralizar, organizar e monitorar relatórios acadêmicos e pedagógicos, proporcionando maior controle das informações, rastreabilidade dos registros e otimização dos processos internos.

Além do gerenciamento de ocorrências, o sistema oferece dashboards analíticos, histórico de registros, recursos de acessibilidade e integração futura com Inteligência Artificial.

---

# ❗ Problemática

Atualmente, a equipe pedagógica do SENAI Camaçari enfrenta dificuldades relacionadas ao:

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

# 🏗️ Estrutura do Sistema

## Fluxo Geral

Relatório → Histórico → Dashboard → Indicadores

Todos os módulos do sistema estão conectados para garantir consistência dos dados e atualização das informações.

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
* Senha;
* Função atual.

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
| ✅ Realizado     | Relatório finalizado             |

### Regra de Negócio

Relatórios concluídos podem ser editados por até **24 horas**.

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
* Pesquisa por status;
* Visualização detalhada;
* Edição dentro do prazo de 24 horas.

## Plano Básico

O histórico completo é restrito.

Ao tentar acessar funcionalidades premium, o usuário recebe uma tela de erro **403 - Acesso Negado**.

---

# 🤖 ChatBot Inteligente

Módulo exclusivo para usuários Premium.

## Objetivos

* Auxiliar na elaboração de relatórios;
* Sugerir tratativas;
* Analisar ocorrências registradas.

## Tecnologia Prevista

Integração com API Gemini para implementação de IA baseada em NLP (Processamento de Linguagem Natural).

### Plano Básico

Exibe tela de bloqueio (Erro 403).

### Plano Premium

Liberação completa da funcionalidade.

---

# ⚙️ Configurações

Área destinada às configurações do usuário e do sistema.

## 👤 Perfil

Exibe:

* Nome;
* E-mail;
* Função.

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

* PHP
* MySQL

## Bibliotecas

* Chart.js

## Futuras Integrações

* Gemini API
* IA NLP

---

# 🌿 Estrutura de Branches

## Main

Versão principal do projeto.

## teste-final

Versão utilizada para demonstração do fluxo completo utilizando Local Storage.

---

# 📈 Diferenciais do Projeto

✅ Interface Responsiva

✅ Sistema Full Stack

✅ Dashboard Analítico

✅ Recursos de Acessibilidade

✅ Controle de Histórico

✅ Chatbot Inteligente

✅ Plano Premium

---

# 🎯 Conclusão

O SAGA foi desenvolvido para transformar o processo de registro e monitoramento de relatórios, proporcionando maior organização, rastreabilidade e eficiência para a equipe pedagógica.

Mais do que armazenar informações, o sistema busca oferecer uma solução moderna, acessível e escalável para a gestão institucional.

---

# 📚 Referências

1. **SENAI.** Projeto Integrador 2025/02 4.02 – Sistema de Registro e Monitoramento de Ocorrências Acadêmicas. Plataforma SAGA SENAI de Inovação, Demanda da Indústria n. 11642, 2025.  
   Disponível em: <https://plataforma.gpinovacao.senai.br/plataforma/demandas-da-industria/interna/11642>

2. **REIS, Nubiragina Salasar dos et al.** Neurodiversidade na escola: quebrando barreiras e construindo uma educação inclusiva para todos. Revista Aracê, 2024.  
   Disponível em: <https://doi.org/10.56238/arev6n4-293>
