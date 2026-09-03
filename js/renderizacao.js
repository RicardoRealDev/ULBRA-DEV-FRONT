/* ==========================================================================
   js/renderizacao.js — camada de desenho (aula 5).

   Recebe uma lista de tarefas já pronta e a escreve no DOM. Não faz
   requisição, não conhece fetch, não sabe se os dados vieram de um array
   local ou da rede. É por isso que a troca de origem da E3 não exigiu
   nenhuma alteração aqui.
   ========================================================================== */

const LISTAS_POR_STATUS = {
  "a-fazer": "lista-a-fazer",
  "em-andamento": "lista-em-andamento",
  "em-revisao": "lista-em-revisao",
  "concluida": "lista-concluida"
};

/* Os três Diários de Gravity Falls são os níveis de prioridade. */
const DIARIOS = {
  baixa: { numero: 1, rotulo: "baixa" },
  media: { numero: 2, rotulo: "média" },
  alta: { numero: 3, rotulo: "alta" }
};

function criarParagrafo(classe, texto) {
  const paragrafo = document.createElement("p");
  paragrafo.className = classe;
  paragrafo.textContent = texto;
  return paragrafo;
}

function criarCartao(tarefa) {
  const diario = DIARIOS[tarefa.prioridade];
  const tituloId = "tarefa-" + tarefa.id + "-titulo";

  const artigo = document.createElement("article");
  artigo.className = "tarefa tarefa--d" + diario.numero;
  artigo.setAttribute("aria-labelledby", tituloId);

  const titulo = document.createElement("h4");
  titulo.id = tituloId;
  titulo.textContent = tarefa.titulo;
  artigo.appendChild(titulo);

  artigo.appendChild(criarParagrafo("projeto", "Projeto: " + tarefa.projeto));

  const responsavel = criarParagrafo("responsavel", "Responsável: ");
  const nome = document.createElement("span");
  nome.textContent = tarefa.responsavel;
  responsavel.appendChild(nome);
  artigo.appendChild(responsavel);

  artigo.appendChild(criarParagrafo("prazo", "Prazo: " + tarefa.prazo));
  artigo.appendChild(criarParagrafo(
    "prioridade",
    "Diário " + diario.numero + " · Prioridade " + diario.rotulo
  ));

  return artigo;
}

export function renderizarTarefas(tarefas) {
  Object.values(LISTAS_POR_STATUS).forEach(function (id) {
    document.getElementById(id).replaceChildren();
  });

  tarefas.forEach(function (tarefa) {
    const item = document.createElement("li");
    item.appendChild(criarCartao(tarefa));
    document.getElementById(LISTAS_POR_STATUS[tarefa.status]).appendChild(item);
  });
}
