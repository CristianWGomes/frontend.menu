$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {};

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

}

cardapio.templates = {

    item: `
        <div class="col-3 mb-5">
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
                    <span class="btn-menos"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens">0</span>
                    <span class="btn-mais"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add"><i class="fas fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>    
    `
}