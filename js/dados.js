/* ==========================================================================
   js/dados.js — origem dos dados da E2 (aula 5).

   APOSENTADO NA E3. A lista abaixo continua aqui como registro da etapa
   anterior, mas nenhum módulo em execução importa este arquivo: a origem
   dos dados passou a ser dados.json, carregado pela rede em js/api.js.

   Se algum import voltar a apontar para cá, a E3 deixa de cumprir o
   requisito de consumir dados por fetch.
   ========================================================================== */

export const tarefas = [
  {
    id: 1,
    titulo: "Elaborar roteiro de entrevista com o MEI",
    projeto: "Projeto Integrador I — Coleta de Requisitos",
    responsavel: "Ricardo Francisco",
    status: "a-fazer",
    prioridade: "alta",
    prazo: "20/08/2026"
  },
  {
    id: 2,
    titulo: "Modelar diagrama ER do BibliotecaDB",
    projeto: "Banco de Dados Avançado — BibliotecaDB",
    responsavel: "Ricardo Francisco",
    status: "a-fazer",
    prioridade: "media",
    prazo: "22/08/2026"
  },
  {
    id: 3,
    titulo: "Realizar entrevista com o barbeiro (MEI)",
    projeto: "Projeto Integrador I — Coleta de Requisitos",
    responsavel: "Ricardo Francisco",
    status: "em-andamento",
    prioridade: "alta",
    prazo: "18/08/2026"
  },
  {
    id: 4,
    titulo: "Criar tabelas Autor, Livro e Membro no SQL Server",
    projeto: "Banco de Dados Avançado — BibliotecaDB",
    responsavel: "Ricardo Francisco",
    status: "em-andamento",
    prioridade: "media",
    prazo: "19/08/2026"
  },
  {
    id: 5,
    titulo: "Revisar documento de requisitos levantados",
    projeto: "Projeto Integrador I — Coleta de Requisitos",
    responsavel: "Ricardo Francisco",
    status: "em-revisao",
    prioridade: "baixa",
    prazo: "21/08/2026"
  },
  {
    id: 6,
    titulo: "Revisar script de criação da tabela Emprestimo",
    projeto: "Banco de Dados Avançado — BibliotecaDB",
    responsavel: "Ricardo Francisco",
    status: "em-revisao",
    prioridade: "alta",
    prazo: "23/08/2026"
  },
  {
    id: 7,
    titulo: "Definir escopo inicial do projeto com o MEI",
    projeto: "Projeto Integrador I — Coleta de Requisitos",
    responsavel: "Ricardo Francisco",
    status: "concluida",
    prioridade: "media",
    prazo: "15/08/2026"
  },
  {
    id: 8,
    titulo: "Configurar ambiente do SQL Server Express",
    projeto: "Banco de Dados Avançado — BibliotecaDB",
    responsavel: "Ricardo Francisco",
    status: "concluida",
    prioridade: "alta",
    prazo: "14/08/2026"
  }
];
