# Diário de Campo — Painel de Tarefas Acadêmicas

Gerenciador de tarefas acadêmicas feito com HTML, CSS e JavaScript puro (módulos ES), sem framework e sem build, ambientado em *Gravity Falls*. Trabalho individual de Desenvolvimento Frontend, ULBRA, 2026.2.

**Versão publicada:** [https://ricardorealdev.github.io/ULBRA-DEV-FRONT/](https://ricardorealdev.github.io/ULBRA-DEV-FRONT/)

## O que a aplicação faz

- Carrega as tarefas de `dados.json` com `fetch`. Cada situação tem uma tela própria: carregando, erro, origem vazia, nenhum resultado e quadro.
- Busca por título a cada tecla, sem diferenciar maiúsculas de minúsculas nem letras acentuadas.
- Filtra por status (com a opção "Todos") e por prioridade (com a opção "Todas"). Os filtros podem ser combinados em qualquer ordem.
- Ordena por prazo, do mais próximo ou do mais distante, ou mantém a ordem original do diário.
- "Limpar filtros" devolve busca, filtros e ordenação aos valores iniciais.
- Uma região `role="status"` anuncia "N de M tarefas" a cada mudança, sem mover o foco do teclado.
- Cada cartão tem um botão "Ver detalhes", tratado por delegação de eventos.

## Como rodar localmente

Abrir o `index.html` direto do disco (`file://`) não funciona: o navegador bloqueia `fetch` e módulos fora de um servidor. Na pasta do projeto:

```bash
python -m http.server 5500
```

Depois, abra http://localhost:5500. A extensão Live Server do VS Code também funciona.

## Estrutura

| Arquivo | Responsabilidade |
| --- | --- |
| `index.html` | Estrutura, controles, telas de estado e a região `role="status"`, que já existe no HTML |
| `styles.css` | Tema e responsividade |
| `dados.json` | Origem dos dados |
| `js/api.js` | `carregarTarefas()`: busca e valida o JSON. Não lê os controles nem mexe no DOM |
| `js/estado.js` | O objeto `estado`, fonte única da verdade, e `CRITERIOS_INICIAIS` |
| `js/derivacao.js` | `derivarTarefasVisiveis(estado)`: função pura que aplica busca, filtros e ordenação |
| `js/tela.js` | `renderizar(estado)`: ponto único de renderização |
| `js/renderizacao.js` | `renderizarTarefas(array)`: desenha os cartões recebidos |
| `js/main.js` | Ouvintes e inicialização. É o único arquivo que escreve no estado |
| `js/enfeites.js` | Camada decorativa, fora do fluxo de dados |
| `js/dados.js` | Origem de dados da E2, aposentada (nenhum módulo a importa) |

## Fluxo de dados

```
evento → estado → derivação → renderização
```

1. Um ouvinte (`input`, `change` ou `click`) altera um campo de `estado`.
2. O mesmo ouvinte chama `renderizar(estado)`, que é sempre o mesmo ponto de entrada.
3. `renderizar` sincroniza os controles com o estado, escolhe a tela e chama `derivarTarefasVisiveis(estado)` uma única vez.
4. O array derivado alimenta os cartões e a contagem. Por isso os dois nunca discordam.

### Decisões por trás do fluxo

- **A lista filtrada não fica guardada no estado.** Ela é recalculada a cada renderização a partir de `estado.tarefas` e dos critérios. Uma lista filtrada salva seria uma segunda fonte de verdade, que ficaria desatualizada assim que um critério mudasse. Os filtros também passariam a atuar sobre o resultado anterior, e a ordem dos cliques mudaria o resultado.
- **`sort()` ordena o próprio array.** Ele reorganiza o array e devolve esse mesmo array, sem criar uma cópia. Por isso a ordenação atua sobre o array novo que `filter()` cria, e nunca sobre `estado.tarefas`. É assim que "Ordem do diário" consegue voltar à ordem original.
- **O prazo é convertido antes de comparar.** A string `"dd/mm/aaaa"` ordenaria pelo dia. Ela vira o número `aaaammdd`, cuja ordem é a do calendário.
- **Zero resultados não é erro.** O servidor respondeu e os dados são válidos: só nenhuma tarefa atende aos critérios. Isso é decidido pelo tamanho da lista derivada. O `catch` recebe apenas falhas de obtenção dos dados (rede, status HTTP, JSON inválido), e a renderização fica fora do `try`.
- **Evento delegado nos cartões.** Os cartões são recriados a cada renderização, mas o quadro (`#tela-sucesso`) não. Um único ouvinte, instalado uma vez no quadro, atende os botões de qualquer leva de cartões, sem se perder e sem se multiplicar.

### Por que o local pode funcionar e o publicado dar 404

O GitHub Pages serve o projeto em um subcaminho (`/ULBRA-DEV-FRONT/`) e diferencia maiúsculas de minúsculas nos nomes de arquivo. Um caminho absoluto como `fetch("/dados.json")` apontaria para a raiz do domínio, fora do projeto. Um `import "./Api.js"` funcionaria no Windows e quebraria no servidor. Por isso todos os caminhos são relativos (`dados.json`, `./api.js`, `img/...`) e escritos exatamente como os nomes dos arquivos.

## Publicação

GitHub Pages, a partir da branch `master`, pasta `/ (root)`.
