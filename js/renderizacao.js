/* ==========================================================================
   js/renderizacao.js — camada de desenho (aula 5).

   Recebe uma lista de tarefas já pronta e a escreve no DOM. Não faz
   requisição, não conhece fetch, não sabe se os dados vieram de um array
   local ou da rede. É por isso que a troca de origem da E3 não exigiu
   nenhuma alteração aqui.

   Também não sabe filtrar nem ordenar (E4): recebe a lista já derivada
   por js/derivacao.js e desenha exatamente o que recebeu, na ordem recebida.
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
  /* Na E4 esta função roda a cada tecla e a cada filtro. Esvaziar as listas
     antes de desenhar é o que impede os cartões de se acumularem: cada
     renderização substitui a anterior por inteiro. */
  Object.values(LISTAS_POR_STATUS).forEach(function (id) {
    document.getElementById(id).replaceChildren();
  });

  tarefas.forEach(function (tarefa) {
    const item = document.createElement("li");
    item.appendChild(criarCartao(tarefa));
    document.getElementById(LISTAS_POR_STATUS[tarefa.status]).appendChild(item);
  });

  /* Coluna sem nenhum cartão sai do quadro: com o filtro "Em revisão", três
     títulos sobre listas vazias só atrapalhariam a leitura. A decisão vale
     para o array recebido, e é refeita inteira a cada renderização. */
  Object.values(LISTAS_POR_STATUS).forEach(function (id) {
    const lista = document.getElementById(id);
    lista.closest(".coluna").hidden = lista.children.length === 0;
  });
}
