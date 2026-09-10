/* ==========================================================================
   js/tela.js — o ponto único de renderização (E4).

   renderizar(estado) é chamada depois de QUALQUER mudança no estado: início
   e fim do carregamento, digitação na busca, troca de filtro, ordenação ou
   limpeza. A tela é uma projeção do estado; esta função é a projeção.

   A cada chamada ela:
   1. devolve aos controles os valores do estado;
   2. escolhe a tela (carregando, erro, origem vazia, sem resultados, quadro);
   3. deriva a lista visível UMA vez e usa esse mesmo array para os cartões
      e para a contagem "N de M tarefas".

   Não faz requisição, não altera o estado e não lê cartões do DOM.
   ========================================================================== */

import { derivarTarefasVisiveis } from "./derivacao.js";
import { renderizarTarefas } from "./renderizacao.js";

const TELAS = ["carregando", "sucesso", "vazio", "sem-resultados", "erro"];

function mostrarApenas(tela) {
  TELAS.forEach(function (nome) {
    document.getElementById("tela-" + nome).hidden = nome !== tela;
  });
}

/* A região já existe e está vazia no HTML desde o início do documento.
   Só o texto muda — é a mudança de conteúdo que o leitor de tela anuncia.
   Escrever o mesmo texto de novo não acrescenta nada e pode repetir o
   anúncio em alguns leitores, então só escreve quando mudou. */
function anunciar(texto) {
  const regiao = document.getElementById("regiao-status");

  if (regiao.textContent !== texto) {
    regiao.textContent = texto;
  }
}

/* O estado manda nos campos, e não o contrário. É isto que faz "Limpar
   filtros" restaurar a tela e os controles juntos. Nada aqui chama focus():
   o foco do teclado fica onde a pessoa o deixou. */
function sincronizarControles(estado) {
  const campoBusca = document.getElementById("busca-titulo");

  /* Só reescreve quando difere: atribuir value ao campo em que a pessoa está
     digitando poderia mandar o cursor de texto para o fim. */
  if (campoBusca.value !== estado.busca) {
    campoBusca.value = estado.busca;
  }

  /* Atribuir o value de um grupo de radios marca a opção correspondente. */
  const campos = document.getElementById("form-filtros").elements;
  campos["filtro-status"].value = estado.status;
  campos["filtro-prioridade"].value = estado.prioridade;
  campos["ordenacao"].value = estado.ordenacao;
}

export function renderizar(estado) {
  sincronizarControles(estado);

  if (estado.carregamento === "carregando") {
    mostrarApenas("carregando");
    anunciar("Decifrando o diário. Carregando as tarefas.");
    return;
  }

  if (estado.carregamento === "erro") {
    document.getElementById("mensagem-erro").textContent = estado.erro;
    mostrarApenas("erro");
    anunciar(estado.erro);
    return;
  }

  /* Daqui para baixo o carregamento deu certo. Os dois vazios a seguir são
     caminhos de sucesso, decididos pelo tamanho de um array — nunca no catch. */
  const total = estado.tarefas.length;

  if (total === 0) {
    renderizarTarefas([]);
    mostrarApenas("vazio");
    anunciar("Nenhuma tarefa registrada no diário.");
    return;
  }

  /* A derivação acontece uma única vez por ciclo. O mesmo array alimenta
     os cartões e a contagem, então os dois nunca discordam. */
  const visiveis = derivarTarefasVisiveis(estado);

  renderizarTarefas(visiveis);

  if (visiveis.length === 0) {
    mostrarApenas("sem-resultados");
    anunciar("0 de " + total + " tarefas. Nenhuma tarefa corresponde à busca e aos filtros atuais.");
    return;
  }

  mostrarApenas("sucesso");
  anunciar(visiveis.length + " de " + total + " tarefas.");
}
