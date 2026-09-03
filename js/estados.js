/* ==========================================================================
   js/estados.js — as quatro telas (E3).

   Decide qual estado está valendo e anuncia a mudança na região viva.
   Não faz requisição e não sabe o que é fetch. Recebe o estado já decidido
   por quem chamou, junto com o dado que aquele estado precisa.

   renderizarEstado("carregando")
   renderizarEstado("sucesso", tarefas)   -> array de tarefas
   renderizarEstado("vazio")
   renderizarEstado("erro", mensagem)     -> texto já formatado
   ========================================================================== */

import { renderizarTarefas } from "./renderizacao.js";

const TELAS = ["carregando", "sucesso", "vazio", "erro"];

function mostrarApenas(estado) {
  TELAS.forEach(function (nome) {
    document.getElementById("tela-" + nome).hidden = nome !== estado;
  });
}

/* A região já existe e está vazia no HTML desde o início do documento.
   Só o texto muda — é a mudança de conteúdo que o leitor de tela anuncia. */
function anunciar(texto) {
  document.getElementById("regiao-status").textContent = texto;
}

export function renderizarEstado(estado, dados) {
  mostrarApenas(estado);

  if (estado === "carregando") {
    anunciar("Decifrando o diário. Carregando as tarefas.");
    return;
  }

  if (estado === "sucesso") {
    renderizarTarefas(dados);
    anunciar(dados.length === 1
      ? "1 tarefa carregada."
      : dados.length + " tarefas carregadas.");
    return;
  }

  if (estado === "vazio") {
    anunciar("Nenhuma tarefa registrada no diário.");
    return;
  }

  if (estado === "erro") {
    document.getElementById("mensagem-erro").textContent = dados;
    anunciar(dados);
  }
}
