/* ==========================================================================
   js/api.js — camada de dados (E3).

   Busca, verifica e devolve o array de tarefas. Não cria elementos, não lê
   nem escreve no DOM, não decide o que aparece na tela. Quem chama é quem
   trata o erro.
   ========================================================================== */

const CAMINHO_DADOS = "dados.json";

/* Falha de protocolo: a resposta chegou, mas com um status que não serve.
   Recebe um nome próprio para que o catch consiga separá-la de TypeError
   (rede) e SyntaxError (formato) olhando apenas erro.name. */
export class ErroDeProtocolo extends Error {
  constructor(status) {
    super("O servidor respondeu com status " + status + ".");
    this.name = "ErroDeProtocolo";
    this.status = status;
  }
}

export async function carregarTarefas() {
  /* Primeira espera: os cabeçalhos da resposta chegaram. O corpo ainda não. */
  const resposta = await fetch(CAMINHO_DADOS);

  /* fetch só rejeita quando a requisição não sai do lugar. Um 404 é uma
     resposta bem-sucedida do ponto de vista da rede, então precisa ser
     verificado à mão — antes de tentar ler o corpo. */
  if (!resposta.ok) {
    throw new ErroDeProtocolo(resposta.status);
  }

  /* Segunda espera: o corpo terminou de baixar e foi convertido em objeto.
     É aqui que um arquivo malformado lança SyntaxError. */
  const corpo = await resposta.json();

  /* O JSON é válido mas pode não ter o formato combinado. Sem esta
     verificação, um corpo fora do contrato viraria um TypeError lá na
     frente e seria relatado ao usuário como falha de rede. */
  if (!Array.isArray(corpo.tarefas)) {
    throw new SyntaxError('O JSON não traz a chave "tarefas" com uma lista.');
  }

  return corpo.tarefas;
}
