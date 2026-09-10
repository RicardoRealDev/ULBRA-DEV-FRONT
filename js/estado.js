/* ==========================================================================
   js/estado.js — a fonte única da verdade (E4).

   Tudo o que a tela mostra sai deste objeto. Os controles escrevem aqui;
   a renderização só lê daqui. Nenhuma outra variável da aplicação guarda
   tarefas, critérios ou a situação do carregamento.

   Não existe "tarefasFiltradas" neste objeto, de propósito. A lista visível
   é recalculada a cada renderização a partir de tarefas + critérios. Se ela
   fosse guardada, haveria uma segunda cópia das tarefas que poderia ficar
   para trás quando um critério mudasse — duas fontes de verdade.
   ========================================================================== */

/* Valores iniciais dos critérios. O HTML nasce com estes mesmos valores
   marcados, e "Limpar filtros" devolve o estado exatamente para cá. */
export const CRITERIOS_INICIAIS = Object.freeze({
  busca: "",
  status: "todos",
  prioridade: "todas",
  ordenacao: "original"
});

export const estado = {
  /* O array exatamente como veio de carregarTarefas(). Nunca é filtrado,
     ordenado ou reatribuído depois do carregamento. */
  tarefas: [],

  busca: CRITERIOS_INICIAIS.busca,
  status: CRITERIOS_INICIAIS.status,
  prioridade: CRITERIOS_INICIAIS.prioridade,
  ordenacao: CRITERIOS_INICIAIS.ordenacao,

  /* "carregando" | "sucesso" | "erro". Os dois vazios (origem sem tarefas e
     nenhum resultado para os critérios) não aparecem aqui: são sucesso, e
     a renderização os distingue pelo tamanho dos arrays. */
  carregamento: "carregando",

  /* Mensagem pronta para o usuário quando carregamento === "erro". */
  erro: null
};
