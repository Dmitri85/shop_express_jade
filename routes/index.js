var express = require('express');
var router = express.Router();
var products = require("../model/products_loop");
var fs = require('fs');

// var mainCategories = products.mainCategoriesNames();
// var mainCategories = products.subCategoriesNames('men');
var categories = products.categoriesObjCreate();

var defaultToLoad = [];
var main;
var sub;

for(var mainCat in categories){
  main = mainCat;
  sub = categories[mainCat];
  for(var inner in categories[mainCat]){
    for(var i=0; i<3; i++){
      defaultToLoad.push(categories[mainCat][inner][i]);
    }
  }
}


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index',{toLoad: defaultToLoad, cat: categories });
});


router.get('/:mainCal/:subcat', function(req, res){
  var main = req.params.mainCal;
  var sub = req.params.subcat;
  var toload = categories[main][sub];
  res.render('index',{toLoad: toload, cat: categories });
  
});



module.exports = router;
