/* ==========================================================================
   js/enfeites.js — camada decorativa.

   Não participa do fluxo de dados da E3. Não importa api.js, não importa
   estados.js e não é importado por eles. Se este arquivo for removido, o
   quadro continua buscando o JSON e desenhando os cartões exatamente igual;
   a página só fica parada.
   ========================================================================== */

const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Bills flutuantes: seguem o ponteiro e piscam ---------- */

const POSICOES = [
  { top: "12%", left: "3%" },
  { top: "11%", right: "3%" },
  { top: "46%", left: "1.5%" },
  { top: "50%", right: "1.5%" },
  { top: "84%", left: "5%" },
  { top: "88%", right: "5%" }
];

function criarBills() {
  const bills = [];

  POSICOES.forEach(function (posicao, indice) {
    const bill = document.createElement("div");
    bill.className = "olho-flutuante";
    Object.keys(posicao).forEach(function (lado) {
      bill.style[lado] = posicao[lado];
    });

    /* Cada um pisca no seu tempo. Piscando junto, entrega que é um laço só
       — e seis triângulos sincronizados parecem um relógio, não criaturas. */
    bill.style.setProperty("--atraso-piscada", (indice * 0.87).toFixed(2) + "s");
    bill.style.setProperty("--ritmo-piscada", (5 + indice * 0.4).toFixed(1) + "s");

    const pupila = document.createElement("div");
    pupila.className = "pupila-flutuante";
    bill.appendChild(pupila);

    document.body.appendChild(bill);
    bills.push({ elemento: bill, pupila: pupila });
  });

  document.addEventListener("mousemove", function (evento) {
    bills.forEach(function (item) {
      const area = item.elemento.getBoundingClientRect();
      const angulo = Math.atan2(
        evento.clientY - (area.top + area.height / 2),
        evento.clientX - (area.left + area.width / 2)
      );
      const raio = area.width * 0.14;
      item.pupila.style.transform =
        "translate(" + (Math.cos(angulo) * raio).toFixed(1) + "px, " +
        (Math.sin(angulo) * raio).toFixed(1) + "px)";
    });
  });
}

/* ---------- Revelação conforme a página rola ---------- */

function prepararRevelacao() {
  /* A classe só entra quando há JavaScript e IntersectionObserver. Sem ela,
     o CSS não esconde nada: se o script falhar, a página aparece inteira em
     vez de ficar em branco. */
  document.documentElement.classList.add("js-anim");

  const observador = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (entrada) {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add("revelado");
      observador.unobserve(entrada.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });

  function observar(elemento, atraso) {
    if (!elemento || elemento.dataset.revelando) return;
    elemento.dataset.revelando = "1";
    if (atraso) elemento.style.transitionDelay = atraso + "ms";
    observador.observe(elemento);
  }

  document.querySelectorAll(".revela").forEach(function (elemento) {
    observar(elemento);
  });

  /* Os cartões só existem depois que main.js recebe o JSON. Em vez de
     acoplar as duas coisas — e obrigar renderizacao.js a saber que existe
     animação — este vigia espera os <li> aparecerem por conta própria. */
  /* Na E4 o quadro é redesenhado a cada tecla na busca e a cada filtro.
     Só a primeira leva de cartões entra com animação; as seguintes já
     nascem reveladas, senão o quadro inteiro piscaria enquanto se digita. */
  let primeiraLeva = true;

  const vigia = new MutationObserver(function (mutacoes) {
    let chegouCartao = false;

    mutacoes.forEach(function (mutacao) {
      mutacao.addedNodes.forEach(function (no) {
        if (no.nodeType !== 1 || no.tagName !== "LI") return;
        chegouCartao = true;

        const coluna = no.closest(".coluna");
        if (coluna) observar(coluna.querySelector("h3"));

        if (!primeiraLeva) {
          no.classList.add("revelado");
          return;
        }

        const irmaos = no.parentNode.children;
        const indice = Array.prototype.indexOf.call(irmaos, no);
        observar(no, indice * 70);
      });
    });

    if (chegouCartao) primeiraLeva = false;
  });

  document.querySelectorAll(".coluna ul").forEach(function (lista) {
    vigia.observe(lista, { childList: true });
  });
}

if (!menosMovimento) {
  criarBills();

  if ("IntersectionObserver" in window && "MutationObserver" in window) {
    prepararRevelacao();
  }
}
