var express = require('express');
var router = express.Router();
var products = require("../model/products_loop");

var categories = products.categoriesObjCreate();



router.get('/:mainCal/:subcat/:single_product', function(req, res){
    var main = req.params.mainCal;
    var sub = req.params.subcat;
    var id = req.params.single_product;
    var currentUrl = id+'/';

    var toload = categories[main][sub];
    var product;
    for(var i=0; i<toload.length; i++){
        if(toload[i].id == id){
            product = toload[i];
            break;
        }
    }
    res.render('single',{toLoad: product, cat: categories, currentUrl: currentUrl});

  
});


module.exports = router;
