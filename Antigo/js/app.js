$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

var MEU_CARRINHO = [];

cardapio.eventos = {
    init: () => {
       cardapio.metodos.obterItensCardapio();
    }
}

cardapio.metodos = {

    //Obtem a lista de itens do cardápio
    obterItensCardapio: (categoria ='burgers', vermais = false)=> {
        
        var filtro = MENU[categoria];
        console.log(filtro)

        if(!vermais) {
            $("#itensCardapio").html('') //Para limpar o cardápio antes de chamar
            $("#btnVerMais").removeClass('hidden');
        }

        $.each(filtro, (i, e) => {

            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${nome}/g, e.name)   //toFixed(2) para colocar duas casas decimais e replace para trocar . por ,
            .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)

            //botão ver mais foi clicado (12 itens)
            if (vermais && i >= 8 && i < 12) {
                $("#itensCardapio").append(temp)
            }

            //Paginação inicial (8 itens)
            if (!vermais && i < 8){
                $("#itensCardapio").append(temp)
            }
             
        })

        // Remove o ativo dos botões 
        $(".container-menu a").removeClass('active');
        
        // Seta o botão para ativo 
        $("#menu-" + categoria).addClass('active')
    },

    // Clique no botão de ver mais
    verMais: () => {
        var ativo = $(".container-menu a.active").attr('id').split('menu-')[1];  // posição 0 [menu-] posição 1 [burgers]
        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass('hidden');
    },

    //Diminuir a quantidade do item do cardápio
    diminuirQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text()); //parseInt(); para converter texto em int

        if (qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }
    },

    //Aumentar a quantidade do item do cardápio
    aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text()); //parseInt(); para converter texto em int
        $("#qntd-" + id).text(qntdAtual + 1)

    },

    //Adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {
            // obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];      
            
            //obtem a lista de itens
            let filtro = MENU[categoria];

            //obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {

                // Validar se já existe esse item no carrinho 
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id});

                // Caso já existe, só altera a quantidade 
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                    alert('Entrou no IF');
                }
                //Caso ainda não exista o item no carrinho, adiciona ele 
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                    alert('Não Entrou no IF');
                }

                
                $("#qntd-" + id).text(0);
                
            }
    
        }
    },

}

cardapio.templates = {

    item: `
        <div class="col-3 mb-5">
            <div class="card card-item" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}"/>
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${preco}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>    
    `
}