let numeroVendedor = "5511942257565"

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || []

function salvarCarrinho(){
  localStorage.setItem("carrinho", JSON.stringify(carrinho))
}

function abrirTime(time){
  localStorage.setItem("timeEscolhido", time)
  window.location.href = "camisas.html"
}

function voltar(){
  window.location.href = "index.html"
}

function abrirCarrinho(){
  document.getElementById("carrinho").classList.add("ativo")
}

function fecharCarrinho(){
  document.getElementById("carrinho").classList.remove("ativo")
}

// Adicionar produto ao carrinho
function adicionarCarrinho(nome, img){
  let produtoLink = `produto.html?nome=${encodeURIComponent(nome)}&img=${encodeURIComponent(img)}`;
  carrinho.push({nome:nome, link:produtoLink});
  salvarCarrinho();
  atualizarCarrinho();
}

function atualizarCarrinho(){
  let lista = document.getElementById("listaCarrinho");
  if(!lista) return;
  lista.innerHTML="";

  carrinho.forEach((item, index)=>{
    let li = document.createElement("li");
    li.innerHTML = `
      <a href="${item.link}" target="_blank">${item.nome}</a>
      <button onclick="removerCarrinho(${index})" style="margin-left:10px;background:red;padding:2px 6px;font-size:12px;">X</button>
    `;
    lista.appendChild(li)
  })
}

function removerCarrinho(index){
  carrinho.splice(index,1);
  salvarCarrinho();
  atualizarCarrinho();
}

// Compra pelo carrinho com links únicos
function comprarCarrinho(){
  if(carrinho.length===0){
    alert("Seu carrinho está vazio");
    return;
  }

  let itensComLink = carrinho.map(item=>`${item.nome}: https://seusite.netlify.app/${item.link}`).join("\n");

  let msg = `Olá! Quero comprar:\n${itensComLink}`;
  let url = `https://wa.me/${numeroVendedor}?text=${encodeURIComponent(msg)}`;
  window.open(url)
}

// Enviar WhatsApp de forma padronizada (produto único)
function enviarWhats(nome, img){
  let produtoLink = img ? `produto.html?nome=${encodeURIComponent(nome)}&img=${encodeURIComponent(img)}` : `produto.html?nome=${encodeURIComponent(nome)}`;
  let msg = `Olá! Tenho interesse na camisa ${nome}. Link: https://seusite.netlify.app/${produtoLink}`;
  let url = `https://wa.me/${numeroVendedor}?text=${encodeURIComponent(msg)}`;
  window.open(url)
}

// Página de camisas
if(document.getElementById("camisas")){
  let time=localStorage.getItem("timeEscolhido")
  document.getElementById("nomeTime").innerText=time

  let timeImg=time
  .toLowerCase()
  .replaceAll(" ","")
  .replace("ã","a")
  .replace("é","e")
  .replace("ç","c")

  let camisas=[
    {nome:time+" Home", img:"imagens/"+timeImg+"-home.jpg"},
    {nome:time+" Away", img:"imagens/"+timeImg+"-away.jpg"},
    {nome:time+" Third", img:"imagens/"+timeImg+"-third.jpg"},
    {nome:time+" Retrô", img:"imagens/"+timeImg+"-retro.jpg"}
  ]

  let container=document.getElementById("camisas")

  camisas.forEach(camisa=>{
    let div=document.createElement("div")
    div.className="camisa"
    div.innerHTML=`
      <img src="${camisa.img}" alt="${camisa.nome}" style="cursor:pointer;"
      onclick="abrirProduto('${camisa.nome}','${camisa.img}')">

      <h3>${camisa.nome}</h3>
      <p>Camisa tailandesa</p>
      <p><b>A partir de R$160</b></p>

      <button onclick="adicionarCarrinho('${camisa.nome}','${camisa.img}')">Adicionar ao carrinho</button>
      <button onclick="enviarWhats('${camisa.nome}','${camisa.img}')">Comprar no WhatsApp</button>
    `
    container.appendChild(div)
  })
}

// Pesquisa de times
const pesquisa=document.getElementById("pesquisa")
if(pesquisa){
  pesquisa.addEventListener("keyup",function(){
    let filtro=pesquisa.value.toLowerCase()
    let times=document.querySelectorAll(".card")
    times.forEach(function(time){
      let nome=time.textContent.toLowerCase()
      time.style.display = nome.includes(filtro) ? "block" : "none"
    })
  })
}

atualizarCarrinho()

// Página produto individual
function abrirProduto(camisaNome, imgUrl){
  let url = `produto.html?nome=${encodeURIComponent(camisaNome)}&img=${encodeURIComponent(imgUrl)}`;
  window.location.href = url;
}

if(document.getElementById("produto")){
  const urlParams = new URLSearchParams(window.location.search);
  const nome = urlParams.get("nome");
  const img = urlParams.get("img");

  const container = document.getElementById("produto");
  container.innerHTML = `
    <div class="camisa" style="max-width:400px;margin:auto;">
      <img src="${img}" alt="${nome}" style="width:100%;height:auto;">
      <h2>${nome}</h2>
      <p>Camisa tailandesa</p>
      <p><b>A partir de R$160</b></p>
      <button onclick="adicionarCarrinho('${nome}','${img}')">Adicionar ao carrinho</button>
      <button onclick="enviarWhats('${nome}','${img}')">Comprar no WhatsApp</button>
    </div>
  `;
}