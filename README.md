# PROJETO SAGA

## Componentes da equipe
- Daniel Richard
- Eloah Veiga
- João Pedro Fagundes Ernesto
- Luca Mendes
- Mateus Chaves


## Introdução

abacaxi

## Problemática

Atualmente, a equipe pedagógica do SENAI Camaçari enfrenta dificuldades no registro do comportamento e desempenho dos alunos, principalmente devido à falta de uma ferramenta para o registro das ocorrências. Em muitos casos, os registros ficam descentralizados ou limitados a anotações individuais, dificultando o acompanhamento pelos responsáveis e pela própria instituição. Com a ausência de um sistema que integre essas informações, cada professor tem uma visão limitada do aluno, muitas vezes resultando em falta de comunicação sobre o que está acontecendo nas outras disciplinas. (SAGA SENAI, 2025). 
A questão se agrava ainda mais, uma vez que o fluxo de informações é sobrecarregado, levando em consideração o método utilizado por cada instituição acadêmica. Isso pode acarretar na falta de inclusão, adaptação e interesse dos alunos, além de aumentar as chances de reprovação e evasão escolar.
O nosso sistema visa solucionar esses problemas por meio de uma plataforma que permite não apenas registrar ocorrências, mas também identificar suas possíveis causas e sugerir ações corretivas. O objetivo final é estabelecer um ecossistema justo e equilibrado no ambiente escolar. 

## Solução

Construímos um site de cunho educacional, buscando maior eficiência de registros de alunos, sobretudo os neurodivergentes, identificação precoce de dificuldades e transtornos — tendo uma IA utilizada para gerar recomendações — colaboração entre docentes e suporte pedagógico, melhorando a sua atuação em seu ambiente de trabalho.

Planejamos fornecer um suporte digital para profissionais da coordenação escolar e professores a fim de melhorar a comunicação entre esses profissionais, visto que muitos textos de relatoria são escritos e compartilhados de forma imprática — ou seja, de forma manual e trabalhosa, exigindo mais tempo e um gasto de energia maior. O nosso projeto visa exatamente trazer uma ferramenta que dispunha a capacidade de solucionar e/ou resolver as situações escolares de forma mais simples e prática.


## Funcionalidades

Aqui estão descritas as funcionalidades do nosso projeto. Assim como, suas respectivas funções para cada visão presente: professores/adm, alunos e responsáveis.


Páginas do Projeto SAGA 

*Página de Login:* Terá um ícone inicial como uma foto de perfil vazia. Logo abaixo,temos 2 campos: e-mail e senha e uma opção centralizada para lembrar a senha.

*Página de Cadastro Adm:* Campos: e-mail, senha, nome completo e função atual.

## Páginas do SAGA: 

*Pg de Relatório:* Nesta seção, terá um botão com a opção de “Novo Relatório” para adicionar um relatório com base nos dados da planilha (aguardando). Também teremos 2 seções logo embaixo do botão para mostrar os relatórios que estão em andamento e para fazer. OBS: todo relatório incompleto deve ser marcado com a opção “em andamento”. Quando esses relatórios (seja ele em andamento ou a fazer) aparecerem na tela, será possível editá-los para mudar o seu status. Porém, os relatórios que forem marcados com a opção de “Realizado” terão um tempo máximo de edição de 24 horas, logo após esse tempo, não será possível editar novamente. 

*Pg de Dashboard:* A página de Dashboard deve conter áreas de gráficos (formatados através do JavaScript) acerca do andamento de ocorrências (por exemplo: em andamento, concluídas, etc) e será atualizada constantemente para manter os dados uniformes e válidos. Acerca da seção de relatório, a página de dashboard se relaciona através do registro de relatórios atrelados a sua respectiva página, e exibirá-os nos gráficos anteriormente mencionados. A página de dashboard possui objetivo principal relacionar prazos e exibir o progresso dos mesmos.

*Pg de Histórico:* Essa seção está ligada ao relatório, onde vai ter os relatórios armazenados. Também terá a opção de busca por status (concluído, em andamento, a fazer), além de poder editar textos já concluídos, mas com um limite de tempo de 24 horas.

*Pg do Chatbot:* Esta seção irá conter a conversa com o chatbot, contendo a caixa de input para o usuário digitar e realizar a interação direta. A IA consegue produzir templates de ocorrências, analisar ocorrências atualmente realizadas e sugestões de melhoria ou tratativas para determinado problema. Esta funcionalidade está apenas disponível para assinantes premium.

*Pg de Configurações:* Sessão do site com opções de mudança na aparência do site, mudando entre a versão clara (padrão), modo escuro e o modo alto contraste, para pessoas com dificuldades visuais. O site também tem um switch de audiodescrição (ainda precisamos ver como fazer) para pessoas cegas se movimentarem no site de maneira mais fácil.

Codificação

## Páginas de Login e Cadastro:

A interface de autenticação de login e cadastro do SAGA foi baseada no conceito de Glassmorphism (efeito de vidro fosco). O layout é centralizado em container principal dividido em dois painéis:

Painel Esquerdo:  Uma div de camada translúcida com texto informativo e de boas-vindas ao usuário;

Painel Direito: Uma caixa section sólida que comporta o formulário, contendo:

​Controle de Tema: Botão (#troca) preparado para mudar entre modos claro e escuro;

​Avatar do Usuário: Indicador de perfil;

​Formulário de Autenticação:
Blocos dentro da seção para capturar os dados, acompanhados de ícones descritivos (.input-icon)).

Todas as cores foram gerenciadas via variáveis CSS no escopo global para facilitar futuras manutenções, e as regras de comportamento e validação lógica ficam sob responsabilidade exclusiva do script externo login.js e cadastro.js.

## Páginas de Configurações Globais:


Como temos 5 páginas em comum, nós decidimos criar um CSS global que será chamado em todas as páginas, além de uma estrutura HTML básica, conectada e inserida em cada uma das páginas. Nós utilizamos um header para o cabeçalho principal da página; no centro dele, temos o logo do nosso site e, no canto direito, um ícone de usuário (usando position: absolute) com um hiperlink escondido para a tela de configurações, facilitando assim a versão mobile. Para todos os componentes em geral (header, nav e main) usamos um layout grid para organizá-los. Veja abaixo:

grid-template-columns


↓

210px | 1fr

grid-template-rows

↓

100px | 1fr

grid-template-areas

↓

“header header” “sidebar main”

↓

**A sidebar esta à esquerda da main, no topo das duas está a header**

Também temos uma sidebar com os links das páginas, todos com animações suaves feitas por keyframes (usando opacity e translateX) e hovers.


Telas Utilizadas no Projeto SAGA e suas Funcionalidades:

## Página de Relatório:

A página de relatoria tem a barra superior comum contendo a logo centralizada e o ícone de usuário à direita. Na parte extrema esquerda principal da tela, abaixo dessa barra superior está a barra de navegação lateral com diferentes botões de acesso a outras páginas. Na seção em enfoque do site está a parte onde os relatórios feitos, em pendência e finalizados estão, esses relatórios podem ser criados ao clicar no botão na parte superior direita, onde um modal pequeno se abre para selecionar qual tipo de relatório será feito.

## Página de Dashboard:

A página de Dashboard exige a aplicação da biblioteca “chart” do JavaScript para a criação de gráficos, relacionando-se com os dados de quantidade de relatórios elaborados. Conforme os dados são depositados e relacionados à seção de dashboard, os gráficos serão atualizados com os novos valores apresentados, de forma simples e fácil.

Para o primeiro gráfico, definiu-se, primeiramente, no CSS, a estilização do container o qual irá armazenar os gráficos. Todos os containers possuem posição e tamanho igualitário. Dentro do primeiro container, foi inserido um gráfico utilizando a função chart no JavaScript, do tipo “pie” (ou seja, gráfico de setores). Dentro do segundo container, inseriu-se utilizando o mesmo processo de codificação, entretanto utilizando o tipo “bar” (gráfico de colunas).

Além dos gráficos, possui-se — também — uma seção de filtragem de conteúdo, sendo eles: filtragem por data de início e término, tipo do curso

## Página de Histórico:

A página de Histórico no plano básico possui uma composição padrão como as outras páginas no quesito de estilização, por conta do global.css o html “Histórico Básico.html” possui lincagem com dois css sendo um deles o global e o outro histórico-basico.css. A estrutura em Html abrange um texto <h1>,  um ícone <img…> e um <p> com <a href> onde o texto informa “Salvando apenas os últimos 30 dias. Para acessar o Histórico completo, “clique aqui ” e quando tocado no link abrirá uma tela de erro 403 que impede o usuário de acessar a opção por ser uma ferramenta exclusiva do plano premium.

O erro 403 foi estruturado em css e DOM (JS) onde no css dele possui configurações mantidas no arquivo “Histórico-basico.css” contendo o mantimento de posição de cor e elementos da mensagem de erro.

## Página de ChatBot:

O chatbot é uma funcionalidade a parte do site, ele possui um comportamento que difere conforme o plano que o usuário está acessando, para isso, criamos dois htmls no qual um representa o plano básico onde o usuário não tem acesso, limitado à apenas uma tela semelhante ao  erro 403 (sem permissão para acesso). Enquanto que o segundo html se trata do plano premium onde o usuário consegue manter uma conversa com o chatbot e suas funções padrão bem estruturadas com o JS.

O código em css guarda elementos de posição adicionais (pois o html do chatbot também se conecta ao arquivo global.css) sendo eles partes da composição da tela de erro enquanto escondido e a página não está carregada.

## Página de Configurações:

Nela temos um layout flex com 4 sections dentro dela: um para o perfil do usuário; outro para acessibilidade; outro para fale conosco e outro para cadastrar novos usuários. Cada um deles tem suas especificidades: 

Perfil: Exibe o nome, e-mail e função do usuário logado no sistema.

Acessibilidade: Possui 3 opções para acionar/desativar a audiodescrição, alto contraste e dark mode.

Fale Conosco: Um botão para copiar o e-mail e uma mensagem oculta se ele for copiado com sucesso.

Cadastrar Novo Usuário: Um botão que leva a página de cadastro. Esta página só pode ser acessada se o usuário estiver logado (lembre disso quando configurar o back-end).

## Página de Cadastro:

## Conclusão

abacaxi
