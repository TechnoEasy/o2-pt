const STORAGE_KEY = "o2-mvp-dados";

const estadoInicial = {
  circulos: [
    {
      id: crypto.randomUUID(),
      nome: "Círculo Geral",
      proposito: "Garantir a evolução contínua da organização",
    },
  ],
  papeis: [
    {
      id: crypto.randomUUID(),
      nome: "Guia",
      circuloId: null,
      responsabilidades: [
        "Assegurar que o círculo esteja alinhado ao propósito maior",
        "Convocar ajustes de estrutura quando necessário",
      ],
      artefatos: ["Backlog de tensões estratégicas"],
      parceira: "Ana",
    },
  ],
  tensoes: [],
  agenda: [],
  decisoes: [],
};

function carregarEstado() {
  try {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (!salvo) {
      return estadoInicial;
    }
    const dados = JSON.parse(salvo);
    return {
      ...estadoInicial,
      ...dados,
      circulos: dados.circulos?.length ? dados.circulos : estadoInicial.circulos,
      papeis: dados.papeis?.length ? dados.papeis : estadoInicial.papeis,
    };
  } catch (erro) {
    console.error("Falha ao carregar dados: ", erro);
    return estadoInicial;
  }
}

function salvarEstado(estado) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
}

function atualizarSelect(select, itens, placeholder) {
  select.innerHTML = "";
  if (!itens.length) {
    const option = document.createElement("option");
    option.textContent = placeholder;
    option.disabled = true;
    option.selected = true;
    select.appendChild(option);
    return;
  }
  itens.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.nome;
    select.appendChild(option);
  });
}

function criarBadge(texto) {
  const span = document.createElement("span");
  span.className = "badge";
  span.textContent = texto;
  return span;
}

document.addEventListener("DOMContentLoaded", () => {
  const estado = carregarEstado();

  const botoesNav = document.querySelectorAll("nav button");
  const secoes = document.querySelectorAll(".painel");
  botoesNav.forEach((botao) => {
    botao.addEventListener("click", () => {
      secoes.forEach((secao) => secao.classList.remove("ativo"));
      const alvo = document.getElementById(botao.dataset.section);
      alvo.classList.add("ativo");
    });
  });

  const listaCirculos = document.getElementById("lista-circulos");
  const listaPapeis = document.getElementById("lista-papeis");
  const listaTensoes = document.getElementById("lista-tensoes");
  const listaAgenda = document.getElementById("lista-agenda");
  const listaDecisoes = document.getElementById("lista-decisoes");

  const formCirculo = document.getElementById("form-circulo");
  const formPapel = document.getElementById("form-papel");
  const formTensao = document.getElementById("form-tensao");
  const formAgenda = document.getElementById("form-agenda");
  const formDecisao = document.getElementById("form-decisao");

  const selectCirculo = formPapel.querySelector("select[name='circulo']");
  const selectPapelTensao = formTensao.querySelector("select[name='papel']");
  const selectTensaoAgenda = formAgenda.querySelector("select[name='tensao']");
  const selectTensaoDecisao = formDecisao.querySelector("select[name='tensao']");

  function renderCirculos() {
    listaCirculos.innerHTML = "";
    if (!estado.circulos.length) {
      listaCirculos.innerHTML = '<li class="empty">Nenhum círculo cadastrado.</li>';
      return;
    }

    estado.circulos.forEach((circulo) => {
      const item = document.createElement("li");
      const titulo = document.createElement("h4");
      titulo.textContent = circulo.nome;
      const proposito = document.createElement("p");
      proposito.textContent = circulo.proposito;
      item.append(titulo, proposito);
      listaCirculos.appendChild(item);
    });

    atualizarSelect(selectCirculo, estado.circulos, "Cadastre um círculo primeiro");
  }

  function renderPapeis() {
    listaPapeis.innerHTML = "";
    if (!estado.papeis.length) {
      listaPapeis.innerHTML = '<li class="empty">Nenhum papel cadastrado.</li>';
      return;
    }

    estado.papeis.forEach((papel) => {
      const item = document.createElement("li");
      const titulo = document.createElement("h4");
      const circulo = estado.circulos.find((c) => c.id === papel.circuloId);
      titulo.textContent = papel.nome;
      if (circulo) {
        titulo.append(" ", criarBadge(circulo.nome));
      }
      const responsabilidades = document.createElement("p");
      responsabilidades.innerHTML = `<strong>Responsabilidades:</strong> ${papel.responsabilidades.join(", ")}`;
      const artefatos = document.createElement("p");
      artefatos.innerHTML = `<strong>Artefatos:</strong> ${papel.artefatos.join(", ") || "—"}`;
      const parceira = document.createElement("p");
      parceira.innerHTML = `<strong>Energizado por:</strong> ${papel.parceira || "Disponível"}`;
      item.append(titulo, responsabilidades, artefatos, parceira);
      listaPapeis.appendChild(item);
    });

    atualizarSelect(selectPapelTensao, estado.papeis, "Cadastre um papel primeiro");
  }

  function renderTensoes() {
    listaTensoes.innerHTML = "";
    if (!estado.tensoes.length) {
      listaTensoes.innerHTML = '<li class="empty">Nenhuma tensão registrada.</li>';
      return;
    }

    estado.tensoes.forEach((tensao) => {
      const item = document.createElement("li");
      const titulo = document.createElement("h4");
      titulo.textContent = tensao.titulo;
      const descricao = document.createElement("p");
      descricao.textContent = tensao.descricao;
      const interacao = document.createElement("p");
      interacao.append("Direcionada para ", criarBadge(tensao.interacao));
      if (tensao.papelId) {
        const papel = estado.papeis.find((p) => p.id === tensao.papelId);
        interacao.append(" • Papel: ", criarBadge(papel?.nome ?? "—"));
      }
      item.append(titulo, descricao, interacao);
      listaTensoes.appendChild(item);
    });

    atualizarSelect(selectTensaoAgenda, estado.tensoes, "Nenhuma tensão cadastrada");
    atualizarSelect(selectTensaoDecisao, estado.tensoes, "Nenhuma tensão cadastrada");
  }

  function renderAgenda() {
    listaAgenda.innerHTML = "";
    if (!estado.agenda.length) {
      listaAgenda.innerHTML = '<li class="empty">Agenda vazia.</li>';
      return;
    }

    estado.agenda.forEach((itemAgenda, indice) => {
      const item = document.createElement("li");
      const texto = document.createElement("span");
      texto.textContent = itemAgenda.descricao;
      item.append(`${indice + 1}. `, texto);
      if (itemAgenda.tensaoId) {
        const tensao = estado.tensoes.find((t) => t.id === itemAgenda.tensaoId);
        item.append(" ", criarBadge(tensao?.titulo ?? "Tensão removida"));
      }
      listaAgenda.appendChild(item);
    });
  }

  function renderDecisoes() {
    listaDecisoes.innerHTML = "";
    if (!estado.decisoes.length) {
      listaDecisoes.innerHTML = '<li class="empty">Nenhuma decisão registrada.</li>';
      return;
    }

    estado.decisoes.forEach((decisao) => {
      const item = document.createElement("li");
      const resultado = document.createElement("p");
      resultado.innerHTML = `<strong>Resultado:</strong> ${decisao.resultado}`;
      const proximosPassos = document.createElement("p");
      proximosPassos.innerHTML = `<strong>Próximos passos:</strong> ${decisao.proximosPassos || "—"}`;
      item.append(resultado, proximosPassos);
      if (decisao.tensaoId) {
        const tensao = estado.tensoes.find((t) => t.id === decisao.tensaoId);
        item.append(" ", criarBadge(tensao?.titulo ?? "Tensão removida"));
      }
      listaDecisoes.appendChild(item);
    });
  }

  renderCirculos();
  renderPapeis();
  renderTensoes();
  renderAgenda();
  renderDecisoes();

  formCirculo.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = new FormData(formCirculo);
    const circulo = {
      id: crypto.randomUUID(),
      nome: dados.get("nome"),
      proposito: dados.get("proposito"),
    };
    estado.circulos.push(circulo);
    salvarEstado(estado);
    formCirculo.reset();
    renderCirculos();
  });

  formPapel.addEventListener("submit", (evento) => {
    evento.preventDefault();
    if (!estado.circulos.length) {
      alert("Cadastre ao menos um círculo antes de adicionar papéis.");
      return;
    }
    const dados = new FormData(formPapel);
    const papel = {
      id: crypto.randomUUID(),
      nome: dados.get("nome"),
      circuloId: dados.get("circulo"),
      responsabilidades: dados
        .get("responsabilidades")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      artefatos: dados
        .get("artefatos")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      parceira: dados.get("parceira"),
    };
    estado.papeis.push(papel);
    salvarEstado(estado);
    formPapel.reset();
    renderPapeis();
  });

  formTensao.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = new FormData(formTensao);
    const tensao = {
      id: crypto.randomUUID(),
      titulo: dados.get("titulo"),
      descricao: dados.get("descricao"),
      interacao: dados.get("interacao"),
      papelId: dados.get("papel") || null,
    };
    estado.tensoes.push(tensao);
    salvarEstado(estado);
    formTensao.reset();
    renderTensoes();
  });

  formAgenda.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = new FormData(formAgenda);
    const itemAgenda = {
      id: crypto.randomUUID(),
      descricao: dados.get("descricao"),
      tensaoId: dados.get("tensao") || null,
    };
    estado.agenda.push(itemAgenda);
    salvarEstado(estado);
    formAgenda.reset();
    renderAgenda();
  });

  formDecisao.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const dados = new FormData(formDecisao);
    const decisao = {
      id: crypto.randomUUID(),
      resultado: dados.get("resultado"),
      tensaoId: dados.get("tensao") || null,
      proximosPassos: dados.get("proximosPassos"),
    };
    estado.decisoes.push(decisao);
    salvarEstado(estado);
    formDecisao.reset();
    renderDecisoes();
  });
});
