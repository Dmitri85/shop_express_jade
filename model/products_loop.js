module.exports = (function () {
    var fs = require("fs");
    var data =fs.readFileSync("./data/products.json", "utf8");
    // var mainCategoriesArr = [];

    // function mainCategoriesNames() {
    //     var categories = [];
    //     fs.readFile("./data/products.json", "utf8", function (err, data) {
    //         if (err) {
    //             throw Error('did not find data');
    //         }
    //         var parsedData = JSON.parse(data);
    //         for (var mainCat in parsedData) {
    //             categories.push(mainCat);
    //         }

    //         return categories;
    //     });
    // }

    function mainCategoriesNames() {
        var categories = [];
        var parsedData = JSON.parse(data);
        for (var mainCat in parsedData) {
            categories.push(mainCat);
        }
        return categories;
    }

    // function subCategoriesNames(mainCat) {
    //     var categories = [];
    //     fs.readFile("./data/products.json", "utf8", function (err, data) {
    //         if (err) {
    //             throw Error('did not find data');
    //         }
    //         var parsedData = JSON.parse(data);
    //         var mainCategory = parsedData[mainCat];
    //         for (var subCat in mainCategory) {
    //             categories.push(subCat);
    //         }

    //         return categories;
    //     });
    // }

    function subCategoriesNames(mainCat) {
        var categories = {};
        var parsedData = JSON.parse(data);
        var mainCategory = parsedData[mainCat];
        for (var subCat in mainCategory) {
            // categories.push(subCat);
            categories[subCat]= mainCategory[subCat];
        }
        return categories;
    }

    function categoriesObjCreate() {
        var nestedCat = {};
        var mainCategories = mainCategoriesNames();
        for(var i=0; i < mainCategories.length; i++){
            nestedCat[mainCategories[i]] = subCategoriesNames(mainCategories[i]);
        }
        return nestedCat;
    }

    function returnPureData(){
        var parsedData = JSON.parse(data);
        return parsedData;
    }



    return {
        mainCategoriesNames: mainCategoriesNames,
        subCategoriesNames: subCategoriesNames,
        categoriesObjCreate: categoriesObjCreate,
        returnPureData: returnPureData
    };

})();