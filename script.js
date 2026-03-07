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

function adicionarCarrinho(nome, img){
  let produtoLink = `https://seusite.netlify.app/produto.html?nome=${encodeURIComponent(nome)}&img=${encodeURIComponent(img)}`;

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
    lista.appendChild(li);
  });
}

function comprarCarrinho(){
if(carrinho.length===0){
  alert("Seu carrinho está vazio");
  return;
}

let itens = carrinho.map(item => `${item.nome}: ${item.link}`).join("\n");

let msg = `Olá! Quero comprar:\n${itens}`;

let url = `https://wa.me/${numeroVendedor}?text=${encodeURIComponent(msg)}`;
window.open(url);
}

function removerCarrinho(index){
  carrinho.splice(index,1);
  salvarCarrinho();
  atualizarCarrinho();
}

function enviarWhats(nome){
  let link=window.location.href
  let msg=`Olá! Tenho interesse na camisa ${nome}. Link: ${link}`
  let url=`https://wa.me/${numeroVendedor}?text=${encodeURIComponent(msg)}`
  window.open(url)
}

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

{
nome:time+" Home",
img:"imagens/"+timeImg+"-home.jpg"
},

{
nome:time+" Away",
img:"imagens/"+timeImg+"-away.jpg"
},

{
nome:time+" Third",
img:"imagens/"+timeImg+"-third.jpg"
},

{
nome:time+" Retrô",
img:"imagens/"+timeImg+"-retro.jpg"
}

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

<button onclick="adicionarCarrinho('${camisa.nome}')">
Adicionar ao carrinho
</button>

<button onclick="enviarWhats('${camisa.nome}')">
Comprar no WhatsApp
</button>

`

container.appendChild(div)

})

}

const pesquisa=document.getElementById("pesquisa")

if(pesquisa){

pesquisa.addEventListener("keyup",function(){

let filtro=pesquisa.value.toLowerCase()

let times=document.querySelectorAll(".card")

times.forEach(function(time){

let nome=time.textContent.toLowerCase()

if(nome.includes(filtro)){

time.style.display="block"

}else{

time.style.display="none"

}

})

})

}

atualizarCarrinho()

function verProdutoDetalhes(nome, img){
  localStorage.setItem("produtoDetalheNome", nome)
  localStorage.setItem("produtoDetalheImg", img)
  window.location.href = "produto.html"
}

function voltarProduto(){
  window.history.back()
}

function adicionarProduto(){
  let nome = localStorage.getItem("produtoDetalheNome")
  adicionarCarrinho(nome)
  alert("Produto adicionado ao carrinho!")
}

function comprarProduto(){
  let nome = localStorage.getItem("produtoDetalheNome")
  let msg = `Olá! Tenho interesse na camisa ${nome}`
  let url = `https://wa.me/${numeroVendedor}?text=${encodeURIComponent(msg)}`
  window.open(url)
}

if(document.getElementById("nomeProduto")){

  let nome = localStorage.getItem("produtoDetalheNome")
  let img = localStorage.getItem("produtoDetalheImg")

  document.getElementById("nomeProduto").innerText = nome
  document.getElementById("imgProduto").src = img

}

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
      <button onclick="adicionarCarrinho('${nome}')">Adicionar ao carrinho</button>
      <button onclick="enviarWhats('${nome}')">Comprar no WhatsApp</button>
    </div>
  `;
}