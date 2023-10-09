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

    //Para diminuir a quantidade dos itens do cardápio
    diminuirQuantidade: (id) => {

        //pegando a quantidade total do item selecionado
        let qntdAtual = parseInt($("#qntd-" + id).text());

        //Validação para não deixar o item virtar negativo (-1, -2...)
        if (qntdAtual > 0 ) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },
    
    //Para aumentar a quantidade dos itens do cardápio
    aumentarQuantidade: (id) => {
        
        let qntdAtual = parseInt($("#qntd-" + id).text());
        $("#qntd-" + id).text(qntdAtual + 1)
        
    
    },

    //adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            //obter a categoria ativa 
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            //obtem a lista de itens 
            let filtro = MENU[categoria];

             //obtem o item 
            let item = $.grep(filtro, (e, i) => {return e.id == id});

            if (item.length > 0) {

                // validar se já existe esse item no carrinho 
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id});

                // Caso já exista o item no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                // caso ainda não exista o item no carrinho, adiciona ele
                else { 
                    item[0].qntd = qntdAtual;
                    //push é para adicionar um valor no array 
                    MEU_CARRINHO.push(item[0])
                }

                cardapio.metodos.mensagem('item adicionado ao carrinho', 'green');
                $("#qntd-" + id).text(0)

                cardapio.metodos.atualizarBadgeTotal();
                
            }

        }

    },

    //atualiza o badge de totais dos botões "meu carrinho"
    atualizarBadgeTotal: () => {
        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })
        
        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }

        $(".badge-total-carrinho").html(total);


    },


    //abre a modal de carrinho
    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarEtapa(1);
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }
    },

    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="w3-center w3-animate-top toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);
        
        setTimeout(() => {
            $("#msg-" + id).remove();
        }, tempo)
    },

    // altera os textos e exibe os botões das etapas 
    carregarEtapa: (etapa) => {
        if (etapa == 1 ) {
            $("#lblTituloEtapa").text('Seu Carrinho:');
            $("#itensCarrinho").removeClass('hidden');7
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');
            
            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');

        }

        if (etapa == 2 ) {
            $("#lblTituloEtapa").text('Endereço de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');
            
            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#tbnEtapaPedido").addClass('hidden');
            $("#tbnEtapaEndereco").removeClass('hidden');
            $("#tbnEtapaResumo").addClass('hidden');
            $("#tbnEtapaVoltar").removeClass('hidden');

        }

        if (etapa == 3 ) {
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');
            
            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#tbnEtapaPedido").addClass('hidden');
            $("#tbnEtapaEndereco").addClass('hidden');
            $("#tbnEtapaResumo").removeClass('hidden');
            $("#tbnEtapaVoltar").removeClass('hidden');

        }
    },

    //Botão de voltar Etapa
    voltarEtapa: () => {
        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);
    },

}



cardapio.templates = {

    item: `
        <div class="col-3 mb-5" id="\${id}">
            <div class="card card-item">
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