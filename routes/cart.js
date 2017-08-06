
var express = require('express');
var router = express.Router();
var products = require("../model/products_loop");
var readCart = require("../model/read_cart");
var fs = require("fs");
// var mainCategories = products.mainCategoriesNames();
// var mainCategories = products.subCategoriesNames('men');
var categories = products.categoriesObjCreate();
var cart = [];
var isLoged = false;
var user = '';

// router.get('/logginCheck', function(req, res){

// });


router.get('/get_data', function (req, res) {
  var path = req.query.path;
  var splited = path.split('/');
  var main = splited[2];
  var sub = splited[3];
  var id = splited[4];
  var toload = categories[main][sub];
  var product;
  for (var i = 0; i < toload.length; i++) {
    if (toload[i].id == id) {
      product = toload[i];
      // product.cockieId = req.sessionID;
      break;
    }
  }
  res.send(product);
});
router.get('/cartToServer', function (req, res) {
  var fileContent;
  if (req.session.userName) {
    fs.open('./data/usesrs_carts/' + req.session.userName + '.json', 'wx+', function (err, fd) {
    });
    cart[req.session.userName] = req.query.cart;
    fileContent = JSON.stringify(cart[req.session.userName]);
    fs.writeFile('./data/usesrs_carts/' + req.session.userName + '.json', fileContent, function (err) {
      if (err) {
        throw err;
      }
    });
  } else {
    cart[req.cookies.cookieName] = req.query.cart;
    fileContent = JSON.stringify(cart[req.cookies.cookieName]);
    fs.writeFile('./data/usesrs_carts/' + req.cookies.cookieName + '.json', fileContent, function (err) {
      if (err) {
        throw err;
      }
    });
  }
  res.end();
});

router.get('/askCart', function (req, res) {
  var currentCart;
  if (req.session.userName) {
    fs.open('./data/usesrs_carts/' + req.session.userName + '.json', 'wx+', function (err, fd) {
    });
    currentCart = readCart.askForCart(req.session.userName);
    res.send(currentCart);
  } else {
    currentCart = readCart.askForCart(req.cookies.cookieName);
    res.send(currentCart);
  }
});

router.get('/cart', function (req, res) {
  if (req.session.userName) {
    fs.open('./data/usesrs_carts/' + req.session.userName + '.json', 'wx+', function (err, fd) {
    });
    fs.readFile('./data/usesrs_carts/' + req.session.userName + '.json', 'utf8', function (err, data) {
      if (err) throw err;
      if (data) {
        cartFromFile = JSON.parse(data);
        res.render('cart', { cat: categories, cart: cartFromFile });
      } else {
        res.render('cart', { cat: categories });
      }
    });
  } else {
    fs.readFile('./data/usesrs_carts/' + req.cookies.cookieName + '.json', 'utf8', function (err, data) {
      if (err) throw err;
      if (data) {
        cartFromFile = JSON.parse(data);
        res.render('cart', { cat: categories, cart: cartFromFile });
      } else {
        res.render('cart', { cat: categories });
      }
    });
  }
});
module.exports = router;