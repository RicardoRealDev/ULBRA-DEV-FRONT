/* ==========================================================================
   js/derivacao.js — da fonte para a lista visível (E4).

   Uma função pura: recebe o estado e devolve um array NOVO com as tarefas
   que passam na busca e nos filtros, na ordem pedida. Não lê o DOM, não
   escreve no estado e não altera estado.tarefas. Chamada duas vezes com o
   mesmo estado, devolve o mesmo resultado.
   ========================================================================== */

/* Minúsculas e sem acento: "REVISAR", "Revisar" e "revisar" são a mesma
   busca, e "criacao" encontra "criação". */
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/* O prazo chega como "dd/mm/aaaa". Comparar essas strings diretamente
   ordenaria pelo dia ("14/08" viria antes de "20/07"). Remontado como
   aaaammdd, a ordem numérica passa a ser a ordem do calendário. */
function chaveDoPrazo(prazo) {
  const partes = prazo.split("/");
  return Number(partes[2] + partes[1] + partes[0]);
}

const COMPARADORES = {
  "prazo-asc": function (a, b) {
    return chaveDoPrazo(a.prazo) - chaveDoPrazo(b.prazo);
  },
  "prazo-desc": function (a, b) {
    return chaveDoPrazo(b.prazo) - chaveDoPrazo(a.prazo);
  }
};

export function derivarTarefasVisiveis(estado) {
  const termo = normalizar(estado.busca).trim();

  /* Os três critérios são testados juntos, sempre sobre estado.tarefas
     completo — nunca sobre o resultado da interação anterior. Por isso a
     ordem em que os controles foram alterados não muda o resultado. */
  const visiveis = estado.tarefas.filter(function (tarefa) {
    const passaBusca = termo === "" || normalizar(tarefa.titulo).includes(termo);
    const passaStatus = estado.status === "todos" || tarefa.status === estado.status;
    const passaPrioridade = estado.prioridade === "todas" || tarefa.prioridade === estado.prioridade;

    return passaBusca && passaStatus && passaPrioridade;
  });

  const comparar = COMPARADORES[estado.ordenacao];

  if (!comparar) {
    return visiveis;
  }

  /* sort() ordena NO LUGAR: reorganiza o próprio array e devolve ele mesmo.
     Aqui ele atua sobre `visiveis`, o array novo criado pelo filter, e
     nunca sobre estado.tarefas. É por isso que "Ordem do diário" consegue
     voltar à ordem original do JSON. */
  return visiveis.sort(comparar);
}
