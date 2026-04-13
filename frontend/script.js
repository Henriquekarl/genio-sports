
const numeroVendedor = "5511942257565";
const PRECO_TABELA_PERSONALIZACAO = Object.freeze({ nome: 40, numero: 40, patch: 30, patrocinadores: 80 });
const API_BASE = window.location.origin;
const ADMIN_PAGE = "admin-estoque.html";

const AUTH_STORAGE_KEY = "genioSportsAuthToken";

const authState = {
  token: localStorage.getItem(AUTH_STORAGE_KEY) || "",
  user: null,
  loading: null,
  orders: []
};

function salvarTokenAuth(token) {
  authState.token = String(token || "").trim();
  if (authState.token) {
    localStorage.setItem(AUTH_STORAGE_KEY, authState.token);
  } else {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }
}

function limparSessaoAuth() {
  salvarTokenAuth("");
  authState.user = null;
  authState.orders = [];
}

function obterHeadersAuth(headers = {}) {
  const resultado = { ...headers };
  if (authState.token) {
    resultado.Authorization = `Bearer ${authState.token}`;
  }
  return resultado;
}

async function apiFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: obterHeadersAuth(options.headers || {})
  });

  if (response.status === 401 && authState.token) {
    limparSessaoAuth();
    atualizarInterfaceAuth();
  }

  return response;
}

function usuarioAtualEhAdmin() {
  return authState.user?.role === "admin";
}
function usuarioEstaLogado() {
  return Boolean(authState.user && authState.token);
}

function exigirLoginParaComprar(modo = "register") {
  if (usuarioEstaLogado()) return true;
  abrirModalAuth(modo);
  return false;
}


function obterNomePrimeiroUsuario() {
  if (!authState.user?.name) return "Conta";
  return authState.user.name.trim().split(/\s+/)[0] || "Conta";
}

function fecharModalAuth() {
  const modal = document.querySelector("[data-auth-modal]");
  if (!modal) return;
  fecharElementoAnimado(modal, "is-open", () => {
    document.body.classList.remove("auth-modal-open");
  });
}

function abrirModalAuth(modo = "login") {
  const modal = document.querySelector("[data-auth-modal]");
  if (!modal) return;
  modal.dataset.mode = modo;
  document.body.classList.add("auth-modal-open");
  alternarModoAuthModal(modo);
  abrirElementoAnimado(modal, "is-open");
}

function alternarModoAuthModal(modo = "login") {
  const modal = document.querySelector("[data-auth-modal]");
  if (!modal) return;
  modal.dataset.mode = modo;

  const titulo = modal.querySelector(".auth-modal-header h2");
  if (titulo) {
    if (modo === "register") {
      titulo.textContent = "Faça seu cadastro para continuar";
    } else if (modo === "reset") {
      titulo.textContent = "Recupere sua senha";
    } else {
      titulo.textContent = "Entre na sua conta";
    }
  }

  modal.querySelectorAll("[data-auth-panel]").forEach((painel) => {
    painel.hidden = painel.dataset.authPanel !== modo;
  });

  const feedback = modal.querySelector("#authFeedbackGlobal");
  if (feedback) feedback.textContent = "";

  const followup = modal.querySelector(".auth-reset-followup");
  if (followup && modo !== "reset") {
    followup.hidden = true;
  }
}


function formatarDataHora(valor) {
  if (!valor) return "Sem data";

  const texto = String(valor).trim();
  if (!texto) return "Sem data";

  const data = new Date(texto.includes("T") ? texto : texto.replace(" ", "T"));
  if (Number.isNaN(data.getTime())) return texto;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(data);
}

function fecharModalConta() {
  const modal = document.querySelector("[data-account-modal]");
  if (!modal) return;
  fecharElementoAnimado(modal, "is-open", () => {
    document.body.classList.remove("auth-modal-open");
  });
}

function abrirModalConta() {
  const modal = document.querySelector("[data-account-modal]");
  if (!modal || !authState.user) return;
  document.body.classList.add("auth-modal-open");
  preencherResumoMinhaConta();
  carregarPedidosMinhaConta();
  abrirElementoAnimado(modal, "is-open");
}

function preencherResumoMinhaConta() {
  const nome = document.querySelector("[data-account-name]");
  const email = document.querySelector("[data-account-email]");
  const perfil = document.querySelector("[data-account-role]");
  if (nome) nome.textContent = authState.user?.name || "-";
  if (email) email.textContent = authState.user?.email || "-";
  if (perfil) perfil.textContent = usuarioAtualEhAdmin() ? "Admin" : "Cliente";
}

function renderizarPedidosMinhaConta() {
  const lista = document.querySelector("[data-account-orders]");
  if (!lista) return;

  if (!authState.user) {
    lista.innerHTML = '<p class="account-empty">Faça login para ver seus pedidos.</p>';
    return;
  }

  if (!Array.isArray(authState.orders) || !authState.orders.length) {
    lista.innerHTML = '<p class="account-empty">Você ainda não tem pedidos salvos na sua conta.</p>';
    return;
  }

  lista.innerHTML = authState.orders.map((pedido) => {
    const itensHtml = Array.isArray(pedido.items)
      ? pedido.items.map((item) => {
          const partes = [
            item.productName || "Produto",
            item.size ? `Tamanho: ${item.size}` : "",
            item.versionLabel ? `Opção: ${item.versionLabel}` : "",
            Number(item.quantity || 1) > 1 ? `Qtd: ${Number(item.quantity || 1)}` : "",
            item.price ? `Preço: ${formatarPreco(Number(item.price || 0))}` : ""
          ].filter(Boolean);

          return `<li>${escaparHTML(partes.join(" • "))}</li>`;
        }).join("")
      : "";

    const endereco = [
      pedido.street ? `${pedido.street}, ${pedido.number}` : "",
      pedido.neighborhood || "",
      pedido.city && pedido.state ? `${pedido.city} - ${pedido.state}` : ""
    ].filter(Boolean).join(" • ");

    return `
      <article class="account-order-card">
        <div class="account-order-top">
          <strong>Pedido #${escaparHTML(String(pedido.id))}</strong>
          <span>${escaparHTML(formatarDataHora(pedido.createdAt))}</span>
        </div>
        <ul class="account-order-items">${itensHtml}</ul>
        ${endereco ? `<p class="account-order-address">${escaparHTML(endereco)}</p>` : ""}
      </article>
    `;
  }).join("");
}

async function carregarPedidosMinhaConta() {
  const lista = document.querySelector("[data-account-orders]");
  if (!lista || !authState.user) return;

  lista.innerHTML = '<p class="account-empty">Carregando pedidos...</p>';

  try {
    const response = await apiFetch(`${API_BASE}/api/orders/my`);
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error || "Não foi possível carregar seus pedidos.");
    authState.orders = Array.isArray(data?.orders) ? data.orders : [];
    renderizarPedidosMinhaConta();
  } catch (error) {
    lista.innerHTML = `<p class="account-empty">${escaparHTML(error.message || "Não foi possível carregar seus pedidos.")}</p>`;
  }
}

function montarModalConta() {
  if (document.querySelector("[data-account-modal]")) return;

  const modal = document.createElement("div");
  modal.className = "auth-modal";
  modal.hidden = true;
  modal.setAttribute("data-account-modal", "true");
  modal.innerHTML = `
    <div class="auth-modal-backdrop" data-account-close></div>
    <div class="auth-modal-card auth-modal-card-wide" role="dialog" aria-modal="true" aria-label="Minha conta">
      <button type="button" class="auth-modal-close" data-account-close aria-label="Fechar">×</button>
      <div class="auth-modal-header">
        <p class="auth-modal-kicker">Minha conta</p>
        <h2>Seus dados e pedidos</h2>
        <p class="auth-feedback-global" data-account-feedback></p>
      </div>

      <div class="account-grid">
        <section class="account-panel">
          <h3>Resumo da conta</h3>
          <div class="account-summary">
            <p><strong>Nome:</strong> <span data-account-name>-</span></p>
            <p><strong>E-mail:</strong> <span data-account-email>-</span></p>
            <p><strong>Perfil:</strong> <span data-account-role>-</span></p>
          </div>

          <form id="formTrocarSenha" class="auth-form">
            <h3>Trocar senha</h3>
            <label><span>Senha atual</span><input type="password" id="accountCurrentPassword" required minlength="6" /></label>
            <label><span>Nova senha</span><input type="password" id="accountNewPassword" required minlength="6" /></label>
            <button type="submit" class="botao-principal auth-submit">Salvar nova senha</button>
          </form>

          <div class="account-actions">
            <button type="button" class="botao-secundario" data-account-open-admin>Ir para o admin</button>
            <button type="button" class="botao-secundario" data-account-logout>Sair</button>
          </div>
        </section>

        <section class="account-panel">
          <div class="account-panel-head">
            <h3>Histórico de pedidos</h3>
            <button type="button" class="botao-secundario" data-account-refresh>Atualizar</button>
          </div>
          <div data-account-orders class="account-orders"></div>
        </section>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const feedback = modal.querySelector("[data-account-feedback]");
  const setFeedback = (message = "", isError = false) => {
    feedback.textContent = message;
    feedback.dataset.error = isError ? "true" : "false";
  };

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-account-close]")) {
      fecharModalConta();
      return;
    }

    if (event.target.closest("[data-account-refresh]")) {
      carregarPedidosMinhaConta();
      return;
    }

    if (event.target.closest("[data-account-logout]")) {
      fecharModalConta();
      logoutAuth();
      return;
    }

    if (event.target.closest("[data-account-open-admin]")) {
      if (!usuarioAtualEhAdmin()) {
        setFeedback("Seu usuário não tem acesso ao painel admin.", true);
        return;
      }
      window.location.href = ADMIN_PAGE;
    }
  });

  modal.querySelector("#formTrocarSenha")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const currentPassword = modal.querySelector("#accountCurrentPassword")?.value || "";
    const newPassword = modal.querySelector("#accountNewPassword")?.value || "";
    setFeedback("Salvando nova senha...");

    try {
      const response = await apiFetch(`${API_BASE}/api/auth/me/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Não foi possível alterar a senha.");
      setFeedback("Senha alterada com sucesso.");
      event.target.reset();
    } catch (error) {
      setFeedback(error.message || "Não foi possível alterar a senha.", true);
    }
  });
}

function montarModalAuth() {
  if (document.querySelector("[data-auth-modal]")) return;

  const modal = document.createElement("div");
  modal.className = "auth-modal";
  modal.hidden = true;
  modal.setAttribute("data-auth-modal", "true");
  modal.innerHTML = `
    <div class="auth-modal-backdrop" data-auth-close></div>
    <div class="auth-modal-card" role="dialog" aria-modal="true" aria-label="Entrar ou cadastrar">
      <button type="button" class="auth-modal-close" data-auth-close aria-label="Fechar">×</button>
      <div class="auth-modal-header">
        <p class="auth-modal-kicker">Área do cliente</p>
        <h2>Faça seu cadastro para continuar</h2>
        <p id="authFeedbackGlobal" class="auth-feedback-global"></p>
      </div>

      <section data-auth-panel="login">
        <form id="authLoginForm" class="auth-form">
          <label><span>E-mail</span><input type="email" id="authLoginEmail" required /></label>
          <label><span>Senha</span><input type="password" id="authLoginPassword" required minlength="6" /></label>
          <button type="submit" class="botao-principal auth-submit">Entrar</button>
        </form>

        <div class="auth-inline-actions">
          <p class="auth-switch-text">Ainda não tem conta? <button type="button" class="auth-link-button" data-auth-switch="register">Criar cadastro</button></p>
          <p class="auth-switch-text">Esqueceu a senha? <button type="button" class="auth-link-button" data-auth-switch="reset">Recuperar agora</button></p>
        </div>
      </section>

      <section data-auth-panel="register" hidden>
        <form id="authRegisterForm" class="auth-form">
          <label><span>Nome</span><input type="text" id="authRegisterName" required /></label>
          <label><span>E-mail</span><input type="email" id="authRegisterEmail" required /></label>
          <label><span>Senha</span><input type="password" id="authRegisterPassword" required minlength="6" /></label>
          <button type="submit" class="botao-principal auth-submit">Criar conta</button>
        </form>
        <p class="auth-switch-text">Já tem conta? <button type="button" class="auth-link-button" data-auth-switch="login">Fazer login</button></p>
      </section>

      <section data-auth-panel="reset" hidden>
        <form id="authForgotForm" class="auth-form">
          <label><span>Seu e-mail</span><input type="email" id="authForgotEmail" required /></label>
          <button type="submit" class="botao-secundario auth-submit">Enviar código por e-mail</button>
        </form>

        <form id="authResetForm" class="auth-form auth-reset-followup" hidden>
          <label><span>Código recebido</span><input type="text" id="authResetToken" required maxlength="6" /></label>
          <label><span>Nova senha</span><input type="password" id="authResetPassword" required minlength="6" /></label>
          <button type="submit" class="botao-principal auth-submit">Salvar nova senha</button>
        </form>

        <p class="auth-switch-text">Lembrou a senha? <button type="button" class="auth-link-button" data-auth-switch="login">Voltar para login</button></p>
      </section>
    </div>
  `;

  document.body.appendChild(modal);

  modal.addEventListener("click", (event) => {
    if (event.target.closest("[data-auth-close]")) {
      fecharModalAuth();
      return;
    }

    const switchButton = event.target.closest("[data-auth-switch]");
    if (switchButton) {
      alternarModoAuthModal(switchButton.dataset.authSwitch);
      return;
    }

    if (event.target.closest('[data-auth-switch="reset"]')) {
      modal.querySelector("#authForgotEmail")?.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
      fecharModalAuth();
    }
    const modalConta = document.querySelector("[data-account-modal]");
    if (event.key === "Escape" && modalConta && !modalConta.hidden) {
      fecharModalConta();
    }
  });

  const feedback = modal.querySelector("#authFeedbackGlobal");
  const setFeedback = (message = "", isError = false) => {
    feedback.textContent = message;
    feedback.dataset.error = isError ? "true" : "false";
  };

  modal.querySelector("#authLoginForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = modal.querySelector("#authLoginEmail")?.value?.trim();
    const password = modal.querySelector("#authLoginPassword")?.value || "";
    setFeedback("Entrando...");

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Não foi possível entrar.");
      salvarTokenAuth(data.token);
      authState.user = data.user || null;
      atualizarInterfaceAuth();
      setFeedback("Login feito com sucesso.");
      fecharModalAuth();
      if (document.body.classList.contains("admin-body") && !usuarioAtualEhAdmin()) {
        window.location.href = "index.html";
      }
    } catch (error) {
      setFeedback(error.message || "Erro ao entrar.", true);
    }
  });

  modal.querySelector("#authRegisterForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = modal.querySelector("#authRegisterName")?.value?.trim();
    const email = modal.querySelector("#authRegisterEmail")?.value?.trim();
    const password = modal.querySelector("#authRegisterPassword")?.value || "";
    setFeedback("Criando conta...");

    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Não foi possível criar a conta.");
      salvarTokenAuth(data.token);
      authState.user = data.user || null;
      atualizarInterfaceAuth();
      setFeedback(data.user?.role === "admin" ? "Conta criada com acesso admin." : "Conta criada com sucesso.");
      fecharModalAuth();
    } catch (error) {
      setFeedback(error.message || "Erro ao criar conta.", true);
    }
  });

  modal.querySelector("#authForgotForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = modal.querySelector("#authForgotEmail")?.value?.trim();
    setFeedback("Enviando e-mail de recuperação...");

    try {
      const response = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Não foi possível enviar o e-mail de recuperação.");
      setFeedback(data?.message || "Se o e-mail existir, enviamos o código de redefinição.");
      const followup = modal.querySelector(".auth-reset-followup");
      if (followup) {
        followup.hidden = false;
      }
      modal.querySelector("#authResetToken")?.focus();
    } catch (error) {
      setFeedback(error.message || "Não foi possível enviar o e-mail de recuperação.", true);
    }
  });

  modal.querySelector("#authResetForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = modal.querySelector("#authForgotEmail")?.value?.trim();
    const token = modal.querySelector("#authResetToken")?.value?.trim();
    const newPassword = modal.querySelector("#authResetPassword")?.value || "";
    setFeedback("Salvando nova senha...");

    try {
      const response = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Não foi possível redefinir a senha.");
      setFeedback("Senha redefinida. Agora faça login.");
      modal.querySelector("#authLoginEmail").value = email || "";
      modal.querySelector("#authLoginPassword").value = "";
      const followup = modal.querySelector(".auth-reset-followup");
      if (followup) followup.hidden = true;
      alternarModoAuthModal("login");
    } catch (error) {
      setFeedback(error.message || "Não foi possível redefinir a senha.", true);
    }
  });
}

async function carregarUsuarioAtual(force = false) {
  if (!authState.token) {
    authState.user = null;
    return null;
  }

  if (!force && authState.user) {
    return authState.user;
  }

  if (!force && authState.loading) {
    return authState.loading;
  }

  authState.loading = (async () => {
    try {
      const response = await apiFetch(`${API_BASE}/api/auth/me`);
      if (!response.ok) {
        authState.user = null;
        return null;
      }
      const data = await response.json();
      authState.user = data.user || null;
      return authState.user;
    } catch {
      authState.user = null;
      return null;
    } finally {
      authState.loading = null;
    }
  })();

  return authState.loading;
}

async function logoutAuth() {
  try {
    if (authState.token) {
      await apiFetch(`${API_BASE}/api/auth/logout`, { method: "POST" });
    }
  } catch {}

  limparSessaoAuth();
  atualizarInterfaceAuth();
  if (document.body.classList.contains("admin-body")) {
    window.location.href = "index.html";
  }
}

function acessarPainelAdmin() {
  if (!usuarioAtualEhAdmin()) {
    abrirModalAuth("login");
    return;
  }
  window.location.href = ADMIN_PAGE;
}

async function protegerPaginaAdmin() {
  const estaNoAdmin = window.location.pathname.endsWith(`/${ADMIN_PAGE}`) || window.location.pathname.endsWith(ADMIN_PAGE);
  if (!estaNoAdmin) return true;

  await carregarUsuarioAtual();
  if (!usuarioAtualEhAdmin()) {
    window.location.href = "index.html";
    return false;
  }

  document.body.classList.add("admin-autorizado");
  return true;
}

function handleAuthEntryClick() {
  if (authState.user) {
    abrirModalConta();
    return;
  }
  abrirModalAuth("login");
}

function inserirAcessoAdminNoSite() {
  if (document.body.classList.contains("admin-body")) return;

  const menu = document.querySelector("nav.menu");
  if (!menu) return;

  if (!document.querySelector("[data-auth-entry]")) {
    const botaoConta = document.createElement("button");
    botaoConta.type = "button";
    botaoConta.className = "btn-admin-topo";
    botaoConta.textContent = "Entrar / Cadastrar";
    botaoConta.setAttribute("data-auth-entry", "true");
    botaoConta.addEventListener("click", handleAuthEntryClick);
    menu.appendChild(botaoConta);
  }

  const botaoSairExistente = document.querySelector("[data-auth-logout]");
  if (authState.user) {
    if (!botaoSairExistente) {
      const botaoSair = document.createElement("button");
      botaoSair.type = "button";
      botaoSair.className = "btn-admin-topo";
      botaoSair.textContent = "Sair";
      botaoSair.setAttribute("data-auth-logout", "true");
      botaoSair.addEventListener("click", logoutAuth);
      menu.appendChild(botaoSair);
    }
  } else if (botaoSairExistente) {
    botaoSairExistente.remove();
  }

  const botaoAdminExistente = document.querySelector("[data-admin-access]");
  if (usuarioAtualEhAdmin()) {
    if (!botaoAdminExistente) {
      const botaoAdmin = document.createElement("button");
      botaoAdmin.type = "button";
      botaoAdmin.className = "btn-admin-topo";
      botaoAdmin.textContent = "Admin";
      botaoAdmin.setAttribute("data-admin-access", "true");
      botaoAdmin.addEventListener("click", acessarPainelAdmin);
      menu.appendChild(botaoAdmin);
    }
  } else if (botaoAdminExistente) {
    botaoAdminExistente.remove();
  }
}

function atualizarInterfaceAuth() {
  const botaoConta = document.querySelector("[data-auth-entry]");
  const botaoSair = document.querySelector("[data-auth-logout]");
  const botaoAdmin = document.querySelector("[data-admin-access]");
  const botaoAdminConta = document.querySelector("[data-account-open-admin]");

  if (botaoConta) {
    if (authState.user) {
      botaoConta.textContent = `Minha conta (${obterNomePrimeiroUsuario()})`;
    } else {
      botaoConta.textContent = "Entrar / Cadastrar";
    }
  }

  if (authState.user) {
    inserirAcessoAdminNoSite();
  } else if (botaoSair) {
    botaoSair.remove();
  }

  if (usuarioAtualEhAdmin()) {
    inserirAcessoAdminNoSite();
  } else if (botaoAdmin) {
    botaoAdmin.remove();
  }

  if (botaoAdminConta) {
    botaoAdminConta.hidden = !usuarioAtualEhAdmin();
  }

  preencherResumoMinhaConta();
  renderizarPedidosMinhaConta();
}

function configurarAcoesPaginaAdmin() {
  if (!document.body.classList.contains("admin-body")) return;
  const voltarLoja = document.querySelector('.admin-topo-acoes a[href="/"]');
  if (voltarLoja) voltarLoja.setAttribute("href", "index.html");

  if (!document.querySelector("[data-admin-logout]")) {
    const acoes = document.querySelector(".admin-topo-acoes");
    if (acoes) {
      const botaoSair = document.createElement("button");
      botaoSair.type = "button";
      botaoSair.className = "botao-secundario";
      botaoSair.textContent = "Sair do admin";
      botaoSair.setAttribute("data-admin-logout", "true");
      botaoSair.addEventListener("click", logoutAuth);
      acoes.appendChild(botaoSair);
    }
  }
}

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

const placeholderCache = {};
let produtoAtualId = "";
let categoriaAtualProduto = "";

const catalogoApiState = {
  carregando: null,
  carregado: false,
  products: [],
  teams: [],
  teamDetails: [],
  categories: []
};

function criarImagemProduto(imageUrl, nome) {
  return imageUrl && String(imageUrl).trim() ? imageUrl : gerarImagemPlaceholder(nome);
}

function normalizarTimeApi(team = {}) {
  return {
    id: team.id,
    name: String(team.name || '').trim(),
    homeSection: String(team.homeSection || '').trim(),
    crestUrl: String(team.crestUrl || '').trim(),
    displayOrder: Number(team.displayOrder || 0),
    productCount: Number(team.productCount || 0)
  };
}

function obterMetaTime(nomeTime = '') {
  const nome = String(nomeTime || '').trim();
  if (!nome) return null;
  return (catalogoApiState.teamDetails || []).find((item) => item.name === nome) || null;
}

function criarImagemEscudoTime(time = {}, fallbackName = '') {
  const crest = String(time?.crestUrl || '').trim();
  return crest || gerarImagemPlaceholder(fallbackName || time?.name || 'Time');
}

function normalizarTamanhosProduto(tamanhos = []) {
  return Array.isArray(tamanhos)
    ? tamanhos.map((item) => {
        if (typeof item === "string") {
          return { size: item, stockQuantity: 1, available: true };
        }
        return {
          size: String(item?.size || "").trim().toUpperCase(),
          stockQuantity: Number(item?.stockQuantity || 0),
          available: item?.available !== undefined ? Boolean(item?.available) : Number(item?.stockQuantity || 0) > 0
        };
      }).filter((item) => item.size)
    : [];
}

function normalizarValorVersao(valor = '') {
  const bruto = String(valor || '').trim();
  if (!bruto) return '';

  const normalizado = normalizarTextoBusca(bruto).replace(/[_\s]+/g, '-');
  if (normalizado === 'jogador-manga-longa' || normalizado === 'manga-longa') return 'manga-longa';
  if (normalizado === 'torcedor') return 'torcedor';
  if (normalizado === 'jogador') return 'jogador';
  return bruto;
}

function normalizarLabelVersao(valor = '', label = '') {
  const versaoNormalizada = normalizarValorVersao(valor || label);
  if (versaoNormalizada === 'torcedor') return 'Versão Torcedor';
  if (versaoNormalizada === 'jogador') return 'Versão Jogador';
  if (versaoNormalizada === 'manga-longa') return 'Versão Manga Longa';
  return String(label || valor || '').trim();
}

function normalizarVersoesEstoque(versionOptions = []) {
  return Array.isArray(versionOptions)
    ? versionOptions.map((item) => ({
        value: normalizarValorVersao(item?.value || item?.versionValue || ''),
        label: normalizarLabelVersao(item?.value || item?.versionValue || '', item?.label || item?.versionLabel || item?.value || '')
      })).filter((item) => item.value && item.label)
    : [];
}

function normalizarStockEntriesProduto(stockEntries = []) {
  return Array.isArray(stockEntries)
    ? stockEntries.map((item) => ({
        versionValue: normalizarValorVersao(item?.versionValue || item?.version || ''),
        versionLabel: normalizarLabelVersao(item?.versionValue || item?.version || '', item?.versionLabel || item?.label || item?.versionValue || ''),
        size: String(item?.size || '').trim().toUpperCase(),
        stockQuantity: Number(item?.stockQuantity || 0),
        available: item?.available !== undefined ? Boolean(item.available) : Number(item?.stockQuantity || 0) > 0
      })).filter((item) => item.size)
    : [];
}

function agruparTamanhosPorEntradas(entries = []) {
  const mapa = new Map();
  normalizarStockEntriesProduto(entries).forEach((item) => {
    if (!mapa.has(item.size)) {
      mapa.set(item.size, { size: item.size, stockQuantity: 0, available: false });
    }
    const atual = mapa.get(item.size);
    atual.stockQuantity += Number(item.stockQuantity || 0);
    atual.available = atual.stockQuantity > 0;
  });
  return Array.from(mapa.values());
}

function construirVersoesAPartirDoEstoque(entries = []) {
  const mapa = new Map();
  normalizarStockEntriesProduto(entries).forEach((item) => {
    if (!item.versionValue || mapa.has(item.versionValue)) return;
    mapa.set(item.versionValue, { value: item.versionValue, label: item.versionLabel || item.versionValue });
  });
  return Array.from(mapa.values());
}

function produtoTemEstoquePorVersao(produto = {}) {
  return normalizarStockEntriesProduto(produto.stockEntries).some((item) => item.versionValue);
}

function obterVersoesProduto(produto = {}) {
  const versoes = normalizarVersoesEstoque(produto.versionOptions);
  return versoes.length ? versoes : construirVersoesAPartirDoEstoque(produto.stockEntries);
}

function obterVersaoInicialProduto(produto = {}) {
  return obterVersoesProduto(produto)[0]?.value || '';
}

function obterLabelVersaoProduto(produto = {}, versao = '') {
  if (!versao) return '';
  const versaoNormalizada = normalizarValorVersao(versao);
  return obterVersoesProduto(produto).find((item) => item.value === versaoNormalizada)?.label || normalizarLabelVersao(versaoNormalizada, versao);
}

function obterTamanhosAtivosProduto(produto = {}, versao = '') {
  if (!produtoTemEstoquePorVersao(produto)) {
    const entries = normalizarStockEntriesProduto(produto.stockEntries).filter((item) => !item.versionValue);
    return entries.length ? agruparTamanhosPorEntradas(entries) : normalizarTamanhosProduto(produto.tamanhos);
  }

  const versaoAtiva = normalizarValorVersao(versao || obterVersaoInicialProduto(produto));
  const filtrados = normalizarStockEntriesProduto(produto.stockEntries).filter((item) => item.versionValue === versaoAtiva);
  return agruparTamanhosPorEntradas(filtrados);
}

function normalizarSpecsProduto(specs = []) {
  return Array.isArray(specs)
    ? specs.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}

function normalizarOptionGroupsProduto(optionGroups = []) {
  return Array.isArray(optionGroups)
    ? optionGroups.map((group) => ({
        name: String(group?.name || "").trim(),
        type: String(group?.type || "single").trim() || "single",
        values: Array.isArray(group?.values)
          ? group.values.map((value) => ({
              value: String(value?.value || value?.label || "").trim(),
              label: String(value?.label || value?.value || "").trim(),
              priceAdjustment: Number(value?.priceAdjustment || 0)
            })).filter((value) => value.value && value.label)
          : []
      })).filter((group) => group.name && group.values.length)
    : [];
}

function normalizarCustomizacoesProduto(options = []) {
  const lista = Array.isArray(options)
    ? options.map((item) => ({
        key: String(item?.key || item?.label || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: String(item?.label || item?.key || "").trim(),
        priceAdjustment: Number(item?.priceAdjustment || 0)
      })).filter((item) => item.key && item.label)
    : [];

  const temNome = lista.some((item) => item.key === 'nome');
  const temNumero = lista.some((item) => item.key === 'numero');
  let normalizadas = lista.filter((item) => !['nome', 'numero', 'nome-numero'].includes(item.key));

  if (temNome || temNumero || lista.some((item) => item.key === 'nome-numero')) {
    normalizadas.unshift({
      key: 'nome-numero',
      label: 'Nome e número',
      priceAdjustment: PRECO_TABELA_PERSONALIZACAO.nome
    });
  }

  if (!normalizadas.some((item) => item.key === 'patch') && lista.some((item) => item.key === 'patch')) {
    normalizadas.push({ key: 'patch', label: 'Patch', priceAdjustment: PRECO_TABELA_PERSONALIZACAO.patch });
  }

  if (!normalizadas.some((item) => item.key === 'patrocinadores')) {
    normalizadas.push({ key: 'patrocinadores', label: 'Patrocinadores', priceAdjustment: PRECO_TABELA_PERSONALIZACAO.patrocinadores });
  }

  return normalizadas;
}

function mapearProdutoApi(produto) {
  const stockEntries = normalizarStockEntriesProduto(produto.stockEntries || []);
  const tamanhos = stockEntries.length ? agruparTamanhosPorEntradas(stockEntries) : normalizarTamanhosProduto(produto.sizes);
  const versionOptions = normalizarVersoesEstoque(produto.versionOptions || []);
  return {
    id: produto.id,
    nome: produto.name,
    descricao: produto.description || "Camisa tailandesa",
    img: criarImagemProduto(produto.imageUrl, produto.name),
    precoBase: Number(produto.basePrice || 0),
    tamanhos,
    stockEntries,
    versionOptions: versionOptions.length ? versionOptions : construirVersoesAPartirDoEstoque(stockEntries),
    stockMode: produto.stockMode || (stockEntries.some((item) => item.versionValue) ? 'versioned' : 'simple'),
    tamanhosDisponiveis: tamanhos.filter((item) => item.available).map((item) => item.size),
    categoria: produto.category || "",
    time: produto.team || "",
    homeSection: produto.homeSection || "",
    crestUrl: produto.crestUrl || "",
    priceLabel: produto.priceLabel || "",
    somenteConsulta: Boolean(produto.onlyConsultation),
    allowCustomization: Boolean(produto.allowCustomization),
    type: produto.type || "",
    specs: normalizarSpecsProduto(produto.specs),
    optionGroups: normalizarOptionGroupsProduto(produto.optionGroups),
    customizationOptions: normalizarCustomizacoesProduto(produto.customizationOptions)
  };
}


const SECOES_HOME_PADRAO = ["Times do Brasil", "Europa", "Seleções", "Outros times"];

const MAPA_SECOES_TIMES = {
  "Flamengo": "Times do Brasil",
  "Corinthians": "Times do Brasil",
  "Palmeiras": "Times do Brasil",
  "São Paulo": "Times do Brasil",
  "Santos": "Times do Brasil",
  "Grêmio": "Times do Brasil",
  "Internacional": "Times do Brasil",
  "Cruzeiro": "Times do Brasil",
  "Atlético Mineiro": "Times do Brasil",
  "Botafogo": "Times do Brasil",
  "Remo": "Times do Brasil",
  "Real Madrid": "Europa",
  "Barcelona": "Europa",
  "Manchester City": "Europa",
  "Manchester United": "Europa",
  "Liverpool": "Europa",
  "Arsenal": "Europa",
  "Chelsea": "Europa",
  "PSG": "Europa",
  "Bayern": "Europa",
  "Juventus": "Europa",
  "Milan": "Europa",
  "Lazio": "Europa",
  "Inter de Milão": "Europa",
  "Roma": "Europa",
  "Borussia Dortmund": "Europa",
  "Ajax": "Europa",
  "Atlético de Madrid": "Europa",
  "Tottenham": "Europa",
  "Aston Villa": "Europa",
  "Porto": "Europa",
  "Gijon": "Europa",
  "Brasil": "Seleções",
  "Argentina": "Seleções",
  "Portugal": "Seleções",
  "França": "Seleções",
  "Alemanha": "Seleções",
  "Espanha": "Seleções"
};

function inferirSecaoHomePadrao(team = "") {
  return MAPA_SECOES_TIMES[String(team || "").trim()] || "Outros times";
}

function obterSecaoHomeProduto(produto = {}) {
  const valor = String(produto.homeSection || "").trim();
  if (valor) return valor;
  if (produto.time) return inferirSecaoHomePadrao(produto.time);
  return "Outros produtos";
}

function ordenarSecoesHome(secoes = []) {
  return [...new Set(secoes.filter(Boolean))].sort((a, b) => {
    const indexA = SECOES_HOME_PADRAO.indexOf(a);
    const indexB = SECOES_HOME_PADRAO.indexOf(b);
    if (indexA >= 0 && indexB >= 0) return indexA - indexB;
    if (indexA >= 0) return -1;
    if (indexB >= 0) return 1;
    return a.localeCompare(b, "pt-BR");
  });
}

function slugSecaoHome(secao = "") {
  return `secao-home-${slugify(secao || "secao")}`;
}

function obterPrimeiroTamanhoDisponivel(tamanhos = []) {
  const item = normalizarTamanhosProduto(tamanhos).find((tamanho) => tamanho.available);
  return item ? item.size : "";
}

function obterResumoEstoqueTamanhos(tamanhos = []) {
  const lista = normalizarTamanhosProduto(tamanhos);
  const disponiveis = lista.filter((item) => item.available);
  const indisponiveis = lista.filter((item) => !item.available);
  return { lista, disponiveis, indisponiveis };
}

function criarSelectTamanhosHTML(tamanhos = [], selectId = "produtoTamanho") {
  const lista = normalizarTamanhosProduto(tamanhos);
  if (!lista.length) return "";

  return `
    <select id="${escaparHTML(selectId)}">
      ${lista.map((item) => `
        <option value="${escaparHTML(item.size)}" ${item.available ? "" : "disabled"}>
          ${escaparHTML(item.available ? item.size : `${item.size} - indisponível`)}
        </option>
      `).join("")}
    </select>
  `;
}

function criarResumoEstoqueHTML(tamanhos = []) {
  const { lista } = obterResumoEstoqueTamanhos(tamanhos);
  if (!lista.length) return "";

  return `
    <div class="estoque-tamanhos">
      ${lista.map((item) => `
        <span class="badge-estoque ${item.available ? "disponivel" : "indisponivel"}">${escaparHTML(item.size)}${item.available ? ` (${item.stockQuantity})` : ""}</span>
      `).join("")}
    </div>
  `;
}

function criarControleVersaoEstoqueHTML(produto, selectId = 'produtoVersao') {
  const versoes = obterVersoesProduto(produto);
  if (!versoes.length) return '';

  const inicial = obterVersaoInicialProduto(produto);
  return `
    <div class="produto-versao-bloco">
      <span class="produto-versao-label">Tipo da camisa</span>
      <select id="${escaparHTML(selectId)}" hidden>
        ${versoes.map((item) => `<option value="${escaparHTML(item.value)}" ${item.value === inicial ? 'selected' : ''}>${escaparHTML(item.label)}</option>`).join('')}
      </select>
      <div class="produto-versoes-botoes" data-versao-buttons="${escaparHTML(selectId)}">
        ${versoes.map((item) => `<button type="button" class="produto-versao-btn${item.value === inicial ? ' ativo' : ''}" data-version-value="${escaparHTML(item.value)}">${escaparHTML(item.label)}</button>`).join('')}
      </div>
    </div>
  `;
}

function configurarBotoesVersaoProduto(produto, onChange) {
  document.querySelectorAll('[data-versao-buttons]').forEach((wrapper) => {
    const selectId = wrapper.getAttribute('data-versao-buttons');
    const select = document.getElementById(selectId);
    if (!select) return;

    wrapper.querySelectorAll('[data-version-value]').forEach((botao) => {
      botao.addEventListener('click', () => {
        const valor = botao.getAttribute('data-version-value') || '';
        select.value = valor;
        wrapper.querySelectorAll('[data-version-value]').forEach((item) => item.classList.toggle('ativo', item === botao));
        if (typeof onChange === 'function') onChange(valor);
      });
    });
  });
}

async function buscarJSON(url) {
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error(`Falha ao buscar ${url}`);
  }
  return resposta.json();
}

async function carregarCatalogoApi(force = false) {
  if (catalogoApiState.carregado && !force) return catalogoApiState;
  if (catalogoApiState.carregando && !force) return catalogoApiState.carregando;

  catalogoApiState.carregando = (async () => {
    const [products, teams, categories, teamDetails] = await Promise.all([
      buscarJSON(`${API_BASE}/api/products`),
      buscarJSON(`${API_BASE}/api/catalog/teams`),
      buscarJSON(`${API_BASE}/api/catalog/categories`),
      buscarJSON(`${API_BASE}/api/teams`)
    ]);

    catalogoApiState.products = Array.isArray(products) ? products.map(mapearProdutoApi) : [];
    catalogoApiState.teams = Array.isArray(teams) ? teams : [];
    catalogoApiState.teamDetails = Array.isArray(teamDetails) ? teamDetails.map(normalizarTimeApi) : [];
    catalogoApiState.categories = Array.isArray(categories) ? categories : [];
    catalogoApiState.carregado = true;
    return catalogoApiState;
  })();

  try {
    return await catalogoApiState.carregando;
  } finally {
    catalogoApiState.carregando = null;
  }
}

async function buscarProdutosApi(params = {}) {
  const url = new URL(`${API_BASE}/api/products`);
  Object.entries(params).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && String(valor).trim() !== "") {
      url.searchParams.set(chave, valor);
    }
  });
  const produtos = await buscarJSON(url.toString());
  return Array.isArray(produtos) ? produtos.map(mapearProdutoApi) : [];
}

async function buscarProdutoApiPorId(id) {
  const produto = await buscarJSON(`${API_BASE}/api/products/${encodeURIComponent(id)}`);
  return mapearProdutoApi(produto);
}


async function salvarPedidoNoBackend(payload) {
  const resposta = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!resposta.ok) {
    let mensagem = "Não foi possível salvar o pedido no banco de dados.";
    try {
      const erro = await resposta.json();
      if (erro?.error) mensagem = erro.error;
    } catch {}
    throw new Error(mensagem);
  }

  return resposta.json();
}

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



function obterTimesDisponiveisDoCatalogo() {
  const times = catalogoApiState.products
    .map((item) => String(item.time || "").trim())
    .filter(Boolean);

  return [...new Set(times)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

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

function obterProductIdConfiavel(item = {}) {
  if (item && item.productId) return item.productId;

  const link = String(item?.link || item?.productLink || '').trim();
  if (link) {
    try {
      const url = new URL(link, window.location.href);
      const id = url.searchParams.get('id');
      if (id) return id;
    } catch {}
  }

  return item?.categoria ? obterIdProdutoExtra(item.categoria, item.nome) : obterIdCamisa(item.nome);
}

function buscarCamisaPorId(id) {
  for (const time of obterTimesDisponiveisDoCatalogo()) {
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

function irParaCatalogo(event) {
  if (event) event.preventDefault();

  const alvo = document.getElementById("categorias");
  if (!alvo) return;

  const header = document.querySelector("header");
  const headerAltura = header ? header.offsetHeight : 0;
  const margemExtra = window.innerWidth <= 768 ? 14 : 20;
  const posicao = alvo.getBoundingClientRect().top + window.scrollY - headerAltura - margemExtra;

  window.scrollTo({
    top: Math.max(posicao, 0),
    behavior: "smooth"
  });
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

  if (typeof abrirElementoAnimado === 'function') {
    abrirElementoAnimado(fundo, 'ativo');
    abrirElementoAnimado(carrinhoEl, 'ativo');
  } else {
    if (fundo) {
      fundo.hidden = false;
      fundo.classList.add("ativo");
    }
    if (carrinhoEl) {
      carrinhoEl.hidden = false;
      carrinhoEl.classList.add("ativo");
    }
  }

  document.body.classList.add("auth-modal-open");
}

function fecharCarrinho() {
  const carrinhoEl = document.getElementById("carrinho");
  const fundo = document.getElementById("fundoCarrinho");

  if (typeof fecharElementoAnimado === 'function') {
    fecharElementoAnimado(carrinhoEl, 'ativo');
    fecharElementoAnimado(fundo, 'ativo');
  } else {
    if (carrinhoEl) {
      carrinhoEl.classList.remove("ativo");
      carrinhoEl.hidden = true;
    }
    if (fundo) {
      fundo.classList.remove("ativo");
      fundo.hidden = true;
    }
  }

  document.body.classList.remove("auth-modal-open");
}

function sincronizarEstadoCarrinhoFechado() {
  const carrinhoEl = document.getElementById("carrinho");
  const fundo = document.getElementById("fundoCarrinho");

  if (carrinhoEl) {
    carrinhoEl.classList.remove("ativo");
    carrinhoEl.hidden = true;
  }

  if (fundo) {
    fundo.classList.remove("ativo");
    fundo.hidden = true;
  }

  document.body.classList.remove("auth-modal-open");
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
  form.dataset.productId = contexto.productId || "";
  form.dataset.detalhes = JSON.stringify(contexto.detalhes || null);
  form.dataset.itens = JSON.stringify(contexto.itens || []);

  modal.classList.add("ativo");
  document.body.classList.add("modal-aberto");

  const campoNome = document.getElementById("entregaNome");
  if (campoNome && authState.user?.name) {
    campoNome.value = authState.user.name;
  }

  const primeiroCampo = campoNome || document.getElementById("entregaWhatsapp");
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

function abrirWhatsAppComMensagem(msg, targetWindow = null) {
  const url = `https://wa.me/${numeroVendedor}?text=${encodeURIComponent(msg)}`;

  if (targetWindow && !targetWindow.closed) {
    try {
      targetWindow.location.href = url;
      return;
    } catch {}
  }

  window.location.href = url;
}

function esvaziarCarrinho() {
  carrinho = [];
  salvarCarrinho();
  atualizarCarrinho();
}

function criarChaveItemCarrinho(item = {}) {
  const detalhes = item?.detalhes || {};
  const variacoes = Array.isArray(detalhes.variacoes)
    ? detalhes.variacoes.map((variacao) => `${variacao?.grupo || ""}:${variacao?.valor || ""}`).sort().join("|")
    : "";
  const customizacoes = Array.isArray(detalhes.customizacoes)
    ? [...detalhes.customizacoes].sort().join("|")
    : "";

  return [
    obterProductIdConfiavel(item),
    item?.categoria || "",
    detalhes?.versaoLabel || "",
    detalhes?.versao || "",
    detalhes?.tamanho || "",
    detalhes?.nomeNumero ? "1" : "0",
    detalhes?.patch ? "1" : "0",
    detalhes?.patrocinadores ? "1" : "0",
    variacoes,
    customizacoes,
    Number(detalhes?.preco || 0) || 0
  ].join("::");
}

function agruparItensCarrinho(itens = []) {
  const mapa = new Map();

  itens.forEach((item) => {
    const chave = criarChaveItemCarrinho(item);
    if (!mapa.has(chave)) {
      mapa.set(chave, {
        ...item,
        quantity: 0
      });
    }

    mapa.get(chave).quantity += 1;
  });

  return Array.from(mapa.values());
}

async function confirmarEnvioComEndereco(event) {
  event.preventDefault();

  const janelaWhatsApp = window.open("about:blank", "_blank");
  const form = event.target;
  const dadosEntrega = obterDadosEntregaFormulario();

  if (!validarDadosEntrega(dadosEntrega)) return;

  const enderecoTexto = montarTextoEndereco(dadosEntrega);
  let mensagem = "";
  let itensPedido = [];

  if (form.dataset.tipo === "carrinho") {
    const itens = JSON.parse(form.dataset.itens || "[]");
    const itensAgrupados = agruparItensCarrinho(itens);
    itensPedido = itensAgrupados.map(item => ({
      productId: obterProductIdConfiavel(item),
      productName: item.nome,
      category: item.categoria || "",
      imageUrl: item.img || "",
      productLink: item.link || "",
      versionLabel: item.detalhes?.versaoLabel || "",
      versionValue: item.detalhes?.versao || "",
      size: item.detalhes?.tamanho || "",
      extras: {
        nomeNumero: Boolean(item.detalhes?.nomeNumero),
        patch: Boolean(item.detalhes?.patch),
        patrocinadores: Boolean(item.detalhes?.patrocinadores)
      },
      price: item.detalhes?.preco || 0,
      quantity: Number(item.quantity || 1)
    }));
    mensagem = montarMensagemCarrinho(itensAgrupados, enderecoTexto);
  } else {
    const detalhes = JSON.parse(form.dataset.detalhes || "null");
    const categoria = form.dataset.categoria || "";
    itensPedido = [{
      productId: form.dataset.productId || (categoria ? obterIdProdutoExtra(categoria, form.dataset.nome) : obterIdCamisa(form.dataset.nome)),
      productName: form.dataset.nome,
      category: categoria,
      imageUrl: form.dataset.img || "",
      productLink: gerarLinkProduto(form.dataset.nome, form.dataset.img, {
        id: form.dataset.productId || (categoria ? obterIdProdutoExtra(categoria, form.dataset.nome) : obterIdCamisa(form.dataset.nome)),
        categoria
      }),
      versionLabel: detalhes?.versaoLabel || "",
      versionValue: detalhes?.versao || "",
      size: detalhes?.tamanho || "",
      extras: {
        nomeNumero: Boolean(detalhes?.nomeNumero),
        patch: Boolean(detalhes?.patch),
        patrocinadores: Boolean(detalhes?.patrocinadores)
      },
      price: detalhes?.preco || 0,
      quantity: 1
    }];
    mensagem = montarMensagemProduto(
      form.dataset.nome,
      form.dataset.img,
      detalhes,
      enderecoTexto,
      categoria,
      form.dataset.productId || ""
    );
  }

  try {
    await salvarPedidoNoBackend({
      customer: {
        name: dadosEntrega.nome,
        email: authState.user?.email || "",
        whatsapp: dadosEntrega.whatsapp,
        cep: dadosEntrega.cep,
        city: dadosEntrega.cidade,
        state: dadosEntrega.estado,
        neighborhood: dadosEntrega.bairro,
        street: dadosEntrega.rua,
        number: dadosEntrega.numero,
        complement: dadosEntrega.complemento
      },
      items: itensPedido,
      whatsappMessage: mensagem,
      notes: "Pedido enviado pelo formulário do site"
    });
  } catch (erro) {
    if (janelaWhatsApp && !janelaWhatsApp.closed) {
      janelaWhatsApp.close();
    }
    console.warn("Falha ao salvar pedido no banco:", erro);
    alert(erro?.message || "Não foi possível concluir o pedido agora.");
    return;
  }

  esvaziarCarrinho();
  fecharModalEntrega();
  abrirWhatsAppComMensagem(mensagem, janelaWhatsApp);
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

function montarMensagemProduto(nome, img, detalhes = null, enderecoTexto = "", categoria = "", productId = "") {
  const idProduto = productId || (categoria ? obterIdProdutoExtra(categoria, nome) : obterIdCamisa(nome));
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

  if (Array.isArray(detalhes?.variacoes) && detalhes.variacoes.length) {
    linhas.push(`Variações: ${detalhes.variacoes.map((item) => `${item.grupo}: ${item.valor}`).join(", ")}`);
  }
  if (Array.isArray(detalhes?.customizacoes) && detalhes.customizacoes.length) {
    linhas.push(`Personalização: ${detalhes.customizacoes.join(", ")}`);
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
      { valor: "manga-longa", label: "Versão Manga Longa", precoBase: { P: 280, M: 280, G: 280, G2: 280 } }
    ],
    tamanhos: ["P", "M", "G", "G2", "G3", "G4"],
    permiteMangaLonga: true
  };
}

function obterTamanhosPermitidosCamisa(nome, versao = '') {
  const opcoes = obterOpcoesProduto(nome);
  const versaoNormalizada = normalizarValorVersao(versao || opcoes.versoes[0]?.valor || '');
  if (versaoNormalizada === 'manga-longa') return ['P', 'M', 'G', 'G2'];
  if (versaoNormalizada === 'retro') return ['P', 'M', 'G', 'G2'];
  return ['P', 'M', 'G', 'G2', 'G3', 'G4'];
}

function obterTamanhosAtivosCamisa(produto = {}, nome = '', versao = '') {
  const permitidos = obterTamanhosPermitidosCamisa(nome || produto?.nome || '', versao);
  const entriesNorm = normalizarStockEntriesProduto(produto.stockEntries);
  const versaoNormalizada = normalizarValorVersao(versao || obterVersaoInicialProduto(produto));

  let base = [];

  if (produtoTemEstoquePorVersao(produto)) {
    const porVersao = agruparTamanhosPorEntradas(entriesNorm.filter((item) => item.versionValue === versaoNormalizada));
    if (porVersao.length) {
      base = porVersao;
    }
  }

  if (!base.length) {
    const entriesSemVersao = agruparTamanhosPorEntradas(entriesNorm.filter((item) => !item.versionValue));
    if (entriesSemVersao.length) {
      base = entriesSemVersao;
    }
  }

  if (!base.length) {
    const tamanhosProduto = normalizarTamanhosProduto(produto.tamanhos);
    if (tamanhosProduto.length) {
      base = tamanhosProduto;
    }
  }

  if (!base.length) {
    base = permitidos.map((size) => ({ size, stockQuantity: 1, available: true }));
  }

  const mapa = new Map(base.map((item) => [String(item.size || '').trim().toUpperCase(), item]));
  return permitidos.map((size) => {
    const encontrado = mapa.get(size);
    if (encontrado) {
      return { ...encontrado, size };
    }

    const usandoFallbackSemEstoqueReal = !entriesNorm.length && !normalizarTamanhosProduto(produto.tamanhos).length;
    return {
      size,
      stockQuantity: usandoFallbackSemEstoqueReal ? 1 : 0,
      available: usandoFallbackSemEstoqueReal
    };
  });
}

function ehProdutoCamisaEspecial(produto = {}, categoria = '') {
  if (ehCategoriaFeminina(categoria || produto?.categoria || '')) return true;
  if (categoria || produto?.categoria) return false;
  return Boolean(produto?.team || produto?.time || produto?.nome);
}

function calcularPrecoProduto(nome, versao, tamanho, opcoesExtras = {}) {
  const retro = ehRetro(nome);
  let preco = 0;

  const versaoNormalizada = normalizarValorVersao(versao);

  if (retro) {
    preco = 190;
  } else {
    if (versaoNormalizada === "torcedor") {
      if (["P", "M", "G", "G2"].includes(tamanho)) preco = 160;
      if (["G3", "G4"].includes(tamanho)) preco = 190;
    }

    if (versaoNormalizada === "jogador") {
      if (["P", "M", "G", "G2"].includes(tamanho)) preco = 220;
      if (tamanho === "G3") preco = 240;
      if (tamanho === "G4") preco = 260;
    }

    if (normalizarValorVersao(versao) === "manga-longa") {
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

function adicionarCarrinho(nome, img, detalhes = null, categoria = "", productId = "") {
  if (!nome || !img) return;
  if (!exigirLoginParaComprar("register")) return;

  const idProduto = productId || (categoria ? obterIdProdutoExtra(categoria, nome) : obterIdCamisa(nome));
  const produtoLink = gerarLinkProduto(nome, img, { id: idProduto, categoria });

  carrinho.push({
    nome,
    img,
    link: produtoLink,
    categoria: categoria || "",
    productId: idProduto,
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
  if (!exigirLoginParaComprar("register")) return;

  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio");
    return;
  }

  abrirModalEntrega({ tipo: "carrinho", itens: carrinho });
}

function enviarWhats(nome, img, detalhes = null, categoria = "", productId = "") {
  if (!nome || !img) return;
  if (!exigirLoginParaComprar("register")) return;
  abrirModalEntrega({ tipo: "produto", nome, img, detalhes, categoria, productId });
}

function abrirProduto(camisaNome, imgUrl, categoria = "", productId = "") {
  if (!camisaNome || !imgUrl) return;

  const idProduto = productId || (categoria ? obterIdProdutoExtra(categoria, camisaNome) : obterIdCamisa(camisaNome));
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
    ],
    ajax: [
      { nome: "Ajax Away 24/25", img: "imagens/ajax_away_24-25.webp" }
    ],
    arsenal: [
      { nome: "Arsenal Home 25/26", img: "imagens/arsenal_home_25-26.webp" },
      { nome: "Arsenal Third 24/25", img: "imagens/arsenal_third_24-25.webp" }
    ],
    astonvilla: [
      { nome: "Aston Villa Home 22/23", img: "imagens/aston_villa_home_22-23.jpg" }
    ],
    atleticodemadrid: [
      { nome: "Atlético de Madrid Home 24/25", img: "imagens/atletico_de_madrid_home_24-25.webp" }
    ],
    bayern: [
      { nome: "Bayern Home 24/25", img: "imagens/Bayern de Munich Home 24-25.jpg" }
    ],
    borussiadortmund: [
      { nome: "Borussia Dortmund Home 24/25", img: "imagens/Camisa Borussia Dortmund Home 24-25.webp" }
    ],
    chelsea: [
      { nome: "Chelsea Home 25/26", img: "imagens/chelsea_home_25-26.webp" },
      { nome: "Chelsea Away 25/26", img: "imagens/chelsea_away_25-26.webp" }
    ],
    interdemilao: [
      { nome: "Inter de Milão Home 24/25", img: "imagens/inter_home_24-25.webp" }
    ],
    juventus: [
      { nome: "Juventus Home 24/25", img: "imagens/Juventus Home 24-25.webp" }
    ],
    lazio: [
      { nome: "Lazio Special 24/25", img: "imagens/lazio_special_24-25.webp" }
    ],
    liverpool: [
      { nome: "Liverpool Away 24/25", img: "imagens/liverpool_away_24-25.webp" }
    ],
    manchestercity: [
      { nome: "Manchester City Home 24/25", img: "imagens/manchester_city_home_24-25.webp" }
    ],
    manchesterunited: [
      { nome: "Manchester United Away 24/25", img: "imagens/manchester_united_away_24-25.webp" }
    ],
    milan: [
      { nome: "Milan Home 24/25", img: "imagens/milan_home_24-25.webp" }
    ],
    porto: [
      { nome: "Porto Home 24/25", img: "imagens/porto_home_24-25.webp" },
      { nome: "Porto Away 24/25", img: "imagens/porto_away_24-25.webp" }
    ],
    psg: [
      { nome: "PSG Away 24/25", img: "imagens/psg_away_24-25.webp" },
      { nome: "PSG Third 24/25", img: "imagens/psg_third_24-25.webp" }
    ],
    realmadrid: [
      { nome: "Real Madrid Dragon Special 24/25", img: "imagens/real_madrid_dragon_special_24-25.jpeg" }
    ],
    roma: [
      { nome: "Roma Home 22/23", img: "imagens/Roma Home 22-23.webp" }
    ],
    gijon: [
      { nome: "Gijon Home 25/26", img: "imagens/Sporting Gijon Home 25-26.webp" }
    ],
    tottenham: [
      { nome: "Tottenham Home 24/25", img: "imagens/tottenham_home_24-25.webp" },
      { nome: "Tottenham Away 24/25", img: "imagens/tottenham_away_24-25.webp" }
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
    ${criarResumoEstoqueHTML(camisa.tamanhos || [])}
    <div class="mini-avaliacao">${avaliacaoHTML}</div>
    <button class="btn-add" type="button">Adicionar ao carrinho</button>
    <button class="btn-configurar" type="button">Configurar produto</button>
  `;

  div.querySelector("img").addEventListener("click", () => abrirProduto(camisa.nome, camisa.img, "", camisa.id));
  div.querySelector(".btn-add").addEventListener("click", () => adicionarCarrinho(camisa.nome, camisa.img, null, "", camisa.id));
  div.querySelector(".btn-configurar").addEventListener("click", () => abrirProduto(camisa.nome, camisa.img, "", camisa.id));
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
    ${criarResumoEstoqueHTML(produto.tamanhos || [])}
    <div class="mini-avaliacao"><span class="estrelas">☆☆☆☆☆</span><span>Sem avaliações</span></div>
    <button class="btn-add" type="button">Adicionar ao carrinho</button>
    <button class="btn-configurar" type="button">Configurar produto</button>
  `;

  div.querySelector("img").addEventListener("click", () => abrirProduto(produto.nome, produto.img, categoria, produto.id));
  div.querySelector(".btn-add").addEventListener("click", () => adicionarCarrinho(produto.nome, produto.img, null, categoria, produto.id));
  div.querySelector(".btn-configurar").addEventListener("click", () => abrirProduto(produto.nome, produto.img, categoria, produto.id));
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

async function carregarPaginaCamisas() {
  const container = document.getElementById("camisas");
  if (!container) return;

  container.innerHTML = '<div class="aviso-sem-produtos-filtrados">Carregando produtos do banco de dados...</div>';

  const modoCatalogo = localStorage.getItem("modoCatalogo") || "time";
  const categoria = localStorage.getItem("categoriaEscolhida") || "";
  const subcategoria = localStorage.getItem("subcategoriaEscolhida") || "";
  const time = localStorage.getItem("timeEscolhido") || "Camisas";

  try {
    if (modoCatalogo === "categoria" && categoria) {
      const produtosDaCategoria = await buscarProdutosApi({ category: categoria });
      container.innerHTML = "";

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

        if (!produtosDaCategoria.length) {
          container.innerHTML = '<div class="aviso-sem-produtos-filtrados">Nenhum produto encontrado nessa categoria.</div>';
        }

        if (localStorage.getItem("scrollParaModelosDisponiveis") === "1") {
          localStorage.removeItem("scrollParaModelosDisponiveis");
          requestAnimationFrame(() => {
            const alvoModelos = document.getElementById("modelosDisponiveis");
            if (alvoModelos) alvoModelos.scrollIntoView({ behavior: "smooth", block: "start" });
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

    const camisasDoBanco = await buscarProdutosApi({ team: time });
    container.innerHTML = "";

    if (!camisasDoBanco.length) {
      container.innerHTML = '<div class="aviso-sem-produtos-filtrados">Nenhuma camisa foi encontrada para esse time.</div>';
      return;
    }

    camisasDoBanco.forEach(camisa => {
      container.appendChild(criarCardCamisa(camisa));
    });
  } catch (erro) {
    console.warn("Erro ao carregar catálogo do banco:", erro);
    container.innerHTML = '<div class="aviso-sem-produtos-filtrados">Não foi possível carregar os produtos do banco agora.</div>';
  }
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

async function criarIndiceBusca() {
  try {
    const catalogo = await carregarCatalogoApi();
    const itens = [];

    catalogo.teams.forEach(time => {
      const camisas = catalogo.products.filter(item => item.time === time);
      itens.push({
        tipo: "time",
        titulo: time,
        subtitulo: "Abrir catálogo do time",
        busca: `${time} ${camisas.map(item => item.nome).join(" ")}`,
        acao: () => abrirTime(time)
      });
    });

    catalogo.products.forEach(produto => {
      if (produto.time) {
        itens.push({
          tipo: "camisa",
          titulo: produto.nome,
          subtitulo: `${produto.time} • Camisa tailandesa`,
          busca: `${produto.nome} ${produto.time} camisa uniforme home away third retro retrô`,
          acao: () => abrirProduto(produto.nome, produto.img, produto.categoria, produto.id)
        });
        return;
      }

      itens.push({
        tipo: "produto",
        titulo: produto.nome,
        subtitulo: `${produto.categoria} • ${produto.descricao}`,
        busca: `${produto.nome} ${produto.descricao} ${produto.categoria}`,
        acao: () => abrirProduto(produto.nome, produto.img, produto.categoria, produto.id)
      });
    });

    catalogo.categories.forEach(categoria => {
      const produtos = catalogo.products.filter(item => item.categoria === categoria);
      itens.push({
        tipo: "categoria",
        titulo: categoria,
        subtitulo: "Abrir categoria",
        busca: `${categoria} ${produtos.map(item => item.nome).join(" ")}`,
        acao: () => abrirCategoria(categoria)
      });
    });

    return itens.map(item => ({
      ...item,
      buscaNormalizada: normalizarBusca(item.busca),
      tituloNormalizado: normalizarBusca(item.titulo)
    }));
  } catch (erro) {
    console.warn("Erro ao montar índice de busca pelo banco:", erro);
    return [];
  }
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

async function carregarPesquisa() {
  const input = document.getElementById("buscaInteligente");
  const caixa = document.getElementById("resultadosBusca");
  if (!input || !caixa) return;

  const indiceBusca = await criarIndiceBusca();
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

function tamanhoSelecionadoDisponivel(tamanhos = [], tamanhoSelecionado = "") {
  const lista = normalizarTamanhosProduto(tamanhos);
  const encontrado = lista.find((item) => item.size === tamanhoSelecionado);
  return encontrado ? encontrado.available : false;
}

function configurarSelectDeTamanhos(selectEl, tamanhos = [], valorPreferido = '') {
  if (!selectEl) return;
  const primeiroDisponivel = obterPrimeiroTamanhoDisponivel(tamanhos);
  const valorAtual = String(valorPreferido || selectEl.value || '').trim().toUpperCase();

  if (!primeiroDisponivel) {
    selectEl.disabled = true;
    selectEl.value = '';
    return;
  }

  selectEl.disabled = false;

  if (valorAtual && tamanhoSelecionadoDisponivel(tamanhos, valorAtual)) {
    selectEl.value = valorAtual;
    return;
  }

  if (!tamanhoSelecionadoDisponivel(tamanhos, selectEl.value)) {
    selectEl.value = primeiroDisponivel;
  }
}

function atualizarPrecoTelaProduto(nome, img) {
  const versaoSelect = document.getElementById("produtoVersao");
  const tamanhoSelect = document.getElementById("produtoTamanho");
  const estoqueResumo = document.getElementById("produtoEstoqueResumo");
  const checkboxNomeNumero = document.getElementById("extraNomeNumero");
  const checkboxPatch = document.getElementById("extraPatch");
  const checkboxPatrocinadores = document.getElementById("extraPatrocinadores");
  const precoEl = document.getElementById("precoDinamico");
  const precoInfoEl = document.getElementById("precoInfoTexto");
  const btnCarrinho = document.getElementById("btnProdutoCarrinho");
  const btnWhats = document.getElementById("btnProdutoWhats");

  if (!versaoSelect || !tamanhoSelect || !precoEl) return;

  const produtoAtual = window.__produtoPaginaAtual || {};
  const versao = versaoSelect.value;
  const tamanhoAnterior = String(tamanhoSelect.value || '').trim().toUpperCase();
  const tamanhosAtivos = obterTamanhosAtivosCamisa(produtoAtual, nome || produtoAtual.nome || '', versao);

  tamanhoSelect.innerHTML = criarSelectTamanhosHTML(tamanhosAtivos, "produtoTamanho").replace(/^<select id="produtoTamanho">|<\/select>$/g, "");
  configurarSelectDeTamanhos(tamanhoSelect, tamanhosAtivos, tamanhoAnterior);

  if (estoqueResumo) {
    estoqueResumo.innerHTML = criarResumoEstoqueHTML(tamanhosAtivos);
  }

  const tamanho = tamanhoSelect.value;

  if (!tamanhoSelecionadoDisponivel(tamanhosAtivos, tamanho)) {
    precoEl.textContent = "Tamanho indisponível no estoque";
    precoInfoEl.textContent = "Escolha um dos tamanhos disponíveis para esse tipo de camisa ou peça por encomenda no WhatsApp.";
    if (btnCarrinho) btnCarrinho.disabled = true;
    if (btnWhats) btnWhats.disabled = true;
    return;
  }

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
      "Nome e número custam R$40, patch R$30 e patrocinadores R$80",
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
  const versaoLabel = versaoObj ? versaoObj.label : obterLabelVersaoProduto(produtoAtual, versao) || versao;

  precoEl.textContent = formatarPreco(preco);
  precoInfoEl.textContent = "Preço calculado conforme versão, tamanho e extras escolhidos.";

  if (btnCarrinho) {
    btnCarrinho.disabled = false;
    btnCarrinho.onclick = () => adicionarCarrinho(nome, img, { versao, versaoLabel, tamanho, nomeNumero, patch, patrocinadores, preco }, categoriaAtualProduto || "", produtoAtualId || "");
  }

  if (btnWhats) {
    btnWhats.disabled = false;
    btnWhats.onclick = () => enviarWhats(nome, img, { versao, versaoLabel, tamanho, nomeNumero, patch, patrocinadores, preco }, categoriaAtualProduto || "", produtoAtualId || "");
  }
}

function atualizarPrecoTelaProdutoExtra(produto, categoria) {
  if (ehCategoriaFeminina(categoria)) {
    atualizarPrecoTelaProduto(produto.nome, produto.img);
    return;
  }

  const tamanhoSelect = document.getElementById('produtoTamanho');
  const versaoSelect = document.getElementById('produtoVersao');
  const estoqueResumo = document.getElementById('produtoEstoqueResumo');
  const precoEl = document.getElementById('precoDinamico');
  const precoInfoEl = document.getElementById('precoInfoTexto');
  const btnCarrinho = document.getElementById('btnProdutoCarrinho');
  const btnWhats = document.getElementById('btnProdutoWhats');

  const versao = versaoSelect ? versaoSelect.value : '';
  const tamanhosAtivos = obterTamanhosAtivosProduto(produto, versao);
  let preco = produto.precoBase;
  let versaoLabel = obterLabelVersaoProduto(produto, versao);
  let tamanho = '';

  if (tamanhoSelect) {
    const tamanhoAnterior = String(tamanhoSelect.value || '').trim().toUpperCase();
    tamanhoSelect.innerHTML = criarSelectTamanhosHTML(tamanhosAtivos, 'produtoTamanho').replace(/^<select id="produtoTamanho">|<\/select>$/g, '');
    configurarSelectDeTamanhos(tamanhoSelect, tamanhosAtivos, tamanhoAnterior);
    tamanho = tamanhoSelect.value;
  }

  if (estoqueResumo) {
    estoqueResumo.innerHTML = criarResumoEstoqueHTML(tamanhosAtivos);
  }

  if (tamanhosAtivos.length && !tamanhoSelecionadoDisponivel(tamanhosAtivos, tamanho)) {
    precoEl.textContent = 'Tamanho indisponível no estoque';
    precoInfoEl.textContent = 'Selecione um tamanho disponível ou consulte encomenda no WhatsApp.';
    if (btnCarrinho) btnCarrinho.disabled = true;
    if (btnWhats) btnWhats.disabled = true;
    return;
  }

  if (produto.somenteConsulta || preco === null || preco === undefined) {
    precoEl.textContent = 'Consulte disponibilidade';
    precoInfoEl.textContent = 'Os modelos serão confirmados direto no WhatsApp.';

    const detalhesConsulta = { versao: versao || '', versaoLabel: versaoLabel || 'Sob consulta', tamanho: tamanho || '' };

    if (btnCarrinho) {
      btnCarrinho.disabled = false;
      btnCarrinho.onclick = () => adicionarCarrinho(produto.nome, produto.img, detalhesConsulta, categoria, produto.id);
    }

    if (btnWhats) {
      btnWhats.disabled = false;
      btnWhats.onclick = () => enviarWhats(produto.nome, produto.img, detalhesConsulta, categoria, produto.id);
    }

    return;
  }

  precoEl.textContent = formatarPreco(preco);
  precoInfoEl.textContent = versaoLabel || tamanho ? 'Preço conforme a opção exibida no catálogo.' : 'Preço fixo conforme o catálogo.';

  const detalhes = { preco, versao: versao || '', versaoLabel: versaoLabel || '', tamanho };

  if (btnCarrinho) {
    btnCarrinho.disabled = false;
    btnCarrinho.onclick = () => adicionarCarrinho(produto.nome, produto.img, detalhes, categoria, produto.id);
  }

  if (btnWhats) {
    btnWhats.disabled = false;
    btnWhats.onclick = () => enviarWhats(produto.nome, produto.img, detalhes, categoria, produto.id);
  }
}

function criarBlocoOpcoesProdutoExtra(produto) {
  const blocos = [];
  const versoes = obterVersoesProduto(produto);
  const tamanhosBase = obterTamanhosAtivosProduto(produto, obterVersaoInicialProduto(produto));

  if (versoes.length) {
    blocos.push(criarControleVersaoEstoqueHTML(produto, 'produtoVersao'));
  }

  if (produto.tamanhos?.length || tamanhosBase.length) {
    blocos.push(`
      <label>
        Tamanho
        ${criarSelectTamanhosHTML(tamanhosBase, 'produtoTamanho')}
      </label>
      <div id="produtoEstoqueResumo">${criarResumoEstoqueHTML(tamanhosBase)}</div>
    `);
  }

  return blocos.length ? `<div class="produto-configuracoes">${blocos.join('')}</div>` : '';
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

function obterDetalhesProdutoGenerico(produto, tamanho = "") {
  const variacoes = normalizarOptionGroupsProduto(produto.optionGroups).map((group, index) => {
    const select = document.getElementById(`produtoVariacao_${index}`);
    const selecionado = group.values.find((value) => value.value === select?.value) || group.values[0];
    return { grupo: group.name, valor: selecionado.label, ajuste: Number(selecionado.priceAdjustment || 0) };
  });

  const customizacoes = normalizarCustomizacoesProduto(produto.customizationOptions)
    .map((item) => ({ ...item, checked: Boolean(document.getElementById(`customizacao_${item.key}`)?.checked) }))
    .filter((item) => item.checked);

  const temNomeOuNumero = customizacoes.some((item) => ['nome', 'numero', 'nome-numero'].includes(item.key));
  const temPatch = customizacoes.some((item) => item.key === 'patch');
  const outrasCustomizacoes = customizacoes
    .filter((item) => !['nome', 'numero', 'nome-numero', 'patch'].includes(item.key))
    .reduce((total, item) => total + Number(item.priceAdjustment || 0), 0);

  const preco = Number(produto.precoBase || 0)
    + variacoes.reduce((total, item) => total + Number(item.ajuste || 0), 0)
    + (temNomeOuNumero ? PRECO_TABELA_PERSONALIZACAO.nome : 0)
    + (temPatch ? PRECO_TABELA_PERSONALIZACAO.patch : 0)
    + outrasCustomizacoes;

  return {
    preco,
    tamanho,
    variacoes: variacoes.map((item) => ({ grupo: item.grupo, valor: item.valor })),
    customizacoes: customizacoes.map((item) => item.label)
  };
}

function criarBlocoVariacoesProduto(produto) {
  const groups = normalizarOptionGroupsProduto(produto.optionGroups);
  if (!groups.length) return "";
  return groups.map((group, index) => `
    <label>
      ${escaparHTML(group.name)}
      <select id="produtoVariacao_${index}">
        ${group.values.map((value) => `<option value="${escaparHTML(value.value)}">${escaparHTML(value.label)}${value.priceAdjustment ? ` (+ ${formatarPreco(value.priceAdjustment)})` : ""}</option>`).join("")}
      </select>
    </label>
  `).join("");
}

function obterTextoPrecoCustomizacao(item = {}) {
  const key = String(item.key || '').toLowerCase();
  if (key === 'nome' || key === 'numero' || key === 'nome-numero') return ` (+ ${formatarPreco(PRECO_TABELA_PERSONALIZACAO.nome)})`;
  if (key === 'patrocinadores') return ` (+ ${formatarPreco(PRECO_TABELA_PERSONALIZACAO.patrocinadores)})`;
  if (key === 'patch') return ` (+ ${formatarPreco(PRECO_TABELA_PERSONALIZACAO.patch)})`;
  return item.priceAdjustment ? ` (+ ${formatarPreco(item.priceAdjustment)})` : "";
}

function criarBlocoCustomizacoesProduto(produto) {
  return "";
}

function criarListaSpecsProduto(produto) {
  const specs = normalizarSpecsProduto(produto.specs);
  if (!specs.length) return `
    <ul class="produto-destaques">
      <li>Consulte frete pelo CEP</li>
      <li>Parcelado aumenta 10% no valor total</li>
      <li>Pedido finalizado direto no WhatsApp</li>
    </ul>
  `;
  return `<ul class="produto-destaques">${specs.map((item) => `<li>${escaparHTML(item)}</li>`).join("")}</ul>`;
}

function carregarPaginaProdutoGenerico(produto, categoria = "") {
  const container = document.getElementById("produto");
  if (!container || !produto) return;

  const precoInicial = produto.somenteConsulta ? "Consulte disponibilidade" : formatarPreco(Number(produto.precoBase || 0));

  preencherTopoProduto({
    tag: categoria ? `Categoria: ${categoria}` : "Produto selecionado",
    titulo: "Configure seu produto do jeito certo",
    infoPreco: produto.priceLabel || "O valor muda conforme as opções escolhidas",
    infoPedido: "Você escolhe tudo aqui e envia já pronto no WhatsApp",
    ctaTitulo: "Precisa de ajuda com esse produto?",
    ctaTexto: "Chame no WhatsApp e fale diretamente com o vendedor.",
    listaInfo: [
      "Agora você pode deixar cada produto mais específico",
      "As variações e personalizações aparecem conforme o cadastro",
      "Confirme disponibilidade e frete no WhatsApp"
    ],
    listaComoFunciona: [
      "Escolha tamanho e variações",
      "Marque as personalizações disponíveis",
      "Veja o preço calculado na hora",
      "Envie no WhatsApp para confirmar"
    ]
  });

  const versaoInicial = obterVersaoInicialProduto(produto);
  const tamanhosIniciais = obterTamanhosAtivosProduto(produto, versaoInicial);

  container.innerHTML = `
    <div class="produto-layout">
      <div class="produto-card">
        <img src="${escaparHTML(produto.img)}" alt="${escaparHTML(produto.nome)}" class="produto-imagem">
      </div>
      <div class="produto-info">
        <h2>${escaparHTML(produto.nome)}</h2>
        <p>${escaparHTML(produto.descricao || "Produto configurável")}</p>
        <div class="bloco-preco-produto">
          <div class="preco-destaque" id="precoDinamico">${escaparHTML(precoInicial)}</div>
          <small id="precoInfoTexto">${escaparHTML(produto.priceLabel || "Preço calculado conforme as opções escolhidas.")}</small>
        </div>
        <div class="produto-configuracoes">
          ${obterVersoesProduto(produto).length ? criarControleVersaoEstoqueHTML(produto, 'produtoVersao') : ''}
          ${produto.tamanhos?.length ? `<label>Tamanho${criarSelectTamanhosHTML(tamanhosIniciais, "produtoTamanho")}<div id="produtoEstoqueResumo">${criarResumoEstoqueHTML(tamanhosIniciais)}</div></label>` : ""}
          ${criarBlocoVariacoesProduto(produto)}
          ${criarBlocoCustomizacoesProduto(produto)}
        </div>
        <div class="produto-acoes">
          <button id="btnProdutoCarrinho" type="button">Adicionar ao carrinho</button>
          <button id="btnProdutoWhats" type="button">Comprar no WhatsApp</button>
        </div>
        ${criarListaSpecsProduto(produto)}
      </div>
    </div>
    <div id="areaAvaliacoes"></div>
  `;

  const atualizar = () => {
    const tamanhoSelect = document.getElementById('produtoTamanho');
    const versaoSelect = document.getElementById('produtoVersao');
    const precoEl = document.getElementById('precoDinamico');
    const precoInfoEl = document.getElementById('precoInfoTexto');
    const btnCarrinho = document.getElementById('btnProdutoCarrinho');
    const btnWhats = document.getElementById('btnProdutoWhats');
    const estoqueResumo = document.getElementById('produtoEstoqueResumo');

    const versao = versaoSelect ? versaoSelect.value : '';
    const tamanhosAtivos = obterTamanhosAtivosProduto(produto, versao);

    if (tamanhoSelect) {
      tamanhoSelect.innerHTML = criarSelectTamanhosHTML(tamanhosAtivos, 'produtoTamanho').replace(/^<select id="produtoTamanho">|<\/select>$/g, '');
      configurarSelectDeTamanhos(tamanhoSelect, tamanhosAtivos);
    }

    if (estoqueResumo) {
      estoqueResumo.innerHTML = criarResumoEstoqueHTML(tamanhosAtivos);
    }

    const tamanho = tamanhoSelect ? tamanhoSelect.value : '';
    if (tamanhoSelect && !tamanhoSelecionadoDisponivel(tamanhosAtivos, tamanho)) {
      precoEl.textContent = 'Tamanho indisponível no estoque';
      precoInfoEl.textContent = 'Escolha outro tipo ou tamanho disponível.';
      if (btnCarrinho) btnCarrinho.disabled = true;
      if (btnWhats) btnWhats.disabled = true;
      return;
    }

    const detalhes = obterDetalhesProdutoGenerico(produto, tamanho);
    detalhes.versao = versao || '';
    detalhes.versaoLabel = obterLabelVersaoProduto(produto, versao);
    precoEl.textContent = produto.somenteConsulta ? 'Consulte disponibilidade' : formatarPreco(detalhes.preco);
    precoInfoEl.textContent = produto.priceLabel || 'Preço calculado conforme as opções escolhidas.';

    if (btnCarrinho) {
      btnCarrinho.disabled = false;
      btnCarrinho.onclick = () => adicionarCarrinho(produto.nome, produto.img, detalhes, categoria, produto.id);
    }

    if (btnWhats) {
      btnWhats.disabled = false;
      btnWhats.onclick = () => enviarWhats(produto.nome, produto.img, detalhes, categoria, produto.id);
    }
  };

  [document.getElementById('produtoTamanho'), document.getElementById('produtoVersao'), ...document.querySelectorAll('[id^="produtoVariacao_"]'), ...document.querySelectorAll('[id^="customizacao_"]')]
    .filter(Boolean)
    .forEach((campo) => campo.addEventListener('change', atualizar));

  configurarBotoesVersaoProduto(produto, atualizar);
  atualizar();
  const areaAvaliacoes = document.getElementById('areaAvaliacoes');
  if (areaAvaliacoes) areaAvaliacoes.innerHTML = '';
}

function carregarPaginaProdutoExtra(nome, img, categoria) {
  const container = document.getElementById("produto");
  const produto = window.__produtoPaginaAtual && window.__produtoPaginaAtual.nome === nome
    ? window.__produtoPaginaAtual
    : obterProdutoExtra(categoria, nome);

  if (!container || !produto) return;
  window.__produtoPaginaAtual = produto;

  if (ehCategoriaFeminina(categoria)) {
    carregarPaginaProdutoCamisaFeminina(produto.nome, produto.img, categoria);
    return;
  }

  if ((produto.optionGroups && produto.optionGroups.length) || (produto.customizationOptions && produto.customizationOptions.length) || (produto.specs && produto.specs.length)) {
    carregarPaginaProdutoGenerico(produto, categoria);
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
  const tamanhosProduto = obterTamanhosAtivosCamisa(window.__produtoPaginaAtual || {}, nome, opcoes.versoes[0].valor);
  const primeiroTamanhoDisponivel = obterPrimeiroTamanhoDisponivel(tamanhosProduto);
  const precoInicial = primeiroTamanhoDisponivel
    ? calcularPrecoProduto(nome, opcoes.versoes[0].valor, primeiroTamanhoDisponivel, {})
    : null;

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
      "Nome e número custam R$40, patch R$30 e patrocinadores R$80",
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
          <div class="preco-destaque" id="precoDinamico">${precoInicial ? formatarPreco(precoInicial) : "Sem estoque no momento"}</div>
          <small id="precoInfoTexto">Preço calculado conforme versão, tamanho e extras escolhidos.</small>
        </div>

        <div class="produto-configuracoes">
          <label>
            Versão
            <select id="produtoVersao">${versoesHTML}</select>
          </label>

          <label>
            Tamanho
            ${criarSelectTamanhosHTML(tamanhosProduto, "produtoTamanho")}
          <div id="produtoEstoqueResumo">${criarResumoEstoqueHTML(tamanhosProduto)}</div>
          </label>
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

async function carregarPaginaProduto() {
  const container = document.getElementById("produto");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id") || "";
  let nome = urlParams.get("nome");
  let img = urlParams.get("img");
  let categoria = urlParams.get("categoria") || "";

  produtoAtualId = id || "";
  categoriaAtualProduto = categoria || "";

  if (id) {
    try {
      const produto = await buscarProdutoApiPorId(id);
      window.__produtoPaginaAtual = produto;
      produtoAtualId = produto.id || id || "";
      categoriaAtualProduto = produto.categoria || categoria || "";
      if (produto.categoria) {
        carregarPaginaProdutoExtra(produto.nome, produto.img, produto.categoria);
        return;
      }

      nome = produto.nome;
      img = produto.img;
      categoria = "";
    } catch (erro) {
      console.warn("Erro ao carregar produto do banco:", erro);
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

  if (!window.__produtoPaginaAtual) {
    window.__produtoPaginaAtual = {
      id: produtoAtualId || obterIdCamisa(nome),
      nome,
      img,
      categoria,
      tamanhos: obterOpcoesProduto(nome).tamanhos.map((tamanho) => ({ size: tamanho, stockQuantity: 1, available: true }))
    };
  }

  produtoAtualId = produtoAtualId || window.__produtoPaginaAtual?.id || obterIdCamisa(nome);
  categoriaAtualProduto = categoriaAtualProduto || window.__produtoPaginaAtual?.categoria || categoria || "";

  if (categoria) {
    carregarPaginaProdutoExtra(nome, img, categoria);
    return;
  }

  if (
    window.__produtoPaginaAtual
    && !ehProdutoCamisaEspecial(window.__produtoPaginaAtual, categoria)
    && ((window.__produtoPaginaAtual.optionGroups && window.__produtoPaginaAtual.optionGroups.length) || (window.__produtoPaginaAtual.customizationOptions && window.__produtoPaginaAtual.customizationOptions.length) || (window.__produtoPaginaAtual.specs && window.__produtoPaginaAtual.specs.length))
  ) {
    carregarPaginaProdutoGenerico(window.__produtoPaginaAtual, window.__produtoPaginaAtual.time || "");
    return;
  }

  const opcoes = obterOpcoesProduto(nome);
  const versoesHTML = opcoes.versoes.map(item => `<option value="${escaparHTML(item.valor)}">${escaparHTML(item.label)}</option>`).join("");
  const tamanhosProduto = obterTamanhosAtivosCamisa(window.__produtoPaginaAtual || {}, nome, opcoes.versoes[0].valor);
  const primeiroTamanhoDisponivel = obterPrimeiroTamanhoDisponivel(tamanhosProduto);
  const precoInicial = primeiroTamanhoDisponivel
    ? calcularPrecoProduto(nome, opcoes.versoes[0].valor, primeiroTamanhoDisponivel, {})
    : null;

  container.innerHTML = `
    <div class="produto-layout">
      <div class="produto-card">
        <img src="${escaparHTML(img)}" alt="${escaparHTML(nome)}" class="produto-imagem">
      </div>

      <div class="produto-info">
        <h2>${escaparHTML(nome)}</h2>
        <p>${escaparHTML((window.__produtoPaginaAtual && window.__produtoPaginaAtual.descricao) ? window.__produtoPaginaAtual.descricao : "Camisa tailandesa premium")}</p>

        <div class="bloco-preco-produto">
          <div class="preco-destaque" id="precoDinamico">${precoInicial ? formatarPreco(precoInicial) : "Sem estoque no momento"}</div>
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
            ${criarSelectTamanhosHTML(tamanhosProduto, "produtoTamanho")}
          <div id="produtoEstoqueResumo">${criarResumoEstoqueHTML(tamanhosProduto)}</div>
          </label>
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


function rolarAteSecaoComOffset(alvo) {
  if (!alvo) return;
  const header = document.querySelector('header');
  const headerAltura = header ? header.offsetHeight : 0;
  const margemExtra = 14;
  const topo = alvo.getBoundingClientRect().top + window.scrollY - headerAltura - margemExtra;

  window.scrollTo({
    top: Math.max(0, topo),
    behavior: 'smooth'
  });
}

async function carregarTimesHome() {
  const categoriasContainer = document.getElementById("categoriasTimesHome");
  const timesContainer = document.getElementById("timesDinamicosHome");
  if (!categoriasContainer || !timesContainer) return;

  categoriasContainer.innerHTML = '<div class="card">Carregando seções...</div>';
  timesContainer.innerHTML = '<div class="aviso-sem-produtos-filtrados">Carregando times do catálogo...</div>';

  try {
    const catalogo = await carregarCatalogoApi();
    const produtosComTime = catalogo.products.filter((produto) => produto.time);
    const mapaProdutosPorTime = new Map();

    produtosComTime.forEach((produto) => {
      if (!mapaProdutosPorTime.has(produto.time)) mapaProdutosPorTime.set(produto.time, []);
      mapaProdutosPorTime.get(produto.time).push(produto);
    });

    const timesNormalizados = [];
    mapaProdutosPorTime.forEach((listaProdutos, nomeTime) => {
      const metaTime = obterMetaTime(nomeTime) || {};
      timesNormalizados.push({
        name: nomeTime,
        homeSection: String(metaTime.homeSection || obterSecaoHomeProduto(listaProdutos[0]) || 'Outros times').trim(),
        crestUrl: String(metaTime.crestUrl || listaProdutos[0]?.crestUrl || '').trim(),
        displayOrder: Number(metaTime.displayOrder || 0),
        productCount: listaProdutos.length
      });
    });

    const timesPorSecao = new Map();
    timesNormalizados.forEach((time) => {
      const secao = time.homeSection || 'Outros times';
      if (!timesPorSecao.has(secao)) timesPorSecao.set(secao, []);
      timesPorSecao.get(secao).push(time);
    });

    const secoes = ordenarSecoesHome([...timesPorSecao.keys()]);
    categoriasContainer.innerHTML = "";
    timesContainer.innerHTML = "";

    if (!secoes.length) {
      categoriasContainer.innerHTML = '<div class="card">Nenhuma seção cadastrada</div>';
      timesContainer.innerHTML = '<div class="aviso-sem-produtos-filtrados">Nenhum time foi encontrado no catálogo.</div>';
      return;
    }

    secoes.forEach((secao) => {
      const botao = document.createElement("a");
      botao.href = `#${slugSecaoHome(secao)}`;
      botao.className = "categoria-box";
      botao.textContent = secao;
      botao.addEventListener("click", (event) => {
        event.preventDefault();
        const alvoSecao = document.getElementById(slugSecaoHome(secao));
        if (alvoSecao) {
          rolarAteSecaoComOffset(alvoSecao);
          if (history.replaceState) {
            history.replaceState(null, "", `#${slugSecaoHome(secao)}`);
          }
        }
      });
      categoriasContainer.appendChild(botao);

      const bloco = document.createElement("section");
      bloco.className = "home-times-section";

      const topo = document.createElement("div");
      topo.className = "home-times-section-top";
      const titulo = document.createElement("h2");
      titulo.id = slugSecaoHome(secao);
      titulo.textContent = secao;
      topo.appendChild(titulo);
      bloco.appendChild(topo);

      const trilha = document.createElement("div");
      trilha.className = "home-times-carousel";
      trilha.innerHTML = `
        <button type="button" class="home-times-arrow left" aria-label="Ver times anteriores">‹</button>
        <div class="home-times-track-wrap">
          <div class="home-times-track"></div>
        </div>
        <button type="button" class="home-times-arrow right" aria-label="Ver mais times">›</button>
      `;

      const track = trilha.querySelector(".home-times-track");
      const leftArrow = trilha.querySelector(".home-times-arrow.left");
      const rightArrow = trilha.querySelector(".home-times-arrow.right");

      (timesPorSecao.get(secao) || [])
        .sort((a, b) => {
          if (a.displayOrder !== b.displayOrder) return a.displayOrder - b.displayOrder;
          return a.name.localeCompare(b.name, "pt-BR");
        })
        .forEach((time) => {
          const item = document.createElement("button");
          item.type = "button";
          item.className = "home-time-pill";
          item.setAttribute("aria-label", `Abrir produtos do ${time.name}`);
          item.innerHTML = `
            <span class="home-time-crest-wrap">
              <img src="${escaparHTML(criarImagemEscudoTime(time, time.name))}" alt="${escaparHTML(time.name)}" class="home-time-crest" loading="lazy" />
            </span>
            <span class="home-time-name">${escaparHTML(time.name)}</span>
          `;
          item.addEventListener("click", () => abrirTime(time.name));
          track.appendChild(item);
        });

      let slideTimeout = null;
      let deslizandoCarrossel = false;

      const atualizarSetas = () => {
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth - 4);
        leftArrow.disabled = track.scrollLeft <= 4;
        rightArrow.disabled = track.scrollLeft >= maxScroll;
        const precisaSetas = track.scrollWidth > track.clientWidth + 8;
        leftArrow.hidden = !precisaSetas;
        rightArrow.hidden = !precisaSetas;
      };

      const finalizarDeslizamento = () => {
        deslizandoCarrossel = false;
        track.classList.remove('is-sliding');
        atualizarSetas();
      };

      const deslizar = (direcao) => {
        if (deslizandoCarrossel) return;

        const primeiroItem = track.querySelector('.home-time-pill');
        const larguraItem = primeiroItem ? (primeiroItem.getBoundingClientRect().width + 18) : 0;
        const deslocamentoBase = larguraItem ? Math.round(larguraItem * 4) : Math.max(track.clientWidth * 0.8, 220);
        const alvo = track.scrollLeft + (direcao * deslocamentoBase);
        const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);

        deslizandoCarrossel = true;
        track.classList.add('is-sliding');

        track.scrollTo({
          left: Math.max(0, Math.min(alvo, maxScroll)),
          behavior: 'smooth'
        });

        window.clearTimeout(slideTimeout);
        slideTimeout = window.setTimeout(finalizarDeslizamento, 340);
      };

      leftArrow.addEventListener('click', () => deslizar(-1));
      rightArrow.addEventListener('click', () => deslizar(1));
      track.addEventListener('scroll', () => {
        atualizarSetas();
        if (!deslizandoCarrossel) return;
        window.clearTimeout(slideTimeout);
        slideTimeout = window.setTimeout(finalizarDeslizamento, 120);
      });
      window.addEventListener('resize', atualizarSetas);
      window.setTimeout(atualizarSetas, 50);

      bloco.appendChild(trilha);
      timesContainer.appendChild(bloco);
    });
  } catch (erro) {
    console.warn("Erro ao carregar times da home:", erro);
    categoriasContainer.innerHTML = '<div class="card">Seções indisponíveis</div>';
    timesContainer.innerHTML = '<div class="aviso-sem-produtos-filtrados">Não foi possível carregar os times do catálogo agora.</div>';
  }
}

async function carregarOutrosProdutosHome() {
  const container = document.getElementById("outrosProdutos");
  if (!container) return;

  container.innerHTML = '<div class="card">Carregando categorias...</div>';

  try {
    const catalogo = await carregarCatalogoApi();
    const categorias = catalogo.categories || [];
    container.innerHTML = "";

    categorias.forEach(categoria => {
      const card = document.createElement("div");
      card.className = "card";
      card.textContent = categoria;
      card.addEventListener("click", () => abrirCategoria(categoria));
      container.appendChild(card);
    });
  } catch (erro) {
    console.warn("Erro ao carregar categorias do banco:", erro);
    container.innerHTML = '<div class="card">Categorias indisponíveis no momento</div>';
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    fecharCarrinho();
    fecharModalEntrega();
  }
});

document.addEventListener('click', (event) => {
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;

  const href = anchor.getAttribute('href') || '';
  if (!href || href === '#') return;

  const alvo = document.querySelector(href);
  if (!alvo) return;

  event.preventDefault();
  rolarAteSecaoComOffset(alvo);

  if (history.replaceState) {
    history.replaceState(null, '', href);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  sincronizarEstadoCarrinhoFechado();

  const fundoCarrinho = document.getElementById("fundoCarrinho");
  const botoesFecharCarrinho = document.querySelectorAll(".btn-fechar-carrinho");

  if (fundoCarrinho) {
    fundoCarrinho.addEventListener("click", fecharCarrinho);
  }

  botoesFecharCarrinho.forEach((botao) => {
    botao.addEventListener("click", fecharCarrinho);
  });
});

window.abrirCarrinho = abrirCarrinho;
window.fecharCarrinho = fecharCarrinho;

carregarTimesHome();
carregarOutrosProdutosHome();
carregarPaginaCamisas();
carregarPesquisa();
carregarPaginaProduto();
atualizarCarrinho();


function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function formatarNomeProdutoAdmin(produto) {
  return [produto.time || produto.categoria, produto.nome].filter(Boolean).join(" - ") || produto.nome;
}

function normalizarTextoBusca(texto) {
  return String(texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function preencherSelectAdmin(select, valores = []) {
  if (!select) return;
  const atual = select.value;
  select.innerHTML = '<option value="">Todos</option>' + valores
    .filter(Boolean)
    .map((item) => `<option value="${escaparHTML(item)}">${escaparHTML(item)}</option>`)
    .join("");
  if (valores.includes(atual)) select.value = atual;
}

function criarCardAdminEstoque(produto) {
  const imagemProduto = produto.img || '';
  const imagemMarkup = imagemProduto
    ? `<img src="${escaparHTML(imagemProduto)}" alt="${escaparHTML(formatarNomeProdutoAdmin(produto))}" class="admin-card-thumb" loading="lazy" />`
    : `<div class="admin-card-thumb admin-card-thumb-placeholder" aria-hidden="true">Sem imagem</div>`;
  const entradasNormalizadas = normalizarStockEntriesProduto(produto.stockEntries);
  const usarVariacoesCamisa = produto.type === 'camisa' || produtoTemEstoquePorVersao(produto);
  const versoes = usarVariacoesCamisa ? obterTiposEstoqueAdmin() : obterVersoesProduto(produto);
  const tamanhosBase = (() => {
    const tamanhosDasEntradas = [...new Set(entradasNormalizadas.map((item) => item.size).filter(Boolean))];
    if (tamanhosDasEntradas.length) return tamanhosDasEntradas;
    const tamanhosDoProduto = normalizarTamanhosProduto(produto.tamanhos).map((item) => item.size);
    if (tamanhosDoProduto.length) return tamanhosDoProduto;
    return obterTamanhosPadraoAdmin({
      nome: produto.nome || produto.name,
      categoria: produto.categoria || produto.category,
      optionGroups: produto.optionGroups || []
    });
  })();

  const renderGrade = (entries = [], versionValue = '', versionLabel = '') => {
    const mapa = new Map(entries.map((item) => [String(item.size || '').trim().toUpperCase(), Number(item.stockQuantity || 0)]));
    return `
      <div class="admin-sizes-grid">
        ${tamanhosBase.map((size) => {
          const stockQuantity = mapa.get(size) || 0;
          const disponivel = stockQuantity > 0;
          return `
          <label class="admin-size-item ${disponivel ? '' : 'sem-estoque'}">
            <span>${escaparHTML(size)}</span>
            <input
              type="number"
              min="0"
              step="1"
              value="${Number(stockQuantity)}"
              data-stock-input="true"
              data-size="${escaparHTML(size)}"
              data-version-value="${escaparHTML(versionValue)}"
              data-version-label="${escaparHTML(versionLabel)}"
            />
          </label>
        `;
        }).join('')}
      </div>
    `;
  };

  const estoqueMarkup = usarVariacoesCamisa
    ? `
      <div class="admin-stock-switcher">
        <label class="admin-stock-select-label">
          <span>Variação da camisa</span>
          <select data-admin-stock-select>
            ${versoes.map((versao) => `<option value="${escaparHTML(versao.value)}">${escaparHTML(versao.label)}</option>`).join('')}
          </select>
        </label>
        ${versoes.map((versao, index) => `
          <div class="admin-stock-panel${index === 0 ? ' ativo' : ''}" data-admin-stock-panel="${escaparHTML(versao.value)}">
            ${renderGrade(entradasNormalizadas.filter((item) => item.versionValue === versao.value), versao.value, versao.label)}
          </div>
        `).join('')}
      </div>
    `
    : renderGrade(entradasNormalizadas.filter((item) => !item.versionValue), '', '');

  return `
    <article class="admin-card-estoque" data-product-id="${escaparHTML(produto.id)}">
      <div class="admin-card-header">
        <div class="admin-card-header-main">
          ${imagemMarkup}
          <div class="admin-card-header-content">
            <p class="admin-card-tag">${escaparHTML(produto.categoria || produto.time || produto.type || 'Produto')}</p>
            <h2>${escaparHTML(formatarNomeProdutoAdmin(produto))}</h2>
            ${produto.time ? `<p class="admin-card-desc"><strong>Seção da home:</strong> ${escaparHTML(obterSecaoHomeProduto(produto))}</p>` : ''}
            <p class="admin-card-desc">${escaparHTML(produto.descricao || 'Sem descrição')}</p>
            ${usarVariacoesCamisa ? `<p class="admin-card-desc"><strong>Estoque separado por:</strong> ${escaparHTML(versoes.map((item) => item.label).join(' • '))}</p>` : ''}
          </div>
        </div>
        <div class="admin-card-meta">
          <span>ID: ${escaparHTML(produto.id)}</span>
          <span>${escaparHTML(produto.priceLabel || (produto.precoBase ? `R$ ${produto.precoBase}` : 'Sem preço'))}</span>
        </div>
      </div>

      ${estoqueMarkup}

      <div class="admin-card-actions">
        <p class="admin-card-feedback" data-feedback></p>
        <div class="admin-acoes-secundarias">
          <button type="button" class="botao-secundario" data-edit-product>Editar produto</button>
          <button type="button" class="botao-secundario botao-excluir" data-delete-product>Excluir produto</button>
          <button type="button" class="botao-principal" data-save-stock>Salvar estoque</button>
        </div>
      </div>
    </article>
  `;
}

function obterCamposFormularioProdutoAdmin() {
  return {
    form: document.getElementById("formAdminProduto"),
    titulo: document.getElementById("tituloFormularioProduto"),
    idLabel: document.getElementById("adminProdutoIdLabel"),
    feedback: document.getElementById("feedbackProdutoAdmin"),
    nome: document.getElementById("adminProdutoNome"),
    tipo: document.getElementById("adminProdutoTipo"),
    time: document.getElementById("adminProdutoTime"),
    categoria: document.getElementById("adminProdutoCategoria"),
    homeSection: document.getElementById("adminProdutoHomeSection"),
    novaHomeSection: document.getElementById("adminProdutoNovaHomeSection"),
    escudo: document.getElementById("adminTimeEscudo"),
    escudoArquivo: document.getElementById("adminTimeEscudoArquivo"),
    escudoPreview: document.getElementById("adminTimeEscudoPreview"),
    timeSelect: document.getElementById("adminProdutoTimeSelect"),
    novoTime: document.getElementById("adminProdutoNovoTime"),
    categoriaSelect: document.getElementById("adminProdutoCategoriaSelect"),
    novaCategoria: document.getElementById("adminProdutoNovaCategoria"),
    campoSecaoWrapper: document.getElementById("adminCampoSecaoWrapper"),
    campoNovaSecaoWrapper: document.getElementById("adminCampoNovaSecaoWrapper"),
    campoTimeWrapper: document.getElementById("adminCampoTimeWrapper"),
    campoNovoTimeWrapper: document.getElementById("adminCampoNovoTimeWrapper"),
    campoEscudoWrapper: document.getElementById("adminCampoEscudoWrapper"),
    campoEscudoArquivoWrapper: document.getElementById("adminCampoEscudoArquivoWrapper"),
    campoEscudoPreviewWrapper: document.getElementById("adminCampoEscudoPreviewWrapper"),
    campoCategoriaWrapper: document.getElementById("adminCampoCategoriaWrapper"),
    campoNovaCategoriaWrapper: document.getElementById("adminCampoNovaCategoriaWrapper"),
    precoBase: document.getElementById("adminProdutoPrecoBase"),
    priceLabel: document.getElementById("adminProdutoPriceLabel"),
    imagem: document.getElementById("adminProdutoImagem"),
    imagemArquivo: document.getElementById("adminProdutoImagemArquivo"),
    imagemPreview: document.getElementById("adminProdutoImagemPreview"),
    descricao: document.getElementById("adminProdutoDescricao"),
    customizacao: document.getElementById("adminProdutoCustomizacao"),
    consulta: document.getElementById("adminProdutoConsulta"),
    estoquePorTipo: document.getElementById("adminProdutoEstoquePorTipo"),
    listaTamanhos: document.getElementById("listaTamanhosProdutoAdmin"),
    cancelar: document.getElementById("cancelarEdicaoProduto"),
    salvar: document.getElementById("salvarProdutoAdmin")
  };
}

function preencherSelectComCriacao(select, valores = [], placeholder = "Selecione") {
  if (!select) return;
  const atual = String(select.dataset.pendingValue || select.value || "");
  const opcoes = [...new Set(valores.map((item) => String(item || "").trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, "pt-BR"));

  select.innerHTML = [
    `<option value="">${placeholder}</option>`,
    ...opcoes.map((valor) => `<option value="${escaparHTML(valor)}">${escaparHTML(valor)}</option>`),
    '<option value="__novo__">+ Criar novo</option>'
  ].join("");

  if (atual && opcoes.includes(atual)) {
    select.value = atual;
  } else if (atual === "__novo__") {
    select.value = "__novo__";
  } else {
    select.value = "";
  }

  delete select.dataset.pendingValue;
}

function obterValorCampoComCriacao(select, novoInput) {
  if (!select) return "";
  if (select.value === "__novo__") {
    return String(novoInput?.value || "").trim();
  }
  return String(select.value || "").trim();
}

function sincronizarCamposEstruturaAdmin(campos) {
  if (!campos) return;

  const tipo = String(campos.tipo?.value || "camisa");
  const timeValor = obterValorCampoComCriacao(campos.timeSelect, campos.novoTime);
  const categoriaValor = obterValorCampoComCriacao(campos.categoriaSelect, campos.novaCategoria);
  const metaTime = tipo === 'camisa' ? obterMetaTime(timeValor) : null;

  if (campos.campoTimeWrapper) campos.campoTimeWrapper.style.display = tipo === "camisa" ? "" : "none";
  if (campos.campoNovoTimeWrapper) campos.campoNovoTimeWrapper.style.display = tipo === "camisa" && campos.timeSelect?.value === "__novo__" ? "" : "none";
  if (campos.campoEscudoWrapper) campos.campoEscudoWrapper.style.display = tipo === "camisa" ? "" : "none";
  if (campos.campoEscudoArquivoWrapper) campos.campoEscudoArquivoWrapper.style.display = tipo === "camisa" ? "" : "none";
  if (campos.campoEscudoPreviewWrapper) campos.campoEscudoPreviewWrapper.style.display = tipo === "camisa" ? "" : "none";
  if (campos.campoCategoriaWrapper) campos.campoCategoriaWrapper.style.display = tipo === "categoria" ? "" : "none";
  if (campos.campoNovaCategoriaWrapper) campos.campoNovaCategoriaWrapper.style.display = tipo === "categoria" && campos.categoriaSelect?.value === "__novo__" ? "" : "none";
  if (campos.campoSecaoWrapper) campos.campoSecaoWrapper.style.display = tipo === "camisa" ? "" : "none";
  if (campos.campoNovaSecaoWrapper) campos.campoNovaSecaoWrapper.style.display = tipo === "camisa" && campos.homeSection?.value === "__novo__" ? "" : "none";

  if (tipo === 'camisa' && campos.homeSection) {
    const secaoMeta = metaTime?.homeSection || '';
    if ((!campos.homeSection.value || campos.homeSection.value === '') && secaoMeta) {
      const opcoes = [...campos.homeSection.options].map((item) => item.value);
      if (opcoes.includes(secaoMeta)) {
        campos.homeSection.value = secaoMeta;
        if (campos.novaHomeSection) campos.novaHomeSection.value = '';
      } else {
        campos.homeSection.value = '__novo__';
        if (campos.novaHomeSection) campos.novaHomeSection.value = secaoMeta;
      }
    }
  }

  const homeSectionValor = tipo === 'camisa'
    ? obterValorCampoComCriacao(campos.homeSection, campos.novaHomeSection) || metaTime?.homeSection || ''
    : '';

  if (tipo === 'camisa' && campos.escudo && !campos.escudo.value.trim() && metaTime?.crestUrl) {
    campos.escudo.value = metaTime.crestUrl;
    atualizarPreviewEscudoAdmin(campos);
  }

  if (campos.time) campos.time.value = tipo === "camisa" ? timeValor : "";
  if (campos.categoria) campos.categoria.value = tipo === "categoria" ? categoriaValor : "";
  if (campos.homeSection) campos.homeSection.dataset.resolvedValue = homeSectionValor;

  if (tipo === "camisa" && !campos.categoria.value) {
    campos.categoria.value = "";
  }
  if (tipo === "categoria" && !campos.time.value) {
    campos.time.value = "";
    if (campos.escudo) campos.escudo.value = "";
  }
}

function preencherEstruturaFormularioAdmin(campos, produtos = [], produto = null) {
  const secoesCatalogo = produtos.filter((item) => item.time).map((item) => obterSecaoHomeProduto(item));
  const secoesTimes = (catalogoApiState.teamDetails || []).map((item) => item.homeSection).filter(Boolean);
  const secoes = ordenarSecoesHome([...secoesCatalogo, ...secoesTimes]);
  const times = [...new Set([
    ...produtos.map((item) => item.time).filter(Boolean),
    ...(catalogoApiState.teamDetails || []).map((item) => item.name).filter(Boolean)
  ])].sort((a, b) => a.localeCompare(b, "pt-BR"));
  const categorias = [...new Set(produtos.map((item) => item.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR"));

  preencherSelectComCriacao(campos.homeSection, secoes, "Escolha a seção");
  preencherSelectComCriacao(campos.timeSelect, times, "Escolha o time");
  preencherSelectComCriacao(campos.categoriaSelect, categorias, "Escolha a categoria");

  if (produto?.time) {
    if (times.includes(produto.time)) {
      campos.timeSelect.value = produto.time;
      campos.novoTime.value = "";
    } else {
      campos.timeSelect.value = "__novo__";
      campos.novoTime.value = produto.time;
    }
  } else {
    campos.timeSelect.value = "";
    campos.novoTime.value = "";
  }

  if (produto?.categoria) {
    if (categorias.includes(produto.categoria)) {
      campos.categoriaSelect.value = produto.categoria;
      campos.novaCategoria.value = "";
    } else {
      campos.categoriaSelect.value = "__novo__";
      campos.novaCategoria.value = produto.categoria;
    }
  } else {
    campos.categoriaSelect.value = "";
    campos.novaCategoria.value = "";
  }

  const metaTimeAtual = produto?.time ? obterMetaTime(produto.time) : null;
  const secaoAtual = produto?.homeSection || metaTimeAtual?.homeSection || (produto?.time ? inferirSecaoHomePadrao(produto.time) : "");
  if (secaoAtual) {
    if (secoes.includes(secaoAtual)) {
      campos.homeSection.value = secaoAtual;
      campos.novaHomeSection.value = "";
    } else {
      campos.homeSection.value = "__novo__";
      campos.novaHomeSection.value = secaoAtual;
    }
  } else {
    campos.homeSection.value = "";
    campos.novaHomeSection.value = "";
  }

  sincronizarCamposEstruturaAdmin(campos);
}

function obterTamanhosPadraoAdmin(contexto = {}) {
  const nome = normalizarTextoBusca(contexto.nome || "");
  const categoria = normalizarTextoBusca(contexto.categoria || "");
  const optionGroups = normalizarOptionGroupsProduto(contexto.optionGroups || []);
  const labelsVariacao = optionGroups.flatMap((group) => group.values.map((value) => normalizarTextoBusca(value.label)));

  if (nome.includes("kit infantil") || categoria.includes("kit infantil") || categoria.includes("infantil")) {
    return ["2", "4", "6", "8", "10", "12", "14"];
  }
  if (nome.includes("blusa 3 cabos") || categoria.includes("3 cabos")) {
    return ["M", "G", "GG"];
  }
  if (labelsVariacao.some((label) => label.includes("torcedor")) || labelsVariacao.some((label) => label.includes("jogador"))) {
    return ["P", "M", "G", "G2", "G3", "G4"];
  }
  if (labelsVariacao.some((label) => label.includes("manga longa"))) {
    return ["P", "M", "G", "G2"];
  }
  return ["P", "M", "G", "G2"];
}

function criarLinhaTamanhoAdmin(size = '', stockQuantity = 0, versionValue = '', versionLabel = '') {
  const wrapper = document.createElement('div');
  wrapper.className = 'admin-size-item admin-size-item-row';
  wrapper.innerHTML = `
    <label>
      <span>Tamanho</span>
      <input type="text" data-admin-size-name value="${escaparHTML(size)}" readonly />
    </label>
    <label>
      <span>Quantidade</span>
      <input type="number" min="0" step="1" data-admin-size-stock data-admin-version-value="${escaparHTML(versionValue)}" data-admin-version-label="${escaparHTML(versionLabel)}" value="${Number(stockQuantity || 0)}" />
    </label>
  `;
  return wrapper;
}

function obterTiposEstoqueAdmin() {
  return [
    { value: 'torcedor', label: 'Torcedor' },
    { value: 'jogador', label: 'Jogador' },
    { value: 'manga-longa', label: 'Manga Longa' }
  ];
}

function lerEstoqueFormularioAdmin(lista) {
  if (!lista) return [];
  return [...lista.querySelectorAll('[data-admin-size-stock]')]
    .map((input) => ({
      versionValue: String(input.getAttribute('data-admin-version-value') || '').trim(),
      versionLabel: String(input.getAttribute('data-admin-version-label') || '').trim(),
      size: String(input.closest('.admin-size-item-row')?.querySelector('[data-admin-size-name]')?.value || '').trim().toUpperCase(),
      stockQuantity: Number(input.value || 0)
    }))
    .filter((item) => item.size);
}

function renderizarEstoqueFormularioAdmin(campos, contexto = {}, stockEntries = []) {
  const lista = campos?.listaTamanhos;
  if (!lista) return;

  const entradas = normalizarStockEntriesProduto(stockEntries);
  const tamanhosPadrao = entradas.length
    ? [...new Set(entradas.map((item) => item.size))]
    : obterTamanhosPadraoAdmin(contexto);
  const porTipo = Boolean(campos?.estoquePorTipo?.checked);
  const mapa = new Map(entradas.map((item) => [`${item.versionValue || ''}::${item.size}`, Number(item.stockQuantity || 0)]));

  lista.innerHTML = '';

  if (porTipo) {
    obterTiposEstoqueAdmin().forEach((tipo) => {
      const bloco = document.createElement('section');
      bloco.className = 'admin-stock-variant-card';
      bloco.innerHTML = `<h4>${escaparHTML(tipo.label)}</h4>`;
      const grade = document.createElement('div');
      grade.className = 'admin-sizes-grid';

      const tamanhosDoTipo = tipo.value === 'manga-longa'
        ? ['P', 'M', 'G', 'G2']
        : ['P', 'M', 'G', 'G2', 'G3', 'G4'];

      tamanhosDoTipo.forEach((size) => {
        grade.appendChild(criarLinhaTamanhoAdmin(size, mapa.get(`${tipo.value}::${size}`) || 0, tipo.value, tipo.label));
      });

      bloco.appendChild(grade);
      lista.appendChild(bloco);
    });
    return;
  }

  const grade = document.createElement('div');
  grade.className = 'admin-sizes-grid';
  tamanhosPadrao.forEach((size) => {
    grade.appendChild(criarLinhaTamanhoAdmin(size, mapa.get(`::${size}`) || mapa.get(size) || 0, '', ''));
  });
  lista.appendChild(grade);
}

function lerTamanhosFormularioAdmin(lista) {
  return lerEstoqueFormularioAdmin(lista)
    .filter((item) => !item.versionValue)
    .map((item) => ({ size: item.size, stockQuantity: item.stockQuantity }));
}

function parseTextareaList(value = "") {
  return String(value || "").split(/\n+/).map((item) => item.trim()).filter(Boolean);
}

function parseOptionGroupsTextarea(value = "") {
  const groups = {};
  parseTextareaList(value).forEach((line) => {
    const [groupName, optionLabel, adjustmentRaw] = line.split("|").map((item) => String(item || "").trim());
    if (!groupName || !optionLabel) return;
    if (!groups[groupName]) groups[groupName] = { name: groupName, type: "single", values: [] };
    groups[groupName].values.push({
      value: slugify(optionLabel),
      label: optionLabel,
      priceAdjustment: Number(String(adjustmentRaw || "0").replace(",", ".")) || 0
    });
  });
  return Object.values(groups).filter((group) => group.values.length);
}

function parseCustomizationTextarea(value = "") {
  return parseTextareaList(value).map((line) => {
    const [label, adjustmentRaw] = line.split("|").map((item) => String(item || "").trim());
    return {
      key: slugify(label),
      label,
      priceAdjustment: Number(String(adjustmentRaw || "0").replace(",", ".")) || 0
    };
  }).filter((item) => item.label);
}

function obterCustomizacaoEspecificaConfig(campos) {
  return [
    { key: 'nome', label: 'Nome', activeField: campos.personalizacaoNomeAtiva, fixedPrice: PRECO_TABELA_PERSONALIZACAO.nome },
    { key: 'numero', label: 'Número', activeField: campos.personalizacaoNumeroAtiva, fixedPrice: PRECO_TABELA_PERSONALIZACAO.numero },
    { key: 'patch', label: 'Patch', activeField: campos.personalizacaoPatchAtiva, fixedPrice: PRECO_TABELA_PERSONALIZACAO.patch }
  ];
}

function obterCustomizacoesEspecificasDoFormulario(campos) {
  return obterCustomizacaoEspecificaConfig(campos)
    .filter((item) => Boolean(item.activeField?.checked))
    .map((item) => ({
      key: item.key,
      label: item.label,
      priceAdjustment: Number(item.fixedPrice || 0)
    }));
}

function separarCustomizacoesEspecificas(customizations = []) {
  const normalizadas = normalizarCustomizacoesProduto(customizations);
  const especificas = { nome: null, numero: null, patch: null };
  const extras = [];

  normalizadas.forEach((item) => {
    const key = String(item.key || slugify(item.label)).toLowerCase();
    if (key === 'nome') especificas.nome = { ...item, key: 'nome', label: 'Nome' };
    else if (key === 'numero' || key === 'número') especificas.numero = { ...item, key: 'numero', label: 'Número' };
    else if (key === 'patch') especificas.patch = { ...item, key: 'patch', label: 'Patch' };
    else extras.push(item);
  });

  return { especificas, extras };
}

function preencherCamposCustomizacaoEspecifica(campos, customizations = []) {
  const { especificas, extras } = separarCustomizacoesEspecificas(customizations);
  const mapa = {
    nome: campos.personalizacaoNomeAtiva,
    numero: campos.personalizacaoNumeroAtiva,
    patch: campos.personalizacaoPatchAtiva
  };

  Object.entries(mapa).forEach(([key, checkbox]) => {
    const item = especificas[key];
    if (checkbox) checkbox.checked = Boolean(item);
  });

  return extras;
}

function optionGroupsToTextarea(optionGroups = []) {
  return normalizarOptionGroupsProduto(optionGroups)
    .flatMap((group) => group.values.map((value) => `${group.name} | ${value.label} | ${Number(value.priceAdjustment || 0)}`))
    .join("\n");
}

function customizationsToTextarea(customizations = []) {
  return normalizarCustomizacoesProduto(customizations)
    .map((item) => `${item.label} | ${Number(item.priceAdjustment || 0)}`)
    .join("\n");
}

function atualizarTamanhosPadraoDoFormularioAdmin(campos) {
  const estoqueAtual = lerEstoqueFormularioAdmin(campos.listaTamanhos);
  renderizarEstoqueFormularioAdmin(campos, {
    nome: campos.nome.value,
    categoria: campos.categoria.value,
    optionGroups: parseOptionGroupsTextarea(campos.optionGroups?.value || '')
  }, estoqueAtual);
}

function lerArquivoComoDataUrl(arquivo) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onload = () => resolve(String(leitor.result || ''));
    leitor.onerror = () => reject(new Error('Não foi possível ler o arquivo da imagem.'));
    leitor.readAsDataURL(arquivo);
  });
}

async function enviarImagemAdmin(campoUrl, campoArquivo, endpoint, retornoCampo, mensagemErro = 'Não foi possível enviar a imagem.') {
  const arquivo = campoArquivo?.files?.[0];
  if (!arquivo) {
    return String(campoUrl?.value || '').trim();
  }

  if (!String(arquivo.type || '').startsWith('image/')) {
    throw new Error('Escolha um arquivo de imagem válido.');
  }

  const dataUrl = await lerArquivoComoDataUrl(arquivo);
  const resposta = await apiFetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileName: arquivo.name,
      dataUrl
    })
  });

  const data = await resposta.json();
  if (!resposta.ok) {
    throw new Error(data?.error || mensagemErro);
  }

  const valorRetornado = String(data?.[retornoCampo] || '').trim();
  if (!valorRetornado) {
    throw new Error('O servidor não retornou o caminho da imagem.');
  }

  if (campoUrl) campoUrl.value = valorRetornado;
  if (campoArquivo) campoArquivo.value = '';
  return valorRetornado;
}

async function enviarImagemProdutoAdmin(campos) {
  const imageUrl = await enviarImagemAdmin(
    campos?.imagem,
    campos?.imagemArquivo,
    '/api/admin/uploads/product-image',
    'imageUrl',
    'Não foi possível enviar a imagem.'
  );
  atualizarPreviewImagemAdmin(campos);
  return imageUrl;
}

async function enviarEscudoTimeAdmin(campos) {
  const crestUrl = await enviarImagemAdmin(
    campos?.escudo,
    campos?.escudoArquivo,
    '/api/admin/uploads/team-crest',
    'crestUrl',
    'Não foi possível enviar o escudo.'
  );
  atualizarPreviewEscudoAdmin(campos);
  return crestUrl;
}

function montarPayloadProdutoAdmin(campos) {
  sincronizarCamposEstruturaAdmin(campos);

  return {
    name: campos.nome.value.trim(),
    type: campos.tipo.value,
    team: campos.time.value.trim(),
    category: campos.categoria.value.trim(),
    homeSection: String(campos.homeSection?.dataset.resolvedValue || "").trim(),
    crestUrl: String(campos.escudo?.value || "").trim(),
    basePrice: campos.precoBase.value === '' ? null : Number(campos.precoBase.value),
    priceLabel: campos.priceLabel.value.trim(),
    imageUrl: campos.imagem.value.trim(),
    description: campos.descricao.value.trim(),
    specs: [],
    optionGroups: [],
    customizationOptions: [],
    allowCustomization: Boolean(campos.customizacao?.checked),
    onlyConsultation: campos.consulta.checked,
    sizes: lerTamanhosFormularioAdmin(campos.listaTamanhos),
    stockEntries: lerEstoqueFormularioAdmin(campos.listaTamanhos)
  };
}

function atualizarPreviewImagemAdmin(campos) {
  const preview = campos?.imagemPreview;
  if (!preview) return;

  const arquivo = campos?.imagemArquivo?.files?.[0];
  if (preview.dataset.objectUrl) {
    URL.revokeObjectURL(preview.dataset.objectUrl);
    delete preview.dataset.objectUrl;
  }

  if (arquivo && String(arquivo.type || '').startsWith('image/')) {
    const objectUrl = URL.createObjectURL(arquivo);
    preview.dataset.objectUrl = objectUrl;
    preview.innerHTML = `<img src="${escaparHTML(objectUrl)}" alt="Prévia da imagem do produto" class="admin-image-preview" loading="lazy" />`;
    return;
  }

  const valor = String(campos?.imagem?.value || '').trim();
  if (!valor) {
    preview.innerHTML = '<div class="admin-image-preview-placeholder">Sem imagem selecionada</div>';
    return;
  }

  preview.innerHTML = `<img src="${escaparHTML(valor)}" alt="Prévia da imagem do produto" class="admin-image-preview" loading="lazy" />`;
}

function atualizarPreviewEscudoAdmin(campos) {
  const preview = campos?.escudoPreview;
  if (!preview) return;

  const arquivo = campos?.escudoArquivo?.files?.[0];
  if (preview.dataset.objectUrl) {
    URL.revokeObjectURL(preview.dataset.objectUrl);
    delete preview.dataset.objectUrl;
  }

  if (arquivo && String(arquivo.type || '').startsWith('image/')) {
    const objectUrl = URL.createObjectURL(arquivo);
    preview.dataset.objectUrl = objectUrl;
    preview.innerHTML = `<img src="${escaparHTML(objectUrl)}" alt="Prévia do escudo do time" class="admin-image-preview admin-image-preview-contain" loading="lazy" />`;
    return;
  }

  const valor = String(campos?.escudo?.value || '').trim();
  if (!valor) {
    preview.innerHTML = '<div class="admin-image-preview-placeholder">Sem escudo selecionado</div>';
    return;
  }

  preview.innerHTML = `<img src="${escaparHTML(valor)}" alt="Prévia do escudo do time" class="admin-image-preview admin-image-preview-contain" loading="lazy" />`;
}

function preencherFormularioProdutoAdmin(campos, produto = null, produtos = []) {
  const editando = Boolean(produto);
  campos.form.dataset.editingId = editando ? produto.id : '';
  campos.titulo.textContent = editando ? 'Editar produto' : 'Cadastrar novo produto';
  campos.idLabel.textContent = editando ? produto.id : 'Novo produto';
  campos.feedback.textContent = '';
  campos.nome.value = produto?.nome || '';
  campos.tipo.value = produto?.type || 'camisa';
  campos.time.value = produto?.time || '';
  campos.categoria.value = produto?.categoria || '';
  campos.precoBase.value = produto?.precoBase ?? '';
  campos.priceLabel.value = produto?.priceLabel || '';
  campos.imagem.value = produto?.img && !produto.img.startsWith('data:image/svg+xml') ? produto.img : '';
  if (campos.imagemArquivo) campos.imagemArquivo.value = '';
  const metaTime = produto?.time ? obterMetaTime(produto.time) : null;
  campos.escudo.value = produto?.crestUrl || metaTime?.crestUrl || '';
  if (campos.escudoArquivo) campos.escudoArquivo.value = '';
  campos.descricao.value = produto?.descricao || '';
  if (campos.customizacao) campos.customizacao.checked = produto ? Boolean(produto.allowCustomization) : true;
  campos.consulta.checked = produto ? Boolean(produto.somenteConsulta) : false;
  if (campos.estoquePorTipo) campos.estoquePorTipo.checked = produto ? (produtoTemEstoquePorVersao(produto) || produto.type === 'camisa') : false;
  preencherEstruturaFormularioAdmin(campos, produtos, produto);
  renderizarEstoqueFormularioAdmin(campos, {
    nome: produto?.nome || campos.nome.value,
    categoria: produto?.categoria || campos.categoria.value,
    optionGroups: []
  }, produto?.stockEntries || produto?.tamanhos || []);
  atualizarPreviewImagemAdmin(campos);
  atualizarPreviewEscudoAdmin(campos);
}

function criarCardAdminUsuario(usuario) {
  const criadoEm = usuario.createdAt ? formatarDataHora(usuario.createdAt) : 'Sem data';
  const papel = usuario.role === 'admin' ? 'Admin' : 'Cliente';
  const isCurrentUser = Number(usuario.id) === Number(authState.user?.id || 0);

  return `
    <article class="admin-usuario-card" data-user-id="${escaparHTML(String(usuario.id))}">
      <div class="admin-usuario-topo">
        <div>
          <p class="admin-card-tag">${escaparHTML(papel)}</p>
          <h3>${escaparHTML(usuario.name || 'Sem nome')}</h3>
          <p class="admin-card-desc">${escaparHTML(usuario.email || 'Sem e-mail')}</p>
        </div>
        <div class="admin-card-meta">
          <span>ID</span>
          <span>#${escaparHTML(String(usuario.id))}</span>
        </div>
      </div>
      <div class="admin-usuario-meta-grid">
        <p><strong>Criado em:</strong> ${escaparHTML(criadoEm)}</p>
        <p><strong>Perfil:</strong> ${escaparHTML(papel)}${isCurrentUser ? ' (sua conta)' : ''}</p>
      </div>
      <form class="admin-reset-form" data-admin-reset-user-form>
        <label>
          <span>Nova senha</span>
          <input type="password" name="newPassword" minlength="6" required placeholder="Mínimo de 6 caracteres" />
        </label>
        <div class="admin-card-actions admin-reset-actions">
          <p class="admin-card-feedback" data-user-feedback></p>
          <button type="submit" class="botao-principal">Redefinir senha</button>
        </div>
      </form>
    </article>
  `;
}

async function iniciarPainelAdminUsuarios() {
  const lista = document.getElementById('listaAdminUsuarios');
  if (!lista) return;

  const status = document.getElementById('statusUsuariosAdmin');
  const botaoRecarregar = document.getElementById('recarregarUsuariosAdmin');
  let usuarios = [];

  function atualizarStatus(texto) {
    if (status) status.textContent = texto;
  }

  function renderizarUsuarios() {
    lista.innerHTML = usuarios.length
      ? usuarios.map(criarCardAdminUsuario).join('')
      : '<div class="admin-vazio">Nenhum usuário cadastrado encontrado.</div>';
    atualizarStatus(`${usuarios.length} usuário(s) cadastrado(s).`);
  }

  async function carregarUsuarios() {
    try {
      atualizarStatus('Carregando usuários...');
      const resposta = await apiFetch(`${API_BASE}/api/admin/users`);
      const data = await resposta.json();
      if (!resposta.ok) throw new Error(data?.error || 'Não foi possível carregar os usuários.');
      usuarios = Array.isArray(data?.users) ? data.users : [];
      renderizarUsuarios();
    } catch (error) {
      console.error(error);
      lista.innerHTML = '<div class="admin-vazio">Não foi possível carregar os usuários.</div>';
      atualizarStatus(error.message || 'Erro ao carregar usuários.');
    }
  }

  botaoRecarregar?.addEventListener('click', carregarUsuarios);

  lista.addEventListener('submit', async (event) => {
    const form = event.target.closest('[data-admin-reset-user-form]');
    if (!form) return;
    event.preventDefault();

    const card = form.closest('[data-user-id]');
    const feedback = form.querySelector('[data-user-feedback]');
    const submitButton = form.querySelector('button[type="submit"]');
    const newPassword = String(form.querySelector('input[name="newPassword"]')?.value || '');
    const userId = card?.dataset.userId;

    if (!userId) return;

    feedback.textContent = '';
    if (newPassword.trim().length < 6) {
      feedback.textContent = 'A senha precisa ter pelo menos 6 caracteres.';
      return;
    }

    submitButton.disabled = true;
    feedback.textContent = 'Redefinindo senha...';

    try {
      const resposta = await apiFetch(`${API_BASE}/api/admin/users/${encodeURIComponent(userId)}/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword })
      });
      const data = await resposta.json();
      if (!resposta.ok) throw new Error(data?.error || 'Não foi possível redefinir a senha.');
      feedback.textContent = data?.message || 'Senha redefinida com sucesso.';
      form.reset();
    } catch (error) {
      console.error(error);
      feedback.textContent = error.message || 'Não foi possível redefinir a senha.';
    } finally {
      submitButton.disabled = false;
    }
  });

  await carregarUsuarios();
}

async function iniciarPainelAdminEstoque() {
  const lista = document.getElementById("listaAdminEstoque");
  if (!lista) return;

  const status = document.getElementById("statusAdmin");
  const busca = document.getElementById("buscaAdmin");
  const filtroTime = document.getElementById("filtroTimeAdmin");
  const filtroCategoria = document.getElementById("filtroCategoriaAdmin");
  const botaoRecarregar = document.getElementById("recarregarEstoque");
  const camposProduto = obterCamposFormularioProdutoAdmin();

  let produtos = [];

  function atualizarStatus(texto) {
    if (status) status.textContent = texto;
  }

  function sincronizarCatalogoGlobal() {
    catalogoApiState.products = produtos.map((item) => ({
      id: item.id,
      name: item.nome,
      description: item.descricao,
      imageUrl: item.img,
      basePrice: item.precoBase,
      category: item.categoria,
      team: item.time,
      homeSection: item.homeSection,
      crestUrl: item.crestUrl,
      priceLabel: item.priceLabel,
      allowCustomization: item.allowCustomization,
      onlyConsultation: item.somenteConsulta,
      type: item.type,
      sizes: normalizarTamanhosProduto(item.tamanhos),
      stockEntries: normalizarStockEntriesProduto(item.stockEntries || []),
      versionOptions: normalizarVersoesEstoque(item.versionOptions || []),
      stockMode: item.stockMode || (normalizarStockEntriesProduto(item.stockEntries || []).some((entry) => entry.versionValue) ? 'versioned' : 'simple')
    }));
    catalogoApiState.teams = [...new Set(produtos.map((item) => item.time).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    catalogoApiState.teamDetails = [...new Map(
      produtos
        .filter((item) => item.time)
        .map((item) => {
          const metaExistente = obterMetaTime(item.time);
          return [item.time, normalizarTimeApi({
            id: metaExistente?.id,
            name: item.time,
            homeSection: item.homeSection || metaExistente?.homeSection || '',
            crestUrl: item.crestUrl || metaExistente?.crestUrl || '',
            displayOrder: metaExistente?.displayOrder || 0,
            productCount: (Number(metaExistente?.productCount || 0) || 0) + 1
          })];
        })
    ).values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    catalogoApiState.categories = [...new Set(produtos.map((item) => item.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
    catalogoApiState.carregado = true;
  }

  function obterFiltrados() {
    const termo = normalizarTextoBusca(busca?.value);
    const time = filtroTime?.value || "";
    const categoria = filtroCategoria?.value || "";

    return produtos.filter((produto) => {
      const texto = normalizarTextoBusca([
        produto.nome,
        produto.descricao,
        produto.time,
        produto.categoria,
        produto.id
      ].join(" "));

      const passouBusca = !termo || texto.includes(termo);
      const passouTime = !time || produto.time === time;
      const passouCategoria = !categoria || produto.categoria === categoria;
      return passouBusca && passouTime && passouCategoria;
    });
  }

  function renderizar() {
    const filtrados = obterFiltrados();
    lista.innerHTML = filtrados.length
      ? filtrados.map(criarCardAdminEstoque).join("")
      : '<div class="admin-vazio">Nenhum produto encontrado com esse filtro.</div>';
    atualizarStatus(`${filtrados.length} produto(s) encontrado(s).`);
  }

  async function carregar() {
    try {
      atualizarStatus("Carregando produtos...");
      await carregarCatalogoApi(true);
      produtos = [...catalogoApiState.products].sort((a, b) => formatarNomeProdutoAdmin(a).localeCompare(formatarNomeProdutoAdmin(b), 'pt-BR'));
      preencherSelectAdmin(filtroTime, [...new Set(produtos.map((item) => item.time).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR')));
      preencherSelectAdmin(filtroCategoria, [...new Set(produtos.map((item) => item.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR')));
      preencherEstruturaFormularioAdmin(camposProduto, produtos);
      sincronizarCatalogoGlobal();
      renderizar();
    } catch (error) {
      console.error(error);
      lista.innerHTML = '<div class="admin-vazio">Não foi possível carregar os produtos do banco.</div>';
      atualizarStatus("Erro ao carregar produtos.");
    }
  }

  function atualizarProdutoLocal(produtoApi) {
    const produtoMapeado = mapearProdutoApi(produtoApi);
    const index = produtos.findIndex((item) => item.id === produtoMapeado.id);
    if (index >= 0) produtos[index] = produtoMapeado;
    else produtos.unshift(produtoMapeado);
    produtos.sort((a, b) => formatarNomeProdutoAdmin(a).localeCompare(formatarNomeProdutoAdmin(b), 'pt-BR'));
    preencherSelectAdmin(filtroTime, [...new Set(produtos.map((item) => item.time).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR')));
    preencherSelectAdmin(filtroCategoria, [...new Set(produtos.map((item) => item.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR')));
    if (produtoMapeado.time) {
      const metaExistente = obterMetaTime(produtoMapeado.time);
      const metaAtualizada = normalizarTimeApi({
        id: metaExistente?.id,
        name: produtoMapeado.time,
        homeSection: produtoMapeado.homeSection || metaExistente?.homeSection || '',
        crestUrl: produtoMapeado.crestUrl || metaExistente?.crestUrl || '',
        displayOrder: metaExistente?.displayOrder || 0,
        productCount: Math.max(1, Number(metaExistente?.productCount || 0))
      });
      catalogoApiState.teamDetails = [
        ...catalogoApiState.teamDetails.filter((item) => item.name !== produtoMapeado.time),
        metaAtualizada
      ].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    }
    preencherEstruturaFormularioAdmin(camposProduto, produtos);
    sincronizarCatalogoGlobal();
    renderizar();
  }

  function removerProdutoLocal(productId) {
    produtos = produtos.filter((item) => item.id !== productId);
    preencherSelectAdmin(filtroTime, [...new Set(produtos.map((item) => item.time).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR')));
    preencherSelectAdmin(filtroCategoria, [...new Set(produtos.map((item) => item.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR')));
    preencherEstruturaFormularioAdmin(camposProduto, produtos);
    sincronizarCatalogoGlobal();
    renderizar();
  }

  const renderDebounced = debounce(renderizar, 150);
  busca?.addEventListener("input", renderDebounced);
  filtroTime?.addEventListener("change", renderizar);
  filtroCategoria?.addEventListener("change", renderizar);
  botaoRecarregar?.addEventListener("click", carregar);


  camposProduto.cancelar?.addEventListener('click', () => {
    preencherFormularioProdutoAdmin(camposProduto, null, produtos);
  });
  ['input', 'change'].forEach((eventoNome) => {
    camposProduto.nome?.addEventListener(eventoNome, () => atualizarTamanhosPadraoDoFormularioAdmin(camposProduto));
    camposProduto.categoria?.addEventListener(eventoNome, () => atualizarTamanhosPadraoDoFormularioAdmin(camposProduto));
    camposProduto.tipo?.addEventListener(eventoNome, () => {
      sincronizarCamposEstruturaAdmin(camposProduto);
      atualizarTamanhosPadraoDoFormularioAdmin(camposProduto);
    });
    camposProduto.estoquePorTipo?.addEventListener(eventoNome, () => atualizarTamanhosPadraoDoFormularioAdmin(camposProduto));
    camposProduto.timeSelect?.addEventListener(eventoNome, () => sincronizarCamposEstruturaAdmin(camposProduto));
    camposProduto.categoriaSelect?.addEventListener(eventoNome, () => sincronizarCamposEstruturaAdmin(camposProduto));
    camposProduto.homeSection?.addEventListener(eventoNome, () => sincronizarCamposEstruturaAdmin(camposProduto));
    camposProduto.novoTime?.addEventListener(eventoNome, () => sincronizarCamposEstruturaAdmin(camposProduto));
    camposProduto.novaCategoria?.addEventListener(eventoNome, () => sincronizarCamposEstruturaAdmin(camposProduto));
    camposProduto.novaHomeSection?.addEventListener(eventoNome, () => sincronizarCamposEstruturaAdmin(camposProduto));
  });

  camposProduto.imagem?.addEventListener('input', () => {
    atualizarPreviewImagemAdmin(camposProduto);
  });

  camposProduto.imagemArquivo?.addEventListener('change', () => {
    const arquivo = camposProduto.imagemArquivo.files?.[0];
    if (!arquivo) {
      atualizarPreviewImagemAdmin(camposProduto);
      return;
    }
    if (!String(arquivo.type || '').startsWith('image/')) {
      camposProduto.feedback.textContent = 'Escolha um arquivo de imagem válido.';
      camposProduto.imagemArquivo.value = '';
      atualizarPreviewImagemAdmin(camposProduto);
      return;
    }

    camposProduto.feedback.textContent = `Imagem pronta para envio: ${arquivo.name}`;
    atualizarPreviewImagemAdmin(camposProduto);
  });

  camposProduto.escudo?.addEventListener('input', () => {
    atualizarPreviewEscudoAdmin(camposProduto);
  });

  camposProduto.escudoArquivo?.addEventListener('change', () => {
    const arquivo = camposProduto.escudoArquivo.files?.[0];
    if (!arquivo) {
      atualizarPreviewEscudoAdmin(camposProduto);
      return;
    }
    if (!String(arquivo.type || '').startsWith('image/')) {
      camposProduto.feedback.textContent = 'Escolha um arquivo de imagem válido para o escudo.';
      camposProduto.escudoArquivo.value = '';
      atualizarPreviewEscudoAdmin(camposProduto);
      return;
    }

    camposProduto.feedback.textContent = `Escudo pronto para envio: ${arquivo.name}`;
    atualizarPreviewEscudoAdmin(camposProduto);
  });

  camposProduto.form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const editingId = camposProduto.form.dataset.editingId;

    try {
      if (camposProduto.imagemArquivo?.files?.[0]) {
        camposProduto.feedback.textContent = 'Enviando imagem para a pasta do projeto...';
        await enviarImagemProdutoAdmin(camposProduto);
      }
      if (camposProduto.tipo?.value === 'camisa' && camposProduto.escudoArquivo?.files?.[0]) {
        camposProduto.feedback.textContent = 'Enviando escudo do time...';
        await enviarEscudoTimeAdmin(camposProduto);
      }
    } catch (error) {
      camposProduto.feedback.textContent = error.message || 'Não foi possível enviar a imagem.';
      return;
    }

    const payload = montarPayloadProdutoAdmin(camposProduto);

    if (!payload.name) {
      camposProduto.feedback.textContent = 'Preencha o nome do produto.';
      return;
    }
    if (payload.type === 'camisa' && !payload.team) {
      camposProduto.feedback.textContent = 'Escolha um time existente ou crie um novo time para essa camisa.';
      return;
    }
    if (payload.type === 'camisa' && !payload.homeSection) {
      camposProduto.feedback.textContent = 'Escolha a seção da home onde esse time vai aparecer.';
      return;
    }
    if (payload.type === 'categoria' && !payload.category) {
      camposProduto.feedback.textContent = 'Escolha uma categoria existente ou crie uma nova categoria.';
      return;
    }
    if (payload.sizes.some((item) => !Number.isInteger(item.stockQuantity) || item.stockQuantity < 0)) {
      camposProduto.feedback.textContent = 'Use apenas estoque inteiro de 0 para cima.';
      return;
    }

    camposProduto.salvar.disabled = true;
    camposProduto.feedback.textContent = editingId ? 'Salvando alterações...' : 'Criando produto...';

    try {
      const resposta = await apiFetch(editingId
        ? `${API_BASE}/api/admin/products/${encodeURIComponent(editingId)}`
        : `${API_BASE}/api/admin/products`, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resposta.json();
      if (!resposta.ok) throw new Error(data?.error || 'Não foi possível salvar o produto.');

      atualizarProdutoLocal(data.product);
      preencherFormularioProdutoAdmin(camposProduto, null, produtos);
      camposProduto.feedback.textContent = editingId ? 'Produto atualizado com sucesso.' : 'Produto criado com sucesso.';
    } catch (error) {
      console.error(error);
      camposProduto.feedback.textContent = error.message || 'Erro ao salvar produto.';
    } finally {
      camposProduto.salvar.disabled = false;
    }
  });

  lista.addEventListener('change', (event) => {
    const seletorEstoque = event.target.closest('[data-admin-stock-select]');
    if (!seletorEstoque) return;
    const card = seletorEstoque.closest('[data-product-id]');
    if (!card) return;
    const valor = seletorEstoque.value || '';
    card.querySelectorAll('[data-admin-stock-panel]').forEach((painel) => {
      painel.classList.toggle('ativo', painel.getAttribute('data-admin-stock-panel') === valor);
    });
  });

  lista.addEventListener("click", async (event) => {
    const card = event.target.closest("[data-product-id]");
    if (!card) return;

    const feedback = card.querySelector("[data-feedback]");
    const productId = card.dataset.productId;


    const botaoEditar = event.target.closest('[data-edit-product]');
    if (botaoEditar) {
      const produto = produtos.find((item) => item.id === productId);
      if (!produto) return;
      preencherFormularioProdutoAdmin(camposProduto, produto, produtos);
      camposProduto.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    const botaoExcluir = event.target.closest('[data-delete-product]');
    if (botaoExcluir) {
      const produto = produtos.find((item) => item.id === productId);
      if (!produto) return;
      const confirmou = window.confirm(`Excluir o produto "${formatarNomeProdutoAdmin(produto)}"?`);
      if (!confirmou) return;

      botaoExcluir.disabled = true;
      if (feedback) feedback.textContent = 'Excluindo produto...';

      try {
        const resposta = await apiFetch(`${API_BASE}/api/admin/products/${encodeURIComponent(productId)}`, {
          method: 'DELETE'
        });
        const data = await resposta.json();
        if (!resposta.ok) throw new Error(data?.error || 'Não foi possível excluir o produto.');

        removerProdutoLocal(productId);
        if (camposProduto.form.dataset.editingId === productId) {
          preencherFormularioProdutoAdmin(camposProduto, null, produtos);
        }
      } catch (error) {
        console.error(error);
        if (feedback) feedback.textContent = error.message || 'Erro ao excluir.';
      } finally {
        botaoExcluir.disabled = false;
      }
      return;
    }

    const botao = event.target.closest('[data-save-stock]');
    if (!botao) return;

    const inputs = [...card.querySelectorAll('input[data-stock-input]')];
    if (!productId || !inputs.length) return;

    const stockEntries = inputs.map((input) => ({
      size: input.dataset.size,
      versionValue: input.dataset.versionValue || '',
      versionLabel: input.dataset.versionLabel || '',
      stockQuantity: Number(input.value || 0)
    }));

    if (stockEntries.some((item) => !Number.isInteger(item.stockQuantity) || item.stockQuantity < 0)) {
      if (feedback) feedback.textContent = 'Use apenas números inteiros de 0 para cima.';
      return;
    }

    botao.disabled = true;
    if (feedback) feedback.textContent = "Salvando...";

    try {
      const resposta = await apiFetch(`${API_BASE}/api/admin/products/${encodeURIComponent(productId)}/stock`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ stockEntries })
      });

      const data = await resposta.json();
      if (!resposta.ok) {
        throw new Error(data?.error || "Não foi possível salvar o estoque.");
      }

      const produto = produtos.find((item) => item.id === productId);
      if (produto) {
        produto.tamanhos = normalizarTamanhosProduto(data.sizes);
        produto.stockEntries = normalizarStockEntriesProduto(data.stockEntries || []);
        produto.versionOptions = normalizarVersoesEstoque(data.versionOptions || []);
        produto.stockMode = data.stockMode || (produto.stockEntries.some((item) => item.versionValue) ? 'versioned' : 'simple');
        produto.tamanhosDisponiveis = produto.tamanhos.filter((item) => item.available).map((item) => item.size);
      }

      sincronizarCatalogoGlobal();
      if (feedback) feedback.textContent = "Estoque salvo com sucesso.";
      renderizar();
    } catch (error) {
      console.error(error);
      if (feedback) feedback.textContent = error.message || "Erro ao salvar.";
    } finally {
      botao.disabled = false;
    }
  });

  preencherFormularioProdutoAdmin(camposProduto, null);
  await carregar();
}

const MOTION_DURATION_MS = 220;
const prefereMovimentoReduzido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function abrirElementoAnimado(elemento, classe = 'is-open') {
  if (!elemento) return;
  elemento.hidden = false;
  if (prefereMovimentoReduzido) {
    elemento.classList.add(classe);
    return;
  }
  requestAnimationFrame(() => {
    elemento.classList.add(classe);
  });
}

function fecharElementoAnimado(elemento, classe = 'is-open', aoFinalizar = null) {
  if (!elemento) return;
  if (prefereMovimentoReduzido) {
    elemento.classList.remove(classe);
    elemento.hidden = true;
    if (typeof aoFinalizar === 'function') aoFinalizar();
    return;
  }

  elemento.classList.remove(classe);
  window.setTimeout(() => {
    elemento.hidden = true;
    if (typeof aoFinalizar === 'function') aoFinalizar();
  }, MOTION_DURATION_MS);
}

function configurarEntradaDaPagina() {
  sincronizarEstadoCarrinhoFechado();
  document.body.classList.add('page-shell');
  requestAnimationFrame(() => {
    document.body.classList.add('page-ready');
  });
}

function linkDeTransicaoValido(link) {
  if (!link) return false;
  const href = link.getAttribute('href') || '';
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) return false;
  if (link.target && link.target !== '_self') return false;
  if (link.hasAttribute('download') || link.dataset.noTransition !== undefined) return false;

  try {
    const destino = new URL(link.href, window.location.href);
    if (destino.origin !== window.location.origin) return false;
    if (destino.pathname === window.location.pathname && destino.search === window.location.search) return false;
    return /\.html?$/i.test(destino.pathname) || !destino.pathname.split('/').pop().includes('.');
  } catch {
    return false;
  }
}

function configurarTransicaoEntrePaginas() {
  if (prefereMovimentoReduzido) return;

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!linkDeTransicaoValido(link)) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    const destino = link.href;
    sincronizarEstadoCarrinhoFechado();
    document.body.classList.add('page-leaving');
    window.setTimeout(() => {
      window.location.href = destino;
    }, 180);
  });

  window.addEventListener('pageshow', () => {
    sincronizarEstadoCarrinhoFechado();
  });
}

function configurarAnimacaoAoRolar() {
  if (prefereMovimentoReduzido || !('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const elementos = document.querySelectorAll([
    'main section',
    '.hero-home',
    '.topo-categoria',
    '.topo-produto',
    '.card',
    '.mini-card-destaque',
    '.categoria-card',
    '.vantagem-card',
    '.duvida-card',
    '.pedido-card',
    '.info-produto-card',
    '.produto-card',
    '.admin-form-section',
    '.admin-size-editor',
    '.admin-lista',
    '.admin-usuarios-card',
    '.times-carrossel-wrapper',
    '.secao-catalogo-topo',
    '.faixas-info > *'
  ].join(','));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -8% 0px'
  });

  elementos.forEach((elemento, index) => {
    if (elemento.classList.contains('is-visible')) return;
    elemento.classList.add('reveal-on-scroll');
    elemento.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 45}ms`);
    observer.observe(elemento);
  });
}

function configurarFeedbackVisualGlobal() {
  document.querySelectorAll('img').forEach((img) => {
    if (img.complete) {
      img.classList.add('img-loaded');
      return;
    }
    img.addEventListener('load', () => img.classList.add('img-loaded'), { once: true });
  });
}

function ativarMelhoriasDeFluidez() {
  configurarEntradaDaPagina();
  configurarTransicaoEntrePaginas();
  configurarAnimacaoAoRolar();
  configurarFeedbackVisualGlobal();
}

document.addEventListener("DOMContentLoaded", async () => {
  montarModalAuth();
  montarModalConta();
  inserirAcessoAdminNoSite();
  await carregarUsuarioAtual();
  atualizarInterfaceAuth();
  const podeSeguir = await protegerPaginaAdmin();
  configurarAcoesPaginaAdmin();
  if (podeSeguir !== false) {
    iniciarPainelAdminEstoque();
    iniciarPainelAdminUsuarios();
  }
  ativarMelhoriasDeFluidez();
});
