/* ==========================================================================
   js/main.js — inicialização (E3).

   Amarra as duas camadas: pede os dados a api.js e entrega o resultado a
   estados.js. É o único lugar que conhece as duas pontas, e é onde o erro
   vira texto para o usuário.
   ========================================================================== */

import { carregarTarefas } from "./api.js";
import { renderizarEstado } from "./estados.js";

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

async function iniciar() {
  /* Antes do await, não depois: sem isto a tela fica em branco durante
     toda a espera da rede. */
  renderizarEstado("carregando");

  try {
    const tarefas = await carregarTarefas();

    /* Vazio é um caminho de sucesso, não uma falha. Por isso é decidido
       aqui, e não no catch: o servidor respondeu certo, a lista é que
       não tem itens. */
    if (tarefas.length === 0) {
      renderizarEstado("vazio");
      return;
    }

    renderizarEstado("sucesso", tarefas);
  } catch (erro) {
    console.error(erro);
    renderizarEstado("erro", mensagemDeErro(erro));
  }
}

/* Módulos são adiados por padrão, então o HTML já foi lido quando esta
   linha roda. A chamada fica dentro de uma função: nenhum await solto no
   topo do arquivo. */
iniciar();
