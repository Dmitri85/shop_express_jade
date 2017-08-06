(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9&appId=1954833771426658";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// $('input').rating({
//   filled: 'glyphicon glyphicon-heart',
//   empty: 'glyphicon glyphicon-heart-empty'
// })


var cart = [];
var isloged = false;
var user =''; 

/**
 * update badge on header
 */
$(document).ready(updateQtyOnHeader);

function updateQtyOnHeader() {
    var sum = 0;
    setTimeout(function () {
        for (var i = 0; i < cart.length; i++) {
            sum += parseInt(cart[i].qty);
        }
        $('#badge-qty').html(sum);
    }, 20);

    $.post('/isLogged', function(data){
        if(data.log === true){
            $('.logEnter').html('Hello ' + data.name);
                user = data.name;
                isloged = true;
        }
    });
}

$("form").on('submit',function(e){
    e.preventDefault();
});

$(".btnSigninMy").on('click',function(e){
    e.preventDefault();
});

var userName = $('#userid');
var pass = $('#passwordinput');
$(document).on('click', '.btnSigninMy', checkLog);

function checkLog(ev) {
    if (ev.currentTarget.id == 'confirmsignup') {
        $.get('/registerNewUser', { userName: userNameUp.val(), pass: passUp.val() }, function (data) {
            setTimeout(function(){
                $.post('/user_login', { 'userName': userNameUp.val(), 'password': passUp.val() }, function (data) {
                    if (data.log === true) {
                        isloged = true;
                        user = userName.val();
                        $('.logEnter').html('Hello ' + userNameUp.val());
                        // alert('loged');
                    } else {
                        alert('mistake');
                    }
                });
            },100);
        });

    }else{
        $.post('/user_login', { 'userName': userName.val(), 'password': pass.val() }, function (data) {
            if (data.log === true) {
                isloged = true;
                user = userName.val();
                $('.logEnter').html('Hello ' + userName.val());
                // alert('loged');
            } else {
                alert('mistake');
            }
        });
    }
}
/**
 * sign up
 */
$("#confirmsignup").on('click',function(e){
    e.preventDefault();
});

var userNameUp = $('#useridUp');
var passUp = $('#passwordUp');
$(document).on('click', '#confirmsignup', checkLog);

/**
 * bring cart to client on load
 */
$.get('/askCart',{login: isloged, user:user}, function (data) {
    var parsedData = JSON.parse(data);
    cart = parsedData;
});
/**
 * check if product already exists on cart
 */
function ifExistsOnCart(product) {
    if (cart.length > 0) {
        for (var i = 0; i < cart.length; i++) {
            if (cart[i].id == product.id) {
                return i;
            }
        }
        return false;
    } else {
        return false;
    }
}
/**
 * click to add on the main page 
 */
$(document).on('click', '.add-btn', function (ev) {
    var elem = ev.currentTarget;
    var path = $(elem).parent().find('.product-url').val();
    $.get('/get_data', { path: path, login: isloged, user:user}, function (data) {
        var product = data;
        addNewProductToCartObjByDefault(product);
    });
});
function addNewProductToCartObjByDefault(product) {
    var detailsToAppend = {
        // cockieId: product.cockieId,
        id: product.id,
        img: product.image,
        name: product.name,
        qty: 1,
        price: product.price,
        opt1: product.options.size[1],
        opt2: product.options.color[1]
    };
    if (ifExistsOnCart(detailsToAppend) === false) {
        cart.push(detailsToAppend);
    } else {
        var parsedQtyFromCartAddedWith = parseInt(cart[ifExistsOnCart(detailsToAppend)].qty) + parseInt(detailsToAppend.qty);
        cart[ifExistsOnCart(detailsToAppend)].qty = parsedQtyFromCartAddedWith;
    }
    $.get('/cartToServer', { cart: cart ,login: isloged, user:user}, function (data) {
        updateQtyOnHeader();
    });
}
/**
 * click to add on the single page 
 */
$(document).on('click', '.btn-add-single-page', function (ev) {
    var elem = ev.currentTarget;
    var path = elem.baseURI;
    var splited = path.split('/');
    var cleanPath = '/' + splited[3] + '/' + splited[4] + '/' + splited[5] + '/' + splited[6];
    var opt1 = $('.opt div:first input').val();
    var opt2 = $('.opt .color input').val();
    $.get('/get_data', { path: cleanPath, login: isloged, user:user }, function (data) {
        var product = data;
        addNewProductToCartObjByselections(product);
    });
});
function addNewProductToCartObjByselections(product) {
    var detailsToAppend = {
        id: product.id,
        img: product.image,
        name: product.name,
        qty: $('.qty-select select').val(),
        price: product.price,
        opt1: $('.opt .size input').val(),
        opt2: $('.opt .color input').val()
    };
    if (ifExistsOnCart(detailsToAppend) === false) {
        cart.push(detailsToAppend);
    } else {
        var parsedQtyFromCartAddedWith = parseInt(cart[ifExistsOnCart(detailsToAppend)].qty) + parseInt(detailsToAppend.qty);
        cart[ifExistsOnCart(detailsToAppend)].qty = parsedQtyFromCartAddedWith;
    }
    $.get('/cartToServer', { cart: cart , login: isloged, user:user}, function (data) {
        updateQtyOnHeader();
    });
}
/**
 * option section selector
 */
$('.option-section').on('click', '.opt-opt', function (ev) {
    var elem = ev.currentTarget;
    $(elem).toggleClass("selected-opt");
    var input = $(elem).parent().children('input');
    $(input).val($(elem).html());
});
/**
 * check path to sum on cart load
 */
var windowLoc = $(location).attr('pathname');
if (windowLoc === '/cart') {
    runSumming();
}
/**
 * summing the line at single product
 */
function sumQtySinglePruduct() {
    var val = parseInt($(this).children('select').val());
    var price = parseInt($(this).next().html());
    $(this).next().next().val(val * price);

}
$('.single-bottom').on('change', '.qty-select', sumQtySinglePruduct);
/**
 * summing the cart
 */
$(document).on('change', '.cart-product-qty > input', runSumming);
$(document).on('change', '.cart-product-qty > input', updateCartAfterQty);
function updateCartAfterQty(ev) {
    var elem = ev.currentTarget;
    var val = parseInt($(elem).val());
    var productId = $(elem).parent().parent().children('input:first-child').val();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == productId) {
            cart[i].qty = val;
            $.get('/cartToServer', { cart: cart , login: isloged, user:user}, function (data) {
                updateQtyOnHeader();
            });
            break;
        }
    }
}
function runSumming() {
    var line = $('.cart-product-line');
    var mainSum = 0;
    for (var i = 0; i < line.length; i++) {
        var currentLine = $(line)[i];
        var subTotal = $(currentLine).children('.cart-product-sub');
        $(subTotal).html(sumSubTotal(currentLine));
        mainSum += parseInt(subTotal.html());
    }
    updateQtyOnHeader();
    var mainTotal = $('.main-total').html(mainSum);
}
function sumSubTotal(line) {
    var price = $(line).children('.cart-product-price').html();
    var qty = $(line).children('.cart-product-qty').children('input').val();
    var subTotal = price * qty;
    return subTotal;
}
/**
 * removeproduct
 */
$(document).on('click', '.btn-remove', removeProduct);
function removeProduct(ev) {
    elem = ev.currentTarget;
    var productId = $(elem).parent().parent().children('input:first-child').val();
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].id == productId) {
            cart.splice(i, 1);
            $.get('/cartToServer', { cart: cart ,login: isloged, user:user}, function (data) {
                updateQtyOnHeader();
            });
            break;
        }
    }
    $(elem).parent().parent().remove();
}

