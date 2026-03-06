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

function adicionarCarrinho(nome){

carrinho.push(nome)

salvarCarrinho()

atualizarCarrinho()

}

function atualizarCarrinho(){

let lista = document.getElementById("listaCarrinho")

if(!lista) return

lista.innerHTML=""

carrinho.forEach(item=>{

let li = document.createElement("li")

li.innerText=item

lista.appendChild(li)

})

}

function comprarCarrinho(){
  if(carrinho.length === 0){
    alert("Seu carrinho está vazio");
    return;
  }
  
  let linkCamisa = window.location.href;
  
  let itensComLink = carrinho.map(item => `${item} (Link: ${linkCamisa})`);
  
  let msg = `Olá! Quero comprar as seguintes camisas: ${itensComLink.join(", ")}`;
  
  let url = `https://wa.me/${numeroVendedor}?text=${encodeURIComponent(msg)}`;
  
  window.open(url);
}

function enviarWhats(nome){
  let linkCamisa = window.location.href;
  
  let msg = `Olá! Tenho interesse na camisa ${nome}. Link: ${linkCamisa}`;
  
  let url = `https://wa.me/${numeroVendedor}?text=${encodeURIComponent(msg)}`;
  
  window.open(url);
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

<img src="${camisa.img}">

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