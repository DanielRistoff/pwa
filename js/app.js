var whatsapp_cliente = "41992137874";

//Carregar dados dinâmicos
var ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

ajax.onreadystatechange = function(){

    var content = document.getElementById('content');

    if(ajax.readyState == 4 && ajax.status == 200){

        var data = ajax.responseText;

        var data_json = JSON.parse(data);


        //Não tem produtos
        if(data_json.length == 0){

            content.innerHTML = '<div class="col-12"><div class="alert alert-warning" role="alert">Ainda não temos produtos cadastrados</div></div>';
        
        //Tem produtos
        }else{

            var html_content = "";
            
            html_content += '<div style="margin-top: 10px;">';

            for(var i=0; i<data_json.length;i++){

                if(data_json[i].itens.length == 0){

                    html_content += '<div class="col-12"><div class="alert alert-warning" role="alert">Não há produtos cadastrados</div></div>';

                }else{

                    for(var j=0; j<data_json[i].itens.length; j++){

                        html_content += card_produto(data_json[i].itens[j].nome,data_json[i].itens[j].imagem,data_json[i].itens[j].descricao,data_json[i].itens[j].preco);

                    }
                }

            }

            html_content += '</div>';
            html_content +=
           '<div style="text-align: center;" >'+
                '<br />'+
                '<button type="button" class="btn btn-success" onClick="javascript:chamarWhats()">Chama no Whatsapp!</button>'+
           '</div>';

            content.innerHTML = html_content;
            cache_dinamico(data_json);

        }
    //Erro no processamento
    }else{
        content.innerHTML = '<div class="col-12"><div class="alert alert-danger" role="alert">Ops! Erro ao processar sua solicitação</div></div>';
    }

}

//Template card
var card_produto = function(nome, imagem, descricao, preco){

    return '  <div class="col-12">'+
           '    <div class="card" style="border-bottom: 1px rgb(255, 255, 255);">'+
           '      <div class="card-body" style="background-color: #000000; margin-top: 3px;">'+
           '        <img src="'+imagem+'" class="card-img-top" alt="Hamburguer">'+
           '        <div class="row">'+
           '          <div class="col-9">'+
           '            <h5 class="card_titulo" style="color: #ffca2c;">'+
           '              <b>'+nome+'</b>'+
           '            </h5>'+
           '          </div>'+
           '          <div class="col-3" style="display: flex; justify-content: right;">'+
           '            <div style="width: 70px; height: 75%; background-color: white; text-align: center; border-radius: 10px; margin-top: 3px;">'+
           '              <h5 class="card-price">'+preco+'</h5>'+
           '            </div>'+
           '          </div>'+
           '        </div>'+
           '        <p class="card-text" style="color: white;">'+descricao+'</p>'+
           '      </div>'+
           '    </div>'+
           '  </div>';
}

//Construir cache dinâmico

var cache_dinamico = function(data_json){

    if('caches' in window){

        console.log("Deletando cache dinâmico antigo...");
        caches.delete('ristoff-app-v1-dinamico').then(function(){

            if(data_json.length >0){

                var files = ['dados.json'];

                for(var i=0; i<data_json.length;i++){
    
                    for(var j=0; j<data_json[i].itens.length; j++){
                        
                        if(files.indexOf(data_json[i].itens[j].imagem) == -1){
                            files.push(data_json[i].itens[j].imagem);
                        }
                    }
                }
    
            }

            caches.open('ristoff-app-v1-dinamico').then(function (cache){

                cache.addAll(files).then(function(){
                    console.log("Novo cache dinâmico adicionado");
                });

            })

        });

    }

}

//Experiencia de Instalação

let disparoInstalacao = null;
const btInstall = document.getElementById("btInstall");

let inicializarInstalacao = function(){

    btInstall.removeAttribute("hidden");
    btInstall.addEventListener('click', function(){

        disparoInstalacao.prompt();

        disparoInstalacao.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário fez a instalação");
            }else{
                console.log("Usuário não fez a instalação");
            }

        });

    });

}

window.addEventListener('beforeinstallprompt', gravarDisparo);

function gravarDisparo(evt){
    disparoInstalacao = evt;
}

chamarWhats = function(){
    const fazerPedido = 'Olá, gostaria de fazer um pedido!!!'
    enviarWhatsApp(fazerPedido)
}

function enviarWhatsApp(mensagem){
    
    var celular = whatsapp_cliente;
  
    if(celular.length < 13){
        celular = "55" + celular;
    }
  
    var texto = mensagem;
    texto = window.encodeURIComponent(texto);
    
    let urlApi = "https://api.whatsapp.com/send";
    
    window.open(urlApi + "?phone=" + celular + "&text=" + texto, "_self");
}