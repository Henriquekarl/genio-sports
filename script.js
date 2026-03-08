const numeroVendedor = "5511942257565";
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function gerarLinkProduto(nome, img) {
  return `${window.location.origin}/produto.html?nome=${encodeURIComponent(nome)}&img=${encodeURIComponent(img)}`;
}

function abrirTime(time) {
  localStorage.setItem("timeEscolhido", time);
  window.location.href = "camisas.html";
}

function voltar() {
  if (document.referrer && document.referrer.includes(window.location.origin)) {
    window.history.back();
  } else {
    window.location.href = "index.html";
  }
}

function abrirCarrinho() {
  const carrinhoEl = document.getElementById("carrinho");
  const fundo = document.getElementById("fundoCarrinho");

  if (carrinhoEl) carrinhoEl.classList.add("ativo");
  if (fundo) fundo.classList.add("ativo");
}

function fecharCarrinho() {
  const carrinhoEl = document.getElementById("carrinho");
  const fundo = document.getElementById("fundoCarrinho");

  if (carrinhoEl) carrinhoEl.classList.remove("ativo");
  if (fundo) fundo.classList.remove("ativo");
}

function atualizarContadorCarrinho() {
  const contadores = document.querySelectorAll("#contadorCarrinho");
  contadores.forEach(contador => {
    contador.textContent = carrinho.length;
  });
}

function escaparHTML(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function criarModalEntrega() {
  if (document.getElementById("modalEntrega")) return;

  const modal = document.createElement("div");
  modal.id = "modalEntrega";
  modal.className = "modal-entrega";

  modal.innerHTML = `
    <div class="modal-entrega-caixa" role="dialog" aria-modal="true" aria-labelledby="tituloModalEntrega">
      <div class="modal-entrega-topo">
        <h2 id="tituloModalEntrega">Endereço de entrega</h2>
        <button type="button" class="btn-fechar-modal" onclick="fecharModalEntrega()">✕</button>
      </div>

      <p class="modal-entrega-texto">
        Preencha o endereço para eu já receber seu pedido com os dados de envio no WhatsApp.
      </p>

      <form id="formEntrega" class="form-entrega">
        <div class="form-entrega-grid">
          <label>
            Nome completo
            <input type="text" id="entregaNome" maxlength="80" required>
          </label>

          <label>
            WhatsApp
            <input type="tel" id="entregaWhatsapp" maxlength="25" placeholder="(11) 99999-9999" required>
          </label>

          <label>
            CEP
            <input type="text" id="entregaCep" maxlength="9" placeholder="00000-000" required>
            <small id="statusCep" class="status-cep"></small>
          </label>

          <label>
            Cidade
            <input type="text" id="entregaCidade" maxlength="60" required>
          </label>

          <label>
            Estado
            <input type="text" id="entregaEstado" maxlength="30" required>
          </label>

          <label>
            Bairro
            <input type="text" id="entregaBairro" maxlength="60" required>
          </label>

          <label class="campo-largo">
            Rua / Avenida
            <input type="text" id="entregaRua" maxlength="120" required>
          </label>

          <label>
            Número
            <input type="text" id="entregaNumero" maxlength="20" required>
          </label>

          <label>
            Complemento
            <input type="text" id="entregaComplemento" maxlength="80" placeholder="Casa, apto, bloco, referência">
          </label>
        </div>

        <div class="modal-entrega-acoes">
          <button type="submit">Enviar pedido no WhatsApp</button>
          <button type="button" class="btn-secundario" onclick="fecharModalEntrega()">Cancelar</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  const form = document.getElementById("formEntrega");
  if (form) {
    form.addEventListener("submit", confirmarEnvioComEndereco);
  }

  const camposComMascara = [
    { id: "entregaCep", tipo: "cep" },
    { id: "entregaWhatsapp", tipo: "telefone" }
  ];

  camposComMascara.forEach(campo => {
    const input = document.getElementById(campo.id);
    if (!input) return;

    input.addEventListener("input", () => {
      if (campo.tipo === "cep") input.value = formatarCEP(input.value);
      if (campo.tipo === "telefone") input.value = formatarTelefone(input.value);
    });
  });

  const campoCep = document.getElementById("entregaCep");
  if (campoCep) {
    campoCep.addEventListener("input", buscarEnderecoPorCEP);
    campoCep.addEventListener("blur", buscarEnderecoPorCEP);
  }
}

function limparFormularioEntrega() {
  const form = document.getElementById("formEntrega");
  if (form) form.reset();

  ultimoCepBuscado = "";
  definirStatusCep("");
  limparCamposEndereco(true);
}

function abrirModalEntrega(contexto) {
  criarModalEntrega();

  const modal = document.getElementById("modalEntrega");
  const form = document.getElementById("formEntrega");

  if (!modal || !form) return;

  limparFormularioEntrega();

  form.dataset.tipo = contexto.tipo || "";
  form.dataset.nome = contexto.nome || "";
  form.dataset.img = contexto.img || "";
  form.dataset.detalhes = JSON.stringify(contexto.detalhes || null);
  form.dataset.itens = JSON.stringify(contexto.itens || []);

  modal.classList.add("ativo");
  document.body.classList.add("modal-aberto");

  const primeiroCampo = document.getElementById("entregaNome");
  if (primeiroCampo) primeiroCampo.focus();
}

function fecharModalEntrega() {
  const modal = document.getElementById("modalEntrega");
  if (modal) modal.classList.remove("ativo");
  document.body.classList.remove("modal-aberto");
  limparFormularioEntrega();
}

function formatarCEP(valor) {
  const numeros = String(valor).replace(/\D/g, "").slice(0, 8);
  if (numeros.length <= 5) return numeros;
  return `${numeros.slice(0, 5)}-${numeros.slice(5)}`;
}

function formatarTelefone(valor) {
  const numeros = String(valor).replace(/\D/g, "").slice(0, 11);

  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 7) return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
  if (numeros.length <= 10) return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
}

function definirStatusCep(mensagem = "", tipo = "") {
  const status = document.getElementById("statusCep");
  if (!status) return;

  status.textContent = mensagem;
  status.className = `status-cep${tipo ? ` ${tipo}` : ""}`;
}

let ultimoCepBuscado = "";

function preencherCamposEndereco(dados) {
  const mapaCampos = {
    entregaRua: dados.logradouro || "",
    entregaBairro: dados.bairro || "",
    entregaCidade: dados.localidade || "",
    entregaEstado: dados.uf || ""
  };

  Object.entries(mapaCampos).forEach(([id, valor]) => {
    const campo = document.getElementById(id);
    if (!campo) return;
    campo.value = valor;
  });
}

function limparCamposEndereco(limparNumero = false) {
  ["entregaRua", "entregaBairro", "entregaCidade", "entregaEstado"].forEach(id => {
    const campo = document.getElementById(id);
    if (campo) campo.value = "";
  });

  if (limparNumero) {
    const campoNumero = document.getElementById("entregaNumero");
    if (campoNumero) campoNumero.value = "";
  }
}

async function buscarEnderecoPorCEP() {
  const campoCep = document.getElementById("entregaCep");
  if (!campoCep) return;

  const cep = campoCep.value.replace(/\D/g, "");

  if (!cep) {
    ultimoCepBuscado = "";
    limparCamposEndereco(true);
    definirStatusCep("");
    return;
  }

  if (cep.length < 8) {
    if (ultimoCepBuscado && cep !== ultimoCepBuscado) {
      limparCamposEndereco(true);
    }
    ultimoCepBuscado = "";
    definirStatusCep("Continue digitando o CEP...", "carregando");
    return;
  }

  if (cep.length !== 8) {
    ultimoCepBuscado = "";
    limparCamposEndereco(true);
    definirStatusCep("Digite um CEP válido com 8 números.", "erro");
    return;
  }

  if (cep === ultimoCepBuscado) {
    return;
  }

  const cepDaBusca = cep;

  try {
    definirStatusCep("Buscando endereço...", "carregando");

    const resposta = await fetch(`https://viacep.com.br/ws/${cepDaBusca}/json/`);
    if (!resposta.ok) throw new Error("Falha ao consultar CEP");

    const dados = await resposta.json();
    const cepAtual = campoCep.value.replace(/\D/g, "");

    if (cepAtual !== cepDaBusca) {
      return;
    }

    if (dados.erro) {
      ultimoCepBuscado = "";
      limparCamposEndereco(true);
      definirStatusCep("CEP não encontrado. Preencha manualmente.", "erro");
      return;
    }

    ultimoCepBuscado = cepDaBusca;
    preencherCamposEndereco(dados);
    definirStatusCep("Endereço preenchido automaticamente.", "sucesso");
  } catch (erro) {
    const cepAtual = campoCep.value.replace(/\D/g, "");
    if (cepAtual !== cepDaBusca) {
      return;
    }

    ultimoCepBuscado = "";
    limparCamposEndereco(true);
    definirStatusCep("Não foi possível buscar o CEP agora. Preencha manualmente.", "erro");
  }
}

function obterDadosEntregaFormulario() {
  return {
    nome: document.getElementById("entregaNome").value.trim(),
    whatsapp: document.getElementById("entregaWhatsapp").value.trim(),
    cep: document.getElementById("entregaCep").value.trim(),
    cidade: document.getElementById("entregaCidade").value.trim(),
    estado: document.getElementById("entregaEstado").value.trim(),
    bairro: document.getElementById("entregaBairro").value.trim(),
    rua: document.getElementById("entregaRua").value.trim(),
    numero: document.getElementById("entregaNumero").value.trim(),
    complemento: document.getElementById("entregaComplemento").value.trim()
  };
}

function validarDadosEntrega(dados) {
  if (!dados.nome || !dados.whatsapp || !dados.cep || !dados.cidade || !dados.estado || !dados.bairro || !dados.rua || !dados.numero) {
    alert("Preencha todos os campos obrigatórios do endereço.");
    return false;
  }

  if (dados.cep.replace(/\D/g, "").length !== 8) {
    alert("Digite um CEP válido.");
    return false;
  }

  if (dados.whatsapp.replace(/\D/g, "").length < 10) {
    alert("Digite um WhatsApp válido.");
    return false;
  }

  return true;
}

function montarTextoEndereco(dados) {
  return `Nome: ${dados.nome}
WhatsApp: ${dados.whatsapp}
CEP: ${dados.cep}
Endereço: ${dados.rua}, ${dados.numero}${dados.complemento ? `, ${dados.complemento}` : ""}
Bairro: ${dados.bairro}
Cidade/Estado: ${dados.cidade} - ${dados.estado}`;
}

function abrirWhatsAppComMensagem(msg) {
  const url = `https://wa.me/${numeroVendedor}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}

function confirmarEnvioComEndereco(event) {
  event.preventDefault();

  const form = event.target;
  const dadosEntrega = obterDadosEntregaFormulario();

  if (!validarDadosEntrega(dadosEntrega)) return;

  const enderecoTexto = montarTextoEndereco(dadosEntrega);
  let mensagem = "";

  if (form.dataset.tipo === "carrinho") {
    const itens = JSON.parse(form.dataset.itens || "[]");
    mensagem = montarMensagemCarrinho(itens, enderecoTexto);
  } else {
    const detalhes = JSON.parse(form.dataset.detalhes || "null");
    mensagem = montarMensagemProduto(form.dataset.nome, form.dataset.img, detalhes, enderecoTexto);
  }

  fecharModalEntrega();
  abrirWhatsAppComMensagem(mensagem);
}

function montarMensagemCarrinho(itensCarrinho, enderecoTexto) {
  const itens = itensCarrinho.map(item => {
    if (item.detalhes) {
      const extras = [];

      if (item.detalhes.nomeNumero) extras.push("Nome e número");
      if (item.detalhes.patch) extras.push("Patch");
      if (item.detalhes.patrocinadores) extras.push("Patrocinadores");

      return `• Produto: ${item.nome}
Versão: ${item.detalhes.versaoLabel}
Tamanho: ${item.detalhes.tamanho}
Extras: ${extras.length ? extras.join(", ") : "Sem extras"}
Preço calculado: ${formatarPreco(item.detalhes.preco)}
Link: ${item.link}`;
    }

    return `• Produto: ${item.nome}
Link: ${item.link}`;
  }).join("\n\n");

  return `Olá! Tudo bem? Vi esses produtos no site da Gênio Sports e tenho interesse na compra.

${itens}

Dados para entrega:
${enderecoTexto}

Gostaria de confirmar disponibilidade, frete e formas de pagamento.`;
}

function montarMensagemProduto(nome, img, detalhes = null, enderecoTexto = "") {
  const linkCamisa = gerarLinkProduto(nome, img);
  let msg = `Olá! Tudo bem? Vi esse produto no site da Gênio Sports e tenho interesse na compra.\n\n`;
  msg += `Produto: ${nome}`;

  if (detalhes) {
    const extras = [];

    if (detalhes.nomeNumero) extras.push("Nome e número");
    if (detalhes.patch) extras.push("Patch");
    if (detalhes.patrocinadores) extras.push("Patrocinadores");

    msg += `\nVersão: ${detalhes.versaoLabel}`;
    msg += `\nTamanho: ${detalhes.tamanho}`;
    msg += `\nExtras: ${extras.length ? extras.join(", ") : "Sem extras"}`;
    msg += `\nPreço calculado: ${formatarPreco(detalhes.preco)}`;
  }

  msg += `\nLink: ${linkCamisa}`;

  if (enderecoTexto) {
    msg += `\n\nDados para entrega:\n${enderecoTexto}`;
  }

  msg += `\n\nGostaria de confirmar disponibilidade, frete e formas de pagamento.`;

  return msg;
}

function ehRetro(nome) {
  return nome.toLowerCase().includes("retrô") || nome.toLowerCase().includes("retro");
}

function obterOpcoesProduto(nome) {
  const retro = ehRetro(nome);

  if (retro) {
    return {
      versoes: [
        { valor: "retro", label: "Retrô", preco: 190 }
      ],
      tamanhos: ["P", "M", "G", "G2"],
      permiteMangaLonga: false
    };
  }

  return {
    versoes: [
      {
        valor: "torcedor",
        label: "Versão Torcedor",
        precoBase: { P: 160, M: 160, G: 160, G2: 160, G3: 190, G4: 190 }
      },
      {
        valor: "jogador",
        label: "Versão Jogador",
        precoBase: { P: 220, M: 220, G: 220, G2: 220, G3: 240, G4: 260 }
      },
      {
        valor: "jogador-manga-longa",
        label: "Versão Jogador Manga Longa",
        precoBase: { P: 280, M: 280, G: 280, G2: 280 }
      }
    ],
    tamanhos: ["P", "M", "G", "G2", "G3", "G4"],
    permiteMangaLonga: true
  };
}

function calcularPrecoProduto(nome, versao, tamanho, opcoesExtras = {}) {
  const retro = ehRetro(nome);
  let preco = 0;

  if (retro) {
    preco = 190;
  } else {
    if (versao === "torcedor") {
      if (["P", "M", "G", "G2"].includes(tamanho)) preco = 160;
      if (["G3", "G4"].includes(tamanho)) preco = 190;
    }

    if (versao === "jogador") {
      if (["P", "M", "G", "G2"].includes(tamanho)) preco = 220;
      if (tamanho === "G3") preco = 240;
      if (tamanho === "G4") preco = 260;
    }

    if (versao === "jogador-manga-longa") {
      if (["P", "M", "G", "G2"].includes(tamanho)) {
        preco = 280;
      } else {
        preco = 0;
      }
    }
  }

  if (opcoesExtras.nomeNumero) preco += 40;
  if (opcoesExtras.patch) preco += 30;
  if (opcoesExtras.patrocinadores) preco += 80;

  return preco;
}

function adicionarCarrinho(nome, img, detalhes = null) {
  if (!nome || !img) return;

  const produtoLink = gerarLinkProduto(nome, img);

  carrinho.push({
    nome,
    img,
    link: produtoLink,
    detalhes: detalhes || null
  });

  salvarCarrinho();
  atualizarCarrinho();
  alert("Produto adicionado ao carrinho!");
}

function removerCarrinho(index) {
  carrinho.splice(index, 1);
  salvarCarrinho();
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("listaCarrinho");

  if (!lista) {
    atualizarContadorCarrinho();
    return;
  }

  lista.innerHTML = "";

  if (carrinho.length === 0) {
    lista.innerHTML = `<li class="carrinho-vazio">Seu carrinho está vazio.</li>`;
    atualizarContadorCarrinho();
    return;
  }

  carrinho.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "item-carrinho";

    const detalhesTexto = item.detalhes
      ? `
        <small class="detalhes-carrinho">
          ${escaparHTML(item.detalhes.versaoLabel || "")}
          ${item.detalhes.tamanho ? ` | Tam: ${escaparHTML(item.detalhes.tamanho)}` : ""}
          ${item.detalhes.preco ? ` | ${escaparHTML(formatarPreco(item.detalhes.preco))}` : ""}
        </small>
      `
      : "";

    li.innerHTML = `
      <div class="item-carrinho-info">
        <img src="${escaparHTML(item.img)}" alt="${escaparHTML(item.nome)}">
        <div>
          <a href="${escaparHTML(item.link)}" target="_blank" rel="noopener noreferrer">${escaparHTML(item.nome)}</a>
          ${detalhesTexto}
        </div>
      </div>
      <button class="btn-remover" type="button">X</button>
    `;

    const btnRemover = li.querySelector(".btn-remover");
    btnRemover.addEventListener("click", () => removerCarrinho(index));

    lista.appendChild(li);
  });

  atualizarContadorCarrinho();
}

function comprarCarrinho() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio");
    return;
  }

  abrirModalEntrega({
    tipo: "carrinho",
    itens: carrinho
  });
}

function enviarWhats(nome, img, detalhes = null) {
  if (!nome || !img) return;

  abrirModalEntrega({
    tipo: "produto",
    nome,
    img,
    detalhes
  });
}

function abrirProduto(camisaNome, imgUrl) {
  if (!camisaNome || !imgUrl) return;

  const url = `produto.html?nome=${encodeURIComponent(camisaNome)}&img=${encodeURIComponent(imgUrl)}`;
  window.location.href = url;
}

function chaveAvaliacao(nomeProduto) {
  return `avaliacoes_${nomeProduto}`;
}

function buscarAvaliacoes(nomeProduto) {
  try {
    return JSON.parse(localStorage.getItem(chaveAvaliacao(nomeProduto))) || [];
  } catch {
    return [];
  }
}

function salvarAvaliacoes(nomeProduto, avaliacoes) {
  localStorage.setItem(chaveAvaliacao(nomeProduto), JSON.stringify(avaliacoes));
}

function calcularResumoAvaliacoes(nomeProduto) {
  const avaliacoes = buscarAvaliacoes(nomeProduto);

  if (!avaliacoes.length) {
    return { media: 0, total: 0 };
  }

  const soma = avaliacoes.reduce((acc, item) => acc + Number(item.nota || 0), 0);

  return {
    media: soma / avaliacoes.length,
    total: avaliacoes.length
  };
}

function gerarEstrelasTexto(nota) {
  const arredondada = Math.max(0, Math.min(5, Math.round(Number(nota) || 0)));
  return "★".repeat(arredondada) + "☆".repeat(5 - arredondada);
}

function criarResumoAvaliacaoHTML(nomeProduto) {
  const resumo = calcularResumoAvaliacoes(nomeProduto);

  if (resumo.total === 0) {
    return `
      <div class="avaliacao-resumo sem-avaliacao">
        <span class="estrelas">☆☆☆☆☆</span>
        <span>Ainda sem avaliações</span>
      </div>
    `;
  }

  return `
    <div class="avaliacao-resumo">
      <span class="estrelas">${gerarEstrelasTexto(resumo.media)}</span>
      <span>${resumo.media.toFixed(1)} (${resumo.total} avaliação${resumo.total > 1 ? "ões" : ""})</span>
    </div>
  `;
}

function enviarAvaliacao(event, nomeProduto) {
  event.preventDefault();

  const form = event.target;
  const nome = form.querySelector('[name="nome"]').value.trim();
  const nota = Number(form.querySelector('[name="nota"]').value);
  const comentario = form.querySelector('[name="comentario"]').value.trim();

  if (!nome || !nota || !comentario) {
    alert("Preencha nome, nota e comentário.");
    return;
  }

  const avaliacoes = buscarAvaliacoes(nomeProduto);

  avaliacoes.unshift({
    nome,
    nota,
    comentario,
    data: new Date().toLocaleDateString("pt-BR")
  });

  salvarAvaliacoes(nomeProduto, avaliacoes);
  form.reset();
  renderizarAvaliacoes(nomeProduto);
  carregarPaginaCamisas();
  alert("Avaliação enviada com sucesso!");
}

function renderizarAvaliacoes(nomeProduto) {
  const area = document.getElementById("areaAvaliacoes");
  if (!area) return;

  const avaliacoes = buscarAvaliacoes(nomeProduto);

  const listaHTML = avaliacoes.length
    ? avaliacoes.map(item => `
        <div class="avaliacao-item">
          <div class="avaliacao-item-topo">
            <strong>${escaparHTML(item.nome)}</strong>
            <span>${escaparHTML(item.data)}</span>
          </div>
          <div class="avaliacao-estrelas">${gerarEstrelasTexto(item.nota)}</div>
          <p>${escaparHTML(item.comentario)}</p>
        </div>
      `).join("")
    : `<p class="sem-avaliacoes-texto">Ainda não há avaliações para esta camisa.</p>`;

  area.innerHTML = `
    <section class="avaliacoes-box">
      <h3>Avaliações</h3>
      ${criarResumoAvaliacaoHTML(nomeProduto)}

      <form class="form-avaliacao" id="formAvaliacao">
        <input type="text" name="nome" placeholder="Seu nome" maxlength="30" required>

        <select name="nota" required>
          <option value="">Dê uma nota</option>
          <option value="5">5 estrelas</option>
          <option value="4">4 estrelas</option>
          <option value="3">3 estrelas</option>
          <option value="2">2 estrelas</option>
          <option value="1">1 estrela</option>
        </select>

        <textarea name="comentario" placeholder="Conte o que achou da camisa" maxlength="220" required></textarea>

        <button type="submit">Enviar avaliação</button>
      </form>

      <div class="lista-avaliacoes">
        ${listaHTML}
      </div>
    </section>
  `;

  const form = document.getElementById("formAvaliacao");
  if (form) {
    form.addEventListener("submit", event => enviarAvaliacao(event, nomeProduto));
  }
}

function normalizarNomeArquivo(time) {
  return time
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .replace(/ç/g, "c");
}

function montarCamisasDoTime(time) {
  const catalogosPersonalizados = {
    santos: [
      { nome: "Santos Home 25/26", img: "imagens/Santos 25-26 Home.jpeg" },
      { nome: "Santos Third 25/26", img: "imagens/Santos 25-26 Third.jpeg" },
      { nome: "Santos Retrô Home 2011/12", img: "imagens/Retro 2011-12 Santos Home.jpg" },
      { nome: "Santos Retrô Home 2001", img: "imagens/Retro 2001 Santos Home Jersey.jpeg" },
      { nome: "Santos Retrô Away 1996", img: "imagens/Retro 1996 Santos Away.jpeg" }
    ]
  };

  const chaveTime = normalizarNomeArquivo(time);

  if (catalogosPersonalizados[chaveTime]) {
    return catalogosPersonalizados[chaveTime];
  }

  return [
    { nome: `${time} Home`, img: `imagens/${chaveTime}-home.jpg` },
    { nome: `${time} Away`, img: `imagens/${chaveTime}-away.jpg` },
    { nome: `${time} Third`, img: `imagens/${chaveTime}-third.jpg` },
    { nome: `${time} Retrô`, img: `imagens/${chaveTime}-retro.jpg` }
  ];
}

function obterPrecoMinimoCamisa(nome) {
  return ehRetro(nome) ? 190 : 160;
}

function criarCardCamisa(camisa) {
  const resumo = calcularResumoAvaliacoes(camisa.nome);
  const div = document.createElement("div");
  div.className = "camisa";

  const avaliacaoHTML = resumo.total > 0
    ? `<span class="estrelas">${gerarEstrelasTexto(resumo.media)}</span><span>${resumo.media.toFixed(1)} (${resumo.total})</span>`
    : `<span class="estrelas">☆☆☆☆☆</span><span>Sem avaliações</span>`;

  const precoInicial = obterPrecoMinimoCamisa(camisa.nome);

  div.innerHTML = `
    <img src="${escaparHTML(camisa.img)}" alt="${escaparHTML(camisa.nome)}">
    <h3>${escaparHTML(camisa.nome)}</h3>
    <p>Camisa tailandesa</p>
    <p><b>${formatarPreco(precoInicial)}</b></p>
    <p class="texto-card-produto">Preço final conforme versão, tamanho e extras.</p>
    <div class="mini-avaliacao">${avaliacaoHTML}</div>
    <button class="btn-add" type="button">Adicionar ao carrinho</button>
    <button class="btn-configurar" type="button">Configurar produto</button>
  `;

  const img = div.querySelector("img");
  const btnAdd = div.querySelector(".btn-add");
  const btnConfigurar = div.querySelector(".btn-configurar");

  img.addEventListener("click", () => abrirProduto(camisa.nome, camisa.img));
  btnAdd.addEventListener("click", () => adicionarCarrinho(camisa.nome, camisa.img));
  btnConfigurar.addEventListener("click", () => abrirProduto(camisa.nome, camisa.img));

  return div;
}

function carregarPaginaCamisas() {
  const container = document.getElementById("camisas");
  if (!container) return;

  const time = localStorage.getItem("timeEscolhido") || "Camisas";
  const titulo = document.getElementById("nomeTime");

  if (titulo) titulo.textContent = time;

  const camisas = montarCamisasDoTime(time);
  container.innerHTML = "";

  camisas.forEach(camisa => {
    container.appendChild(criarCardCamisa(camisa));
  });
}

function carregarPesquisa() {
  const pesquisa = document.getElementById("pesquisa");
  if (!pesquisa) return;
  pesquisa.addEventListener("keyup", function () {
    const filtro = pesquisa.value.toLowerCase();
    const times = document.querySelectorAll(".card");

    times.forEach(time => {
      const nome = time.textContent.toLowerCase();
      time.style.display = nome.includes(filtro) ? "block" : "none";
    });
  });
}

function atualizarPrecoTelaProduto(nome, img) {
  const versaoSelect = document.getElementById("produtoVersao");
  const tamanhoSelect = document.getElementById("produtoTamanho");
  const checkboxNomeNumero = document.getElementById("extraNomeNumero");
  const checkboxPatch = document.getElementById("extraPatch");
  const checkboxPatrocinadores = document.getElementById("extraPatrocinadores");
  const precoEl = document.getElementById("precoDinamico");
  const precoInfoEl = document.getElementById("precoInfoTexto");
  const btnCarrinho = document.getElementById("btnProdutoCarrinho");
  const btnWhats = document.getElementById("btnProdutoWhats");

  if (!versaoSelect || !tamanhoSelect || !precoEl) return;

  const versao = versaoSelect.value;
  const tamanho = tamanhoSelect.value;
  const nomeNumero = checkboxNomeNumero ? checkboxNomeNumero.checked : false;
  const patch = checkboxPatch ? checkboxPatch.checked : false;
  const patrocinadores = checkboxPatrocinadores ? checkboxPatrocinadores.checked : false;

  const preco = calcularPrecoProduto(nome, versao, tamanho, {
    nomeNumero,
    patch,
    patrocinadores
  });

  if (!preco) {
    precoEl.textContent = "Tamanho indisponível para essa versão";
    precoInfoEl.textContent = "Escolha outra combinação.";
    if (btnCarrinho) btnCarrinho.disabled = true;
    if (btnWhats) btnWhats.disabled = true;
    return;
  }

  const opcoes = obterOpcoesProduto(nome);
  const versaoObj = opcoes.versoes.find(item => item.valor === versao);
  const versaoLabel = versaoObj ? versaoObj.label : versao;

  precoEl.textContent = formatarPreco(preco);
  precoInfoEl.textContent = "Preço calculado conforme versão, tamanho e extras escolhidos.";

  if (btnCarrinho) btnCarrinho.disabled = false;
  if (btnWhats) btnWhats.disabled = false;

  const detalhes = {
    versao,
    versaoLabel,
    tamanho,
    nomeNumero,
    patch,
    patrocinadores,
    preco
  };

  if (btnCarrinho) {
    btnCarrinho.onclick = () => adicionarCarrinho(nome, img, detalhes);
  }

  if (btnWhats) {
    btnWhats.onclick = () => enviarWhats(nome, img, detalhes);
  }
}

function carregarPaginaProduto() {
  const container = document.getElementById("produto");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const nome = urlParams.get("nome");
  const img = urlParams.get("img");

  if (!nome || !img) {
    container.innerHTML = `
      <div class="produto-card">
        <h2>Produto não encontrado</h2>
        <p>Volte e escolha uma camisa novamente.</p>
      </div>
    `;
    return;
  }

  const opcoes = obterOpcoesProduto(nome);

  const versoesHTML = opcoes.versoes.map(item =>
    `<option value="${escaparHTML(item.valor)}">${escaparHTML(item.label)}</option>`
  ).join("");

  const tamanhosHTML = opcoes.tamanhos.map(tamanho =>
    `<option value="${escaparHTML(tamanho)}">${escaparHTML(tamanho)}</option>`
  ).join("");

  const precoInicial = calcularPrecoProduto(nome, opcoes.versoes[0].valor, opcoes.tamanhos[0], {
    nomeNumero: false,
    patch: false,
    patrocinadores: false
  });

  container.innerHTML = `
    <div class="produto-layout">
      <div class="produto-card">
        <img src="${escaparHTML(img)}" alt="${escaparHTML(nome)}" class="produto-imagem">
      </div>

      <div class="produto-info">
        <h2>${escaparHTML(nome)}</h2>
        <p>Camisa tailandesa premium</p>

        <div class="bloco-preco-produto">
          <div class="preco-destaque" id="precoDinamico">${formatarPreco(precoInicial)}</div>
          <small id="precoInfoTexto">Preço calculado conforme versão, tamanho e extras escolhidos.</small>
        </div>

        ${criarResumoAvaliacaoHTML(nome)}

        <div class="produto-configuracoes">
          <label>
            Versão
            <select id="produtoVersao">
              ${versoesHTML}
            </select>
          </label>

          <label>
            Tamanho
            <select id="produtoTamanho">
              ${tamanhosHTML}
            </select>
          </label>

          <div class="extras-produto">
            <h3>Personalização</h3>

            <label class="check-linha">
              <input type="checkbox" id="extraNomeNumero">
              Nome e número (+ R$40,00)
            </label>

            <label class="check-linha">
              <input type="checkbox" id="extraPatch">
              Patch (+ R$30,00)
            </label>

            <label class="check-linha">
              <input type="checkbox" id="extraPatrocinadores">
              Patrocinadores (+ R$80,00)
            </label>
          </div>
        </div>

        <div class="produto-acoes">
          <button id="btnProdutoCarrinho" type="button">Adicionar ao carrinho</button>
          <button id="btnProdutoWhats" type="button">Comprar no WhatsApp</button>
        </div>

        <ul class="produto-destaques">
          <li>Preço exato conforme sua escolha</li>
          <li>Consulte frete pelo CEP</li>
          <li>Parcelado aumenta 10% no valor total</li>
          <li>Pedido finalizado direto no WhatsApp</li>
        </ul>
      </div>
    </div>

    <div id="areaAvaliacoes"></div>
  `;

  const campos = [
    document.getElementById("produtoVersao"),
    document.getElementById("produtoTamanho"),
    document.getElementById("extraNomeNumero"),
    document.getElementById("extraPatch"),
    document.getElementById("extraPatrocinadores")
  ];

  campos.forEach(campo => {
    if (campo) {
      campo.addEventListener("change", () => atualizarPrecoTelaProduto(nome, img));
    }
  });

  atualizarPrecoTelaProduto(nome, img);
  renderizarAvaliacoes(nome);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    fecharCarrinho();
    fecharModalEntrega();
  }
});

carregarPaginaCamisas();
carregarPesquisa();
carregarPaginaProduto();
atualizarCarrinho();