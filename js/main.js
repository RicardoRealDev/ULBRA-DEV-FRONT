/* ==========================================================================
   js/main.js — inicialização e ouvintes (E4).

   É o único lugar que escreve no estado. Cada ouvinte dos controles faz só
   duas coisas: altera o estado e chama renderizar(estado). Nenhum deles
   filtra, ordena ou esconde cartões — isso é trabalho da derivação, dentro
   da renderização.

     evento → estado → derivação → renderização
   ========================================================================== */

import { carregarTarefas } from "./api.js";
import { estado, CRITERIOS_INICIAIS } from "./estado.js";
import { renderizar } from "./tela.js";
import { alternarDetalhes } from "./renderizacao.js";

/* Cada tipo de falha ganha um texto próprio, separado por erro.name:
   - TypeError ......... a requisição não saiu do lugar (rede, offline, CORS)
   - ErroDeProtocolo ... a resposta chegou com status ruim (404, 500)
   - SyntaxError ....... o corpo chegou mas não é o JSON esperado */
function mensagemDeErro(erro) {
  if (erro.name === "TypeError") {
    return "Não foi possível alcançar o servidor. Verifique sua conexão e tente novamente.";
  }

  if (erro.name === "ErroDeProtocolo") {
    return "O servidor respondeu " + erro.status + " e não entregou o arquivo de tarefas.";
  }

  if (erro.name === "SyntaxError") {
    return "O arquivo de tarefas chegou, mas está fora do formato JSON esperado.";
  }

  return "Algo inesperado interrompeu o carregamento das tarefas.";
}

/* Os ouvintes são instalados uma única vez, na inicialização. Os controles
   nunca são recriados, então não há o que reinstalar a cada renderização. */
function ligarControles() {
  document.getElementById("busca-titulo").addEventListener("input", function (evento) {
    estado.busca = evento.target.value;
    renderizar(estado);
  });

  /* Os radios disparam change e o evento sobe até o fieldset: um ouvinte
     por grupo em vez de um por opção. */
  document.getElementById("filtro-status").addEventListener("change", function (evento) {
    estado.status = evento.target.value;
    renderizar(estado);
  });

  document.getElementById("filtro-prioridade").addEventListener("change", function (evento) {
    estado.prioridade = evento.target.value;
    renderizar(estado);
  });

  document.getElementById("ordenacao").addEventListener("change", function (evento) {
    estado.ordenacao = evento.target.value;
    renderizar(estado);
  });

  /* Limpar mexe só no estado. Os campos voltam aos valores iniciais porque
     a renderização os sincroniza a partir do estado — e não por um
     form.reset(), que mudaria os controles sem avisar o estado. */
  document.getElementById("limpar-filtros").addEventListener("click", function () {
    Object.assign(estado, CRITERIOS_INICIAIS);
    renderizar(estado);
  });

  /* Enter no campo de busca enviaria o formulário e recarregaria a página.
     Não há nada a "aplicar": os critérios já valem enquanto se digita. */
  document.getElementById("form-filtros").addEventListener("submit", function (evento) {
    evento.preventDefault();
  });

  /* Delegação: um único ouvinte no quadro, instalado uma vez. Os cartões
     são destruídos e recriados a cada renderização, mas #tela-sucesso não —
     o clique no botão de um cartão novo sobe até aqui do mesmo jeito. Se o
     ouvinte fosse posto em cada botão dentro da renderização, os cartões
     novos só funcionariam se ele fosse reinstalado a cada vez. */
  document.getElementById("tela-sucesso").addEventListener("click", function (evento) {
    const botao = evento.target.closest('[data-acao="alternar-detalhes"]');

    if (botao) {
      alternarDetalhes(botao);
    }
  });
}

async function iniciar() {
  /* Antes do await, não depois: sem isto a tela fica em branco durante
     toda a espera da rede. */
  estado.carregamento = "carregando";
  estado.erro = null;
  renderizar(estado);

  try {
    estado.tarefas = await carregarTarefas();
    estado.carregamento = "sucesso";
  } catch (erro) {
    console.error(erro);
    estado.carregamento = "erro";
    estado.erro = mensagemDeErro(erro);
  }

  /* A renderização fica fora do try. Assim o catch só recebe falhas de
     obtenção dos dados — um defeito ao desenhar não seria relatado como
     "servidor fora do ar", e zero resultados nunca passa por aqui. */
  renderizar(estado);
}

/* Módulos não criam variáveis globais, então `estado` não seria alcançável
   pelo DevTools > Console. Esta linha existe só para inspeção manual;
   nenhum código da aplicação lê window.estado. */
window.estado = estado;

ligarControles();
iniciar();
