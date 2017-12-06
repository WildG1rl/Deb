var listaDeCompras = new Array();


this.User = function(e,n,s){
  this.email = e;
  this.nome = n;
  this.senha = s;
}

function errorMsg(m, local){
  var msg = $('<strong></strong>').text("Erro!");
  var x = $('<span aria-hidden="true"></span>').html("&times;");
  var button = $('<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>').html(x);
  var node = $('<div class="alert alert-danger alert-dismissible" role="alert"></div>').html(button);

  $(button).append(x);
  $(node).append(button);
  $(node).append(msg);
  $(msg).after("  "+m);

  $(local).prepend(node);
  setTimeout(function(){
    $(node).remove();
  }, 2000);
}

function successMsg(m, local){
  var msg = $('<strong></strong>').text("Sucesso!");
  var x = $('<span aria-hidden="true"></span>').html("&times;");
  var button = $('<button type="button" class="close" data-dismiss="alert" aria-label="Close"></button>').html(x);
  var node = $('<div class="alert alert-success alert-dismissible" role="alert"></div>').html(button);

  $(button).append(x);
  $(node).append(button);
  $(node).append(msg);
  $(msg).after("  "+m);

  $(local).prepend(node);
  setTimeout(function(){
    $(node).remove();
  }, 2000);
}

function limparCampos(){
  var e = $("#InputEmail-01").val("");
  var n = $("#InputName-01").val("");
  var s = $("#InputPassword-01").val("");

  setTimeout(function(){
    $(".dropdown").removeClass("open");
    var n = $("#InputName-02").val("");
    var s = $("#InputPassword-02").val("");
  }, 2000);

}

function criarUsuario(){

  var e = $("#InputEmail-01").val();
  var n = $("#InputName-01").val();
  var s = $("#InputPassword-01").val();

  if(e != null && e!= "" && n != null && n!= "" && s != null && s!= ""){
    var user = new User(e, n, s);
    cadastrarUsuario(user);
  }
  else{
    errorMsg("Há campos vazios", "#formCadastrar");
  }
  return user;
}

function cadastrarUsuario(user){
  $.ajax({
    type: 'GET',
    url: 'http://rest.learncode.academy/api/debs/loja',
    success: function(data) {
      var existe = false;
      for(var i = 0; i < data.length;i++){
          if(data[i].nome == user.nome){
            existe = true;
          }
      }

      if(existe == false){
        $.ajax({
          type: 'POST',
          url: 'http://rest.learncode.academy/api/debs/loja',
          data: user,  success: function(data) {
            console.log("Usuario cadastrado com sucesso!", data); //the new item is returned with an ID
          }
        });
        successMsg("Cadastro efetuado", "#formCadastrar");
        limparCampos();
      }
      else{
        errorMsg("Nome de usuário já cadastrado", "#formCadastrar");
      }
    }
  });
}

function isLoged(){
  if(sessionStorage.getItem("logado") == "true"){
    $("#cadastrar, #entrar").fadeOut(0, function(){
      $("#carrinho, #exit").fadeIn(0);
      $(".qtd .form-control, .qtd .myButton").removeAttr("disabled");
    });
  }
  else{
    $("#carrinho, #exit").fadeOut(0, function(){
      $("#cadastrar, #entrar").fadeIn(0);
      $(".qtd .form-control, .qtd .myButton").attr("disabled", "true");
    });
  }
}

function logar(){

  var n = $("#InputName-02").val();
  var s = $("#InputPassword-02").val();
  var user = new User("default@email.com", n, s);

  $.ajax({
    type: 'GET',
    url: 'http://rest.learncode.academy/api/debs/loja',
    success: function(data) {
      var existe = false;
      var id = null;
      for(var i = 0; i < data.length;i++){
          if(data[i].nome == user.nome && data[i].senha == user.senha){
            id = data[i].id
            existe = true;
          }
      }
      if(existe == false){
        errorMsg("Usuário e senha incorretos", "#formEntrar");
      }
      else{
        limparCampos();
        sessionStorage.setItem("logado", "true");
        sessionStorage.setItem("user", id );
        sessionStorage.setItem("compras", "vazio");
        location.reload(true);
        isLoged();
      }
    }
  });
}

function sair(){
  sessionStorage.logado = "false";
  sessionStorage.compras ="vazio";
  isLoged();
}

function showInCart(){

  if(sessionStorage.compras != "vazio"){

    var temp = JSON.parse(sessionStorage.compras);
    $("#empety_cart").hide(0);

    for(var i = 0; i< temp.length; i++){

      var node = $('<li href="#" class="list-group-item item"></li>').html("");
      var div_1 = $('<div class="media-left"></div>').html("");
      var img = $('<img class="media-object" src="../'+temp[i].img+'" alt="...">').html("");
      var div_2 = $('<div class="media-body"></div>').html("");
      var h4_1 = $('<h4 class="list-group-item-heading"></h4>').text(temp[i].nome);
      var span = $('<span class="badge pull-right"></span>').text(temp[i].qtd);
      var p = $('<p class="list-group-item-text"></p>').text(temp[i].descri);
      var h4_2 = $('<h4 class="price"></h4>').text("Valor Total: R$ "+temp[i].preco);

      $(node).append(div_1);
      $(div_1).append(img);
      $(node).append(div_2);
      $(div_2).append(h4_1);
      $(h4_1).append(span);
      $(div_2).append(p);
      $(div_2).append(h4_2);

      $(".list-group.carrinho").prepend(node);

      valorTotal();
      showHistorico();

    }
  }
}

function RestoreToCart(){

  if(sessionStorage.compras != "vazio"){

    var produto = JSON.parse(sessionStorage.compras);
    $(".empety_cart").hide(0);

    for(var i = 0; i< produto.length; i++){

      var node = $('<li></li>').text(produto[i].nome);
      var span = $('<span class="badge pull-right"></span>').text(produto[i].qtd);

      $(node).append(span);

      $(".dropdown-menu.myList").prepend(node);

      $("#finalizar").removeAttr("disabled");

    }
    $("#num_produtos").text(produto.length);

    $("#num_produtos").css("display","inline-block");
  }

}

function addToCart(produto){

  var node = $('<li></li>').text(produto.nome);
  var span = $('<span class="badge pull-right"></span>').text(produto.qtd);

  $(node).append(span);

  $(".empety_cart").hide(0);

  $("#finalizar").removeAttr("disabled");

  $(".dropdown-menu.myList").prepend(node);

  var qtd = parseInt($("#num_produtos").text());

  $("#num_produtos").text(qtd+1);

  $("#num_produtos").css("display","inline-block");

}

function valorTotal(){
    var produtos = JSON.parse(sessionStorage.compras);
    var total = 0.0;


    for(var i = 0; i< produtos.length; i++){
      total += parseFloat(produtos[i].preco * parseInt(produtos[i].qtd));
    }

    $(".total h5 strong").text(total);
}

function finalizarCompra(){
  function data(){
    var d = new Date();
    var dia = d.getDate();
    var mes = 1+d.getMonth();
    if(dia < 10){dia = "0"+dia;}
    if(mes < 10){mes = "0"+mes;}

    var meses = {}
    meses["01"] = "Janeiro";meses["02"] = "Fevereiro";meses["03"] = "Março";meses["04"] = "Abril";meses["05"] = "Maio";meses["06"] = "Junho";
    meses["07"] = "Julho";meses["08"] = "Agosto";meses["09"] = "Setembro";meses["10"] = "Outubro";meses["11"] = "Novembro";meses["12"] = "Dezembro";

    var dataHoje = dia+" de "+meses[mes]+" de "+d.getFullYear();
    return dataHoje;
  }

  function hora(){
      var d = new Date();
      var hora = d.getHours();
      var min = d.getMinutes();
      if(hora < 10){hora = "0"+hora;}
      if(min < 10){min = "0"+min;}
      var hora = hora+":"+min;
      return hora;
  }

  var compra = {data:"", hora:"", valor:""}

  compra.data = data();
  compra.hora = hora();
  compra.valor = $(".total h5 strong").text();
  compra.ID = sessionStorage.user;

  console.log(compra);

  $.ajax({
    type: 'POST',
    url: 'http://rest.learncode.academy/api/debs/historico',
    data: compra,  success: function(data) {
      console.log("Compra efetuada com sucesso!", data);
      sessionStorage.compras ="vazio";
      $(".carrinho").empty();
      $(".carrinho").html('<div id="empety_cart" class="panel-body vazio">  O carrinho está vazio! :(</div>');
      successMsg("Compra realizada, parabens.",".carrinho");
      $(".total h5 strong").text("00.00");
    }
  });
  showHistorico();
}

function showHistorico(){
    var ID = sessionStorage.user;
    console.log(ID);

    $.ajax({
      type: 'GET',
      url: 'http://rest.learncode.academy/api/debs/historico',
      success: function(data) {
        $(".historico").empty();
        for(var i = 0; i< data.length; i++){
          if(data[i].ID == ID){

            var node = $('<li href="#" class="list-group-item item"></li>').html("");
            var h4_1 = $('<h4 class="list-group-item-heading"></h4>').text(data[i].data);
            var p = $('<p class="list-group-item-text"></p>').text(data[i].hora);
            var h4 = $('<h4 class="price"></h4>').text("Valor Total: R$ "+data[i].valor);

            $(node).append(h4_1);
            $(node).append(p);
            $(node).append(h4);

            $(".list-group.historico").prepend(node);
          }
        }
      }
    });

}

 $(document).ready(function(){
   isLoged();

  $("button.cadastrar").click(function(){
    user = criarUsuario();
  });

  $("button.entrar").click(function(){
    logar();
  });

  $("#exit").click(function(){
    sair();
  });

  $(".qtd .myButton").click(function(){

    var produto = {img:"", nome:"", descri:"", preco:"", qtd:""}

    produto.img = $(this).parents("div.thumbnail").find("img").attr('src');
    produto.nome = $(this).parents("div.thumbnail").find("h4.nome").text();
    produto.descri = $(this).parents("div.thumbnail").find("p").text();
    produto.preco = $(this).parents("div.thumbnail").find("h4.price strong").text();
    produto.qtd = $(this).parents("div.thumbnail").find("select").val();

    if(sessionStorage.compras != "vazio"){
      listaDeCompras = JSON.parse(sessionStorage.compras);
    }
    else{console.log(sessionStorage.compras)}

    listaDeCompras.push(produto);

    listaDeCompras = JSON.stringify(listaDeCompras);

    sessionStorage.compras = listaDeCompras;

    addToCart(produto);
  });

  $("#finalizarCompra").click(function(){
    var total = parseFloat($(".total h5 strong").text())
    if(total > 0.0){
      finalizarCompra();
    }
  });

});
