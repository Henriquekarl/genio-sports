
const numeroVendedor = "5511942257565";
let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const placeholderCache = {};

function slugify(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}


function gerarImagemPlaceholder(texto) {
  const chave = texto || "Produto";
  if (placeholderCache[chave]) return placeholderCache[chave];

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
      <rect width="100%" height="100%" fill="#111111"/>
      <rect x="35" y="35" width="830" height="830" rx="34" fill="#0b0b0b" stroke="#FFD700" stroke-width="6"/>
      <text x="50%" y="48%" fill="#FFD700" font-family="Arial, sans-serif" font-size="54" font-weight="700" text-anchor="middle">${escaparHTML(chave)}</text>
      <text x="50%" y="56%" fill="#ffffff" font-family="Arial, sans-serif" font-size="28" text-anchor="middle">Imagem ilustrativa</text>
    </svg>
  `;

  placeholderCache[chave] = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  return placeholderCache[chave];
}

const catalogoProdutosExtras = {
  "Feminino": [
    {
      nome: "Linha Feminina",
      descricao: "Camisa feminina tailandesa premium",
      precoBase: 160,
      tamanhos: ["P", "M", "G", "G2", "G3", "G4"],
      img: gerarImagemPlaceholder("Linha Feminina")
    }
  ],
  "Shorts": [
    {
      nome: "Shorts Futebol",
      descricao: "Shorts futebol",
      precoBase: 120,
      tamanhos: ["P", "M", "G", "G2"],
      img: gerarImagemPlaceholder("Shorts Futebol")
    },
    {
      nome: "Shorts NBA",
      descricao: "Shorts NBA",
      precoBase: 140,
      tamanhos: ["P", "M", "G", "G2"],
      img: gerarImagemPlaceholder("Shorts NBA")
    }
  ],
  "Agasalhos": [
    {
      nome: "Blusa 3 Cabos",
      descricao: "Blusa 3 cabos",
      precoBase: 180,
      tamanhos: ["M", "G", "GG"],
      img: gerarImagemPlaceholder("Blusa 3 Cabos")
    },
    {
      nome: "Treino Calça e Blusa",
      descricao: "Treino calça e blusa",
      precoBase: 320,
      tamanhos: ["P", "M", "G", "G2"],
      img: gerarImagemPlaceholder("Treino Calça e Blusa")
    },
    {
      nome: "Treino Calça e Camisa",
      descricao: "Treino calça e camisa",
      precoBase: 290,
      tamanhos: ["P", "M", "G", "G2"],
      img: gerarImagemPlaceholder("Treino Calça e Camisa")
    },
    {
      nome: "Treino Bermuda e Manga Curta ou Regata",
      descricao: "Treino bermuda e manga curta ou regata",
      precoBase: 260,
      tamanhos: ["P", "M", "G", "G2"],
      img: gerarImagemPlaceholder("Treino Bermuda")
    },
    {
      nome: "Corta Vento",
      descricao: "Corta vento e outros",
      precoBase: 320,
      tamanhos: ["P", "M", "G", "G2"],
      img: gerarImagemPlaceholder("Corta Vento")
    },
    {
      nome: "Bobojaco",
      descricao: "Bobojaco",
      precoBase: 420,
      tamanhos: ["P", "M", "G", "G2"],
      img: gerarImagemPlaceholder("Bobojaco")
    }
  ],
  "Outros produtos": [
    {
      nome: "Kit Infantil",
      descricao: "Kit infantil",
      precoBase: 190,
      tamanhos: ["2", "4", "6", "8", "10", "12", "14"],
      img: gerarImagemPlaceholder("Kit Infantil")
    },
    {
      nome: "F1 (Camisas)",
      descricao: "F1 (camisas)",
      precoBase: 250,
      tamanhos: ["P", "M", "G", "G2"],
      img: gerarImagemPlaceholder("F1")
    },
    {
      nome: "NBA",
      descricao: "NBA",
      precoBase: 240,
      tamanhos: ["P", "M", "G", "G2"],
      img: gerarImagemPlaceholder("NBA")
    },
    {
      nome: "NFL",
      descricao: "NFL",
      precoBase: 240,
      tamanhos: ["P", "M", "G", "G2"],
      img: gerarImagemPlaceholder("NFL")
    }
  ]
};

Object.entries(catalogoProdutosExtras).forEach(([categoria, produtos]) => {
  produtos.forEach(produto => {
    if (!produto.id) {
      produto.id = `${slugify(categoria)}-${slugify(produto.nome)}`;
    }
  });
});



const TIMES_DISPONIVEIS = [
  "Flamengo", "Corinthians", "Palmeiras", "São Paulo", "Santos", "Grêmio", "Internacional", "Cruzeiro", "Atlético Mineiro", "Botafogo", "Remo",
  "Real Madrid", "Barcelona", "Manchester City", "Manchester United", "Liverpool", "Arsenal", "Chelsea", "PSG", "Bayern", "Juventus",
  "Brasil", "Argentina", "Portugal", "França", "Alemanha", "Espanha"
];

function obterProdutoExtraPorId(id) {
  for (const [categoria, produtos] of Object.entries(catalogoProdutosExtras)) {
    const produto = produtos.find(item => item.id === id);
    if (produto) return { ...produto, categoria };
  }
  return null;
}

function obterIdProdutoExtra(categoria, nome) {
  const produto = obterProdutoExtra(categoria, nome);
  return produto?.id || `${slugify(categoria)}-${slugify(nome)}`;
}

function obterIdCamisa(nome) {
  return `camisa-${slugify(nome)}`;
}

function buscarCamisaPorId(id) {
  for (const time of TIMES_DISPONIVEIS) {
    const camisa = montarCamisasDoTime(time).find(item => item.id === id);
    if (camisa) return camisa;
  }
  return null;
}

function salvarCarrinho() {
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function gerarLinkProduto(nome, img, meta = {}) {
  const url = new URL("produto.html", window.location.href);

  if (meta.id) {
    url.searchParams.set("id", meta.id);
    return url.toString();
  }

  url.searchParams.set("nome", nome);
  url.searchParams.set("img", img);

  if (meta.categoria) {
    url.searchParams.set("categoria", meta.categoria);
  }

  return url.toString();
}

function abrirTime(time) {
  localStorage.setItem("modoCatalogo", "time");
  localStorage.setItem("timeEscolhido", time);
  localStorage.removeItem("categoriaEscolhida");
  window.location.href = "camisas.html";
}

function abrirCategoria(categoria) {
  localStorage.setItem("modoCatalogo", "categoria");
  localStorage.setItem("categoriaEscolhida", categoria);

  if (categoria === "Feminino") {
    const primeiroProduto = catalogoProdutosExtras[categoria]?.[0]?.nome || "";
    if (primeiroProduto) {
      localStorage.setItem("subcategoriaEscolhida", primeiroProduto);
      localStorage.setItem("scrollParaModelosDisponiveis", "1");
    } else {
      localStorage.removeItem("subcategoriaEscolhida");
      localStorage.removeItem("scrollParaModelosDisponiveis");
    }
  } else {
    localStorage.removeItem("subcategoriaEscolhida");
  }

  localStorage.removeItem("timeEscolhido");
  window.location.href = "camisas.html";
}

function abrirSubcategoriaProdutoExtra(categoria, subcategoria = "") {
  localStorage.setItem("modoCatalogo", "categoria");
  localStorage.setItem("categoriaEscolhida", categoria);

  if (subcategoria) {
    localStorage.setItem("subcategoriaEscolhida", subcategoria);
    localStorage.setItem("scrollParaModelosDisponiveis", "1");
  } else {
    localStorage.removeItem("subcategoriaEscolhida");
    localStorage.removeItem("scrollParaModelosDisponiveis");
  }

  localStorage.removeItem("timeEscolhido");
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
  return Number(valor).toLocaleString("pt-BR", {
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

  [
    { id: "entregaCep", tipo: "cep" },
    { id: "entregaWhatsapp", tipo: "telefone" }
  ].forEach(campo => {
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
  form.dataset.categoria = contexto.categoria || "";
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
    mensagem = montarMensagemProduto(form.dataset.nome, form.dataset.img, detalhes, enderecoTexto, form.dataset.categoria || "");
  }

  fecharModalEntrega();
  abrirWhatsAppComMensagem(mensagem);
}

function montarMensagemCarrinho(itensCarrinho, enderecoTexto) {
  const itens = itensCarrinho.map(item => {
    const linhas = [`• Produto: ${item.nome}`];

    if (item.categoria) {
      linhas.push(`Categoria: ${item.categoria}`);
    }

    if (item.detalhes?.versaoLabel) linhas.push(`Opção: ${item.detalhes.versaoLabel}`);
    if (item.detalhes?.tamanho) linhas.push(`Tamanho: ${item.detalhes.tamanho}`);

    if (item.detalhes?.nomeNumero || item.detalhes?.patch || item.detalhes?.patrocinadores) {
      const extras = [];

      if (item.detalhes.nomeNumero) extras.push("Nome e número");
      if (item.detalhes.patch) extras.push("Patch");
      if (item.detalhes.patrocinadores) extras.push("Patrocinadores");
      linhas.push(`Extras: ${extras.join(", ")}`);
    }

    if (item.detalhes?.preco) linhas.push(`Preço calculado: ${formatarPreco(item.detalhes.preco)}`);
    linhas.push(`Link: ${item.link}`);

    return linhas.join("\n");
  }).join("\n\n");

  return `Olá! Tudo bem? Vi esses produtos no site da Gênio Sports e tenho interesse na compra.

${itens}

Dados para entrega:
${enderecoTexto}

Gostaria de confirmar disponibilidade, frete e formas de pagamento.`;
}

function montarMensagemProduto(nome, img, detalhes = null, enderecoTexto = "", categoria = "") {
  const idProduto = categoria ? obterIdProdutoExtra(categoria, nome) : obterIdCamisa(nome);
  const linkProduto = gerarLinkProduto(nome, img, { id: idProduto, categoria });
  const linhas = [
    "Olá! Tudo bem? Vi esse produto no site da Gênio Sports e tenho interesse na compra.",
    "",
    `Produto: ${nome}`
  ];

  if (categoria) {
    linhas.push(`Categoria: ${categoria}`);
  }

  if (detalhes?.versaoLabel) linhas.push(`Opção: ${detalhes.versaoLabel}`);
  if (detalhes?.tamanho) linhas.push(`Tamanho: ${detalhes.tamanho}`);

  if (detalhes?.nomeNumero || detalhes?.patch || detalhes?.patrocinadores) {
    const extras = [];

    if (detalhes.nomeNumero) extras.push("Nome e número");
    if (detalhes.patch) extras.push("Patch");
    if (detalhes.patrocinadores) extras.push("Patrocinadores");
    linhas.push(`Extras: ${extras.length ? extras.join(", ") : "Sem extras"}`);
  }

  if (detalhes?.preco) linhas.push(`Preço calculado: ${formatarPreco(detalhes.preco)}`);

  linhas.push(`Link: ${linkProduto}`);

  if (enderecoTexto) {
    linhas.push("", "Dados para entrega:", enderecoTexto);
  }

  linhas.push("", "Gostaria de confirmar disponibilidade, frete e formas de pagamento.");
  return linhas.join("\n");
}

function ehRetro(nome) {
  return nome.toLowerCase().includes("retrô") || nome.toLowerCase().includes("retro");
}

function obterOpcoesProduto(nome) {
  const retro = ehRetro(nome);

  if (retro) {
    return {
      versoes: [{ valor: "retro", label: "Retrô", preco: 190 }],
      tamanhos: ["P", "M", "G", "G2"],
      permiteMangaLonga: false
    };
  }

  return {
    versoes: [
      { valor: "torcedor", label: "Versão Torcedor", precoBase: { P: 160, M: 160, G: 160, G2: 160, G3: 190, G4: 190 } },
      { valor: "jogador", label: "Versão Jogador", precoBase: { P: 220, M: 220, G: 220, G2: 220, G3: 240, G4: 260 } },
      { valor: "jogador-manga-longa", label: "Versão Jogador Manga Longa", precoBase: { P: 280, M: 280, G: 280, G2: 280 } }
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

function obterProdutoExtra(categoria, nome) {
  const lista = catalogoProdutosExtras[categoria] || [];
  return lista.find(item => item.nome === nome) || null;
}

function ehCategoriaFeminina(categoria) {
  return categoria === "Feminino";
}

function obterPrecoMinimoCamisa(nome) {
  return ehRetro(nome) ? 190 : 160;
}

function obterTextoFaixaPrecoProdutoExtra(produto, categoria = "") {
  if (ehCategoriaFeminina(categoria)) {
    return formatarPreco(obterPrecoMinimoCamisa(produto.nome));
  }

  if (produto.somenteConsulta || produto.precoBase === null || produto.precoBase === undefined) {
    return "Sob consulta";
  }
  return formatarPreco(produto.precoBase);
}

function adicionarCarrinho(nome, img, detalhes = null, categoria = "") {
  if (!nome || !img) return;

  const idProduto = categoria ? obterIdProdutoExtra(categoria, nome) : obterIdCamisa(nome);
  const produtoLink = gerarLinkProduto(nome, img, { id: idProduto, categoria });

  carrinho.push({
    nome,
    img,
    link: produtoLink,
    categoria: categoria || "",
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

    const blocosDetalhe = [];
    if (item.categoria) blocosDetalhe.push(item.categoria);
    if (item.detalhes?.versaoLabel) blocosDetalhe.push(item.detalhes.versaoLabel);
    if (item.detalhes?.tamanho) blocosDetalhe.push(`Tam: ${item.detalhes.tamanho}`);
    if (item.detalhes?.preco) blocosDetalhe.push(formatarPreco(item.detalhes.preco));

    const detalhesTexto = blocosDetalhe.length
      ? `<small class="detalhes-carrinho">${escaparHTML(blocosDetalhe.join(" | "))}</small>`
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

    li.querySelector(".btn-remover").addEventListener("click", () => removerCarrinho(index));
    lista.appendChild(li);
  });

  atualizarContadorCarrinho();
}

function comprarCarrinho() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio");
    return;
  }

  abrirModalEntrega({ tipo: "carrinho", itens: carrinho });
}

function enviarWhats(nome, img, detalhes = null, categoria = "") {
  if (!nome || !img) return;
  abrirModalEntrega({ tipo: "produto", nome, img, detalhes, categoria });
}

function abrirProduto(camisaNome, imgUrl, categoria = "") {
  if (!camisaNome || !imgUrl) return;

  const idProduto = categoria ? obterIdProdutoExtra(categoria, camisaNome) : obterIdCamisa(camisaNome);
  const url = `produto.html?id=${encodeURIComponent(idProduto)}`;
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
  return { media: soma / avaliacoes.length, total: avaliacoes.length };
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
  avaliacoes.unshift({ nome, nota, comentario, data: new Date().toLocaleDateString("pt-BR") });
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

      <div class="lista-avaliacoes">${listaHTML}</div>
    </section>
  `;

  const form = document.getElementById("formAvaliacao");
  if (form) {
    form.addEventListener("submit", event => enviarAvaliacao(event, nomeProduto));
  }
}

function normalizarNomeArquivo(time) {
  return time.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").replace(/ç/g, "c");
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
  const listaBase = catalogosPersonalizados[chaveTime] || [
    { nome: `${time} Home`, img: `imagens/${chaveTime}-home.jpg` },
    { nome: `${time} Away`, img: `imagens/${chaveTime}-away.jpg` },
    { nome: `${time} Third`, img: `imagens/${chaveTime}-third.jpg` },
    { nome: `${time} Retrô`, img: `imagens/${chaveTime}-retro.jpg` }
  ];

  return listaBase.map(camisa => ({
    ...camisa,
    time,
    id: camisa.id || obterIdCamisa(camisa.nome)
  }));
}

function criarCardCamisa(camisa) {
  const resumo = calcularResumoAvaliacoes(camisa.nome);
  const div = document.createElement("div");
  div.className = "camisa";

  const avaliacaoHTML = resumo.total > 0
    ? `<span class="estrelas">${gerarEstrelasTexto(resumo.media)}</span><span>${resumo.media.toFixed(1)} (${resumo.total})</span>`
    : `<span class="estrelas">☆☆☆☆☆</span><span>Sem avaliações</span>`;

    
  div.innerHTML = `
    <img src="${escaparHTML(camisa.img)}" alt="${escaparHTML(camisa.nome)}">
    <h3>${escaparHTML(camisa.nome)}</h3>
    <p>Camisa tailandesa</p>
    <p><b>${formatarPreco(obterPrecoMinimoCamisa(camisa.nome))}</b></p>
    <p class="texto-card-produto">Preço final conforme versão, tamanho e extras.</p>
    <div class="mini-avaliacao">${avaliacaoHTML}</div>
    <button class="btn-add" type="button">Adicionar ao carrinho</button>
    <button class="btn-configurar" type="button">Configurar produto</button>
  `;

  div.querySelector("img").addEventListener("click", () => abrirProduto(camisa.nome, camisa.img));
  div.querySelector(".btn-add").addEventListener("click", () => adicionarCarrinho(camisa.nome, camisa.img));
  div.querySelector(".btn-configurar").addEventListener("click", () => abrirProduto(camisa.nome, camisa.img));
  return div;
}

function criarCardProdutoExtra(produto, categoria) {
  const div = document.createElement("div");
  div.className = "camisa";

  const faixaPreco = obterTextoFaixaPrecoProdutoExtra(produto, categoria);
  const textoComplementar = ehCategoriaFeminina(categoria)
    ? "Preço final conforme versão, tamanho e extras."
    : produto.somenteConsulta
      ? "Clique para abrir a página individual e consultar os modelos disponíveis."
      : "Preço final conforme modelo e opções disponíveis no catálogo.";

  div.innerHTML = `
    <img src="${escaparHTML(produto.img)}" alt="${escaparHTML(produto.nome)}">
    <h3>${escaparHTML(produto.nome)}</h3>
    <p>${escaparHTML(ehCategoriaFeminina(categoria) ? "Camisa tailandesa" : produto.descricao)}</p>
    <p><b>${escaparHTML(faixaPreco)}</b></p>
    <p class="texto-card-produto">${escaparHTML(textoComplementar)}</p>
    <div class="mini-avaliacao"><span class="estrelas">☆☆☆☆☆</span><span>Sem avaliações</span></div>
    <button class="btn-add" type="button">Adicionar ao carrinho</button>
    <button class="btn-configurar" type="button">Configurar produto</button>
  `;

  div.querySelector("img").addEventListener("click", () => abrirProduto(produto.nome, produto.img, categoria));
  div.querySelector(".btn-add").addEventListener("click", () => adicionarCarrinho(produto.nome, produto.img, null, categoria));
  div.querySelector(".btn-configurar").addEventListener("click", () => abrirProduto(produto.nome, produto.img, categoria));
  return div;
}

function preencherTextosCatalogo(config) {
  const textos = {
    h1: document.getElementById("nomeTime"),
    tag: document.getElementById("tagCatalogo"),
    descricao: document.getElementById("descricaoCatalogo"),
    aviso: document.getElementById("avisoCatalogo"),
    passo3: document.getElementById("faixaPasso3"),
    duvidaPreco: document.getElementById("duvidaPreco"),
    duvidaPersonalizacao: document.getElementById("duvidaPersonalizacao"),
    duvidaComo: document.getElementById("duvidaComo"),
    ctaTitulo: document.getElementById("ctaCatalogoTitulo"),
    ctaTexto: document.getElementById("ctaCatalogoTexto")
  };

  if (textos.h1) textos.h1.textContent = config.titulo;
  if (textos.tag) textos.tag.textContent = config.tag;
  if (textos.descricao) textos.descricao.textContent = config.descricao;
  if (textos.aviso) textos.aviso.innerHTML = config.aviso;
  if (textos.passo3) textos.passo3.textContent = config.passo3;
  if (textos.duvidaPreco) textos.duvidaPreco.textContent = config.duvidaPreco;
  if (textos.duvidaPersonalizacao) textos.duvidaPersonalizacao.textContent = config.duvidaPersonalizacao;
  if (textos.duvidaComo) textos.duvidaComo.textContent = config.duvidaComo;
  if (textos.ctaTitulo) textos.ctaTitulo.textContent = config.ctaTitulo;
  if (textos.ctaTexto) textos.ctaTexto.textContent = config.ctaTexto;
}

function carregarPaginaCamisas() {
  const container = document.getElementById("camisas");
  if (!container) return;

  container.innerHTML = "";

  const modoCatalogo = localStorage.getItem("modoCatalogo") || "time";
  const categoria = localStorage.getItem("categoriaEscolhida") || "";
  const subcategoria = localStorage.getItem("subcategoriaEscolhida") || "";
  const time = localStorage.getItem("timeEscolhido") || "Camisas";

  if (modoCatalogo === "categoria" && categoria && catalogoProdutosExtras[categoria]) {
    const produtosDaCategoria = catalogoProdutosExtras[categoria];

    if (ehCategoriaFeminina(categoria)) {
      preencherTextosCatalogo({
        titulo: categoria,
        tag: `Categoria: ${categoria}`,
        descricao: "Escolha o modelo, abra a página individual e configure versão, tamanho e extras para ver o preço exato.",
        aviso: `Escolha sua camisa e <b>configure o preço exato</b> na página do produto`,
        passo3: "🎨 Adicione personalização",
        duvidaPreco: "O preço já está final?",
        duvidaPersonalizacao: "Posso personalizar?",
        duvidaComo: "Como compro?",
        ctaTitulo: "Quer ver preços, tamanhos e extras?",
        ctaTexto: "Abra a página da camisa e monte seu pedido do jeito certo."
      });

      produtosDaCategoria.forEach(produto => {
        container.appendChild(criarCardProdutoExtra(produto, categoria));
      });

      if (localStorage.getItem("scrollParaModelosDisponiveis") === "1") {
        localStorage.removeItem("scrollParaModelosDisponiveis");

        requestAnimationFrame(() => {
          const alvoModelos = document.getElementById("modelosDisponiveis");
          if (alvoModelos) {
            alvoModelos.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });
      }

      return;
    }

    const produtosFiltrados = subcategoria
      ? produtosDaCategoria.filter(produto => produto.nome === subcategoria)
      : [];

    preencherTextosCatalogo({
      titulo: categoria,
      tag: `Categoria: ${categoria}`,
      descricao: subcategoria
        ? `Filtro selecionado: ${subcategoria}. Abra a página individual para ver as opções disponíveis.`
        : "Primeiro escolha um filtro abaixo para depois ver somente os produtos dessa seleção.",
      aviso: subcategoria
        ? `Filtro ativo: <b>${subcategoria}</b>. Agora veja apenas os produtos dessa seleção.`
        : `Escolha um <b>filtro</b> para liberar os produtos disponíveis dessa categoria.`,
      passo3: subcategoria ? "🛍️ Veja os produtos filtrados" : "🧩 Escolha um filtro",
      duvidaPreco: "O preço já está final?",
      duvidaPersonalizacao: "Esses produtos têm personalização?",
      duvidaComo: "Como compro?",
      ctaTitulo: subcategoria ? "Quer ver preço, tamanho e opções?" : "Escolha primeiro o tipo de produto",
      ctaTexto: subcategoria
        ? "Abra a página do produto e monte seu pedido do jeito certo."
        : "Use os botões de filtro para encontrar mais rápido o produto certo."
    });

    const botoesFiltro = document.createElement("div");
    botoesFiltro.className = "filtros-produtos-extras";

    const tituloFiltros = document.createElement("div");
    tituloFiltros.className = "filtros-produtos-extras-topo";
    tituloFiltros.innerHTML = `
      <h3>Filtrar ${escaparHTML(categoria)}</h3>
      <p>Selecione um botão para mostrar só o tipo de produto que você quer ver.</p>
    `;
    botoesFiltro.appendChild(tituloFiltros);

    const gradeFiltros = document.createElement("div");
    gradeFiltros.className = "grid filtros-produtos-extras-grid";

    produtosDaCategoria.forEach(produto => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = `card filtro-produto-btn${subcategoria === produto.nome ? " ativo" : ""}`;
      botao.innerHTML = `<span>${escaparHTML(produto.nome)}</span>`;
      botao.addEventListener("click", () => abrirSubcategoriaProdutoExtra(categoria, produto.nome));
      gradeFiltros.appendChild(botao);
    });

    botoesFiltro.appendChild(gradeFiltros);
    container.appendChild(botoesFiltro);

    if (!subcategoria) {
      const avisoFiltro = document.createElement("div");
      avisoFiltro.className = "aviso-sem-produtos-filtrados";
      avisoFiltro.innerHTML = "Escolha um dos filtros acima para ver os produtos disponíveis dessa seleção.";
      container.appendChild(avisoFiltro);

      requestAnimationFrame(() => {
        const alvoModelos = document.getElementById("modelosDisponiveis");
        if (alvoModelos) {
          alvoModelos.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
      return;
    }

    if (!produtosFiltrados.length) {
      const avisoFiltro = document.createElement("div");
      avisoFiltro.className = "aviso-sem-produtos-filtrados";
      avisoFiltro.innerHTML = "Nenhum produto foi encontrado para esse filtro.";
      container.appendChild(avisoFiltro);
      return;
    }

    produtosFiltrados.forEach(produto => {
      container.appendChild(criarCardProdutoExtra(produto, categoria));
    });

    if (localStorage.getItem("scrollParaModelosDisponiveis") === "1") {
      localStorage.removeItem("scrollParaModelosDisponiveis");

      requestAnimationFrame(() => {
        const alvoModelos = document.getElementById("modelosDisponiveis");
        if (alvoModelos) {
          alvoModelos.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }

    return;
  }

  preencherTextosCatalogo({
    titulo: time,
    tag: "Catálogo de camisas",
    descricao: "Escolha o modelo, abra a página individual e configure versão, tamanho e extras para ver o preço exato.",
    aviso: `Escolha sua camisa e <b>configure o preço exato</b> na página do produto`,
    passo3: "🎨 Adicione personalização",
    duvidaPreco: "O preço já está final?",
    duvidaPersonalizacao: "Posso personalizar?",
    duvidaComo: "Como compro?",
    ctaTitulo: "Quer ver preços, tamanhos e extras?",
    ctaTexto: "Abra a página da camisa e monte seu pedido do jeito certo."
  });

  montarCamisasDoTime(time).forEach(camisa => {
    container.appendChild(criarCardCamisa(camisa));
  });
}

function normalizarBusca(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function criarIndiceBusca() {
  const itens = [];

  TIMES_DISPONIVEIS.forEach(time => {
    const camisas = montarCamisasDoTime(time);

    itens.push({
      tipo: "time",
      titulo: time,
      subtitulo: "Abrir catálogo do time",
      busca: `${time} ${camisas.map(item => item.nome).join(" ")}`,
      acao: () => abrirTime(time)
    });

    camisas.forEach(camisa => {
      itens.push({
        tipo: "camisa",
        titulo: camisa.nome,
        subtitulo: `${time} • Camisa tailandesa`,
        busca: `${camisa.nome} ${time} camisa uniforme home away third retro retrô`,
        acao: () => abrirProduto(camisa.nome, camisa.img)
      });
    });
  });

  Object.entries(catalogoProdutosExtras).forEach(([categoria, produtos]) => {
    itens.push({
      tipo: "categoria",
      titulo: categoria,
      subtitulo: "Abrir categoria",
      busca: `${categoria} ${produtos.map(item => item.nome).join(" ")}`,
      acao: () => abrirCategoria(categoria)
    });

    produtos.forEach(produto => {
      itens.push({
        tipo: "produto",
        titulo: produto.nome,
        subtitulo: `${categoria} • ${produto.descricao}`,
        busca: `${produto.nome} ${produto.descricao} ${categoria}`,
        acao: () => abrirProduto(produto.nome, produto.img, categoria)
      });
    });
  });

  return itens.map(item => ({
    ...item,
    buscaNormalizada: normalizarBusca(item.busca),
    tituloNormalizado: normalizarBusca(item.titulo)
  }));
}

function pontuarResultadoBusca(item, termo, tokens) {
  let pontos = 0;

  if (!termo) return pontos;
  if (item.tituloNormalizado === termo) pontos += 200;
  if (item.tituloNormalizado.startsWith(termo)) pontos += 120;
  if (item.buscaNormalizada.includes(termo)) pontos += 60;

  const tokensEncontrados = tokens.filter(token => item.buscaNormalizada.includes(token));
  pontos += tokensEncontrados.length * 25;

  if (tokens.length > 1 && tokens.every(token => item.tituloNormalizado.includes(token))) {
    pontos += 80;
  }

  if (item.tipo === "camisa" && /(camisa|home|away|third|retro|retrô)/.test(termo)) {
    pontos += 20;
  }

  if (item.tipo === "time" && tokens.length === 1 && item.tituloNormalizado.includes(tokens[0])) {
    pontos += 30;
  }

  return pontos;
}

function renderizarResultadosBusca(resultados, termo) {
  const caixa = document.getElementById("resultadosBusca");
  if (!caixa) return;

  if (!termo) {
    caixa.innerHTML = "";
    caixa.classList.remove("ativo");
    return;
  }

  if (!resultados.length) {
    caixa.innerHTML = '<div class="resultado-busca-vazio">Nada encontrado. Tente pesquisar por time, modelo ou categoria.</div>';
    caixa.classList.add("ativo");
    return;
  }

  caixa.innerHTML = resultados.map((item, index) => `
    <button class="resultado-busca-item" type="button" data-resultado-busca="${index}">
      <span class="resultado-busca-titulo">${escaparHTML(item.titulo)}</span>
      <span class="resultado-busca-info">${escaparHTML(item.subtitulo)}</span>
    </button>
  `).join("");

  caixa.classList.add("ativo");

  caixa.querySelectorAll("[data-resultado-busca]").forEach(botao => {
    botao.addEventListener("click", () => {
      const item = resultados[Number(botao.dataset.resultadoBusca)];
      if (!item) return;
      caixa.classList.remove("ativo");
      item.acao();
    });
  });
}

function carregarPesquisa() {
  const input = document.getElementById("buscaInteligente");
  const caixa = document.getElementById("resultadosBusca");
  if (!input || !caixa) return;

  const indiceBusca = criarIndiceBusca();
  let ultimosResultados = [];

  function atualizarBusca() {
    const termo = normalizarBusca(input.value);
    const tokens = termo.split(" ").filter(Boolean);

    if (!termo) {
      ultimosResultados = [];
      renderizarResultadosBusca([], termo);
      return;
    }

    ultimosResultados = indiceBusca
      .map(item => ({ ...item, pontuacao: pontuarResultadoBusca(item, termo, tokens) }))
      .filter(item => item.pontuacao > 0)
      .sort((a, b) => b.pontuacao - a.pontuacao)
      .slice(0, 8);

    renderizarResultadosBusca(ultimosResultados, termo);
  }

  input.addEventListener("input", atualizarBusca);

  input.addEventListener("keydown", event => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (ultimosResultados[0]) {
        caixa.classList.remove("ativo");
        ultimosResultados[0].acao();
      }
    }
  });

  document.addEventListener("click", event => {
    if (!event.target.closest(".busca-inteligente")) {
      caixa.classList.remove("ativo");
    }
  });

  input.addEventListener("focus", () => {
    if (caixa.innerHTML.trim()) {
      caixa.classList.add("ativo");
    }
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

  const preco = calcularPrecoProduto(nome, versao, tamanho, { nomeNumero, patch, patrocinadores });

  if (!preco) {
    precoEl.textContent = "Tamanho indisponível para essa versão";
    precoInfoEl.textContent = "Escolha outra combinação.";
    if (btnCarrinho) btnCarrinho.disabled = true;
    if (btnWhats) btnWhats.disabled = true;
    return;
  }

  preencherTopoProduto({
    tag: "Produto selecionado",
    titulo: "Configure sua camisa do jeito certo",
    infoPreco: "O valor muda conforme versão, tamanho e extras escolhidos",
    infoPedido: "Você escolhe tudo aqui e envia já pronto no WhatsApp",
    ctaTitulo: "Precisa de ajuda com tamanho ou personalização?",
    ctaTexto: "Chame no WhatsApp e fale diretamente com o vendedor.",
    listaInfo: [
      "Versão torcedor e jogador têm preços diferentes",
      "G3 e G4 podem alterar o valor",
      "Nome, número, patch e patrocinadores são cobrados separadamente",
      "Parcelado aumenta 10% no valor total"
    ],
    listaComoFunciona: [
      "Escolha versão e tamanho",
      "Marque os extras que quiser",
      "Veja o preço calculado na hora",
      "Envie no WhatsApp para confirmar"
    ]
  });

  const opcoes = obterOpcoesProduto(nome);
  const versaoObj = opcoes.versoes.find(item => item.valor === versao);
  const versaoLabel = versaoObj ? versaoObj.label : versao;

  precoEl.textContent = formatarPreco(preco);
  precoInfoEl.textContent = "Preço calculado conforme versão, tamanho e extras escolhidos.";

  if (btnCarrinho) {
    btnCarrinho.disabled = false;
    btnCarrinho.onclick = () => adicionarCarrinho(nome, img, { versao, versaoLabel, tamanho, nomeNumero, patch, patrocinadores, preco });
  }

  if (btnWhats) {
    btnWhats.disabled = false;
    btnWhats.onclick = () => enviarWhats(nome, img, { versao, versaoLabel, tamanho, nomeNumero, patch, patrocinadores, preco });
  }
}

function atualizarPrecoTelaProdutoExtra(produto, categoria) {
  if (ehCategoriaFeminina(categoria)) {
    atualizarPrecoTelaProduto(produto.nome, produto.img);
    return;
  }

  const tamanhoSelect = document.getElementById("produtoTamanho");
  const versaoSelect = document.getElementById("produtoVersao");
  const precoEl = document.getElementById("precoDinamico");
  const precoInfoEl = document.getElementById("precoInfoTexto");
  const btnCarrinho = document.getElementById("btnProdutoCarrinho");
  const btnWhats = document.getElementById("btnProdutoWhats");

  let preco = produto.precoBase;
  let versaoLabel = "";
  let tamanho = "";

  if (versaoSelect) {
    versaoLabel = versaoSelect.options[versaoSelect.selectedIndex].text;
  }

  if (tamanhoSelect) {
    tamanho = tamanhoSelect.value;
  }

  if (produto.somenteConsulta || preco === null || preco === undefined) {
    precoEl.textContent = "Consulte disponibilidade";
    precoInfoEl.textContent = "Os modelos femininos serão confirmados direto no WhatsApp.";

    if (btnCarrinho) {
      btnCarrinho.disabled = false;
      btnCarrinho.onclick = () => adicionarCarrinho(produto.nome, produto.img, { versaoLabel: "Sob consulta", tamanho: tamanho || "" }, categoria);
    }

    if (btnWhats) {
      btnWhats.disabled = false;
      btnWhats.onclick = () => enviarWhats(produto.nome, produto.img, { versaoLabel: "Sob consulta", tamanho: tamanho || "" }, categoria);
    }

    return;
  }

  precoEl.textContent = formatarPreco(preco);
  precoInfoEl.textContent = versaoLabel || tamanho
    ? "Preço conforme a opção exibida no catálogo."
    : "Preço fixo conforme o catálogo.";

  const detalhes = { preco };
  if (versaoLabel) detalhes.versaoLabel = versaoLabel;
  if (tamanho) detalhes.tamanho = tamanho;

  if (btnCarrinho) {
    btnCarrinho.disabled = false;
    btnCarrinho.onclick = () => adicionarCarrinho(produto.nome, produto.img, detalhes, categoria);
  }

  if (btnWhats) {
    btnWhats.disabled = false;
    btnWhats.onclick = () => enviarWhats(produto.nome, produto.img, detalhes, categoria);
  }
}

function criarBlocoOpcoesProdutoExtra(produto) {
  const blocos = [];

  if (produto.tamanhos?.length) {
    const tamanhosHTML = produto.tamanhos.map(tamanho => `<option value="${escaparHTML(tamanho)}">${escaparHTML(tamanho)}</option>`).join("");
    blocos.push(`
      <label>
        Tamanho
        <select id="produtoTamanho">${tamanhosHTML}</select>
      </label>
    `);
  }

  return blocos.length ? `<div class="produto-configuracoes">${blocos.join("")}</div>` : "";
}


function preencherTopoProduto(config) {
  const mapa = {
    tagProdutoTopo: config.tag,
    tituloProdutoTopo: config.titulo,
    textoInfoPrecoTopo: config.infoPreco,
    textoInfoPedidoTopo: config.infoPedido,
    ctaProdutoTitulo: config.ctaTitulo,
    ctaProdutoTexto: config.ctaTexto
  };

  Object.entries(mapa).forEach(([id, valor]) => {
    const el = document.getElementById(id);
    if (el && valor) el.textContent = valor;
  });

  const infoImportante = document.getElementById("listaInfoImportanteProduto");
  if (infoImportante && config.listaInfo) {
    infoImportante.innerHTML = config.listaInfo.map(item => `<li>${escaparHTML(item)}</li>`).join("");
  }

  const comoFunciona = document.getElementById("listaComoFuncionaProduto");
  if (comoFunciona && config.listaComoFunciona) {
    comoFunciona.innerHTML = config.listaComoFunciona.map(item => `<li>${escaparHTML(item)}</li>`).join("");
  }
}

function carregarPaginaProdutoExtra(nome, img, categoria) {
  const container = document.getElementById("produto");
  const produto = obterProdutoExtra(categoria, nome);

  if (!container || !produto) return;

  if (ehCategoriaFeminina(categoria)) {
    carregarPaginaProdutoCamisaFeminina(produto.nome, produto.img, categoria);
    return;
  }

  preencherTopoProduto({
    tag: `Categoria: ${categoria}`,
    titulo: `Configure seu produto do jeito certo`,
    infoPreco: produto.somenteConsulta ? "O valor e os modelos serão confirmados no WhatsApp" : "O valor segue o catálogo informado",
    infoPedido: "Você escolhe o produto aqui e envia já pronto no WhatsApp",
    ctaTitulo: "Precisa de ajuda com esse produto?",
    ctaTexto: "Chame no WhatsApp e fale diretamente com o vendedor.",
    listaInfo: [
      "O valor segue o catálogo informado",
      "Tamanhos aparecem apenas quando foram informados",
      "Parcelado aumenta 10% no valor total",
      "Pedido finalizado direto no WhatsApp"
    ],
    listaComoFunciona: [
      "Abra o modelo desejado",
      "Escolha as opções exibidas",
      "Veja o valor na hora ou consulte disponibilidade",
      "Envie no WhatsApp para confirmar"
    ]
  });

  const opcoesHTML = criarBlocoOpcoesProdutoExtra(produto);
  const precoInicial = produto.somenteConsulta || produto.precoBase === null || produto.precoBase === undefined
    ? "Consulte disponibilidade"
    : formatarPreco(produto.precoBase);

  container.innerHTML = `
    <div class="produto-layout">
      <div class="produto-card">
        <img src="${escaparHTML(img)}" alt="${escaparHTML(nome)}" class="produto-imagem">
      </div>

      <div class="produto-info">
        <h2>${escaparHTML(nome)}</h2>
        <p>${escaparHTML(produto.descricao)}</p>

        <div class="bloco-preco-produto">
          <div class="preco-destaque" id="precoDinamico">${escaparHTML(precoInicial)}</div>
          <small id="precoInfoTexto">${produto.somenteConsulta ? "Os modelos serão confirmados no WhatsApp." : "Preço conforme o catálogo informado."}</small>
        </div>

        ${opcoesHTML}

        <div class="produto-acoes">
          <button id="btnProdutoCarrinho" type="button">Adicionar ao carrinho</button>
          <button id="btnProdutoWhats" type="button">Comprar no WhatsApp</button>
        </div>

        <ul class="produto-destaques">
          <li>Preço seguindo o catálogo informado</li>
          <li>Consulte frete pelo CEP</li>
          <li>Parcelado aumenta 10% no valor total</li>
          <li>Pedido finalizado direto no WhatsApp</li>
        </ul>
      </div>
    </div>

    <div id="areaAvaliacoes"></div>
  `;

  [document.getElementById("produtoVersao"), document.getElementById("produtoTamanho")].forEach(campo => {
    if (campo) campo.addEventListener("change", () => atualizarPrecoTelaProdutoExtra(produto, categoria));
  });

  atualizarPrecoTelaProdutoExtra(produto, categoria);
  const areaAvaliacoes = document.getElementById("areaAvaliacoes");
  if (areaAvaliacoes) areaAvaliacoes.innerHTML = "";
}

function carregarPaginaProdutoCamisaFeminina(nome, img, categoria = "Feminino") {
  const container = document.getElementById("produto");
  if (!container) return;

  const opcoes = obterOpcoesProduto(nome);
  const versoesHTML = opcoes.versoes.map(item => `<option value="${escaparHTML(item.valor)}">${escaparHTML(item.label)}</option>`).join("");
  const tamanhosHTML = opcoes.tamanhos.map(tamanho => `<option value="${escaparHTML(tamanho)}">${escaparHTML(tamanho)}</option>`).join("");
  const precoInicial = calcularPrecoProduto(nome, opcoes.versoes[0].valor, opcoes.tamanhos[0], {});

  preencherTopoProduto({
    tag: `Categoria: ${categoria}`,
    titulo: "Configure sua camisa do jeito certo",
    infoPreco: "Os valores são os mesmos das camisas masculinas",
    infoPedido: "Você escolhe tudo aqui e envia já pronto no WhatsApp",
    ctaTitulo: "Precisa de ajuda com tamanho ou personalização?",
    ctaTexto: "Chame no WhatsApp e fale diretamente com o vendedor.",
    listaInfo: [
      "Camisas femininas seguem os mesmos valores das masculinas",
      "Versão torcedor e jogador têm preços diferentes",
      "Nome, número, patch e patrocinadores são cobrados separadamente",
      "Parcelado aumenta 10% no valor total"
    ],
    listaComoFunciona: [
      "Escolha versão e tamanho",
      "Marque os extras que quiser",
      "Veja o preço calculado na hora",
      "Envie no WhatsApp para confirmar"
    ]
  });

  container.innerHTML = `
    <div class="produto-layout">
      <div class="produto-card">
        <img src="${escaparHTML(img)}" alt="${escaparHTML(nome)}" class="produto-imagem">
      </div>

      <div class="produto-info">
        <h2>${escaparHTML(nome)}</h2>
        <p>Camisa feminina tailandesa premium</p>

        <div class="bloco-preco-produto">
          <div class="preco-destaque" id="precoDinamico">${formatarPreco(precoInicial)}</div>
          <small id="precoInfoTexto">Preço calculado conforme versão, tamanho e extras escolhidos.</small>
        </div>

        <div class="produto-configuracoes">
          <label>
            Versão
            <select id="produtoVersao">${versoesHTML}</select>
          </label>

          <label>
            Tamanho
            <select id="produtoTamanho">${tamanhosHTML}</select>
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

  [
    document.getElementById("produtoVersao"),
    document.getElementById("produtoTamanho"),
    document.getElementById("extraNomeNumero"),
    document.getElementById("extraPatch"),
    document.getElementById("extraPatrocinadores")
  ].forEach(campo => {
    if (campo) campo.addEventListener("change", () => atualizarPrecoTelaProduto(nome, img));
  });

  atualizarPrecoTelaProduto(nome, img);
  renderizarAvaliacoes(nome);
}

function carregarPaginaProduto() {
  const container = document.getElementById("produto");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id") || "";
  let nome = urlParams.get("nome");
  let img = urlParams.get("img");
  let categoria = urlParams.get("categoria") || "";

  if (id) {
    const produtoExtra = obterProdutoExtraPorId(id);
    if (produtoExtra) {
      carregarPaginaProdutoExtra(produtoExtra.nome, produtoExtra.img, produtoExtra.categoria);
      return;
    }

    const camisa = buscarCamisaPorId(id);
    if (camisa) {
      nome = camisa.nome;
      img = camisa.img;
      categoria = "";
    }
  }

  if (!nome || !img) {
    container.innerHTML = `
      <div class="produto-card">
        <h2>Produto não encontrado</h2>
        <p>Volte e escolha um produto novamente.</p>
      </div>
    `;
    return;
  }

  if (categoria && catalogoProdutosExtras[categoria]) {
    carregarPaginaProdutoExtra(nome, img, categoria);
    return;
  }

  const opcoes = obterOpcoesProduto(nome);
  const versoesHTML = opcoes.versoes.map(item => `<option value="${escaparHTML(item.valor)}">${escaparHTML(item.label)}</option>`).join("");
  const tamanhosHTML = opcoes.tamanhos.map(tamanho => `<option value="${escaparHTML(tamanho)}">${escaparHTML(tamanho)}</option>`).join("");
  const precoInicial = calcularPrecoProduto(nome, opcoes.versoes[0].valor, opcoes.tamanhos[0], {});

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
            <select id="produtoVersao">${versoesHTML}</select>
          </label>

          <label>
            Tamanho
            <select id="produtoTamanho">${tamanhosHTML}</select>
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

  [
    document.getElementById("produtoVersao"),
    document.getElementById("produtoTamanho"),
    document.getElementById("extraNomeNumero"),
    document.getElementById("extraPatch"),
    document.getElementById("extraPatrocinadores")
  ].forEach(campo => {
    if (campo) campo.addEventListener("change", () => atualizarPrecoTelaProduto(nome, img));
  });

  atualizarPrecoTelaProduto(nome, img);
  renderizarAvaliacoes(nome);
}

function carregarOutrosProdutosHome() {
  const container = document.getElementById("outrosProdutos");
  if (!container) return;

  const categorias = Object.keys(catalogoProdutosExtras);
  container.innerHTML = "";

  categorias.forEach(categoria => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = categoria;
    card.addEventListener("click", () => abrirCategoria(categoria));
    container.appendChild(card);
  });
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    fecharCarrinho();
    fecharModalEntrega();
  }
});

carregarOutrosProdutosHome();
carregarPaginaCamisas();
carregarPesquisa();
carregarPaginaProduto();
atualizarCarrinho();
